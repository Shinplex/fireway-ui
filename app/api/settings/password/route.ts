import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { compare, hash } from "bcrypt"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = passwordSchema.parse(body)

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "This account cannot change password" },
        { status: 400 }
      )
    }

    const passwordsMatch = await compare(currentPassword, user.password)

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(newPassword, 10)

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: hashedPassword,
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