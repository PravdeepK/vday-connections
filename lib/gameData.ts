import { Puzzle } from "./types";

export const valentinesPuzzle: Puzzle = {
  id: "vday-2026",
  title: "Valentine's Day Edition",
  groups: [
    {
      category: "TERMS OF ENDEARMENT",
      words: ["HONEY", "SWEETHEART", "DARLING", "ANGEL"],
      difficulty: "yellow",
    },
    {
      category: "THINGS THAT ARE RED",
      words: ["ROSE", "CARDINAL", "FIRETRUCK", "MARS"],
      difficulty: "green",
    },
    {
      category: "___ HEART",
      words: ["BRAVE", "SWEET", "BROKEN", "SACRED"],
      difficulty: "blue",
    },
    {
      category: "ROMANTIC MOVIE TITLES",
      words: ["GHOST", "TITANIC", "NOTEBOOK", "CASABLANCA"],
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
