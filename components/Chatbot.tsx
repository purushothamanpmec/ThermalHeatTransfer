import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, FileText, Loader2, X } from 'lucide-react';
import { sendTutorMessage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  fileName?: string;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hello! I'm your Heat & Mass Transfer Tutor. You can ask me to solve problems, explain concepts, or upload a PDF textbook/notes for me to reference!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{name: string, data: string, type: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (Gemini limit is generous, but let's be safe for browser memory ~10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a PDF smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // remove data url prefix
      const base64Data = base64String.split(',')[1];
      
      setAttachedFile({
        name: file.name,
        data: base64Data,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      fileName: attachedFile?.name
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendTutorMessage(
      userMsg.text || "Analyze this document.",
      history,
      attachedFile?.data,
      attachedFile?.type
    );

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
    setAttachedFile(null); // Clear file after sending
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">AI Tutor</h3>
          <p className="text-xs text-slate-500">Powered by Gemini 1.5 • Supports PDF Analysis</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
              }`}>
                {msg.fileName && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-black/10 rounded">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-mono truncate max-w-[200px]">{msg.fileName}</span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[85%]">
               <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2 text-slate-500">
                 <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {attachedFile && (
           <div className="flex items-center gap-2 mb-2 p-2 bg-slate-100 rounded-lg w-fit">
             <FileText className="w-4 h-4 text-slate-500" />
             <span className="text-xs font-medium text-slate-700">{attachedFile.name}</span>
             <button onClick={() => setAttachedFile(null)} className="p-1 hover:bg-slate-200 rounded-full">
               <X className="w-3 h-3 text-slate-500" />
             </button>
           </div>
        )}
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Upload PDF"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="application/pdf, image/*" 
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question or upload notes..."
            className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-full px-4 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={(!input && !attachedFile) || isLoading}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
