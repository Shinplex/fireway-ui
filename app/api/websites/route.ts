import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const websiteSchema = z.object({
  name: z.string().min(2),
  domains: z
    .array(
      z.object({
        domain: z.string().min(3),
      }),
    )
    .min(1),
  origins: z
    .array(
      z.object({
        host: z.string().min(1),
        protocol: z.enum(["http", "https"]),
        port: z.number().nullable(),
      }),
    )
    .optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, domains, origins } = websiteSchema.parse(body)

    // Check if user has reached the limit of 30 websites
    const websiteCount = await db.website.count({
      where: {
        userId: session.user.id,
      },
    })

    if (websiteCount >= 30) {
      return NextResponse.json(
        { error: "You have reached the maximum limit of 30 websites." },
        { status: 403 }
      )
    }

    // Create the website with domains and origins
    const website = await db.website.create({
      data: {
        name,
        userId: session.user.id,
        domains: {
          create: domains.map((domain) => ({
            domain: domain.domain,
          })),
        },
        origins: origins
          ? {
              create: origins.map((origin) => ({
                host: origin.host,
                protocol: origin.protocol,
                port: origin.port,
              })),
            }
          : undefined,
      },
    })

    return NextResponse.json(website, { status: 201 })
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
