import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const waytectSchema = z.object({
  waytectEnabled: z.boolean(),
  waytectPaths: z.array(
    z.object({
      id: z.string().optional(),
      path: z.string().min(1),
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
    const { waytectEnabled, waytectPaths } = waytectSchema.parse(body)

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

    // Update waytectEnabled
    await db.website.update({
      where: {
        id: params.websiteId,
      },
      data: {
        waytectEnabled,
      },
    })

    // Get existing waytect paths
    const existingPaths = await db.waytectPath.findMany({
      where: {
        websiteId: params.websiteId,
      },
    })

    // Create a map of existing paths by ID
    const existingPathsMap = new Map(existingPaths.map((path) => [path.id, path]))

    // Determine which paths to create, update, or delete
    const pathsToCreate = waytectPaths.filter((path) => !path.id)
    const pathsToUpdate = waytectPaths.filter((path) => path.id && existingPathsMap.has(path.id))
    const pathIdsToKeep = new Set(waytectPaths.filter((path) => path.id).map((path) => path.id))
    const pathIdsToDelete = existingPaths.filter((path) => !pathIdsToKeep.has(path.id)).map((path) => path.id)

    // Delete paths that are no longer in the list
    if (pathIdsToDelete.length > 0) {
      await db.waytectPath.deleteMany({
        where: {
          id: {
            in: pathIdsToDelete,
          },
        },
      })
    }

    // Update existing paths
    for (const path of pathsToUpdate) {
      await db.waytectPath.update({
        where: {
          id: path.id,
        },
        data: {
          path: path.path,
        },
      })
    }

    // Create new paths
    if (pathsToCreate.length > 0) {
      await db.waytectPath.createMany({
        data: pathsToCreate.map((path) => ({
          path: path.path,
          websiteId: params.websiteId,
        })),
      })
    }

    // Get updated website with paths
    const updatedWebsite = await db.website.findUnique({
      where: {
        id: params.websiteId,
      },
      include: {
        waytectPaths: true,
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
