"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/toggle-mode"
import { Leaf } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About Us", path: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
            <img
                src="/logo.png"
                alt="Logo"
                className="img-logo ml-4"
                width={100}
                
            />
          {/* <Leaf className="h-6 w-6 text-green-500 ml-4" /> */}
          {/* <span className="text-xl font-bold text-green-600 dark:text-green-400">Oishi Life</span> */}
        </Link>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-400 ${
                pathname === item.path ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}
