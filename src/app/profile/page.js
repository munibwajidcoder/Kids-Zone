"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import "./profile.css";

export default function Profile() {
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Awesome Learner");
  
  // Kid's Details State
  const [kidDetails, setKidDetails] = useState({
    name: "",
    age: "5-7",
    gender: "boy",
    favorite: "math"
  });

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    
    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      
      // Get name from user metadata if available
      if (session.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name);
      } else {
        const savedName = localStorage.getItem("user_name");
        if (savedName) setUserName(savedName);
      }
    });

    const savedDetails = localStorage.getItem("kid_details");
    if (savedDetails) {
      setKidDetails(JSON.parse(savedDetails));
    }
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth_token");
    router.push("/");
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    localStorage.setItem("kid_details", JSON.stringify(kidDetails));
    alert("Kid's details saved successfully!");
  };

  if (!isMounted) return null;

  return (
    <div className="profile-page-wrapper">
      
      {/* Top Profile Header */}
      <div className="profile-header">
        <div className="avatar-circle">
          {/* A cute custom SVG avatar */}
          <svg viewBox="0 0 100 100" width="80" height="80">
            <circle cx="50" cy="50" r="45" fill="#fde0c4"/>
            <path d="M 30 40 Q 50 20 70 40" stroke="#8b4513" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <circle cx="35" cy="45" r="5" fill="#333"/>
            <circle cx="65" cy="45" r="5" fill="#333"/>
            <path d="M 40 65 Q 50 75 60 65" stroke="#ff4757" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <circle cx="20" cy="55" r="8" fill="#ff7eb3" opacity="0.5"/>
            <circle cx="80" cy="55" r="8" fill="#ff7eb3" opacity="0.5"/>
          </svg>
        </div>
        <h1 className="profile-name">{userName}</h1>
        <p className="profile-email">Ready for a learning adventure!</p>
        <button className="btn-logout" onClick={handleLogout}>Log Out</button>
      </div>

      {/* Kid's Details Section */}
      <div className="kids-settings-section">
        <h2 className="settings-title">My Child's Details</h2>
        <p className="settings-subtitle">Help us personalize the learning journey</p>
        
        <form className="details-form" onSubmit={handleSaveDetails}>
          <div className="form-group">
            <label>Child's Nickname</label>
            <input 
              type="text" 
              placeholder="e.g. Leo" 
              value={kidDetails.name}
              onChange={(e) => setKidDetails({...kidDetails, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Age Group</label>
            <select 
              value={kidDetails.age}
              onChange={(e) => setKidDetails({...kidDetails, age: e.target.value})}
            >
              <option value="2-4">2 - 4 Years</option>
              <option value="5-7">5 - 7 Years</option>
              <option value="8+">8+ Years</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select 
              value={kidDetails.gender}
              onChange={(e) => setKidDetails({...kidDetails, gender: e.target.value})}
            >
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
              <option value="other">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label>Favorite Activity</label>
            <select 
              value={kidDetails.favorite}
              onChange={(e) => setKidDetails({...kidDetails, favorite: e.target.value})}
            >
              <option value="math">Fun Math</option>
              <option value="abc">Alphabets & Words</option>
              <option value="rhymes">Singing Rhymes</option>
              <option value="animals">Exploring Animals</option>
            </select>
          </div>

          <button type="submit" className="btn-save">Save Details</button>
        </form>
      </div>

      {/* Subscription Plans Section */}
      <div className="plans-section">
        <h2 className="plans-title">Choose Your Learning Plan</h2>
        <p className="plans-subtitle">Unlock unlimited fun and premium activities!</p>
        
        <div className="plans-grid">
          {/* Free Trial */}
          <div className="plan-card">
            <h3 className="plan-name">Free Trial</h3>
            <div className="plan-price">
              <span className="currency">$</span>0<span className="period">/ 3 Days</span>
            </div>
            <ul className="plan-features">
              <li>Full Access for 3 Days</li>
              <li>Basic Numbers 1-10</li>
              <li>Limited Rhymes</li>
            </ul>
            <button className="btn-plan active">Current Plan</button>
          </div>

          {/* $10 Medium Plan */}
          <div className="plan-card premium">
            <div className="popular-badge">Recommended</div>
            <h3 className="plan-name">Standard Learner</h3>
            <div className="plan-price">
              <span className="currency">$</span>10<span className="period">/mo</span>
            </div>
            <ul className="plan-features">
              <li>Unlimited Math & Subtraction</li>
              <li>All Nursery Rhymes & Colors</li>
              <li>Ad-Free Experience</li>
              <li>Monthly Progress Reports</li>
            </ul>
            <button className="btn-plan upgrade">Upgrade for $10</button>
          </div>

          {/* $50 Fully Premium Plan */}
          <div className="plan-card pro">
            <h3 className="plan-name">Fully Premium</h3>
            <div className="plan-price">
              <span className="currency">$</span>50<span className="period">/year</span>
            </div>
            <ul className="plan-features">
              <li>All Standard Features</li>
              <li>Offline Downloads</li>
              <li>Parental Progress Tracking</li>
              <li>Multiple Profiles (Up to 3 Kids)</li>
              <li>Save 60% Annually!</li>
            </ul>
            <button className="btn-plan upgrade">Get Yearly Premium</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
