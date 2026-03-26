"use client";

import { useState, useRef, useCallback } from "react";
import {
  Plus,
  Search,
  Trash2,
  FileText,
  ArrowLeft,
  Lock,
  Bold,
  Italic,
  Heading1,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Minus,
  Quote,
  Undo2,
  Redo2,
  Copy,
  Download,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

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

/* ─── Toolbar Button ─── */
function ToolBtn({
  icon: Icon,
  label,
  onClick,
  active,
  className = "",
}: {
  icon: any;
  label: string;
  onClick: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? "bg-[#4f46e5]/10 dark:bg-indigo-500/20 text-[#4f46e5] dark:text-indigo-400"
          : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f3f4f6] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
      } ${className}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ToolSep() {
  return <div className="w-px h-5 bg-[#e5e7eb] dark:bg-slate-700 mx-0.5" />;
}

/* ─── Main Component ─── */
export default function NotesPage() {
  const { profile, openPricingModal } = useUser();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeId, setActiveId] = useState<number>(initialNotes[0].id);
  const [search, setSearch] = useState("");
  const [mobileShowEditor, setMobileShowEditor] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Undo/Redo history
  const [history, setHistory] = useState<Map<number, string[]>>(new Map());
  const [historyIdx, setHistoryIdx] = useState<Map<number, number>>(new Map());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeNote = notes.find((n) => n.id === activeId);

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  // Word & character count
  const wordCount = activeNote
    ? activeNote.content
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length
    : 0;
  const charCount = activeNote ? activeNote.content.length : 0;

  /* ── History helpers ── */
  const pushHistory = useCallback(
    (noteId: number, content: string) => {
      setHistory((prev) => {
        const h = prev.get(noteId) || [];
        const idx = historyIdx.get(noteId) ?? h.length - 1;
        const newH = [...h.slice(0, idx + 1), content];
        if (newH.length > 50) newH.shift(); // cap at 50
        const next = new Map(prev);
        next.set(noteId, newH);
        return next;
      });
      setHistoryIdx((prev) => {
        const h = history.get(noteId) || [];
        const idx = historyIdx.get(noteId) ?? h.length - 1;
        const newIdx = Math.min(idx + 1, 49);
        const next = new Map(prev);
        next.set(noteId, newIdx);
        return next;
      });
    },
    [history, historyIdx]
  );

  const undo = () => {
    if (!activeNote) return;
    const h = history.get(activeNote.id);
    const idx = historyIdx.get(activeNote.id);
    if (!h || idx === undefined || idx <= 0) return;
    const newIdx = idx - 1;
    setHistoryIdx((prev) => new Map(prev).set(activeNote.id, newIdx));
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, content: h[newIdx], updatedAt: "Just now" }
          : n
      )
    );
  };

  const redo = () => {
    if (!activeNote) return;
    const h = history.get(activeNote.id);
    const idx = historyIdx.get(activeNote.id);
    if (!h || idx === undefined || idx >= h.length - 1) return;
    const newIdx = idx + 1;
    setHistoryIdx((prev) => new Map(prev).set(activeNote.id, newIdx));
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, content: h[newIdx], updatedAt: "Just now" }
          : n
      )
    );
  };

  /* ── Text manipulation helpers ── */
  const getSelection = () => {
    const ta = textareaRef.current;
    if (!ta) return { start: 0, end: 0, text: "" };
    return {
      start: ta.selectionStart,
      end: ta.selectionEnd,
      text: ta.value.substring(ta.selectionStart, ta.selectionEnd),
    };
  };

  const replaceSelection = (before: string, after: string, placeholder: string) => {
    const ta = textareaRef.current;
    if (!ta || !activeNote) return;
    const { start, end, text } = getSelection();
    const selected = text || placeholder;
    const newContent =
      ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);

    updateContent(newContent);
    // Set cursor position after React re-render
    setTimeout(() => {
      ta.focus();
      const cursorPos = start + before.length;
      ta.setSelectionRange(cursorPos, cursorPos + selected.length);
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta || !activeNote) return;
    const { start, end } = getSelection();

    const lines = ta.value.split("\n");
    let charCount = 0;
    let startLine = 0;
    let endLine = 0;

    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= start && startLine === 0) startLine = i;
      if (charCount + lines[i].length >= end) {
        endLine = i;
        break;
      }
      charCount += lines[i].length + 1;
    }

    for (let i = startLine; i <= endLine; i++) {
      if (lines[i].startsWith(prefix)) {
        lines[i] = lines[i].substring(prefix.length);
      } else {
        lines[i] = prefix + lines[i];
      }
    }

    const newContent = lines.join("\n");
    updateContent(newContent);
    setTimeout(() => ta.focus(), 0);
  };

  /* ── Toolbar actions ── */
  const handleBold = () => replaceSelection("**", "**", "bold text");
  const handleItalic = () => replaceSelection("*", "*", "italic text");
  const handleHeading = () => insertAtLineStart("## ");
  const handleBulletList = () => insertAtLineStart("- ");
  const handleNumberedList = () => insertAtLineStart("1. ");
  const handleChecklist = () => insertAtLineStart("☐ ");
  const handleCodeBlock = () => replaceSelection("```\n", "\n```", "code");
  const handleBlockquote = () => insertAtLineStart("> ");
  const handleDivider = () => {
    const ta = textareaRef.current;
    if (!ta || !activeNote) return;
    const { end } = getSelection();
    const before = ta.value.substring(0, end);
    const after = ta.value.substring(end);
    const newContent = before + "\n\n---\n\n" + after;
    updateContent(newContent);
    setTimeout(() => ta.focus(), 0);
  };

  const handleCopy = async () => {
    if (!activeNote) return;
    await navigator.clipboard.writeText(activeNote.content);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  };

  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title || "note"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Keyboard shortcuts ── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.ctrlKey || e.metaKey;

    if (isMod && e.key === "b") {
      e.preventDefault();
      handleBold();
    } else if (isMod && e.key === "i") {
      e.preventDefault();
      handleItalic();
    } else if (isMod && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if (isMod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      redo();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const { start, end } = getSelection();
      const newContent =
        ta.value.substring(0, start) + "  " + ta.value.substring(end);
      updateContent(newContent);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  /* ── CRUD ── */
  const createNote = () => {
    if (notes.length >= 3 && !profile.isPro) {
      openPricingModal();
      return;
    }
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled",
      content: "",
      updatedAt: "Just now",
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
    setMobileShowEditor(true);
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
      } else {
        setActiveId(-1);
        setMobileShowEditor(false);
      }
    }
  };

  const selectNote = (id: number, index: number) => {
    if (index >= 3 || (!profile.isPro && notes.length > 3 && index >= 3)) {
      openPricingModal();
      return;
    }
    setActiveId(id);
    setMobileShowEditor(true);
  };

  const updateTitle = (title: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId ? { ...n, title, updatedAt: "Just now" } : n
      )
    );
  };

  const updateContent = (content: string) => {
    if (activeNote) pushHistory(activeNote.id, activeNote.content);
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId ? { ...n, content, updatedAt: "Just now" } : n
      )
    );
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-56px-48px)] max-w-6xl gap-4">
      {/* Left — Notes list */}
      <div
        className={`flex w-full lg:w-64 flex-shrink-0 flex-col rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft ${
          mobileShowEditor ? "hidden lg:flex" : "flex"
        }`}
      >
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
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#4f46e5] py-2 lg:py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#4338ca] min-h-[44px] lg:min-h-0"
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
          {filtered.map((note, idx) => (
            <div
              key={note.id}
              onClick={() => selectNote(note.id, idx)}
              className={`group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 lg:py-2 text-left cursor-pointer transition-colors mb-0.5 min-h-[44px] lg:min-h-0 ${
                activeId === note.id
                  ? "bg-[#4f46e5]/[0.08] dark:bg-indigo-500/20 text-[#4f46e5]"
                  : "text-[#111827] dark:text-slate-200 hover:bg-[#f7f7f8] dark:hover:bg-slate-800"
              }`}
            >
              <div className="relative">
                <FileText
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                    activeId === note.id
                      ? "text-[#4f46e5]"
                      : "text-[#9ca3af] dark:text-slate-500"
                  }`}
                />
                {idx >= 3 && !profile.isPro && (
                  <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full border border-amber-100 dark:border-amber-900/50 p-0.5">
                    <Lock className="h-2 w-2 text-amber-500" />
                  </div>
                )}
              </div>
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
                className="mt-0.5 text-[#d1d5db] dark:text-slate-500 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#ef4444] dark:hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Editor */}
      <div
        className={`flex flex-1 flex-col rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft overflow-hidden ${
          mobileShowEditor ? "flex" : "hidden lg:flex"
        }`}
      >
        {activeNote ? (
          <>
            {/* Title area */}
            <div className="border-b border-[#f3f4f6] dark:border-slate-800/50 px-4 lg:px-6 py-4">
              {/* Back button — mobile only */}
              <button
                onClick={() => setMobileShowEditor(false)}
                className="flex items-center gap-1.5 text-sm text-[#6b7280] dark:text-slate-400 mb-3 hover:text-[#111827] dark:hover:text-slate-200 transition-colors lg:hidden min-h-[44px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to notes
              </button>
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

            {/* ── Formatting Toolbar ── */}
            <div className="flex items-center gap-0.5 px-4 lg:px-6 py-2 border-b border-[#f3f4f6] dark:border-slate-800/50 overflow-x-auto flex-shrink-0">
              <ToolBtn icon={Bold} label="Bold (Ctrl+B)" onClick={handleBold} />
              <ToolBtn icon={Italic} label="Italic (Ctrl+I)" onClick={handleItalic} />
              <ToolBtn icon={Heading1} label="Heading" onClick={handleHeading} />
              <ToolSep />
              <ToolBtn icon={List} label="Bullet List" onClick={handleBulletList} />
              <ToolBtn icon={ListOrdered} label="Numbered List" onClick={handleNumberedList} />
              <ToolBtn icon={CheckSquare} label="Checklist" onClick={handleChecklist} />
              <ToolSep />
              <ToolBtn icon={Code} label="Code Block" onClick={handleCodeBlock} />
              <ToolBtn icon={Quote} label="Blockquote" onClick={handleBlockquote} />
              <ToolBtn icon={Minus} label="Divider" onClick={handleDivider} />
              <ToolSep />
              <ToolBtn icon={Undo2} label="Undo (Ctrl+Z)" onClick={undo} />
              <ToolBtn icon={Redo2} label="Redo (Ctrl+Y)" onClick={redo} />
              <ToolSep />
              <div className="relative">
                <ToolBtn icon={Copy} label="Copy All" onClick={handleCopy} />
                {copyFeedback && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-[10px] font-medium rounded-md whitespace-nowrap shadow-lg">
                    Copied!
                  </div>
                )}
              </div>
              <ToolBtn icon={Download} label="Download" onClick={handleDownload} />
            </div>

            {/* Content area */}
            <textarea
              ref={textareaRef}
              value={activeNote.content}
              onChange={(e) => updateContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start writing..."
              className="flex-1 w-full bg-transparent resize-none px-4 lg:px-6 py-4 text-sm leading-relaxed text-[#111827] dark:text-slate-200 placeholder-[#d1d5db] dark:placeholder-slate-600 outline-none font-mono"
              spellCheck
            />

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-2 border-t border-[#f3f4f6] dark:border-slate-800/50 text-[11px] text-[#9ca3af] dark:text-slate-500">
              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Ctrl+B Bold · Ctrl+I Italic · Tab Indent</span>
              </div>
            </div>
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
