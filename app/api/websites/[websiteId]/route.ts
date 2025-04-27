import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const websiteSchema = z.object({
  name: z.string().min(2),
})

export async function PATCH(req: Request, { params }: { params: { websiteId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name } = websiteSchema.parse(body)

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

    // Update the website
    const updatedWebsite = await db.website.update({
      where: {
        id: params.websiteId,
      },
      data: {
        name,
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

export async function DELETE(req: Request, { params }: { params: { websiteId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    // Delete the website
    await db.website.delete({
      where: {
        id: params.websiteId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
