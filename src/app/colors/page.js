"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakImmediate, speakTextPromise, cancelSpeech } from "@/utils/speech";
import "./colors.css";

export default function ColorsPage() {
  const [activeColor, setActiveColor] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const isPlayingRef = useRef(false);

  const colorsList = [
    { name: "Red", hex: "#dc2626", emoji: "🍎", desc: "Like a yummy juicy apple!" },
    { name: "Blue", hex: "#2563eb", emoji: "🌊", desc: "Like the deep blue ocean!" },
    { name: "Green", hex: "#16a34a", emoji: "🌿", desc: "Like the fresh spring leaves!" },
    { name: "Yellow", hex: "#ca8a04", emoji: "☀️", desc: "Like the bright morning sun!" },
    { name: "Orange", hex: "#ea580c", emoji: "🍊", desc: "Like a sweet orange fruit!" },
    { name: "Purple", hex: "#9333ea", emoji: "🍇", desc: "Like a bunch of grapes!" },
    { name: "Pink", hex: "#db2777", emoji: "🌸", desc: "Like a beautiful pink flower!" },
    { name: "Brown", hex: "#78350f", emoji: "🐻", desc: "Like a cute cuddly bear!" },
    { name: "Black", hex: "#1f2937", emoji: "🐈‍⬛", desc: "Like a mysterious dark night!" },
    { name: "White", hex: "#ffffff", emoji: "☁️", desc: "Like a fluffy cloud!" },
    { name: "Cyan", hex: "#06b6d4", emoji: "💎", desc: "Like a shiny gemstone!" },
    { name: "Gold", hex: "#fbbf24", emoji: "👑", desc: "Like a royal golden crown!" }
  ];

  const stopSequence = () => {
    cancelSpeech();
    setIsPlayingSequence(false);
    isPlayingRef.current = false;
    setActiveColor(null);
  };

  const playSequence = async () => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    cancelSpeech();
    setIsPlayingSequence(true);
    isPlayingRef.current = true;

    for (let color of colorsList) {
      if (!isPlayingRef.current) break;

      setActiveColor(color.name);
      
      const el = document.getElementById(`color-card-${color.name}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      await speakTextPromise(color.name, 0.8);
      await new Promise(res => setTimeout(res, 400));
    }

    if (isPlayingRef.current) {
      stopSequence();
    }
  };

  const handleColorClick = (colorName) => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    setActiveColor(colorName);
    speakImmediate(colorName);
    setTimeout(() => {
      setActiveColor((prev) => (prev === colorName ? null : prev));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  return (
    <div className="colors-wrapper">
      <header className="colors-header">
        <div className="colors-header-left">
          <span>🎨</span>
        </div>
        <div className="colors-header-center">
          <h1 className="colors-main-title">Learn Colors</h1>
          <p className="colors-subtitle">Let's explore the vibrant world of colors!</p>
          <button 
            className={`abc-sound-btn ${isPlayingSequence ? "playing" : ""}`}
            onClick={playSequence} 
            title={isPlayingSequence ? "Stop Sequence" : "Play All Colors"}
            style={{ margin: '0 auto', display: 'flex', marginTop: '15px' }}
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
        <div className="colors-header-right">
          <span>🖌️</span>
        </div>
      </header>

      <section className="premium-colors-grid">
        {colorsList.map((color) => {
          const isPlaying = activeColor === color.name;
          return (
            <div
              key={color.name}
              id={`color-card-${color.name}`}
              className={`color-glass-card ${isPlaying ? "playing-active" : ""}`}
              onClick={() => handleColorClick(color.name)}
              style={{ "--card-color": color.hex }}
            >
              <div 
                className="color-3d-orb" 
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${color.name === 'White' ? '#fff' : color.hex}, ${color.name === 'White' ? '#dcdcdc' : '#000'})`
                }}
              >
                <span className="color-orb-emoji">{color.emoji}</span>
              </div>
              <div className="color-name">{color.name}</div>
              <div className="color-desc">{color.desc}</div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
