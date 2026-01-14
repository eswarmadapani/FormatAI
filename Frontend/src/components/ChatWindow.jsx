import { useEffect, useRef } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ChatWindow = ({ messages, loading, onRetry }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-transparent">
      {messages.length === 0 && !loading && (
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center">
            <p className="text-sm text-slate-400">No messages yet</p>
            <p className="text-xs text-slate-600 mt-1">Start a conversation</p>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'error' ? (
            <div className="max-w-md">
              <div className="bg-red-950/40 border border-red-800/50 text-red-300 px-3 py-2 rounded-lg text-sm">
                <div className="flex gap-2 items-start">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs">{message.content}</p>
                    {onRetry && message.originalMessage && (
                      <button
                        onClick={() => onRetry(message.originalMessage)}
                        className="mt-2 text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`max-w-md px-3 py-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-black/30 text-white'
              }`}
            >
              <p className="leading-relaxed">{message.content}</p>
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-black/30 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex gap-1 items-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs">Processing...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
