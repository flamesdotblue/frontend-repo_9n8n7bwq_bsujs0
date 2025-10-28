import React, { useEffect, useMemo, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

const PHASES = [
  { id: 'Inception', name: 'Inception', min: 0, max: 5, gradient: ['#001d31', '#1a1a2e'], effect: { type: 'particles', density: 25, velocity: 0.2, colour: 'rgba(255,255,255,0.7)' } },
  { id: 'Planning', name: 'Planning', min: 6, max: 20, gradient: ['#001d31', '#16213e'], effect: { type: 'blueprints', density: 20, velocity: 0.25, colour: 'rgba(59,130,246,0.6)' } },
  { id: 'Design', name: 'Design', min: 21, max: 40, gradient: ['#820021', '#c9184a'], effect: { type: 'splash', density: 20, velocity: 0.3, colour: 'rgba(255,255,255,0.5)' } },
  { id: 'Development', name: 'Development', min: 41, max: 70, gradient: ['#002718', '#004d00'], effect: { type: 'matrix', density: 40, velocity: 0.35, colour: 'rgba(34,197,94,0.7)' } },
  { id: 'Testing', name: 'Testing', min: 71, max: 85, gradient: ['#B8860B', '#daa520'], effect: { type: 'waves', density: 18, velocity: 0.2, colour: 'rgba(250,204,21,0.7)' } },
  { id: 'Deployment', name: 'Deployment', min: 86, max: 95, gradient: ['#2F6FED', '#0047AB'], effect: { type: 'launch', density: 30, velocity: 0.6, colour: 'rgba(59,130,246,0.8)' } },
  { id: 'Complete', name: 'Complete', min: 96, max: 100, gradient: ['#7B68EE', '#9370DB'], effect: { type: 'confetti', density: 35, velocity: 0.9, colour: 'rgba(147,112,219,0.8)' } },
];

function determinePhase(pct) {
  return PHASES.find(p => pct >= p.min && pct <= p.max) || PHASES[0];
}

const Hero = ({ medianPercent = 50 }) => {
  const phase = useMemo(() => determinePhase(medianPercent), [medianPercent]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // respect accessibility

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w, h;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const particles = Array.from({ length: phase.effect.density }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * phase.effect.velocity,
      vy: (Math.random() - 0.5) * phase.effect.velocity,
      r: Math.random() * 2 + 0.5,
    }));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.scale(DPR, DPR);
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = phase.effect.colour;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [phase]);

  return (
    <section
      className="relative h-[60vh] w-full overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${phase.gradient[0]} 0%, ${phase.gradient[1]} 100%)`,
        transition: 'background 5s ease',
      }}
    >
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-end px-6 pb-10 text-white md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
          <Rocket size={14} />
          <span>St Paul’s School • Median Phase: {phase.name}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          Ultra‑Advanced Project Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
          Real‑time oversight of nine initiatives with dynamic phase‑responsive theming and analytics.
        </p>
      </div>
    </section>
  );
};

export default Hero;
