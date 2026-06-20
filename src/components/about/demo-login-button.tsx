"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function DemoLoginButton() {


  function handleClick() {
    alert("This is a demo")
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 sm:w-auto">
      <Button
        size="lg"
        className="h-12 w-full gap-2 px-10 shadow-sm sm:w-auto"
        onClick={handleClick}
      >
        <Play size={16} />
        Explore live demo
      </Button>
    </div>
  )
}
