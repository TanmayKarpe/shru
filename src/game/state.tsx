import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

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

  // ==========================================================
  // BACKGROUND MUSIC
  // ==========================================================

  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const startBackgroundMusic = useCallback(() => {
    if (!backgroundAudioRef.current) {
      const audio = new Audio("/media/music/backgroundmusic.mp3");

      audio.loop = true;
      audio.volume = 0.22;
      audio.preload = "auto";

      backgroundAudioRef.current = audio;
    }

    const audio = backgroundAudioRef.current;

    // If the music was previously faded/stopped, restore it.
    audio.volume = 0.22;

    void audio.play().catch(() => {
      // Browser blocked playback. This is safe because the
      // game was already started by a user interaction.
    });
  }, []);

  const fadeOutBackgroundMusic = useCallback(() => {
    const audio = backgroundAudioRef.current;

    if (!audio) return;

    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const startingVolume = audio.volume;
    const fadeDuration = 1800;
    const stepTime = 60;
    const volumeStep = startingVolume / (fadeDuration / stepTime);

    fadeIntervalRef.current = window.setInterval(() => {
      const nextVolume = Math.max(0, audio.volume - volumeStep);

      audio.volume = nextVolume;

      if (nextVolume <= 0) {
        audio.pause();
        audio.currentTime = 0;

        if (fadeIntervalRef.current !== null) {
          window.clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }
    }, stepTime);
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    const audio = backgroundAudioRef.current;

    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.22;
    }
  }, []);

  // ==========================================================
  // LOAD SAVED SESSION
  // ==========================================================

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);

      if (raw) {
        setState({ ...initial, ...JSON.parse(raw) });
      }
    } catch {}
  }, []);

  // ==========================================================
  // SAVE SESSION
  // ==========================================================

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // ==========================================================
  // FADE MUSIC WHEN DOOR 7 BEGINS
  // ==========================================================

  useEffect(() => {
    if (state.gameStarted && state.currentDoor === 6) {
      fadeOutBackgroundMusic();
    }
  }, [state.gameStarted, state.currentDoor, fadeOutBackgroundMusic]);

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
      }

      backgroundAudioRef.current?.pause();
    };
  }, []);

  // ==========================================================
  // SCREEN TRANSITIONS
  // ==========================================================

  const withTransition = useCallback((fn: () => void) => {
    setTransitioning(true);

    setTimeout(() => {
      fn();
      window.scrollTo(0, 0);

      setTimeout(() => {
        setTransitioning(false);
      }, 120);
    }, 900);
  }, []);

  // ==========================================================
  // START GAME
  // ==========================================================

  const startGame = useCallback(() => {
    // IMPORTANT:
    // This happens directly from the ENTER button interaction,
    // allowing mobile browsers to permit audio playback.

    startBackgroundMusic();

    withTransition(() =>
      setState((s) => ({
        ...s,
        gameStarted: true,
        currentDoor: 0,
      })),
    );
  }, [startBackgroundMusic, withTransition]);

  // ==========================================================
  // GO TO DOOR
  // ==========================================================

  const goToDoor = useCallback(
    (i: number) =>
      withTransition(() =>
        setState((s) => ({
          ...s,
          currentDoor: i,
        })),
      ),
    [withTransition],
  );

  // ==========================================================
  // COMPLETE DOOR
  // ==========================================================

  const completeDoor = useCallback(
    (i: number) =>
      withTransition(() =>
        setState((s) => {
          const completedDoors = Array.from(
            new Set([...s.completedDoors, i]),
          );

          // Door 7 completed.
          if (i >= 6) {
            return {
              ...s,
              completedDoors,
              finalRevealUnlocked: true,
            };
          }

          return {
            ...s,
            completedDoors,
            currentDoor: i + 1,
          };
        }),
      ),
    [withTransition],
  );

  // ==========================================================
  // FINAL REVEAL
  // ==========================================================

  const unlockFinalReveal = useCallback(() => {
    setState((s) => ({
      ...s,
      gameComplete: true,
    }));
  }, []);

  // ==========================================================
  // RESTART
  // ==========================================================

  const restartGame = useCallback(() => {
    stopBackgroundMusic();

    withTransition(() =>
      setState(initial),
    );
  }, [stopBackgroundMusic, withTransition]);

  // ==========================================================
  // QUIZ ANSWERS
  // ==========================================================

  const setAnswer = useCallback(
    (k: string, v: number) =>
      setState((s) => ({
        ...s,
        answers: {
          ...s.answers,
          [k]: v,
        },
      })),
    [],
  );

  return (
    <GameCtx.Provider
      value={{
        ...state,
        transitioning,
        startGame,
        completeDoor,
        goToDoor,
        restartGame,
        setAnswer,
        unlockFinalReveal,
      }}
    >
      {children}
    </GameCtx.Provider>
  );
}

export function useGame() {
  const c = useContext(GameCtx);

  if (!c) {
    throw new Error("useGame outside GameProvider");
  }

  return c;
}