"use client";

import { useState, useEffect, useRef } from "react";

// --- FECHAS CLAVE ---
const picnicDate = new Date(2026, 3, 18, 0, 0, 0); // 18 de Abril de 2026
const chapter1Date = new Date(2026, 4, 18, 12, 0, 0); // 18 de Mayo de 2026 a las 12:00 PM
const chapter2Date = new Date(2026, 5, 18, 12, 0, 0); // 18 de Junio de 2026 a las 12:00 PM

export default function RomanticWebsite() {
  // --- ESTADOS ---
  const [modoEdicion, setModoEdicion] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [canSeeChapter1, setCanSeeChapter1] = useState(false);
  const [canSeeChapter2, setCanSeeChapter2] = useState(false);
  
  // Estados del Candado
  const [errorMsg, setErrorMsg] = useState(false);
  const [lockDay, setLockDay] = useState(15);
  const [lockMonth, setLockMonth] = useState(1);
  const [lockYear, setLockYear] = useState(2025);

  // Navegación y Tiempo
  const [step, setStep] = useState(0);
  const [waitTimer, setWaitTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Animaciones y Partículas
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; size: string; duration: string }[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: string; delay: string; duration: string; size: string; opacity: number }[]>([]);
  
  // Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Generadores de partículas para los dos escenarios
  useEffect(() => {
    // Corazones morados/rosa flotantes (Para la Portada estilo TikTok)
    setFloatingHearts(Array.from({ length: 30 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 5}s`, duration: `${Math.random() * 8 + 6}s`, size: `${Math.random() * 1.5 + 0.5}rem`, opacity: Math.random() * 0.4 + 0.1 // Opacidad muy sutil
    })));
    // Partículas cinemáticas (Para el Diario Interior oscuro)
    setParticles(Array.from({ length: 25 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 6}s`, size: `${Math.random() * 14 + 6}px`, duration: `${Math.random() * 7 + 5}s`
    })));
  }, []);

  // 2. Modo Edición y Verificador de Fechas
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") setModoEdicion(true);
    }
    const now = new Date();
    if (now.getTime() >= chapter1Date.getTime()) setCanSeeChapter1(true);
    if (now.getTime() >= chapter2Date.getTime()) setCanSeeChapter2(true);
  }, []);

  // 3. Temporizadores
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date();
      // Tiempo de Espera
      const diffUnlock = chapter1Date.getTime() - now.getTime();
      if (diffUnlock <= 0) setCanSeeChapter1(true);
      else {
        setWaitTimer({
          days: Math.floor(diffUnlock / (1000 * 60 * 60 * 24)), hours: Math.floor((diffUnlock / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diffUnlock / 1000 / 60) % 60), seconds: Math.floor((diffUnlock / 1000) % 60)
        });
      }
      // Tiempo Juntos
      const diffTogether = now.getTime() - picnicDate.getTime();
      setTimeTogether({
        days: Math.floor(diffTogether / (1000 * 60 * 60 * 24)), hours: Math.floor((diffTogether / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffTogether / 1000 / 60) % 60), seconds: Math.floor((diffTogether / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Controles
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

  // Componente Wheel rediseñado para integrarse visualmente en la tarjeta clara sin romper el diseño
  const Wheel = ({ value, type, label }: { value: string, type: 'day' | 'month' | 'year', label: string }) => (
    <div className="flex flex-col items-center">
      <button onClick={() => spinWheel(type, 1)} className="text-[#e91e63] hover:text-[#d81b60] text-xl mb-1 transition-all">▲</button>
      <div className="bg-[#fff0f5] border border-pink-200 w-12 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-xl shadow-inner relative overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></span>
        <span className="text-lg md:text-xl font-mono font-bold text-[#880e4f] z-10">{value}</span>
      </div>
      <button onClick={() => spinWheel(type, -1)} className="text-[#e91e63] hover:text-[#d81b60] text-xl mt-1 transition-all">▼</button>
      <span className="text-pink-600 text-[8px] font-bold tracking-widest mt-1">{label}</span>
    </div>
  );

  // ==============================================================================
  // --- PANTALLA 1: BLOQUEO / ESPERA (TU DISEÑO TIKTOK INTACTO) ---
  // ==============================================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e91e63] to-[#880e4f] text-white font-sans flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden selection:bg-purple-500 selection:text-white">
        <audio ref={audioRef} src="/musica.mp3" loop />
        <button onClick={toggleMusic} className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 hover:bg-white/30 transition-all shadow-lg">{isPlaying ? "🎵" : "🔇"}</button>

        {/* Fondo de Corazones Flotantes muy Sutil */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />
          {floatingHearts.map((h) => (
            <span key={h.id} className="absolute bottom-[-10%] animate-float-heart" style={{ left: h.left, animationDelay: h.delay, animationDuration: h.duration, fontSize: h.size, opacity: h.opacity }}>
              {Math.random() > 0.5 ? "💜" : "💟"}
            </span>
          ))}
        </div>

        {/* Contenedor Principal (Estilo Móvil Centrado) */}
        <div className="relative z-10 w-full max-w-md flex flex-col gap-4 animate-fade-in mt-4">
          <div className="text-center mb-1"><h1 className="text-lg tracking-[0.2em] font-bold text-white drop-shadow-md">ALEX DEV</h1></div>

          {/* --- TARJETA SUPERIOR (LA CARTA) --- */}
          <div className={`bg-[#fdfbf7] text-[#333] rounded-[2rem] p-6 md:p-7 shadow-2xl relative overflow-hidden ${errorMsg ? 'animate-shake' : ''}`}>
            <div className="flex justify-between items-start mb-6 gap-4">
              <div className="flex-1 pr-2">
                <p className="font-serif font-bold text-sm mb-3 text-[#333]">Para el amor de mi vida:</p>
                <div className="font-sans text-[13px] md:text-sm space-y-3 mb-2 text-gray-700 leading-relaxed min-h-[90px]">
                  {(!canSeeChapter1 && !modoEdicion) ? (
                    <>
                      <p>Las mejores historias requieren paciencia, y la nuestra vale la pena la espera.</p>
                      <p className="font-bold">¡Vuelve mañana, 18 de Mayo, para descubrirlo!</p>
                    </>
                  ) : (
                    <>
                      <p>El diario está listo, pero requiere una llave especial.</p>
                      <p className="font-bold text-[#880e4f] text-[11px] mt-2 leading-tight">Pista: El día que me hiciste el hombre más feliz en el Parque de las Garzas.</p>
                    </>
                  )}
                </div>
              </div>
              {/* Imagen del Árbol (Esencia de la imagen) */}
              <div className="w-28 h-32 flex-shrink-0 flex items-center justify-center bg-[#fff0f5] rounded-xl overflow-hidden shadow-inner border border-pink-100">
                <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=200&auto=format&fit=crop" alt="Árbol de Corazones" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-200 my-4"></div>

            {/* Temporizador o Candado Integrado Dinámicamente */}
            <div>
              {(!canSeeChapter1 && !modoEdicion) ? (
                <>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">El candado se revelará en:</p>
                  <div className="text-base font-mono font-bold text-[#333] flex items-baseline gap-1">
                    <span>{waitTimer.days.toString().padStart(2, '0')} <span className="text-[10px] text-gray-500 font-sans">días</span></span>
                    <span>{waitTimer.hours.toString().padStart(2, '0')} <span className="text-[10px] text-gray-500 font-sans">horas</span></span>
                    <span>{waitTimer.minutes.toString().padStart(2, '0')} <span className="text-[10px] text-gray-500 font-sans">minutos</span></span>
                    <span className="text-pink-600">{waitTimer.seconds.toString().padStart(2, '0')}</span> <span className="text-[10px] text-gray-500 font-sans">segundos</span>
                  </div>
                  <div className="w-full h-[3px] bg-gray-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#e91e63] animate-pulse w-[85%]"></div></div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">Mañana a las 12:00 PM</p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <Wheel value={lockDay.toString().padStart(2, '0')} type="day" label="DÍA" />
                    <span className="text-2xl text-pink-400 font-black mb-4">:</span>
                    <Wheel value={lockMonth.toString().padStart(2, '0')} type="month" label="MES" />
                    <span className="text-2xl text-pink-400 font-black mb-4">:</span>
                    <Wheel value={lockYear.toString()} type="year" label="AÑO" />
                  </div>
                  <button onClick={handleUnlock} className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold py-3 rounded-xl text-xs tracking-widest transition-all shadow-lg uppercase">Abrir Diario 🔓</button>
                </div>
              )}
            </div>
          </div>

          {/* --- TARJETA INFERIOR (EDITOR DE CÓDIGO) --- */}
          <div className="bg-[#1e1e1e] rounded-[1.5rem] w-full border border-gray-700 shadow-2xl overflow-hidden mt-1">
            {/* Cabecera estilo Mac */}
            <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-black/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="ml-auto text-[10px] text-gray-400 font-mono">style.css</span>
            </div>
            {/* Cuerpo del Código */}
            <div className="p-5 text-[13px] md:text-sm font-mono leading-relaxed overflow-x-auto text-gray-300">
              {(!canSeeChapter1 && !modoEdicion) ? (
                <pre className="m-0">
<span className="text-gray-500">1</span> <span className="text-[#e2c08d]">.San_Valentin</span> {'{'}
<span className="text-gray-500">2</span>   <span className="text-[#9cdcfe]">position</span>: <span className="text-[#ce9178]">absolute</span>;
<span className="text-gray-500">3</span>   <span className="text-[#9cdcfe]">width</span>: <span className="text-[#b5cea8]">90%</span>;
<span className="text-gray-500">4</span>   <span className="text-[#9cdcfe]">font-size</span>: <span className="text-[#b5cea8]">2rem</span>;
<span className="text-gray-500">5</span>   <span className="text-[#9cdcfe]">font-family</span>: <span className="text-[#ce9178]">"Te Amo"</span>;
<span className="text-gray-500">6</span>   <span className="text-[#9cdcfe]">height</span>: <span className="text-[#dcdcaa]">var</span>(<span className="text-[#9cdcfe]">--letter-love</span>);
<span className="text-gray-500">7</span> {'}'}
                </pre>
              ) : (
                <pre className="m-0">
<span className="text-gray-500">1</span> <span className="text-yellow-300">.Ingresando_Llave</span> {'{'}
<span className="text-gray-500">2</span>   <span className="text-blue-300">action</span>: <span className="text-purple-300">"Esperando fecha..."</span>;
<span className="text-gray-500">3</span>   <span className="text-blue-300">hint</span>: <span className="text-purple-300">"Picnic Cali"</span>;
<span className="text-gray-500">4</span>   <span className="text-blue-300">cursor</span>: <span className="text-purple-300">pointer</span>;
<span className="text-gray-500">5</span>   <span className="text-blue-300">display</span>: <span className="text-purple-300">block</span>;
<span className="text-gray-500">6</span>   <span className="text-blue-300">status</span>: <span className="text-purple-300">"Listo"</span>;
<span className="text-gray-500">7</span> {'}'}
                </pre>
              )}
            </div>
          </div>
          {modoEdicion && <p className="text-center text-xs text-red-100 font-bold bg-red-900/30 py-1.5 rounded-full border border-red-500/50">🔧 MODO ADMIN ACTIVADO (Sin restricciones de tiempo)</p>}
        </div>
        
        {/* Animaciones CSS Globales para la portada */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-heart { 0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 0; } 10% { opacity: var(--tw-opacity, 1); } 90% { opacity: var(--tw-opacity, 1); } 100% { transform: translateY(-20vh) scale(1.5) rotate(45deg); opacity: 0; } }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
          @keyframes fade-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
          .animate-float-heart { animation: float-heart linear infinite; } .animate-shake { animation: shake 0.4s ease-in-out; } .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}} />
      </div>
    );
  }

  // ==============================================================================
  // --- RENDERIZADO DEL DIARIO DESBLOQUEADO (TU ESCENARIO CINEMÁTICO) ---
  // ==============================================================================
  
  const slidesContent = [
    // Slide 1 (AQUÍ ESTÁ EL DISEÑO DE LA IMAGEN EN LA PÁGINA 0)
    <div key="s1" className="flex flex-col items-center animate-slide-in w-full max-w-2xl mt-4">
      <div className="bg-[#fdfbf7] text-[#333] rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden w-full border border-[#c084fc]/30">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 pr-2">
            <div className="inline-block px-3 py-1.5 rounded-full bg-[#fff0f5] border border-pink-200 text-[#e91e63] text-[10px] font-bold tracking-[0.2em] uppercase mb-4 animate-pulse">Feliz Primer Mes</div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#333] mb-3">Bienvenida, <br/><span className="text-[#e91e63]">mi Amor</span></h1>
            <div className="font-sans text-[14px] md:text-base space-y-3 text-gray-700 leading-relaxed mt-4">
              <p>He creado este espacio para que nunca olvides lo especial que eres para mí.</p>
              <p className="font-bold text-[#880e4f] italic">A partir de aquí, navegaremos por nuestra propia línea del tiempo.</p>
            </div>
          </div>
          {/* Imagen del Árbol de la imagen de referencia */}
          <div className="w-32 md:w-40 h-40 md:h-48 flex-shrink-0 flex items-center justify-center bg-[#fff0f5] rounded-2xl overflow-hidden shadow-inner border border-pink-100">
            <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=300&auto=format&fit=crop" alt="Árbol de Corazones" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>,

    // Slide 2
    <div key="s1_video" className="flex flex-col items-center animate-slide-in w-full max-w-4xl">
      <h2 className="text-4xl font-serif text-[#c084fc] mb-4">Nuestra magia en <span className="text-[#deff9a]">movimiento</span></h2>
      <p className="text-[#daffde] mb-8 text-center text-lg">Porque hay miradas y risas que una foto no puede capturar del todo.</p>
      <div className="w-full bg-[#1a0d35] p-4 rounded-[2rem] border border-[#c084fc]/30 shadow-[0_0_30px_rgba(192,132,252,0.2)]">
        <video src="/WhatsApp Video 2026-05-17 at 16.11.38.mp4" controls className="w-full h-auto rounded-xl shadow-inner max-h-[60vh] object-cover" />
      </div>
    </div>,

    // Slide 3
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

    // Slide 4
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

    // Slide 5
    <div key="s4" className="flex flex-col items-center text-center animate-slide-in w-full max-w-4xl">
      <h2 className="text-5xl font-serif text-[#c084fc] mb-2">Nuestra Fecha Oficial</h2>
      <h3 className="text-3xl text-[#deff9a] mb-8 font-bold">18 de Abril, 2026</h3>
      <img src="https://images.unsplash.com/photo-1522673607200-164883eecd4c?q=80&w=800&auto=format&fit=crop" alt="Picnic Cali" className="w-full h-64 object-cover rounded-2xl border-2 border-[#c084fc] mb-8 shadow-lg" />
      <p className="text-[#daffde] text-lg mb-4">Cali nos recibió con su brisa, pero fue el Parque de las Garzas el lugar perfecto. Preparé ese picnic con nervios y mucha ilusión.</p>
      <p className="text-[#daffde] text-lg">Fue allí donde te pedí que fueras mi novia, y ese "sí" se convirtió en el sonido más bonito que he escuchado nunca.</p>
    </div>,

    // Slide 6
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

    // Slide 7
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

    // Slide 8
    <div key="s7" className="flex flex-col items-center justify-center text-center animate-slide-in w-full max-w-3xl h-full">
      <div className="text-7xl text-[#c084fc] opacity-50 mb-4">"</div>
      <p className="font-serif text-3xl md:text-5xl italic text-[#f5f5f5] leading-snug mb-8">No buscaba a nadie, pero te vi y supe que eras tú.</p>
      <cite className="text-2xl text-[#deff9a] block">— Por siempre tuyo</cite>
    </div>,

    // Slide 9: Capítulo 2
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
    <div className="min-h-screen bg-[#0f0720] text-[#f5f5f5] font-sans selection:bg-[#c084fc] flex flex-col relative overflow-hidden">
      {/* Tu Fondo Cinemático Anterior */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(147,51,234,0.2)_0%,_transparent_60%),_radial-gradient(circle_at_80%_80%,_rgba(222,255,154,0.05)_0%,_transparent_50%)] z-0 pointer-events-none animate-cinematic-bg" />
      
      {/* Tus Partículas Anteriores */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <span key={p.id} className="absolute bottom-[-5%] text-[#c084fc]/40 animate-float-up inline-block" style={{ left: p.left, animationDelay: p.delay, fontSize: p.size, animationDuration: p.duration }}>✨</span>
        ))}
      </div>

      <audio ref={audioRef} src="/musica.mp3" loop />

      <div className="fixed top-6 right-6 z-50">
        <button onClick={toggleMusic} className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg border border-[#c084fc] text-white transition-all ${isPlaying ? 'bg-[#c084fc] animate-spin-slow' : 'bg-[#1a0d35]'} hover:bg-[#c084fc]/10`}>
          {isPlaying ? "🎵" : "🔇"}
        </button>
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6 pb-24 mt-10">
        {slidesContent[step]}
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center bg-[#0f0720]/80 backdrop-blur-md border-t border-[#c084fc]/20 z-50 shadow-2xl">
        <button onClick={() => setStep(prev => Math.max(0, prev - 1))} className={`px-6 py-2 rounded-full font-bold flex items-center transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-transparent border border-[#c084fc] text-[#c084fc] hover:bg-[#c084fc]/10'}`}>
          ◀ Anterior
        </button>
        
        <div className="hidden md:flex gap-2">
          {slidesContent.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'bg-[#deff9a] w-8 shadow-[0_0_10px_rgba(222,255,154,0.8)]' : 'bg-[#c084fc]/30 w-2'}`} />
          ))}
        </div>

        <button onClick={() => setStep(prev => Math.min(slidesContent.length - 1, prev + 1))} className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest flex items-center transition-all ${step === slidesContent.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-[#c084fc] text-[#0f0720] hover:bg-[#deff9a] shadow-[0_0_15px_rgba(192,132,252,0.4)]'}`}>
          Siguiente ▶
        </button>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        @keyframes slide-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes dynamic-glow { 0%, 100% { box-shadow: 0 0 30px rgba(192,132,252,0.25); border-color: rgba(192,132,252,0.3); } 50% { box-shadow: 0 0 55px rgba(222,255,154,0.35); border-color: rgba(222,255,154,0.5); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.15); opacity: 0.6; } }
        @keyframes cinematic-bg { 0%, 100% { transform: scale(1) translate(0px, 0px); } 50% { transform: scale(1.08) translate(8px, -8px); } }
        @keyframes float-up { 0% { transform: translateY(10vh) scale(0) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-110vh) scale(1) rotate(360deg); opacity: 0; } }

        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; }
        .animate-dynamic-glow { animation: dynamic-glow 5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-cinematic-bg { animation: cinematic-bg 22s ease-in-out infinite; }
        .animate-float-up { animation: float-up linear infinite; }
      `}} />
    </div>
  );
}