'use client';
import React, { useEffect } from 'react';

interface FlashMessageProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
}

export default function FlashMessage({ message, onClose, type = 'success' }: FlashMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
  const borderColor = type === 'error' ? 'border-red-400' : 'border-green-400';
  const icon = type === 'error' ? '✗' : '✓';

  return (
    <div className="fixed top-4 left-4 z-[9999] animate-fade-in-down">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl border ${borderColor} flex items-center gap-2`}>
        <span className="font-bold">{icon}</span> {message}
      </div>
    </div>
  );
}