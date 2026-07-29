import React, { useState } from 'react';
import { Search, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userType: 'farmer' | 'buyer';
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    userId: 'f1',
    userName: 'Ramesh Singh',
    userType: 'farmer',
    lastMessage: 'The app is not letting me upload crop images.',
    timestamp: '10:30 AM',
    unread: true,
    messages: [
      { id: 'm1', senderId: 'f1', text: 'Hello Admin', timestamp: '10:28 AM', isAdmin: false },
      { id: 'm2', senderId: 'f1', text: 'The app is not letting me upload crop images.', timestamp: '10:30 AM', isAdmin: false },
    ]
  },
  {
    id: 'c2',
    userId: 'b2',
    userName: 'Anil Kumar',
    userType: 'buyer',
    lastMessage: 'My order #1024 hasn\'t arrived yet.',
    timestamp: 'Yesterday',
    unread: false,
    messages: [
      { id: 'm3', senderId: 'b2', text: 'My order #1024 hasn\'t arrived yet.', timestamp: 'Yesterday', isAdmin: false },
      { id: 'm4', senderId: 'admin', text: 'Let me check with the dispatch team for you.', timestamp: 'Yesterday', isAdmin: true },
    ]
  },
  {
    id: 'c3',
    userId: 'f3',
    userName: 'Geeta Devi',
    userType: 'farmer',
    lastMessage: 'Thank you for the quick support.',
    timestamp: '2 Days ago',
    unread: false,
    messages: [
      { id: 'm5', senderId: 'f3', text: 'Thank you for the quick support.', timestamp: '2 Days ago', isAdmin: false },
    ]
  }
];

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string>(mockConversations[0].id);
  const [replyText, setReplyText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      text: replyText,
      timestamp: 'Just now',
      isAdmin: true,
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: replyText,
          timestamp: 'Just now',
          messages: [...c.messages, newMessage],
          unread: false
        };
      }
      return c;
    }));
    
    setReplyText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <div className="mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Support Messages</h2>
        <p className="text-sm text-slate-500 mt-1">
          Communicate directly with farmers and buyers.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex">
        
        {/* Left Sidebar - Chat List */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-4 border-b border-slate-100">
            <div className="relative flex items-center w-full h-10 rounded-full bg-slate-100 px-4">
              <Search className="h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 ml-2 text-slate-600 text-xs"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  // Mark as read
                  if (conv.unread) {
                    setConversations(prev => prev.map(c => c.id === conv.id ? {...c, unread: false} : c));
                  }
                }}
                className={`p-4 cursor-pointer border-b border-slate-100 transition-colors ${
                  activeConvId === conv.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold ${conv.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {conv.userName}
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400">{conv.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate mr-2 ${conv.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                    {conv.lastMessage}
                  </p>
                  {conv.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0"></div>}
                </div>
                <div className="mt-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    conv.userType === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {conv.userType.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area - Chat Window */}
        <div className="w-2/3 flex flex-col">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    activeConv.userType === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activeConv.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{activeConv.userName}</h3>
                    <p className="text-[10px] font-medium text-slate-400 capitalize">{activeConv.userType} • User ID: {activeConv.userId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {activeConv.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.isAdmin 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                    }`}>
                      <p className="text-sm font-medium">{msg.text}</p>
                      <div className={`text-[9px] mt-1 text-right ${msg.isAdmin ? 'text-white/70' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button 
                    type="submit"
                    disabled={!replyText.trim()}
                    className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
