"use client";

import React, { useState, useEffect } from "react";
import { speakImmediate, cancelSpeech } from "@/utils/speech";
import "./colors.css";

export default function ColorsPage() {
  const [activeColor, setActiveColor] = useState(null);

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

  const handleColorClick = (colorName) => {
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
