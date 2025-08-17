"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { FinanceOverview } from "@/components/finance/finance-overview"
import { TransactionsPanel } from "@/components/finance/transactions-panel"
import { AddAssetDialog } from "@/components/finance/add-asset-dialog"
import { AddLiabilityDialog } from "@/components/finance/add-liability-dialog"
import { AddIncomeDialog } from "@/components/finance/add-income-dialog"
import { AddInvestmentDialog } from "@/components/finance/add-investment-dialog"

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions">("overview")

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance Dashboard</h1>
          <p className="text-muted-foreground">Track your net worth, assets, and transactions</p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Icons.back className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Icons.add className="mr-2 h-4 w-4" />
            Quick Transaction
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("overview")}
        >
          <Icons.dashboard className="mr-2 h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={activeTab === "transactions" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("transactions")}
        >
          <Icons.history className="mr-2 h-4 w-4" />
          Transactions
        </Button>
      </div>

      {/* Content */}
      {activeTab === "overview" ? (
        <FinanceOverview />
      ) : (
        <TransactionsPanel />
      )}
    </div>
  )
}
