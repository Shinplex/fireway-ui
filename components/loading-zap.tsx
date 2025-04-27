"use client"

import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingZap({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center w-full min-h-[400px]">
      <Zap
        className={cn(
          "h-8 w-8 text-primary animate-pulse",
          "animate-[pulse_1s_ease-in-out_infinite]",
          className
        )}
      />
    </div>
  )
}