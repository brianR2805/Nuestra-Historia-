"use client";

import { useState, useEffect, useRef } from "react";

// ============================================================================
// 🔒 ZONA CONFIGURACIONES Y COMPONENTES BASE
// ============================================================================
const picnicDate = new Date(2026, 3, 18, 0, 0, 0); 
const chapter1Date = new Date(2026, 4, 18, 12, 0, 0); 
const chapter2Date = new Date(2026, 5, 18, 12, 0, 0); // 🗓️ Meta exacta: 18 de Junio de 2026

const Wheel = ({ value, type, label, spinWheel }: { value: string, type: 'day' | 'month' | 'year', label: string, spinWheel: (type: 'day' | 'month' | 'year', direction: number) => void }) => (
  <div className="flex flex-col items-center">
    <button onClick={() => spinWheel(type, 1)} className="text-[#a855f7] hover:text-[#d8b4fe] text-3xl mb-2 transition-all hover:-translate-y-1">▲</button>
    <div className="bg-white border border-[#a855f7]/30 w-20 md:w-24 h-24 flex items-center justify-center rounded-xl relative shadow-sm">
      <span className="text-4xl md:text-5xl font-mono font-bold text-[#3f2a2a] z-10">{value}</span>
    </div>
    <button onClick={() => spinWheel(type, -1)} className="text-[#a855f7] hover:text-[#d8b4fe] text-3xl mt-2 transition-all hover:translate-y-1">▼</button>
    <span className="text-[#886a6a] text-[12px] font-bold tracking-widest mt-2">{label}</span>
  </div>
);

const PantallaEspera = ({ particles, treeHearts, waitTimer, esHoy }: any) => (
  <div className="min-h-screen bg-[#f8f5f3] flex items-center justify-center p-4 md:p-8 relative font-serif select-none overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.03)_0%,_transparent_75%)] z-0" />
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p: any) => (
        <span key={p.id} className="absolute animate-falling-hearts inline-block" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration, color: p.color, fontSize: p.size, opacity: p.opacity }}>♥</span>
      ))}
    </div>
    <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[#a855f7]/10 relative p-8 md:p-14 flex flex-col z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-left space-y-6 md:pt-6">
          <h1 className="text-[#3f2a2a] text-3xl md:text-4xl font-medium tracking-wide">Para el amor de mi vida:</h1>
          <p className="text-[#3f2a2a] text-xl md:text-2xl italic leading-relaxed">Las mejores historias requieren paciencia y la nuestra vale la pena la espera.</p>
          <p className="text-[#9333ea] text-xl md:text-2xl font-bold tracking-wide pt-2">{esHoy ? "¡Vuelve hoy a las 12:00 PM para descubrirlo!" : "¡Vuelve mañana, 18 de Mayo, para descubrirlo!"}</p>
        </div>
        <div className="w-72 h-72 md:w-[26rem] md:h-[26rem] relative flex items-center justify-center flex-shrink-0 animate-gentle-sway">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <circle cx="100" cy="80" r="75" fill="#f3e8ff" opacity="0.8" filter="blur(15px)" />
            <path d="M92 185 L96 90 L104 90 L108 185 Z" fill="#6b4226" />
            <path d="M100 115 L70 85" stroke="#6b4226" strokeWidth="5" strokeLinecap="round" />
            <path d="M100 100 L135 65" stroke="#6b4226" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M115 80 L145 95" stroke="#6b4226" strokeWidth="3" strokeLinecap="round" />
            <g className="select-none">
              {treeHearts.map((heart: any) => (
                <text key={heart.id} x={heart.x} y={heart.y} fill={heart.color} className="opacity-95" style={{ transformOrigin: `${heart.x}px ${heart.y}px`, transform: `scale(${heart.scale})` }}>♥</text>
              ))}
            </g>
          </svg>
        </div>
      </div>
      <hr className="border-[#ebe1e1] my-8 md:my-10" />
      <div className="w-full">
        <h3 className="text-[#594646] text-lg font-sans mb-4">El candado se revelará en:</h3>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 font-sans">
          {waitTimer.days > 0 && (
            <div className="flex items-baseline gap-1"><span className="font-bold text-4xl md:text-5xl text-black tracking-tight">{waitTimer.days.toString().padStart(2, '0')}</span><span className="text-[#594646] text-sm md:text-base mr-2">días</span></div>
          )}
          <div className="flex items-baseline gap-1"><span className="font-bold text-4xl md:text-5xl text-black tracking-tight">{waitTimer.hours.toString().padStart(2, '0')}</span><span className="text-[#594646] text-sm md:text-base mr-2">horas</span></div>
          <div className="flex items-baseline gap-1"><span className="font-bold text-4xl md:text-5xl text-black tracking-tight">{waitTimer.minutes.toString().padStart(2, '0')}</span><span className="text-[#594646] text-sm md:text-base mr-2">minutos</span></div>
          <div className="flex items-baseline gap-1"><span className="font-bold text-4xl md:text-5xl text-[#7e22ce] tracking-tight animate-pulse">{waitTimer.seconds.toString().padStart(2, '0')}</span><span className="text-[#594646] text-sm md:text-base">segundos</span></div>
        </div>
        <p className="text-[#886a6a] text-sm md:text-base mt-4 font-sans italic">{esHoy ? "Hoy a las 12:00 PM" : "Mañana a las 12:00 PM"}</p>
      </div>
    </div>
    <style dangerouslySetInnerHTML={{__html: `@keyframes falling-hearts { 0% { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.8; } 100% { transform: translateY(110vh) rotate(60deg) scale(1.1); opacity: 0; } } @keyframes gentle-sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(0.6deg); } } .animate-falling-hearts { animation: falling-hearts linear infinite; } .animate-gentle-sway { animation: gentle-sway 6s ease-in-out infinite; }`}} />
  </div>
);

