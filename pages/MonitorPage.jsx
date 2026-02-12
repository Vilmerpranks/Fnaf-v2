import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageType } from '../types';
import { BROADCAST_CHANNEL_NAME, TIMEOUT_THRESHOLD } from '../constants';
import { AlertTriangle, Power } from 'lucide-react';

export const MonitorPage = () => {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState({});
  const channelRef = useRef(null);
  const [isMonitorOff, setIsMonitorOff] = useState(false);

  useEffect(() => {
    // Spacebar toggle handler
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsMonitorOff(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    // Initialize channel
    channelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    
    channelRef.current.onmessage = (event) => {
      const { type, id, payload, timestamp } = event.data;
      
      setFeeds(prev => {
        const newFeeds = { ...prev };
        
        if (type === MessageType.FRAME && payload) {
          // If this is a new camera, assign it a label
          if (!newFeeds[id]) {
            const count = Object.keys(newFeeds).length + 1;
            newFeeds[id] = {
              id,
              image: payload,
              lastSeen: timestamp,
              label: `CAM 0${count}`
            };
          } else {
            // Update existing camera
            newFeeds[id] = {
              ...newFeeds[id],
              image: payload,
              lastSeen: timestamp
            };
          }
        } else if (type === MessageType.UNREGISTER) {
          delete newFeeds[id];
        }
        
        return newFeeds;
      });
    };

    // Cleanup stale feeds
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setFeeds(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (now - next[key].lastSeen > TIMEOUT_THRESHOLD) {
            delete next[key];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 2000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      channelRef.current?.close();
      clearInterval(cleanupInterval);
    };
  }, []);

  const activeFeeds = Object.values(feeds);
  const feedCount = activeFeeds.length;

  const getGridClass = () => {
    if (feedCount <= 1) return "grid-cols-1";
    if (feedCount === 2) return "grid-cols-2";
    return "grid-cols-2 md:grid-cols-3"; // 3+ cameras
  };

  return (
    <div className="relative z-30 h-screen w-full flex flex-col p-4 pt-20 pb-16">
      {/* Monitor Off Overlay */}
      {isMonitorOff && (
        <div className="fixed inset-0 bg-black z-[100]"></div>
      )}

      {feedCount === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-4 border-[#33ff00] border-dashed bg-black/50 backdrop-blur-sm m-4">
          <AlertTriangle className="w-24 h-24 mb-6 animate-pulse" />
          <h2 className="text-4xl font-bold tracking-[0.5em] mb-4 text-glow">NO SIGNAL</h2>
          <p className="text-xl opacity-70 mb-8">WAITING FOR CAMERA CONNECTION...</p>
          <div className="text-sm opacity-50 border border-[#33ff00] p-4 bg-green-900/10">
            <p>1. OPEN THIS SITE IN A NEW TAB OR DEVICE</p>
            <p>2. SELECT "CAMERA MODE"</p>
            <p>3. CLICK "START TRANSMISSION"</p>
          </div>
        </div>
      ) : (
        <div className={`grid ${getGridClass()} gap-4 h-full w-full auto-rows-fr`}>
          {activeFeeds.map((feed) => (
            <div key={feed.id} className="relative border-2 border-[#33ff00] bg-black overflow-hidden group">
              {/* Camera Image */}
              {feed.image && (
                <img 
                  src={feed.image} 
                  alt={feed.label} 
                  className="w-full h-full object-cover filter sepia-[100%] hue-rotate-[50deg] contrast-[1.2] brightness-[0.8]"
                />
              )}
              
              {/* Static Overlay (randomly visible via CSS logic or just always faint) */}
              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAABMTExERERmZmYzMzMyMjJ4D30zAAAACHRSTlMAMwAqzMzM/wO30h4AAAB4SURBVDjLxZFJDsAgDAQT/v9j+oCoUuWcconLzBBrrK213t6vq729/w6yd2Y/O7M3s2dmz8x+d2Z/O/M3s29mPzuzN7NnZs/Mfindz/LzM3t2Zt/MfnZmb2bPzJ6Z/e7M/nbmb2bfzH52Zm9mz8yemb0z+9mZvZk9M3sD6y82HT9yBzwAAAAASUVORK5CYII=')] opacity-20 pointer-events-none mix-blend-overlay"></div>

              {/* Label */}
              <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 border border-[#33ff00]">
                <span className="text-xl font-bold tracking-widest text-glow">{feed.label}</span>
              </div>
              
              {/* Blinking Dot */}
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff0000]"></div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <button 
          onClick={() => navigate('/')}
          className="bg-red-900/20 border border-red-600 text-red-500 px-6 py-2 hover:bg-red-600 hover:text-black transition-colors flex items-center gap-2"
        >
          <Power className="w-4 h-4" /> DISCONNECT
        </button>
      </div>
      
      {/* Help Text for Spacebar */}
      <div className="fixed bottom-2 right-4 text-[10px] opacity-30 tracking-widest">
        PRESS [SPACE] TO TOGGLE MONITOR
      </div>
    </div>
  );
};