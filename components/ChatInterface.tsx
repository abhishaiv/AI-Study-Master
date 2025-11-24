import React, { useState, useRef, useEffect } from 'react';
import { streamChatResponse } from '../services/gemini';
import { TOPICS } from '../constants';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello Abhishai! I'm your AI mentor. I can help you catch up on 100x Engineers topics. What are you stuck on today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simple RAG simulation: find if input matches any topic keywords to inject context
    const matchedTopic = TOPICS.find(t => 
        input.toLowerCase().includes(t.title.toLowerCase()) || 
        input.toLowerCase().includes(t.category.toLowerCase()) ||
        input.toLowerCase().includes('rag') && t.category === 'RAG'
    );
    const context = matchedTopic ? matchedTopic.contextData : undefined;

    // Prepare history for API
    const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));

    // Create a placeholder for streaming response
    const responseId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: responseId, role: 'model', text: '' }]);

    try {
        const stream = streamChatResponse(history, userMsg.text, context);
        
        let fullText = '';
        for await (const chunk of stream) {
            fullText += chunk;
            setMessages(prev => prev.map(m => 
                m.id === responseId ? { ...m, text: fullText } : m
            ));
        }
    } catch (err) {
        setMessages(prev => [...prev, { id: 'error', role: 'model', text: 'Sorry, I encountered an error connecting to the model.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-green-600 text-white'
            }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
               {msg.role === 'model' && msg.text === '' ? (
                   <Loader2 className="animate-spin w-5 h-5 opacity-50" />
               ) : (
                   <div className="prose prose-sm max-w-none dark:prose-invert">
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                   </div>
               )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a topic or doubt..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-lg transition-colors flex items-center justify-center"
            >
                <Send size={20} />
            </button>
        </form>
      </div>
    </div>
  );
};
