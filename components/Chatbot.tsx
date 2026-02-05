import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { sendTutorMessage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatbotProps {
  activeTopic?: string;
}

/**
 * Robust Math Renderer
 * Scans the provided element for LaTeX patterns and replaces them with typeset math.
 * Wraps call in a try-catch to ignore internal KaTeX quirks errors.
 */
const renderMath = (el: HTMLElement | null) => {
  if (!el) return;
  
  const attemptRender = () => {
    try {
      if ((window as any).renderMathInElement) {
        (window as any).renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false,
          trust: true
        });
      }
    } catch (error) {
      console.warn("Math rendering suppressed an error:", error);
    }
  };

  attemptRender();
  // Small delayed retry to catch late-rendering Markdown segments
  setTimeout(attemptRender, 100);
};

export const Chatbot: React.FC<ChatbotProps> = ({ activeTopic = "General" }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: `Hello! I'm your AI Tutor. I'm currently focused on the context of **${activeTopic}** from your lecture slides. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      renderMath(chatContainerRef.current);
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendTutorMessage(
        userMsg.text,
        history as any,
        activeTopic
      );

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        id: 'error', 
        role: 'model', 
        text: "I encountered an error while processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 p-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">Engineering Tutor</h3>
          <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Grounding: PPT Slides</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-slate-900' : 'bg-blue-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              
              <div className={`p-5 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
              }`}>
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-strong:text-blue-600">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-4 max-w-[80%]">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm"><Bot className="w-4 h-4 text-white" /></div>
               <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2 text-slate-500 shadow-sm italic">
                 <Loader2 className="w-3 h-3 animate-spin" /> Analyzing lecture notes...
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100 shrink-0">
        <div className="flex gap-3 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about a formula or concept from the slides..."
            className="flex-1 bg-transparent border-transparent focus:ring-0 px-4 text-sm outline-none text-slate-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};