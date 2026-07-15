import React from 'react';
import { ArrowLeft, ArrowRight, Trophy, Music2, Film, Pencil } from 'lucide-react';
import { navTo } from './navigate';

const nav = (path: string) => navTo(path);

const CATS = [
  {
    id: 'deporte',
    label: 'DEPORTE',
    sub: 'Fútbol · Básquet · Tenis · MMA',
    path: 'categorias/deporte',
    icon: Trophy,
    bg: 'from-emerald-950 via-emerald-900 to-zinc-900',
    accent: '#10b981',
    deco: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-10">
        <span className="absolute text-[220px] -right-8 -bottom-10 leading-none">⚽</span>
        <span className="absolute text-[100px] left-6 top-4 leading-none rotate-12">🏆</span>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-emerald-400/30" />
        {/* pitch lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-2 border-emerald-400/20" />
          <div className="absolute w-full h-px bg-emerald-400/10" />
        </div>
      </div>
    ),
  },
  {
    id: 'artistas',
    label: 'ARTISTAS',
    sub: 'Urban · Pop · Rock · Reggaetón',
    path: 'categorias/artistas',
    icon: Music2,
    bg: 'from-violet-950 via-fuchsia-950 to-zinc-900',
    accent: '#d946ef',
    deco: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-10">
        <span className="absolute text-[180px] -right-4 -bottom-6 leading-none">🎵</span>
        <span className="absolute text-[90px] left-4 top-6 leading-none -rotate-12">🎸</span>
        <span className="absolute text-[60px] right-16 top-8 leading-none">🎤</span>
        {/* neon line accents */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-fuchsia-400/40 blur-[2px]" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-violet-400/30 blur-[2px]" />
      </div>
    ),
  },
  {
    id: 'peliculas',
    label: 'PELÍCULAS & SERIES',
    sub: 'Acción · Culto · Sci-Fi · Drama',
    path: 'categorias/peliculas',
    icon: Film,
    bg: 'from-zinc-950 via-zinc-900 to-stone-900',
    accent: '#f59e0b',
    deco: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-10">
        <span className="absolute text-[180px] -right-6 -bottom-8 leading-none">🎬</span>
        <span className="absolute text-[80px] left-4 top-4 leading-none">🎞️</span>
        {/* film strip top/bottom */}
        <div className="absolute top-0 left-0 right-0 h-8 flex gap-2 px-2 items-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-4 h-5 border border-amber-400/30 rounded-[2px] shrink-0" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 flex gap-2 px-2 items-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-4 h-5 border border-amber-400/30 rounded-[2px] shrink-0" />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'otro',
    label: '¡ELIGE TU PROPIO DISEÑO!',
    sub: 'Tu diseño · Tu idea · Sin límites',
    path: 'configurador',
    icon: Pencil,
    bg: 'from-zinc-900 via-zinc-800 to-zinc-900',
    accent: '#e5e5e5',
    deco: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-10">
        <span className="absolute text-[160px] -right-4 -bottom-4 leading-none">✏️</span>
        <span className="absolute text-[70px] left-6 top-6 leading-none">📐</span>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>
    ),
  },
];

export default function Categorias() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => nav('')}
          className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          INICIO
        </button>
        <div className="flex items-center gap-3">
          <img src={`${BASE}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-7 w-auto object-contain opacity-90" />
          <span className="font-bold tracking-tighter text-lg">VLCN STUDIO</span>
        </div>
        <span className="hidden md:block font-mono text-xs text-zinc-500">SELECCIONA UNA CATEGORÍA</span>
      </header>

      {/* TITLE STRIP */}
      <div className="px-6 md:px-16 py-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-zinc-500 tracking-widest mb-1">PASO 01 / CATEGORÍA</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">¿QUÉ QUIERES PERSONALIZAR?</h1>
        </div>
        <button
          onClick={() => nav('')}
          className="flex items-center gap-2 border border-white/15 px-5 py-2.5 font-mono text-xs font-bold tracking-wider text-zinc-300 hover:bg-white/10 hover:text-white transition-all w-fit shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          VOLVER AL INICIO
        </button>
      </div>

      {/* 2×2 GRID — fills remaining screen */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 min-h-0">
        {CATS.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => nav(cat.path)}
              className={`group relative flex flex-col justify-end p-8 md:p-12 bg-gradient-to-br ${cat.bg}
                border border-white/5 text-left overflow-hidden
                transition-all duration-300 hover:brightness-110 hover:scale-[1.01] focus:outline-none
                min-h-[240px] sm:min-h-[320px]`}
            >
              {cat.deco}

              {/* icon badge */}
              <div
                className="relative mb-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${cat.accent}22`, border: `1px solid ${cat.accent}44` }}
              >
                <Icon className="w-5 h-5" style={{ color: cat.accent }} />
              </div>

              {/* text */}
              <p className="relative font-mono text-xs tracking-widest mb-2" style={{ color: cat.accent }}>
                {cat.sub}
              </p>
              <h2 className="relative text-2xl md:text-4xl font-bold tracking-tighter leading-none mb-4">
                {cat.label}
              </h2>

              {/* CTA */}
              <div
                className="relative inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider
                  px-4 py-2 w-fit transition-all duration-200 group-hover:gap-3"
                style={{ color: cat.accent }}
              >
                {cat.id === 'otro' ? 'IR AL CONFIGURADOR' : 'VER DISEÑOS'}
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
