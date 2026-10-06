import { useEffect, useMemo, useRef, useState } from "react";
import { content } from "./content";
import { CinemaButton, MemoryCard, PhotoFrame, PhotoReveal, Reveal } from "./ui";

type DoorProps = { onComplete: () => void };

/* DOOR 1 — story scenes */
export function StoryDoor({ onComplete }: DoorProps) {
  const scenes = content.door1.scenes;
  const [i, setI] = useState(0);
  const s = scenes[i]!;
  return (
    <div className="flex flex-col items-center gap-8" key={i}>
      <Reveal className="w-full max-w-xs"><PhotoReveal photo={s.photo} /></Reveal>
      <Reveal delay={900}><p className="font-display text-2xl italic leading-snug text-center">{s.text}</p></Reveal>
      <Reveal delay={1500}>
        <CinemaButton onClick={() => (i < scenes.length - 1 ? setI(i + 1) : onComplete())}>
          {i < scenes.length - 1 ? "Continue" : "Next door"}
        </CinemaButton>
      </Reveal>
    </div>
  );
}

/* DOOR 2 — order puzzle (tap in sequence) */
export function QuizOrderDoor({ onComplete }: DoorProps) {
  const cards = content.door2.cards;
  const shuffled = useMemo(() => [cards[2], cards[0], cards[3], cards[1]].filter((c): c is (typeof cards)[number] => Boolean(c)), [cards]);
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "wrong" | "right">("idle");

  const pick = (id: string) => {
    if (status !== "idle" || picked.includes(id)) return;
    const next = [...picked, id];
    setPicked(next);
    if (next.length === cards.length) {
      const ok = next.every((v, k) => v === cards[k]!.id);
      setStatus(ok ? "right" : "wrong");
      if (!ok) setTimeout(() => { setPicked([]); setStatus("idle"); }, 2200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Reveal><p className="text-center text-muted-foreground">{content.door2.prompt}</p></Reveal>
      <div className="grid w-full grid-cols-2 gap-4">
        {shuffled.map((c) => {
          const pos = picked.indexOf(c.id);
          return (
            <button key={c.id} type="button" onClick={() => pick(c.id)} aria-label={`Select ${c.caption}`}
              className={`order-card ${status === "wrong" ? "shake" : ""}`} data-picked={pos >= 0} data-right={status === "right"}>
              <PhotoFrame photo={c} className="aspect-square w-full" />
              {pos >= 0 && <span className="order-badge">{pos + 1}</span>}
            </button>
          );
        })}
      </div>
      <div className="min-h-16 text-center">
        {status === "wrong" && <p className="reveal font-display text-xl italic">{content.door2.wrong}</p>}
        {status === "right" && (
          <div className="flex flex-col items-center gap-5">
            <p className="reveal font-display text-2xl italic text-primary">{content.door2.success}</p>
            <Reveal delay={600}><CinemaButton onClick={onComplete}>Next door</CinemaButton></Reveal>
          </div>
        )}
      </div>
    </div>
  );
}

/* DOOR 3 — multiple choice */
export function QuizInteraction({ onComplete, onAnswer }: DoorProps & { onAnswer: (k: string, v: number) => void }) {
  const { questions, wrongReactions, rightReactions } = content.door3;
  const [qi, setQi] = useState(0);
  const [reaction, setReaction] = useState<{ text: string; ok: boolean; pick: number } | null>(null);
  const wrongCount = useRef(0);
  const q = questions[qi]!;

  const choose = (k: number) => {
    if (reaction?.ok) return;
    const ok = k === q.answer;
    onAnswer(`q${qi}`, k);
    if (ok) {
      setReaction({ text: rightReactions[qi % rightReactions.length]!, ok, pick: k });
      setTimeout(() => {
        setReaction(null);
        if (qi < questions.length - 1) setQi(qi + 1); else onComplete();
      }, 1600);
    } else {
      setReaction({ text: wrongReactions[wrongCount.current++ % wrongReactions.length]!, ok, pick: k });
    }
  };

  return (
    <div className="flex flex-col gap-6" key={qi}>
      <Reveal><span className="eyebrow">{qi + 1} / {questions.length}</span></Reveal>
      <Reveal delay={200}><h3 className="font-display text-3xl leading-tight">{q.q}</h3></Reveal>
      <div className="flex flex-col gap-3">
        {q.options.map((o, k) => (
          <Reveal key={k} delay={400 + k * 150}>
            <button type="button" onClick={() => choose(k)} className="option-btn"
              data-state={reaction?.pick === k ? (reaction.ok ? "right" : "wrong") : "idle"}>
              {o}
            </button>
          </Reveal>
        ))}
      </div>
      <p className="min-h-8 text-center font-display text-xl italic" aria-live="polite">
        {reaction && <span key={reaction.text + reaction.pick} className={`reveal inline-block ${reaction.ok ? "text-primary" : ""}`}>{reaction.text}</span>}
      </p>
    </div>
  );
}

/* DOOR 4 — find the heart */
const GLYPHS = ["◆", "●", "✦", "▲", "◇", "○", "✧", "■", "◈", "◯", "✶"];
export function TapGame({ onComplete }: DoorProps) {
  const heartIndex = 7;
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState("");
  const [found, setFound] = useState(false);
  const total = 12;

  const tap = (i: number) => {
    if (found) return;
    if (i === heartIndex) {
      setFound(true);
      setMsg(content.door4.success);
      setTimeout(onComplete, 2600);
    } else {
      setMisses((m) => m + 1);
      setMsg(content.door4.wrong[misses % content.door4.wrong.length]!);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 touch-none select-none">
      <Reveal><p className="text-center text-muted-foreground">{content.door4.prompt}</p></Reveal>
      <div className="grid w-full grid-cols-3 gap-4">
        {Array.from({ length: total }).map((_, i) => {
          const isHeart = i === heartIndex;
          return (
            <button key={i} type="button" onClick={() => tap(i)} aria-label={`Object ${i + 1}`}
              className="tap-obj" style={{ animationDelay: `${-i * 0.7}s`, animationDuration: `${5 + (i % 4)}s` }}
              data-heart={isHeart} data-hint={isHeart && misses >= 3} data-found={isHeart && found}>
              <span className="tap-glyph" style={{ animationDelay: `${-i * 1.3}s` }}>
                {isHeart ? "♡" : GLYPHS[i % GLYPHS.length]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="min-h-8 font-display text-xl italic" aria-live="polite">
        {msg && <span key={msg + misses} className={`reveal inline-block ${found ? "text-primary" : ""}`}>{msg}</span>}
      </p>
      {found && <div aria-hidden className="heart-burst">♥</div>}
    </div>
  );
}

/* DOOR 5 — chaos cards */
export function ChaosDoor({ onComplete }: DoorProps) {
  const cards = content.door5.cards;
  const [flipped, setFlipped] = useState<boolean[]>(() => cards.map(() => false));
  const all = flipped.every(Boolean);
  return (
    <div className="flex flex-col items-center gap-6">
      <Reveal><p className="text-center text-muted-foreground">{content.door5.prompt}</p></Reveal>
      <div className="grid w-full grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <Reveal key={i} delay={i * 120} className={i % 2 ? "tilt-r" : "tilt-l"}>
            <MemoryCard front={c.front} back={c.back} flipped={!!flipped[i]} onFlip={() => setFlipped((f) => f.map((v, k) => (k === i ? !v : v)))} />
          </Reveal>
        ))}
      </div>
      <div className="min-h-14">{all && <Reveal><CinemaButton onClick={onComplete}>Okay, enough chaos</CinemaButton></Reveal>}</div>
    </div>
  );
}

/* DOOR 6 — the distance */
export function DistanceDoor({ onComplete }: DoorProps) {
  const stages = content.door6.stages;
  const [s, setS] = useState(0);
  const sep = s === 0 ? 20 : s === 1 ? 80 : s === 2 ? 80 : 0;
  return (
    <button type="button" onClick={() => (s < stages.length - 1 ? setS(s + 1) : onComplete())}
      aria-label={s < stages.length - 1 ? "Continue" : "Next door"}
      className="flex min-h-[70dvh] w-full flex-col items-center justify-center gap-12" data-stage={s}>
      <div className="distance-stage" style={{ ["--sep" as string]: `${sep}%` }} data-stage={s}>
        <span className="distance-line" />
        <span className="orb orb-me" />
        <span className="orb orb-you" data-lit={s >= 2} />
        {s === 3 && <span className="orb-us" />}
      </div>
      <div key={s} className="flex flex-col items-center gap-4 text-center">
        <span className="reveal font-display text-5xl tracking-[0.2em]">{stages[s]!.label}</span>
        <span className="reveal max-w-xs text-muted-foreground" style={{ animationDelay: "600ms" }}>{stages[s]!.text}</span>
      </div>
      <span className="text-xs tracking-[0.3em] text-muted-foreground">{s < 3 ? "TAP" : "TAP TO CONTINUE"}</span>
    </button>
  );
}

/* DOOR 7 — song */
export function FinalSongDoor({ onComplete }: DoorProps) {
  const d = content.door7;
  const [step, setStep] = useState(0); // 0 teaser, 1..lines, then player
  const playerStep = d.lines.length + 1;
  const [songProgress, setSongProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [songFinished, setSongFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!playing || d.finalSong) return;
    const start = Date.now() - songProgress * d.placeholderDurationSec * 1000;
    const t = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / (d.placeholderDurationSec * 1000));
      setSongProgress(p);
      if (p >= 1) { clearInterval(t); setPlaying(false); setSongFinished(true); }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const playFinalSong = () => {
    if (d.finalSong && audioRef.current) {
      if (playing) audioRef.current.pause(); else void audioRef.current.play();
    }
    setPlaying((p) => !p);
  };

  if (step < playerStep) {
    return (
      <button type="button" onClick={() => setStep(step + 1)} aria-label="Continue" className="flex min-h-[75dvh] w-full flex-col items-center justify-center gap-6 text-center">
        <span key={step} className="reveal-slow font-display text-4xl italic leading-snug">
          {step === 0 ? d.teaser : d.lines[step - 1]}
        </span>
        <span className="text-xs tracking-[0.3em] text-muted-foreground">TAP</span>
      </button>
    );
  }

  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center gap-10 text-center">
      {d.finalSong && (
        <audio ref={audioRef} src={d.finalSong} preload="metadata"
          onTimeUpdate={(e) => setSongProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
          onEnded={() => { setPlaying(false); setSongFinished(true); }} />
      )}
      {!songFinished ? (
        <>
          <Reveal><p className="font-display text-3xl italic">{d.pressPlay}</p></Reveal>
          <Reveal delay={500}>
            <button type="button" onClick={playFinalSong} aria-label={playing ? "Pause song" : "Play song"} className="play-btn" data-playing={playing}>
              <span className="text-3xl">{playing ? "❚❚" : "▶"}</span>
            </button>
          </Reveal>
          <div className="h-px w-56 bg-border" aria-hidden>
            <div className="h-px bg-primary transition-[width] duration-200" style={{ width: `${songProgress * 100}%` }} />
          </div>
          {!d.finalSong && <p className="text-xs text-muted-foreground">[Placeholder playback — song not added yet]</p>}
        </>
      ) : (
        <Reveal><CinemaButton onClick={onComplete}>Open it</CinemaButton></Reveal>
      )}
    </div>
  );
}
