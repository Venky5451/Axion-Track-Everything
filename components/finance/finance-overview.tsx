"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AddAssetDialog } from "./add-asset-dialog"
import { AddLiabilityDialog } from "./add-liability-dialog"
import { AddIncomeDialog } from "./add-income-dialog"
import { AddInvestmentDialog } from "./add-investment-dialog"

interface FinancialItem {
  id: string
  name: string
  amount: number
  category: string
  date: string
}

export function FinanceOverview() {
  // Load data from localStorage or use defaults
  const [assets, setAssets] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finance-assets')
      return saved ? JSON.parse(saved) : [
        { id: "1", name: "Savings Account", amount: 150000, category: "Cash", date: "2024-01-01" },
        { id: "2", name: "Investment Portfolio", amount: 250000, category: "Investments", date: "2024-01-01" },
        { id: "3", name: "Car", amount: 800000, category: "Vehicles", date: "2024-01-01" },
      ]
    }
    return [
      { id: "1", name: "Savings Account", amount: 150000, category: "Cash", date: "2024-01-01" },
      { id: "2", name: "Investment Portfolio", amount: 250000, category: "Investments", date: "2024-01-01" },
      { id: "3", name: "Car", amount: 800000, category: "Vehicles", date: "2024-01-01" },
    ]
  })

  const [liabilities, setLiabilities] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finance-liabilities')
      return saved ? JSON.parse(saved) : [
        { id: "1", name: "Student Loan", amount: 500000, category: "Education", date: "2024-01-01" },
        { id: "2", name: "Credit Card", amount: 25000, category: "Credit", date: "2024-01-01" },
      ]
    }
    return [
      { id: "1", name: "Student Loan", amount: 500000, category: "Education", date: "2024-01-01" },
      { id: "2", name: "Credit Card", amount: 25000, category: "Credit", date: "2024-01-01" },
    ]
  })

  const [incomes, setIncomes] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finance-incomes')
      return saved ? JSON.parse(saved) : [
        { id: "1", name: "Salary", amount: 75000, category: "Employment", date: "2024-01-01" },
        { id: "2", name: "Freelance", amount: 25000, category: "Self-Employment", date: "2024-01-01" },
      ]
    }
    return [
      { id: "1", name: "Salary", amount: 75000, category: "Employment", date: "2024-01-01" },
      { id: "2", name: "Freelance", amount: 25000, category: "Self-Employment", date: "2024-01-01" },
    ]
  })

  const [investments, setInvestments] = useState<FinancialItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finance-investments')
      return saved ? JSON.parse(saved) : [
        { id: "1", name: "Stock Portfolio", amount: 250000, category: "Stocks", date: "2024-01-01" },
        { id: "2", name: "PPF Account", amount: 450000, category: "Retirement", date: "2024-01-01" },
      ]
    }
    return [
      { id: "1", name: "Stock Portfolio", amount: 250000, category: "Stocks", date: "2024-01-01" },
      { id: "2", name: "PPF Account", amount: 450000, category: "Retirement", date: "2024-01-01" },
    ]
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0)
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0)
  const netWorth = totalAssets - totalLiabilities
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalInvestments = investments.reduce((sum, item) => sum + item.amount, 0)

  const addAsset = (asset: Omit<FinancialItem, "id">) => {
    const newAsset = { ...asset, id: Date.now().toString() }
    const newAssets = [...assets, newAsset]
    setAssets(newAssets)
    localStorage.setItem('finance-assets', JSON.stringify(newAssets))
  }

  const addLiability = (liability: Omit<FinancialItem, "id">) => {
    const newLiability = { ...liability, id: Date.now().toString() }
    const newLiabilities = [...liabilities, newLiability]
    setLiabilities(newLiabilities)
    localStorage.setItem('finance-liabilities', JSON.stringify(newLiabilities))
  }

  const addIncome = (income: Omit<FinancialItem, "id">) => {
    const newIncome = { ...income, id: Date.now().toString() }
    const newIncomes = [...incomes, newIncome]
    setIncomes(newIncomes)
    localStorage.setItem('finance-incomes', JSON.stringify(newIncomes))
  }

  const addInvestment = (investment: Omit<FinancialItem, "id">) => {
    const newInvestment = { ...investment, id: Date.now().toString() }
    const newInvestments = [...investments, newInvestment]
    setInvestments(newInvestments)
    localStorage.setItem('finance-investments', JSON.stringify(newInvestments))
  }

  const removeItem = (type: "asset" | "liability" | "income" | "investment", id: string) => {
    switch (type) {
      case "asset":
        const newAssets = assets.filter(item => item.id !== id)
        setAssets(newAssets)
        localStorage.setItem('finance-assets', JSON.stringify(newAssets))
        break
      case "liability":
        const newLiabilities = liabilities.filter(item => item.id !== id)
        setLiabilities(newLiabilities)
        localStorage.setItem('finance-liabilities', JSON.stringify(newLiabilities))
        break
      case "income":
        const newIncomes = incomes.filter(item => item.id !== id)
        setIncomes(newIncomes)
        localStorage.setItem('finance-incomes', JSON.stringify(newIncomes))
        break
      case "investment":
        const newInvestments = investments.filter(item => item.id !== id)
        setInvestments(newInvestments)
        localStorage.setItem('finance-investments', JSON.stringify(newInvestments))
        break
    }
  }

  if (!mounted) {
    return <div className="space-y-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Net Worth Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Net Worth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">₹{netWorth.toLocaleString()}</div>
          <div className="flex gap-4 mt-4 text-sm">
            <div>
              <span className="text-blue-200">Assets:</span> ₹{totalAssets.toLocaleString()}
            </div>
            <div>
              <span className="text-red-200">Liabilities:</span> ₹{totalLiabilities.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Icons.add className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalAssets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <AddAssetDialog onAdd={addAsset} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <Icons.add className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalLiabilities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <AddLiabilityDialog onAdd={addLiability} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <Icons.add className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <AddIncomeDialog onAdd={addIncome} />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investments</CardTitle>
            <Icons.add className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{totalInvestments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <AddInvestmentDialog onAdd={addInvestment} />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Assets
              <AddAssetDialog onAdd={addAsset} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-muted-foreground">{asset.category}</div>
                </div>
                <div className="flex items-center gap-2">
                                     <span className="font-bold text-green-600">₹{asset.amount.toLocaleString()}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem("asset", asset.id)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Liabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Liabilities
              <AddLiabilityDialog onAdd={addLiability} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {liabilities.map((liability) => (
              <div key={liability.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{liability.name}</div>
                  <div className="text-sm text-muted-foreground">{liability.category}</div>
                </div>
                <div className="flex items-center gap-2">
                                     <span className="font-bold text-red-600">₹{liability.amount.toLocaleString()}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem("liability", liability.id)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Income */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Income Sources
              <AddIncomeDialog onAdd={addIncome} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incomes.map((income) => (
              <div key={income.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{income.name}</div>
                  <div className="text-sm text-muted-foreground">{income.category}</div>
                </div>
                <div className="flex items-center gap-2">
                                     <span className="font-bold text-blue-600">₹{income.amount.toLocaleString()}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem("income", income.id)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Investments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Investments
              <AddInvestmentDialog onAdd={addInvestment} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {investments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{investment.name}</div>
                  <div className="text-sm text-muted-foreground">{investment.category}</div>
                </div>
                <div className="flex items-center gap-2">
                                     <span className="font-bold text-purple-600">₹{investment.amount.toLocaleString()}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem("investment", investment.id)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