const PantallaCandado = ({ lockDay, lockMonth, lockYear, spinWheel, handleUnlock, shake, errorText, esEditor }: any) => (
  <div className="min-h-screen bg-[#f8f5f3] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.05)_0%,_transparent_70%)] z-0" />
    {esEditor && (
      <div className="absolute top-4 left-4 bg-[#7e22ce] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md tracking-wider animate-pulse z-50">
        🛠️ MODO EDITOR ACTIVO (CUALQUIER FECHA ABRE)
      </div>
    )}
    <div className="z-10 bg-white border border-[#a855f7]/20 p-8 md:p-12 rounded-[2rem] shadow-xl text-center max-w-2xl w-full animate-pop-in">
      <h1 className="text-4xl md:text-5xl font-serif text-[#3f2a2a] mb-4">La Llave de <span className="text-[#a855f7]">Nosotros</span></h1>
      <p className="text-[#594646] mb-4 text-lg">Este diario contiene los momentos que han definido nuestro camino. Pero como todo gran tesoro, requiere de una llave especial.</p>
      <p className="text-[#9333ea] italic mb-10 font-serif text-lg">Pista: Mira nuestra manilla compartida. ⛓️💜</p>
      <div className={`flex justify-center items-center gap-4 mb-4 ${shake ? 'animate-shake' : ''}`}>
        <Wheel value={lockDay.toString().padStart(2, '0')} type="day" label="DÍA" spinWheel={spinWheel} />
        <span className="text-3xl text-[#a855f7] font-black mb-8">:</span>
        <Wheel value={lockMonth.toString().padStart(2, '0')} type="month" label="MES" spinWheel={spinWheel} />
        <span className="text-3xl text-[#a855f7] font-black mb-8">:</span>
        <Wheel value={lockYear.toString()} type="year" label="AÑO" spinWheel={spinWheel} />
      </div>
      <div className="h-8 mb-6 flex items-center justify-center">{errorText && <p className="text-red-500 font-bold animate-pulse text-sm md:text-base">{errorText}</p>}</div>
      <button onClick={handleUnlock} className="w-full bg-[#f3e8ff] border-2 border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-white font-bold py-4 rounded-full text-xl uppercase tracking-widest transition-all">Abrir Diario 🔓</button>
    </div>
    <style dangerouslySetInnerHTML={{__html: `@keyframes pop-in { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } } .animate-pop-in { animation: pop-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; } .animate-shake { animation: shake 0.4s ease-in-out; }`}} />
  </div>
);

