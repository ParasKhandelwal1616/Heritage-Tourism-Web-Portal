import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import blogRoutes from './routes/blogRoutes';
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';
import siteRoutes from './routes/siteRoutes';
import Message from './models/Message';
import Poll from './models/Poll';
import SiteConfig from './models/SiteConfig';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Chat History Route
app.get('/api/chat/messages/:room', async (req: Request, res: Response) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room: room || 'staff' })
      .populate('sender', 'name image role')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(messages.reverse());
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Poll Routes
app.get('/api/polls/latest/:room', async (req: Request, res: Response) => {
  try {
    const { room } = req.params;
    const poll = await Poll.findOne({ isActive: true, room: room || 'staff' }).sort({ createdAt: -1 });
    res.json(poll);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Chat Config Route
app.get('/api/settings/chat-config', async (req: Request, res: Response) => {
  try {
    let config = await SiteConfig.findOne({ key: 'can_chat_student' });
    if (!config) {
      config = new SiteConfig({ key: 'can_chat_student', value: 'true' });
      await config.save();
    }
    res.json({ canChat: config.value === 'true' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', siteRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { senderId, content, room, role } = data;
      
      // Check if student chat is enabled
      if (room === 'student') {
        const config = await SiteConfig.findOne({ key: 'can_chat_student' });
        const canChat = config ? config.value === 'true' : true;
        if (!canChat && role === 'student') {
          return;
        }
      }

      const newMessage = new Message({
        sender: senderId,
        content: content,
        room: room || 'staff'
      });
      await newMessage.save();
      const populatedMessage = await newMessage.populate('sender', 'name image role');
      io.to(room || 'staff').emit('receive_message', populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('create_poll', async (data) => {
    try {
      const { question, options, createdBy, room } = data;
      // Deactivate previous polls in this room
      await Poll.updateMany({ isActive: true, room: room || 'staff' }, { isActive: false });

      const newPoll = new Poll({
        question,
        options: options.map((opt: string) => ({ text: opt, votes: [] })),
        createdBy,
        room: room || 'staff'
      });
      await newPoll.save();
      io.to(room || 'staff').emit('poll_created', newPoll);
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  });

  socket.on('vote_poll', async (data) => {
    try {
      const { pollId, optionIndex, userId, room } = data;
      const poll = await Poll.findById(pollId);
      if (!poll) return;

      // Remove existing votes from this user in this poll
      poll.options.forEach((opt) => {
        opt.votes = opt.votes.filter((v) => v.toString() !== userId);
      });

      // Add new vote
      poll.options[optionIndex].votes.push(userId as any);
      await poll.save();

      io.to(room || 'staff').emit('poll_updated', poll);
    } catch (error) {
      console.error('Error voting on poll:', error);
    }
  });

  socket.on('toggle_chat', async (data) => {
    try {
      const { canChat, room } = data;
      if (room !== 'student') return; // Only toggle student chat

      await SiteConfig.findOneAndUpdate(
        { key: 'can_chat_student' },
        { value: canChat.toString() },
        { upsert: true }
      );
      io.to('student').emit('chat_config_updated', { canChat });
    } catch (error) {
      console.error('Error toggling chat:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'API is running' });
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
