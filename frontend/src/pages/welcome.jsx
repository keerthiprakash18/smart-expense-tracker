import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function Welcome({ onComplete }) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "Smart AI Expense Tracking",
      desc: "Instantly scan receipts, extract amounts using cutting-edge AI, and auto-categorize transactions.",
      icon: <Sparkles size={40} color="#0A84FF" />,
      gradient: "linear-gradient(135deg, rgba(10,132,255,0.2) 0%, transparent 70%)"
    },
    {
      title: "Bank-Grade Cloud Security",
      desc: "Your financial ledger is securely encrypted and isolated with dedicated PostgreSQL cloud storage.",
      icon: <ShieldCheck size={40} color="#30D158" />,
      gradient: "linear-gradient(135deg, rgba(48,209,88,0.2) 0%, transparent 70%)"
    },
    {
      title: "Real-Time Financial Analytics",
      desc: "Monitor cash flow, track monthly budget caps, and visualize your spending telemetry seamlessly.",
      icon: <Zap size={40} color="#BF5AF2" />,
      gradient: "linear-gradient(135deg, rgba(191,90,242,0.2) 0%, transparent 70%)"
    }
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      height: '100dvh',
      backgroundColor: '#05070A',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px 24px',
      position: 'relative',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Dynamic Background Flare */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '350px',
        height: '350px',
        background: slides[slide].gradient,
        borderRadius: '50%',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        transition: 'background 0.5s ease'
      }} />

      {/* Top Bar: Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', zIndex: 10 }}>
        <button
          onClick={onComplete}
          style={{ background: 'none', border: 'none', color: 'rgba(235,235,245,0.5)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
        >
          Skip
        </button>
      </div>

      {/* Center Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, margin: 'auto 0' }}>
        <div style={{
          width: '88px',
          height: '88px',
          borderRadius: '28px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px',
          boxShadow: '0 16px 32px rgba(0,0,0,0.5)'
        }}>
          {slides[slide].icon}
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
          {slides[slide].title}
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.6)', lineHeight: '1.5', maxWidth: '320px', margin: 0 }}>
          {slides[slide].desc}
        </p>
      </div>

      {/* Bottom Indicators & Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 10 }}>
        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {slides.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: slide === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: slide === idx ? '#0A84FF' : 'rgba(255, 255, 255, 0.15)',
                transition: 'width 0.3s ease, background-color 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (slide < slides.length - 1) {
              setSlide(slide + 1);
            } else {
              onComplete();
            }
          }}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #0A84FF 0%, #0056D2 100%)',
            border: 'none',
            color: '#FFF',
            fontSize: '15px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(10, 132, 255, 0.4)'
          }}
        >
          <span>{slide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}