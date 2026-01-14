import { useState, useEffect } from 'react';
import { Plus, MessageSquare, LogOut } from 'lucide-react';
import axios from '../api/axios';

const Sidebar = ({ onNewChat, onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get('/history');
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-black/20 text-white flex flex-col h-full">
      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={16} />
          New
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="text-center text-slate-500 mt-6 text-xs">
            <p>No chats</p>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`w-full text-left p-2.5 rounded-lg text-sm mb-1 transition-colors ${
                selectedChatId === chat._id
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex gap-2 items-start">
                <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-white truncate text-xs font-medium">
                    {chat.input_text.substring(0, 25)}
                    {chat.input_text.length > 25 ? '...' : ''}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/30 border border-red-800/30 text-red-400 hover:text-red-300 text-sm px-3 py-2 rounded-lg transition-colors font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
