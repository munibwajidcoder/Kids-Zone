"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakImmediate, speakTextPromise, cancelSpeech } from "@/utils/speech";
import "./days.css";

export default function DaysPage() {
  const [activeDay, setActiveDay] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const isPlayingRef = useRef(false);

  const daysOfWeek = [
    { 
      name: "Monday", 
      themeColor: "#fb923c", // Coral/Orange
      icon: "/images/day_moon.png",
      mainImg: "/images/day_monday.png"
    },
    { 
      name: "Tuesday", 
      themeColor: "#facc15", // Yellow
      icon: "/images/day_rocket.png",
      mainImg: "/images/day_tuesday.png"
    },
    { 
      name: "Wednesday", 
      themeColor: "#4ade80", // Green
      icon: "/images/day_seed.png",
      mainImg: "/images/day_wednesday.png"
    },
    { 
      name: "Thursday", 
      themeColor: "#3b82f6", // Blue
      icon: "/images/day_storm.png",
      mainImg: "/images/day_thursday.png"
    },
    { 
      name: "Friday", 
      themeColor: "#6366f1", // Indigo
      icon: "/images/day_confetti.png",
      mainImg: "/images/day_friday.png"
    },
    { 
      name: "Saturday", 
      themeColor: "#c026d3", // Fuchsia/Purple
      icon: "/images/day_galaxy.png",
      mainImg: "/images/day_saturday.png"
    },
    { 
      name: "Sunday", 
      themeColor: "#ea580c", // Deep Orange/Brown
      icon: "/images/day_sun.png",
      mainImg: "/images/day_sunday.png"
    }
  ];

  const handleCardClick = (name) => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }
    setActiveDay(name);
    speakImmediate(name);
    setTimeout(() => {
      setActiveDay((prev) => (prev === name ? null : prev));
    }, 1000);
  };

  const stopSequence = () => {
    cancelSpeech();
    setIsPlayingSequence(false);
    isPlayingRef.current = false;
    setActiveDay(null);
  };

  const playSequence = async () => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    cancelSpeech();
    setIsPlayingSequence(true);
    isPlayingRef.current = true;

    for (let day of daysOfWeek) {
      if (!isPlayingRef.current) break;

      setActiveDay(day.name);
      
      const el = document.getElementById(`day-card-${day.name}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      await speakTextPromise(day.name, 0.9);
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
    <div className="days-wrapper">
      <header className="days-header">
        <div className="days-header-left">
          <span>📅</span>
        </div>
        <div className="days-header-center">
          <h1 className="days-main-title">Days of the Week</h1>
          <p className="days-subtitle">Let's learn the seven days of the week!</p>
          
          <div className="play-all-btn-wrap">
            <button 
              className={`play-all-btn ${isPlayingSequence ? "sequence-playing" : ""}`} 
              onClick={playSequence} 
              title={isPlayingSequence ? "Stop Sequence" : "Play Days Sequence"}
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
        <div className="days-header-right">
          <span>🚀</span>
        </div>
      </header>

      <section className="premium-days-grid">
        {daysOfWeek.map((day) => {
          const isPlaying = activeDay === day.name;
          return (
            <div
              key={day.name}
              id={`day-card-${day.name}`}
              className={`day-glass-card ${isPlaying ? "playing-active" : ""}`}
              onClick={() => handleCardClick(day.name)}
              style={{ "--day-color": day.themeColor }}
            >
              <div className="day-tiny-icon">
                <img src={day.icon} alt={`${day.name} icon`} />
              </div>
              <div className="day-name">
                {day.name}
              </div>
              <div className="day-main-img">
                <img src={day.mainImg} alt={day.name} />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
