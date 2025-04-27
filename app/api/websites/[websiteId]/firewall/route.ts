import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const firewallSchema = z.object({
  firewallRules: z.array(
    z.object({
      id: z.string().optional(),
      pattern: z.string().min(1),
    }),
  ),
})

export async function PUT(req: Request, { params }: { params: { websiteId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { firewallRules } = firewallSchema.parse(body)

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

    // Get existing firewall rules
    const existingRules = await db.firewallRule.findMany({
      where: {
        websiteId: params.websiteId,
      },
    })

    // Create a map of existing rules by ID
    const existingRulesMap = new Map(existingRules.map((rule) => [rule.id, rule]))

    // Determine which rules to create, update, or delete
    const rulesToCreate = firewallRules.filter((rule) => !rule.id)
    const rulesToUpdate = firewallRules.filter((rule) => rule.id && existingRulesMap.has(rule.id))
    const ruleIdsToKeep = new Set(firewallRules.filter((rule) => rule.id).map((rule) => rule.id))
    const ruleIdsToDelete = existingRules.filter((rule) => !ruleIdsToKeep.has(rule.id)).map((rule) => rule.id)

    // Delete rules that are no longer in the list
    if (ruleIdsToDelete.length > 0) {
      await db.firewallRule.deleteMany({
        where: {
          id: {
            in: ruleIdsToDelete,
          },
        },
      })
    }

    // Update existing rules
    for (const rule of rulesToUpdate) {
      await db.firewallRule.update({
        where: {
          id: rule.id,
        },
        data: {
          pattern: rule.pattern,
        },
      })
    }

    // Create new rules
    if (rulesToCreate.length > 0) {
      await db.firewallRule.createMany({
        data: rulesToCreate.map((rule) => ({
          pattern: rule.pattern,
          websiteId: params.websiteId,
        })),
      })
    }

    // Get updated website with rules
    const updatedWebsite = await db.website.findUnique({
      where: {
        id: params.websiteId,
      },
      include: {
        firewallRules: true,
      },
    })

    return NextResponse.json(updatedWebsite)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
