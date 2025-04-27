import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { Plus } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { WebsiteCard } from "@/components/websites/website-card"
import { LoadingZap } from "@/components/loading-zap"

async function WebsitesContent() {
  const session = await getServerSession(authOptions)

  const websites = await db.website.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      domains: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Websites</h1>
          <p className="text-muted-foreground">
            Manage your CDN websites and domains
          </p>
        </div>
        <Button asChild>
          <Link href="/websites/new">
            <Plus className="mr-2 h-4 w-4" /> New Website
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {websites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
    </div>
  )
}

export default function WebsitesPage() {
  return (
    <Suspense fallback={<LoadingZap />}>
      <WebsitesContent />
    </Suspense>
  )
}
