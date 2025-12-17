import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Салам. Я Zupunu CEO. Ну что, будем шить деньги или дальше играть в цеховика? Скидывай идею модели или спрашивай про экспорт. Времени мало.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await geminiService.sendMessage(userMsg.text, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto bg-industrial-800 border border-industrial-700 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-industrial-900 p-4 border-b border-industrial-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-industrial-accent rounded-full flex items-center justify-center text-industrial-900 font-bold">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Zupunu AI Mentor</h3>
            <p className="text-xs text-industrial-accent uppercase tracking-wider">Strict Mode: ON</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'user' ? 'bg-slate-600' : 'bg-industrial-accent text-industrial-900'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-lg p-4 text-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-slate-700 text-white' 
                : 'bg-industrial-900 border border-industrial-700 text-slate-200 shadow-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 bg-industrial-accent text-industrial-900 rounded-full flex-shrink-0 flex items-center justify-center">
               <Bot size={16} />
             </div>
             <div className="bg-industrial-900 border border-industrial-700 p-4 rounded-lg flex items-center gap-2">
               <Loader2 className="animate-spin text-industrial-accent" size={16} />
               <span className="text-slate-400 text-xs">Анализирую Unit-экономику...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-industrial-900 border-t border-industrial-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спроси про маркировку или скинь идею модели..."
            className="flex-1 bg-industrial-800 text-white border border-industrial-700 rounded-lg px-4 py-3 focus:border-industrial-accent outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-industrial-accent hover:bg-amber-600 text-industrial-900 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
