"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import "./login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleEmailAuth = async () => {
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Successfully logged in
      router.push("/");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;

      // Supabase returns a null session if email confirmation is required
      // or if the user signs up with an email that already exists.
      if (!data.session) {
        throw new Error("Signup successful, but session not created. Please make sure 'Confirm Email' is disabled in your Supabase Authentication settings, or check if this email is already registered.");
      }

      if (fullName) localStorage.setItem("user_name", fullName);
      
      // Successfully signed up and logged in
      router.push("/");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Explicit Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!isLogin && !fullName) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      await handleEmailAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/',
        queryParams: {
          prompt: 'select_account',
        },
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
            {isLogin ? "Welcome Back!" : "Join Mini World!"}
          </h1>
          <p className="login-subtitle">
            {isLogin
              ? "Let's continue learning and playing."
              : "Create an account to start the fun."}
          </p>
        </div>

        {error && <div className="error-message" style={{ color: '#ff4757', background: 'rgba(255, 71, 87, 0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}

        <form className="login-form" onSubmit={handleAuth}>
          
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                id="fullName" 
                type="text" 
                placeholder="e.g. John Doe" 
                value={fullName}
                autoComplete="off"
                onChange={(e) => { setFullName(e.target.value); setError(null); }}
              />
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="hello@miniworld.com" 
              value={email}
              autoComplete="off"
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                autoComplete="new-password"
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                style={{ width: '100%', paddingRight: '45px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Please wait..." : (isLogin ? "Log In" : "Sign Up")}
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
      </div>

      {/* Decorative background elements */}
      <div className="decor circle-1"></div>
      <div className="decor circle-2"></div>
      <div className="decor star-1">★</div>
      <div className="decor star-2">✦</div>
    </div>
  );
}
