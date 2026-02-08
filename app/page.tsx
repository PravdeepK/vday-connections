import Game from "@/components/Game";
import { valentinesPuzzle } from "@/lib/gameData";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-4 sm:pt-12 pb-12">
      <Game puzzle={valentinesPuzzle} />
    </main>
  );
}
