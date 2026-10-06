import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type GameState = {
  gameStarted: boolean;
  currentDoor: number; // 0..6
  completedDoors: number[];
  gameComplete: boolean;
  answers: Record<string, number>;
  puzzleProgress: Record<string, unknown>;
  finalRevealUnlocked: boolean;
};

const initial: GameState = {
  gameStarted: false,
  currentDoor: 0,
  completedDoors: [],
  gameComplete: false,
  answers: {},
  puzzleProgress: {},
  finalRevealUnlocked: false,
};

const KEY = "seven-doors-progress";

type Ctx = GameState & {
  transitioning: boolean;
  startGame: () => void;
  completeDoor: (i: number) => void;
  goToDoor: (i: number) => void;
  restartGame: () => void;
  setAnswer: (k: string, v: number) => void;
  unlockFinalReveal: () => void;
};

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initial);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const withTransition = useCallback((fn: () => void) => {
    setTransitioning(true);
    setTimeout(() => {
      fn();
      window.scrollTo(0, 0);
      setTimeout(() => setTransitioning(false), 120);
    }, 900);
  }, []);

  const startGame = useCallback(() => withTransition(() => setState((s) => ({ ...s, gameStarted: true, currentDoor: 0 }))), [withTransition]);
  const goToDoor = useCallback((i: number) => withTransition(() => setState((s) => ({ ...s, currentDoor: i }))), [withTransition]);
  const completeDoor = useCallback(
    (i: number) =>
      withTransition(() =>
        setState((s) => {
          const completedDoors = Array.from(new Set([...s.completedDoors, i]));
          if (i >= 6) return { ...s, completedDoors, finalRevealUnlocked: true };
          return { ...s, completedDoors, currentDoor: i + 1 };
        }),
      ),
    [withTransition],
  );
  const unlockFinalReveal = useCallback(() => setState((s) => ({ ...s, gameComplete: true })), []);
  const restartGame = useCallback(() => withTransition(() => setState(initial)), [withTransition]);
  const setAnswer = useCallback((k: string, v: number) => setState((s) => ({ ...s, answers: { ...s.answers, [k]: v } })), []);

  return (
    <GameCtx.Provider value={{ ...state, transitioning, startGame, completeDoor, goToDoor, restartGame, setAnswer, unlockFinalReveal }}>
      {children}
    </GameCtx.Provider>
  );
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("useGame outside GameProvider");
  return c;
}
