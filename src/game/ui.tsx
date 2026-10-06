import { useEffect, useState, type ReactNode } from "react";
import type { Photo } from "./content";
import { content } from "./content";
import { useGame } from "./state";

export function Particles({ count = 22 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37) % 100;
        const size = 1 + ((i * 7) % 3);
        const dur = 14 + ((i * 5) % 12);
        const delay = -((i * 3.3) % dur);
        return (
          <span
            key={i}
            className="particle"
            style={{ left: `${left}%`, width: size, height: size, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function CinemaButton({ children, onClick, label, variant = "solid", disabled }: { children: ReactNode; onClick?: () => void; label?: string; variant?: "solid" | "ghost"; disabled?: boolean }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className={variant === "solid" ? "btn-cinema" : "btn-ghost"}>
      {children}
    </button>
  );
}

export function PhotoFrame({ photo, className = "" }: { photo: Photo; className?: string }) {
  return (
    <figure className={`photo-frame ${className}`}>
      {photo.src ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4 text-center">
          <span className="font-display text-lg italic text-muted-foreground">{photo.caption}</span>
        </div>
      )}
    </figure>
  );
}

export function PhotoReveal({ photo }: { photo: Photo }) {
  return <PhotoFrame photo={photo} className="photo-reveal aspect-[4/5] w-full" />;
}

export function MemoryCard({ front, back, flipped, onFlip }: { front: string; back: string; flipped: boolean; onFlip: () => void }) {
  return (
    <button type="button" onClick={onFlip} aria-label={flipped ? back : `Reveal card ${front}`} className="flip-card aspect-[3/4] w-full" data-flipped={flipped}>
      <span className="flip-inner">
        <span className="flip-face flip-front font-display text-3xl">{front}</span>
        <span className="flip-face flip-back text-sm leading-relaxed">{back}</span>
      </span>
    </button>
  );
}

export function ProgressIndicator() {
  const { currentDoor, completedDoors } = useGame();
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Door ${currentDoor + 1} of 7`}>
      {content.doors.map((_, i) => (
        <span key={i} className="progress-dot" data-state={completedDoors.includes(i) ? "done" : i === currentDoor ? "current" : "todo"} />
      ))}
    </div>
  );
}

export function DoorTransition() {
  const { transitioning } = useGame();
  return <div aria-hidden className="door-transition" data-active={transitioning} />;
}

export function DoorIntro({ index, onOpen }: { index: number; onOpen: () => void }) {
  const d = content.doors[index]!;
  return (
    <button type="button" onClick={onOpen} aria-label={`Open door ${d.number}`} className="flex min-h-[80dvh] w-full flex-col items-center justify-center gap-8 text-center">
      <Reveal><span className="eyebrow">DOOR {d.number}</span></Reveal>
      <Reveal delay={400}>
        <div className="door-arch"><span className="door-light" /></div>
      </Reveal>
      <Reveal delay={900}><h2 className="font-display text-4xl tracking-wide">{d.subtitle}</h2></Reveal>
      <Reveal delay={1500}><span className="text-xs tracking-[0.3em] text-muted-foreground">TAP TO OPEN</span></Reveal>
    </button>
  );
}

export function useStep(max: number) {
  const [step, setStep] = useState(0);
  return { step, next: () => setStep((s) => Math.min(s + 1, max)), set: setStep };
}

export function useTimeout(fn: () => void, ms: number, deps: unknown[]) {
  useEffect(() => {
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
