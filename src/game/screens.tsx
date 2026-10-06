import { useState } from "react";
import { content } from "./content";
import { useGame } from "./state";
import { ChaosDoor, DistanceDoor, FinalSongDoor, QuizInteraction, QuizOrderDoor, StoryDoor, TapGame } from "./doors";
import { CinemaButton, DoorIntro, PhotoFrame, ProgressIndicator, Reveal } from "./ui";

export function OpeningScreen() {
  const { startGame } = useGame();
  const o = content.opening;
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center gap-10 px-6 text-center">
      <Reveal delay={300}><h1 className="font-display text-6xl tracking-[0.08em] glow-text">{o.title}</h1></Reveal>
      <Reveal delay={2200}><p className="font-display text-2xl italic text-muted-foreground">{o.lines[0]}</p></Reveal>
      <Reveal delay={4200}><p className="whitespace-pre-line text-sm tracking-[0.3em] text-foreground/80">{o.lines[1]!.toUpperCase()}</p></Reveal>
      <Reveal delay={6000}><CinemaButton onClick={startGame} label="Enter the game">{o.cta}</CinemaButton></Reveal>
    </section>
  );
}

export function DoorContainer() {
  const { currentDoor, completeDoor, setAnswer, restartGame } = useGame();
  const [opened, setOpened] = useState<number | null>(null);
  const isOpen = opened === currentDoor;
  const done = () => completeDoor(currentDoor);
  const d = content.doors[currentDoor]!;

  const body = (() => {
    switch (d.kind) {
      case "story": return <StoryDoor onComplete={done} />;
      case "order": return <QuizOrderDoor onComplete={done} />;
      case "quiz": return <QuizInteraction onComplete={done} onAnswer={setAnswer} />;
      case "tap": return <TapGame onComplete={done} />;
      case "chaos": return <ChaosDoor onComplete={done} />;
      case "distance": return <DistanceDoor onComplete={done} />;
      case "final": return <FinalSongDoor onComplete={done} />;
    }
  })();

  return (
    <section className={`door-theme-${currentDoor + 1} flex min-h-[100dvh] flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]`}>
      <header className="flex items-center justify-between">
        <span className="eyebrow">{d.number}</span>
        <ProgressIndicator />
        <button type="button" onClick={restartGame} aria-label="Restart from the beginning" className="eyebrow p-2">↺</button>
      </header>
      <div key={currentDoor} className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
        {isOpen ? (
          <>
            <Reveal className="mb-8 text-center"><span className="eyebrow">{d.subtitle}</span></Reveal>
            {body}
          </>
        ) : (
          <DoorIntro index={currentDoor} onOpen={() => setOpened(currentDoor)} />
        )}
      </div>
    </section>
  );
}

export function FinalReveal() {
  const { unlockFinalReveal } = useGame();
  const f = content.final;
  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div className="grid w-full grid-cols-2 gap-3">
        {f.montage.map((p, i) => (
          <Reveal key={i} delay={i * 700} className={i % 2 ? "tilt-r" : "tilt-l"}>
            <PhotoFrame photo={p} className="aspect-[4/5] w-full" />
          </Reveal>
        ))}
      </div>
      <Reveal delay={3200}><p className="font-display text-2xl italic leading-snug">{f.message}</p></Reveal>
      <Reveal delay={4800}><p className="text-muted-foreground">{f.future}</p></Reveal>
      <Reveal delay={6000}><CinemaButton onClick={unlockFinalReveal}>Continue</CinemaButton></Reveal>
    </section>
  );
}

export function GameComplete() {
  const { restartGame } = useGame();
  const f = content.final;
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Reveal delay={300}><p className="eyebrow">{f.complete}</p></Reveal>
      <Reveal delay={1500}><p className="font-display text-4xl tracking-[0.1em]">{f.count}</p></Reveal>
      <Reveal delay={3500}><p className="font-display text-3xl italic text-primary">{f.except}</p></Reveal>
      <Reveal delay={5500}><p className="max-w-xs font-display text-2xl leading-snug glow-text">{f.ending}</p></Reveal>
      <Reveal delay={7500} className="mt-8"><CinemaButton variant="ghost" onClick={restartGame}>{f.replay}</CinemaButton></Reveal>
    </section>
  );
}
