"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
    puzzle.groups.flatMap((g) => g.words)
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<Group[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(MAX_MISTAKES);
  const [message, setMessage] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [guessedCombos, setGuessedCombos] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [wavingWords, setWavingWords] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Shuffle only on client after hydration
  useEffect(() => {
    setRemainingWords((prev) => shuffleArray(prev));
    setMounted(true);
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  const delay = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = setTimeout(resolve, ms);
      timeoutsRef.current.push(t);
    });

  // Show a temporary message
  const showMessage = useCallback((msg: string, duration = 1400) => {
    setMessage(msg);
    const t = setTimeout(() => setMessage(null), duration);
    timeoutsRef.current.push(t);
  }, []);

  // Toggle word selection
  const handleWordClick = useCallback(
    (word: string) => {
      if (gameOver || isSubmitting) return;

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
    [gameOver, isSubmitting]
  );

  // Submit a guess
  const handleSubmit = useCallback(async () => {
    if (selectedWords.length !== GROUP_SIZE || gameOver || isSubmitting) return;

    const comboKey = [...selectedWords].sort().join(",");
    if (guessedCombos.has(comboKey)) {
      showMessage("Already guessed!");
      return;
    }
    setGuessedCombos((prev) => new Set(prev).add(comboKey));

    const currentSelected = [...selectedWords];
    setIsSubmitting(true);

    // 1) Bounce wave — 100ms stagger, 200ms per bounce
    setWavingWords(currentSelected);
    const waveTotal = (GROUP_SIZE - 1) * 100 + 200 + 100; // last tile delay + bounce + buffer
    await delay(waveTotal);
    setWavingWords([]);

    // 2) Check for match
    const matchedGroup = puzzle.groups.find(
      (group) =>
        !solvedGroups.includes(group) &&
        currentSelected.every((word) => group.words.includes(word))
    );

    if (matchedGroup) {
      // --- Correct ---
      await delay(150);

      // Move matched tiles to the top row — layout anim slides them there
      setRemainingWords((prev) => {
        const matched = prev.filter((w) => matchedGroup.words.includes(w));
        const rest = prev.filter((w) => !matchedGroup.words.includes(w));
        return [...matched, ...rest];
      });
      setSelectedWords([]);

      // Wait for layout animation to finish (tiles sliding into row)
      await delay(500);

      // Remove matched tiles from the grid
      const newSolvedGroups = [...solvedGroups, matchedGroup];
      setRemainingWords((prev) =>
        prev.filter((w) => !matchedGroup.words.includes(w))
      );

      // Brief pause for exit animation before group bar appears
      await delay(200);

      setSolvedGroups(newSolvedGroups);

      if (newSolvedGroups.length === puzzle.groups.length) {
        await delay(400);
        setGameWon(true);
        setGameOver(true);
      }

      setIsSubmitting(false);
    } else {
      // --- Wrong ---
      // Check one-away
      const closeGroup = puzzle.groups.find(
        (group) =>
          !solvedGroups.includes(group) &&
          currentSelected.filter((word) => group.words.includes(word))
            .length === GROUP_SIZE - 1
      );

      // Shake the grid
      setShaking(true);
      await delay(600);
      setShaking(false);

      if (closeGroup) {
        showMessage("One away...");
      }

      const newMistakes = mistakesRemaining - 1;
      setMistakesRemaining(newMistakes);

      // Keep selections so user can adjust their guess

      if (newMistakes <= 0) {
        setGameOver(true);
        setGameWon(false);

        // Reveal remaining groups one by one
        const unsolvedGroups = puzzle.groups.filter(
          (g) => !solvedGroups.includes(g)
        );

        for (let i = 0; i < unsolvedGroups.length; i++) {
          await delay(800);
          const group = unsolvedGroups[i];
          setRemainingWords((prev) =>
            prev.filter((w) => !group.words.includes(w))
          );
          // Brief pause for tile exit anim
          await delay(150);
          setSolvedGroups((prev) => [...prev, group]);
        }
      }

      setIsSubmitting(false);
    }
  }, [
    selectedWords,
    gameOver,
    isSubmitting,
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
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setRemainingWords(getShuffledWords(puzzle));
    setSelectedWords([]);
    setSolvedGroups([]);
    setMistakesRemaining(MAX_MISTAKES);
    setMessage(null);
    setGameOver(false);
    setGameWon(false);
    setGuessedCombos(new Set());
    setIsSubmitting(false);
    setWavingWords([]);
    setShaking(false);
  }, [puzzle]);

  if (!mounted) {
    return (
      <div className="w-full max-w-[600px] mx-auto px-4 text-center pt-20">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Connections
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          For Manvir
        </h1>
        <p className="text-[#5a594e] text-sm mt-1">
          Love You
        </p>
      </div>

      {/* Message toast — fixed height so grid doesn't shift */}
      <div className="h-10 flex items-center justify-center mb-2">
        <AnimatePresence>
          {message && (
            <div className="bg-[#5a594e] text-white px-5 py-2 rounded-full text-sm font-semibold animate-bounce-in">
              {message}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Solved groups */}
      <div className="flex flex-col gap-2 mb-2">
        <AnimatePresence>
          {solvedGroups.map((group) => (
            <SolvedGroup key={group.category} group={group} />
          ))}
        </AnimatePresence>
      </div>

      {/* Word grid */}
      {remainingWords.length > 0 && (
        <div
          className={`grid grid-cols-4 gap-2 mb-4 ${
            shaking ? "animate-shake" : ""
          }`}
        >
          <AnimatePresence mode="popLayout">
            {remainingWords.map((word) => {
              const waveIndex = wavingWords.indexOf(word);
              return (
                <WordTile
                  key={word}
                  word={word}
                  isSelected={selectedWords.includes(word)}
                  onClick={handleWordClick}
                  disabled={gameOver || isSubmitting}
                  waveDelay={waveIndex >= 0 ? waveIndex * 0.1 : null}
                />
              );
            })}
          </AnimatePresence>
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
            disabled={isSubmitting}
            className="px-5 py-2.5 border-2 border-[#000] rounded-full text-sm font-semibold
                       hover:bg-[#f0f0f0] transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Shuffle
          </button>
          <button
            onClick={handleDeselectAll}
            disabled={selectedWords.length === 0 || isSubmitting}
            className="px-5 py-2.5 border-2 border-[#000] rounded-full text-sm font-semibold
                       hover:bg-[#f0f0f0] transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Deselect All
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedWords.length !== GROUP_SIZE || isSubmitting}
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
                Congratulations!
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
