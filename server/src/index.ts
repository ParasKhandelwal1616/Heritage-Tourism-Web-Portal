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
app.get('/api/chat/messages', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name image role')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(messages.reverse());
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

  socket.on('send_message', async (data) => {
    try {
      const newMessage = new Message({
        sender: data.senderId,
        content: data.content,
      });
      await newMessage.save();
      const populatedMessage = await newMessage.populate('sender', 'name image role');
      io.emit('receive_message', populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
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
