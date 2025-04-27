import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Privacy Policy | Fireway by Turboer",
  description: "Privacy policy for Fireway CDN users",
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Privacy Policy</h1>
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Information Collection</h2>
            <p className="text-muted-foreground">
              We collect information that you provide directly to us when you register for an account or use our services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Use of Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to operate and improve our services, and to communicate with you.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information against unauthorized access.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Third-Party Services</h2>
            <p className="text-muted-foreground">
              Our services may contain links to third-party websites. We are not responsible for their privacy practices.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
