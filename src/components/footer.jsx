import Link from "next/link"
import { Leaf } from "lucide-react"

export default function Footer() {
  return (
    <>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">Oishi Life</span>
          </div>
          <div className="ml-1 flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-green-600 dark:hover:text-green-400">
              Dashboard
            </Link>
            <Link href="/about" className="hover:text-green-600 dark:hover:text-green-400">
              About us
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Oishi Life. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
