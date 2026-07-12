"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { speakImmediate, setupSpeechEngine } from "@/utils/speech";
import "./home.css";

export default function Home() {
  const [greetTriggered, setGreetTriggered] = useState(false);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Setup TTS voices and priming
    const cleanupSpeech = setupSpeechEngine();

    // Auto-Greeting system
    const speakWelcome = () => {
      if (greetTriggered) return;
      setGreetTriggered(true);
      speakImmediate("Welcome to Mini World! Let's play and learn together.");
      removeListeners();
    };

    const removeListeners = () => {
      ["mousedown", "touchstart", "keydown", "scroll", "wheel", "mousemove", "click"].forEach((type) => {
        window.removeEventListener(type, speakWelcome);
      });
    };

    ["mousedown", "touchstart", "keydown", "scroll", "wheel", "mousemove", "click"].forEach((type) => {
      window.addEventListener(type, speakWelcome, { once: true, passive: true });
    });

    return () => {
      cleanupSpeech();
      removeListeners();
    };
  }, [greetTriggered]);

  const categories = [
    { name: "Learn ABC", desc: "Fun with Alphabets", href: "/abc", img: "/images/icon_abc_3d_1782992588933.png", bg: "linear-gradient(135deg, #a83af9, #6a11cb)" },
    { name: "Learn Numbers", desc: "Count and Grow", href: "/123", img: "/images/icon_numbers_3d_1782992600320.png", bg: "linear-gradient(135deg, #ff1493, #ff7eb3)" },
    { name: "Rhymes", desc: "Sing and Dance", href: "/rhymes", img: "/images/icon_rhymes_3d_1782992614260.png", bg: "linear-gradient(135deg, #2575fc, #00d2ff)" },
    { name: "Colors", desc: "Explore the World", href: "/colors", img: "/images/icon_colors_3d_1782992626883.png", bg: "linear-gradient(135deg, #11998e, #38ef7d)" },
    { name: "Animals", desc: "Meet Our Friends", href: "/animals", img: "/images/icon_animals_3d_1782992638796.png", bg: "linear-gradient(135deg, #0ba360, #3cba92)" },
    { name: "Fun Math", desc: "Play with Numbers", href: "/addition", img: "/images/icon_math_3d_1782992654095.png", bg: "linear-gradient(135deg, #2f80ed, #56ccf2)" },
  ];

  const handleProtectedNavigation = (e, path) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
    } else {
      router.push(path);
    }
  };

  return (
    <div className="home-page-wrapper">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="welcome-badge">Welcome to</div>
          <h1 className="hero-title">MINI WORLD</h1>
          <h2 className="hero-subtitle">
            <span className="color-yellow">Learn</span>, <span className="color-pink">Play</span> & Grow Together!
          </h2>
          <p className="hero-desc">
            A safe, interactive and fun place for kids to learn ABC, Numbers, Rhymes, Colors, Animals and so much more!
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={(e) => { speakImmediate("Let's start learning!"); handleProtectedNavigation(e, '/abc'); }}>
              <div className="btn-icon-circle"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
              Start Learning
            </button>
            <button className="btn-secondary" onClick={() => speakImmediate("Explore activities!")}>
              <div className="btn-icon-circle dark"><svg viewBox="0 0 24 24"><path d="M12 2L2 22l10-4 10 4L12 2z"/></svg></div>
              Explore Activities
            </button>
          </div>
        </div>
        
        <div className="hero-graphics-3d">
          <img src="/images/3d model.png" alt="Kids flying on a 3D rocket" className="model-3d" style={{ imageRendering: 'high-quality' }} />
        </div>



      </section>

      {/* Category Grid */}
      <section id="categories" className="category-row home-section-padded">
        {categories.map((cat, idx) => (
          <a href={cat.href} onClick={(e) => handleProtectedNavigation(e, cat.href)} key={cat.name} className="cat-card">
            <div className="cat-bg" style={{ background: cat.bg }}></div>
            <div className="cat-img-wrapper">
              <img src={cat.img} alt={cat.name} />
            </div>
            <h3 className="cat-title">{cat.name}</h3>
            <p className="cat-desc">{cat.desc}</p>
            <div className="cat-arrow">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
          </a>
        ))}
      </section>

      {/* Bottom Sections */}
      <section className="bottom-sections home-section-padded">
        {/* Interactive Learning */}
        <div className="interactive-card">
          <h3 className="int-title">Fun & Interactive Learning</h3>
          <p className="int-desc">Our activities are designed to make learning fun, easy and exciting!</p>
          <ul className="int-list">
            <li><div className="list-icon" style={{color: '#38ef7d'}}>✓</div> Safe Environment</li>
            <li><div className="list-icon" style={{color: '#bb6bd9'}}>★</div> Expert Designed Content</li>
            <li><div className="list-icon" style={{color: '#ff7eb3'}}>♥</div> Interactive & Engaging</li>
            <li><div className="list-icon" style={{color: '#ffb800'}}>☀</div> Learn Through Play</li>
          </ul>
          <button className="btn-primary" style={{display: 'inline-flex', width: 'auto', padding: '10px 25px'}}>Let's Start 🚀</button>
          
          <div className="int-graphic">
            <img src="/images/kid_tablet_3d_1782992558730.png" alt="Kid learning with tablet" />
          </div>
        </div>

        {/* Popular Activities */}
        <div className="activities-list-card">
          <div className="act-header">
            <h3>Popular Activities</h3>
            <button className="view-all">View All</button>
          </div>
          
          <div className="act-item" onClick={(e) => handleProtectedNavigation(e, '/colors')}>
            <div className="act-icon c-rainbow">🌈</div>
            <div className="act-info">
              <h4>Color the Rainbow</h4>
              <p>Drawing Activity</p>
            </div>
            <div className="cat-arrow" style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.2)'}}><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          </div>

          <div className="act-item" onClick={(e) => handleProtectedNavigation(e, '/animals')}>
            <div className="act-icon c-puzzle">🐾</div>
            <div className="act-info">
              <h4>Animal Puzzle</h4>
              <p>Puzzle Game</p>
            </div>
            <div className="cat-arrow" style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.2)'}}><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          </div>

          <div className="act-item" onClick={(e) => handleProtectedNavigation(e, '/123')}>
            <div className="act-icon c-math">123</div>
            <div className="act-info">
              <h4>Counting Fun</h4>
              <p>Math Game</p>
            </div>
            <div className="cat-arrow" style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.2)'}}><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          </div>
        </div>

        {/* What Parents Say */}
        <div className="testimonial-card">
          <div className="test-header">
            <h3>What Parents Say</h3>
            <div className="cat-arrow" style={{background: '#a83af9', border: 'none'}}><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg></div>
          </div>
          <div className="quote-mark">"</div>
          <p className="test-text">
            Mini World has been amazing for my child! The content is engaging, educational and so much fun.
          </p>
          <div className="stars">★★★★★</div>
          <div className="test-user">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Parent" />
            <div>
              <h5>Ayesha Khan</h5>
              <p>Mother of 5 year old</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="stats-row">
        <div className="stats-left">
          <div className="star-icon">🌟</div>
          <p>Let's make learning<br/>the best adventure ever!</p>
        </div>
        <div className="stats-boxes">
          <div className="stat-box">
            <h4>500+</h4>
            <p>Activities</p>
          </div>
          <div className="stat-box">
            <h4>50K+</h4>
            <p>Happy Kids</p>
          </div>
          <div className="stat-box">
            <h4>100+</h4>
            <p>Learning Topics</p>
          </div>
          <div className="stat-box">
            <h4>24/7</h4>
            <p>Safe & Secure</p>
          </div>
        </div>
      </section>

      {/* Home Footer (Keeping structure, changing theme) */}
      <footer className="site-footer home-footer" style={{marginTop: '40px', padding: '40px 20px', borderRadius: '30px'}}>
        <div className="footer-content" style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px', marginBottom: '30px'}}>
          <div className="footer-section" style={{flex: 1, minWidth: '200px'}}>
            <h4 style={{fontSize: '18px', marginBottom: '15px', fontWeight: '800'}}>Mini World</h4>
            <p className="footer-desc" style={{fontSize: '14px', lineHeight: '1.6', marginBottom: '20px'}}>
              Let's play and learn! Exploring the world of knowledge one step at a time with fun and interactive activities.
            </p>
            <div className="social-links" style={{display: 'flex', gap: '10px'}}>
              <a href="#" className="social-icon" style={{width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 24 24" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
              <a href="#" className="social-icon" style={{width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 24 24" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg></a>
              <a href="#" className="social-icon" style={{width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 24 24" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
              <a href="#" className="social-icon" style={{width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975-.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.688.072 4.948.072s3.668-.014 4.948-.072c4.358-.2 6.78-2.618 6.981-6.98.058-1.28.072-1.688.072-4.948s-.014-3.668-.072-4.948c-.2-4.358-2.618-6.78-6.98-6.981C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4.162 4.162 0 1 1 0-8.324A4.162 4.162 0 0 1 12 16zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg></a>
            </div>
          </div>

          <div className="footer-section" style={{flex: 1, minWidth: '150px'}}>
            <h4 style={{fontSize: '18px', marginBottom: '15px', fontWeight: '800'}}>Navigation</h4>
            <ul className="footer-links" style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '10px'}}><Link href="/" style={{textDecoration: 'none'}}>Home</Link></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={{textDecoration: 'none'}}>About Us</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={{textDecoration: 'none'}}>Our Services</a></li>
              <li style={{marginBottom: '10px'}}><a href="#" style={{textDecoration: 'none'}}>Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-section" style={{flex: 1, minWidth: '150px'}}>
            <h4 style={{fontSize: '18px', marginBottom: '15px', fontWeight: '800'}}>Learning</h4>
            <ul className="footer-links" style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '10px'}}><Link href="/abc" style={{textDecoration: 'none'}}>Learn ABC</Link></li>
              <li style={{marginBottom: '10px'}}><Link href="/123" style={{textDecoration: 'none'}}>Learn Numbers</Link></li>
              <li style={{marginBottom: '10px'}}><Link href="/rhymes" style={{textDecoration: 'none'}}>Fun Rhymes</Link></li>
              <li style={{marginBottom: '10px'}}><Link href="/animals" style={{textDecoration: 'none'}}>Animals World</Link></li>
            </ul>
          </div>

          <div className="footer-section designer-info" style={{flex: 1, minWidth: '200px'}}>
            <h4 style={{fontSize: '18px', marginBottom: '15px', fontWeight: '800'}}>Credits</h4>
            <p style={{fontSize: '14px', marginBottom: '5px'}}>Designed by Muhammad Mohib</p>
            <span className="design-date" style={{fontSize: '12px'}}>Designed on 15 April 2026</span>
          </div>
        </div>

        <div className="footer-bottom" style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center'}}>
          <p className="copyright" style={{fontSize: '13px'}}>&copy; 2026 All Rights Reserved. Crafted for the kids.</p>
        </div>
      </footer>
    </div>
  );
}
