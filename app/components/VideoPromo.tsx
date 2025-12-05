"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export default function VideoPromo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = false;
    v.currentTime = 0;
    v.play();
    setIsPlaying(true);
  };

  return (
    <div className="w-full flex flex-col items-center py-16">
      <div className="relative w-full max-w-3xl aspect-video mx-auto">
        {/* VIDEO */}
        <video
          ref={videoRef}
          src="/Cachueleando_promocional.mp4"
          className="w-full h-full object-cover rounded-xl shadow-xl"
          controls={isPlaying}
          muted={!isPlaying}
          playsInline
        />

        {/* OVERLAY + BOTÓN PLAY (solo cuando NO está reproduciendo) */}
        {!isPlaying && (
          <button
            type="button"
            onClick={playVideo}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl"
          >
            <div className="flex items-center justify-center rounded-full bg-indigo-600 text-white p-6 shadow-xl transition-transform hover:scale-110">
              <Play size={40} fill="white" />
            </div>

            <p className="mt-4 text-white text-lg font-semibold drop-shadow">
              Ver demo
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
