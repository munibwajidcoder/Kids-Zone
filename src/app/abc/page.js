"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakImmediate, speakTextPromise, cancelSpeech } from "@/utils/speech";
import "./abc.css";

export default function ABCPage() {
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);
  const isPlayingRef = useRef(false);

  const alphabet = [
    { letter: "A", word: "Apple", color: "#2563eb", img: "/images/abc_a.png" },
    { letter: "B", word: "Ball", color: "#dc2626", img: "/images/abc_b.png" },
    { letter: "C", word: "Cat", color: "#ca8a04", img: "/images/abc_c.png" },
    { letter: "D", word: "Dog", color: "#2563eb", img: "/images/Cute puppy with glowing halo rings.png" },
    { letter: "E", word: "Elephant", color: "#ea580c", img: "/images/Majestic elephant with glowing aura.png" },
    { letter: "F", word: "Fish", color: "#3b82f6", img: "/images/Glossy tropical fish with glowing halo.png" },
    { letter: "G", word: "Grapes", color: "#a855f7", img: "/images/Glossy grapes with glowing ring.png" },
    { letter: "H", word: "Hat", color: "#854d0e", img: "/images/ChatGPT Image Apr 11, 2026, 09_48_18 PM.png" },
    { letter: "I", word: "Ice Cream", color: "#ec4899", img: "/images/Glossy ice cream cone with halo lights.png" },
    { letter: "J", word: "Jam", color: "#dc2626", img: "/images/Grape jam with fresh fruits.png" },
    { letter: "K", word: "Kite", color: "#2563eb", img: "/images/Glowing diamond-shaped kite in 3D.png" },
    { letter: "L", word: "Lion", color: "#ea580c", img: "/images/Apr 11, 2026, 10_06_32 PM.png" },
    { letter: "M", word: "Monkey", color: "#7c2d12", img: "/images/ChatGPT Image Apr 11, 2026, 10_11_01 PM.png" },
    { letter: "N", word: "Nuts", color: "#65a30d", img: "/images/Glossy peanut in futuristic glow.png" },
    { letter: "O", word: "Orange", color: "#f97316", img: "/images/Dew-kissed orange on dark backdrop.png" },
    { letter: "P", word: "Parrot", color: "#22c55e", img: "/images/ChatGPT Image Apr 11, 2026, 10_12_33 PM.png" },
    { letter: "Q", word: "Quail", color: "#9333ea", img: "/images/Neon-lit cute quail mascot.png" },
    { letter: "R", word: "Rabbit", color: "#4b5563", img: "/images/Adorable rabbit with carrots.png" },
    { letter: "S", word: "Sun", color: "#eab308", img: "/images/Cheerful sun with a bright smile.png" },
    { letter: "T", word: "Tiger", color: "#ea580c", img: "/images/Adorable tiger with glowing aura.png" },
    { letter: "U", word: "Umbrella", color: "#2563eb", img: "/images/Vibrant beach umbrella under glowing halo.png" },
    { letter: "V", word: "Van", color: "#3b82f6", img: "/images/Colorful beach van with surfboard.png" },
    { letter: "W", word: "Watch", color: "#654321", img: "/images/Stainless steel watch with glowing halo.png" },
    { letter: "X", word: "Xylophone", color: "#ef4444", img: "/images/Vibrant xylophone in rainbow harmony.png" },
    { letter: "Y", word: "Yo-yo", color: "#2563eb", img: "/images/Vibrant yo-yo with glowing halo.png" },
    { letter: "Z", word: "Zebra", color: "#111827", img: "/images/Zebra with glowing halo portrait.png" }
  ];

  const handleCardClick = (letter, word) => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }
    
    setActiveLetter(letter);
    speakImmediate(letter);
    
    setTimeout(() => {
      setActiveLetter((prev) => (prev === letter ? null : prev));
    }, 800);
  };

  const stopSequence = () => {
    cancelSpeech();
    setIsPlayingSequence(false);
    isPlayingRef.current = false;
    setActiveLetter(null);
  };

  const playSequence = async () => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    cancelSpeech();
    setIsPlayingSequence(true);
    isPlayingRef.current = true;

    for (let item of alphabet) {
      if (!isPlayingRef.current) break;

      setActiveLetter(item.letter);
      
      const el = document.getElementById(`abc-card-${item.letter}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      await speakTextPromise(`${item.letter} for ${item.word}`, 0.8);
    }

    if (isPlayingRef.current) {
      stopSequence();
    }
  };

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  return (
    <div className="abc-page-wrapper">
      {/* Decorative Floating Letters */}
      <div className="abc-floating-element blue" style={{ top: '10%', left: '20%' }}>A</div>
      <div className="abc-floating-element pink" style={{ top: '25%', left: '70%', animationDelay: '1s' }}>B</div>
      <div className="abc-floating-element yellow" style={{ top: '50%', right: '15%', animationDelay: '2s' }}>C</div>
      

      {/* Hero Section */}
      <section className="abc-hero">
        <div className="abc-hero-character left">
          <img src="/images/abc_boy_podium.png" alt="Boy learning ABC" />
        </div>
        
        <div className="abc-hero-content">
          <h1 className="abc-hero-title">Learn ABC</h1>
          <p className="abc-hero-desc">
            Tap on a letter to explore fun words and cool pictures! Learning is a big adventure.
          </p>
          <button 
            className={`abc-sound-btn ${isPlayingSequence ? "playing" : ""}`}
            onClick={playSequence} 
            title={isPlayingSequence ? "Stop Sequence" : "Play A-Z Sequence"}
          >
            {isPlayingSequence ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="abc-hero-character right">
          <img src="/images/abc_girl_podium.png" alt="Girl learning ABC" />
        </div>
      </section>

      {/* ABC Letters Grid */}
      <div className="abc-glass-container">
        <section className="abc-letters-grid">
          {alphabet.map((item, idx) => {
            const isPlaying = activeLetter === item.letter;
            return (
              <div
                key={item.letter}
                id={`abc-card-${item.letter}`}
                className={`abc-letter-card ${isPlaying ? "active" : ""}`}
                onClick={() => handleCardClick(item.letter, item.word)}
                style={{ "--card-color": item.color }}
              >
                <div className="abc-card-letter" style={{ color: item.color }}>
                  {item.letter}
                </div>
                <div className="abc-card-img-circle">
                  <img src={item.img} alt={item.word} />
                </div>
                <div className="abc-card-word">{item.word}</div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
