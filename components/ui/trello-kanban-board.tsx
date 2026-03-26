"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  MoreHorizontal, 
  Plus, 
  X, 
  Calendar, 
  Flag, 
  CheckCircle2, 
  Circle,
  AlertTriangle 
} from "lucide-react"

// Import existing Task types from the page to remain consistent
export interface KanbanTask {
  id: number
  text: string
  done: boolean
  status: "todo" | "done"
  priority: "high" | "medium" | "low"
  category: string
  deadline: string
  description: string
  subtasks: any[]
}

export interface KanbanColumn {
  id: "todo" | "done"
  title: string
  tasks: KanbanTask[]
}

export interface KanbanBoardProps {
  columns: KanbanColumn[]
  onTaskMove: (taskId: number, targetStatus: "todo" | "done") => void
  onTaskClick: (taskId: number) => void
  onTaskToggle: (taskId: number) => void
  onTaskAdd: (columnId: "todo" | "done", title?: string) => void
  className?: string
}

const priorityColors = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

const categoryColors: Record<string, string> = {
  Study: "#4f46e5",
  Project: "#8b5cf6",
  Personal: "#06b6d4",
  Homework: "#f59e0b",
  "Exam Prep": "#ef4444",
};

export function KanbanBoard({
  columns,
  onTaskMove,
  onTaskClick,
  onTaskToggle,
  onTaskAdd,
  className,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = React.useState<number | null>(null)
  const [dropTarget, setDropTarget] = React.useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.setData("taskId", taskId.toString())
    // Add a ghost image or effect if desired
  }

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    setDropTarget(status)
  }

  const handleDrop = (e: React.DragEvent, targetStatus: any) => {
    e.preventDefault()
    const id = parseInt(e.dataTransfer.getData("taskId"))
    if (!isNaN(id)) {
      onTaskMove(id, targetStatus)
    }
    setDraggedTaskId(null)
    setDropTarget(null)
  }

  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-6 h-screen lg:h-auto items-start", className)}>
      {columns.map((column) => {
        const isDropActive = dropTarget === column.id
        
        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragLeave={() => setDropTarget(null)}
            className={cn(
              "flex flex-col min-w-[320px] max-w-[320px] rounded-2xl transition-all duration-300 h-full max-h-full",
              "bg-[#f9fafb] dark:bg-slate-900/50 border border-[#e5e7eb] dark:border-slate-800",
              isDropActive && "ring-2 ring-[#4f46e5]/20 bg-[#4f46e5]/5 border-[#4f46e5]/20"
            )}
          >
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                  {column.title}
                </h2>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-[#e5e7eb] dark:border-slate-700 text-[10px] font-bold text-[#6b7280] dark:text-slate-400">
                  {column.tasks.length}
                </div>
              </div>
              <button className="text-[#9ca3af] hover:text-[#111827] dark:hover:text-white transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Task Area and Quick Add */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3 min-h-[100px]">
                    {column.tasks.map((task) => {
                        const isDragging = draggedTaskId === task.id
                        const catColor = categoryColors[task.category] || "#6b7280"
                        
                        return (
                            <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => onTaskClick(task.id)}
                            className={cn(
                                "group cursor-grab rounded-xl border border-[#e5e7eb] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-soft transition-all duration-200",
                                "hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 active:cursor-grabbing",
                                isDragging && "opacity-40 scale-95"
                            )}
                            >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex gap-2 items-start">
                                    <button 
                                    onClick={(e) => { e.stopPropagation(); onTaskToggle(task.id); }}
                                    className="mt-0.5 flex-shrink-0"
                                    >
                                        {task.done ? (
                                            <CheckCircle2 className="h-[18px] w-[18px] text-[#4f46e5]" />
                                        ) : (
                                            <Circle className="h-[18px] w-[18px] text-[#d1d5db] dark:text-slate-600 hover:text-[#4f46e5] transition-colors" />
                                        )}
                                    </button>
                                    <h3 className={cn(
                                    "text-sm font-semibold text-[#111827] dark:text-slate-200 leading-tight",
                                    task.done && "line-through text-[#9ca3af] dark:text-slate-600"
                                    )}>
                                        {task.text}
                                    </h3>
                                </div>
                                <Flag className="h-3.5 w-3.5 flex-shrink-0" style={{ color: priorityColors[task.priority] }} />
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                                <span 
                                    className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight"
                                    style={{ color: catColor, backgroundColor: `${catColor}15` }}
                                >
                                    {task.category}
                                </span>
                                
                                {task.deadline && (
                                    <span className="flex items-center gap-1 text-[10px] text-[#9ca3af] dark:text-slate-500 font-medium font-mono">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                )}
                            </div>
                            </div>
                        )
                    })}
                </div>

                <div className="p-3 border-t border-[#e5e7eb] dark:border-slate-800 bg-[#f9fafb]/50 dark:bg-slate-900/30">
                    <div className="relative group">
                        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9ca3af] group-focus-within:text-[#4f46e5] transition-colors" />
                        <input
                            type="text"
                            placeholder="Add task..."
                            className="w-full rounded-xl border-none bg-white dark:bg-slate-800 py-2 pl-9 pr-3 text-sm text-[#111827] dark:text-white placeholder-[#9ca3af] dark:placeholder-slate-500 shadow-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:outline-none transition-all"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                    onTaskAdd(column.id, e.currentTarget.value.trim());
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
