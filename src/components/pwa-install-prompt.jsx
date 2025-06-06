"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone } from "lucide-react"

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [showInstallPrompt, setShowInstallPrompt] = useState(false)

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Save the event so it can be triggered later
            setDeferredPrompt(e)
            // Show our custom install prompt
            setShowInstallPrompt(true)
        }

        window.addEventListener("beforeinstallprompt", handler)

        return () => {
            window.removeEventListener("beforeinstallprompt", handler)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === "accepted") {
            console.log("User accepted the install prompt")
        } else {
            console.log("User dismissed the install prompt")
        }

        // Clear the deferredPrompt so it can only be used once
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
    }

    const handleDismiss = () => {
        setShowInstallPrompt(false)
        // Store dismissal in localStorage to not show again for a while
        localStorage.setItem("pwa-install-dismissed", Date.now().toString())
    }

    // Check if user has dismissed the prompt recently
    useEffect(() => {
        const dismissed = localStorage.getItem("pwa-install-dismissed")
        if (dismissed) {
            const dismissedTime = Number.parseInt(dismissed)
            const oneDayInMs = 24 * 60 * 60 * 1000
            if (Date.now() - dismissedTime < oneDayInMs) {
                setShowInstallPrompt(false)
            }
        }
    }, [])

    if (!showInstallPrompt || !deferredPrompt) {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
            <Card className="border-green-200 dark:border-green-800 shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Install HealthyNippon</CardTitle>
                                <CardDescription className="text-sm">
                                    Install aplikasi untuk akses yang lebih cepat dan mudah
                                </CardDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex gap-2">
                        <Button
                            onClick={handleInstallClick}
                            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Install
                        </Button>
                        <Button variant="outline" onClick={handleDismiss}>
                            Nanti
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
