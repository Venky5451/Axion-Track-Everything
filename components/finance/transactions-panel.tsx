"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { AddTransactionDialog } from "./add-transaction-dialog"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
  category: string
  account: string
}

export function TransactionsPanel() {
  // const [transactions, setTransactions] = useState<Transaction[]>([
  //   {
  //     id: "1",
  //     date: "2024-01-15",
  //     description: "Salary Deposit",
  //     amount: 6000,
  //     type: "credit",
  //     category: "Income",
  //     account: "Main Bank"
  //   },
  //   {
  //     id: "2",
  //     date: "2024-01-14",
  //     description: "Grocery Shopping",
  //     amount: 150,
  //     type: "debit",
  //     category: "Food",
  //     account: "Credit Card"
  //   },
  //   {
  //     id: "3",
  //     date: "2024-01-13",
  //     description: "Freelance Payment",
  //     amount: 500,
  //     type: "credit",
  //     category: "Income",
  //     account: "PayPal"
  //   }
  // ])

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finance-transactions')
      return saved ? JSON.parse(saved) : [
        {
          id: "1",
          date: "2024-01-15",
          description: "Salary Deposit",
          amount: 75000,
          type: "credit",
          category: "Income",
          account: "Main Bank"
        },
        {
          id: "2",
          date: "2024-01-14",
          description: "Grocery Shopping",
          amount: 2500,
          type: "debit",
          category: "Food",
          account: "Credit Card"
        },
        {
          id: "3",
          date: "2024-01-13",
          description: "Freelance Payment",
          amount: 15000,
          type: "credit",
          category: "Income",
          account: "PayPal"
        }
      ]
    }
    return [
      {
        id: "1",
        date: "2024-01-15",
        description: "Salary Deposit",
        amount: 75000,
        type: "credit",
        category: "Income",
        account: "Main Bank"
      },
      {
        id: "2",
        date: "2024-01-14",
        description: "Grocery Shopping",
        amount: 2500,
        type: "debit",
        category: "Food",
        account: "Credit Card"
      },
      {
        id: "3",
        date: "2024-01-13",
        description: "Freelance Payment",
        amount: 15000,
        type: "credit",
        category: "Income",
        account: "PayPal"
      }
    ]
  })

  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all")
  const [searchTerm, setSearchTerm] = useState("")

  // const addTransaction = (transaction: Omit<Transaction, "id">) => {
  //   const newTransaction = { ...transaction, id: Date.now().toString() }
  //   setTransactions([newTransaction, ...transactions])
  // }

  // const removeTransaction = (id: string) => {
  //   setTransactions(transactions.filter(t => t.id !== id))
  // }

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: Date.now().toString() }
    const newTransactions = [newTransaction, ...transactions]
    setTransactions(newTransactions)
    localStorage.setItem('finance-transactions', JSON.stringify(newTransactions))
  }

  const removeTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id)
    setTransactions(newTransactions)
    localStorage.setItem('finance-transactions', JSON.stringify(newTransactions))
  }


  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const totalCredits = transactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebits = transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0)

  const netFlow = totalCredits - totalDebits

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="space-y-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Home Return Button */}
      <div className="flex justify-end">
        <Link href="/">
          <Button variant="outline" size="sm">
            <Icons.back className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Icons.add className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
            <Icons.add className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalDebits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            <Icons.statsBar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ₹{netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{netFlow.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transactions
            <AddTransactionDialog onAdd={addTransaction} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "credit" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("credit")}
                className="text-green-600"
              >
                Credits
              </Button>
              <Button
                variant={filterType === "debit" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("debit")}
                className="text-red-600"
              >
                Debits
              </Button>
            </div>
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 rounded-lg border ₹{
                  transaction.type === "credit" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ₹{
                    transaction.type === "credit" ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.category} • {transaction.account} • {transaction.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ₹{
                    transaction.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTransaction(transaction.id)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}