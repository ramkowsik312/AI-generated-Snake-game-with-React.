import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu, AlertTriangle } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-sans selection:bg-[#f0f]/50 overflow-hidden relative">
      {/* CRT Effects */}
      <div className="scanlines" />
      <div className="scanline" />
      
      <main className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col crt-flicker">
        {/* Header */}
        <header className="flex justify-between items-start mb-12 border-b-4 border-[#f0f] pb-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#f0f] text-black animate-pulse">
              <Terminal size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase glitch-text" data-text="SYSTEM.SNAKE_OS">
                SYSTEM.SNAKE_OS
              </h1>
              <p className="text-[10px] text-[#f0f] font-mono tracking-widest uppercase mt-1">
                KERNEL_VERSION: 0.9.2-BETA // STATUS: UNSTABLE
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end font-mono">
            <span className="text-[10px] text-[#f0f] uppercase mb-1">DATA_HARVESTED</span>
            <div className="flex items-center gap-2 bg-[#0ff]/10 px-4 py-2 border-2 border-[#0ff]">
              <Activity size={20} className="text-[#f0f]" />
              <span className="text-3xl font-bold text-[#0ff] tabular-nums">
                {score.toString().padStart(6, '0')}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Panel: Cryptic Logs */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 h-full">
            <div className="p-4 border-2 border-[#f0f] bg-black/50 flex-1 overflow-hidden">
              <h3 className="text-xs font-mono text-[#f0f] uppercase mb-4 flex items-center gap-2">
                <Cpu size={14} /> SYSTEM_LOGS
              </h3>
              <div className="text-[10px] font-mono space-y-2 opacity-80">
                <p className="text-[#0ff]">[OK] INITIALIZING_NEURAL_LINK...</p>
                <p className="text-[#f0f]">[WARN] MEMORY_LEAK_DETECTED_IN_SECTOR_7</p>
                <p className="text-[#0ff]">[OK] AUDIO_BUFFER_SYNCED</p>
                <p className="text-[#0ff]">[OK] SNAKE_CORE_LOADED</p>
                <p className="text-[#f0f]">[ERR] PACKET_LOSS_IN_TRANSMISSION</p>
                <p className="text-[#0ff]">[OK] GLITCH_ENGINE_ACTIVE</p>
                <div className="animate-pulse text-[#f0f]">_WAITING_FOR_INPUT...</div>
              </div>
            </div>

            <div className="p-4 border-2 border-[#0ff] bg-black/50">
              <h3 className="text-xs font-mono text-[#0ff] uppercase mb-2 flex items-center gap-2">
                <AlertTriangle size={14} /> PROTOCOL
              </h3>
              <div className="text-[9px] font-mono text-gray-400 leading-relaxed">
                1. CONSUME_DATA_NODES<br />
                2. AVOID_SELF_INTERSECTION<br />
                3. IGNORE_REALITY_GLITCHES<br />
                4. MAINTAIN_SYNCHRONIZATION
              </div>
            </div>
          </div>

          {/* Center Panel: Game */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
             <div className="absolute -inset-10 bg-[#f0f]/5 blur-3xl rounded-full animate-pulse" />
             <div className="border-4 border-[#0ff] p-1 bg-[#f0f]/10 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                <SnakeGame onScoreChange={setScore} />
             </div>
          </div>

          {/* Right Panel: Music Player */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-6">
            <MusicPlayer />
            
            <div className="hidden lg:block w-full p-4 border-2 border-[#f0f] bg-black/50">
               <div className="flex items-center gap-2 mb-4">
                 <Activity size={16} className="text-[#f0f]" />
                 <h3 className="text-xs font-mono text-[#f0f] uppercase">WAVEFORM_ANALYSIS</h3>
               </div>
               <div className="flex items-end gap-1 h-12">
                 {[...Array(12)].map((_, i) => (
                   <motion.div
                     key={i}
                     animate={{ height: [10, 40, 15, 35, 10] }}
                     transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                     className="flex-1 bg-[#0ff]"
                   />
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-4 border-t-4 border-[#0ff] flex justify-between items-center text-[10px] font-mono uppercase tracking-tighter">
          <p className="text-[#f0f]">© 2026 // VOID_TECH_INDUSTRIES</p>
          <div className="flex gap-6">
            <span className="text-[#0ff] animate-pulse">CONNECTION: ENCRYPTED</span>
            <span className="text-[#f0f]">THREAT_LEVEL: MINIMAL</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
