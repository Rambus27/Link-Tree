'use client';

import { useState, useEffect, useRef } from 'react';

interface MusicPlayerProps {
  url: string;
  title?: string;
  autoplay?: boolean;
  textColor: string;
  primaryColor: string;
}

export default function MusicPlayer({ url, title, autoplay = false, textColor, primaryColor }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => { setError(true); setIsPlaying(false); };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    if (autoplay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [autoplay, url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setError(true));
    }
  };

  if (error) return null;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl backdrop-blur-sm"
      style={{ backgroundColor: `${primaryColor}22`, border: `1px solid ${primaryColor}44` }}
    >
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110"
        style={{ backgroundColor: primaryColor }}
      >
        {isPlaying ? (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: textColor }}>
          {title || 'Now Playing'}
        </p>
        {isPlaying && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-0.5 rounded-full animate-bounce"
                style={{ 
                  height: `${8 + (i % 3) * 4}px`,
                  backgroundColor: primaryColor,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        )}
        {!isPlaying && (
          <p className="text-xs opacity-60" style={{ color: textColor }}>Tap to play</p>
        )}
      </div>
    </div>
  );
}
