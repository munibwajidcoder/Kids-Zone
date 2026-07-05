"use client";

import React, { useState, useEffect } from "react";
import { speakImmediate, cancelSpeech } from "@/utils/speech";
import "./vegetables.css";

export default function VegetablesPage() {
  const [activeVeg, setActiveVeg] = useState(null);

  const vegetablesList = [
    {
      name: "Carrot",
      img: "/images/veg_carrot.png",
      themeColor: "#ea580c" // Orange
    },
    {
      name: "Potato",
      img: "/images/veg_potato.png",
      themeColor: "#ca8a04" // Yellow/Brown
    },
    {
      name: "Tomato",
      img: "/images/veg_tomato.png",
      themeColor: "#ef4444" // Red
    },
    {
      name: "Cabbage",
      img: "/images/veg_cabbage.png",
      themeColor: "#22c55e" // Green
    },
    {
      name: "Onion",
      img: "/images/veg_onion.png",
      themeColor: "#a855f7" // Purple/Pink
    },
    {
      name: "Broccoli",
      img: "/images/veg_broccoli.png",
      themeColor: "#15803d" // Dark Green
    },
    {
      name: "Corn",
      img: "/images/veg_corn.png",
      themeColor: "#eab308" // Yellow
    },
    {
      name: "Pumpkin",
      img: "/images/veg_pumpkin.png",
      themeColor: "#f97316" // Orange
    },
    {
      name: "Eggplant",
      img: "/images/veg_eggplant.png",
      themeColor: "#7e22ce" // Deep Purple
    },
    {
      name: "Mushroom",
      img: "/images/veg_mushroom.png",
      themeColor: "#78350f" // Brown
    },
    {
      name: "Garlic",
      img: "/images/veg_garlic.png",
      themeColor: "#f1f5f9" // Off White
    },
    {
      name: "Pepper",
      img: "/images/veg_pepper.png",
      themeColor: "#ef4444" // Red
    }
  ];

  const handleVegClick = (name) => {
    setActiveVeg(name);
    speakImmediate(name);
    setTimeout(() => {
      setActiveVeg((prev) => (prev === name ? null : prev));
    }, 1000); // slightly longer to enjoy the glow
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
