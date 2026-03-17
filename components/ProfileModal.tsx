"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { X, User, Mail, Sparkles } from "lucide-react";

const animalAvatars = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", 
  "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", 
  "🐷", "🐸", "🐵", "🐧", "🦉", "🦄"
];

export default function ProfileModal() {
  const { profile, isProfileOpen, closeProfile, updateProfile } = useUser();
  
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatar);

  // Sync state when opened
  useEffect(() => {
    if (isProfileOpen) {
      setName(profile.name);
      setEmail(profile.email);
      setAvatar(profile.avatar);
    }
  }, [isProfileOpen, profile]);

  if (!isProfileOpen) return null;

  const handleSave = () => {
    updateProfile({ name, email, avatar });
    closeProfile();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4 transition-colors duration-300">
      <div 
        className="w-full max-w-md scale-100 rounded-2xl bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 p-6 shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#111827] dark:text-white transition-colors duration-300">Edit Profile</h2>
          <button 
            onClick={closeProfile} 
            className="rounded-full p-1.5 text-[#9ca3af] dark:text-slate-400 hover:bg-[#f3f4f6] dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f3f4f6] dark:bg-slate-800 text-5xl shadow-inner mb-3 transition-transform hover:scale-105 border border-transparent dark:border-slate-700">
            {avatar}
          </div>
          <p className="text-xs font-medium text-[#6b7280] dark:text-slate-400 transition-colors duration-300">Avatar Preview</p>
        </div>

        <div className="space-y-5">
          {/* Avatar Selection Grid */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] dark:text-slate-400 transition-colors duration-300">
              <Sparkles className="h-3.5 w-3.5" /> Choose your Avatar
            </label>
            <div className="grid grid-cols-6 gap-2 rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-[#f7f7f8] dark:bg-slate-900/50 p-3 transition-colors duration-300">
              {animalAvatars.map((animal) => (
                <button
                  key={animal}
                  onClick={() => setAvatar(animal)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-2xl transition-all ${
                    avatar === animal 
                      ? "bg-white dark:bg-slate-800 shadow-sm ring-2 ring-[#4f46e5] dark:ring-indigo-500 scale-110" 
                      : "hover:bg-[#e5e7eb] dark:hover:bg-slate-800 hover:scale-110 opacity-70 hover:opacity-100"
                  }`}
                >
                  {animal}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] dark:text-slate-400 transition-colors duration-300">
              <User className="h-3.5 w-3.5" /> Display Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-[#111827] dark:text-slate-200 outline-none transition-colors focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-[#4f46e5]/20"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] dark:text-slate-400 transition-colors duration-300">
              <Mail className="h-3.5 w-3.5" /> Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#e5e7eb] dark:border-slate-700 bg-[#f7f7f8] dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-[#111827] dark:text-slate-200 outline-none transition-colors focus:border-[#4f46e5] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-[#4f46e5]/20"
              placeholder="e.g. email@university.edu"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={closeProfile}
            className="flex-1 rounded-xl border border-[#e5e7eb] dark:border-slate-700 py-2.5 text-sm font-semibold text-[#6b7280] dark:text-slate-400 hover:bg-[#f7f7f8] dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 rounded-xl bg-[#4f46e5] py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca] transition-colors shadow-sm shadow-[#4f46e5]/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
