import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Monitor, Camera } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-30 p-4">
      <div className="mb-16 text-center animate-pulse">
        <h1 className="text-6xl md:text-8xl font-black mb-4 text-glow tracking-widest">
          FAZBEAR
        </h1>
        <h2 className="text-3xl md:text-4xl tracking-[0.5em] opacity-80 border-t-2 border-[#33ff00] pt-4 inline-block">
          SECURITY SYSTEM
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full max-w-4xl justify-center">
        <div className="flex flex-col items-center gap-4 group">
          <Button onClick={() => navigate('/monitor')} className="w-64 h-32 flex flex-col items-center justify-center gap-2">
            <Monitor className="w-8 h-8 mb-2" />
            MONITOR MODE
          </Button>
          <p className="text-sm opacity-50 tracking-widest max-w-[200px] text-center">
            VIEW FEED FROM REMOTE CAMERAS
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 group">
          <Button onClick={() => navigate('/camera')} className="w-64 h-32 flex flex-col items-center justify-center gap-2">
            <Camera className="w-8 h-8 mb-2" />
            CAMERA MODE
          </Button>
          <p className="text-sm opacity-50 tracking-widest max-w-[200px] text-center">
            BROADCAST THIS DEVICE AS A SOURCE
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 text-center opacity-40 text-xs tracking-[0.3em]">
        CONNECTION SECURE // CHANNEL: FNAF-SYS-01
      </div>
    </div>
  );
};