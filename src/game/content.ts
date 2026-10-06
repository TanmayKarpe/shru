// All personal content lives here. Replace placeholders without touching components.
// Photos: set `src` to an image URL/import. Empty src renders an elegant placeholder frame.

export type Photo = { src?: string; caption: string; alt: string };

export const content = {
  opening: {
    title: "FOR SHRU ♡",
    lines: ["A little world I made for you.", "7 doors.\n7 little pieces of us."],
    cta: "ENTER",
  },

  doors: [
    { number: "01", subtitle: "HOW IT STARTED", kind: "story" },
    { number: "02", subtitle: "THE MEMORY", kind: "order" },
    { number: "03", subtitle: "DO YOU KNOW ME?", kind: "quiz" },
    { number: "04", subtitle: "FIND THE HEART", kind: "tap" },
    { number: "05", subtitle: "OUR CHAOS", kind: "chaos" },
    { number: "06", subtitle: "THE DISTANCE", kind: "distance" },
    { number: "07", subtitle: "DON'T OPEN YET", kind: "final" },
  ] as const,

  door1: {
    scenes: [
      { photo: { caption: "[Placeholder — first photo]", alt: "Placeholder photo 1" }, text: "[Placeholder — a line about how it started]" },
      { photo: { caption: "[Placeholder — second photo]", alt: "Placeholder photo 2" }, text: "[Placeholder — what happened next]" },
      { photo: { caption: "[Placeholder — third photo]", alt: "Placeholder photo 3" }, text: "[Placeholder — the moment it clicked]" },
    ] as { photo: Photo; text: string }[],
  },

  door2: {
    prompt: "Put these moments in the order they happened.",
    // Listed in the CORRECT order. They are shuffled on screen.
    cards: [
      { id: "a", caption: "[Memory A]", alt: "Placeholder memory A" },
      { id: "b", caption: "[Memory B]", alt: "Placeholder memory B" },
      { id: "c", caption: "[Memory C]", alt: "Placeholder memory C" },
      { id: "d", caption: "[Memory D]", alt: "Placeholder memory D" },
    ] as (Photo & { id: string })[],
    wrong: "Close. Time is a little blurry sometimes. Try again?",
    success: "Exactly how it happened.",
  },

  door3: {
    questions: [
      { q: "[Placeholder question 1]", options: ["[Option A]", "[Option B]", "[Option C]"], answer: 0 },
      { q: "[Placeholder question 2]", options: ["[Option A]", "[Option B]", "[Option C]"], answer: 1 },
      { q: "[Placeholder question 3]", options: ["[Option A]", "[Option B]", "[Option C]"], answer: 2 },
    ],
    wrongReactions: [
      "Excuse me?? Try again.",
      "Wow. Okay. I'll pretend I didn't see that.",
      "That's rude. Correct it immediately.",
      "Hmm. Suspicious. Again.",
    ],
    rightReactions: ["Obviously.", "Correct. Of course.", "See? You know me."],
  },

  door4: {
    prompt: "Somewhere in here is a heart. Find it.",
    wrong: ["Not this one.", "Nope.", "Colder…", "Look closer."],
    success: "Found it. (You always do.)",
  },

  door5: {
    prompt: "Tap each card. No context will be provided.",
    cards: [
      { front: "#1", back: "[Placeholder — inside joke]" },
      { front: "#2", back: "[Placeholder — funny memory]" },
      { front: "#3", back: "[Placeholder — screenshot or silly reference]" },
      { front: "#4", back: "[Placeholder — mimicry joke]" },
      { front: "#5", back: "[Placeholder — small surprise]" },
      { front: "#6", back: "[Placeholder — one more]" },
    ] as { front: string; back: string; image?: string }[],
  },

  door6: {
    stages: [
      { label: "ME", text: "[Placeholder — where I am]" },
      { label: "DISTANCE", text: "[Placeholder — the space between]" },
      { label: "YOU", text: "[Placeholder — where you are]" },
      { label: "US", text: "[Placeholder — what that distance never changed]" },
    ],
  },

  door7: {
    teaser: "Don't open yet.",
    lines: ["Okay, Shru.", "This isn't really a game anymore."],
    pressPlay: "Press play.",
    // Set to an audio URL (e.g. "/audio/song.mp3"). Empty = simulated placeholder playback.
    finalSong: "",
    placeholderDurationSec: 12,
  },

  final: {
    montage: [
      { caption: "[Photo]", alt: "Placeholder montage 1" },
      { caption: "[Photo]", alt: "Placeholder montage 2" },
      { caption: "[Photo]", alt: "Placeholder montage 3" },
      { caption: "[Photo]", alt: "Placeholder montage 4" },
    ] as Photo[],
    message: "[Placeholder — your final message to Shruti]",
    future: "[Placeholder — something about the future]",
    complete: "GAME COMPLETE",
    count: "7 / 7 DOORS OPENED",
    except: "Except ours.",
    ending: "That story doesn't have an ending. ♡",
    replay: "Play again",
  },
};
