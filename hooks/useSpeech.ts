
import { useState, useRef, useCallback, useEffect } from 'react';

// Polyfill for browser compatibility
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const cancelSpeech = useCallback(() => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition is not supported by this browser.");
      return;
    }
    
    cancelSpeech(); // Stop any ongoing speech from the bot

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [cancelSpeech]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
        console.error("Speech Synthesis is not supported by this browser.");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Cleanup effect to stop listening/speaking on unmount
  useEffect(() => {
    return () => {
        stopListening();
        cancelSpeech();
    };
  }, [stopListening, cancelSpeech]);

  return { isListening, transcript, startListening, stopListening, speak, cancelSpeech };
};
