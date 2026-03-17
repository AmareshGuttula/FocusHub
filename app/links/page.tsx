"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Globe,
  Pencil,
  Check,
  X,
  LayoutGrid,
  List,
  Tag,
  Star,
  StarOff,
  Copy,
} from "lucide-react";

interface SavedLink {
  id: number;
  title: string;
  url: string;
  category: string;
  favorite: boolean;
}

const categories = ["All", "Study", "Tools", "Research", "Videos", "Other"];
const categoryColors: Record<string, { text: string; bg: string }> = {
  Study: { text: "#4f46e5", bg: "rgba(79,70,229,0.08)" },
  Tools: { text: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  Research: { text: "#10b981", bg: "rgba(16,185,129,0.08)" },
  Videos: { text: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  Other: { text: "#6b7280", bg: "rgba(107,114,128,0.08)" },
};

const initialLinks: SavedLink[] = [
  { id: 1, title: "Khan Academy — Linear Algebra", url: "https://khanacademy.org/math/linear-algebra", category: "Study", favorite: true },
  { id: 2, title: "MIT OCW — Data Structures", url: "https://ocw.mit.edu/courses/6-006", category: "Study", favorite: false },
  { id: 3, title: "PubMed — Cell Biology Papers", url: "https://pubmed.ncbi.nlm.nih.gov", category: "Research", favorite: true },
  { id: 4, title: "Wolfram Alpha", url: "https://wolframalpha.com", category: "Tools", favorite: false },
];

function extractTitle(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch {
    return url;
  }
}

export default function LinksPage() {
  const [links, setLinks] = useState<SavedLink[]>(initialLinks);
  const [input, setInput] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const addLink = () => {
    const url = input.trim();
    if (!url) return;
    const formatted = url.startsWith("http") ? url : `https://${url}`;
    setLinks((prev) => [
      { id: Date.now(), title: extractTitle(formatted), url: formatted, category: newCategory, favorite: false },
      ...prev,
    ]);
    setInput("");
  };

  const deleteLink = (id: number) =>
    setLinks((prev) => prev.filter((l) => l.id !== id));

  const toggleFav = (id: number) =>
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, favorite: !l.favorite } : l))
    );

  const startEdit = (link: SavedLink) => {
    setEditingId(link.id);
    setEditTitle(link.title);
  };

  const saveEdit = () => {
    if (editingId === null) return;
    setLinks((prev) =>
      prev.map((l) =>
        l.id === editingId ? { ...l, title: editTitle.trim() || l.title } : l
      )
    );
    setEditingId(null);
  };

  const changeCategory = (id: number, category: string) =>
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, category } : l))
    );

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = links
    .filter((l) =>
      activeCategory === "All" ? true : l.category === activeCategory
    )
    .filter(
      (l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.url.toLowerCase().includes(search.toLowerCase())
    );

  const favorites = filtered.filter((l) => l.favorite);
  const others = filtered.filter((l) => !l.favorite);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Add link */}
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-soft space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af] dark:text-slate-500" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLink()}
              placeholder="Paste a link..."
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-800 bg-[#f7f7f8] dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] dark:placeholder-slate-500 outline-none focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[#4f46e5]/20"
            />
          </div>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="rounded-lg border border-[#e5e7eb] dark:border-slate-800 bg-[#f7f7f8] dark:bg-slate-800 px-3 text-sm text-[#6b7280] dark:text-slate-400 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/20"
          >
            {categories.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={addLink}
            className="flex items-center gap-1.5 rounded-lg bg-[#4f46e5] px-5 text-sm font-medium text-white transition-colors hover:bg-[#4338ca]"
          >
            <Plus className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* Toolbar: categories + search + view toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 flex-1 flex-wrap">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            const col = categoryColors[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? cat === "All"
                      ? "bg-[#111827] text-white"
                      : ""
                    : "text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200"
                }`}
                style={
                  active && cat !== "All" && col
                    ? { color: col.text, backgroundColor: col.bg }
                    : {}
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af] dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-44 rounded-lg border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-[#111827] dark:text-slate-200 placeholder-[#9ca3af] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/20"
          />
        </div>
        <div className="flex rounded-lg border border-[#e5e7eb] dark:border-slate-800 overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 transition-colors ${view === "grid" ? "bg-[#f7f7f8] dark:bg-slate-800 text-[#111827] dark:text-slate-200" : "text-[#9ca3af] dark:text-slate-500 hover:text-[#6b7280] dark:hover:text-slate-400"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 transition-colors ${view === "list" ? "bg-[#f7f7f8] dark:bg-slate-800 text-[#111827] dark:text-slate-200" : "text-[#9ca3af] dark:text-slate-500 hover:text-[#6b7280] dark:hover:text-slate-400"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280] dark:text-slate-400">
            ★ Favorites
          </p>
          <LinkList links={favorites} view={view} editingId={editingId} editTitle={editTitle} setEditTitle={setEditTitle} startEdit={startEdit} saveEdit={saveEdit} setEditingId={setEditingId} deleteLink={deleteLink} toggleFav={toggleFav} changeCategory={changeCategory} copyUrl={copyUrl} copied={copied} />
        </div>
      )}

      {/* All links */}
      <div>
        {favorites.length > 0 && others.length > 0 && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280] dark:text-slate-400">
            All Links
          </p>
        )}
        <LinkList links={others} view={view} editingId={editingId} editTitle={editTitle} setEditTitle={setEditTitle} startEdit={startEdit} saveEdit={saveEdit} setEditingId={setEditingId} deleteLink={deleteLink} toggleFav={toggleFav} changeCategory={changeCategory} copyUrl={copyUrl} copied={copied} />
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-center shadow-soft">
          <Globe className="mx-auto h-8 w-8 text-[#d1d5db]" />
          <p className="mt-3 text-sm text-[#9ca3af] dark:text-slate-500">
            {search || activeCategory !== "All" ? "No links match your filters" : "No saved links yet. Paste one above."}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---- Reusable link list ---- */

interface LinkListProps {
  links: SavedLink[];
  view: "grid" | "list";
  editingId: number | null;
  editTitle: string;
  setEditTitle: (v: string) => void;
  startEdit: (link: SavedLink) => void;
  saveEdit: () => void;
  setEditingId: (v: number | null) => void;
  deleteLink: (id: number) => void;
  toggleFav: (id: number) => void;
  changeCategory: (id: number, cat: string) => void;
  copyUrl: (id: number, url: string) => void;
  copied: number | null;
}

function LinkList({ links, view, editingId, editTitle, setEditTitle, startEdit, saveEdit, setEditingId, deleteLink, toggleFav, changeCategory, copyUrl, copied }: LinkListProps) {
  if (links.length === 0) return null;

  if (view === "list") {
    return (
      <div className="rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft divide-y divide-[#f3f4f6] dark:divide-slate-800">
        {links.map((link) => (
          <LinkRow key={link.id} link={link} editingId={editingId} editTitle={editTitle} setEditTitle={setEditTitle} startEdit={startEdit} saveEdit={saveEdit} setEditingId={setEditingId} deleteLink={deleteLink} toggleFav={toggleFav} changeCategory={changeCategory} copyUrl={copyUrl} copied={copied} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} editingId={editingId} editTitle={editTitle} setEditTitle={setEditTitle} startEdit={startEdit} saveEdit={saveEdit} setEditingId={setEditingId} deleteLink={deleteLink} toggleFav={toggleFav} changeCategory={changeCategory} copyUrl={copyUrl} copied={copied} />
      ))}
    </div>
  );
}

/* ---- Card view ---- */

interface LinkItemProps {
  link: SavedLink;
  editingId: number | null;
  editTitle: string;
  setEditTitle: (v: string) => void;
  startEdit: (link: SavedLink) => void;
  saveEdit: () => void;
  setEditingId: (v: number | null) => void;
  deleteLink: (id: number) => void;
  toggleFav: (id: number) => void;
  changeCategory: (id: number, cat: string) => void;
  copyUrl: (id: number, url: string) => void;
  copied: number | null;
}

function LinkCard({ link, editingId, editTitle, setEditTitle, startEdit, saveEdit, setEditingId, deleteLink, toggleFav, changeCategory, copyUrl, copied }: LinkItemProps) {
  const col = categoryColors[link.category] || categoryColors.Other;
  const isEditing = editingId === link.id;

  return (
    <div className="group rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-soft transition-all duration-200 hover:shadow-card hover:border-[#d1d5db]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#f7f7f8] dark:bg-slate-800">
          <Globe className="h-4 w-4 text-[#9ca3af] dark:text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                className="flex-1 rounded border border-[#4f46e5] px-1.5 py-0.5 text-sm text-[#111827] dark:text-slate-200 outline-none"
                autoFocus
              />
              <button onClick={saveEdit} className="text-[#10b981] hover:text-[#059669]"><Check className="h-4 w-4" /></button>
              <button onClick={() => setEditingId(null)} className="text-[#9ca3af] dark:text-slate-500 hover:text-[#6b7280] dark:hover:text-slate-400"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <h3 className="text-sm font-medium text-[#111827] dark:text-slate-200 truncate">{link.title}</h3>
          )}
          <p className="mt-0.5 text-xs text-[#9ca3af] dark:text-slate-500 truncate">{link.url}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="rounded-md px-2 py-0.5 text-[10px] font-medium" style={{ color: col.text, backgroundColor: col.bg }}>
            {link.category}
          </span>
          <select
            value={link.category}
            onChange={(e) => changeCategory(link.id, e.target.value)}
            className="h-5 rounded border-none bg-transparent text-[10px] text-[#9ca3af] dark:text-slate-500 outline-none opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            {categories.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => toggleFav(link.id)} className={`p-1 rounded transition-colors ${link.favorite ? "text-[#f59e0b]" : "text-[#d1d5db] opacity-0 group-hover:opacity-100 hover:text-[#f59e0b]"}`}>
            {link.favorite ? <Star className="h-3.5 w-3.5 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => startEdit(link)} className="p-1 rounded text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-all hover:text-[#4f46e5]">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => copyUrl(link.id, link.url)} className={`p-1 rounded transition-all ${copied === link.id ? "text-[#10b981]" : "text-[#d1d5db] opacity-0 group-hover:opacity-100 hover:text-[#6b7280] dark:text-slate-400"}`}>
            <Copy className="h-3.5 w-3.5" />
          </button>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-all hover:text-[#4f46e5]">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button onClick={() => deleteLink(link.id)} className="p-1 rounded text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-all hover:text-[#ef4444]">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- List view ---- */

function LinkRow({ link, editingId, editTitle, setEditTitle, startEdit, saveEdit, setEditingId, deleteLink, toggleFav, changeCategory, copyUrl, copied }: LinkItemProps) {
  const col = categoryColors[link.category] || categoryColors.Other;
  const isEditing = editingId === link.id;

  return (
    <div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fafafa] dark:hover:bg-slate-800/50">
      <button onClick={() => toggleFav(link.id)} className={`flex-shrink-0 transition-colors ${link.favorite ? "text-[#f59e0b]" : "text-[#d1d5db] hover:text-[#f59e0b]"}`}>
        {link.favorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
      </button>
      <Globe className="h-4 w-4 flex-shrink-0 text-[#9ca3af] dark:text-slate-500" />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit()} className="flex-1 rounded border border-[#4f46e5] px-1.5 py-0.5 text-sm text-[#111827] dark:text-slate-200 outline-none" autoFocus />
            <button onClick={saveEdit} className="text-[#10b981]"><Check className="h-4 w-4" /></button>
            <button onClick={() => setEditingId(null)} className="text-[#9ca3af] dark:text-slate-500"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <p className="text-sm font-medium text-[#111827] dark:text-slate-200 truncate">{link.title}</p>
        )}
        <p className="text-xs text-[#9ca3af] dark:text-slate-500 truncate">{link.url}</p>
      </div>
      <span className="rounded-md px-2 py-0.5 text-[10px] font-medium flex-shrink-0" style={{ color: col.text, backgroundColor: col.bg }}>{link.category}</span>
      <select value={link.category} onChange={(e) => changeCategory(link.id, e.target.value)} className="h-5 rounded border-none bg-transparent text-[10px] text-[#9ca3af] dark:text-slate-500 outline-none opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0">
        {categories.filter((c) => c !== "All").map((c) => (<option key={c} value={c}>{c}</option>))}
      </select>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button onClick={() => startEdit(link)} className="p-1 text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-all hover:text-[#4f46e5]"><Pencil className="h-3.5 w-3.5" /></button>
        <button onClick={() => copyUrl(link.id, link.url)} className={`p-1 transition-all ${copied === link.id ? "text-[#10b981]" : "text-[#d1d5db] opacity-0 group-hover:opacity-100 hover:text-[#6b7280] dark:text-slate-400"}`}><Copy className="h-3.5 w-3.5" /></button>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1 text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-all hover:text-[#4f46e5]"><ExternalLink className="h-3.5 w-3.5" /></a>
        <button onClick={() => deleteLink(link.id)} className="p-1 text-[#d1d5db] opacity-0 group-hover:opacity-100 transition-all hover:text-[#ef4444]"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}
