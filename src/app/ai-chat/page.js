"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { speakTextPromise, cancelSpeech, setupSpeechEngine, primeEngine } from "@/utils/speech";
import "./ai-chat.css";

export default function AiChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I am Sparky, your new friend! Let's talk. What is your name?" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const router = useRouter();
  
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const isContinuousRef = useRef(false);
  const isFetchingRef = useRef(false);
  const messagesRef = useRef(messages);
  const lastSpeakEndTimeRef = useRef(0);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    // Setup TTS voices
    const cleanupSpeech = setupSpeechEngine();
    
    // Auto-scroll to bottom of chat
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }

    return () => {
      cleanupSpeech();
      cancelSpeech();
    };
  }, [messages]);

  const toggleListening = () => {
    primeEngine();
    
    if (isListening || isContinuousRef.current) {
      isContinuousRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      cancelSpeech();
    } else {
      isContinuousRef.current = true;
      startListening();
    }
  };

  const restartTimeoutRef = useRef(null);

  const scheduleRestart = (delay = 1000) => {
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = setTimeout(() => {
      if (isContinuousRef.current && !isSpeaking && !isFetchingRef.current) {
        startListening();
      }
    }, delay);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Speech Recognition. Please use Chrome.");
      return;
    }

    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);

    if (recognitionRef.current) {
      try { recognitionRef.current.onend = null; recognitionRef.current.onerror = null; recognitionRef.current.stop(); } catch(e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsSpeaking(false);
    };

    recognition.onresult = (event) => {
      const timeSinceLastSpeech = Date.now() - lastSpeakEndTimeRef.current;
      if ((window.speechSynthesis && window.speechSynthesis.speaking) || timeSinceLastSpeech < 1500) {
         console.warn("Ignored echo transcript (too close to AI speech)");
         return;
      }
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.warn("Speech error handled:", event.error);
      setIsListening(false);
      
      const isRetryable = event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network';
      
      if (!isRetryable) {
         isContinuousRef.current = false;
      } else {
         scheduleRestart(1000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      scheduleRestart(500);
    };

    try {
      recognition.start();
    } catch(err) {
      console.warn("Recognition start failed, retrying...");
      scheduleRestart(1000);
    }
  };

  const handleSendMessage = async (textToSubmit) => {
    if (!textToSubmit || !textToSubmit.trim()) {
       return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    cancelSpeech();
    isFetchingRef.current = true;

    const newMessages = [...messagesRef.current, { role: 'user', content: textToSubmit }];
    setMessages(newMessages);
    setInput('');
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
        setIsSpeaking(false);
        return;
      }

      let replyText = data.reply;
      let redirectRoute = null;

      const routeMatch = replyText.match(/\[GO_([A-Z0-9]+)\]/);
      if (routeMatch) {
         const routeMap = {
            'ABC': '/abc',
            '123': '/123',
            'TABLES': '/tables',
            'RHYMES': '/rhymes',
            'COLORS': '/colors',
            'ANIMALS': '/animals',
            'VEGETABLES': '/vegetables',
            'DAYS': '/days',
            'MONTHS': '/months',
            'ADDITION': '/addition',
            'SUBTRACTION': '/subtraction'
         };
         redirectRoute = routeMap[routeMatch[1]];
         replyText = replyText.replace(/\[GO_[A-Z0-9]+\]/g, '').trim();
      }

      if (!replyText && redirectRoute) {
         replyText = "Okay! Taking you there now...";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      
      isFetchingRef.current = false;
      
      if (replyText) {
        await speakTextPromise(replyText, 1.0);
      }
      
      setIsSpeaking(false);
      lastSpeakEndTimeRef.current = Date.now();
      
      if (redirectRoute) {
         router.push(redirectRoute);
         return;
      }
      
      // Auto-listen again if continuous mode is on
      if (isContinuousRef.current) {
         setTimeout(() => startListening(), 1500);
      }
      
    } catch (err) {
      console.error(err);
      isFetchingRef.current = false;
      setIsSpeaking(false);
      lastSpeakEndTimeRef.current = Date.now();
      if (isContinuousRef.current) setTimeout(() => startListening(), 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim() && !isSpeaking && !isFetchingRef.current) {
      handleSendMessage(input);
    }
  };

  return (
    <div className="ai-chat-wrapper">
      <div className="chat-header">
        <h1 className="chat-title">Talk to AI</h1>
        <p className="chat-subtitle">Meet Sparky, your smart robot friend!</p>
      </div>

      <div className="chat-container">
        
        {/* Robot Mascot */}
        <div className={`robot-mascot-container ${isSpeaking ? 'speaking' : ''}`}>
          <div className="robot-emoji">🤖</div>
        </div>

        {/* Chat Output Window */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              {msg.role === 'assistant' ? '🤖 ' : '👤 '}
              {msg.content}
            </div>
          ))}
          {isSpeaking && messages[messages.length - 1].role === 'user' && (
             <div className="chat-message bot">🤖 Typing...</div>
          )}
        </div>

        {/* Text Input Container */}
        <div className="text-input-container">
          <input 
            type="text" 
            className="chat-input"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSpeaking || isFetchingRef.current}
          />
          <button 
            className="send-btn"
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isSpeaking || isFetchingRef.current}
          >
            Send
          </button>
        </div>

        {/* Controls */}
        <div className="mic-container">
          <button 
            className={`mic-btn ${isContinuousRef.current || isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title="Click to Speak"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5zM9 7a3 3 0 0 1 6 0v3a3 3 0 0 1-6 0V7zm10 3a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-3.08A7 7 0 0 0 19 10z"/>
            </svg>
          </button>
          <div className="mic-status">
            {isContinuousRef.current ? (isSpeaking ? "AI is Speaking..." : "Listening (Tap to Stop)") : "Tap Mic to Start Conversation"}
          </div>
        </div>

      </div>
    </div>
  );
}
