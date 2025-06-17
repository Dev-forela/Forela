import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  onDownload?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title, onDownload }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [seeking, setSeeking] = useState(false);

  // Format time helper function
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    
    const ss = Math.floor(seconds);
    const hh = Math.floor(ss / 3600);
    const mm = Math.floor((ss - hh * 3600) / 60);
    const remainingSS = ss - hh * 3600 - mm * 60;

    const formattedMM = hh > 0 && mm < 10 ? `0${mm}` : mm.toString();
    const formattedSS = remainingSS < 10 ? `0${remainingSS}` : remainingSS.toString();

    return hh > 0 ? `${hh}:${formattedMM}:${formattedSS}` : `${mm}:${formattedSS}`;
  };

  // Set progress bar width
  const setProgress = (element: HTMLInputElement, value: number, max: number) => {
    const percentage = (value / max) * 100;
    const clampedPercentage = Math.min(percentage, 95);
    const progressElement = element.nextElementSibling as HTMLElement;
    if (progressElement) {
      progressElement.style.width = `${clampedPercentage}%`;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!seeking) {
        setCurrentTime(audio.currentTime);
        if (seekRef.current) {
          seekRef.current.value = audio.currentTime.toString();
          setProgress(seekRef.current, audio.currentTime, audio.duration);
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('waiting', handleWaiting);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('waiting', handleWaiting);
    };
  }, [seeking]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setSeeking(false);
  };

  const handleSeekInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeeking(true);
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    setProgress(e.target, newTime, duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolumePercent = parseFloat(e.target.value);
    const newVolume = newVolumePercent / 100; // Convert 0-100 to 0-1
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolumePercent === 0);
    setProgress(e.target, newVolumePercent, 100);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      const volumeToRestore = volume > 0 ? volume : 1;
      audio.volume = volumeToRestore;
      setIsMuted(false);
      if (volumeRef.current) {
        volumeRef.current.value = (volumeToRestore * 100).toString();
        setProgress(volumeRef.current, volumeToRestore * 100, 100);
      }
    } else {
      audio.volume = 0;
      setIsMuted(true);
      if (volumeRef.current) {
        volumeRef.current.value = '0';
        setProgress(volumeRef.current, 0, 100);
      }
    }
  };

  return (
    <div className="audio-player" style={{
      fontFamily: 'Inter, Arial, Helvetica, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '500px',
      padding: '12px 20px',
      margin: '8px 0',
      borderRadius: '12px',
      background: '#A36456', // Brand color instead of black
      gap: '1rem',
      boxSizing: 'border-box'
    }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        disabled={isLoading}
        style={{
          padding: '8px',
          margin: 0,
          background: isPlaying ? '#8C5A51' : 'transparent',
          border: 'none',
          borderRadius: '50%',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoading ? 0.5 : 1,
          transition: 'background-color 0.2s ease',
          outline: 'none'
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Seek Bar */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: '120px'
      }}>
        <span style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '6px',
          width: '100%',
          backgroundColor: '#8C5A51', // Darker brand color
          borderRadius: '10px',
          zIndex: 0
        }} />
        <input
          ref={seekRef}
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          step="0.1"
          disabled={isLoading}
          onChange={handleSeekChange}
          onInput={handleSeekInput}
          style={{
            appearance: 'none',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            width: '100%',
            padding: 0,
            margin: 0,
            background: 'transparent',
            position: 'relative',
            zIndex: 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        />
        <span style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '6px',
          width: '0%',
          backgroundColor: '#E2B6A1', // Light brand color
          borderRadius: '10px 0 0 10px',
          zIndex: 0,
          transition: 'width 0.1s ease'
        }} />
      </div>

      {/* Time Display */}
      <div style={{
        fontSize: '14px',
        color: '#F5F1ED',
        margin: '0 10px',
        whiteSpace: 'nowrap',
        minWidth: '80px'
      }}>
        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
      </div>

      {/* Volume Control */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={toggleMute}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '80px'
        }}>
          <span style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '10px',
            width: '100%',
            backgroundColor: '#8C5A51',
            borderRadius: '10px',
            zIndex: 0
          }} />
          <input
            ref={volumeRef}
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : Math.round(volume * 100)}
            step="1"
            disabled={isLoading}
            onChange={handleVolumeChange}
            style={{
              appearance: 'none',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              width: '100%',
              padding: 0,
              margin: 0,
              background: 'transparent',
              position: 'relative',
              zIndex: 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          />
          <span style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '10px',
            width: '95%',
            backgroundColor: '#E2B6A1',
            borderRadius: '10px 0 0 10px',
            zIndex: 0,
            transition: 'width 0.1s ease'
          }} />
        </div>
      </div>

      {/* Download Button */}
      {onDownload && (
        <button
          onClick={onDownload}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}
          aria-label="Download audio"
        >
          <Download size={16} />
        </button>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .audio-player input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 0;
            background: #fff;
            cursor: pointer;
            margin-top: -5px;
          }

          .audio-player input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 0;
            background: #fff;
            cursor: pointer;
            margin-top: -5px;
          }

          .audio-player input[type="range"]::-webkit-slider-runnable-track {
            background: transparent;
            height: 6px;
            border-radius: 10px;
          }

          .audio-player input[type="range"]::-moz-range-track {
            background: transparent;
            height: 6px;
            border-radius: 10px;
          }
        `
      }} />
    </div>
  );
};

export default AudioPlayer; 