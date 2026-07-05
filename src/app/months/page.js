"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakImmediate, speakTextPromise, cancelSpeech } from "@/utils/speech";
import "./months.css";

export default function MonthsPage() {
  const [activeMonth, setActiveMonth] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const isPlayingRef = useRef(false);

  // We are using existing placeholder images for some months since new 3D image generation is temporarily paused.
  const months = [
    { name: "January", season: "Winter", themeColor: "#3b82f6", img: "/images/months/january.png" },
    { name: "February", season: "Winter", themeColor: "#ec4899", img: "/images/months/february.png" },
    { name: "March", season: "Spring", themeColor: "#22c55e", img: "/images/months/march.png" },
    { name: "April", season: "Spring", themeColor: "#facc15", img: "/images/months/march.png" },
    { name: "May", season: "Spring", themeColor: "#a855f7", img: "/images/months/march.png" },
    { name: "June", season: "Summer", themeColor: "#ef4444", img: "/images/months/february.png" },
    { name: "July", season: "Summer", themeColor: "#f97316", img: "/images/months/february.png" },
    { name: "August", season: "Summer", themeColor: "#eab308", img: "/images/months/february.png" },
    { name: "September", season: "Autumn", themeColor: "#d97706", img: "/images/months/december.png" },
    { name: "October", season: "Autumn", themeColor: "#ea580c", img: "/images/months/december.png" },
    { name: "November", season: "Autumn", themeColor: "#78350f", img: "/images/months/december.png" },
    { name: "December", season: "Winter", themeColor: "#0ea5e9", img: "/images/months/december.png" }
  ];

  const handleCardClick = (name) => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }
    setActiveMonth(name);
    speakImmediate(name);
    setTimeout(() => {
      setActiveMonth((prev) => (prev === name ? null : prev));
    }, 1000);
  };

  const stopSequence = () => {
    cancelSpeech();
    setIsPlayingSequence(false);
    isPlayingRef.current = false;
    setActiveMonth(null);
  };

  const playSequence = async () => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    cancelSpeech();
    setIsPlayingSequence(true);
    isPlayingRef.current = true;

    for (let month of months) {
      if (!isPlayingRef.current) break;

      setActiveMonth(month.name);
      
      const el = document.getElementById(`month-card-${month.name}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      await speakTextPromise(month.name, 0.95);
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
    <div className="months-wrapper">
      <header className="months-header">
        <div className="months-header-left">
          <span>❄️</span>
        </div>
        <div className="months-header-center">
          <h1 className="months-main-title">Months of the Year</h1>
          <p className="months-subtitle">Can you name all 12 months? Let's say them together!</p>
          
          <div className="play-all-btn-wrap">
            <button 
              className={`play-all-btn ${isPlayingSequence ? "sequence-playing" : ""}`} 
              onClick={playSequence} 
              title={isPlayingSequence ? "Stop Sequence" : "Play Months Sequence"}
            >
              {isPlayingSequence ? (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="months-header-right">
          <span>☀️</span>
        </div>
      </header>

      <section className="premium-months-grid">
        {months.map((month) => {
          const isPlaying = activeMonth === month.name;
          return (
            <div
              key={month.name}
              id={`month-card-${month.name}`}
              className={`month-glass-card ${isPlaying ? "playing-active" : ""}`}
              onClick={() => handleCardClick(month.name)}
              style={{ "--month-color": month.themeColor }}
            >
              <div className="month-main-img">
                {month.img ? (
                  <img src={month.img} alt={`${month.name} background`} />
                ) : (
                  <span style={{ fontSize: "50px" }}>🌟</span>
                )}
              </div>
              <div className="month-name">
                {month.name}
              </div>
              <div className="month-season">
                {month.season}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
