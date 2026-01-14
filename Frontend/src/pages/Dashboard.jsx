import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import axios from '../api/axios';
import backgroundImage from '../assets/dashboard-bg.jpg';

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [error, setError] = useState(null);

  const handleNewChat = () => {
    setMessages([]);
    setSelectedChatId(null);
    setError(null);
  };

  const handleSelectChat = (chat) => {
    setMessages([
      { role: 'user', content: chat.input_text },
      { role: 'assistant', content: chat.output_text }
    ]);
    setSelectedChatId(chat._id);
    setError(null);
  };

  const handleSendMessage = async (message) => {
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/generate', {
        input_text: message,
        tone: 'neutral',
        format: 'plain',
        length: 'normal'
      });
      const aiMessage = { role: 'assistant', content: response.data.output_text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        role: 'error',
        content: error.response?.data?.detail || 'Something went wrong',
        originalMessage: message
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (originalMessage) => {
    setMessages(prev => prev.filter(msg => msg.role !== 'error'));
    handleSendMessage(originalMessage);
  };

  return (
    <div 
      className="h-screen flex"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
      />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-transparent px-6 py-3">
          <h1 className="text-white font-semibold text-base">FarmatAI</h1>
          <p className="text-slate-300 text-xs mt-0.5">Format your context</p>
        </div>

        {/* Chat Area */}
        <ChatWindow
          messages={messages}
          loading={loading}
          onRetry={handleRetry}
        />

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
