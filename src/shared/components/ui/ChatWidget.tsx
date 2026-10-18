import { useState } from 'react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Olá! Sou a assistente virtual da Loja. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Estou aprendendo! Em breve poderei consultar estoques e fazer pedidos para você. 😉' }
      ]);
    }, 1000);
  };

  return (
    // Mudei para bottom-20 (80px do chão) e right-6
    <div className="fixed bottom-20 right-6 z-[9999] flex flex-col items-end gap-4">
      
      {isOpen && (
        // Altura 500px com limite máximo dinâmico e animação de subida
        <div className="flex h-[500px] max-h-[calc(100vh-180px)] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 sm:w-[380px]">
          
          {/* Header do Chat */}
          <div className="flex items-center justify-between bg-slate-900 p-4 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg shadow-inner">🤖</div>
              <div>
                <span className="block text-sm font-bold tracking-tight">Assistente Virtual</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Online agora
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors" aria-label="Fechar">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          {/* Corpo das Mensagens */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input de Mensagem */}
          <form onSubmit={handleSend} className="border-t border-slate-200 bg-white p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button type="submit" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
              <svg className="h-5 w-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}

      {/* Botão Flutuante do Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-blue-500/30"
        aria-label="Abrir chat com IA"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="h-6 w-6 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>
    </div>
  );
}