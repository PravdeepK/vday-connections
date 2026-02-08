"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Puzzle, Group, GROUP_SIZE, MAX_MISTAKES } from "@/lib/types";
import { getShuffledWords, shuffleArray } from "@/lib/gameData";
import WordTile from "./WordTile";
import SolvedGroup from "./SolvedGroup";
import MistakeDots from "./MistakeDots";

interface GameProps {
  puzzle: Puzzle;
}

export default function Game({ puzzle }: GameProps) {
  const [remainingWords, setRemainingWords] = useState<string[]>(() =>
    getShuffledWords(puzzle)
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<Group[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(MAX_MISTAKES);
  const [message, setMessage] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [guessedCombos, setGuessedCombos] = useState<Set<string>>(new Set());

  // Show a temporary message
  const showMessage = useCallback((msg: string, duration = 1500) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  // Toggle word selection
  const handleWordClick = useCallback(
    (word: string) => {
      if (gameOver) return;

      setSelectedWords((prev) => {
        if (prev.includes(word)) {
          return prev.filter((w) => w !== word);
        }
        if (prev.length >= GROUP_SIZE) {
          return prev;
        }
        return [...prev, word];
      });
    },
    [gameOver]
  );

  // Submit a guess
  const handleSubmit = useCallback(() => {
    if (selectedWords.length !== GROUP_SIZE || gameOver) return;

    // Check if this combination was already guessed
    const comboKey = [...selectedWords].sort().join(",");
    if (guessedCombos.has(comboKey)) {
      showMessage("Already guessed!");
      return;
    }
    setGuessedCombos((prev) => new Set(prev).add(comboKey));

    // Find if selected words match any unsolved group
    const matchedGroup = puzzle.groups.find(
      (group) =>
        !solvedGroups.includes(group) &&
        selectedWords.every((word) => group.words.includes(word))
    );

    if (matchedGroup) {
      // Correct guess!
      const newSolvedGroups = [...solvedGroups, matchedGroup];
      setSolvedGroups(newSolvedGroups);
      setRemainingWords((prev) =>
        prev.filter((w) => !matchedGroup.words.includes(w))
      );
      setSelectedWords([]);

      // Check if all groups are solved
      if (newSolvedGroups.length === puzzle.groups.length) {
        setGameWon(true);
        setGameOver(true);
      }
    } else {
      // Wrong guess
      // Check if one away
      const closeGroup = puzzle.groups.find(
        (group) =>
          !solvedGroups.includes(group) &&
          selectedWords.filter((word) => group.words.includes(word)).length ===
            GROUP_SIZE - 1
      );

      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      if (closeGroup) {
        showMessage("One away...");
      }

      const newMistakes = mistakesRemaining - 1;
      setMistakesRemaining(newMistakes);
      setSelectedWords([]);

      if (newMistakes <= 0) {
        // Game over — reveal all remaining groups
        setGameOver(true);
        setGameWon(false);

        // Reveal remaining groups with a stagger
        const unsolvedGroups = puzzle.groups.filter(
          (g) => !solvedGroups.includes(g)
        );

        unsolvedGroups.forEach((group, index) => {
          setTimeout(() => {
            setSolvedGroups((prev) => [...prev, group]);
            setRemainingWords((prev) =>
              prev.filter((w) => !group.words.includes(w))
            );
          }, (index + 1) * 400);
        });
      }
    }
  }, [
    selectedWords,
    gameOver,
    puzzle.groups,
    solvedGroups,
    mistakesRemaining,
    guessedCombos,
    showMessage,
  ]);

  // Deselect all
  const handleDeselectAll = useCallback(() => {
    setSelectedWords([]);
  }, []);

  // Shuffle remaining words
  const handleShuffle = useCallback(() => {
    setRemainingWords((prev) => shuffleArray(prev));
  }, []);

  // Restart game
  const handleRestart = useCallback(() => {
    setRemainingWords(getShuffledWords(puzzle));
    setSelectedWords([]);
    setSolvedGroups([]);
    setMistakesRemaining(MAX_MISTAKES);
    setMessage(null);
    setGameOver(false);
    setGameWon(false);
    setGuessedCombos(new Set());
  }, [puzzle]);

  // Grid columns based on remaining words
  const gridCols =
    remainingWords.length > 0
      ? `grid-cols-4`
      : "";

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Connections
        </h1>
        <p className="text-[#5a594e] text-sm mt-1">
          Group the 16 words into 4 categories
        </p>
      </div>

      {/* Message toast */}
      <AnimatePresence>
        {message && (
          <div className="flex justify-center mb-3">
            <div className="bg-[#5a594e] text-white px-5 py-2 rounded-full text-sm font-semibold animate-bounce-in">
              {message}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Solved groups */}
      <div className="flex flex-col gap-2 mb-2">
        {solvedGroups.map((group, index) => (
          <SolvedGroup key={group.category} group={group} index={index} />
        ))}
      </div>

      {/* Word grid */}
      {remainingWords.length > 0 && (
        <div
          className={`grid ${gridCols} gap-2 mb-4 ${
            shaking ? "animate-shake" : ""
          }`}
        >
          {remainingWords.map((word) => (
            <WordTile
              key={word}
              word={word}
              isSelected={selectedWords.includes(word)}
              onClick={handleWordClick}
              disabled={gameOver}
            />
          ))}
        </div>
      )}

      {/* Mistake dots */}
      {!gameOver && (
        <div className="mb-4">
          <MistakeDots mistakesRemaining={mistakesRemaining} />
        </div>
      )}

      {/* Action buttons */}
      {!gameOver ? (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleShuffle}
            className="px-5 py-2.5 border-2 border-[#000] rounded-full text-sm font-semibold
                       hover:bg-[#f0f0f0] transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={handleDeselectAll}
            disabled={selectedWords.length === 0}
            className="px-5 py-2.5 border-2 border-[#000] rounded-full text-sm font-semibold
                       hover:bg-[#f0f0f0] transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Deselect All
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedWords.length !== GROUP_SIZE}
            className="px-5 py-2.5 bg-[#000] text-white rounded-full text-sm font-semibold
                       hover:bg-[#333] transition-colors
                       disabled:bg-[#a0a0a0] disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            {gameWon ? (
              <p className="text-xl font-bold text-[#000]">
                Congratulations! 🎉
              </p>
            ) : (
              <p className="text-xl font-bold text-[#000]">
                Better luck next time!
              </p>
            )}
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-[#000] text-white rounded-full text-sm font-semibold
                       hover:bg-[#333] transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
