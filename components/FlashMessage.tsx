'use client';
import React, { useEffect } from 'react';

interface FlashMessageProps {
  message: string;
  onClose: () => void;
}

export default function FlashMessage({ message, onClose }: FlashMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-4 z-[9999] animate-fade-in-down">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl border border-green-400 flex items-center gap-2">
        <span className="font-bold">✓</span> {message}
      </div>
    </div>
  );
}