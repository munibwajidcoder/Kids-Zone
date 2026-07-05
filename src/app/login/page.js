"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import "./login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState("email"); // "email" or "phone"
  
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleEmailAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      if (fullName) localStorage.setItem("user_name", fullName);
    }
    router.push("/");
  };

  const handlePhoneAuth = async () => {
    if (!otpSent) {
      // Step 1: Send OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      if (error) throw error;
      setOtpSent(true);
    } else {
      // Step 2: Verify OTP
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms'
      });
      if (error) throw error;
      router.push("/");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMethod === "email") {
        await handleEmailAuth();
      } else if (authMethod === "phone") {
        await handlePhoneAuth();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) setError(error.message);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">
            {isLogin ? "Welcome Back!" : "Join Kids Zone!"}
          </h1>
          <p className="login-subtitle">
            {isLogin
              ? "Let's continue learning and playing."
              : "Create an account to start the fun."}
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="auth-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button"
            className={`btn-tab ${authMethod === 'email' ? 'active' : ''}`}
            onClick={() => { setAuthMethod('email'); setError(null); setOtpSent(false); }}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: authMethod === 'email' ? '#00d2ff' : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Email
          </button>
          <button 
            type="button"
            className={`btn-tab ${authMethod === 'phone' ? 'active' : ''}`}
            onClick={() => { setAuthMethod('phone'); setError(null); setOtpSent(false); }}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: authMethod === 'phone' ? '#00d2ff' : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Phone Number
          </button>
        </div>

        {error && <div className="error-message" style={{ color: '#ff4757', background: 'rgba(255, 71, 87, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}

        <form className="login-form" onSubmit={handleAuth}>
          
          {authMethod === "email" ? (
            <>
              {!isLogin && (
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    id="fullName" 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="hello@kidszone.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              {/* PHONE AUTH FLOW */}
              {!otpSent ? (
                <div className="input-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+923001234567" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <small style={{ color: '#a0a0a0', marginTop: '5px' }}>Include country code (e.g. +92)</small>
                </div>
              ) : (
                <div className="input-group">
                  <label>Enter 6-digit OTP</label>
                  <input 
                    type="text" 
                    placeholder="123456" 
                    required 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <small style={{ color: '#00d2ff', marginTop: '5px', cursor: 'pointer' }} onClick={() => setOtpSent(false)}>Change Phone Number</small>
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Please wait..." : (
              authMethod === "phone" 
                ? (otpSent ? "Verify OTP" : "Send OTP") 
                : (isLogin ? "Log In" : "Sign Up")
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button type="button" className="btn-social google" onClick={() => handleSocialLogin('google')}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Continue with Google
          </button>
          <button type="button" className="btn-social facebook" onClick={() => handleSocialLogin('facebook')}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19,4V7H17A1,1,0,0,0,16,8v2h3.091L18.7,13H16v8H13V13H11V10h2V7.558A3.553,3.553,0,0,1,16.551,4Z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        {authMethod === "email" && (
          <div className="toggle-mode">
            {isLogin ? (
              <p>
                Don't have an account? <button onClick={toggleMode} type="button">Sign up</button>
              </p>
            ) : (
              <p>
                Already have an account? <button onClick={toggleMode} type="button">Log in</button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Decorative background elements */}
      <div className="decor circle-1"></div>
      <div className="decor circle-2"></div>
      <div className="decor star-1">★</div>
      <div className="decor star-2">✦</div>
    </div>
  );
}
