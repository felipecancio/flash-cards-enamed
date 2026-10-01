import { FlashcardApp } from "@/components/flashcards/FlashcardApp";
import type { FlashcardDeck } from "@/lib/flashcards";
import deckJson from "@/data/flashcards.json";
import type { Metadata } from "next";

const deck = deckJson as FlashcardDeck;

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Bônus de revisão em cartões, guardado neste navegador, sem conta.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/flashcards" },
  openGraph: {
    title: "Flashcards",
    description: "Bônus de revisão em cartões, guardado neste navegador, sem conta.",
  },
};

export default function FlashcardsPage() {
  return (
    <div className="min-h-full overflow-x-clip bg-paper">
      <FlashcardApp deck={deck} />
    </div>
  );
}
