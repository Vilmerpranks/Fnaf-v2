import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyles = "relative px-8 py-4 text-2xl font-bold uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 border-2";
  
  const variants = {
    primary: "border-[#33ff00] text-[#33ff00] hover:bg-[#33ff00] hover:text-black shadow-[0_0_15px_rgba(51,255,0,0.3)] hover:shadow-[0_0_25px_rgba(51,255,0,0.6)]",
    danger: "border-red-600 text-red-600 hover:bg-red-600 hover:text-black shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};