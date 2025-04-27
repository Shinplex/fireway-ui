import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const originsSchema = z.object({
  origins: z.array(
    z.object({
      id: z.string().optional(),
      host: z.string().min(1),
      protocol: z.enum(["http", "https"]),
      port: z.number().nullable(),
    })
  ).min(1),
})

export async function PUT(
  req: Request,
  { params }: { params: { websiteId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const website = await db.website.findUnique({
      where: {
        id: params.websiteId,
        userId: session.user.id,
      },
    })

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 })
    }

    const body = await req.json()
    const { origins } = originsSchema.parse(body)

    // Delete all existing origins
    await db.origin.deleteMany({
      where: {
        websiteId: params.websiteId,
      },
    })

    // Create new origins
    await db.origin.createMany({
      data: origins.map((origin) => ({
        host: origin.host,
        protocol: origin.protocol,
        port: origin.port,
        websiteId: params.websiteId,
      })),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}