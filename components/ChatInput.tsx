
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, isListening, onToggleVoice }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-4 bg-gray-800 p-2 rounded-full border border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <button
        onClick={onToggleVoice}
        disabled={isLoading}
        className={`p-2 rounded-full transition-colors ${
          isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-700 text-gray-400'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <MicrophoneIcon />
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message or use the microphone..."
        className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none disabled:opacity-50"
        disabled={isLoading || isListening}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
};
