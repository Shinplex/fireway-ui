import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Terms of Service | Fireway by Turboer",
  description: "Terms of service for using Fireway CDN",
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Terms of Service</h1>
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Terms</h2>
            <p className="text-muted-foreground">
              By accessing Fireway CDN services, you agree to be bound by these terms of service and comply with all applicable laws and regulations.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily use Fireway CDN services for personal or commercial website acceleration, subject to these terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
            <p className="text-muted-foreground">
              The services are provided "as is". Fireway makes no warranties, expressed or implied, and hereby disclaims all warranties.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Limitations</h2>
            <p className="text-muted-foreground">
              In no event shall Fireway or its suppliers be liable for any damages arising out of the use or inability to use our services.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
