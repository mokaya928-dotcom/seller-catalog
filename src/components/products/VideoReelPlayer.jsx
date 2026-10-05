import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Play, Pause, Download, Share2, Sparkles, RefreshCw, 
  Plus, Trash2, Check, Smartphone, Film, Layers, Zap,
  Sliders, ArrowRight, Eye, Video as VideoIcon, Palette, Image as ImageIcon
} from 'lucide-react';
import { 
  REEL_TRANSITIONS, 
  REEL_SPEEDS, 
  renderReelSlidePosters, 
  drawReelFrame, 
  recordReelVideo 
} from '../../services/videoReelService';
import { shareService } from '../../services/shareService';
import { getOptimizedImageUrl } from '../../utils/imageUtils';
import WhatsAppIcon from '../common/WhatsAppIcon';
import InstagramIcon from '../common/InstagramIcon';

export default function VideoReelPlayer({
  product,
  seller,
  ratio = 'status',
  design = 'retail_classic',
  palette = null,
  mood = null,
  initialPhotos = [],
  caption = '',
  onShowToast
}) {
  const isStatus = ratio === 'status';
  const canvasWidth = 1080;
  const canvasHeight = isStatus ? 1920 : 1350;

  // 1. Photos list in the reel
  const initialPool = useMemo(() => {
    if (Array.isArray(initialPhotos) && initialPhotos.length > 0) return initialPhotos;
    if (Array.isArray(product?.photos) && product.photos.length > 0) return product.photos;
    if (product?.photo) return [product.photo];
    if (product?.image_url) return [product.image_url];
    return ['/products/bbk-vaseline-lip.jpg'];
  }, [initialPhotos, product]);

  const [selectedPhotos, setSelectedPhotos] = useState(initialPool);
  const [activeTransition, setActiveTransition] = useState('silk_crossfade');
  const [activeSpeedId, setActiveSpeedId] = useState('standard');
  const [showStoryBars, setShowStoryBars] = useState(true);
  const [showVariantDots, setShowVariantDots] = useState(true);

  // 2. Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);
  const [slides, setSlides] = useState([]);

  // 3. Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  // 4. Add photo modal/inputs
  const [showAddModal, setShowAddModal] = useState(false);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const fileInputRef = useRef(null);

  // Canvas Refs
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const lastTimeRef = useRef(null);
  const progressRef = useRef(0);

  const speedObj = useMemo(() => {
    return REEL_SPEEDS.find((s) => s.id === activeSpeedId) || REEL_SPEEDS[1];
  }, [activeSpeedId]);

  const secondsPerSlide = speedObj.seconds;

  // Pre-render slides whenever product, design, palette, mood, ratio or photo list changes
  useEffect(() => {
    let isCurrent = true;
    setIsLoadingSlides(true);
    setRecordedVideo(null); // Reset previously recorded video when parameters change

    renderReelSlidePosters({
      product,
      seller,
      ratio,
      design,
      palette,
      mood,
      photos: selectedPhotos
    })
      .then((renderedSlides) => {
        if (!isCurrent) return;
        setSlides(renderedSlides);
        setIsLoadingSlides(false);
        progressRef.current = 0;
        setCurrentSlideIndex(0);
      })
      .catch((err) => {
        console.error('Failed to pre-render reel slide posters:', err);
        if (isCurrent) {
          setIsLoadingSlides(false);
          if (onShowToast) onShowToast('Could not load slide frames for reel', 'error');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [product, seller, ratio, design, palette, mood, selectedPhotos, onShowToast]);

  // Real-time 60fps Live Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isLoadingSlides || slides.length === 0 || isRecording) {
      return;
    }

    const ctx = canvas.getContext('2d');
    lastTimeRef.current = performance.now();

    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying && slides.length > 1) {
        progressRef.current = (progressRef.current + (dt / secondsPerSlide)) % slides.length;
      }

      drawReelFrame(ctx, canvasWidth, canvasHeight, slides, progressRef.current, {
        transitionStyle: activeTransition,
        showStoryBars,
        showVariantDots,
        brandColor: seller?.brand_color || '#10b981'
      });

      const activeIdx = Math.floor(progressRef.current) % slides.length;
      setCurrentSlideIndex(activeIdx);

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    isLoadingSlides, 
    slides, 
    isPlaying, 
    secondsPerSlide, 
    activeTransition, 
    showStoryBars, 
    showVariantDots, 
    seller?.brand_color, 
    canvasWidth, 
    canvasHeight, 
    isRecording
  ]);

  // Jump to specific slide
  const handleSelectSlide = (idx) => {
    progressRef.current = idx;
    setCurrentSlideIndex(idx);
    const canvas = canvasRef.current;
    if (canvas && slides.length > 0) {
      const ctx = canvas.getContext('2d');
      drawReelFrame(ctx, canvasWidth, canvasHeight, slides, idx, {
        transitionStyle: activeTransition,
        showStoryBars,
        showVariantDots,
        brandColor: seller?.brand_color || '#10b981'
      });
    }
  };

  // Remove photo from reel
  const handleRemovePhoto = (idxToRemove) => {
    if (selectedPhotos.length <= 1) {
      if (onShowToast) onShowToast('Keep at least 1 image for the flyer', 'info');
      return;
    }
    const updated = selectedPhotos.filter((_, i) => i !== idxToRemove);
    setSelectedPhotos(updated);
  };

  // Add photo via URL
  const handleAddPhotoUrl = () => {
    const url = customPhotoInput.trim();
    if (!url) return;
    setSelectedPhotos((prev) => [...prev, url]);
    setCustomPhotoInput('');
    setShowAddModal(false);
    if (onShowToast) onShowToast('✓ Added new color variant photo!', 'success');
  };

  // Add photo via local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setSelectedPhotos((prev) => [...prev, dataUrl]);
      setShowAddModal(false);
      if (onShowToast) onShowToast('✓ Image uploaded to color reel!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Record 1080p Video Reel Export
  const handleRecordReel = async () => {
    if (slides.length === 0 || isRecording) return;

    setIsRecording(true);
    setRecordProgress(0);

    // Create an offscreen recording canvas matching exact master resolution
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;

    try {
      if (onShowToast) onShowToast('Recording 1080p Video Reel...', 'info');

      const result = await recordReelVideo(
        exportCanvas,
        slides,
        {
          fps: 30,
          secondsPerSlide,
          loops: 1,
          transitionStyle: activeTransition,
          showStoryBars,
          showVariantDots,
          brandColor: seller?.brand_color || '#10b981'
        },
        ({ percent }) => {
          setRecordProgress(percent);
        }
      );

      const safeName = (product?.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `${safeName}-color-reel-${slides.length}colors-${ratio}.${result.extension}`;

      setRecordedVideo({
        ...result,
        filename
      });

      if (onShowToast) {
        onShowToast(`✓ Video Reel generated (${result.extension.toUpperCase()})! Ready to share.`, 'success');
      }
    } catch (err) {
      console.error('Failed to record video reel:', err);
      if (onShowToast) onShowToast('Could not record video on this browser.', 'error');
    } finally {
      setIsRecording(false);
    }
  };

  // Share recorded video to WhatsApp
  const handleShareVideo = async () => {
    if (!recordedVideo || isSharing) return;
    setIsSharing(true);

    try {
      const res = await shareService.sharePost({
        blob: recordedVideo.blob,
        filename: recordedVideo.filename,
        caption: caption
      });

      if (res.success) {
        if (onShowToast) onShowToast('✓ Video Reel shared to WhatsApp! Caption copied ready to paste.', 'success');
      } else if (res.method === 'cancelled') {
        if (onShowToast) onShowToast('Share closed. Caption copied to clipboard.', 'info');
      }
    } catch (err) {
      console.error('Share failed', err);
      if (onShowToast) onShowToast('Could not share video. Use Download instead.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  // Download video file directly
  const handleDownloadVideo = () => {
    if (!recordedVideo) return;
    shareService.downloadPosterOnly({
      blob: recordedVideo.blob,
      filename: recordedVideo.filename
    });
    if (onShowToast) {
      onShowToast(`✓ Video Reel saved to your device (${recordedVideo.filename})!`, 'success');
    }
  };

  return (
    <div className="space-y-3">
      {/* ------------------------------------------------------------- */}
      {/* 1. SPEED & TRANSITION SELECTORS                               */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Transition Style */}
        <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700 space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Swap Transition:</span>
            </span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
            {REEL_TRANSITIONS.map((trans) => {
              const isSelected = activeTransition === trans.id;
              return (
                <button
                  key={trans.id}
                  type="button"
                  onClick={() => setActiveTransition(trans.id)}
                  className={`flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-slate-900 text-slate-300 border-slate-700/70 hover:border-slate-600'
                  }`}
                  title={trans.desc}
                >
                  <span>{trans.icon}</span>
                  <span>{trans.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed Selection */}
        <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700 space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3 h-3 text-emerald-400" />
              <span>Speed per Color:</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400">
              {speedObj.seconds}s
            </span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
            {REEL_SPEEDS.map((sp) => {
              const isSelected = activeSpeedId === sp.id;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setActiveSpeedId(sp.id)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-black transition cursor-pointer text-center border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                      : 'bg-slate-900 text-slate-400 border-slate-700/70 hover:text-white'
                  }`}
                  title={sp.desc}
                >
                  {sp.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. PHOTO & COLOR VARIANT PICKER (Manage 4 Colors)             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>Colors &amp; Angles in Reel ({selectedPhotos.length} Active):</span>
          </span>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="text-[10px] font-black bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3 h-3 stroke-[3px]" />
            <span>Add Color</span>
          </button>
        </div>

        {/* Thumbnail Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {selectedPhotos.map((photoUrl, idx) => {
            const isCurrent = currentSlideIndex === idx;
            return (
              <div
                key={idx}
                className="relative flex-shrink-0 group"
              >
                <button
                  type="button"
                  onClick={() => handleSelectSlide(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 bg-slate-950 flex-shrink-0 transition-all cursor-pointer relative ${
                    isCurrent
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-md'
                      : 'border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-500'
                  }`}
                  title={`Color / Angle ${idx + 1}`}
                >
                  <img
                    src={getOptimizedImageUrl(photoUrl)}
                    alt={`Color ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-black text-white text-center py-0.5 leading-none">
                    #{idx + 1}
                  </div>
                </button>

                {selectedPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(idx);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs cursor-pointer"
                    title="Remove from reel"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {selectedPhotos.length < 4 && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-400/80 bg-slate-900/60 text-slate-400 hover:text-emerald-300 flex flex-col items-center justify-center gap-0.5 flex-shrink-0 transition cursor-pointer"
              title="Add another color image"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[8px] font-bold">+Color</span>
            </button>
          )}
        </div>

        {/* Tip for single photo */}
        {selectedPhotos.length === 1 && (
          <div className="bg-amber-950/40 border border-amber-600/30 rounded-xl p-2 text-[10px] text-amber-200/90 flex items-center justify-between gap-2">
            <span>💡 Add 2 to 4 photos to activate the smooth multi-color swap!</span>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="font-bold underline text-amber-300 hover:text-white flex-shrink-0 cursor-pointer"
            >
              + Add 2nd Color
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. LIVE CANVAS / VIDEO PLAYER DISPLAY                         */}
      {/* ------------------------------------------------------------- */}
      <div className="relative group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2 min-h-[340px] sm:min-h-[400px]">
        {/* Loading Spinner */}
        {isLoadingSlides && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xs rounded-2xl transition-all">
            <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-amber-300 text-xs font-black mt-3">
              Pre-Rendering {selectedPhotos.length} Color Slides...
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Applying Branded Frame &amp; HD Master Quality
            </span>
          </div>
        )}

        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md rounded-2xl p-6 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
              <Film className="w-7 h-7" />
            </div>
            <span className="text-white text-sm font-black mb-1">
              Encoding 1080p Video Reel...
            </span>
            <span className="text-xs text-amber-400 font-bold mb-3">
              {recordProgress}% Complete
            </span>
            
            {/* Progress Bar */}
            <div className="w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-150"
                style={{ width: `${recordProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-2">
              Capturing 30 FPS deterministic frames for WhatsApp Status
            </span>
          </div>
        )}

        {/* Live Canvas Player */}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className={`w-auto object-contain rounded-2xl shadow-2xl transition-all ring-1 ring-slate-800/80 cursor-pointer ${
            isStatus ? 'max-h-[52vh] sm:max-h-[58vh]' : 'max-h-[44vh] sm:max-h-[50vh]'
          }`}
          onClick={() => setIsPlaying(!isPlaying)}
          title="Click to play or pause reel"
        />

        {/* Floating Play / Pause Overlay Button */}
        {!isLoadingSlides && !isRecording && (
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white border border-slate-700/80 flex items-center justify-center transition shadow-lg cursor-pointer backdrop-blur-xs"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <div className="bg-slate-900/85 text-[10px] font-black text-amber-300 px-2.5 py-1 rounded-full border border-slate-700/80 backdrop-blur-xs shadow-md">
              Color {currentSlideIndex + 1} of {selectedPhotos.length} • {isPlaying ? 'Playing' : 'Paused'}
            </div>
          </div>
        )}

        {/* Live status badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-emerald-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-400/40 shadow-xs flex items-center gap-1 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>LIVE 60FPS</span>
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. OVERLAYS TOGGLE (Story Bars & Indicator Dots)              */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between p-2 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold">
          <input
            type="checkbox"
            checked={showStoryBars}
            onChange={(e) => setShowStoryBars(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
          />
          <span>Story Progress Bars (Top)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold">
          <input
            type="checkbox"
            checked={showVariantDots}
            onChange={(e) => setShowVariantDots(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
          />
          <span>Color Dots Pill (Bottom)</span>
        </label>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. EXPORT / SHARE VIDEO ACTIONS                               */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 space-y-2">
        {!recordedVideo ? (
          <button
            type="button"
            onClick={handleRecordReel}
            disabled={isLoadingSlides || isRecording || slides.length === 0}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:opacity-95 active:scale-[0.99] text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer text-xs sm:text-sm disabled:opacity-50"
          >
            <VideoIcon className="w-4 h-4" />
            <span>🎬 Export 1080p Video Reel ({selectedPhotos.length} Colors • {speedObj.label})</span>
          </button>
        ) : (
          <div className="space-y-2 animate-fade-in">
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-extrabold flex items-center gap-1.5 text-[11px]">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3px]" />
                <span>Video Reel Ready ({recordedVideo.extension.toUpperCase()})!</span>
              </span>
              <button
                type="button"
                onClick={handleRecordReel}
                disabled={isRecording}
                className="text-[10px] text-slate-400 hover:text-white underline font-bold cursor-pointer"
              >
                🔁 Re-record
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Share Video to WhatsApp */}
              <button
                type="button"
                onClick={handleShareVideo}
                disabled={isSharing}
                className="bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-extrabold py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer text-xs"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white flex-shrink-0" />
                <span className="truncate">{isSharing ? 'Sharing...' : 'Share Video to WhatsApp'}</span>
              </button>

              {/* Download Video */}
              <button
                type="button"
                onClick={handleDownloadVideo}
                className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 border border-slate-600 transition cursor-pointer text-xs"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span className="truncate">Download Video</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. MODAL TO ADD PHOTO / COLOR VARIANT                         */}
      {/* ------------------------------------------------------------- */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Color Variant Image</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            {/* Option A: Paste image URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Option 1: Image URL from Website / Supplier
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://.../phone-blue.jpg"
                  value={customPhotoInput}
                  onChange={(e) => setCustomPhotoInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  disabled={!customPhotoInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              — OR —
            </div>

            {/* Option B: Upload from device */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Option 2: Upload Photo from Phone / PC
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Choose Image from Device</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
