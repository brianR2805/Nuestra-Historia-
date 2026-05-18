"use client";

import { useState, useEffect, useRef } from "react";

type WheelType = "day" | "month" | "year";

type WheelProps = {
  value: string;
  type: WheelType;
  label: string;
};

export default function RomanticWebsite() {
  const [modoEdicion, setModoEdicion] = useState(false);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [lockDay, setLockDay] = useState(15);
  const [lockMonth, setLockMonth] = useState(1);
  const [lockYear, setLockYear] = useState(2025);

  const [step, setStep] = useState(0);

  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const [canSeeChapter1, setCanSeeChapter1] = useState(false);
  const [canSeeChapter2, setCanSeeChapter2] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const picnicDate = new Date(2026, 3, 18);
  const chapter1Date = new Date(2026, 4, 18);
  const chapter2Date = new Date(2026, 5, 18);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") setModoEdicion(true);
  }, []);

  useEffect(() => {
    const now = new Date();
    if (now >= chapter1Date) setCanSeeChapter1(true);
    if (now >= chapter2Date) setCanSeeChapter2(true);
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - picnicDate.getTime();

      setTimeTogether({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isUnlocked]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});

    setIsPlaying(!isPlaying);
  };

  const spinWheel = (type: WheelType, direction: number) => {
    if (type === "day") {
      setLockDay((p) =>
        p + direction > 31 ? 1 : p + direction < 1 ? 31 : p + direction
      );
    }

    if (type === "month") {
      setLockMonth((p) =>
        p + direction > 12 ? 1 : p + direction < 1 ? 12 : p + direction
      );
    }

    if (type === "year") {
      setLockYear((p) =>
        p + direction > 2030 ? 2020 : p + direction < 2020 ? 2030 : p + direction
      );
    }
  };

  const handleUnlock = () => {
    if (lockDay === 18 && lockMonth === 4 && lockYear === 2026) {
      setIsUnlocked(true);
    } else {
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 800);
    }
  };

  const Wheel = ({ value, type, label }: WheelProps) => (
    <div className="flex flex-col items-center">
      <button onClick={() => spinWheel(type, 1)}>▲</button>

      <div className="bg-[#1a0d35] border border-[#c084fc] w-20 h-20 flex items-center justify-center rounded-xl">
        <span className="text-[#deff9a] text-2xl font-bold">{value}</span>
      </div>

      <button onClick={() => spinWheel(type, -1)}>▼</button>

      <span className="text-[#c084fc] text-xs mt-1">{label}</span>
    </div>
  );

  // 🔒 BLOQUEO POR FECHA
  if (!canSeeChapter1 && !modoEdicion) {
    return (
      <div className="min-h-screen bg-[#0f0720] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl">Aún no es el momento...</h1>
        </div>
      </div>
    );
  }

  // 🔐 CANDADO
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0f0720] flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl mb-6">La Llave de Nosotros</h1>

        <div className="flex gap-4 mb-6">
          <Wheel value={String(lockDay)} type="day" label="Día" />
          <Wheel value={String(lockMonth)} type="month" label="Mes" />
          <Wheel value={String(lockYear)} type="year" label="Año" />
        </div>

        <button onClick={handleUnlock} className="border px-6 py-2 rounded">
          Abrir
        </button>

        {errorMsg && <p className="text-red-400 mt-2">Error</p>}
      </div>
    );
  }

  // 💖 CONTENIDO
  return (
    <div className="min-h-screen bg-[#0f0720] text-white p-6">
      <audio ref={audioRef} src="/musica.mp3" loop />

      <button onClick={toggleMusic}>
        {isPlaying ? "🔊" : "🔇"}
      </button>

      <h1 className="text-4xl mt-6">Tu historia 💜</h1>

      <p>Días juntos: {timeTogether.days}</p>

      <div className="mt-6">
        {step === 0 && <p>Inicio</p>}
        {step === 1 && <p>Historia</p>}
        {step === 2 && <p>Recuerdos</p>}
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Anterior
        </button>

        <button onClick={() => setStep((s) => s + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}