'use client';

import React, { useState, useEffect } from 'react';

export default function PhoneFrame({ children }) {
  const [timeStr, setTimeStr] = useState('9:41');
  const [scale, setScale] = useState(1);

  // Live Status Bar Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12;
      const formatted = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Responsive Scale-to-fit calculation
  useEffect(() => {
    const handleResize = () => {
      const targetHeight = 870; // True phone height
      const targetWidth = 414;  // True phone width
      const margin = 16;

      const availHeight = window.innerHeight - margin;
      const availWidth = window.innerWidth - margin;

      const scaleY = availHeight / targetHeight;
      const scaleX = availWidth / targetWidth;
      const fitScale = Math.min(1, scaleY, scaleX);

      setScale(Math.max(0.65, fitScale));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="phone-outer-viewport">
      <div 
        className="phone-frame-wrapper" 
        style={{ transform: `scale(${scale})` }}
      >
        {/* Hardware Bezel Notch / Dynamic Island */}
        <div className="phone-notch">
          <div className="camera-lens"></div>
          <div className="speaker-grille"></div>
        </div>

        {/* Live Device Status Bar */}
        <div className="phone-status-bar">
          <div className="status-left">
            <span className="status-clock">{timeStr}</span>
          </div>
          <div className="status-right">
            <span className="status-icon">📶</span>
            <span className="status-icon">📡</span>
            <span className="status-battery">
              <span className="battery-level"></span>
            </span>
          </div>
        </div>

        {/* Phone Screen Display Container */}
        <div className="phone-screen-display">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="home-indicator-bar">
          <div className="home-pill"></div>
        </div>
      </div>
    </div>
  );
}
