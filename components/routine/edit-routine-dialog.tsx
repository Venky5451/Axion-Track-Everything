"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

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

interface EditRoutineDialogProps {
  routine: Routine
  onEdit: (id: string, updates: Partial<Routine>) => void
  onDelete: (id: string) => void
}

const categories = [
  "Health", "Study", "Work", "Personal", "Break", "Exercise", 
  "Meal", "Meeting", "Project", "Learning", "Family", "Hobby"
]

const colors = [
  "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-gray-500"
]

const weekDays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
]

export function EditRoutineDialog({ routine, onEdit, onDelete }: EditRoutineDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Routine>({ ...routine })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate time
    if (formData.startTime >= formData.endTime) {
      alert("End time must be after start time")
      return
    }

    // Validate required fields
    if (!formData.title.trim()) {
      alert("Title is required")
      return
    }

    // Update the routine
    onEdit(routine.id, formData)
    setOpen(false)
  }

  const toggleRecurringDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }))
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this routine?")) {
      onDelete(routine.id)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/20">
          <Icons.edit className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Routine</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter routine title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your routine"
              rows={3}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Category and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full ${color} ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recurring Options */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isRecurring">Recurring Routine</Label>
            </div>
            
            {formData.isRecurring && (
              <div className="ml-6 space-y-2">
                <Label>Recurring Days</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map(day => (
                    <label key={day.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.recurringDays.includes(day.value)}
                        onChange={() => toggleRecurringDay(day.value)}
                        className="rounded"
                      />
                      <span className="text-sm">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2 pt-4">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}