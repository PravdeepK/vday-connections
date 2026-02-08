import Game from "@/components/Game";
import { valentinesPuzzle } from "@/lib/gameData";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-8 sm:pt-16 pb-12">
      <Game puzzle={valentinesPuzzle} />
    </main>
  );
}
