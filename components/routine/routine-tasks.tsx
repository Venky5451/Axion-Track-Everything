"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { EditTaskDialog } from "./edit-task-dialog"

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  estimatedTime: number // in minutes
  tags: string[]
  completed: boolean
  completedAt?: string
  createdAt: string
}

export function RoutineTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routine-tasks')
      return saved ? JSON.parse(saved) : [
        {
          id: "1",
          title: "Complete Project Proposal",
          description: "Write and submit the quarterly project proposal document",
          category: "Work",
          priority: "high",
          status: "in-progress",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimatedTime: 120,
          tags: ["documentation", "planning"],
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          title: "Review Code Changes",
          description: "Review pull requests and provide feedback to team members",
          category: "Development",
          priority: "medium",
          status: "pending",
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimatedTime: 60,
          tags: ["code-review", "teamwork"],
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          title: "Update Portfolio Website",
          description: "Add new projects and update personal portfolio website",
          category: "Personal",
          priority: "low",
          status: "pending",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimatedTime: 180,
          tags: ["web-design", "portfolio"],
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]
    }
    return []
  })

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in-progress" | "completed">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt" | "estimatedTime">("dueDate")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('routine-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask = { 
      ...task, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    )
    setTasks(updatedTasks)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      updateTask(id, { 
        completed: !task.completed,
        status: !task.completed ? "completed" : "pending",
        completedAt: !task.completed ? new Date().toISOString() : undefined
      })
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesCategory = filterCategory === "all" || task.category === filterCategory
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "estimatedTime":
        return b.estimatedTime - a.estimatedTime
      default:
        return 0
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500"
      case "in-progress": return "bg-blue-500"
      case "pending": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "overdue"
    if (diffDays === 0) return "due-today"
    if (diffDays <= 2) return "due-soon"
    return "due-later"
  }

  const getDueDateColor = (dueDate: string) => {
    const status = getDueDateStatus(dueDate)
    switch (status) {
      case "overdue": return "text-red-600"
      case "due-today": return "text-orange-600"
      case "due-soon": return "text-yellow-600"
      default: return "text-green-600"
    }
  }

  const categories = Array.from(new Set(tasks.map(task => task.category)))
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = tasks.filter(task => !task.completed).length
  const overdueTasks = tasks.filter(task => getDueDateStatus(task.dueDate) === "overdue").length

  if (!mounted) {
    return <div className="space-y-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Icons.checkSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">All tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Icons.check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Icons.clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Icons.alertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Task Management
            <EditTaskDialog onAdd={addTask} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="createdAt">Sort by Created</option>
                <option value="estimatedTime">Sort by Time</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onEdit={updateTask}
                onDelete={deleteTask}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                getDueDateColor={getDueDateColor}
                getDueDateStatus={getDueDateStatus}
              />
            ))}
            
            {sortedTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterPriority !== "all" || filterCategory !== "all"
                  ? "No tasks match your filters"
                  : "No tasks yet. Create your first task to get started!"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Task Card Component
function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  getPriorityColor,
  getStatusColor,
  getDueDateColor,
  getDueDateStatus
}: { 
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  getDueDateColor: (dueDate: string) => string
  getDueDateStatus: (dueDate: string) => string
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${
        task.completed ? 'bg-muted/50' : 'bg-background'
      } hover:shadow-sm transition-shadow`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onToggleComplete(task.id)}
        >
          <Icons.check className={`h-4 w-4 ${task.completed ? 'text-green-600' : 'text-muted-foreground'}`} />
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {task.description}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {task.category}
            </Badge>
            <Badge className={`text-xs ${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(task.status)} text-white`}>
              {task.status}
            </Badge>
            <span className={`text-xs ${getDueDateColor(task.dueDate)}`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {getDueDateStatus(task.dueDate) === "overdue" && " (Overdue)"}
            </span>
            <span className="text-xs text-muted-foreground">
              {task.estimatedTime} min
            </span>
          </div>
          {task.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {task.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        <EditTaskDialog task={task} onEdit={onEdit} onDelete={onDelete} />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onDelete(task.id)}
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}