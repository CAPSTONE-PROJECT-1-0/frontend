"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, RefreshCw, Check, X, Info, Salad, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import CameraStream from "@/components/camera-stream"
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
  const [showCamera, setShowCamera] = useState(false)
  const [predictionResult, setPredictionResult] = useState(null)
  const [predictionError, setPredictionError] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result)
        setAnalyzed(false)
        setPredictionResult(null)
        setPredictionError(null)
        toast({
          title: "Gambar Berhasil Diunggah",
          description: "Gambar makanan berhasil diunggah dari galeri.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (imageData) => {
    setSelectedImage(imageData)
    setShowCamera(false)
    setAnalyzed(false)
    setPredictionResult(null)
    setPredictionError(null)
    toast({
      title: "Foto Berhasil Diambil",
      description: "Foto makanan berhasil diambil dari kamera.",
    })
  }

  const handleCameraError = (errorMessage) => {
    toast({
      title: "Error Kamera",
      description: errorMessage,
      variant: "destructive",
    })
  }

  const handleCameraClose = () => {
    setShowCamera(false)
  }

  const startCamera = () => {
    setShowCamera(true)
  }

  // Fungsi untuk mengkonversi base64 ke blob
  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(base64.split(",")[1])
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: contentType })
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
    setPredictionError(null)

    try {
      // Konversi base64 ke blob
      const imageBlob = base64ToBlob(selectedImage, "image/jpeg")

      // Buat FormData untuk mengirim gambar
      const formData = new FormData()
      formData.append("file", imageBlob, "food_image.jpg")

      // Kirim ke API route Next.js (bukan langsung ke ML API)
      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || `Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Cek jika ada error dari API
      if (data.error) {
        throw new Error(data.details || data.error)
      }

      // Ambil prediksi dengan confidence tertinggi (yang pertama dalam array)
      if (data.top_predictions && data.top_predictions.length > 0) {
        // Urutkan berdasarkan confidence tertinggi jika belum terurut
        const sortedPredictions = data.top_predictions.sort((a, b) => b.confidence - a.confidence)
        const bestPrediction = sortedPredictions[0]

        setPredictionResult(bestPrediction)
        setAnalyzed(true)

        toast({
          title: "Analisis Selesai",
          description: `Makanan terdeteksi: ${formatFoodLabel(bestPrediction.label)} (${confidenceToPercent(bestPrediction.confidence)}% yakin)`,
        })
      } else {
        throw new Error("Tidak ada prediksi yang ditemukan")
      }
    } catch (error) {
      console.error("Error analyzing food:", error)
      setPredictionError(error.message)

      let errorMessage = "Terjadi kesalahan saat menganalisis gambar."

      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Koneksi ke server gagal. Periksa koneksi internet Anda."
      } else if (error.message.includes("500")) {
        errorMessage = "Server sedang bermasalah. Silakan coba lagi nanti."
      } else if (error.message.includes("timeout")) {
        errorMessage = "Analisis memakan waktu terlalu lama. Silakan coba lagi."
      }

      toast({
        title: "Gagal Menganalisis",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  // Format label makanan untuk tampilan
  const formatFoodLabel = (label) => {
    if (!label) return ""
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Konversi confidence ke persentase
  const confidenceToPercent = (confidence) => {
    return Math.round(confidence * 100)
  }

  // Hitung persentase nutrisi berdasarkan nilai absolut
  const calculateNutritionPercentage = (nutrition) => {
    if (!nutrition) return { protein: 0, carbs: 0, fat: 0, calories: 0 }

    // Hitung total makronutrien (protein + karbohidrat + lemak)
    const totalMacros = nutrition.protein + nutrition.karbohidrat + nutrition.lemak

    return {
      protein: Math.round((nutrition.protein / totalMacros) * 100),
      carbs: Math.round((nutrition.karbohidrat / totalMacros) * 100),
      fat: Math.round((nutrition.lemak / totalMacros) * 100),
      calories: nutrition.kalori,
    }
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

  // Dapatkan nilai nutrisi berdasarkan prediksi
  const nutritionValues = predictionResult ? calculateNutritionPercentage(predictionResult.nutrition) : null

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
                      <CameraStream
                        onCapture={handleCameraCapture}
                        onClose={handleCameraClose}
                        onError={handleCameraError}
                      />
                    ) : selectedImage ? (
                      <div className="relative w-full max-w-md">
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-green-200 dark:border-green-800">
                          <Image
                            src={selectedImage || "/placeholder.svg"}
                            alt="Captured food"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex gap-2 mt-4 justify-center">
                          <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700" size="lg">
                            <Camera className="mr-2 h-4 w-4" />
                            Ambil Ulang
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-md space-y-4">
                        <div
                          className="relative w-full h-64 border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-300 dark:hover:border-green-700 transition-colors"
                          onClick={startCamera}
                        >
                          <Camera className="h-10 w-10 text-green-500 mb-2" />
                          <p className="text-sm text-muted-foreground text-center px-4">Klik untuk mengakses kamera</p>
                          <p className="text-xs text-muted-foreground text-center px-4 mt-1">
                            Pastikan browser memiliki izin akses kamera
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {predictionError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{predictionError}</AlertDescription>
                </Alert>
              )}

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
              <CardDescription>Informasi nutrisi makanan Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analyzed && predictionResult ? (
                <>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-4">
                    <h3 className="font-medium text-lg mb-1">{formatFoodLabel(predictionResult.label)}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm px-2 py-1 rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                        {confidenceToPercent(predictionResult.confidence)}% keyakinan
                      </div>
                      <div
                        className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 
                        ${predictionResult.nutrition_status === "Seimbang"
                            ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                            : "bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100"
                          }`}
                      >
                        {predictionResult.nutrition_status === "Seimbang" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {predictionResult.nutrition_status.replace("_", " ")}
                      </div>
                    </div>
                    {/* <div className="text-sm text-muted-foreground">
                      <strong>Kalori:</strong> {predictionResult.nutrition.kalori} kkal
                    </div> */}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Protein</span>
                        <span className="text-sm text-muted-foreground">
                          {predictionResult.nutrition.kalori}kkal ({nutritionValues.kalori}%)
                        </span>
                      </div>
                      <Progress value={nutritionValues.kalori} className="h-2 bg-green-100 dark:bg-green-900/50" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Protein</span>
                        <span className="text-sm text-muted-foreground">
                          {predictionResult.nutrition.protein}g ({nutritionValues.protein}%)
                        </span>
                      </div>
                      <Progress value={nutritionValues.protein} className="h-2 bg-green-100 dark:bg-green-900/50" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Karbohidrat</span>
                        <span className="text-sm text-muted-foreground">
                          {predictionResult.nutrition.karbohidrat}g ({nutritionValues.carbs}%)
                        </span>
                      </div>
                      <Progress value={nutritionValues.carbs} className="h-2 bg-green-100 dark:bg-green-900/50" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Lemak</span>
                        <span className="text-sm text-muted-foreground">
                          {predictionResult.nutrition.lemak}g ({nutritionValues.fat}%)
                        </span>
                      </div>
                      <Progress value={nutritionValues.fat} className="h-2 bg-green-100 dark:bg-green-900/50" />
                    </div>
                  </div>

                  {predictionResult.nutrition_status !== "Seimbang" && (
                    <div className="mt-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Perhatian</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Makanan ini memiliki kandungan gizi yang tidak seimbang. Pertimbangkan untuk memilih
                          alternatif yang lebih sehat.
                        </p>
                      </div>
                    </div>
                  )}
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
                  <div className="flex flex-wrap gap-2 mt-3">
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
