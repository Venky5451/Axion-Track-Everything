"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { RoutineCalendar } from "@/components/routine/routine-calendar"
import { RoutineTasks } from "@/components/routine/routine-tasks"
import { AddRoutineDialog } from "@/components/routine/add-routine-dialog"
import { AddTaskDialog } from "@/components/routine/add-task-dialog"

export default function RoutinePage() {
  const [activeTab, setActiveTab] = useState<"calendar" | "tasks">("calendar")
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily")

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Routine & Timetable</h1>
          <p className="text-muted-foreground">Plan your day, manage tasks, and stay organized</p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Icons.back className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <AddRoutineDialog />
          <AddTaskDialog />
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={viewMode === "daily" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("daily")}
        >
          <Icons.calendar className="mr-2 h-4 w-4" />
          Daily
        </Button>
        <Button
          variant={viewMode === "weekly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("weekly")}
        >
          <Icons.calendar className="mr-2 h-4 w-4" />
          Weekly
        </Button>
        <Button
          variant={viewMode === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("monthly")}
        >
          <Icons.calendar className="mr-2 h-4 w-4" />
          Monthly
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "calendar" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("calendar")}
        >
          <Icons.calendar className="mr-2 h-4 w-4" />
          Calendar View
        </Button>
        <Button
          variant={activeTab === "tasks" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("tasks")}
        >
          <Icons.checkSquare className="mr-2 h-4 w-4" />
          Task Management
        </Button>
      </div>

      {/* Content */}
      {activeTab === "calendar" ? (
        <RoutineCalendar viewMode={viewMode} />
      ) : (
        <RoutineTasks />
      )}
    </div>
  )
}
