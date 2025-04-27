import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { Globe, Shield, Zap, Plus } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingZap } from "@/components/loading-zap"
import Link from "next/link"

// 将数据获取逻辑移到单独的组件
async function DashboardContent() {
  const session = await getServerSession(authOptions)

  const websites = await db.website.count({
    where: {
      userId: session?.user.id,
    },
  })

  const domains = await db.domain.count({
    where: {
      website: {
        userId: session?.user.id,
      },
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session?.user.name}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websites}</div>
            <p className="text-xs text-muted-foreground">{30 - websites} websites remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains}</div>
            <p className="text-xs text-muted-foreground">Across all websites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Sites</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">With Waytect enabled</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your CDN websites and domains</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <Link href="/websites/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Website
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/websites">
                <Globe className="mr-2 h-4 w-4" />
                Manage Websites
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingZap />}>
      <DashboardContent />
    </Suspense>
  )
}
