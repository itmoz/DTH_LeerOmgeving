import React from "react";

/**
 * GIFPlayer — Modular React + Bootstrap Wrapper for GIFs
 *
 * Props:
 * src         {string}   – GIF source URL (required)
 * alt         {string}   – Alt text for accessibility (default: "Animated GIF")
 * width       {string}   – CSS width of the player, e.g. "100%", "640px" (default: "100%")
 * height      {string}   – CSS height of the box, e.g. "360px", "auto" (default: "auto")
 * aspectRatio {string}   – CSS aspect-ratio shorthand, e.g. "16/9", "4/3" (optional)
 */

export default function GIFPlayer({
  src,
  alt = "Animated GIF",
  width = "100%",
  height,
  aspectRatio,
}) {
  // Matches the exact container style of your VideoPlayer
  const containerStyle = {
    position: "relative",
    width,
    margin: "0 auto",
    backgroundColor: "#000",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const imageStyle = {
    display: "block",
    width: "100%",
    aspectRatio: height ? undefined : aspectRatio,
    height: height ?? undefined,
    objectFit: "contain",
    backgroundColor: "#000",
  };

  return (
    <div style={containerStyle}>
      <img src={src} alt={alt} style={imageStyle} />
    </div>
  );
}
