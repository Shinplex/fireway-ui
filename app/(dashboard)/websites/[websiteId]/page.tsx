import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { WebsiteTabs } from "@/components/websites/website-tabs"
import { LoadingZap } from "@/components/loading-zap"

interface WebsitePageProps {
  params: Promise<{
    websiteId: string
  }>
}

async function WebsiteContent({ params }: WebsitePageProps) {
  const { websiteId } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const website = await db.website.findUnique({
    where: {
      id: websiteId,
      userId: session.user.id,
    },
    include: {
      domains: true,
      waytectPaths: true,
      firewallRules: true,
      origins: true,
    },
  })

  if (!website) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{website.name}</h1>
        <p className="text-muted-foreground">Manage your CDN website settings</p>
      </div>
      <WebsiteTabs website={website} />
    </div>
  )
}

export default function WebsitePage({ params }: WebsitePageProps) {
  return (
    <Suspense fallback={<LoadingZap />}>
      <WebsiteContent params={params} />
    </Suspense>
  )
}
