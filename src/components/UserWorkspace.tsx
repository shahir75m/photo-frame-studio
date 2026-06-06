import React, { useState, useRef, useEffect } from 'react';
import { Frame, PhotoAdjustment } from '../types';
import { TRANSLATIONS } from '../utils/translation';
import { 
  Upload, Image as ImageIcon, ZoomIn, RotateCw, Move, Sparkles, 
  Download, RefreshCw
} from 'lucide-react';

interface UserWorkspaceProps {
  frames: Frame[];
}

export default function UserWorkspace({ frames }: UserWorkspaceProps) {
  const t = TRANSLATIONS;

  // Selected Frame State (default to first frame)
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  // Auto-select the first frame when frames load
  useEffect(() => {
    if (frames.length > 0 && !selectedFrame) {
      setSelectedFrame(frames[0]);
    }
  }, [frames]);

  // Photo State
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragPhotoOffset = useRef({ x: 0, y: 0 });

  // Photo Adjustments state (Only zoom, rotation & offsets. NO FILTERS)
  const initialAdjustments: PhotoAdjustment = {
    zoom: 1.0,
    x: 0,
    y: 0,
    rotation: 0
  };
  const [adjustments, setAdjustments] = useState<PhotoAdjustment>(initialAdjustments);

  // Action status states
  const [isRendering, setIsRendering] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Refs for tracking elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoImageRef = useRef<HTMLImageElement>(null);
  const frameImageRef = useRef<HTMLImageElement>(null);
  const workspaceContainerRef = useRef<HTMLDivElement>(null);

  // Reset adjustments
  const handleResetAdjustments = () => {
    setAdjustments(initialAdjustments);
  };

  // Upload Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadPhoto(file);
    }
  };

  const loadPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoSrc(e.target.result as string);
        handleResetAdjustments();
        showToast(t.toastPhotoLoaded);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      loadPhoto(file);
    }
  };

  // Direct Interactive drag-to-pan photo inside the frame overlay
  const handlePhotoMouseDown = (e: React.MouseEvent) => {
    if (!photoSrc) return;
    e.preventDefault();
    setIsPhotoDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragPhotoOffset.current = { x: adjustments.x, y: adjustments.y };
  };

  const handlePhotoMouseMove = (e: React.MouseEvent) => {
    if (!isPhotoDragging || !photoSrc) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    // Scale panning speed of photo down slightly for precision control
    const sensitivity = 0.85;
    setAdjustments(prev => ({
      ...prev,
      x: dragPhotoOffset.current.x + dx * sensitivity,
      y: dragPhotoOffset.current.y + dy * sensitivity
    }));
  };

  const stopPhotoDrag = () => {
    setIsPhotoDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      stopPhotoDrag();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isPhotoDragging]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Build high-resolution export Canvas
  const handleDownload = () => {
    if (!photoSrc || !photoImageRef.current) {
      alert(t.noPhotoError);
      return;
    }

    if (!selectedFrame) return;

    const img = photoImageRef.current;
    const frameOverImg = frameImageRef.current;

    if (!frameOverImg) {
      alert("Frame overlay element not found. Please try again.");
      return;
    }

    if (!img.complete || img.naturalWidth === 0) {
      alert("User photo is still loading. Please try again.");
      return;
    }

    if (!frameOverImg.complete || frameOverImg.naturalWidth === 0) {
      alert("Frame overlay is still loading. Please try again.");
      return;
    }

    setIsRendering(true);

    try {
      // 3. Define canvas resolution (High print output for beautiful resolution)
      // Instagram Post is 1080x1080 (1:1), Stories/Statuses are 1080x1920 (9:16)
      let canvasWidth = 1080;
      let canvasHeight = 1080;

      if (selectedFrame.aspectRatio === '9:16') {
        canvasWidth = 1080;
        canvasHeight = 1920;
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context could not be acquired');
      }

      // Smooth resizing render settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear with elegant black background backdrop
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Save contextual state
      ctx.save();

      // 4. Calculate photo centering & transformation inside the full frame area
      const imgScaleW = canvasWidth / img.naturalWidth;
      const imgScaleH = canvasHeight / img.naturalHeight;
      const fitScale = Math.max(imgScaleW, imgScaleH); // fill-cover mode

      const drawW = img.naturalWidth * fitScale * adjustments.zoom;
      const drawH = img.naturalHeight * fitScale * adjustments.zoom;

      // Translate photo context to center
      ctx.translate(canvasWidth / 2, canvasHeight / 2);

      // User translation offset factor (scaled proportional to high canvas resolution)
      // Ref size is 450px visually on screen
      const workspaceRefSize = 450;
      const panFactorX = canvasWidth / workspaceRefSize;
      const panFactorY = canvasHeight / workspaceRefSize;
      ctx.translate(adjustments.x * panFactorX, adjustments.y * panFactorY);

      // Apply rotation
      ctx.rotate((adjustments.rotation * Math.PI) / 180);

      // Draw photo beneath the frame template
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      // Restore transform context
      ctx.restore();

      // 5. Draw the transparent PNG/SVG template frame EXACTLY matching the bounds of canvas
      ctx.drawImage(frameOverImg, 0, 0, canvasWidth, canvasHeight);

      // 6. Trigger high-resolution image downloader
      const imageURL = canvas.toDataURL('image/png', 1.0);
      const downloadLink = document.createElement('a');
      const safeTitle = selectedFrame.name.replace(/\s+/g, '_').toLowerCase();
      downloadLink.download = `framed_photo_${safeTitle}_${Date.now()}.png`;
      downloadLink.href = imageURL;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(t.downloadSuccess);
    } catch (err) {
      console.error(err);
      alert(t.downloadError);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-zinc-100" id="user-workspace">
      {/* Visual Canvas Sandbox Left Area */}
      <div className="xl:col-span-7 flex flex-col items-center">

        {/* Framing Workspace Block */}
        <div 
          ref={workspaceContainerRef}
          className={`relative w-full max-w-[450px] border border-zinc-800 bg-zinc-950 transition-all duration-300 rounded-none flex items-center justify-center p-0 overflow-hidden ${
            isDragOver 
              ? 'border-amber-500/50 bg-amber-500/5 shadow-none' 
              : 'shadow-none'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            aspectRatio: selectedRatio === '1:1' ? '1' : '9/16'
          }}
        >
          {photoSrc ? (
            <div 
              className="relative w-full h-full select-none cursor-move flex items-center justify-center overflow-hidden"
              onMouseDown={handlePhotoMouseDown}
              onMouseMove={handlePhotoMouseMove}
              id="drawing-viewport"
            >
              {/* Photo loaded under the frame overlays */}
              <img
                ref={photoImageRef}
                src={photoSrc}
                alt="Uploaded base to frame"
                className="max-w-none max-h-none absolute pointer-events-none"
                style={{
                  transform: `translate(${adjustments.x}px, ${adjustments.y}px) rotate(${adjustments.rotation}deg) scale(${adjustments.zoom})`,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                referrerPolicy="no-referrer"
              />

              {/* Styled Transparent PNG/SVG overlay representing active custom frame */}
              {selectedFrame && (
                <img 
                  ref={frameImageRef}
                  src={selectedFrame.imageUrl}
                  alt="Transparent PNG layout overlay border"
                  className="absolute inset-0 w-full h-full object-fill z-10 pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          ) : (
            /* Upload File Placeholder Prompt trigger box */
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center text-center p-12 h-full w-full cursor-pointer bg-zinc-900/10 hover:bg-zinc-900/30 transition-colors"
              id="upload-trigger-box"
            >
              <div className="p-4 bg-amber-500/10 text-amber-500 rounded-none mb-4 border border-amber-500/20">
                <Upload className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest leading-none">
                {t.photoUploadTitle}
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-2.5 leading-relaxed">
                {t.uploadPrompt}
              </p>
              <span className="text-[10px] text-zinc-600 mt-6 uppercase tracking-widest font-mono font-bold">
                {t.uploadHelp}
              </span>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Change Photo Utility Toolbar when photo is loaded */}
        {photoSrc && (
          <div className="flex gap-2 mt-5" id="loaded-toolbar">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.changePhoto}</span>
            </button>
            <button
              onClick={handleResetAdjustments}
              className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-500 hover:text-zinc-400 rounded-none text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>{t.resetAdjustments}</span>
            </button>
          </div>
        )}

        {/* Interactive Floating Toast updates */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 bg-zinc-950 text-white border border-zinc-850 py-3.5 px-5 rounded-none shadow-none flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest z-50">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-bold">{toastMsg}</span>
          </div>
        )}
      </div>

      {/* Control sliders & Presets Choice Panel Right Area */}
      <div className="xl:col-span-5 space-y-6">
        
        {/* Presets choice selection */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-none shadow-none p-5">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t.selectFrame}
            </h3>
          </div>

          {frames.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs bg-zinc-950 border border-zinc-800 rounded-none leading-relaxed font-mono">
              <p className="font-bold uppercase tracking-widest">No frames added yet.</p>
              <p className="text-[10px] text-zinc-600 mt-2">{t.addYourOwnFramePrompt}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 max-h-[280px] overflow-y-auto pr-1" id="frame-preset-grid">
              {frames.map((frame) => {
                const isSelected = selectedFrame?.id === frame.id;
                return (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`flex items-center gap-3 text-left p-2.5 rounded-none border text-sm transition-all focus:outline-none ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-500/5 shadow-none' 
                        : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
                    }`}
                  >
                    {/* Small thumbnail */}
                    <div className="w-10 h-10 rounded-none overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center p-0.5 flex-shrink-0">
                      <img
                        src={frame.imageUrl}
                        alt="thumbnail preview"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-zinc-500">
                          {frame.aspectRatio}
                        </span>
                        <span className="text-[8px] px-1 py-0.5 rounded-none font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/10">
                          {t.customTag}
                        </span>
                      </div>

                      <span className="font-bold text-zinc-200 text-xs truncate block">
                        {frame.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Workspace controls loaded ONLY if user has uploaded a photo */}
        {photoSrc ? (
          <div className="space-y-4">
            {/* Panning instructions */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-none text-xs flex gap-2.5 leading-relaxed font-mono text-zinc-400">
              <Move className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
              <span>
                Tip: Drag the photo inside the canvas space with your cursor/touch to align it perfectly.
              </span>
            </div>

            {/* Core MASTER DOWNLOAD TRIGGER BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-none flex items-center justify-center gap-3.5"
                id="main-download-button"
              >
                {isRendering ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t.downloading}</span>
                  </div>
                ) : (
                  <>
                    <Download className="w-4.5 h-4.5 stroke-[2.5]" />
                    <span>{t.downloadBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Locked prompt to invite user behavior */
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-8 text-center text-zinc-650">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-zinc-750" />
            <span className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              No Active Workspace
            </span>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-2 leading-relaxed">
              Upload your photo inside the viewport on the left to see the preview and download the output.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
