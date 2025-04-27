import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const domainsSchema = z.object({
  domains: z
    .array(
      z.object({
        id: z.string().optional(),
        domain: z.string().min(3),
      }),
    )
    .min(1),
})

export async function PUT(req: Request, { params }: { params: { websiteId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { domains } = domainsSchema.parse(body)

    // Check if website exists and belongs to user
    const website = await db.website.findUnique({
      where: {
        id: params.websiteId,
        userId: session.user.id,
      },
    })

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 })
    }

    // Get existing domains
    const existingDomains = await db.domain.findMany({
      where: {
        websiteId: params.websiteId,
      },
    })

    // Create a map of existing domains by ID
    const existingDomainsMap = new Map(existingDomains.map((domain) => [domain.id, domain]))

    // Determine which domains to create, update, or delete
    const domainsToCreate = domains.filter((domain) => !domain.id)
    const domainsToUpdate = domains.filter((domain) => domain.id && existingDomainsMap.has(domain.id))
    const domainIdsToKeep = new Set(domains.filter((domain) => domain.id).map((domain) => domain.id))
    const domainIdsToDelete = existingDomains
      .filter((domain) => !domainIdsToKeep.has(domain.id))
      .map((domain) => domain.id)

    // Delete domains that are no longer in the list
    if (domainIdsToDelete.length > 0) {
      await db.domain.deleteMany({
        where: {
          id: {
            in: domainIdsToDelete,
          },
        },
      })
    }

    // Update existing domains
    for (const domain of domainsToUpdate) {
      await db.domain.update({
        where: {
          id: domain.id,
        },
        data: {
          domain: domain.domain,
        },
      })
    }

    // Create new domains
    if (domainsToCreate.length > 0) {
      await db.domain.createMany({
        data: domainsToCreate.map((domain) => ({
          domain: domain.domain,
          websiteId: params.websiteId,
        })),
      })
    }

    // Get updated domains
    const updatedDomains = await db.domain.findMany({
      where: {
        websiteId: params.websiteId,
      },
    })

    return NextResponse.json(updatedDomains)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
