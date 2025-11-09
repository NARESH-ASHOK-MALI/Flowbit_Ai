'use client'

import { useEffect, useState } from 'react'
import { OverviewCards } from '@/components/OverviewCards'
import { Charts } from '@/components/Charts'
import { InvoicesTable } from '@/components/InvoicesTable'

interface Stats {
  totalInvoicesProcessed: number
  totalSpendYTD: number
  documentsUploaded: number
  averageInvoiceValue: number
}

interface InvoiceTrend {
  month: string
  count: number
  spend: number
}

interface TopVendor {
  vendorName: string
  totalSpend: number
  invoiceCount: number
}

interface CategorySpend {
  category: string
  total: number
}

interface CashOutflow {
  month: string
  spend: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [trends, setTrends] = useState<InvoiceTrend[]>([])
  const [topVendors, setTopVendors] = useState<TopVendor[]>([])
  const [categorySpend, setCategorySpend] = useState<CategorySpend[]>([])
  const [cashOutflow, setCashOutflow] = useState<CashOutflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendsRes, vendorsRes, categoryRes, outflowRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/invoice-trends'),
          fetch('/api/vendors/top10'),
          fetch('/api/category-spend'),
          fetch('/api/cash-outflow'),
        ])

        const [statsData, trendsData, vendorsData, categoryData, outflowData] = await Promise.all([
          statsRes.json(),
          trendsRes.json(),
          vendorsRes.json(),
          categoryRes.json(),
          outflowRes.json(),
        ])

        setStats(statsData)
        setTrends(trendsData)
        setTopVendors(vendorsData)
        setCategorySpend(categoryData)
        setCashOutflow(outflowData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <OverviewCards stats={stats} />

      <Charts
        trends={trends}
        topVendors={topVendors}
        categorySpend={categorySpend}
        cashOutflow={cashOutflow}
      />
    </div>
  )
}


