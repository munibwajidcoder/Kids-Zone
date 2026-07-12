"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakImmediate, speakTextPromise, cancelSpeech } from "@/utils/speech";
import "./vegetables.css";

export default function VegetablesPage() {
  const [activeVeg, setActiveVeg] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const isPlayingRef = useRef(false);

  const vegetablesList = [
    { name: "Carrot", img: "/images/veg_carrot.png", themeColor: "#ea580c" },
    { name: "Potato", img: "/images/veg_potato.png", themeColor: "#ca8a04" },
    { name: "Tomato", img: "/images/veg_tomato.png", themeColor: "#ef4444" },
    { name: "Cabbage", img: "/images/veg_cabbage.png", themeColor: "#22c55e" },
    { name: "Onion", img: "/images/veg_onion.png", themeColor: "#a855f7" },
    { name: "Broccoli", img: "/images/veg_broccoli.png", themeColor: "#15803d" },
    { name: "Corn", img: "/images/veg_corn.png", themeColor: "#eab308" },
    { name: "Pumpkin", img: "/images/veg_pumpkin.png", themeColor: "#f97316" },
    { name: "Eggplant", img: "/images/veg_eggplant.png", themeColor: "#7e22ce" },
    { name: "Mushroom", img: "/images/veg_mushroom.png", themeColor: "#78350f" },
    { name: "Garlic", img: "/images/veg_garlic.png", themeColor: "#f1f5f9" },
    { name: "Pepper", img: "/images/veg_pepper.png", themeColor: "#ef4444" }
  ];

  const stopSequence = () => {
    cancelSpeech();
    setIsPlayingSequence(false);
    isPlayingRef.current = false;
    setActiveVeg(null);
  };

  const playSequence = async () => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    cancelSpeech();
    setIsPlayingSequence(true);
    isPlayingRef.current = true;

    for (let veg of vegetablesList) {
      if (!isPlayingRef.current) break;

      setActiveVeg(veg.name);
      
      const el = document.getElementById(`veg-card-${veg.name}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      await speakTextPromise(veg.name, 0.8);
      await new Promise(res => setTimeout(res, 400));
    }

    if (isPlayingRef.current) {
      stopSequence();
    }
  };

  const handleVegClick = (name) => {
    if (isPlayingSequence) {
      stopSequence();
      return;
    }

    setActiveVeg(name);
    speakImmediate(name);
    setTimeout(() => {
      setActiveVeg((prev) => (prev === name ? null : prev));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  return (
    <div className="vegetables-wrapper">
      <header className="vegetables-header">
        <div className="vegetables-header-left">
          <span>🥦</span>
        </div>
        <div className="vegetables-header-center">
          <h1 className="vegetables-main-title">Learn Vegetables</h1>
          <p className="vegetables-subtitle">Healthy veggies for healthy kids! Let's name them.</p>
          <button 
            className={`abc-sound-btn ${isPlayingSequence ? "playing" : ""}`}
            onClick={playSequence} 
            title={isPlayingSequence ? "Stop Sequence" : "Play All Vegetables"}
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
        <div className="vegetables-header-right">
          <span>🥕</span>
        </div>
      </header>

      <section className="premium-vegetables-grid">
        {vegetablesList.map((veg) => {
          const isPlaying = activeVeg === veg.name;
          return (
            <div
              key={veg.name}
              id={`veg-card-${veg.name}`}
              className={`veg-glass-card ${isPlaying ? "playing-active" : ""}`}
              onClick={() => handleVegClick(veg.name)}
              style={{ "--card-color": veg.themeColor }}
            >
              <div className="veg-img-crop">
                <img src={veg.img} alt={veg.name} />
              </div>
              <h3 className="veg-title">
                {veg.name}
              </h3>
            </div>
          );
        })}
      </section>
    </div>
  );
}
