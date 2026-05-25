// components/player/MusicPlayer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat2,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2,
  Minimize2,
  PlusCircle 
  ,
} from "lucide-react";

interface MusicPlayerProps {
  song: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    audio: string;
    duration: number;
    source: string;
  };
}

export default function MusicPlayer({ song }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState(79);

  const [duration, setDuration] = useState<number>(0);

  const [progress, setProgress] = useState(0);

  const [volume, setVolume] = useState(100);

  const [isMuted, setIsMuted] = useState(false);

  const [isSaved, setIsSaved] = useState(true);

  const [isShuffle, setIsShuffle] = useState(false);

  const [isRepeat, setIsRepeat] = useState(false);

  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  // PLAYER ENTRY ANIMATION
  useEffect(() => {
    if (!playerRef.current) return;

    gsap.fromTo(
      playerRef.current,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
      },
    );
  }, []);

  // AUDIO CONTROLS
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume / 100;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // UPDATE TIMELINE
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);

    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100,
    );
  };

  // SEEK SONG
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const value = Number(e.target.value);

    audioRef.current.currentTime = (value / 100) * audioRef.current.duration;

    setProgress(value);
  };

  // VOLUME
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  // FORMAT TIME
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);

    const secs = Math.floor(time % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={song.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      <footer
        ref={playerRef}
        className={`fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-white/10 backdrop-blur-3xl ${
          isMiniPlayer ? "h-20" : "h-24"
        }`}
      >
        <div className="flex h-full items-center justify-between px-3 md:px-5">
          {/* ========================= */}
          {/* LEFT */}
          {/* ========================= */}
          <div className="flex min-w-0 items-center gap-3 md:w-[28%]">
            {/* SONG IMAGE */}
            <div className="relative h-14 w-14 overflow-hidden rounded-xl md:h-16 md:w-16">
              <Image
                src={song.cover}
                alt={song.title}
                fill
                className="object-cover"
              />
            </div>

            {/* SONG INFO */}
            <div className="min-w-0">
              <Link
                href={
                  song.source ? `/playlist/${song.source}` : `/song/${song.id}`
                }
                className="block truncate text-sm font-semibold text-white transition hover:text-[#1ED760]"
              >
                {song.title}
              </Link>

              <p className="truncate text-xs text-neutral-400 md:text-sm">
                {song.artist}
              </p>
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              type="button"
              className="hidden transition hover:scale-110 sm:block"
            >
              <PlusCircle
                className={`h-5 w-5 transition ${
                  isSaved ? "fill-[#75007e] text-[#0B071F]" : "text-neutral-400"
                }`}
              />
            </button>
          </div>

          {/* ========================= */}
          {/* CENTER PLAYER */}
          {/* ========================= */}
          <div className="hidden flex-col items-center justify-center md:flex md:w-[44%]">
            {/* PLAYER CONTROLS */}
            <div className="mb-2 flex items-center gap-5">
              {/* SHUFFLE */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition hover:scale-110 ${
                  isShuffle ? "text-[#e904f9]" : "text-neutral-300"
                }`}
              >
                <Shuffle className="h-4.5 w-4.5" />
              </button>

              {/* PREVIOUS */}
              <button className="text-white  transition hover:scale-110">
                <SkipBack className="h-4 w-4 fill-white" />
              </button>

              {/* PLAY / PAUSE */}
              <button
                onClick={togglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90 "
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-black" />
                ) : (
                  <Play className="ml-1 h-5 w-5 fill-black" />
                )}
              </button>

              {/* NEXT */}
              <button className="text-white transition hover:scale-110">
                <SkipForward className="h-4 w-4 fill-white" />
              </button>

              {/* REPEAT */}
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`transition hover:scale-110 ${
                  isRepeat ? "text-[#e904f9]" : "text-neutral-300"
                }`}
              >
                <Repeat2 className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* TIMELINE */}
            <div className="flex w-full items-center gap-3">
              <span className="w-10 text-right text-xs text-neutral-400">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleSeek}
                className="custom-slider h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20"
              />

              <span className="w-10 text-xs text-neutral-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* ========================= */}
          {/* RIGHT */}
          {/* ========================= */}
          <div className="flex items-center justify-end gap-3 md:w-[28%]">
            {/* QUEUE */}
            <button className="hidden text-neutral-300 transition hover:text-white md:block">
              <ListMusic className="h-5 w-5" />
            </button>

            {/* VOLUME */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="hidden text-neutral-300 transition hover:text-white md:block"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>

            {/* VOLUME BAR */}
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="custom-slider hidden h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/20 md:block"
            />

            {/* MINI PLAYER */}
            <button
              onClick={() => setIsMiniPlayer(!isMiniPlayer)}
              className="text-neutral-300 transition hover:text-white"
            >
              {isMiniPlayer ? (
                <Maximize2 className="h-5 w-5" />
              ) : (
                <Minimize2 className="h-5 w-5" />
              )}
            </button>

            {/* FULL MODE */}
            <button className="text-neutral-300 transition hover:text-white">
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
