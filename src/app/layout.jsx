import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import PWAInstallPrompt from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Oishi Life - Rekomendasi Makanan Sehat",
  description: "Aplikasi rekomendasi makanan sehat dengan analisis gizi menggunakan AI dan tema Jepang",
  manifest: "/manifest.json",
  themeColor: "#16a34a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Oishi Life",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Oishi Life",
    title: "Oishi Life - Rekomendasi Makanan Sehat",
    description: "Aplikasi rekomendasi makanan sehat dengan analisis gizi menggunakan AI dan tema Jepang",
  },
  icons: {
    shortcut: "/favicon.icon",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
}

export const viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Oishi Life" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#16a34a" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <PWAInstallPrompt />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
