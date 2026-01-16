'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export function SplashScreen() {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if CSS is actually loaded
  const checkCSSLoaded = () => {
    const testEl = document.createElement('div');
    testEl.className = 'bg-neutral-950';
    document.body.appendChild(testEl);
    const computedStyle = window.getComputedStyle(testEl);
    const bgColor = computedStyle.backgroundColor;
    document.body.removeChild(testEl);
    return bgColor === 'rgb(10, 10, 10)' || bgColor === 'rgba(10, 10, 10, 1)';
  };

  // First effect: Check if we should show splash
  useEffect(() => {
    // Always check if CSS is actually loaded, not just localStorage
    const cssActuallyLoaded = checkCSSLoaded();
    
    if (cssActuallyLoaded) {
      // CSS is loaded, mark it and don't show splash
      localStorage.setItem('mindtrace-css-loaded', 'true');
      setShouldShow(false);
    } else {
      // CSS not loaded yet - show splash regardless of localStorage
      // (localStorage might be stale from previous session)
      setShouldShow(true);
    }
  }, []);

  // Second effect: Run Matrix animation only when splash is visible
  useEffect(() => {
    if (shouldShow !== true) return;

    // Wait a frame for canvas to be in DOM
    const initTimeout = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const chars = 'MINDTRACEアイウエオカキクケコサシスセソタチツテト0123456789思考過程';
      const charArray = chars.split('');
      const fontSize = 14;
      const columns = canvas.width / fontSize;
      const drops: number[] = [];

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
      }

      const draw = () => {
        ctx.fillStyle = 'rgba(10, 22, 40, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4fd1c5';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = charArray[Math.floor(Math.random() * charArray.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          const alpha = Math.random() * 0.5 + 0.5;
          ctx.fillStyle = `rgba(79, 209, 197, ${alpha})`;
          ctx.fillText(char, x, y);

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };

      const animationId = setInterval(draw, 50);

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      const hideSplash = () => {
        localStorage.setItem('mindtrace-css-loaded', 'true');
        setFadeOut(true);
        setTimeout(() => {
          setShouldShow(false);
          clearInterval(animationId);
        }, 500);
      };

      const checkAndHide = () => {
        if (checkCSSLoaded()) {
          hideSplash();
          return true;
        }
        return false;
      };

      if (checkAndHide()) return;

      let attempts = 0;
      const maxAttempts = 50; // Increased attempts
      const cssCheckInterval = setInterval(() => {
        attempts++;
        if (checkAndHide() || attempts >= maxAttempts) {
          clearInterval(cssCheckInterval);
          if (attempts >= maxAttempts) {
            hideSplash();
          }
        }
      }, 100);

      // Cleanup stored in ref for the outer effect
      (window as unknown as { __splashCleanup?: () => void }).__splashCleanup = () => {
        clearInterval(animationId);
        clearInterval(cssCheckInterval);
        window.removeEventListener('resize', handleResize);
      };
    }, 50);

    return () => {
      clearTimeout(initTimeout);
      const cleanup = (window as unknown as { __splashCleanup?: () => void }).__splashCleanup;
      if (cleanup) cleanup();
    };
  }, [shouldShow]);

  // Don't render anything while checking or if shouldn't show
  if (shouldShow !== true) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a1628',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
        }}
      />
      
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(79, 209, 197, 0.15) 0%, transparent 50%)',
        animation: 'breathe 3s ease-in-out infinite',
      }} />

      <div style={{ 
        position: 'relative',
        zIndex: 10,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem',
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(79, 209, 197, 0.3) 0%, transparent 60%)',
          animation: 'logoGlow 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '3rem',
          overflow: 'hidden',
          boxShadow: '0 0 100px rgba(79, 209, 197, 0.3)',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 40%, rgba(10, 22, 40, 0.5) 70%, rgba(10, 22, 40, 0.9) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
            borderRadius: '3rem',
          }} />
          <Image
            src="/mindTrace.png"
            alt="MindTrace"
            width={600}
            height={600}
            style={{ 
              display: 'block',
              maxWidth: '80vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              animation: 'float 3s ease-in-out infinite',
              opacity: 0.95,
            }}
            priority
          />
        </div>
      </div>
      
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes logoGlow {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
