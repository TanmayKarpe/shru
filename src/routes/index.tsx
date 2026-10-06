import { createFileRoute } from "@tanstack/react-router";
import { GameProvider, useGame } from "@/game/state";
import { DoorContainer, FinalReveal, GameComplete, OpeningScreen } from "@/game/screens";
import { DoorTransition, Particles } from "@/game/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "7 Doors — For Shruti ♡" },
      { name: "description", content: "A little world made for Shruti. Seven doors, seven little pieces of us." },
      { property: "og:title", content: "7 Doors — For Shruti ♡" },
      { property: "og:description", content: "A little world made for Shruti. Seven doors, seven little pieces of us." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Game() {
  const { gameStarted, finalRevealUnlocked, gameComplete } = useGame();
  let screen = <OpeningScreen />;
  if (gameComplete) screen = <GameComplete />;
  else if (finalRevealUnlocked) screen = <FinalReveal />;
  else if (gameStarted) screen = <DoorContainer />;
  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden vignette">
      <Particles />
      <div className="relative z-10">{screen}</div>
      <DoorTransition />
    </main>
  );
}

function Index() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
