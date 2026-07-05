"use client";

import React, { useState, useEffect, useRef } from "react";
import { cancelSpeech } from "@/utils/speech";
import "./rhymes.css";

export default function RhymesPage() {
  const [playingRhyme, setPlayingRhyme] = useState(null); // 'twinkle', 'johnny', 'abc' or null
  const audioRef = useRef(null);

  const rhymes = [
    {
      id: "twinkle",
      title: "Twinkle Twinkle",
      badge: "BEDTIME CLASSIC",
      desc: '"Twinkle, twinkle, little star, How I wonder what you are!"',
      themeColor: "#3b82f6", // Blue neon glow
      img: "/images/rhyme_twinkle.png",
      audioPath: "/audio/01 Twinkle Twinkle Little Star.m4a"
    },
    {
      id: "johnny",
      title: "Johnny Johnny",
      badge: "PLAYFUL ACTION",
      desc: '"Johny, Johny, Yes Papa? Eating sugar? No Papa!"',
      themeColor: "#eab308", // Yellow neon glow
      img: "/images/rhyme_johnny.png",
      audioPath: "/audio/03 Johny Johny Yes Papa.m4a"
    },
    {
      id: "abc",
      title: "ABC Song",
      badge: "LEARNING FUN",
      desc: '"A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P!"',
      themeColor: "#ef4444", // Red neon glow
      img: "/images/rhyme_abc.png",
      audioPath: "/audio/02 ABC Phonics Song.m4a"
    }
  ];

  const handleRhymePlay = (rhyme) => {
    cancelSpeech();

    if (playingRhyme === rhyme.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingRhyme(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(rhyme.audioPath);
    audioRef.current = audio;
    
    audio.play()
      .then(() => {
        setPlayingRhyme(rhyme.id);
      })
      .catch((err) => {
        console.error("Audio playback error:", err);
      });

    audio.onended = () => {
      setPlayingRhyme(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="rhymes-wrapper">
      <header className="rhymes-header">
        <div className="rhymes-header-left">
          <span>🎶</span>
        </div>
        <div className="rhymes-header-center">
          <h1 className="rhymes-main-title">Fun Rhymes</h1>
          <p className="rhymes-subtitle">Sing along and dance with our favorite nursery rhymes!</p>
        </div>
        <div className="rhymes-header-right">
          <span>🎵</span>
        </div>
      </header>

      <section className="premium-rhymes-grid">
        {rhymes.map((rhyme) => {
          const isPlaying = playingRhyme === rhyme.id;
          return (
            <div
              key={rhyme.id}
              className={`rhyme-glass-card ${isPlaying ? "playing-active" : ""}`}
              style={{ "--rhyme-color": rhyme.themeColor }}
            >
              <div className="rhyme-img-container">
                <img src={rhyme.img} alt={rhyme.title} />
              </div>
              <div className="rhyme-content">
                <span className="rhyme-badge">{rhyme.badge}</span>
                <h3 className="rhyme-title">{rhyme.title}</h3>
                <p className="rhyme-desc">{rhyme.desc}</p>
                <button
                  className={`rhyme-play-btn ${isPlaying ? "playing" : ""}`}
                  onClick={() => handleRhymePlay(rhyme)}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                  {isPlaying ? "Pause Now" : "Sing Now"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
