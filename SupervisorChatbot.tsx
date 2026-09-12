import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const SupervisorChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Halo! Saya Syafina Alifia Putri, Supervisor Gizi SPPG. Ada yang bisa saya bantu terkait standar gizi, keamanan pangan, atau audit HACCP dapur kita hari ini?',
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
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi asisten');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Maaf, sistem AI sedang mengalami gangguan. Silakan coba lagi.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#0A2540] text-white shadow-2xl hover:bg-blue-900 transition-all z-50 ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF80AB] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF80AB]"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[340px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A2540] to-blue-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF80AB] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                <Bot className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Syafina Alifia Putri</h3>
                <p className="text-blue-200 text-[10px] flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" />
                  Supervisor Gizi SPPG • BGN
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white p-1 rounded-md hover:bg-blue-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert / Info bar */}
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] text-slate-500 font-medium">Terhubung dengan Search Grounding &amp; Profil Pengawas</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-[#0A2540] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-[#FF80AB]" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-[13px] leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1 border border-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#0A2540] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-[#FF80AB]" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 rounded-tl-sm flex items-center gap-2 shadow-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-[11px] font-medium">Syafina sedang merumuskan jawaban...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Tanya soal QC, gizi, atau keamanan pangan..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none max-h-24"
              style={{ minHeight: '42px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 disabled:bg-slate-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
