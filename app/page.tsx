"use client";

import { useState, useEffect, useRef } from "react";

// --- FECHAS CLAVE ---
const picnicDate = new Date(2026, 3, 18, 0, 0, 0); // 18 de Abril de 2026
const chapter1Date = new Date(2026, 4, 18, 12, 0, 0); // 18 de Mayo de 2026 a las 12:00 PM
const chapter2Date = new Date(2026, 5, 18, 12, 0, 0); // 18 de Junio de 2026 a las 12:00 PM

// --- COMPONENTE WHEEL ---
const Wheel = ({ value, type, label, spinWheel }: { value: string, type: 'day' | 'month' | 'year', label: string, spinWheel: (type: 'day' | 'month' | 'year', direction: number) => void }) => (
  <div className="flex flex-col items-center">
    <button onClick={() => spinWheel(type, 1)} className="text-[#c084fc] hover:text-[#deff9a] text-3xl mb-2 transition-all hover:-translate-y-1">▲</button>
    <div className="bg-[#1a0d35] border border-[#c084fc] w-20 md:w-24 h-24 flex items-center justify-center rounded-xl relative shadow-[0_0_15px_rgba(192,132,252,0.3)]">
      <span className="text-4xl md:text-5xl font-mono font-bold text-[#deff9a] z-10">{value}</span>
    </div>
    <button onClick={() => spinWheel(type, -1)} className="text-[#c084fc] hover:text-[#deff9a] text-3xl mt-2 transition-all hover:translate-y-1">▼</button>
    <span className="text-[#c084fc] text-[12px] font-bold tracking-widest mt-2">{label}</span>
  </div>
);

