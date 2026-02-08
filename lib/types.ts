export type Difficulty = "yellow" | "green" | "blue" | "purple";

export interface Group {
  category: string;
  words: string[];
  difficulty: Difficulty;
}

export interface Puzzle {
  id: string;
  title: string;
  groups: Group[];
}

export interface GameState {
  puzzle: Puzzle;
  selectedWords: string[];
  solvedGroups: Group[];
  remainingWords: string[];
  mistakesRemaining: number;
  gameOver: boolean;
  gameWon: boolean;
  message: string | null;
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  yellow: "#f9df6d",
  green: "#a0c35a",
  blue: "#b0c4ef",
  purple: "#ba81c5",
};

export const DIFFICULTY_ORDER: Difficulty[] = [
  "yellow",
  "green",
  "blue",
  "purple",
];

export const MAX_MISTAKES = 4;
export const GROUP_SIZE = 4;
