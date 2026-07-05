"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakTextPromise, cancelSpeech } from "@/utils/speech";
import "./tables.css";

export default function TablesPage() {
  const [playingTable, setPlayingTable] = useState(null);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const isPlayingRef = useRef(null);

  const tables = [
    { num: 2, color: "#3b82f6" }, // Blue
    { num: 3, color: "#eab308" }, // Yellow
    { num: 4, color: "#ef4444" }, // Red
    { num: 5, color: "#22c55e" }, // Green
    { num: 6, color: "#a855f7" }, // Purple
    { num: 7, color: "#f97316" }, // Orange
    { num: 8, color: "#14b8a6" }, // Teal
    { num: 9, color: "#ec4899" }, // Pink
    { num: 10, color: "#3b82f6" } // Blue again
  ];

  const stopSequence = () => {
    cancelSpeech();
    setPlayingTable(null);
    setActiveRowIndex(null);
    isPlayingRef.current = null;
  };

  const playTableSequence = async (tableNum) => {
    if (playingTable === tableNum) {
      stopSequence();
      return;
    }

    cancelSpeech();
    setPlayingTable(tableNum);
    isPlayingRef.current = tableNum;

    for (let i = 1; i <= 10; i++) {
      if (isPlayingRef.current !== tableNum) break;

      setActiveRowIndex(i);

      const text = `${tableNum} ${i} za ${tableNum * i}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1; 
      utterance.pitch = 1.1;

      if (window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")) && v.lang.startsWith("en"));
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      await new Promise((resolve) => {
        utterance.onend = () => setTimeout(resolve, 100); 
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }

    if (isPlayingRef.current === tableNum) {
      stopSequence();
    }
  };

  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  return (
    <div className="tables-wrapper">
      <header className="tables-header">
        <div className="tables-header-left">
          <span>✨</span>
        </div>
        <div className="tables-header-center">
          <h1 className="tables-main-title">Learn Tables</h1>
          <p className="tables-subtitle">Discover the magic of numbers with our multiplication playground!</p>
        </div>
        <div className="tables-header-right">
          <span>🚀</span>
        </div>
      </header>

      <section className="premium-tables-grid">
        {tables.map((table) => {
          const isCurrentTablePlaying = playingTable === table.num;
          return (
            <div
              key={table.num}
              className="table-glass-card"
              style={{ "--table-color": table.color }}
            >
              <div className="table-card-header">
                <button
                  className={`table-play-btn ${isCurrentTablePlaying ? "playing" : ""}`}
                  onClick={() => playTableSequence(table.num)}
                  title={isCurrentTablePlaying ? "Stop Table" : `Play Table ${table.num}`}
                >
                  {isCurrentTablePlaying ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  )}
                </button>
                <div className="table-num-badge">
                  {table.num}
                </div>
                <div className="table-title-text">
                  Times Table
                </div>
              </div>

              <div className="table-rows-container">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
                  const isActive = isCurrentTablePlaying && activeRowIndex === i;
                  return (
                    <div key={i} className={`table-row ${isActive ? "row-active" : ""}`}>
                      <span>{table.num}</span>
                      <span className="math-operator">x</span>
                      <span>{i}</span>
                      <span className="math-operator">=</span>
                      <span>{table.num * i}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
