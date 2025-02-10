"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Content Generation System</h1>
      <Link href="/admin">
        <Button size="lg">
          Access Admin Panel
        </Button>
      </Link>
    </main>
  )
}