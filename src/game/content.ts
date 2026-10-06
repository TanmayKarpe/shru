// ============================================================
// 7 DOORS — FOR SHRU ♡
// All personal relationship content lives here.
// Media files live in /public/media.
// ============================================================

export type Photo = {
  src?: string;
  caption: string;
  alt: string;
};

const photo = (
  file: string,
  caption: string,
  alt: string,
): Photo => ({
  src: `/media/photos/${file}`,
  caption,
  alt,
});

export const content = {
  opening: {
    title: "FOR SHRU ♡",
    lines: [
      "A little world I made for you.",
      "7 doors.\n7 little pieces of us.",
    ],
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

  // ==========================================================
  // DOOR 1 — HOW IT STARTED
  // ==========================================================

  door1: {
    scenes: [
      {
        photo: photo(
          "firsthangout.jpeg",
          "The first hangout.",
          "Our first hangout",
        ),
        text: "You know what still gets me? How naturally we started becoming us.",
      },
      {
        photo: photo(
          "handholld.jpeg",
          "That little moment.",
          "Us holding hands",
        ),
        text: "I put my hand on your shoulder. You pulled it down... and held my hand instead.",
      },
      {
        photo: photo(
          "cute us.jpeg",
          "And somehow, here we are.",
          "Us together",
        ),
        text: "I remember thinking, wow... we really vibe.",
      },
    ] as { photo: Photo; text: string }[],
  },

  // ==========================================================
  // DOOR 2 — THE MEMORY
  // ==========================================================

  door2: {
    prompt: "Put these moments in the order they happened.",

    // Correct chronological order.
    cards: [
      {
        id: "a",
        ...photo(
          "firsthangout.jpeg",
          "The first hangout.",
          "Our first hangout",
        ),
      },
      {
        id: "b",
        ...photo(
          "handholld.jpeg",
          "The hand-holding moment.",
          "Us holding hands",
        ),
      },
      {
        id: "c",
        ...photo(
          "first kiss.jpeg",
          "The first fucking kiss.",
          "Our first kiss",
        ),
      },
      {
        id: "d",
        ...photo(
          "uskissing.jpeg",
          "And then there was campus.",
          "Us kissing",
        ),
      },
    ] as (Photo & { id: string })[],

    wrong: "Close. Time is a little blurry sometimes. Try again?",
    success: "Exactly how it happened.",
  },

  // ==========================================================
  // DOOR 3 — DO YOU KNOW ME?
  // ==========================================================

  door3: {
    questions: [
      {
        q: "What food would I probably choose without thinking twice?",
        options: ["Pizza", "Biryani", "Pasta"],
        answer: 1,
      },
      {
        q: "Which stupid little word somehow became ours?",
        options: ["HAO", "Okay", "Fine"],
        answer: 0,
      },
      {
        q: "Which song belongs in our little universe?",
        options: [
          "Meri Banogi Kya",
          "Until I Found You",
          "Perfect",
        ],
        answer: 0,
      },
    ],

    wrongReactions: [
      "Excuse me?? Try again.",
      "Wow. Okay. I'll pretend I didn't see that.",
      "That's rude. Correct it immediately.",
      "Hmm. Suspicious. Again.",
    ],

    rightReactions: [
      "Obviously.",
      "Correct. Of course.",
      "See? You know me.",
    ],
  },

  // ==========================================================
  // DOOR 4 — FIND THE HEART
  // ==========================================================

  door4: {
    prompt: "Somewhere in here is a heart. Find it.",

    wrong: [
      "Not this one.",
      "Nope.",
      "Colder…",
      "Look closer.",
    ],

    success: "Found it. You always do.",
  },

  // ==========================================================
  // DOOR 5 — OUR CHAOS
  // ==========================================================

  door5: {
    prompt: "Tap each card. No context will be provided.",

    cards: [
      {
        front: "#1",
        back: "HAO.",
      },
      {
        front: "#2",
        back: "You laughing at my stupidness.",
      },
      {
        front: "#3",
        back: "Me ragebaiting you and immediately regretting it.",
      },
      {
        front: "#4",
        back: "Our world-class mimicry sessions.",
      },
      {
        front: "#5",
        back: "Bokhya.",
      },
      {
        front: "#6",
        back: "Two babies when things go left. Somehow one becomes the parent and the other becomes the baby.",
      },
    ] as { front: string; back: string; image?: string }[],
  },

  // ==========================================================
  // DOOR 6 — THE DISTANCE
  // ==========================================================

  door6: {
    stages: [
      {
        label: "ME",
        text: "Somewhere missing you a little more than I say.",
      },
      {
        label: "DISTANCE",
        text: "Some days I really hate the space between us.",
      },
      {
        label: "YOU",
        text: "Because your voice still somehow makes everything feel a little closer.",
      },
      {
        label: "US",
        text: "And no distance has changed the fact that I choose you.",
      },
    ],
  },

  // ==========================================================
  // DOOR 7 — DON'T OPEN YET
  // ==========================================================

  door7: {
    teaser: "Don't open yet.",

    lines: [
      "Okay, Shru.",
      "This isn't really a game anymore.",
    ],

    pressPlay: "Press play.",

    finalSong: "/media/final/mysong.mp3",

    placeholderDurationSec: 40,
  },

  // ==========================================================
  // FINAL
  // ==========================================================

  final: {
    montage: [
      photo(
        "cuteus.jpeg",
        "Us.",
        "Us together",
      ),
      photo(
        "shruta.jpeg",
        "My favourite person.",
        "Shruta",
      ),
      photo(
        "usincanteen.jpeg",
        "Campus memories.",
        "Us in the canteen",
      ),
      photo(
        "kids.jpeg",
        "The little future I imagine.",
        "A future family",
      ),
    ] as Photo[],

    message:
      "I'm sorry that me pulling up both our past hurt you. Big sorry for that. I never wanted my words to become something that hurt the person I love.",

    future:
      "Sometimes I imagine a completely random morning. You, me, and little Shruta between us. Sleepy faces, messy hair, an alarm going off, sunlight everywhere. Nothing perfect. Just us, together.",

    complete: "GAME COMPLETE",
    count: "7 / 7 DOORS OPENED",
    except: "Except ours.",
    ending: "That story doesn't have an ending. ♡",
    replay: "Play again",
  },
};