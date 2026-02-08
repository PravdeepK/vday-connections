import { Puzzle } from "./types";

export const valentinesPuzzle: Puzzle = {
  id: "vday-2026",
  title: "Valentine's Day Edition",
  groups: [
    {
      category: "THINGS THAT MAKE YOU HAPPY",
      words: ["PEACH BELLINI", "DIET COKE", "SUSHI", "REESE'S"],
      difficulty: "yellow",
    },
    {
      category: "WHY I LOVE YOU",
      words: ["ALIKE", "HOME", "SMART", "PATIENT"],
      difficulty: "green",
    },
    {
      category: "PET NAMES",
      words: ["BRO", "RIO", "MABI", "MANI"],
      difficulty: "blue",
    },
    {
      category: "HAPPY VALENTINE'S DAY",
      words: ["WILL", "YOU", "BE", "MINE"],
      difficulty: "purple",
    },
  ],
};

/** Shuffle an array using Fisher-Yates */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Get all words from a puzzle, shuffled */
export function getShuffledWords(puzzle: Puzzle): string[] {
  const allWords = puzzle.groups.flatMap((group) => group.words);
  return shuffleArray(allWords);
}
