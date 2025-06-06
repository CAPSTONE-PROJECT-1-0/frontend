"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, RefreshCw, Check, X, Info, Salad, AlertCircle, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Cleanup camera stream when component unmounts or when camera is stopped
  const cleanupCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop()
        console.log("Camera track stopped:", track.kind)
      })
      setCameraStream(null)
    }

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
      videoRef.current.removeEventListener("loadedmetadata", handleVideoReady)
      videoRef.current.removeEventListener("canplay", handleVideoReady)
    }

    setVideoReady(false)
    setShowCamera(false)
    setCameraError(null)
  }, [cameraStream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCamera()
    }
  }, [cleanupCamera])

  const handleVideoReady = useCallback(() => {
    console.log("Video ready to play")
    setVideoReady(true)
    setCameraLoading(false)

    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
        toast({
          title: "Error Video",
          description: "Tidak dapat memutar video kamera.",
          variant: "destructive",
        })
      })
    }
  }, [toast])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result)
        setAnalyzed(false)
        toast({
          title: "Gambar Berhasil Diunggah",
          description: "Gambar makanan berhasil diunggah dari galeri.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setCameraLoading(true)
    setCameraError(null)
    setVideoReady(false)

    try {
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Kamera tidak didukung di browser ini")
      }

      // Stop any existing stream first
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }

      console.log("Requesting camera access...")

      // Request camera access with fallback constraints
      let stream
      try {
        // Try with ideal constraints first
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            facingMode: "environment",
          },
          audio: false,
        })
      } catch (error) {
        console.log("Fallback to basic constraints:", error)
        // Fallback to basic constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        })
      }

      console.log("Camera stream obtained:", stream)
      setCameraStream(stream)
      setShowCamera(true)

      // Setup video element
      if (videoRef.current) {
        const video = videoRef.current

        // Add event listeners
        video.addEventListener("loadedmetadata", handleVideoReady)
        video.addEventListener("canplay", handleVideoReady)

        // Set the stream
        video.srcObject = stream

        console.log("Video element setup complete")

        toast({
          title: "Kamera Berhasil Diakses",
          description: "Kamera siap digunakan untuk mengambil foto makanan.",
        })
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      let errorMessage = "Tidak dapat mengakses kamera."

      if (error.name === "NotAllowedError") {
        errorMessage = "Akses kamera ditolak. Silakan berikan izin akses kamera di pengaturan browser."
      } else if (error.name === "NotFoundError") {
        errorMessage = "Kamera tidak ditemukan di perangkat ini."
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Kamera tidak didukung di browser ini."
      } else if (error.name === "NotReadableError") {
        errorMessage = "Kamera sedang digunakan oleh aplikasi lain."
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "Pengaturan kamera tidak didukung. Mencoba dengan pengaturan dasar."
      }

      setCameraError(errorMessage)
      setCameraLoading(false)
      toast({
        title: "Error Kamera",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    console.log("Stopping camera...")
    cleanupCamera()
    toast({
      title: "Kamera Dihentikan",
      description: "Kamera telah dihentikan.",
    })
  }

  const capturePhoto = () => {
    if (!videoRef.current || !videoReady) {
      toast({
        title: "Kamera belum siap",
        description: "Tunggu beberapa saat hingga kamera siap, lalu coba lagi.",
        variant: "destructive",
      })
      return
    }

    if (!canvasRef.current) {
      toast({
        title: "Error Canvas",
        description: "Canvas tidak tersedia untuk mengambil foto.",
        variant: "destructive",
      })
      return
    }

    try {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || video.clientWidth
      canvas.height = video.videoHeight || video.clientHeight

      console.log("Capturing photo:", canvas.width, "x", canvas.height)

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
      setSelectedImage(imageDataUrl)
      setAnalyzed(false)

      // Stop camera after capture
      stopCamera()

      toast({
        title: "Foto Berhasil Diambil",
        description: "Foto makanan berhasil diambil dari kamera.",
      })
    } catch (error) {
      console.error("Error capturing photo:", error)
      toast({
        title: "Error Mengambil Foto",
        description: "Tidak dapat mengambil foto. Pastikan kamera berfungsi dengan baik.",
        variant: "destructive",
      })
    }
  }

  const analyzeFood = async () => {
    if (!selectedImage) {
      toast({
        title: "Tidak ada gambar",
        description: "Silakan unggah gambar makanan terlebih dahulu.",
        variant: "destructive",
      })
      return
    }

    setAnalyzing(true)

    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('/api/analyze-food', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       image: selectedImage,
    //       userId: user.id
    //     })
    //   })
    //   const data = await response.json()
    //   // Handle response
    // } catch (error) {
    //   console.error('Error analyzing food:', error)
    // }

    // Simulate analysis delay
    setTimeout(() => {
      setAnalyzing(false)
      setAnalyzed(true)

      toast({
        title: "Analisis Selesai",
        description: "Makanan berhasil dianalisis. Lihat hasil dan rekomendasi di sebelah kanan.",
      })

      // TODO: Save analysis to backend
      // saveAnalysisToBackend({
      //   userId: user.id,
      //   image: selectedImage,
      //   results: analysisResults
      // })
    }, 2000)
  }

  const recommendedFoods = [
    {
      name: "Salmon Teriyaki",
      image: "/placeholder.svg?height=200&width=300",
      nutrition: { protein: 85, carbs: 60, fat: 40 },
      description: "Salmon panggang dengan saus teriyaki rendah gula, disajikan dengan brokoli kukus dan nasi merah.",
    },
    {
      name: "Tofu Salad",
      image: "/placeholder.svg?height=200&width=300",
      nutrition: { protein: 70, carbs: 75, fat: 30 },
      description: "Salad tofu dengan sayuran segar, edamame, dan dressing yuzu rendah kalori.",
    },
    {
      name: "Chicken Katsu Sehat",
      image: "/placeholder.svg?height=200&width=300",
      nutrition: { protein: 90, carbs: 65, fat: 35 },
      description:
        "Ayam panggang dengan lapisan panko yang dipanggang, bukan digoreng, dengan saus katsu rendah sodium.",
    },
  ]

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">Dashboard Analisis Makanan</h1>
        <p className="text-muted-foreground">Selamat datang, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analisis Makanan</CardTitle>
              <CardDescription>Unggah atau ambil foto makanan untuk dianalisis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Unggah Gambar</TabsTrigger>
                  <TabsTrigger value="camera">Kamera</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-md h-64 border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg flex flex-col items-center justify-center overflow-hidden">
                      {selectedImage ? (
                        <Image
                          src={selectedImage || "/placeholder.svg"}
                          alt="Uploaded food"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-green-500 mb-2" />
                          <p className="text-sm text-muted-foreground text-center px-4">
                            Klik untuk memilih gambar atau seret dan lepas
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="camera" className="space-y-4">
                  <div className="flex justify-center">
                    {showCamera ? (
                      <div className="relative w-full max-w-md">
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-green-200 dark:border-green-800 bg-black">
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ transform: "scaleX(-1)" }} // Mirror effect for better UX
                          />

                          {/* Hidden canvas for photo capture */}
                          <canvas ref={canvasRef} className="hidden" />

                          {/* Camera overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                              <div className="bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                {videoReady ? "Live" : "Loading..."}
                              </div>
                              {videoReady && (
                                <div className="bg-green-500/80 text-white px-2 py-1 rounded text-xs">Ready</div>
                              )}
                            </div>

                            {/* Center focus indicator */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-16 h-16 border-2 border-white rounded-lg opacity-50"></div>
                            </div>
                          </div>

                          {/* Loading overlay */}
                          {cameraLoading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-white text-center">
                                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                                <p className="text-sm">Memuat kamera...</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4 justify-center">
                          <Button
                            onClick={capturePhoto}
                            disabled={!videoReady || cameraLoading}
                            className="bg-green-600 hover:bg-green-700"
                            size="lg"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            {videoReady ? "Ambil Foto" : "Tunggu..."}
                          </Button>
                          <Button onClick={stopCamera} variant="outline" size="lg">
                            Batal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-md space-y-4">
                        {cameraError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{cameraError}</AlertDescription>
                          </Alert>
                        )}

                        <div
                          className="relative w-full h-64 border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-300 dark:hover:border-green-700 transition-colors"
                          onClick={startCamera}
                        >
                          {cameraLoading ? (
                            <>
                              <RefreshCw className="h-10 w-10 text-green-500 mb-2 animate-spin" />
                              <p className="text-sm text-muted-foreground text-center px-4">Mengakses kamera...</p>
                            </>
                          ) : (
                            <>
                              <Camera className="h-10 w-10 text-green-500 mb-2" />
                              <p className="text-sm text-muted-foreground text-center px-4">
                                Klik untuk mengakses kamera
                              </p>
                              <p className="text-xs text-muted-foreground text-center px-4 mt-1">
                                Pastikan browser memiliki izin akses kamera
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center">
                <Button
                  onClick={analyzeFood}
                  disabled={!selectedImage || analyzing}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    "Analisis Makanan"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Hasil Analisis</CardTitle>
              <CardDescription>Keseimbangan gizi makanan Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analyzed ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Protein</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-green-100 dark:bg-green-900/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Karbohidrat</span>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="h-2 bg-green-100 dark:bg-green-900/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Lemak</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2 bg-green-100 dark:bg-green-900/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Serat</span>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-2 bg-green-100 dark:bg-green-900/50" />
                  </div>

                  <div className="mt-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Perhatian</h4>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Makanan ini memiliki kandungan lemak yang tinggi dan serat yang rendah. Pertimbangkan untuk
                        menambahkan sayuran untuk meningkatkan asupan serat.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Salad className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-muted-foreground">
                    Unggah gambar makanan dan klik "Analisis Makanan" untuk melihat hasil
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {analyzed && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Rekomendasi Makanan Sehat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedFoods.map((food, index) => (
              <Card key={index}>
                <div className="relative h-40 w-full">
                  <Image
                    src={food.image || "/placeholder.svg"}
                    alt={food.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{food.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{food.description}</p>
                  <div className="flex gap-2 mt-3">
                    <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs">
                      Protein: {food.nutrition.protein}%
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs">
                      Karbo: {food.nutrition.carbs}%
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs">
                      Lemak: {food.nutrition.fat}%
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/50 hover:text-green-700 dark:hover:text-green-400"
                  >
                    Lihat Resep
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Riwayat Analisis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="overflow-hidden">
              <div className="relative h-32 w-full">
                <Image
                  src={`/placeholder.svg?height=150&width=300`}
                  alt={`Food history ${item}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">Makanan #{item}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    {item % 2 === 0 ? (
                      <>
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400">Seimbang</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                        <span className="text-red-600 dark:text-red-400">Tidak Seimbang</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(Date.now() - item * 86400000).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
