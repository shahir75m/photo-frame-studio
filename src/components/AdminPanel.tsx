import React, { useState, useRef } from 'react';
import { Frame } from '../types';
import { TRANSLATIONS } from '../utils/translation';
import { Plus, Trash2, Eye, Frame as FrameIcon, Upload, Check, Info } from 'lucide-react';

interface AdminPanelProps {
  frames: Frame[];
  onAddFrame: (frame: Frame) => void;
  onDeleteFrame: (id: string) => void;
}

export default function AdminPanel({ frames, onAddFrame, onDeleteFrame }: AdminPanelProps) {
  const t = TRANSLATIONS;

  // Forms
  const [nameEn, setNameEn] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16'>('1:1');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle PNG frame upload
  const handlePngUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      setErrorMsg('Please upload a transparent PNG image file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageFile(event.target.result as string);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateFrame = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim()) {
      setErrorMsg('Please provide a layout name');
      return;
    }

    if (!imageFile) {
      setErrorMsg('Please upload a transparent PNG frame asset');
      return;
    }

    const newFrame: Frame = {
      id: `custom-${Date.now()}`,
      name: nameEn.trim(),
      aspectRatio,
      imageUrl: imageFile,
      isDefault: false
    };

    onAddFrame(newFrame);

    // Reset Form
    setNameEn('');
    setAspectRatio('1:1');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setSuccessMsg(t.toastFrameSaved);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  // Safe deletion helper
  const handleDelete = (frameId: string) => {
    onDeleteFrame(frameId);
    if (deletingId === frameId) {
      setDeletingId(null);
    }
  };

  const customFrames = frames.filter(f => !f.isDefault);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-zinc-100" id="admin-panel">
      {/* Configuration Form Card */}
      <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-none shadow-none p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-850 pb-5">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-none border border-amber-500/20">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-white uppercase">
              {t.createNewFrame}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Add transparent PNG graphics formatted for square or portrait screens
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-950/40 text-rose-300 border border-rose-800/50 rounded-none text-xs flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 rounded-none text-xs flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateFrame} className="space-y-6">
          {/* Layout Label */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide">
              {t.frameNameEn} <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. June 5 Green Minimal Square"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-none focus:ring-1 focus:ring-amber-500 outline-none text-zinc-200 placeholder-zinc-700 text-sm transition-all"
              required
            />
          </div>

          {/* Aspect Ratio Choice */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide">
              {t.frameType}
            </label>
            <div className="grid grid-cols-2 gap-2.5 pb-2">
              {(['1:1', '9:16'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2.5 text-xs font-mono font-bold rounded-none border text-center transition-all ${
                    aspectRatio === ratio
                      ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-none'
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 bg-zinc-950'
                  }`}
                >
                  {ratio === '1:1' ? '1:1 (Instagram Feed / Post)' : '9:16 (WhatsApp Status / Story)'}
                </button>
              ))}
            </div>
          </div>

          {/* Custom PNG Frame Image Upload container */}
          <div className="p-5 bg-zinc-950 rounded-none border border-zinc-850 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wide">
                  {t.framePngUpload}
                </span>
                <p className="text-[11px] text-zinc-600 mt-1 max-w-sm leading-relaxed">
                  {t.framePngHelp}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border border-zinc-800 border-dashed rounded-none cursor-pointer bg-zinc-900/10 hover:bg-zinc-900/30 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <Upload className="w-7 h-7 text-zinc-600 group-hover:text-amber-500 mb-2 transition-colors" />
                  <p className="text-xs font-bold text-zinc-400 mb-1 group-hover:text-amber-400 transition-colors">
                    Click to select transparent PNG frame file
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">PNG only</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  onChange={handlePngUpload}
                  className="hidden"
                />
              </label>
            </div>

            {imageFile && (
              <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-none p-3 text-amber-200 text-xs">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="truncate flex-1 font-semibold">Frame asset imported. Ready to save.</span>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-zinc-500 hover:text-rose-400 font-bold px-1 text-base leading-none"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
            <span>{t.saveFrame}</span>
          </button>
        </form>
      </div>

      {/* Frame Preview Card & Custom List */}
      <div className="lg:col-span-5 space-y-6">
        {/* Real-time Preview Area */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-none shadow-none p-6 flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-zinc-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t.previewFrame}
            </h3>
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-850 rounded-none p-6 flex items-center justify-center min-h-[220px]">
            {/* Visual Frame Wrapper representing aspect ratio */}
            <div
              className="relative overflow-hidden bg-zinc-900 flex items-center justify-center border border-zinc-800"
              style={{
                width: '100%',
                maxWidth: '180px',
                aspectRatio: aspectRatio === '1:1' ? '1' : '9/16',
              }}
            >
              {/* Layer representation */}
              {imageFile ? (
                <>
                  <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center">
                    <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest text-center px-1">
                      USER PHOTO UNDERLAY
                    </span>
                  </div>
                  <img
                    src={imageFile}
                    alt="PNG Frame Overlay"
                    className="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 p-4 text-center text-xs">
                  <FrameIcon className="w-6 h-6 mb-2 stroke-1" />
                  <span className="font-mono text-[10px] uppercase">No asset file loaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-amber-500/5 text-amber-200/90 text-xs rounded-none flex items-start gap-2 border border-amber-500/10">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
            <span className="leading-relaxed font-mono text-[11px]">
              This preset uses active ratio {aspectRatio}.
            </span>
          </div>
        </div>

        {/* Custom Created Presets List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-none shadow-none p-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            User Installed Frames
          </h3>

          {customFrames.length === 0 ? (
            <div className="text-center py-8 text-zinc-650 bg-zinc-950 border border-dashed border-zinc-850 rounded-none text-xs p-5">
              <FrameIcon className="w-6 h-6 mx-auto mb-2 opacity-30 text-zinc-600" />
              <p className="font-mono font-bold uppercase text-[10px] tracking-wider text-zinc-600">No Custom Templates</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {customFrames.map((frame) => (
                <div
                  key={frame.id}
                  className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-850 rounded-none hover:border-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-none border border-zinc-800 flex-shrink-0 overflow-hidden bg-zinc-900 flex items-center justify-center p-0.5">
                      <img
                        src={frame.imageUrl}
                        alt="custom preview"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-zinc-200 truncate">
                        {frame.name}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                        {frame.aspectRatio} • {t.customTag}
                      </span>
                    </div>
                  </div>

                  {deletingId === frame.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(frame.id)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-zinc-100 text-[10px] font-black uppercase tracking-widest rounded-none"
                      >
                        Sure?
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-none"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(frame.id)}
                      className="p-2 hover:bg-rose-950/40 text-zinc-650 hover:text-rose-400 rounded-none transition-colors border border-transparent hover:border-rose-900/30"
                      title="Delete Frame"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
