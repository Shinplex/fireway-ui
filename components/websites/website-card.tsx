import Link from "next/link"
import { Globe, Shield } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface WebsiteCardProps {
  website: {
    id: string
    name: string
    waytectEnabled: boolean
    domains: {
      id: string
      domain: string
    }[]
  }
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="truncate">{website.name}</CardTitle>
          {website.waytectEnabled && (
            <Badge variant="outline" className="ml-2 gap-1">
              <Shield className="h-3 w-3" />
              Protected
            </Badge>
          )}
        </div>
        <CardDescription>
          {website.domains.length > 0
            ? `${website.domains.length} domain${website.domains.length > 1 ? "s" : ""}`
            : "No domains"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {website.domains.length > 0 ? (
            website.domains.slice(0, 3).map((domain) => (
              <div key={domain.id} className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{domain.domain}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No domains configured</div>
          )}
          {website.domains.length > 3 && (
            <div className="text-sm text-muted-foreground">+{website.domains.length - 3} more</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/websites/${website.id}`}>Manage</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
