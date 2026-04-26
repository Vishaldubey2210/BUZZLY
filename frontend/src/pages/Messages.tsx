import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '../types';
import { messageService } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { formatShortTime, formatTimeAgo } from '../utils/format';
import { Send, Search, Loader2 } from 'lucide-react';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
      if (socket) {
        socket.emit('join_conversation', activeConv._id);
      }
    }
    
    return () => {
      if (activeConv && socket) {
        socket.emit('leave_conversation', activeConv._id);
      }
    };
  }, [activeConv, socket]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (msg: Message) => {
        if (activeConv && msg.conversationId === activeConv._id) {
          setMessages(prev => [...prev, msg]);
          scrollToBottom();
        }
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, activeConv]);

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    setLoadingMessages(true);
    try {
      const data = await messageService.getMessages(convId);
      setMessages(data.data);
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || !user) return;

    try {
      const tempId = Date.now().toString();
      const newMessage: Message = {
        _id: tempId,
        conversationId: activeConv._id,
        text: inputText,
        sender: {
          _id: user._id,
          buzzName: user.buzzName,
          avatar: user.avatar,
        },
        createdAt: new Date().toISOString()
      };

      // Optimistic update
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setTimeout(scrollToBottom, 50);

      const savedMsg = await messageService.sendMessage(activeConv._id, inputText);
      
      // Update real ID and emit
      setMessages(prev => prev.map(m => m._id === tempId ? savedMsg : m));
      
      if (socket) {
        socket.emit('send_message', { conversationId: activeConv._id, message: savedMsg });
      }

    } catch (error) {
      console.error(error);
      // Remove temp message conceptually
    }
  };

  // Helper to get the other person in a 1-1 chat
  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p._id !== user?._id) || conv.participants[0];
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-4 mt-2">
      {/* Sidebar List */}
      <div className={`w-full md:w-80 flex flex-col bg-[#110a02] border border-white/5 md:rounded-xl overflow-hidden ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/5">
          <h2 className="font-bold text-lg mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/5 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500/50" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-amber-500" /></div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-8 text-gray-500 text-sm">No conversations yet</div>
          ) : (
            conversations.map(conv => {
              const other = getOtherParticipant(conv);
              const isActive = activeConv?._id === conv._id;
              return (
                <div 
                  key={conv._id}
                  onClick={() => setActiveConv(conv)}
                  className={`flex items-center gap-3 p-4 border-b border-white/5 cursor-pointer transition-colors ${isActive ? 'bg-amber-500/10' : 'hover:bg-white/5'}`}
                >
                  <img src={other.avatar} alt="" className="w-12 h-12 rounded-full border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-sm truncate">{other.buzzName}</span>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-gray-500">{formatTimeAgo(conv.lastMessage.createdAt)}</span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className={`text-xs truncate ${conv.lastMessage.sender._id !== user?._id && !conv.lastMessage.isRead ? 'text-white font-medium' : 'text-gray-500'}`}>
                        {conv.lastMessage.sender._id === user?._id ? 'You: ' : ''}{conv.lastMessage.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#110a02] border border-white/5 md:rounded-xl overflow-hidden ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <span className="text-4xl mb-4 text-amber-500/50">💬</span>
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#0a0600]/50">
              <button 
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setActiveConv(null)}
              >
                ←
              </button>
              <img src={getOtherParticipant(activeConv).avatar} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-bold">{getOtherParticipant(activeConv).buzzName}</div>
                <div className="text-xs text-amber-500">Active now</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {loadingMessages ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-amber-500" /></div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.sender._id === user?._id;
                  return (
                    <div key={msg._id} className={`flex max-w-[80%] ${isMine ? 'ml-auto justify-end' : ''}`}>
                      <div className={`rounded-xl px-4 py-2 ${isMine ? 'bg-amber-500 text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                        <div className="text-sm">{msg.text}</div>
                        <div className={`text-[9px] mt-1 text-right ${isMine ? 'text-[#0a0600]/60' : 'text-white/40'}`}>
                          {formatShortTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-[#0a0600]/80 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 text-sm focus:outline-none focus:border-amber-500/50"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center disabled:opacity-50"
              >
                <Send size={16} className={inputText.trim() ? "ml-1" : ""} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
