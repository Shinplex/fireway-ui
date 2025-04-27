import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Pricing | Fireway by Turboer",
  description: "Simple and transparent pricing for Fireway CDN",
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground">Choose the plan that's right for you</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <div className="flex flex-col p-6 bg-card rounded-lg border">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-3xl font-bold mb-6">$0<span className="text-muted-foreground text-sm font-normal">/month</span></p>
            <ul className="space-y-2 mb-6 flex-1">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Up to 30 websites</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Basic DDoS protection</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Custom domains</li>
            </ul>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          <div className="flex flex-col p-6 bg-card rounded-lg border border-primary">
            <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-4">Popular</div>
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-3xl font-bold mb-6">$29<span className="text-muted-foreground text-sm font-normal">/month</span></p>
            <ul className="space-y-2 mb-6 flex-1">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Unlimited websites</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Advanced DDoS protection</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Custom domains</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Priority support</li>
            </ul>
            <Button>Coming Soon</Button>
          </div>

          <div className="flex flex-col p-6 bg-card rounded-lg border">
            <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
            <p className="text-3xl font-bold mb-6">Custom</p>
            <ul className="space-y-2 mb-6 flex-1">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Everything in Pro</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Custom solutions</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> Dedicated support</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary" /> SLA guarantee</li>
            </ul>
            <Button variant="outline">Contact Sales</Button>
          </div>
        </div>
      </div>
    </>
  )
}
