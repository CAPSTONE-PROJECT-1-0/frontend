"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Leaf, LogOut, User, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Edukasi", path: "/education" },
    ...(isAuthenticated ? [{ name: "Dashboard", path: "/dashboard" }] : []),
    { name: "Tentang Kami", path: "/about" },
  ]

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold text-green-600 dark:text-green-400">Oishi Life</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-400 ${pathname === item.path ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Laman Pengguna</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  asChild
                >
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />

          {/* Mobile Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-[300px] bg-background border-l shadow-lg">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-600 dark:text-green-400">Oishi Life</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-4">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={handleNavClick}
                      className={`text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-400 p-3 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 ${pathname === item.path
                        ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                        : "text-muted-foreground"
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* User Actions */}
                <div className="border-t pt-4 mt-6">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium">{user?.name}</span>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                          Keluar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" asChild onClick={handleNavClick}>
                        <Link href="/login">Masuk</Link>
                      </Button>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                        asChild
                        onClick={handleNavClick}
                      >
                        <Link href="/register">Daftar</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
