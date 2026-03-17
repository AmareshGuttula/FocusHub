"use client";

import { useState } from "react";
import { Plus, Search, Trash2, FileText } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Biology Notes",
    content:
      "Cell Division\n\nMitosis stages:\n- Prophase: chromatin condenses into chromosomes\n- Metaphase: chromosomes align at the cell equator\n- Anaphase: sister chromatids separate\n- Telophase: nuclear envelopes reform\n\nKey difference with meiosis:\n- Meiosis produces 4 haploid cells\n- Mitosis produces 2 diploid cells",
    updatedAt: "Just now",
  },
  {
    id: 2,
    title: "Physics Formulas",
    content:
      "Kinematics\n\nv = u + at\ns = ut + ½at²\nv² = u² + 2as\n\nNewton's Laws\n\nF = ma\nEvery action has an equal and opposite reaction\n\nEnergy\n\nKE = ½mv²\nPE = mgh\nWork = F × d × cos(θ)",
    updatedAt: "2 hours ago",
  },
  {
    id: 3,
    title: "History Important Dates",
    content:
      "French Revolution\n\n1789 — Storming of the Bastille\n1791 — Constitution adopted\n1792 — French Republic declared\n1793 — Execution of Louis XVI\n1799 — Napoleon's coup d'état\n\nAmerican Revolution\n\n1773 — Boston Tea Party\n1775 — Battle of Lexington\n1776 — Declaration of Independence\n1783 — Treaty of Paris",
    updatedAt: "Yesterday",
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeId, setActiveId] = useState<number>(initialNotes[0].id);
  const [search, setSearch] = useState("");

  const activeNote = notes.find((n) => n.id === activeId);

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled",
      content: "",
      updatedAt: "Just now",
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setActiveId(remaining.length > 0 ? remaining[0].id : -1);
    }
  };

  const updateTitle = (title: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId ? { ...n, title, updatedAt: "Just now" } : n
      )
    );
  };

  const updateContent = (content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId ? { ...n, content, updatedAt: "Just now" } : n
      )
    );
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-56px-48px)] max-w-6xl gap-4">
      {/* Left — Notes list */}
      <div className="flex w-64 flex-shrink-0 flex-col rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
        {/* Search + New */}
        <div className="border-b border-[#f3f4f6] dark:border-slate-800/50 p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af] dark:text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-800 bg-[#f7f7f8] dark:bg-slate-800 py-1.5 pl-8 pr-2 text-xs text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20"
            />
          </div>
          <button
            onClick={createNote}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#4f46e5] py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#4338ca]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Note
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-[#9ca3af] dark:text-slate-500">
              No notes found
            </p>
          )}
          {filtered.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveId(note.id)}
              className={`group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left cursor-pointer transition-colors mb-0.5 ${
                activeId === note.id
                  ? "bg-[#4f46e5]/[0.08] dark:bg-indigo-500/20 text-[#4f46e5]"
                  : "text-[#111827] dark:text-slate-200 hover:bg-[#f7f7f8] dark:hover:bg-slate-800"
              }`}
            >
              <FileText
                className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                  activeId === note.id ? "text-[#4f46e5]" : "text-[#9ca3af] dark:text-slate-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{note.title}</p>
                <p className="text-[11px] text-[#9ca3af] dark:text-slate-500 truncate">
                  {note.updatedAt}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="mt-0.5 text-[#d1d5db] dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ef4444] dark:hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Editor */}
      <div className="flex flex-1 flex-col rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
        {activeNote ? (
          <>
            {/* Title */}
            <div className="border-b border-[#f3f4f6] dark:border-slate-800/50 px-6 py-4">
              <input
                value={activeNote.title}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="Untitled"
                className="w-full bg-transparent text-xl font-bold text-[#111827] dark:text-slate-200 placeholder-[#d1d5db] dark:placeholder-slate-600 outline-none"
              />
              <p className="mt-1 text-xs text-[#9ca3af] dark:text-slate-500">
                Last edited: {activeNote.updatedAt}
              </p>
            </div>

            {/* Content */}
            <textarea
              value={activeNote.content}
              onChange={(e) => updateContent(e.target.value)}
              placeholder="Start writing..."
              className="flex-1 w-full bg-transparent resize-none px-6 py-4 text-sm leading-relaxed text-[#111827] dark:text-slate-200 placeholder-[#d1d5db] dark:placeholder-slate-600 outline-none"
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto h-10 w-10 text-[#d1d5db] dark:text-slate-600" />
              <p className="mt-3 text-sm text-[#9ca3af] dark:text-slate-500">
                Select a note or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