export default function RomanticWebsite() {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [lockDay, setLockDay] = useState(15);
  const [lockMonth, setLockMonth] = useState(1);
  const [lockYear, setLockYear] = useState(2025);

  const [step, setStep] = useState(0);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [waitTimer, setWaitTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [esHoy, setEsHoy] = useState(false);
  
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; duration: string; color: string; size: string; opacity: number }[]>([]);
  const [treeHearts, setTreeHearts] = useState<{ id: number; x: number; y: number; color: string; scale: number }[]>([]);
  
  const [canSeeChapter1, setCanSeeChapter1] = useState(false);
  const [canSeeChapter2, setCanSeeChapter2] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generador de partículas y árbol 
  useEffect(() => {
    const pinkRedShades = ['#ef4444', '#ec4899', '#f43f5e', '#e11d48', '#be185d', '#ff1493', '#db2777', '#9d174d'];
    
    // 1. LLUVIA MASIVA DE CORAZONES EN TODA LA PANTALLA
    const generatedParticles = Array.from({ length: 450 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${-20 + Math.random() * 40}vh`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 10 + 7}s`,
      color: pinkRedShades[Math.floor(Math.random() * pinkRedShades.length)],
      size: `${Math.random() * 15 + 8}px`,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(generatedParticles);

    // 2. CORAZONES DEL ÁRBOL (Formando un corazón perfecto usando ecuaciones matemáticas)
    const heartsArray: { id: number; x: number; y: number; color: string; scale: number }[] = [];
    let count = 0;
    
    // Follaje superior (Forma de corazón MÁS GRANDE)
    // Aumentamos el número de corazones a 500 para cubrir el área más grande
    for (let i = 0; i < 500; i++) {
      const t = Math.random() * Math.PI * 2;
      const d = Math.sqrt(Math.random()); // Distribución uniforme dentro del corazón
      // Aumentamos la escala de 3.5 a 4.0
      const scale = 4.0;

      // Ecuación paramétrica del corazón
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      // Centro del corazón ajustado. X=100 se mantiene, Y baja ligeramente a 55 para compensar el tamaño
      const x = 100 + d * scale * hx + (Math.random() - 0.5) * 4; 
      const y = 55 - d * scale * hy + (Math.random() - 0.5) * 4; // Restamos porque SVG Y va hacia abajo

      heartsArray.push({
        id: count++,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        color: pinkRedShades[Math.floor(Math.random() * pinkRedShades.length)],
        scale: Math.random() * 0.6 + 0.8 // Escala variada para dar textura
      });
    }

    // Corazones caídos en la base del tronco
    for (let i = 0; i < 50; i++) {
      const bx = 100 + (Math.random() - 0.5) * 70; // Desplazamiento horizontal
      const dist = Math.abs(bx - 100);
      const by = 185 - Math.random() * (15 - dist * 0.25); // Forma un montículo

      if (by > 175) {
        heartsArray.push({
          id: count++,
          x: parseFloat(bx.toFixed(1)),
          y: parseFloat(by.toFixed(1)),
          color: pinkRedShades[Math.floor(Math.random() * pinkRedShades.length)],
          scale: Math.random() * 0.4 + 0.6
        });
      }
    }

    setTreeHearts(heartsArray);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") setModoEdicion(true);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    if (now.getTime() >= chapter1Date.getTime()) setCanSeeChapter1(true);
    if (now.getTime() >= chapter2Date.getTime()) setCanSeeChapter2(true);
    
    if (now.getDate() === chapter1Date.getDate() && now.getMonth() === chapter1Date.getMonth() && now.getFullYear() === chapter1Date.getFullYear()) {
      setEsHoy(true);
    }
  }, []);

  useEffect(() => {
    if (canSeeChapter1 || modoEdicion) return;
    const waitInterval = setInterval(() => {
      const now = new Date();
      const difference = chapter1Date.getTime() - now.getTime();
      
      if (now.getDate() === chapter1Date.getDate()) {
        setEsHoy(true);
      }

      if (difference <= 0) {
        setCanSeeChapter1(true);
        clearInterval(waitInterval);
      } else {
        setWaitTimer({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(waitInterval);
  }, [canSeeChapter1, modoEdicion]);

  useEffect(() => {
    if (!isUnlocked) return;
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - picnicDate.getTime();
      setTimeTogether({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
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
    if (lockDay === 18 && lockMonth === 4 && lockYear === 2026) setIsUnlocked(true);
    else { setErrorMsg(true); setTimeout(() => setErrorMsg(false), 800); }
  };

  // --- PANTALLA 0: ESPERA ---
  if (!canSeeChapter1 && !modoEdicion) {
    return (
      <div className="min-h-screen bg-[#f7f3ed] flex items-center justify-center p-4 md:p-8 relative font-serif select-none">
        
        {/* LLUVIA FORZADA AL FRENTE (z-[9999]) PARA QUE CUBRA TODO EL ANCHO SIN SER TAPADA */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}>
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute animate-falling-hearts inline-block"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
                color: p.color,
                fontSize: p.size,
                opacity: p.opacity
              }}
            >
              ♥
            </span>
          ))}
        </div>

        {/* Tarjeta principal */}
        <div className="w-full max-w-4xl bg-[#fdfcf9] rounded-[2rem] border border-[#e5d8cb] shadow-[0_15px_40px_rgba(100,70,50,0.08)] relative p-8 md:p-14 flex flex-col z-10">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-left space-y-6 md:pt-6">
              <h1 className="text-[#3b251a] text-2xl md:text-3xl font-medium tracking-wide">
                Para el amor de mi vida:
              </h1>
              
              <p className="text-[#3b251a] text-xl md:text-2xl italic leading-relaxed">
                Las mejores historias requieren paciencia, y la nuestra vale la pena la espera.
              </p>
              
              <p className="text-[#c8446b] text-xl md:text-2xl font-bold tracking-wide pt-2">
                {esHoy ? "¡Vuelve hoy a las 12:00 PM para descubrirlo!" : "¡Vuelve mañana, 18 de Mayo, para descubrirlo!"}
              </p>
            </div>

            {/* ÁRBOL CON FORMA DE CORAZÓN GRANDE */}
            <div className="w-72 h-72 md:w-[26rem] md:h-[26rem] relative flex items-center justify-center flex-shrink-0 animate-gentle-sway">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                {/* Resplandor trasero */}
                <circle cx="100" cy="80" r="75" fill="#fce7f3" opacity="0.6" filter="blur(12px)" />
                
                {/* Tronco */}
                <path d="M92 185 L96 90 L104 90 L108 185 Z" fill="#653819" />
                <path d="M100 115 L70 85" stroke="#653819" strokeWidth="5" strokeLinecap="round" />
                <path d="M100 100 L135 65" stroke="#653819" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M115 80 L145 95" stroke="#653819" strokeWidth="3" strokeLinecap="round" />
                
                {/* Hojas / Corazones */}
                <g className="select-none">
                  {treeHearts.map((heart) => (
                    <text
                      key={heart.id}
                      x={heart.x}
                      y={heart.y}
                      fill={heart.color}
                      className="opacity-95 drop-shadow-sm"
                      style={{ 
                        transformOrigin: `${heart.x}px ${heart.y}px`,
                        transform: `scale(${heart.scale})`
                      }}
                    >
                      ♥
                    </text>
                  ))}
                </g>
              </svg>
            </div>
          </div>

          <hr className="border-[#e5d8cb] my-8 md:my-10" />

          <div className="w-full">
            <h3 className="text-[#3b251a] text-lg font-sans mb-4">
              El candado se revelará en:
            </h3>
            
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-sans">
              {waitTimer.days > 0 && (
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-4xl md:text-5xl text-black tracking-tight">
                    {waitTimer.days.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[#3b251a] text-sm md:text-base mr-2">días</span>
                </div>
              )}

              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl md:text-5xl text-black tracking-tight">
                  {waitTimer.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-[#3b251a] text-sm md:text-base mr-2">horas</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl md:text-5xl text-black tracking-tight">
                  {waitTimer.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-[#3b251a] text-sm md:text-base mr-2">minutos</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl md:text-5xl text-[#c8446b] tracking-tight">
                  {waitTimer.seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[#3b251a] text-sm md:text-base">segundos</span>
              </div>
            </div>

            <p className="text-[#7d685c] text-sm md:text-base mt-4 font-sans italic">
              {esHoy ? "Hoy a las 12:00 PM" : "Mañana a las 12:00 PM"}
            </p>
          </div>

        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes falling-hearts {
            0% { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 0.8; }
            100% { transform: translateY(110vh) rotate(60deg) scale(1.1); opacity: 0; }
          }
          @keyframes gentle-sway {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(0.6deg); }
          }
          .animate-falling-hearts { animation: falling-hearts linear infinite; }
          .animate-gentle-sway { animation: gentle-sway 6s ease-in-out infinite; }
        `}} />
      </div>
    );
  }

  // --- PANTALLA 1: CANDADO ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0f0720] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(192,132,252,0.15)_0%,_transparent_70%)] z-0" />
        
        {modoEdicion && (
          <div className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse z-50 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            ⚠️ MODO EDICIÓN ACTIVO (URL SECRETA)
          </div>
        )}

        <div className="z-10 bg-[#1a0d35] border border-[#c084fc]/50 p-8 md:p-12 rounded-[2rem] shadow-[0_0_40px_rgba(192,132,252,0.2)] text-center max-w-2xl w-full animate-pop-in">
          <h1 className="text-4xl md:text-5xl font-serif text-[#f5f5f5] mb-4">La Llave de <span className="text-[#deff9a]">Nosotros</span></h1>
          <p className="text-[#daffde] mb-4 text-lg">Este diario contiene los momentos que han definido nuestro camino. Pero como todo gran tesoro, requiere de una llave especial.</p>
          <p className="text-[#c084fc] italic mb-10 font-serif">Pista: El día que me hiciste el hombre más feliz en el Parque de las Garzas.</p>
          
          <div className={`flex justify-center items-center gap-4 mb-10 ${errorMsg ? 'animate-shake' : ''}`}>
            <Wheel value={lockDay.toString().padStart(2, '0')} type="day" label="DÍA" spinWheel={spinWheel} />
            <span className="text-3xl text-[#c084fc] font-black mb-8">:</span>
            <Wheel value={lockMonth.toString().padStart(2, '0')} type="month" label="MES" spinWheel={spinWheel} />
            <span className="text-3xl text-[#c084fc] font-black mb-8">:</span>
            <Wheel value={lockYear.toString()} type="year" label="AÑO" spinWheel={spinWheel} />
          </div>
          <button onClick={handleUnlock} className="w-full bg-transparent border-2 border-[#c084fc] text-[#c084fc] hover:bg-[#c084fc] hover:text-[#0f0720] font-bold py-4 rounded-full text-xl uppercase tracking-widest transition-all">Abrir Diario 🔓</button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pop-in { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
          .animate-pop-in { animation: pop-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-shake { animation: shake 0.4s ease-in-out; }
        `}} />
      </div>
    );
  }

  // --- CONTENIDO DE LAS DIAPOSITIVAS ---
  const slidesContent = [
    <div key="s1" className="flex flex-col items-center text-center animate-slide-in w-full max-w-3xl">
      <div className="inline-block px-5 py-1.5 rounded-full bg-[#c084fc]/20 border border-[#c084fc]/30 text-[#c084fc] text-[10px] font-bold tracking-[0.3em] uppercase mb-6 animate-pulse">Feliz Primer Mes</div>
      <h1 className="text-5xl md:text-7xl font-serif text-[#f5f5f5] mb-6">Bienvenida, <span className="text-[#deff9a]">mi Amor</span></h1>
      <p className="text-[#daffde] text-xl md:text-2xl mb-6">He creado este espacio para que nunca olvides lo especial que eres para mí.</p>
      <p className="text-[#c084fc] text-lg italic">A partir de aquí, navegaremos por nuestra propia línea del tiempo.</p>
    </div>,

    <div key="s1_video" className="flex flex-col items-center animate-slide-in w-full max-w-4xl">
      <h2 className="text-4xl font-serif text-[#c084fc] mb-4">Nuestra magia en <span className="text-[#deff9a]">movimiento</span></h2>
      <p className="text-[#daffde] mb-8 text-center text-lg">Porque hay miradas y risas que una foto no puede capturar del todo.</p>
      <div className="w-full bg-[#1a0d35] p-4 rounded-[2rem] border border-[#c084fc]/30 shadow-[0_0_30px_rgba(192,132,252,0.2)]">
        <video src="/WhatsApp Video 2026-05-17 at 16.11.38.mp4" controls className="w-full h-auto rounded-xl shadow-inner max-h-[60vh] object-cover" />
      </div>
    </div>,

    <div key="s2" className="flex flex-col md:flex-row items-center gap-10 animate-slide-in w-full max-w-5xl">
      <div className="flex-1">
        <h2 className="text-4xl font-serif text-[#c084fc] mb-2">El Reencuentro</h2>
        <h3 className="text-2xl text-[#deff9a] mb-6 font-bold">6 de Enero, 2025</h3>
        <p className="text-[#daffde] text-lg mb-4">Ya nos conocíamos del colegio, pero fue en esta fecha, entre el color y la alegría del Carnaval, cuando empezamos a tratarnos de forma diferente.</p>
        <p className="text-[#daffde] text-lg">Fue el día en que las palabras empezaron a tener otro peso y las miradas otro brillo.</p>
      </div>
      <div className="flex-1">
        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop" alt="Carnaval" className="rounded-2xl border-2 border-[#c084fc] shadow-[0_15px_30px_rgba(0,0,0,0.5)]" />
      </div>
    </div>,

    <div key="s3" className="flex flex-col md:flex-row-reverse items-center gap-10 animate-slide-in w-full max-w-5xl">
      <div className="flex-1">
        <h2 className="text-4xl font-serif text-[#c084fc] mb-2">Ese Beso Inolvidable</h2>
        <h3 className="text-2xl text-[#deff9a] mb-6 font-bold">28 de Diciembre, 2025</h3>
        <p className="text-[#daffde] text-lg mb-4">Veníamos de La Jagua, el pueblo mágico que fue testigo de nuestra complicidad. Pero el momento real ocurrió en el carro.</p>
        <p className="text-[#daffde] text-lg mb-6">De venida, entre la carretera y el silencio, nos dimos ese primer beso que selló lo que ambos sentíamos.</p>
        <blockquote className="border-l-4 border-[#deff9a] pl-4 italic text-[#daffde]">"Hay viajes que no se miden en kilómetros, sino en momentos."</blockquote>
      </div>
      <div className="flex-1">
        <img src="https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=600&auto=format&fit=crop" alt="Beso carro" className="rounded-2xl border-2 border-[#c084fc] shadow-[0_15px_30px_rgba(0,0,0,0.5)]" />
      </div>
    </div>,

    <div key="s4" className="flex flex-col items-center text-center animate-slide-in w-full max-w-4xl">
      <h2 className="text-5xl font-serif text-[#c084fc] mb-2">Nuestra Fecha Oficial</h2>
      <h3 className="text-3xl text-[#deff9a] mb-8 font-bold">18 de Abril, 2026</h3>
      <img src="https://images.unsplash.com/photo-1522673607200-164883eecd4c?q=80&w=800&auto=format&fit=crop" alt="Picnic Cali" className="w-full h-64 object-cover rounded-2xl border-2 border-[#c084fc] mb-8 shadow-lg" />
      <p className="text-[#daffde] text-lg mb-4">Cali nos recibió con su brisa, pero fue el Parque de las Garzas el lugar perfecto. Preparé ese picnic con nervios y mucha ilusión.</p>
      <p className="text-[#daffde] text-lg">Fue allí donde te pedí que fueras mi novia, y ese "sí" se convirtió en el sonido más bonito que he escuchado nunca.</p>
    </div>,

    <div key="s5" className="flex flex-col md:flex-row items-center gap-12 animate-slide-in w-full max-w-5xl">
      <div className="flex-1 text-center">
        <div className="text-8xl md:text-9xl font-black text-[#c084fc] leading-none mb-2">{timeTogether.days}</div>
        <div className="text-2xl text-[#deff9a] tracking-widest uppercase font-bold mb-4">Días de Felicidad</div>
        <p className="text-[#c084fc] text-sm">Y {timeTogether.hours} horas con {timeTogether.minutes} minutos.</p>
      </div>
      <div className="flex-1 bg-[#1a0d35] p-8 rounded-2xl border border-[#c084fc]/30">
        <h2 className="text-3xl font-serif text-[#f5f5f5] mb-6">Nuestras Cifras</h2>
        <div className="space-y-6">
          {[ { label: 'Amor', w: '100%' }, { label: 'Risas', w: '95%' }, { label: 'Planes', w: '100%' } ].map((bar, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-20 text-right text-[#daffde] font-bold">{bar.label}</span>
              <div className="flex-grow h-6 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c084fc] to-[#deff9a]" style={{ width: bar.w }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,

    <div key="s6" className="flex flex-col items-center animate-slide-in w-full max-w-5xl">
      <h2 className="text-4xl font-serif text-[#f5f5f5] mb-10">Por qué tú</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[
          { icon: '🤍', title: 'Tu Bondad', text: 'La forma en que cuidas a los demás y cómo iluminas cualquier lugar con tu presencia.' },
          { icon: '✨', title: 'Tu Brillo', text: 'No importa qué tan oscuro esté el día, tu sonrisa siempre es mi guía favorita.' },
          { icon: '🚀', title: 'Tu Fuerza', text: 'Me inspiras a ser mejor cada día. Tu determinación es algo que admiro profundamente.' }
        ].map((item, i) => (
          <div key={i} className="bg-[#1a0d35] p-8 rounded-2xl text-center border border-white/5">
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-2xl text-[#deff9a] mb-4">{item.title}</h3>
            <p className="text-[#daffde]">{item.text}</p>
          </div>
        ))}
      </div>
    </div>,

    <div key="s7" className="flex flex-col items-center justify-center text-center animate-slide-in w-full max-w-3xl h-full">
      <div className="text-7xl text-[#c084fc] opacity-50 mb-4">"</div>
      <p className="font-serif text-3xl md:text-5xl italic text-[#f5f5f5] leading-snug mb-8">No buscaba a nadie, pero te vi y supe que eras tú.</p>
      <cite className="text-2xl text-[#deff9a] block">— Por siempre tuyo</cite>
    </div>,

    <div key="s8" className="flex flex-col items-center text-center animate-slide-in w-full max-w-4xl">
      {(canSeeChapter2 || modoEdicion) ? (
        <div className="bg-[#1a0d35] border border-[#deff9a]/50 p-10 rounded-[2rem] shadow-[0_0_30px_rgba(222,255,154,0.2)] relative">
          {modoEdicion && !canSeeChapter2 && <span className="absolute top-2 right-4 text-xs text-red-500 font-bold">Vista Previa Admin</span>}
          <h2 className="text-4xl font-serif text-[#deff9a] mb-4">Capítulo 2: Desbloqueado 🌟</h2>
          <p className="text-[#daffde] text-lg mb-6">"El segundo mes a tu lado confirma todo lo que ya sabía."</p>
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" className="w-full h-56 object-cover rounded-xl border border-[#c084fc] mb-6" alt="Mes 2" />
          <p className="text-[#f5f5f5] text-lg">Gracias por seguir llenando estos días de alegría. Este diario seguirá creciendo con nosotros cada mes.</p>
        </div>
      ) : (
        <div className="bg-[#1a0d35]/50 border-2 border-dashed border-[#c084fc]/40 p-12 rounded-[3rem]">
          <div className="text-6xl mb-6 opacity-50">🔒</div>
          <h2 className="text-4xl font-serif text-[#f5f5f5] mb-4">¿Continuamos la historia?</h2>
          <p className="text-[#daffde] text-lg mb-2">Nuestra historia se actualiza cada día 18.</p>
          <p className="text-[#c084fc] text-lg font-bold">Vuelve a escanear tu llave el 18 de Junio a las 12:00 PM.</p>
        </div>
      )}
    </div>
  ];

  return (
    <div className="min-h-screen bg-[#0f0720] text-[#f5f5f5] font-sans selection:bg-[#c084fc] flex flex-col relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(192,132,252,0.15)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_left,_rgba(222,255,154,0.05)_0%,_transparent_50%)] z-0 pointer-events-none" />
      <audio ref={audioRef} src="/musica.mp3" loop />

      <div className="fixed top-6 right-6 z-50">
        <button onClick={toggleMusic} className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg border border-[#c084fc] text-white transition-all ${isPlaying ? 'bg-[#c084fc] animate-spin-slow' : 'bg-[#1a0d35]'}`}>
          {isPlaying ? "🎵" : "🔇"}
        </button>
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6 pb-24 mt-10">
        {slidesContent[step]}
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center bg-[#0f0720]/90 backdrop-blur-md border-t border-[#c084fc]/20 z-50">
        <button onClick={() => setStep(prev => Math.max(0, prev - 1))} className={`px-6 py-2 rounded-full font-bold flex items-center transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-transparent border border-[#c084fc] text-[#c084fc] hover:bg-[#c084fc]/10'}`}>
          ◀ Anterior
        </button>
        
        <div className="hidden md:flex gap-2">
          {slidesContent.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'bg-[#deff9a] w-8 shadow-[0_0_10px_rgba(222,255,154,0.8)]' : 'bg-[#c084fc]/30 w-2'}`} />
          ))}
        </div>

        <button onClick={() => setStep(prev => Math.min(slidesContent.length - 1, prev + 1))} className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest flex items-center transition-all ${step === slidesContent.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-transparent border-2 border-[#c084fc] text-[#c084fc] hover:bg-[#c084fc] hover:text-[#0f0720] shadow-[0_0_15px_rgba(192,132,252,0.4)]'}`}>
          Siguiente ▶
        </button>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        @keyframes slide-in { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; }
      `}} />
    </div>
  );
}