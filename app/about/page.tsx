import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "About | Fireway by Turboer",
  description: "Learn more about Fireway CDN and our mission",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-6">About Fireway</h1>
        <div className="space-y-8">
          <p className="text-muted-foreground">
            Fireway is a modern content delivery network (CDN) service created by Turboer. Our mission is to make web content delivery faster, more secure, and accessible to everyone.
          </p>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              We believe that every website deserves to be fast and secure. That's why we've built Fireway to provide enterprise-grade CDN services that are easy to use and accessible to businesses of all sizes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Technology</h2>
            <p className="text-muted-foreground">
              Powered by cutting-edge technology and a global network of servers, Fireway ensures your content is delivered quickly and securely to users around the world.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              Have questions or feedback? We'd love to hear from you. Contact our team at support@fireway.dev.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
