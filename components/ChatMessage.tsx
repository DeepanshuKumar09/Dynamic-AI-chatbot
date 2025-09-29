
import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ModelIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        AI
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        U
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <ModelIcon />}
      <div
        className={`max-w-md md:max-w-2xl px-4 py-3 rounded-2xl ${
          isModel
            ? 'bg-gray-700 text-gray-200 rounded-tl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
       {!isModel && <UserIcon />}
    </div>
  );
};
