import { useState, useRef, useEffect, useCallback } from "react";

/**
 * VideoPlayer — Modular React + Bootstrap Video Player
 *
 * Props:
 *   src         {string}   – Video source URL (required)
 *   poster      {string}   – Thumbnail/poster image URL (optional)
 *   width       {string}   – CSS width of the player, e.g. "100%", "640px" (default: "100%")
 *   height      {string}   – CSS height of the video box, e.g. "360px", "auto" (default: "auto")
 *   aspectRatio {string}   – CSS aspect-ratio shorthand, e.g. "16/9", "4/3", "1/1" (default: "16/9")
 *   autoPlay    {boolean}  – Auto-play on mount (default: false)
 *   muted       {boolean}  – Start muted (default: false)
 *   loop        {boolean}  – Loop the video (default: false)
 *   title       {string}   – Accessible title for the player (optional)
 * 
 * 
 */

export default function VideoPlayer({
  src = "https://www.w3schools.com/html/mov_bbb.mp4",
  poster,
  width = "100%",
  height,
  aspectRatio = "16/9",
  autoPlay = false,
  muted = false,
  loop = false,
  title = "Video Player",
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatTime = (s) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 2800);
    }
  }, [playing]);

  // ─── Video event bindings ────────────────────────────────────────────────────

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => { setPlaying(false); setShowControls(true); clearTimeout(hideTimer.current); };
    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0)
        setBuffered(v.buffered.end(v.buffered.length - 1));
    };
    const onLoadedMetadata = () => setDuration(v.duration);
    const onEnded = () => { setPlaying(false); setShowControls(true); };
    const onVolumeChange = () => {
      setVolume(v.volume);
      setIsMuted(v.muted);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("ended", onEnded);
    v.addEventListener("volumechange", onVolumeChange);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Auto-hide controls while playing
  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [playing, resetHideTimer]);

  // ─── Controls ────────────────────────────────────────────────────────────────

  const togglePlay = () => {
    const v = videoRef.current;
    playing ? v.pause() : v.play();
  };

  const seek = (e) => {
    const v = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * duration;
  };

  const changeVolume = (e) => {
    const val = parseFloat(e.target.value);
    videoRef.current.volume = val;
    videoRef.current.muted = val === 0;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    v.muted = !v.muted;
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  const setRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const skipForward = () => { videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration); };
  const skipBack    = () => { videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0); };

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const progressPct  = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPct  = duration ? (buffered   / duration) * 100 : 0;
  const volumeIcon   = isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊";

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const containerStyle = {
    position: "relative",
    width,
    margin: "0 auto",
    backgroundColor: "#000",
    borderRadius: "10px",
    overflow: "hidden",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
    // Update this line below:
    cursor: showControls ? "auto" : "none", 
  };

  const videoStyle = {
    display: "block",
    width: "100%",
    aspectRatio: height ? undefined : aspectRatio,
    height: height ?? undefined,
    objectFit: "contain",
    backgroundColor: "#000",
  };

  const controlsStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,0.82))",
    padding: "28px 14px 12px",
    transition: "opacity 0.35s ease",
    opacity: showControls ? 1 : 0,
    pointerEvents: showControls ? "auto" : "none",
  };

  const trackBase = {
    position: "relative",
    width: "100%",
    height: "4px",
    borderRadius: "2px",
    backgroundColor: "rgba(255,255,255,0.2)",
    cursor: "pointer",
    marginBottom: "10px",
  };

  const btnStyle = {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "4px 7px",
    fontSize: "16px",
    lineHeight: 1,
    borderRadius: "4px",
    transition: "background 0.15s",
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      aria-label={title}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        style={videoStyle}
        onClick={togglePlay}
        aria-label={title}
        playsInline
      />

      {/* Big play/pause overlay */}
      {!playing && (
        <div
          onClick={togglePlay}
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, color: "#ffffff",
            border: "2px solid rgba(255,255,255,0.4)",
          }}>
            ▶
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div style={controlsStyle}>

        {/* Progress / seek track */}
        <div style={trackBase} onClick={seek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progressPct)}>
          {/* Buffered */}
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${bufferedPct}%`, borderRadius: "2px", background: "rgba(255,255,255,0.3)" }} />
          {/* Played */}
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progressPct}%`, borderRadius: "2px", background: "#ffffff" }} />
          {/* Thumb */}
          <div style={{
            position: "absolute", top: "50%", left: `${progressPct}%`,
            transform: "translate(-50%, -50%)",
            width: 13, height: 13, borderRadius: "50%",
            background: 'var(--bs-primary)', boxShadow: "0 0 0 3px #242498",
          }} />
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

          {/* Play / Pause */}
          <button style={btnStyle} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? "⏸" : "▶"}
          </button>

          {/* Skip back */}
          <button style={{ ...btnStyle, fontSize: 13 }} onClick={skipBack} aria-label="Skip back 10s">
            ↺10
          </button>

          {/* Skip forward */}
          <button style={{ ...btnStyle, fontSize: 13 }} onClick={skipForward} aria-label="Skip forward 10s">
            10↻
          </button>

          {/* Volume */}
          <button style={btnStyle} onClick={toggleMute} aria-label="Toggle mute">
            {volumeIcon}
          </button>
          <input
            type="range" min={0} max={1} step={0.02}
            value={isMuted ? 0 : volume}
            onChange={changeVolume}
            aria-label="Volume"
            style={{ width: 70, accentColor: "#2d2df8", cursor: "pointer" }}
          />

          {/* Time */}
          <span style={{ color: "hsla(0, 0%, 100%, 0.75)", fontSize: 12, marginLeft: 4, whiteSpace: "nowrap" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div style={{ flex: 1 }} />

          {/* Playback speed */}
          <div style={{ position: "relative" }}>
            <button
              style={{ ...btnStyle, fontSize: 12, letterSpacing: "0.04em" }}
              onClick={() => setShowSpeedMenu((s) => !s)}
              aria-label="Playback speed"
            >
              {playbackRate}×
            </button>
            {showSpeedMenu && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 6px)", right: 0,
                background: "rgba(20,20,20,0.95)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 6, overflow: "hidden", minWidth: 60,
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}>
                {speeds.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    style={{
                      display: "block", width: "100%",
                      padding: "6px 14px", textAlign: "center",
                      background: r === playbackRate ? "rgba(232,255,87,0.15)" : "transparent",
                      border: "none", color: r === playbackRate ? "#2727E6" : "#fff",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    {r}×
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button style={btnStyle} onClick={toggleFullscreen} aria-label="Toggle fullscreen">
            {isFullscreen ? "⛶" : "⛶"}
          </button>

        </div>
      </div>
    </div>
  );
}


// ─── Usage Example ─────────────────────────────────────────────────────────────
//
// Default 16:9, fluid width:
//   <VideoPlayer src="/videos/demo.mp4" poster="/thumb.jpg" />
//
// Fixed dimensions:
//   <VideoPlayer src="..." width="800px" height="450px" />
//
// Custom aspect ratio (4:3 cinema):
//   <VideoPlayer src="..." aspectRatio="4/3" />
//
// Square (1:1 social):
//   <VideoPlayer src="..." aspectRatio="1/1" width="400px" />
//
// With all options:
//   <VideoPlayer
//     src="/videos/demo.mp4"
//     poster="/images/thumb.jpg"
//     width="100%"
//     aspectRatio="16/9"
//     autoPlay={false}
//     muted={false}
//     loop={false}
//     title="My Awesome Video"
//   />