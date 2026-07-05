"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakImmediate, speakTextPromise, cancelSpeech } from "@/utils/speech";
import "./numbers.css";

export default function NumbersPage() {
  const [activeNumber, setActiveNumber] = useState(null);
  const [playingSequence, setPlayingSequence] = useState(null);
  const isPlayingRef = useRef(null);

  const oneToTen = [
    { num: 1, word: "One", color: "bg-blue", emoji: "🚂" },
    { num: 2, word: "Two", color: "bg-green", emoji: "🦆" },
    { num: 3, word: "Three", color: "bg-red", emoji: "🎈" },
    { num: 4, word: "Four", color: "bg-purple", emoji: "🪁" },
    { num: 5, word: "Five", color: "bg-orange", emoji: "⭐" },
    { num: 6, word: "Six", color: "bg-teal", emoji: "🖍️" },
    { num: 7, word: "Seven", color: "bg-pink", emoji: "🍎" },
    { num: 8, word: "Eight", color: "bg-blue", emoji: "🎾" },
    { num: 9, word: "Nine", color: "bg-green", emoji: "🧁" },
    { num: 10, word: "Ten", color: "bg-purple", emoji: "🕯️" }
  ];

  const bigNumbers1 = Array.from({ length: 40 }, (_, i) => i + 11);
  const bigNumbers2 = Array.from({ length: 50 }, (_, i) => i + 51);

  const getCircleColor = (num) => {
    if (num === 100) return "#f97316";
    const mod = num % 5;
    if (mod === 0) return "#a855f7"; // purple
    if (mod === 1) return "#3b82f6"; // blue
    if (mod === 2) return "#22c55e"; // green
    if (mod === 3) return "#ec4899"; // pink
    if (mod === 4) return "#f97316"; // orange
    return "#3b82f6";
  };

  const handleCardClick = (num) => {
    if (playingSequence) stopSequence();
    setActiveNumber(num);
    speakImmediate(num.toString());
    setTimeout(() => setActiveNumber((prev) => (prev === num ? null : prev)), 800);
  };

  const handleCircleClick = (num) => {
    if (playingSequence) stopSequence();
    speakImmediate(num.toString());
    setActiveNumber(num);
    setTimeout(() => setActiveNumber((prev) => (prev === num ? null : prev)), 400);
  };

  const stopSequence = () => {
    cancelSpeech();
    setPlayingSequence(null);
    isPlayingRef.current = null;
    setActiveNumber(null);
  };

  const playSequence = async (start, end) => {
    const seqId = `${start}-${end}`;
    if (playingSequence === seqId) {
      stopSequence();
      return;
    }

    cancelSpeech();
    setPlayingSequence(seqId);
    isPlayingRef.current = seqId;

    for (let i = start; i <= end; i++) {
      if (isPlayingRef.current !== seqId) break;
      setActiveNumber(i);
      
      const el = document.getElementById(`pill-${i}`) || document.getElementById(`card-${i}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

      await speakTextPromise(i.toString(), 1.0);
    }

    if (isPlayingRef.current === seqId) stopSequence();
  };

  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  return (
    <div className="numbers-wrapper">
      {/* Header */}
      <header className="num-header">
        <div className="header-left">
          <span>⭐</span>
        </div>
        <div className="header-center">
          <h1 className="num-main-title">Learn Numbers</h1>
          <p className="num-subtitle">Let's count together from 1 to 100!</p>
        </div>
        <div className="header-right">
          <span style={{color: '#3b82f6'}}>1</span>
          <span style={{color: '#eab308'}}>2</span>
          <span style={{color: '#ec4899'}}>3</span>
        </div>
      </header>

      {/* 1 to 10 Section */}
      <div className="num-glass-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span style={{color: '#eab308'}}>⭐</span> Counting 1 to 10
          </div>
          <button 
            className={`play-icon-btn ${playingSequence === '1-10' ? 'playing' : ''}`}
            onClick={() => playSequence(1, 10)}
            title="Play 1 to 10"
          >
            {playingSequence === '1-10' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
          </button>
        </div>
        <div className="cards-1to10">
          {oneToTen.map((item) => (
            <div 
              key={item.num}
              id={`card-${item.num}`}
              className={`num-card-1-10 ${item.color} ${activeNumber === item.num ? 'active' : ''}`}
              onClick={() => handleCardClick(item.num)}
            >
              <div className="card-num">{item.num}</div>
              <div className="card-graphic">{item.emoji}</div>
              <div className="card-word">{item.word}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 11 to 50 Section */}
      <div className="num-glass-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span style={{color: '#3b82f6', transform: 'rotate(45deg)', display: 'inline-block'}}>➚</span> Big Numbers: 11 to 50
          </div>
          <button 
            className={`play-icon-btn ${playingSequence === '11-50' ? 'playing' : ''}`}
            onClick={() => playSequence(11, 50)}
          >
            {playingSequence === '11-50' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
          </button>
        </div>
        
        <div className="big-num-layout">
          <div className="pills-grid">
            {bigNumbers1.map((num) => {
              const color = getCircleColor(num);
              return (
                <div
                  key={num}
                  id={`pill-${num}`}
                  className={`num-pill ${activeNumber === num ? 'active' : ''}`}
                  style={{ "--pill-color": color }}
                  onClick={() => handleCircleClick(num)}
                >
                  {num}
                </div>
              );
            })}
          </div>
          <div className="side-graphic">
            <img 
              src="/images/abc_girl_podium.png" 
              alt="3D Girl learning" 
              style={{ 
                width: '180px', 
                objectFit: 'contain', 
                animation: 'float-3d-num 6s ease-in-out infinite',
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))'
              }} 
            />
          </div>
        </div>
      </div>

      {/* 51 to 100 Section */}
      <div className="num-glass-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span style={{color: '#f97316'}}>🔒</span> The 100 Club: 51 to 100
          </div>
          <button 
            className={`play-icon-btn ${playingSequence === '51-100' ? 'playing' : ''}`}
            onClick={() => playSequence(51, 100)}
          >
            {playingSequence === '51-100' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
          </button>
        </div>
        
        <div className="pills-grid">
          {bigNumbers2.map((num) => {
            const color = getCircleColor(num);
            return (
              <div
                key={num}
                id={`pill-${num}`}
                className={`num-pill ${activeNumber === num ? 'active' : ''}`}
                style={{ "--pill-color": color }}
                onClick={() => handleCircleClick(num)}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="num-footer-banner">
        <span>⭐</span>
        Great job! Keep counting and become a number hero! 
        <span>🏆</span>
        <span>🚀</span>
      </div>
    </div>
  );
}
