import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MessageType } from '../types';
import { BROADCAST_CHANNEL_NAME, FRAME_RATE, CAMERA_RESOLUTION_WIDTH, CAMERA_RESOLUTION_HEIGHT } from '../constants';
import { Button } from '../components/Button';
import { Video, VideoOff, Wifi } from 'lucide-react';

export const CameraPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const channelRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [cameraAccess, setCameraAccess] = useState(false);
  const intervalRef = useRef(null);
  
  // Unique ID for this camera instance
  const [id] = useState(() => uuidv4());

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: CAMERA_RESOLUTION_WIDTH },
            height: { ideal: CAMERA_RESOLUTION_HEIGHT },
            facingMode: 'environment' // Prefer back camera on mobile
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraAccess(true);
        }
      } catch (err) {
        console.error(err);
        setError("CAMERA ACCESS DENIED OR UNAVAILABLE");
      }
    };

    startCamera();

    // Setup Broadcast Channel
    channelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      
      // Notify monitor we are leaving
      channelRef.current?.postMessage({
        type: MessageType.UNREGISTER,
        id,
        timestamp: Date.now()
      });
      channelRef.current?.close();
    };
  }, [id]);

  const captureAndSendFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !channelRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Draw video frame to canvas
    context.drawImage(videoRef.current, 0, 0, CAMERA_RESOLUTION_WIDTH, CAMERA_RESOLUTION_HEIGHT);
    
    // Compress to JPEG to keep message size low
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.5);

    const message = {
      type: MessageType.FRAME,
      id,
      payload: dataUrl,
      timestamp: Date.now()
    };

    channelRef.current.postMessage(message);
  }, [id]);

  const toggleStream = () => {
    if (isStreaming) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setIsStreaming(false);
    } else {
      if (!cameraAccess) return;
      intervalRef.current = window.setInterval(captureAndSendFrame, 1000 / FRAME_RATE);
      setIsStreaming(true);
    }
  };

  return (
    <div className="relative z-30 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hidden canvas for processing */}
      <canvas 
        ref={canvasRef} 
        width={CAMERA_RESOLUTION_WIDTH} 
        height={CAMERA_RESOLUTION_HEIGHT} 
        className="hidden"
      />

      <div className="w-full max-w-2xl border-4 border-[#33ff00] bg-black relative p-1 mb-8 shadow-[0_0_20px_rgba(51,255,0,0.2)]">
        {error ? (
          <div className="h-64 flex items-center justify-center text-red-500 font-bold border border-red-900 bg-red-900/20">
            {error}
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-auto border border-[#33ff00]/50 ${isStreaming ? 'filter sepia-[100%] hue-rotate-[50deg]' : 'grayscale opacity-50'}`}
          />
        )}
        
        {/* Status Overlay */}
        <div className="absolute top-4 left-4 bg-black/80 border border-[#33ff00] px-2 py-1 text-sm">
          STATUS: {isStreaming ? <span className="text-[#33ff00] animate-pulse">BROADCASTING</span> : <span className="text-yellow-500">STANDBY</span>}
        </div>

        <div className="absolute top-4 right-4">
           {isStreaming && <Wifi className="w-6 h-6 text-[#33ff00] animate-pulse" />}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <Button 
          onClick={toggleStream} 
          disabled={!cameraAccess}
          variant={isStreaming ? 'danger' : 'primary'}
          className="w-full flex items-center justify-center gap-3"
        >
          {isStreaming ? (
             <>
               <VideoOff /> STOP FEED
             </>
          ) : (
            <>
              <Video /> START FEED
            </>
          )}
        </Button>
        
        <p className="text-center text-sm opacity-60 tracking-widest leading-relaxed">
          {isStreaming 
            ? "SENDING SIGNAL TO MONITOR... DO NOT CLOSE THIS TAB" 
            : "READY TO TRANSMIT. OPEN MONITOR IN ANOTHER TAB."}
        </p>

        <button 
          onClick={() => navigate('/')}
          className="text-xs border-b border-[#33ff00]/30 hover:border-[#33ff00] transition-colors pb-1 mt-8 opacity-50 hover:opacity-100"
        >
          RETURN TO MAIN MENU
        </button>
      </div>
    </div>
  );
};