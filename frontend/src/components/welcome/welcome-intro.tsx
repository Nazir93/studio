"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import { Howl } from "howler";
import { CarpetOrnamentVertical, CarpetBorderHorizontal } from "./carpet-ornament";
import { FONT_UI_MONO_NAV } from "@/lib/ui-typography";

const MUSIC_SRC = "/Ramin Djawadi - Mother Of Dragons OST Game of Thrones (S.02)_(mp3seven.net).mp3";

export function WelcomeIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);
  const [entered, setEntered] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { scrollY } = useScroll();
  const introOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const introY = useTransform(scrollY, [0, 400], [0, -120]);
  const introScale = useTransform(scrollY, [0, 400], [1, 0.92]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => {
      if (v > 350 && !dismissed) {
        setDismissed(true);
        if (soundRef.current?.playing()) {
          soundRef.current.fade(soundRef.current.volume(), 0, 2000);
        }
      }
    });
    return () => unsubscribe();
  }, [scrollY, dismissed]);

  const initSound = useCallback(() => {
    if (soundRef.current) return soundRef.current;
    const sound = new Howl({
      src: [MUSIC_SRC],
      loop: true,
      volume: 0,
      html5: true,
    });
    soundRef.current = sound;
    return sound;
  }, []);

  const handleEnter = useCallback(() => {
    setEntered(true);
    setTimeout(() => setShowContent(true), 400);
    const sound = initSound();
    sound.play();
    sound.fade(0, 0.35, 3000);
    setMusicPlaying(true);
  }, [initSound]);

  const toggleMusic = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;
    if (musicPlaying) {
      sound.fade(sound.volume(), 0, 500);
      setTimeout(() => sound.pause(), 500);
      setMusicPlaying(false);
    } else {
      sound.play();
      sound.fade(0, 0.35, 500);
      setMusicPlaying(true);
    }
  }, [musicPlaying]);

  useEffect(() => {
    return () => { soundRef.current?.unload(); };
  }, []);

  const navItems = [
    { label: "Услуги", href: "/services" },
    { label: "Портфолио", href: "/portfolio" },
    { label: "Контакты", href: "/contacts" },
  ];

  return (
    <motion.div
      ref={containerRef}
      style={{
        opacity: dismissed ? 0 : introOpacity,
        y: introY,
        scale: introScale,
        pointerEvents: dismissed ? "none" : "auto",
      }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0A0A0A]"
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent calc(100vw / 24), rgba(255,255,255,0.15) calc(100vw / 24), rgba(255,255,255,0.15) calc(100vw / 24 + 1px))",
        }}
      />

      {/* Carpet texture — subtle, only in center band */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(250,204,21,0.08) 2px, rgba(250,204,21,0.08) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(250,204,21,0.05) 2px, rgba(250,204,21,0.05) 4px)
          `,
        }}
      />

      {/* Carpet ornaments — always visible */}
      <div className="absolute top-0 left-0 right-0 z-[5] h-6 sm:h-7 md:h-8 pointer-events-none">
        <CarpetBorderHorizontal className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-[5] h-6 sm:h-7 md:h-8 pointer-events-none rotate-180">
        <CarpetBorderHorizontal className="w-full h-full" />
      </div>
      <div className="absolute left-0 top-0 bottom-0 z-[5] w-8 sm:w-10 md:w-14 lg:w-16 pointer-events-none">
        <CarpetOrnamentVertical side="left" className="w-full h-full" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 z-[5] w-8 sm:w-10 md:w-14 lg:w-16 pointer-events-none">
        <CarpetOrnamentVertical side="right" className="w-full h-full" />
      </div>

      {/* ========== GATE — click to enter ========== */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
            onClick={handleEnter}
          >
            {/* Frame: top */}
            <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-12 sm:px-16 md:px-20 lg:px-24 pt-10 sm:pt-12 md:pt-14">
              <div>
                <p className={`${FONT_UI_MONO_NAV} tracking-[0.35em] text-white/40`}>Студия разработки</p>
                <h1 className="font-heading text-[clamp(1.5rem,5.5vw,3.25rem)] leading-[0.95] tracking-tight text-white mt-0.5">CODE</h1>
              </div>
              <div className="text-center">
                <nav className={`flex gap-4 sm:gap-6 ${FONT_UI_MONO_NAV} tracking-[0.25em] text-white/30`}>
                  {navItems.map((item) => (
                    <span key={item.label}>{item.label}</span>
                  ))}
                </nav>
              </div>
              <div className="text-right">
                <p className={`${FONT_UI_MONO_NAV} tracking-[0.2em] text-white/30`}>Написать</p>
                <h1 className="font-heading text-[clamp(1.5rem,5.5vw,3.25rem)] leading-[0.95] tracking-tight text-white mt-0.5">1.618</h1>
              </div>
            </div>

            {/* Center: logo + tap hint */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
              <Image
                src="/logo.png"
                alt="CODE 1.618"
                fill
                className="object-contain invert brightness-100"
                priority
              />
            </div>
            <p className="mt-6 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-[#FACC15]/70">
              Нажмите чтобы войти
            </p>

            {/* Frame: bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-12 sm:px-16 md:px-20 lg:px-24 pb-10 sm:pb-12 md:pb-14">
              <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/30 max-w-[140px] sm:max-w-none">
                Веб · Лендинги · ИИ
              </p>
              <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/25">
                Листайте вниз
              </p>
              <p className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-white/20 text-right max-w-[100px] sm:max-w-none">
                Студия
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== MAIN — after enter (same frame layout) ========== */}
      <AnimatePresence>
        {showContent && (
          <>
            {/* Top frame */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between px-12 sm:px-16 md:px-20 lg:px-24 pt-10 sm:pt-12 md:pt-14"
            >
              <div>
                <p className={`${FONT_UI_MONO_NAV} tracking-[0.35em] text-[#FACC15]/60`}>Студия разработки</p>
                <h1 className="font-heading text-[clamp(1.5rem,5.5vw,3.25rem)] leading-[0.95] tracking-tight text-white mt-0.5">CODE</h1>
              </div>
              <nav className={`flex gap-4 sm:gap-6 md:gap-8 ${FONT_UI_MONO_NAV} tracking-[0.25em]`}>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white/40 hover:text-[#FACC15] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="text-right">
                <Link href="/contacts" className={`${FONT_UI_MONO_NAV} tracking-[0.2em] text-white/30 hover:text-[#FACC15] transition-colors block`}>
                  Написать
                </Link>
                <h1 className="font-heading text-[clamp(1.5rem,5.5vw,3.25rem)] leading-[0.95] tracking-tight text-white mt-0.5">1.618</h1>
              </div>
            </motion.div>

            {/* Center: logo (white) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52">
                <Image
                  src="/logo.png"
                  alt="CODE 1.618"
                  fill
                  className="object-contain invert brightness-100"
                />
              </div>
            </motion.div>

            {/* Bottom frame */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between px-12 sm:px-16 md:px-20 lg:px-24 pb-10 sm:pb-12 md:pb-14"
            >
              <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/30 max-w-[140px] sm:max-w-none">
                Веб · Лендинги · Корпоративные порталы · ИИ
              </p>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#FACC15]/60">
                  Листайте вниз
                </span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown size={14} className="text-[#FACC15]/40" />
                </motion.div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-white/20 text-right max-w-[80px] sm:max-w-none">
                  CODE 1.618
                </span>
                <button
                  onClick={toggleMusic}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-[#FACC15]/30 transition-colors"
                  aria-label={musicPlaying ? "Выключить музыку" : "Включить музыку"}
                >
                  {musicPlaying ? (
                    <Volume2 size={12} className="text-[#FACC15]/70" />
                  ) : (
                    <VolumeX size={12} className="text-white/30" />
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
