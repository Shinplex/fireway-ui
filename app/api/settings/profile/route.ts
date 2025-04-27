import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email } = profileSchema.parse(body)

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await db.user.findUnique({
        where: {
          email,
          NOT: {
            id: session.user.id,
          },
        },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      }
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        email,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}