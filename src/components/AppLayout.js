"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const mainContentRef = useRef(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const loadAvatar = () => {
      const savedAvatar = localStorage.getItem("user_avatar");
      if (savedAvatar) setUserAvatar(savedAvatar);
    };

    loadAvatar();
    window.addEventListener('avatarUpdated', loadAvatar);
    return () => window.removeEventListener('avatarUpdated', loadAvatar);
  }, []);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (!session && pathname !== '/' && pathname !== '/login') {
        router.push('/login');
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session && pathname !== '/' && pathname !== '/login') {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      )
    },
    {
      name: "ABC",
      href: "/abc",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="12" y="16" fontSize="12" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold">A</text>
        </svg>
      )
    },
    {
      name: "123",
      href: "/123",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="12" y="16" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold">123</text>
        </svg>
      )
    },
    {
      name: "Tables",
      href: "/tables",
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: "Rhymes",
      href: "/rhymes",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      )
    },
    {
      name: "Colors",
      href: "/colors",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.16-.6-1.57-.35-.39-.58-.91-.58-1.48 0-1.13.88-2.05 2.01-2.05h1.36c2.61 0 5.31-2.11 5.31-5.31C22 7.02 17.51 2 12 2zM6.5 11.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
      )
    },
    {
      name: "Animals",
      href: "/animals",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M14.5 12c1.93 0 3.5-1.57 3.5-3.5S16.43 5 14.5 5 11 6.57 11 8.5s1.57 3.5 3.5 3.5zm-5 0C11.43 12 13 10.43 13 8.5S11.43 5 9.5 5 6 6.57 6 8.5 7.57 12 9.5 12zm0 2c-2.33 0-7 1.17-7 3.5V21h14v-3.5c0-2.33-4.67-3.5-7-3.5zm5 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V21h6v-3.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      )
    },
    {
      name: "Vegetables",
      href: "/vegetables",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66 1.34-3.3c3.09 1.48 7.37 1.42 10.95-1.54C21 14 21 8 21 8h-4zm-2.04 7.64c-2.58 2.14-5.69 2.19-8 1.4L8.74 12c.55-.91 1.47-1.61 2.37-2.02.43 1.09 1.37 1.83 2.51 2.1l-.81-1.63c1.78-.39 2.92-1.99 3.01-3.66.52.27.97.64 1.35 1.06-.04 2.18-.89 4.31-2.21 5.79v.04z" />
        </svg>
      )
    },
    {
      name: "Days",
      href: "/days",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
        </svg>
      )
    },
    {
      name: "Months",
      href: "/months",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
      )
    },
    {
      name: "Addition",
      href: "/addition",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: "Subtraction",
      href: "/subtraction",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: "Talk to AI",
      href: "/ai-chat",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5zM9 7a3 3 0 0 1 6 0v3a3 3 0 0 1-6 0V7zm10 3a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-3.08A7 7 0 0 0 19 10z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="app-container dark-theme">
      {/* Overlay */}
      <div 
        className={`overlay ${sidebarOpen ? "block" : ""}`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-menu-btn" onClick={() => setSidebarOpen(false)}>&times;</button>

        <div className="logo-area">
          <div className="logo-title">
            <span style={{color: '#ffb800'}}>★</span> KIDS-ZONE
          </div>
          <div className="logo-subtitle">Learn • Play • Grow</div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={handleNavClick}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main Content */}
      <main className="main-content" ref={mainContentRef}>
        <nav className="top-navbar premium-navbar">
          <div className="navbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </button>
          </div>
          
          <div className="navbar-center">
            <div className="premium-logo-title">KIDS-ZONE</div>
          </div>
          
          <div className="navbar-right nav-user-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isLoggedIn ? (
              <Link href="/profile" className="btn-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }}>
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
                <span style={{ fontWeight: 'bold' }}>Profile</span>
              </Link>
            ) : (
              <Link href="/login" className="btn-login" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #ff1493, #ff7eb3)', padding: '8px 16px', borderRadius: '20px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255, 20, 147, 0.4)', transition: 'transform 0.2s ease' }}>
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        </nav>

        {children}
      </main>

      {/* Global AI Chat Floating Button */}
      {pathname !== '/ai-chat' && (
        <Link href="/ai-chat" className="global-ai-fab" title="Talk to Sparky!">
          <div className="fab-robot">🤖</div>
          <div className="fab-tooltip">Talk to AI</div>
        </Link>
      )}
    </div>
  );
}
