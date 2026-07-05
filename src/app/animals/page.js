"use client";

import React, { useState, useEffect, useRef } from "react";
import { speakImmediate, cancelSpeech } from "@/utils/speech";
import "./animals.css";

export default function AnimalsPage() {
  const [activeAnimal, setActiveAnimal] = useState(null);
  const audioRef = useRef(null);

  const animalsList = [
    {
      name: "Cat",
      img: "/images/animal_cat.png",
      themeColor: "#f59e0b", // Amber/Orange for Cat
      soundPath: "/audio/stu9-cute-cat-352656.mp3"
    },
    {
      name: "Dog",
      img: "/images/animal_dog.png",
      themeColor: "#3b82f6", // Blue for Dog
      soundPath: "/audio/dog-barking-102552.mp3"
    },
    {
      name: "Cow",
      img: "/images/animal_cow.png",
      themeColor: "#10b981", // Green for Cow
      soundPath: "/audio/cow-moo-sound-effect-for-y-38507.mp3"
    },
    {
      name: "Lion",
      img: "/images/animal_lion.png",
      themeColor: "#ef4444", // Red/Orange for Lion
      soundPath: "/audio/lion-roar-6011.mp3"
    },
    {
      name: "Elephant",
      img: "/images/animal_elephant.png",
      themeColor: "#8b5cf6", // Purple for Elephant
      soundPath: "/audio/elephant-trumpets-43640.mp3"
    },
    {
      name: "Monkey",
      img: "/images/animal_monkey.png",
      themeColor: "#8b4513", // SaddleBrown for Monkey
      soundPath: "/audio/monkey.mp3"
    },
    {
      name: "Tiger",
      img: "/images/animal_tiger.png",
      themeColor: "#ea580c", // Orange for Tiger
      soundPath: "/audio/tiger.mp3"
    },
    {
      name: "Sheep",
      img: "/images/animal_sheep.png",
      themeColor: "#d4d4d8", // Light Gray for Sheep
      soundPath: "/audio/sheep.mp3"
    },
    {
      name: "Horse",
      img: "/images/animal_horse.png",
      themeColor: "#a16207", // Dark Yellow/Brown for Horse
      soundPath: "/audio/horse.mp3"
    },
    {
      name: "Bear",
      img: "/images/animal_bear.png",
      themeColor: "#451a03", // Dark Brown for Bear
      soundPath: "/audio/bear.mp3"
    },
    {
      name: "Zebra",
      img: "/images/animal_zebra.png",
      themeColor: "#3f3f46", // Dark Gray/Black for Zebra
      soundPath: "/audio/zebra.mp3"
    },
    {
      name: "Panda",
      img: "/images/animal_panda.png",
      themeColor: "#10b981", // Green (Bamboo) for Panda
      soundPath: "/audio/panda.mp3"
    }
  ];

  const handleAnimalClick = (animal) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    cancelSpeech();

    setActiveAnimal(animal.name);
    speakImmediate(animal.name);

    setTimeout(() => {
      const audio = new Audio(animal.soundPath);
      audioRef.current = audio;
      audio.play()
        .catch((err) => console.log("Sound effect play error:", err));

      audio.onended = () => {
        setActiveAnimal(null);
      };
    }, 750);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      cancelSpeech();
    };
  }, []);

  return (
    <div className="animals-wrapper">
      <header className="animals-header">
        <div className="animals-header-left">
          <span>🦁</span>
        </div>
        <div className="animals-header-center">
          <h1 className="animals-main-title">Learn Animals</h1>
          <p className="animals-subtitle">Discover your favorite friends from the wild and the farm!</p>
        </div>
        <div className="animals-header-right">
          <span>🐘</span>
        </div>
      </header>

      <section className="premium-animals-grid">
        {animalsList.map((animal) => {
          const isPlaying = activeAnimal === animal.name;
          return (
            <div
              key={animal.name}
              className={`animal-glass-card ${isPlaying ? "playing-active" : ""}`}
              onClick={() => handleAnimalClick(animal)}
              style={{ "--card-color": animal.themeColor }}
            >
              <div className="animal-img-crop">
                <img src={animal.img} alt={animal.name} />
              </div>
              <h3 className="animal-title">
                <span className="animal-speaker-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                </span>
                {animal.name}
              </h3>
            </div>
          );
        })}

      </section>
    </div>
  );
}
