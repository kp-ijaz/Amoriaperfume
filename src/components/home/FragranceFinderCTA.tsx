'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

export function FragranceFinderCTA() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '70vh', minHeight: '420px' }}>

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://videos.pexels.com/video-files/5688891/5688891-hd_1920_1080_30fps.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/3571264/3571264-hd_1280_720_25fps.mp4" type="video/mp4" />
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
      </video>

      {/* Mute / Unmute */}
      <button
        onClick={toggleMute}
        className="absolute bottom-5 right-5 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'white' }}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

    </section>
  );
}
