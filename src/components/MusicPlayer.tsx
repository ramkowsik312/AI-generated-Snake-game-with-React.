import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "LogicCore",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "NeuralBeats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#f0f] p-6 shadow-[0_0_30px_rgba(240,0,240,0.2)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f] animate-pulse" />
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="flex flex-col gap-6">
        {/* Album Art & Info */}
        <div className="flex items-center gap-4">
          <motion.div 
            key={currentTrack.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative w-24 h-24 border-2 border-[#0ff] overflow-hidden"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#0ff]/20 mix-blend-overlay" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-[#0ff] font-mono font-bold truncate text-lg glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
            <p className="text-[#f0f] text-[10px] font-mono uppercase tracking-widest mt-1">SOURCE: {currentTrack.artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#f0f]/10 border border-[#f0f] relative">
            <motion.div 
              className="h-full bg-[#0ff] shadow-[0_0_15px_#0ff]"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white mix-blend-difference">
              BUFFERING_STREAM... {Math.floor(progress)}%
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={prevTrack}
            className="p-2 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-all"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-6 py-2 bg-[#f0f] text-white font-mono font-bold hover:bg-[#0ff] hover:text-black transition-all border-2 border-white"
          >
            {isPlaying ? "HALT" : "EXECUTE"}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-all"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Extra */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-[#f0f]/30">
          <div className="flex items-center gap-2 text-[#0ff] text-[8px] font-mono">
            <Volume2 size={12} />
            <span>GAIN_CONTROL: MAX</span>
          </div>
          <div className="flex items-center gap-2">
             <Music size={12} className="text-[#f0f]" />
             <span className="text-[8px] text-[#f0f] font-mono uppercase">NEURAL_AUDIO_LINK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
