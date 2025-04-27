import type { Metadata } from "next"
import { Globe, Shield, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Features | Fireway by Turboer",
  description: "Explore the features of Fireway CDN",
}

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Features</h1>
          <p className="text-muted-foreground">Discover what makes Fireway CDN powerful and easy to use</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Lightning Fast CDN</h2>
            <p className="text-muted-foreground">
              Global network of edge servers ensuring minimal latency and maximum performance.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Advanced Security</h2>
            <p className="text-muted-foreground">
              Built-in DDoS protection, WAF, and SSL/TLS encryption to keep your websites secure.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
            <Globe className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Custom Domains</h2>
            <p className="text-muted-foreground">
              Support for custom domains with automatic SSL certificate provisioning.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
