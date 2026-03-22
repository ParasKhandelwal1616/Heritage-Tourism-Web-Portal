'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { Send, User as UserIcon, Shield } from 'lucide-react';

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

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.io
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Fetch initial chat history
    fetch('http://localhost:5000/api/chat/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Error fetching chat history:', err));

    // Listen for new messages
    newSocket.on('receive_message', (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !session?.user) return;

    socket.emit('send_message', {
      senderId: session.user.id,
      content: newMessage,
    });

    setNewMessage('');
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-ash">
        <div className="p-8 bg-white rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-serif font-black text-charcoal mb-4">Access Denied</h2>
          <p className="text-charcoal/60 mb-6">Please sign in to join the club chat.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen bg-ash pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto h-full flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-black/5">
        
        {/* Chat Header */}
        <div className="p-6 bg-charcoal text-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-saffron rounded-2xl">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-black">Heritage Club Chat</h2>
              <p className="text-[10px] text-white/60 uppercase tracking-widest">Global Discussion Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-emerald">
            <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Live Now</span>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth bg-ash/30"
        >
          {messages.map((msg) => {
            const isMe = msg.sender._id === session.user.id;
            return (
              <div 
                key={msg._id} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end space-x-2`}
              >
                {!isMe && (
                  <img 
                    src={msg.sender.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}`}
                    className="w-8 h-8 rounded-full border border-black/5"
                    alt=""
                  />
                )}
                <div className={`max-w-[70%] ${isMe ? 'bg-saffron text-white rounded-t-2xl rounded-bl-2xl' : 'bg-white text-charcoal rounded-t-2xl rounded-br-2xl shadow-sm border border-black/5'} p-4`}>
                  {!isMe && (
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                      {msg.sender.name} • {msg.sender.role}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[8px] mt-2 opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <div className="p-6 bg-white border-t border-black/5">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to the club..."
              className="flex-grow bg-ash/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-saffron outline-hidden"
            />
            <button 
              type="submit"
              className="bg-charcoal text-white p-4 rounded-2xl hover:bg-emerald transition-all active:scale-95 shadow-lg shadow-charcoal/10"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
