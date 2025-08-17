"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { EditRoutineDialog } from "./edit-routine-dialog"

interface Routine {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  date: string
  category: string
  color: string
  isRecurring: boolean
  recurringDays: string[]
  priority: "low" | "medium" | "high"
  completed: boolean
}

interface RoutineCalendarProps {
  viewMode: "daily" | "weekly" | "monthly"
}

export function RoutineCalendar({ viewMode }: RoutineCalendarProps) {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routine-calendar')
      return saved ? JSON.parse(saved) : [
        {
          id: "1",
          title: "Morning Exercise",
          description: "30 minutes workout and stretching",
          startTime: "06:00",
          endTime: "06:30",
          date: new Date().toISOString().split('T')[0],
          category: "Health",
          color: "bg-blue-500",
          isRecurring: true,
          recurringDays: ["monday", "wednesday", "friday"],
          priority: "high",
          completed: false
        },
        {
          id: "2",
          title: "Study Session",
          description: "Focus on coding and algorithms",
          startTime: "09:00",
          endTime: "11:00",
          date: new Date().toISOString().split('T')[0],
          category: "Study",
          color: "bg-green-500",
          isRecurring: false,
          recurringDays: [],
          priority: "high",
          completed: false
        },
        {
          id: "3",
          title: "Lunch Break",
          description: "Healthy meal and short rest",
          startTime: "12:00",
          endTime: "13:00",
          date: new Date().toISOString().split('T')[0],
          category: "Break",
          color: "bg-yellow-500",
          isRecurring: true,
          recurringDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          priority: "medium",
          completed: false
        }
      ]
    }
    return []
  })

  const [currentDate, setCurrentDate] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('routine-calendar', JSON.stringify(routines))
  }, [routines])

  const addRoutine = (routine: Omit<Routine, "id">) => {
    const newRoutine = { ...routine, id: Date.now().toString() }
    setRoutines([...routines, newRoutine])
  }

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    const updatedRoutines = routines.map(routine =>
      routine.id === id ? { ...routine, ...updates } : routine
    )
    setRoutines(updatedRoutines)
  }

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(routine => routine.id !== id))
  }

  const toggleComplete = (id: string) => {
    updateRoutine(id, { completed: !routines.find(r => r.id === id)?.completed })
  }

  const getTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  const getRoutinesForTimeSlot = (time: string, date: string) => {
    return routines.filter(routine => 
      routine.date === date && 
      routine.startTime <= time && 
      routine.endTime > time
    )
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getWeekDates = () => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getMonthDates = () => {
    const dates = []
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date))
    }
    return dates
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (viewMode === "daily") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "weekly") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else if (viewMode === "monthly") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  if (!mounted) {
    return <div className="space-y-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <Icons.chevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <Icons.chevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-lg font-semibold">
          {viewMode === "daily" && currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          {viewMode === "weekly" && `${getWeekDates()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${getWeekDates()[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          {viewMode === "monthly" && currentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          })}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "daily" && (
        <DailyView 
          date={currentDate}
          routines={routines}
          onToggleComplete={toggleComplete}
          onEdit={updateRoutine}
          onDelete={deleteRoutine}
        />
      )}

      {viewMode === "weekly" && (
        <WeeklyView 
          dates={getWeekDates()}
          routines={routines}
          onToggleComplete={toggleComplete}
          onEdit={updateRoutine}
          onDelete={deleteRoutine}
        />
      )}

      {viewMode === "monthly" && (
        <MonthlyView 
          dates={getMonthDates()}
          routines={routines}
          onToggleComplete={toggleComplete}
          onEdit={updateRoutine}
          onDelete={deleteRoutine}
        />
      )}
    </div>
  )
}

// Daily View Component
function DailyView({ 
  date, 
  routines, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: { 
  date: Date
  routines: Routine[]
  onToggleComplete: (id: string) => void
  onEdit: (id: string, updates: Partial<Routine>) => void
  onDelete: (id: string) => void
}) {
  const timeSlots = getTimeSlots()
  const dateString = date.toISOString().split('T')[0]
  const dayRoutines = routines.filter(r => r.date === dateString)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Schedule - {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          <Badge variant="outline">{dayRoutines.length} routines</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[100px_1fr] gap-4">
          {timeSlots.map((time) => {
            const routinesAtTime = dayRoutines.filter(r => 
              r.startTime <= time && r.endTime > time
            )
            
            return (
              <div key={time} className="contents">
                <div className="text-sm text-muted-foreground font-medium py-2 border-r pr-2">
                  {time}
                </div>
                <div className="min-h-[60px] border-b pb-2 relative">
                  {routinesAtTime.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Weekly View Component
function WeeklyView({ 
  dates, 
  routines, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: { 
  dates: Date[]
  routines: Routine[]
  onToggleComplete: (id: string) => void
  onEdit: (id: string, updates: Partial<Routine>) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-4">
          {/* Time column */}
          <div className="space-y-4">
            <div className="h-12"></div>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-16 text-sm text-muted-foreground">
                {(i + 6).toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {dates.map((date) => {
            const dateString = date.toISOString().split('T')[0]
            const dayRoutines = routines.filter(r => r.date === dateString)
            
            return (
              <div key={dateString} className="space-y-4">
                <div className="h-12 text-center font-medium text-sm">
                  <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-muted-foreground">{date.getDate()}</div>
                </div>
                
                {Array.from({ length: 12 }, (_, i) => {
                  const time = `${(i + 6).toString().padStart(2, '0')}:00`
                  const routinesAtTime = dayRoutines.filter(r => 
                    r.startTime <= time && r.endTime > time
                  )
                  
                  return (
                    <div key={i} className="h-16 border-b relative">
                      {routinesAtTime.map((routine) => (
                        <RoutineCard
                          key={routine.id}
                          routine={routine}
                          onToggleComplete={onToggleComplete}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          compact
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Monthly View Component
function MonthlyView({ 
  dates, 
  routines, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: { 
  dates: Date[]
  routines: Routine[]
  onToggleComplete: (id: string) => void
  onEdit: (id: string, updates: Partial<Routine>) => void
  onDelete: (id: string) => void
}) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center font-medium text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar dates */}
          {dates.map((date) => {
            const dateString = date.toISOString().split('T')[0]
            const dayRoutines = routines.filter(r => r.date === dateString)
            const isCurrentMonth = date.getMonth() === new Date().getMonth()
            const isToday = date.toDateString() === new Date().toDateString()
            
            return (
              <div
                key={dateString}
                className={`min-h-[100px] p-2 border rounded-lg ${
                  isCurrentMonth ? 'bg-background' : 'bg-muted/50'
                } ${isToday ? 'ring-2 ring-primary' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayRoutines.slice(0, 3).map((routine) => (
                    <div
                      key={routine.id}
                      className={`text-xs p-1 rounded ${routine.color} text-white truncate`}
                      title={routine.title}
                    >
                      {routine.title}
                    </div>
                  ))}
                  {dayRoutines.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayRoutines.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Routine Card Component
function RoutineCard({ 
  routine, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  compact = false
}: { 
  routine: Routine
  onToggleComplete: (id: string) => void
  onEdit: (id: string, updates: Partial<Routine>) => void
  onDelete: (id: string) => void
  compact?: boolean
}) {
  return (
    <div
      className={`${routine.color} text-white p-2 rounded-lg mb-1 cursor-pointer hover:opacity-90 transition-opacity ${
        routine.completed ? 'opacity-60 line-through' : ''
      } ${compact ? 'text-xs' : ''}`}
      onClick={() => onToggleComplete(routine.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {routine.title}
          </div>
          {!compact && (
            <div className="text-xs opacity-90 truncate">
              {routine.startTime} - {routine.endTime}
            </div>
          )}
        </div>
        
        {!compact && (
          <div className="flex items-center gap-1 ml-2">
            <EditRoutineDialog routine={routine} onEdit={onEdit} onDelete={onDelete} />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(routine.id)
              }}
            >
              <Icons.trash className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function for time slots
function getTimeSlots() {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
  }
  return slots
}