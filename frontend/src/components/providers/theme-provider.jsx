"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </NextThemesProvider>
  )
}