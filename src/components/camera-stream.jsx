"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const CameraStream = ({ onCapture, onClose, onError }) => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [mediaStream, setMediaStream] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const enableVideoStream = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 },
                        facingMode: "environment", 
                    },
                })

                setMediaStream(stream)
                setIsLoading(false)
            } catch (error) {
                console.error("Error accessing webcam", error)
                setIsLoading(false)

                let errorMessage = "Tidak dapat mengakses kamera."
                if (error.name === "NotAllowedError") {
                    errorMessage = "Akses kamera ditolak. Silakan berikan izin akses kamera di pengaturan browser."
                } else if (error.name === "NotFoundError") {
                    errorMessage = "Kamera tidak ditemukan di perangkat ini."
                } else if (error.name === "NotSupportedError") {
                    errorMessage = "Kamera tidak didukung di browser ini."
                } else if (error.name === "NotReadableError") {
                    errorMessage = "Kamera sedang digunakan oleh aplikasi lain."
                }

                setError(errorMessage)
                if (onError) {
                    onError(errorMessage)
                }
            }
        }

        enableVideoStream()
    }, [onError])


    useEffect(() => {
        if (videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream
        }
    }, [videoRef, mediaStream])

    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => {
                    track.stop()
                })
            }
        }
    }, [mediaStream])

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || !mediaStream) {
            return
        }

        try {
            const video = videoRef.current
            const canvas = canvasRef.current
            const context = canvas.getContext("2d")

            canvas.width = video.videoWidth || 640
            canvas.height = video.videoHeight || 480

            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)

            if (onCapture) {
                onCapture(imageDataUrl)
            }
        } catch (error) {
            console.error("Error capturing photo:", error)
            if (onError) {
                onError("Gagal mengambil foto. Silakan coba lagi.")
            }
        }
    }

    const handleClose = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
                track.stop()
            })
        }

        if (onClose) {
            onClose()
        }
    }

    if (error) {
        return (
            <div className="w-full max-w-md space-y-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="flex justify-center">
                    <Button onClick={handleClose} variant="outline">
                        Tutup
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-green-200 dark:border-green-800 bg-black">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p className="text-sm">Memuat kamera...</p>
                        </div>
                    </div>
                )}

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }} 
                />

                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Camera overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Status indicator */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                        <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Live
                        </div>
                    </div>

                    {/* Center focus indicator */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 border-2 border-white rounded-lg opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Camera controls */}
            <div className="flex gap-2 mt-4 justify-center">
                <Button
                    onClick={capturePhoto}
                    disabled={isLoading || !mediaStream}
                    className="bg-green-600 hover:bg-green-700"
                    size="lg"
                >
                    <Camera className="mr-2 h-4 w-4" />
                    Ambil Foto
                </Button>
                <Button onClick={handleClose} variant="outline" size="lg">
                    <X className="mr-2 h-4 w-4" />
                    Tutup
                </Button>
            </div>
        </div>
    )
}

export default CameraStream
