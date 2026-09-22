import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import api from '../utils/api';
import { formatTimeAgo } from '../utils/helpers';
import { Send, Smile, Paperclip, Phone, Video, MoreHorizontal, Search, Check, CheckCheck, ArrowLeft } from 'lucide-react';

const MessagesPage = () => {
  const { user: currentUser, socket } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const bottomRef = useRef(null);

  const activeConv = conversations.find(c => c.user._id === activeConversationId);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations');
        setConversations(data);
        if (data.length > 0 && !activeConversationId) {
          setActiveConversationId(data[0].user._id);
        }
      } catch (err) {
        console.error('Failed to fetch conversations', err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${activeConversationId}`);
        setMessages(data);
        
        // Mark as read
        const unreadExists = data.some(m => !m.isRead && m.recipient._id === currentUser?._id);
        if (unreadExists) {
          await api.put(`/messages/${activeConversationId}/read`);
          setConversations(prev => prev.map(c => 
            c.user._id === activeConversationId ? { ...c, unreadCount: 0 } : c
          ));
        }
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };
    fetchMessages();
  }, [activeConversationId, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!socket) return;
    
    // Listen for incoming messages
    const handleReceiveMessage = (newMessage) => {
      const senderId = newMessage.sender?._id || newMessage.sender;

      // If the message belongs to the active conversation, append it
      if (activeConversationId && senderId === activeConversationId) {
        setMessages(prev => (prev.some(message => message._id === newMessage._id) ? prev : [...prev, newMessage]));
        api.put(`/messages/${senderId}/read`).catch(() => {});
      }
      
      // Update conversations list summary
      setConversations(prev => {
        const existingInfo = prev.find(c => c.user._id === senderId);
        const newConversations = prev.filter(c => c.user._id !== senderId);
        
        return [{
          user: existingInfo ? existingInfo.user : newMessage.sender,
          lastMessage: newMessage,
          unreadCount: activeConversationId === senderId ? 0 : (existingInfo?.unreadCount || 0) + 1,
        }, ...newConversations];
      });
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [socket, activeConversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversationId) return;
    
    const messageText = text;
    setText('');
    
    try {
      const { data } = await api.post(`/messages/${activeConversationId}`, { text: messageText });
      setMessages(prev => [...prev, data]);
      setConversations(prev => {
        const existingInfo = prev.find(c => c.user._id === activeConversationId);
        const newConversations = prev.filter(c => c.user._id !== activeConversationId);
        return [{
          user: existingInfo.user,
          lastMessage: data,
          unreadCount: 0,
        }, ...newConversations];
      });
      
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setMobileView('chat');
  };

  const ConversationList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-dark-100 dark:border-dark-700">
        <h2 className="font-semibold text-dark-900 dark:text-dark-100 mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input placeholder="Search conversations..." className="input-base pl-9 py-2 text-xs" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 && (
          <div className="p-4 text-center text-dark-500 text-sm">No conversations yet.</div>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.user._id}
            onClick={() => handleSelectConversation(conv.user._id)}
            className={`w-full flex items-center gap-3 p-3 border-b border-dark-50 dark:border-dark-700/50 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors text-left ${activeConversationId === conv.user._id ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`}
          >
            <Avatar name={conv.user.name} img={conv.user.avatar || conv.user.profilePicture} size="md" isOnline={true} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-dark-800 dark:text-dark-200 truncate">{conv.user.name}</p>
                <span className="text-xs text-dark-400 flex-shrink-0 ml-2">
                  {conv.lastMessage?.createdAt && formatTimeAgo(conv.lastMessage.createdAt)}
                </span>
              </div>
              <p className="text-xs text-dark-400 truncate">{conv.lastMessage?.text}</p>
            </div>
            {conv.unreadCount > 0 && (
              <span className="w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 p-1">{conv.unreadCount}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const ChatPanel = () => (
    <div className="flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-dark-100 dark:border-dark-700 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile back button */}
          <button
            onClick={() => setMobileView('list')}
            className="md:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-500 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Avatar name={activeConv.user.name} img={activeConv.user.avatar || activeConv.user.profilePicture} size="md" isOnline={true} />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-dark-900 dark:text-dark-100 truncate">{activeConv.user.name}</p>
            <p className="text-xs text-brand-500">Active</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400 hover:text-dark-700 dark:hover:text-dark-200"><Phone className="w-4 h-4" /></button>
          <button className="hidden sm:block p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400 hover:text-dark-700 dark:hover:text-dark-200"><Video className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400 hover:text-dark-700 dark:hover:text-dark-200"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center flex-col text-dark-400">
            <Avatar name={activeConv.user.name} img={activeConv.user.avatar || activeConv.user.profilePicture} size="xl" className="mb-4 opacity-50" />
            <p>Start a conversation with {activeConv.user.name}</p>
          </div>
        )}
        {messages.map((m) => {
          const isMe = m.sender._id === currentUser?._id;
          return (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {!isMe && <Avatar name={activeConv.user.name} img={activeConv.user.avatar || activeConv.user.profilePicture} size="xs" />}
              <div
                className={`max-w-[75%] sm:max-w-xs px-3 sm:px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-sm'
                    : 'bg-dark-100 dark:bg-dark-700 text-dark-800 dark:text-dark-200 rounded-bl-sm'
                }`}
              >
                {m.text}
                <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : ''}`}>
                  <span className={`text-[10px] ${isMe ? 'text-white/70' : 'text-dark-400'}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (m.isRead ? <CheckCheck className="w-3 h-3 text-white/70" /> : <Check className="w-3 h-3 text-white/50" />)}
                </div>
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
              <Avatar name={activeConv.user.name} img={activeConv.user.avatar || activeConv.user.profilePicture} size="xs" />
              <div className="bg-dark-100 dark:bg-dark-700 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-dark-100 dark:border-dark-700">
        <div className="flex items-center gap-2 sm:gap-3 bg-dark-50 dark:bg-dark-700 rounded-2xl px-3 sm:px-4 py-2">
          <button type="button" className="hidden sm:block text-dark-400 hover:text-amber-500 transition-colors flex-shrink-0"><Smile className="w-5 h-5" /></button>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-dark-800 dark:text-dark-200 placeholder-dark-400 focus:outline-none min-w-0"
          />
          <button type="button" className="hidden sm:block text-dark-400 hover:text-brand-500 transition-colors flex-shrink-0"><Paperclip className="w-5 h-5" /></button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-xl transition-all flex-shrink-0 ${text.trim() ? 'bg-brand-500 text-white shadow-glow' : 'text-dark-300'}`}
            disabled={!text.trim()}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </div>
  );

  return (
    <Layout showRightSidebar={false}>
      <div className="max-w-5xl mx-auto">
        {/* Mobile: show list or chat panel exclusively */}
        <div className="md:hidden card overflow-hidden" style={{ height: 'calc(100dvh - 8rem)', minHeight: '400px' }}>
          {mobileView === 'list' ? <ConversationList /> : activeConv ? <ChatPanel /> : <ConversationList />}
        </div>

        {/* Desktop: side-by-side */}
        <div className="hidden md:flex card overflow-hidden" style={{ height: 'calc(100vh - 7rem)', minHeight: '500px' }}>
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 border-r border-dark-200 dark:border-dark-700">
            <ConversationList />
          </div>
          {/* Chat */}
          {activeConv ? (
            <ChatPanel />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-dark-400 bg-dark-50/50 dark:bg-dark-800/20">
              <div className="w-16 h-16 rounded-full bg-dark-100 dark:bg-dark-700 flex items-center justify-center mb-4 text-brand-500">
                <Send className="w-6 h-6 ml-1" />
              </div>
              <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-1">Your Messages</h3>
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