// ============================================================================
// 🟢 APLICACIÓN PRINCIPAL
// ============================================================================
export default function RomanticWebsite() {
  const [esEditor, setEsEditor] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [lockDay, setLockDay] = useState(15);
  const [lockMonth, setLockMonth] = useState(1);
  const [lockYear, setLockYear] = useState(2025);
  const [step, setStep] = useState(0);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [waitTimer, setWaitTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [waitTimerCh2, setWaitTimerCh2] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [esHoy, setEsHoy] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; duration: string; color: string; size: string; opacity: number }[]>([]);
  const [treeHearts, setTreeHearts] = useState<{ id: number; x: number; y: number; color: string; scale: number }[]>([]);
  
  const [canSeeChapter1, setCanSeeChapter1] = useState(false);
  const [aceptaContinuar, setAceptaContinuar] = useState(false); 
  const [intentoNo, setIntentoNo] = useState(false); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mensajeActual, setMensajeActual] = useState<{ texto: string; emoji: string } | null>(null);

  const mensajesSorpresa = [
    { texto: 'Estoy infinitamente orgulloso de ti, mi niña hermosa. Eres capaz de todo. 💜', emoji: '🥺' },
    { texto: 'Cierra los ojos por un segundo, respira profundo... imagina que te estoy dando un abrazo eterno. 🫂', emoji: '✨' },
    { texto: 'Eres lo más bonito que ha llegado a mi vida, nunca lo vayas a olvidar. 🌷', emoji: '💖' },
    { texto: 'Regálame una sonrisa justo ahora, que me encanta verte feliz. 🥰', emoji: '😊' },
    { texto: 'Todo va a estar bien, mi amor. Aquí estoy siempre para ti. 🤝💜', emoji: '🌟' }
  ];

  const sacarMensajeRandom = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * mensajesSorpresa.length);
    } while (mensajeActual && mensajesSorpresa[randomIndex].texto === mensajeActual.texto && mensajesSorpresa.length > 1);
    setMensajeActual(mensajesSorpresa[randomIndex]);
  };

  // Detectar Modo Editor mediante URL secreta (?modo=editor)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("modo") === "editor") {
        setEsEditor(true);
        setCanSeeChapter1(true); // Permitir saltar la primera pantalla de carga
      }
    }
  }, []);

  useEffect(() => {
    const purpleVioletShades = ['#6d28d9', '#7e22ce', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#7c3aed', '#9333ea'];
    const generatedParticles = Array.from({ length: 450 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}%`, top: `${-20 + Math.random() * 40}vh`, delay: `${Math.random() * 15}s`, duration: `${Math.random() * 10 + 7}s`, color: purpleVioletShades[Math.floor(Math.random() * purpleVioletShades.length)], size: `${Math.random() * 15 + 8}px`, opacity: Math.random() * 0.7 + 0.3
    }));
    setParticles(generatedParticles);
    
    const heartsArray: { id: number; x: number; y: number; color: string; scale: number }[] = [];
    let count = 0;
    for (let i = 0; i < 400; i++) {
      const t = Math.random() * Math.PI * 2; const d = Math.sqrt(Math.random()); const scale = 3.5;
      const hx = 16 * Math.pow(Math.sin(t), 3); const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const x = 100 + d * scale * hx + (Math.random() - 0.5) * 4; const y = 65 - d * scale * hy + (Math.random() - 0.5) * 4; 
      heartsArray.push({ id: count++, x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)), color: purpleVioletShades[Math.floor(Math.random() * purpleVioletShades.length)], scale: Math.random() * 0.6 + 0.8 });
    }
    setTreeHearts(heartsArray);
    
    let randomDay = Math.floor(Math.random() * 31) + 1;
    let randomMonth = Math.floor(Math.random() * 12) + 1;
    let randomYear = Math.floor(Math.random() * 11) + 2020;
    if (randomDay === 18 && randomMonth === 4 && randomYear === 2026) { randomDay = 15; randomMonth = 1; randomYear = 2025; }
    setLockDay(randomDay); setLockMonth(randomMonth); setLockYear(randomYear);
  }, []);

  useEffect(() => {
    const checkVisibilityAndDates = () => {
      const now = new Date();
      if (now.getTime() >= chapter1Date.getTime() || esEditor) { setCanSeeChapter1(true); }
      if (now.getDate() === chapter1Date.getDate() && now.getMonth() === chapter1Date.getMonth() && now.getFullYear() === chapter1Date.getFullYear()) { setEsHoy(true); }
      
      const difference = chapter1Date.getTime() - now.getTime();
      if (difference > 0 && !esEditor) {
        setWaitTimer({ days: Math.floor(difference / (1000 * 60 * 60 * 24)), hours: Math.floor((difference / (1000 * 60 * 60)) % 24), minutes: Math.floor((difference / 1000 / 60) % 60), seconds: Math.floor((difference / 1000) % 60) });
      }

      // Cronómetro en vivo hacia el Mes 2 (18 de Junio de 2026)
      const diffCh2 = chapter2Date.getTime() - now.getTime();
      if (diffCh2 > 0 && !esEditor) {
        setWaitTimerCh2({
          days: Math.floor(diffCh2 / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffCh2 / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diffCh2 / 1000 / 60) % 60),
          seconds: Math.floor((diffCh2 / 1000) % 60)
        });
      } else {
        // En Modo Editor o si ya pasó, se queda en 0
        setWaitTimerCh2({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    checkVisibilityAndDates();
    const waitInterval = setInterval(checkVisibilityAndDates, 1000);
    return () => clearInterval(waitInterval);
  }, [esEditor]);

  useEffect(() => {
    if (!isUnlocked) return;
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - picnicDate.getTime();
      setTimeTogether({ days: Math.floor(difference / (1000 * 60 * 60 * 24)), hours: Math.floor((difference / (1000 * 60 * 60)) % 24), minutes: Math.floor((difference / 1000 / 60) % 60), seconds: Math.floor((difference / 1000) % 60) });
    }, 1000);
    return () => clearInterval(timer);
  }, [isUnlocked]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch((e: unknown) => console.log("Audio bloqueado", e));
      setIsPlaying(!isPlaying);
    }
  };

  const spinWheel = (type: 'day' | 'month' | 'year', direction: number) => {
    if (type === 'day') setLockDay(prev => prev + direction > 31 ? 1 : prev + direction < 1 ? 31 : prev + direction);
    else if (type === 'month') setLockMonth(prev => prev + direction > 12 ? 1 : prev + direction < 1 ? 12 : prev + direction);
    else if (type === 'year') setLockYear(prev => prev + direction > 2030 ? 2020 : prev + direction < 2020 ? 2030 : prev + direction);
  };

  const handleUnlock = () => {
    // Si estás en modo editor, cualquier combinación abre el candado
    if (esEditor || (lockDay === 18 && lockMonth === 4 && lockYear === 2026)) { 
      setIsUnlocked(true); 
    } else {
      setShake(true); setErrorText("Esa no es la fecha, mi amor. Recuerda el día de nuestro picnic 🧺💜");
      setTimeout(() => setShake(false), 800); setTimeout(() => setErrorText(""), 4000);
    }
  };

  if (!canSeeChapter1) { return <PantallaEspera particles={particles} treeHearts={treeHearts} waitTimer={waitTimer} esHoy={esHoy} />; }
  if (!isUnlocked) { return <PantallaCandado lockDay={lockDay} lockMonth={lockMonth} lockYear={lockYear} spinWheel={spinWheel} handleUnlock={handleUnlock} shake={shake} errorText={errorText} esEditor={esEditor} />; }

  const slidesContent = [
    // --- DIAPOSITIVA 1: BIENVENIDA ---
    <div key="s1" className="flex flex-col items-center text-center animate-slide-in w-full max-w-3xl">
      <div className="relative mb-8"><div className="text-8xl animate-bounce-slow">💜</div><div className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</div><div className="absolute -bottom-2 -left-2 text-4xl animate-pulse delay-700">✨</div></div>
      <div className="inline-block px-6 py-2 rounded-full bg-[#f3e8ff] border-2 border-[#a855f7]/30 text-[#7e22ce] text-xs font-black tracking-[0.3em] uppercase mb-8 shadow-sm">🎈 ¡Feliz Primer Mes! 🎈</div>
      <h1 className="text-6xl md:text-8xl font-serif text-[#3f2a2a] mb-6 leading-tight">¡Hola, <span className="text-[#9333ea] drop-shadow-sm">Princesa!</span></h1>
      <p className="text-[#594646] text-2xl md:text-3xl mb-8 leading-relaxed">Qué alegría tenerte. He creado este recuerdo para nosotros.</p>
      <div className="flex gap-4 items-center justify-center"><span className="text-[#a855f7] text-xl italic font-serif">Nuestra historia comienza ahora...</span><div className="w-12 h-[2px] bg-[#a855f7]/30"></div><span className="text-2xl">📖</span></div>
    </div>,

    // --- DIAPOSITIVA 2: EL VIDEO ---
    <div key="s1_video" className="flex flex-col items-center animate-slide-in w-full max-w-4xl">
      <h2 className="text-4xl md:text-5xl font-serif text-[#a855f7] mb-2 text-center">Nuestra magia en <span className="text-[#3f2a2a]">movimiento</span></h2>
      <p className="text-[#594646] mb-8 text-center text-lg max-w-xl">Porque nuestros mejores instantes, risas y miradas merecen verse una y otra vez. 🎬💜</p>
      <div className="w-full max-w-2xl bg-white p-4 rounded-[2.5rem] border-2 border-[#a855f7]/20 shadow-xl overflow-hidden bg-gradient-to-b from-white to-[#f3e8ff]/30"><video src="/nuestro-video.mp4" controls autoPlay loop playsInline className="w-full h-auto rounded-[1.8rem] shadow-md max-h-[65vh] object-cover mx-auto" /></div>
    </div>,

    // --- DIAPOSITIVA 3: REENCUENTRO ---
    <div key="s2" className="flex flex-col items-center gap-8 animate-slide-in w-full max-w-5xl">
      <div className="text-center max-w-3xl"><h2 className="text-4xl md:text-5xl font-serif text-[#a855f7] mb-2">Donde todo empieza</h2><h3 className="text-2xl text-[#3f2a2a] mb-6 font-bold">6 de Enero, 2025</h3><p className="text-[#594646] text-lg mb-4 leading-relaxed">Ese día parecía normal, como cualquier otro, pero terminó convirtiéndose en el comienzo de algo que nunca imagine.</p><p className="text-[#594646] text-lg leading-relaxed">Sin darme cuenta, comenzaste a convertirte en esa persona con la que quería hablar todos los días. Ese inicio tan sencillo terminó siendo el comienzo de algo muy bonito entre nosotros.💜</p></div>
      <div className="flex flex-col items-center w-full max-w-4xl relative"><div className="grid grid-cols-2 gap-4 md:gap-8 w-full z-10 mb-4"><img src="WhatsApp Image 2026-05-18 at 02.21.04 (3).jpeg" className="rounded-[1.5rem] border-[8px] border-white shadow-xl -rotate-2 hover:rotate-0 transition-all duration-500 w-full aspect-[3/4] object-cover" alt="Recuerdo 1"/><img src="/foto-reencuentro-2.jpeg" className="rounded-[1.5rem] border-[8px] border-white shadow-xl rotate-2 hover:rotate-0 transition-all duration-500 w-full aspect-[3/4] object-cover" alt="Recuerdo 2"/></div><div className="bg-[#fffbeb] p-4 md:p-6 rounded-xl shadow-xl border-t-4 border-l-2 border-[#a855f7] -mt-12 md:-mt-16 z-20 rotate-[-1deg] hover:rotate-0 transition-all mx-4 md:mx-auto max-w-2xl relative"><div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-4 bg-[#a855f7]/20 backdrop-blur-md rounded-sm" /><p className="text-[#3f2a2a] text-lg md:text-xl font-serif italic text-center leading-relaxed">"Estos son los únicos recuerdos que tengo de ese día."</p></div></div>
    </div>,

    // --- DIAPOSITIVA 4: BESO ---
    <div key="s3" className="flex flex-col md:flex-row-reverse items-center gap-10 animate-slide-in w-full max-w-5xl"><div className="flex-1"><h2 className="text-4xl font-serif text-[#a855f7] mb-2">El primer beso</h2><h3 className="text-2xl text-[#3f2a2a] mb-6 font-bold">28 de Diciembre, 2025</h3><p className="text-[#594646] text-lg mb-4">Nunca se me va a olvidar nuestro primer beso. Veníamos de La Jagua en el carro, hablando y riéndonos como siempre, pero se sentía diferente. Había esos nervios bonitos y esas miradas que dicen más que cualquier cosa.</p><p className="text-[#594646] text-lg mb-6">Y de un momento a otro pasó. Fue algo sencillo, pero para mí significó demasiado. Desde ese día cada vez que recuerdo ese viaje, lo primero que se me viene a la cabeza es ese momento contigo.</p><blockquote className="border-l-4 border-[#a855f7] pl-4 italic text-[#886a6a]">"Hay viajes que no se miden en kilómetros, sino en momentos."</blockquote></div><div className="flex-1"><img src="primer-beso.jpeg" alt="Beso carro" className="rounded-2xl border-4 border-white shadow-xl w-full" /></div></div>,

    // --- DIAPOSITIVA 5: PICNIC ---
    <div key="s4" className="flex flex-col items-center text-center animate-slide-in w-full max-w-4xl"><h2 className="text-5xl font-serif text-[#a855f7] mb-2">Nuestra Fecha</h2><h3 className="text-3xl text-[#3f2a2a] mb-8 font-bold">18 de Abril, 2026</h3><img src="dia-novios.jpeg" alt="Picnic Cali" className="w-full h-64 object-cover rounded-2xl border-4 border-white mb-8 shadow-xl" /><p className="text-[#594646] text-lg mb-4">Cuando ya empezamos a ser pareja, siento que todo cambió de una manera muy bonita. Ya no eras solo alguien importante para mí, te volviste esa persona con la que quería compartir todo, hasta las cosas más simples del día.</p><p className="text-[#594646] text-lg">Me gusta saber de ti apenas me levanto, contarte cualquier cosa y sentir que siempre estás ahí. Y aunque a veces las cosas se compliquen, solo sé que quiero seguir compartiendo esta vida contigo.</p></div>,

    // --- DIAPOSITIVA 6: CONTADOR ---
    <div key="s5" className="flex flex-col md:flex-row items-center gap-12 animate-slide-in w-full max-w-5xl"><div className="flex-1 text-center"><div className="text-8xl md:text-9xl font-black text-[#a855f7] leading-none mb-2 drop-shadow-sm">{timeTogether.days}</div><div className="text-2xl text-[#3f2a2a] tracking-widest uppercase font-bold mb-4">Días de Felicidad</div><p className="text-[#c084fc] text-sm">Y {timeTogether.hours} horas con {timeTogether.minutes} minutos.</p></div><div className="flex-grow flex-1 bg-white p-8 md:p-10 rounded-[2rem] border border-[#a855f7]/10 shadow-xl relative overflow-hidden group hover:border-[#a855f7]/30 transition-all"><div className="absolute -right-6 -bottom-6 text-8xl opacity-5 group-hover:scale-110 transition-transform duration-500">💌</div><h2 className="text-3xl font-serif text-[#3f2a2a] mb-6">Mis Promesas</h2><ul className="space-y-4 text-[#594646] text-lg font-medium"><li className="flex items-start gap-3"><span className="text-[#a855f7] text-xl mt-0.5">✨</span><span>Hacerte reír hasta en tus días más grises.</span></li><li className="flex items-start gap-3"><span className="text-[#a855f7] text-xl mt-0.5">🚗</span><span>Cantar juntos a todo pulmón en el carro.</span></li><li className="flex items-start gap-3"><span className="text-[#a855f7] text-xl mt-0.5">🌟</span><span>Escucharte siempre que necesites hablar.</span></li><li className="flex items-start gap-3"><span className="text-[#a855f7] text-xl mt-0.5">💜</span><span>Elegirte todos y cada uno de mis días.</span></li></ul></div></div>,

    // --- DIAPOSITIVA 7: RAZONES ---
    <div key="s6" className="flex flex-col items-center animate-slide-in w-full max-w-5xl"><h2 className="text-4xl font-serif text-[#3f2a2a] mb-10">Por qué tú</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">{[{ icon: '🤍', title: 'Tu forma de ser', text: 'Te elegí a ti por la manera tan bonita en la que haces sentir a las personas que amas.' },{ icon: '✨', title: 'Mi lugar favorito', text: 'Te elegí a ti porque contigo todo se siente especial, incluso los días simples.' },{ icon: '🚀', title: 'Lo que quiero para mi vida', text: 'Y porque, sin importar lo que pase, quiero que seas tu con la que comparta el resto de mi vida.' }].map((item, i) => (<div key={i} className="bg-white p-8 rounded-2xl text-center border border-[#a855f7]/10 shadow-lg hover:border-[#a855f7]/40 transition-colors"><div className="text-5xl mb-4">{item.icon}</div><h3 className="text-2xl text-[#3f2a2a] mb-4 font-bold">{item.title}</h3><p className="text-[#594646]">{item.text}</p></div>))}</div></div>,

    // --- DIAPOSITIVA 8: CITA ---
    <div key="s7" className="flex flex-col items-center justify-center text-center animate-slide-in w-full max-w-3xl h-full"><div className="text-7xl text-[#a855f7] opacity-20 mb-4">"</div><p className="font-serif text-3xl md:text-5xl italic text-[#3f2a2a] leading-snug mb-8">De todas las casualidades de mi vida, tú siempre vas a ser mi favorita.</p><cite className="text-2xl text-[#9333ea] block font-bold">— Mi persona favorita</cite></div>,

    // --- DIAPOSITIVA 8.5: BUZÓN ---
    <div key="s_extrañar" className="flex flex-col items-center justify-center text-center animate-slide-in w-full max-w-4xl h-full relative px-4"><div className="absolute top-0 left-4 text-4xl opacity-20 animate-pulse delay-100 hidden md:block">✨</div><div className="absolute bottom-12 right-4 text-4xl opacity-20 animate-pulse delay-500 hidden md:block">💜</div><h2 className="text-4xl md:text-5xl font-serif text-[#a855f7] mb-4">Abrir cuando me extrañes</h2><p className="text-[#594646] text-lg mb-8 max-w-xl leading-relaxed">Si algún día te sientes triste, tuviste un día pesado, o simplemente me extrañas un poquito de más... toca el buzón mágico de nosotros. 💌</p><button onClick={sacarMensajeRandom} className="text-7xl md:text-8xl hover:scale-110 transition-transform duration-300 animate-bounce hover:animate-none mb-8 drop-shadow-md active:scale-95 cursor-pointer" title="¡Tócame!">📭</button><div className="min-h-44 flex items-center justify-center w-full max-w-md">{mensajeActual ? (<div key={mensajeActual.texto} className="bg-white p-6 rounded-[2rem] border-2 border-[#a855f7]/20 shadow-xl animate-pop-in w-full"><div className="text-4xl mb-3 animate-bounce-slow">{mensajeActual.emoji}</div><p className="text-[#3f2a2a] text-xl font-medium leading-tight px-2">{mensajeActual.texto}</p></div>) : (<p className="text-[#886a6a] italic text-lg font-serif animate-pulse">Toca el buzón de arriba para recibir un pedacito de mi corazón...</p>)}</div></div>,

    // --- DIAPOSITIVA 9: PREGUNTA INTERACTIVA ---
    <div key="s8" className="flex flex-col items-center text-center animate-slide-in w-full max-w-4xl">{!aceptaContinuar ? (<div className="bg-[#f3e8ff] border-2 border-dashed border-[#a855f7]/40 p-8 md:p-12 rounded-[3rem] w-full max-w-2xl transition-all duration-500 animate-pop-in"><div className="text-6xl mb-6">📖</div><h2 className="text-3xl md:text-4xl font-serif text-[#3f2a2a] mb-6">¿Quieres seguir llenando esta historia de los dos?</h2>{intentoNo && (<p className="text-red-500 font-bold mb-4 animate-bounce text-sm md:text-base">¿Cómo que no? ¡Esa respuesta es incorrecta! Inténtalo otra vez 😤💜</p>)}<div className="flex flex-row gap-4 justify-center items-center mt-4"><button onClick={() => {setAceptaContinuar(true);setIntentoNo(false);}} className="bg-[#a855f7] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#9333ea] hover:scale-105 transition-all shadow-lg">Sí, quiero 💜</button><button onClick={() => setIntentoNo(true)} className="bg-white/60 text-gray-500 border border-gray-300 px-6 py-3 rounded-full font-medium text-lg hover:bg-red-50 hover:text-red-100 transition-all active:scale-95">No 😢</button></div></div>) : (<div className="bg-white border border-[#a855f7]/30 p-10 rounded-[2rem] shadow-xl relative animate-pop-in max-w-2xl w-full"><h2 className="text-4xl font-serif text-[#3f2a2a] mb-4">¡Gracias por estar en mi vida! 🌟</h2><p className="text-[#594646] text-lg mb-6">"Cada día y cada mes a tu lado confirma todo lo que ya sabía."</p><img src="dia-novios.jpeg" className="w-full h-56 object-cover rounded-xl border border-gray-100 mb-6 shadow-sm" alt="Nuestra Historia" /><p className="text-[#3f2a2a] text-lg font-serif italic">Gracias por seguir llenando estos días de alegría. Este diario seguirá creciendo con nosotros cada mes. Te amo. 💜</p></div>)}</div>,

    // --- 🗓️ DIAPOSITIVA 10: CONTINUACIÓN BLOQUEADA CON CRONÓMETRO AL MES 2 ---
    <div key="s_final" className="flex flex-col items-center justify-center text-center animate-slide-in w-full max-w-4xl h-full px-4">
      <div className="relative mb-4">
        <div className="text-8xl animate-bounce-slow">{esEditor ? "🔓" : "🔒"}</div>
        <div className="absolute -top-3 -right-3 text-4xl animate-pulse">✨</div>
      </div>
      
      <h2 className="text-4xl md:text-6xl font-serif text-[#3f2a2a] mb-3 leading-tight">
        Nuestra Historia <span className="text-[#a855f7] font-bold">Continúa...</span>
      </h2>
      <p className="text-[#886a6a] text-lg mb-8 max-w-md mx-auto">
        Este diario no termina aquí. Hay una página secreta esperando por nosotros cuando se cumpla el siguiente plazo.
      </p>
      
      <div className="bg-white/40 backdrop-blur-md border-2 border-dashed border-[#a855f7]/40 p-8 rounded-[2.5rem] shadow-xl max-w-2xl w-full animate-pop-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f3e8ff]/15 pointer-events-none" />
        
        <span className="inline-block px-5 py-1.5 bg-[#f3e8ff] text-[#7e22ce] font-black text-xs rounded-full uppercase tracking-widest mb-6 border border-[#a855f7]/20 shadow-sm">
          {esEditor ? "🛠️ Modo Editor Activado" : "🔒 Próximo Capítulo Bloqueado"}
        </span>
        
        <p className="text-[#3f2a2a] text-2xl md:text-3xl font-serif italic mb-8 px-2 leading-relaxed">
          "Te espero el próximo 18 del próximo mes con nuevas aventuras..."
        </p>
        
        <div className="bg-white/90 border border-[#a855f7]/10 rounded-2xl p-5 inline-block mx-auto shadow-sm w-full max-w-md">
          <h4 className="text-[#886a6a] text-xs font-black tracking-widest uppercase mb-4">
            {esEditor ? "Simulación de Cronómetro Real:" : "Falta exactamente:"}
          </h4>
          
          <div className="flex justify-center gap-4 font-sans text-2xl md:text-3xl font-bold text-[#3f2a2a]">
            <div>
              <span className="text-black font-mono bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{waitTimerCh2.days.toString().padStart(2, '0')}</span>
              <span className="text-[10px] block text-[#886a6a] font-black tracking-wider uppercase mt-2">días</span>
            </div>
            <div className="text-[#a855f7] pt-1">:</div>
            <div>
              <span className="text-black font-mono bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{waitTimerCh2.hours.toString().padStart(2, '0')}</span>
              <span className="text-[10px] block text-[#886a6a] font-black tracking-wider uppercase mt-2">horas</span>
            </div>
            <div className="text-[#a855f7] pt-1">:</div>
            <div>
              <span className="text-black font-mono bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{waitTimerCh2.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[10px] block text-[#886a6a] font-black tracking-wider uppercase mt-2">min</span>
            </div>
            <div className="text-[#a855f7] pt-1">:</div>
            <div>
              <span className="text-[#7e22ce] font-mono bg-[#f3e8ff] px-2 py-1 rounded-md border border-[#a855f7]/20 animate-pulse">{waitTimerCh2.seconds.toString().padStart(2, '0')}</span>
              <span className="text-[10px] block text-[#886a6a] font-black tracking-wider uppercase mt-2">seg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 text-[#a855f7]">
        <div className="w-12 h-[2px] bg-[#a855f7]/30"></div>
        <span className="text-3xl">{esEditor ? "🛠️💜" : "🔐💜"}</span>
        <div className="w-12 h-[2px] bg-[#a855f7]/30"></div>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f3] text-[#3f2a2a] font-sans flex flex-col relative overflow-x-hidden select-none">
      <audio ref={audioRef} src="musica.mp3" loop />
      <div className="fixed top-6 right-6 z-50">
        <button onClick={toggleMusic} className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-md border border-[#a855f7]/30 transition-all duration-300 ${isPlaying ? 'bg-[#a855f7] text-white animate-spin-slow' : 'bg-white text-gray-800 hover:bg-gray-50'}`}>
          {isPlaying ? "🎵" : "🔇"}
        </button>
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6 pb-28 mt-10">{slidesContent[step]}</main>
      
      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center bg-white/80 backdrop-blur-lg border-t border-gray-200 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <button onClick={() => setStep(prev => Math.max(0, prev - 1))} className={`px-6 py-2.5 rounded-full font-bold flex items-center transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-transparent border border-[#a855f7] text-[#a855f7] hover:bg-[#f3e8ff]'}`}>◀ Anterior</button>
        <div className="hidden md:flex gap-2.5">{slidesContent.map((_, i) => (<div key={i} className={`h-2.5 rounded-full transition-all duration-500 ${step === i ? 'bg-[#a855f7] w-9' : 'bg-[#a855f7]/20 hover:bg-[#a855f7]/40 w-2.5'}`} />))}</div>
        <button onClick={() => setStep(prev => Math.min(slidesContent.length - 1, prev + 1))} className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-widest flex items-center transition-all ${step === slidesContent.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-[#a855f7] text-white hover:bg-[#9333ea] shadow-lg'}`}>Siguiente ▶</button>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin-slow { 100% { transform: rotate(360deg); } } @keyframes slide-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } } .animate-spin-slow { animation: spin-slow 10s linear infinite; } .animate-slide-in { animation: slide-in 0.7s ease-out forwards; } .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; } ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f8f5f3; } ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.5); }`}} />
    </div>
  );
}