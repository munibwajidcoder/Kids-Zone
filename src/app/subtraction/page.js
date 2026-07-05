"use client";

import React, { useState, useEffect } from "react";
import { speakImmediate, cancelSpeech } from "@/utils/speech";
import "./subtraction.css";

export default function SubtractionPage() {
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(2);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // true, false or null
  const [shake, setShake] = useState(false);

  const correctPraise = ["Fantastic!", "Excellent!", "Brilliant!", "Great Job!", "Wonderful!", "You did it!"];
  const incorrectEncourage = ["Try again, buddy!", "So close! Try one more time.", "Almost! Count the remaining apples.", "Keep trying! You can do it!"];

  const generateQuestion = () => {
    // Generate num1 between 3 and 10
    const n1 = Math.floor(Math.random() * 8) + 3;
    // Generate num2 between 1 and n1 - 1 (so result is positive and >= 1)
    const n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
    
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
    const correctAnswer = num1 - num2;

    if (parsedAnswer === correctAnswer) {
      setIsSuccess(true);
      const praise = correctPraise[Math.floor(Math.random() * correctPraise.length)];
      setFeedback(`🎉 ${praise}`);
      
      speakImmediate(`${praise}. ${num1} minus ${num2} equals ${correctAnswer}!`);

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
    <div className="subtraction-wrapper">
      <header className="subtraction-header">
        <div className="subtraction-header-left">
          <span>🍎</span>
        </div>
        <div className="subtraction-header-center">
          <h1 className="subtraction-main-title">Subtraction Fun</h1>
          <p className="subtraction-subtitle">Count the yummy apples and find the magic number!</p>
        </div>
        <div className="subtraction-header-right">
          <span>➖</span>
        </div>
      </header>

      <section className="subtraction-container anim-roll">
        <div className="glass-panel sub-math-board">
          <div className="apple-row">
            {/* Initial Apple Group */}
            <div className="apple-group-blue" id="sub-apple-group-1">
              {[...Array(num1)].map((_, i) => (
                <div key={i} className="apple-item anim-zoom" style={{ animationDelay: `${i * 40}ms` }}>
                  <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Red%20apple/3D/red_apple_3d.png" alt="Apple" />
                </div>
              ))}
            </div>

            <div className="minus-sign">-</div>

            {/* Faded Taken-away Apple Group */}
            <div className="apple-group-yellow" id="sub-apple-group-2">
              {[...Array(num2)].map((_, i) => (
                <div 
                  key={i} 
                  className="apple-item taken-away anim-zoom" 
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Red%20apple/3D/red_apple_3d.png" alt="Apple" />
                </div>
              ))}
            </div>
          </div>

          <div className="equation-pill">
            <span className="eq-num-blue">{num1}</span>
            <span className="eq-symbol-minus">-</span>
            <span className="eq-num-gold">{num2}</span>
            <span className="eq-symbol">=</span>
            <div className={`dashed-question ${shake ? "shake-anim" : ""} ${isSuccess ? "success-highlight" : ""}`}>
              <span>{isSuccess ? num1 - num2 : "?"}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel sub-interaction-board">
          <h3 className="sub-interaction-title">Can you solve it?</h3>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div className="sub-input-container">
              <input
                type="number"
                className="sub-quiz-input"
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
