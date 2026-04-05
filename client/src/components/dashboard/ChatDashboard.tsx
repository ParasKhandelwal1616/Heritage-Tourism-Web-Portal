'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageSquare, BarChart2, Plus, X, Lock, Unlock } from 'lucide-react';
import { IPoll } from '@/types/poll';

interface IMessage {
  _id: string;
  sender: {
    _id: string;
    name: string;
    image?: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

interface ChatDashboardProps {
  room: 'staff' | 'student';
  title?: string;
}

export default function ChatDashboard({ room, title }: ChatDashboardProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [poll, setPoll] = useState<IPoll | null>(null);
  const [canChat, setCanChat] = useState(true);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const scrollRef = useRef<HTMLDivElement>(null);

  const role = (session?.user?.role || 'STUDENT').toUpperCase();
  const isManager = role === 'MANAGER' || role === 'ADMIN';
  const isMember = role === 'MEMBER';

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const newSocket = io(apiUrl);
    setSocket(newSocket);

    // Join the specific room
    newSocket.emit('join_room', room);

    // Initial Data
    fetch(`${apiUrl}/api/chat/messages/${room}`)
      .then(res => res.json())
      .then(data => setMessages(data));

    fetch(`${apiUrl}/api/polls/latest/${room}`)
      .then(res => res.json())
      .then(data => setPoll(data));

    if (room === 'student') {
      fetch(`${apiUrl}/api/settings/chat-config`)
        .then(res => res.json())
        .then(data => setCanChat(data.canChat));
    }

    // Socket Listeners
    newSocket.on('receive_message', (msg: IMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('poll_created', (newPoll: IPoll) => {
      setPoll(newPoll);
      setShowPollCreator(false);
    });

    newSocket.on('poll_updated', (updatedPoll: IPoll) => {
      setPoll(updatedPoll);
    });

    if (room === 'student') {
      newSocket.on('chat_config_updated', (data: { canChat: boolean }) => {
        setCanChat(data.canChat);
      });
    }

    return () => { newSocket.close(); };
  }, [room]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !session?.user) return;
    
    // Only students are restricted in student room
    if (room === 'student' && !canChat && role === 'STUDENT') return;

    socket.emit('send_message', {
      senderId: session.user.id,
      content: newMessage,
      role: role.toLowerCase(),
      room
    });
    setNewMessage('');
  };

  const handleVote = (optionIndex: number) => {
    if (!socket || !session?.user || !poll) return;
    socket.emit('vote_poll', {
      pollId: poll._id,
      optionIndex,
      userId: session.user.id,
      room
    });
  };

  const handleCreatePoll = () => {
    if (!socket || !session?.user || !pollQuestion.trim()) return;
    const options = pollOptions.filter(opt => opt.trim() !== '');
    if (options.length < 2) return;

    socket.emit('create_poll', {
      question: pollQuestion,
      options,
      createdBy: session.user.id,
      room
    });
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const toggleChatStatus = () => {
    if (!socket || !isManager || room !== 'student') return;
    socket.emit('toggle_chat', { canChat: !canChat, room: 'student' });
  };

  const addOption = () => setPollOptions([...pollOptions, '']);
  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-black/5">
      <div className="flex flex-col lg:flex-row h-full">
        
        {/* Chat Area */}
        <div className="flex-grow flex flex-col border-r border-black/5">
          <div className="p-6 bg-charcoal text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare size={20} className="text-saffron" />
              <h3 className="font-serif font-black text-lg">{title || (room === 'staff' ? 'Staff Discussion' : 'Student Chat')}</h3>
            </div>
            {isManager && room === 'student' && (
              <button 
                onClick={toggleChatStatus}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${canChat ? 'bg-emerald/20 text-emerald' : 'bg-red-500/20 text-red-500'}`}
              >
                {canChat ? <Unlock size={14} /> : <Lock size={14} />}
                <span>{canChat ? 'Students Can Post' : 'Chat Locked'}</span>
              </button>
            )}
          </div>

          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-ash/20">
            {messages.map((msg) => {
              const isMe = msg.sender._id === session?.user?.id;
              const senderRole = msg.sender.role.toUpperCase();
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${isMe ? 'bg-saffron text-white rounded-tr-none' : 'bg-white text-charcoal rounded-tl-none shadow-sm border border-black/5'}`}>
                    {!isMe && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{msg.sender.name}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${senderRole === 'ADMIN' || senderRole === 'MANAGER' ? 'bg-charcoal text-white' : 'bg-ash text-charcoal/40'}`}>
                          {senderRole}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-[8px] mt-1 opacity-40 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 border-t border-black/5">
            {(room === 'student' && !canChat && role === 'STUDENT') ? (
              <div className="bg-ash/50 p-4 rounded-2xl text-center text-charcoal/40 text-sm flex items-center justify-center space-x-2">
                <Lock size={16} />
                <span>Chat is currently restricted by managers</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-ash/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-saffron outline-hidden"
                />
                <button type="submit" className="bg-charcoal text-white p-3 rounded-xl hover:bg-emerald transition-all active:scale-95">
                  <Send size={20} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar: Polls */}
        <div className="w-full lg:w-80 bg-ash/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart2 size={20} className="text-emerald" />
              <h3 className="font-serif font-black text-lg text-charcoal">Active Poll</h3>
            </div>
            {(isManager || (isMember && room === 'staff')) && (
              <button 
                onClick={() => setShowPollCreator(!showPollCreator)}
                className="p-2 bg-charcoal text-white rounded-lg hover:bg-emerald transition-all"
              >
                {showPollCreator ? <X size={16} /> : <Plus size={16} />}
              </button>
            )}
          </div>

          {showPollCreator ? (
            <div className="space-y-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <input 
                type="text" 
                placeholder="Question (e.g. Next trip location?)"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-ash/50 border-none rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-saffron outline-hidden"
              />
              <div className="space-y-2">
                {pollOptions.map((opt, i) => (
                  <input 
                    key={i}
                    type="text" 
                    placeholder={`Option ${i+1}`}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="w-full bg-ash/50 border-none rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-saffron outline-hidden"
                  />
                ))}
                <button onClick={addOption} className="text-[10px] font-bold uppercase text-emerald hover:underline">Add Option</button>
              </div>
              <button 
                onClick={handleCreatePoll}
                className="w-full bg-charcoal text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald transition-all"
              >
                Launch Poll
              </button>
            </div>
          ) : poll ? (
            <div className="space-y-4">
              <p className="font-bold text-charcoal text-sm">{poll.question}</p>
              <div className="space-y-2">
                {poll.options.map((opt, i) => {
                  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes.length, 0);
                  const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes.length / totalVotes) * 100);
                  const hasVoted = opt.votes.includes(session?.user?.id as string);
                  
                  return (
                    <button 
                      key={i}
                      onClick={() => handleVote(i)}
                      className={`w-full relative p-3 rounded-xl border transition-all text-left overflow-hidden ${hasVoted ? 'border-emerald bg-emerald/5' : 'border-black/5 bg-white hover:border-saffron'}`}
                    >
                      <div 
                        className="absolute left-0 top-0 h-full bg-emerald/10 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex justify-between items-center text-xs">
                        <span className="font-medium text-charcoal">{opt.text}</span>
                        <span className="font-bold text-charcoal/40">{percentage}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-charcoal/30 font-medium italic">
                {poll.options.reduce((acc, curr) => acc + curr.votes.length, 0)} votes total
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow opacity-30 py-12">
              <BarChart2 size={48} className="mb-4" />
              <p className="text-xs font-bold uppercase">No active poll</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
