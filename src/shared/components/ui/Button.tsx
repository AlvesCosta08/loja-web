// src/shared/components/ui/Button.tsx
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  // Base: Aumentamos o py (padding vertical) para 3.5. Área de toque mínima de 44x44px (UX Mobile).
  const baseStyles = 'inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    // Laranja: Psicologia da urgência e conversão (CTA - Call to Action).
    primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-sm hover:shadow-md',
    // Azul: Confiança e segurança (para ações de menor atrito).
    secondary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600',
    // Branco com borda: Para quando não queremos poluir a tela.
    outline: 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    // Vermelho: Ação destrutiva.
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}