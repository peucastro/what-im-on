'use client';

import React from 'react';

interface VibeButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function VibeButton({ 
  onClick, 
  children, 
  className = '', 
  variant = 'outline',
  disabled = false,
  type = 'button'
}: VibeButtonProps) {
  const baseStyles = "rounded-app px-3 py-1 text-sm font-medium transition-all lowercase disabled:opacity-50";
  
  const variants = {
    outline: "border border-app-border bg-app-nav text-app-font hover:bg-black hover:text-white",
    primary: "bg-app-accent text-white hover:opacity-90 font-bold"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
