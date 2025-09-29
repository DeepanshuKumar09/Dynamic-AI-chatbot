
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { createChatSession } from './services/geminiService';
import { Message, Role } from './types';
import { useSpeech } from './hooks/useSpeech';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.MODEL,
      content: "Hello! I'm a dynamic AI chatbot. How can I assist you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, speak, cancelSpeech } = useSpeech();

  useEffect(() => {
    const initializeChat = async () => {
      chatRef.current = await createChatSession();
    };
    initializeChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !chatRef.current) return;
    
    stopListening();
    cancelSpeech();
    const newUserMessage: Message = { role: Role.USER, content: text };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: text });
      let modelResponse = '';
      setMessages((prev) => [...prev, { role: Role.MODEL, content: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = modelResponse;
          return newMessages;
        });
      }

      if (isSpeakingEnabled) {
        speak(modelResponse);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { role: Role.MODEL, content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => {
        const newMessages = [...prev];
        // In case of error, update the last (empty) message placeholder
        if(newMessages[newMessages.length - 1].content === '') {
            newMessages[newMessages.length - 1] = errorMessage;
            return newMessages;
        }
        // Otherwise, add a new error message
        return [...newMessages, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, [stopListening, cancelSpeech, isSpeakingEnabled, speak]);
  
  useEffect(() => {
    if (!isListening && transcript) {
      handleSendMessage(transcript);
    }
  }, [isListening, transcript, handleSendMessage]);

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const toggleSpeaking = () => {
    setIsSpeakingEnabled(prev => {
        if (prev) { // If it was enabled and is being turned off
            cancelSpeech();
        }
        return !prev;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header isSpeakingEnabled={isSpeakingEnabled} onToggleSpeaking={toggleSpeaking} />
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
      <div className="p-4 md:p-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          isListening={isListening}
          onToggleVoice={toggleVoice}
        />
      </div>
    </div>
  );
};

export default App;
