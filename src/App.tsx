import React, { useState, useEffect } from 'react';
import { Frame } from './types';
import { TRANSLATIONS } from './utils/translation';
import UserWorkspace from './components/UserWorkspace';
import AdminPanel from './components/AdminPanel';
import { Settings, Brush, Sparkles } from 'lucide-react';

export default function App() {
  // 1. Tab selection ('user' framing tool or 'admin' uploader)
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  // 2. Frames database synced from custom list & system presets
  const [frames, setFrames] = useState<Frame[]>([]);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const response = await fetch('/api/frames');
        if (response.ok) {
          const customFrames: Frame[] = await response.json();
          setFrames(customFrames);
        } else {
          console.error("Failed to fetch frames from backend");
          setFrames([]);
        }
      } catch (e) {
        console.error("Error connecting to backend.", e);
        setFrames([]);
      }
    };
    
    fetchFrames();
  }, []);

  const handleAddFrame = async (newFrame: Frame) => {
    // Optimistic UI update
    setFrames([newFrame, ...frames]);
    
    try {
      const response = await fetch('/api/frames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFrame),
      });
      
      if (!response.ok) {
        console.error('Failed to save frame to backend');
        // Revert on failure could be implemented here
      }
    } catch (e) {
      console.error('Network error saving frame', e);
    }
  };

  const handleDeleteFrame = async (id: string) => {
    // Optimistic UI update
    setFrames(frames.filter(f => f.id !== id));
    
    try {
      const response = await fetch(`/api/frames/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        console.error('Failed to delete frame from backend');
      }
    } catch (e) {
      console.error('Network error deleting frame', e);
    }
  };

  const handleAdminTabClick = () => {
    if (activeTab === 'admin') {
      setActiveTab('user');
    } else {
      const pass = prompt('Enter Admin Password:');
      if (pass === 'madrasa') {
        setActiveTab('admin');
      } else if (pass !== null) {
        alert('Incorrect password!');
      }
    }
  };

  const t = TRANSLATIONS;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500/10 selection:text-amber-300" id="app-root">
      {/* Premium Header Nav bar with sharp elements */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          
          {/* Logo & description (sharp-cornered branding element) */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-zinc-950 rounded-none shadow-none">
              <Brush className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white leading-none tracking-wider uppercase font-sans flex items-center gap-2">
                {t.appTitle}
                <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none">
                  ECO presets
                </span>
              </h1>
              <p className="text-[11px] text-zinc-500 mt-1.5 max-w-sm sm:max-w-md truncate font-sans">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Minimalist Admin Config Trigger - Settings Icon only */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAdminTabClick}
              title={activeTab === 'user' ? t.adminTitle : 'Go back to Framer'}
              className={`p-2.5 border transition-all rounded-none ${
                activeTab === 'admin' 
                  ? 'bg-amber-500 text-zinc-950 border-amber-500' 
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
              }`}
              id="admin-settings-gear"
            >
              <Settings className={`w-5 h-5 ${activeTab === 'admin' ? 'animate-spin-slow' : ''}`} />
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Frame Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        {activeTab === 'user' ? (
          <UserWorkspace 
            frames={frames} 
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">{t.adminTitle}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{t.adminSubtitle}</p>
              </div>
              <button 
                onClick={() => setActiveTab('user')}
                className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 rounded-none"
              >
                ← Back To Frame Tool
              </button>
            </div>
            
            <AdminPanel 
              frames={frames} 
              onAddFrame={handleAddFrame} 
              onDeleteFrame={handleDeleteFrame} 
            />
          </div>
        )}
      </main>

      {/* Dark Minimal Footer with sharp elements */}
      <footer className="bg-zinc-950 text-zinc-500 py-6 border-t border-zinc-900 text-[11px]" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-400 font-mono">
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            <span className="uppercase tracking-widest text-[10px]">
              INSTAGRAM STORY & WHATSAPP STATUS PHOTO COMPOSER • PRESET EDITION
            </span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-zinc-600">
              © {new Date().getFullYear()} PHOTO FRAME STUDIO. SHARP EDGES DESIGN.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
