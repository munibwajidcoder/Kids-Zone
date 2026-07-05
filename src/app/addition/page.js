"use client";

import React, { useState, useEffect } from "react";
import { speakImmediate, cancelSpeech } from "@/utils/speech";
import "./addition.css";

export default function AdditionPage() {
  const [num1, setNum1] = useState(2);
  const [num2, setNum2] = useState(3);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // true, false or null
  const [shake, setShake] = useState(false);

  const correctPraise = ["Fantastic!", "Excellent!", "Brilliant!", "Great Job!", "Wonderful!", "You did it!"];
  const incorrectEncourage = ["Try again, buddy!", "So close! Try one more time.", "Almost! Count the apples again.", "Keep trying! You can do it!"];

  const generateQuestion = () => {
    // Generate two random numbers between 1 and 8
    const n1 = Math.floor(Math.random() * 8) + 1;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setNum1(n1);
    setNum2(n2);
    setAnswer("");
    setFeedback("");
    setIsSuccess(null);
  };

  useEffect(() => {
    generateQuestion();
    return () => {
      cancelSpeech();
    };
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (answer.trim() === "") return;

    const parsedAnswer = parseInt(answer, 10);
    const correctAnswer = num1 + num2;

    if (parsedAnswer === correctAnswer) {
      setIsSuccess(true);
      const praise = correctPraise[Math.floor(Math.random() * correctPraise.length)];
      setFeedback(`🎉 ${praise}`);
      
      // Speak the praise and then read the equation
      speakImmediate(`${praise}. ${num1} plus ${num2} equals ${correctAnswer}!`);

      // Shuffle new question after 2.5 seconds
      setTimeout(() => {
        generateQuestion();
      }, 2500);
    } else {
      setIsSuccess(false);
      setShake(true);
      const encouragement = incorrectEncourage[Math.floor(Math.random() * incorrectEncourage.length)];
      setFeedback(`❌ ${encouragement}`);
      speakImmediate(encouragement);

      // Reset shake after animation
      setTimeout(() => {
        setShake(false);
      }, 500);
    }
  };

  return (
    <div className="addition-wrapper">
      <header className="addition-header">
        <div className="addition-header-left">
          <span>🍎</span>
        </div>
        <div className="addition-header-center">
          <h1 className="addition-main-title">Addition Fun</h1>
          <p className="addition-subtitle">Count the yummy apples and find the magic number!</p>
        </div>
        <div className="addition-header-right">
          <span>✨</span>
        </div>
      </header>

      <section className="addition-container anim-roll">
        <div className="glass-panel math-board">
          <div className="apple-row">
            {/* Blue Apple Group */}
            <div className="apple-group-blue" id="apple-group-1">
              {[...Array(num1)].map((_, i) => (
                <div key={i} className="apple-item anim-zoom" style={{ animationDelay: `${i * 40}ms` }}>
                  <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Red%20apple/3D/red_apple_3d.png" alt="Apple" />
                </div>
              ))}
            </div>

            <div className="plus-sign">+</div>

            {/* Yellow Apple Group */}
            <div className="apple-group-yellow" id="apple-group-2">
              {[...Array(num2)].map((_, i) => (
                <div key={i} className="apple-item anim-zoom" style={{ animationDelay: `${i * 40}ms` }}>
                  <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Red%20apple/3D/red_apple_3d.png" alt="Apple" />
                </div>
              ))}
            </div>
          </div>

          <div className="equation-pill">
            <span className="eq-num-blue">{num1}</span>
            <span className="eq-symbol">+</span>
            <span className="eq-num-gold">{num2}</span>
            <span className="eq-symbol">=</span>
            <div className={`dashed-question ${shake ? "shake-anim" : ""} ${isSuccess ? "success-highlight" : ""}`}>
              <span>{isSuccess ? num1 + num2 : "?"}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel interaction-board">
          <h3 className="interaction-title">Can you solve it?</h3>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div className="input-container">
              <input
                type="number"
                className="quiz-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer.."
                min="0"
                max="20"
                disabled={isSuccess === true}
                autoFocus
              />
            </div>
            <button 
              type="submit" 
              className="check-answer-btn"
              disabled={isSuccess === true}
            >
              Check Answer
            </button>
          </form>

          {feedback && (
            <div
              style={{
                marginTop: "25px",
                fontWeight: "900",
                fontSize: "26px",
                color: isSuccess ? "#4ade80" : "#ef4444",
                textShadow: isSuccess ? "0 0 15px rgba(74, 222, 128, 0.5)" : "0 0 15px rgba(239, 68, 68, 0.5)",
                textAlign: "center",
                transition: "all 0.3s ease"
              }}
            >
              {feedback}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
