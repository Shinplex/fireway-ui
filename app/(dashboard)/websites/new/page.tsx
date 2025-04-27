import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NewWebsiteForm } from "@/components/websites/new-website-form"

export default async function NewWebsitePage() {
  const session = await getServerSession(authOptions)

  const websiteCount = await db.website.count({
    where: {
      userId: session?.user.id,
    },
  })

  if (websiteCount >= 30) {
    redirect("/websites")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Website</h1>
        <p className="text-muted-foreground">Create a new CDN website</p>
      </div>
      <div className="max-w-2xl">
        <NewWebsiteForm />
      </div>
    </div>
  )
}
