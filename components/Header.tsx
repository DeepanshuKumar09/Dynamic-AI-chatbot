
import React from 'react';
import { SpeakerOnIcon } from './icons/SpeakerOnIcon';
import { SpeakerOffIcon } from './icons/SpeakerOffIcon';

interface HeaderProps {
    isSpeakingEnabled: boolean;
    onToggleSpeaking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSpeakingEnabled, onToggleSpeaking }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-md">
      <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Dynamic AI Chatbot
      </h1>
      <button
        onClick={onToggleSpeaking}
        className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label={isSpeakingEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
      >
        {isSpeakingEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
    </header>
  );
};
