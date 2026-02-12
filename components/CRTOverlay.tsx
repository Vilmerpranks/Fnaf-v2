import React, { useEffect, useState } from 'react';

export const CRTOverlay: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="scanlines"></div>
      <div className="noise"></div>
      
      {/* HUD Elements that persist */}
      <div className="fixed top-4 right-6 z-40 text-2xl font-bold tracking-widest text-glow">
        {time.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' }).toUpperCase()}
      </div>
      
      <div className="fixed top-4 left-6 z-40 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#ff0000]"></div>
        <span className="text-xl font-bold tracking-widest text-red-600 text-glow-red">REC</span>
      </div>
    </>
  );
};