"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import ProFeatureLock from "@/components/ProFeatureLock";
import { useUser } from "@/contexts/UserContext";

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

const initialCards: Flashcard[] = [
  { id: 1, front: "What is photosynthesis?", back: "Process plants use sunlight to create energy." },
  { id: 2, front: "What is the derivative of sin(x)?", back: "cos(x)" },
  { id: 3, front: "What is Newton's Second Law?", back: "F = ma — Force equals mass times acceleration." },
  { id: 4, front: "What is the powerhouse of the cell?", back: "Mitochondria" },
];

export default function FlashcardsPage() {
  const { profile, openPricingModal } = useUser();
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  const card = cards[index];

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + 1) % cards.length), 150);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i - 1 + cards.length) % cards.length), 150);
  };

  const deleteCard = () => {
    if (cards.length <= 1) return;
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
    setFlipped(false);
    setIndex((prev) => Math.min(prev, newCards.length - 1));
  };

  const addCard = () => {
    if (cards.length >= 5 && !profile.isPro) { openPricingModal(); return; }
    if (!newFront.trim() || !newBack.trim()) return;
    setCards((prev) => [...prev, { id: Date.now(), front: newFront.trim(), back: newBack.trim() }]);
    setNewFront("");
    setNewBack("");
    setShowForm(false);
    setIndex(cards.length);
    setFlipped(false);
  };

  return (
    <ProFeatureLock>
      <div className="mx-auto max-w-lg space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6b7280] dark:text-slate-400 transition-colors">{cards.length} cards</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4338ca]"
          >
            <Plus className="h-4 w-4" />
            New Card
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft space-y-3 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111827] dark:text-slate-200">Create Flashcard</h3>
              <button onClick={() => setShowForm(false)} className="text-[#9ca3af] dark:text-slate-500 hover:text-[#6b7280] dark:hover:text-slate-300 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280] dark:text-slate-400 mb-1 transition-colors">Front (Question)</label>
              <input
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Enter question..."
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280] dark:text-slate-400 mb-1 transition-colors">Back (Answer)</label>
              <input
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCard()}
                placeholder="Enter answer..."
                className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-800 px-3 py-2 text-sm text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20 transition-colors"
              />
            </div>
            <button
              onClick={addCard}
              className="w-full rounded-lg bg-[#4f46e5] py-2 text-sm font-medium text-white transition-colors hover:bg-[#4338ca]"
            >
              Add Card
            </button>
          </div>
        )}

        {/* Flashcard with flip animation */}
        {card && (
          <div
            onClick={() => setFlipped(!flipped)}
            className="cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative w-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                minHeight: "260px",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-10 shadow-soft transition-colors duration-300"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-[#9ca3af] dark:text-slate-500 mb-4 transition-colors">
                  Question
                </p>
                <p className="text-lg font-semibold text-[#111827] dark:text-slate-200 text-center leading-relaxed transition-colors">
                  {card.front}
                </p>
                <p className="mt-6 text-xs text-[#d1d5db] dark:text-slate-600 transition-colors">Click to flip</p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-[#4f46e5]/20 bg-[#4f46e5]/[0.03] dark:bg-indigo-500/10 px-8 py-10 shadow-soft transition-colors duration-300"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-[#4f46e5]/60 dark:text-indigo-400 mb-4 transition-colors">
                  Answer
                </p>
                <p className="text-lg font-semibold text-[#4f46e5] dark:text-indigo-300 text-center leading-relaxed transition-colors">
                  {card.back}
                </p>
                <p className="mt-6 text-xs text-[#d1d5db] dark:text-slate-600 transition-colors">Click to flip back</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e7eb] dark:border-slate-800 text-[#6b7280] dark:text-slate-400 transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[60px] text-center text-sm font-medium text-[#6b7280] dark:text-slate-400 tabular-nums transition-colors">
            {index + 1} / {cards.length}
          </span>
          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e7eb] dark:border-slate-800 text-[#6b7280] dark:text-slate-400 transition-colors hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={deleteCard}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-[#e5e7eb] dark:border-slate-800 px-3 text-sm text-[#6b7280] dark:text-slate-400 transition-colors hover:bg-[#fef2f2] dark:hover:bg-red-500/10 hover:text-[#ef4444] dark:hover:text-red-400 hover:border-[#fecaca] dark:hover:border-red-500/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </ProFeatureLock>
  );
}
