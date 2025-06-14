"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, RefreshCw, Check, X, Info, Salad, AlertCircle, Clock, ChefHat, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import CameraStream from "@/components/camera-stream"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import recommendedFoodsData from "@/data/recommended-foods.json"
import { fetchAnalysisHistory, formatHistoryItem } from "@/api"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { toast } = useToast()
  const { user, authenticatedFetch } = useAuth()
  const [selectedImage, setSelectedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [predictionResult, setPredictionResult] = useState(null)
  const [predictionError, setPredictionError] = useState(null)
  const [recommendedFoods, setRecommendedFoods] = useState([])

  const [historyData, setHistoryData] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState(null)
  const [displayCount, setDisplayCount] = useState(8)

  const handleShowMore = () => {
    const remainingItems = historyData.length - displayCount
    const increment = Math.min(remainingItems, 8)
    setDisplayCount(displayCount + increment)
  }

  const loadHistoryData = async () => {
    try {
      setHistoryLoading(true)
      setHistoryError(null)

      const data = await fetchAnalysisHistory(authenticatedFetch, user)

      const formattedData = data.map((item, index) => formatHistoryItem(item, index))
      setHistoryData(formattedData)
    } catch (error) {
      console.error("Error fetching history:", error)
      setHistoryError(error.message)

      setHistoryData([])

      toast({
        title: "Gagal Memuat Riwayat",
        description: "Tidak dapat memuat riwayat analisis. Silakan coba lagi nanti.",
        variant: "destructive",
      })
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadHistoryData()
    }
  }, [user])

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

  const getRandomRecommendations = () => {
    const shuffled = [...recommendedFoodsData].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

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

    if (!user || !user.email || !user.name) {
      toast({
        title: "Error",
        description: "Informasi pengguna tidak lengkap. Silakan masuk ulang.",
        variant: "destructive",
      })
      return
    }

    setAnalyzing(true)
    setPredictionError(null)

    try {
      const imageBlob = base64ToBlob(selectedImage, "image/jpeg")

      const formData = new FormData()
      formData.append("file", imageBlob, "food_image.jpg")

      const token = localStorage.getItem("token")
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "x-user-email": user.email,
          "x-user-name": user.name,
        },
        body: formData,
      })

      
      if (!response.ok) {
        console.log({err: await response.text()})
        throw new Error("Tidak bisa analisis makanan")
        // const errorData = await response.json().catch(() => ({}))
        // throw new Error(errorData.details || `Error: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.details || data.error)
      }

      if (data.status === "success" && data.prediction) {
        const prediction = data.prediction

        setPredictionResult(prediction)
        setAnalyzed(true)

        const randomRecommendations = getRandomRecommendations()
        setRecommendedFoods(randomRecommendations)

        toast({
          title: "Analisis Selesai",
          description: `Makanan terdeteksi: ${formatFoodLabel(prediction.label)} (${confidenceToPercent(prediction.confidence)}% yakin)`,
        })

        setTimeout(() => {
          loadHistoryData()
        }, 2000)
      } else {
        throw new Error("Format respon tidak benar")
      }
    } catch (error) {
      console.error("Error analyzing food:", error)
      setPredictionError(error.message)

      let errorMessage = "There is some mistake when load image."

      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Failed connect to server. Check your internet connection."
      } else if (error.message.includes("500")) {
        errorMessage = "Internal Server Error. Try again later."
      } else if (error.message.includes("400")) {
        errorMessage = "Bad request, invalid data. Have you logged in?."
      } else if (error.message.includes("timeout")) {
        errorMessage = "Analyze image too long. Try again."
      } else if (error.message.includes("Authorization")) {
        errorMessage = "Session has been expired. Login again."
      }

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }


  const formatFoodLabel = (label) => {
    if (!label) return ""
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const confidenceToPercent = (confidence) => {
    return Math.round(confidence * 100)
  }

  const calculateNutritionPercentage = (nutrition) => {
    if (!nutrition) return { protein: 0, carbs: 0, fat: 0, calories: 0 }

    const totalMacros = nutrition.protein + nutrition.karbohidrat + nutrition.lemak

    return {
      protein: Math.round((nutrition.protein / totalMacros) * 100),
      carbs: Math.round((nutrition.karbohidrat / totalMacros) * 100),
      fat: Math.round((nutrition.lemak / totalMacros) * 100),
      calories: nutrition.kalori,
    }
  }

  const nutritionValues = predictionResult ? calculateNutritionPercentage(predictionResult.nutrition) : null

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia"

    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch (error) {
      return "Format tanggal tidak valid"
    }
  }

  return (
    <>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">Laman Pengguna Analisis Makanan</h1>
          <p className="text-muted-foreground">Yōkoso Nakama {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full py-6">
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
                            <p className="text-sm text-muted-foreground text-center px-4">
                              Klik untuk mengakses kamera
                            </p>
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
            <Card className="h-full py-6">
              <CardHeader>
                <CardTitle>Hasil Analisis</CardTitle>
                <CardDescription>Informasi nutrisi makanan Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analyzed && predictionResult ? (
                  <>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-4">
                      <h3 className="font-medium text-lg mb-1">Jenis Makanan : {formatFoodLabel(predictionResult.label)}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm px-2 py-1 rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                          {confidenceToPercent(predictionResult.confidence)}% keyakinan
                        </div>
                        <div
                          className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 
                        ${
                          predictionResult.nutrition_status === "Seimbang"
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
                      <div className="text-sm text-muted-foreground">
                        <strong>Kalori:</strong> {predictionResult.nutrition.kalori} kkal
                      </div>
                    </div>

                    <div className="space-y-4">
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

        {analyzed && recommendedFoods.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">Rekomendasi Makanan Sehat</h2>
            <p className="text-muted-foreground mb-6">
              Berikut adalah rekomendasi makanan sehat yang dipilih untuk Anda
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedFoods.map((food) => (
                <Card key={food.id} className="overflow-hidden hover:shadow-lg transition-shadow py-6">
                  <div className="relative h-40 w-full">
                    <Image src={food.image || "/placeholder.svg"} alt={food.name} fill className="object-cover" />
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium">{food.calories} kkal</span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{food.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{food.cookTime}</span>
                      <ChefHat className="h-4 w-4 ml-2" />
                      <span>{food.difficulty}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-3">{food.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Protein: {food.nutrition.protein}%
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Karbo: {food.nutrition.carbs}%
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Lemak: {food.nutrition.fat}%
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/50 hover:text-green-700 dark:hover:text-green-400"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Resep
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl text-green-700 dark:text-green-400">{food.name}</DialogTitle>
                          <DialogDescription>{food.description}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Info Nutrisi */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {food.calories}
                              </div>
                              <div className="text-xs text-muted-foreground">Kalori</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {food.nutrition.protein}%
                              </div>
                              <div className="text-xs text-muted-foreground">Protein</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                {food.nutrition.carbs}%
                              </div>
                              <div className="text-xs text-muted-foreground">Karbohidrat</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {food.nutrition.fat}%
                              </div>
                              <div className="text-xs text-muted-foreground">Lemak</div>
                            </div>
                          </div>

                          {/* Info Memasak */}
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{food.cookTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ChefHat className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{food.difficulty}</span>
                            </div>
                          </div>

                          {/* Bahan-bahan */}
                          <div>
                            <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">Bahan-bahan:</h3>
                            <ul className="space-y-1">
                              {food.ingredients.map((ingredient, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Cara Memasak */}
                          <div>
                            <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">Cara Memasak:</h3>
                            <ol className="space-y-2">
                              {food.instructions.map((instruction, index) => (
                                <li key={index} className="text-sm flex gap-3">
                                  <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                    {index + 1}
                                  </span>
                                  {instruction}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Riwayat Analisis</h2>
            <Button onClick={loadHistoryData} variant="outline" size="sm" disabled={historyLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${historyLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {historyLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="overflow-hidden animate-pulse py-6">
                  <div className="h-32 w-full bg-gray-200 dark:bg-gray-700"></div>
                  <CardContent className="p-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : historyError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Gagal memuat riwayat analisis: {historyError}</AlertDescription>
            </Alert>
          ) : historyData.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <Salad className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Belum Ada Riwayat</h3>
                <p className="text-sm text-muted-foreground">Mulai analisis makanan untuk melihat riwayat di sini</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {historyData.slice(0, displayCount).map((item, index) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-32 w-full">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=150&width=300&text=No+Image"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Salad className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      {item.status === "healthy" ? (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Sehat
                        </div>
                      ) : (
                        <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Perlu Perhatian
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>

                      {/* Confidence Score */}
                      {item.confidence && (
                        <div className="text-xs text-muted-foreground">Keyakinan: {item.confidence}%</div>
                      )}

                      {/* Calories */}
                      {item.calories && (
                        <div className="text-xs text-muted-foreground">Kalori: {item.calories} kkal</div>
                      )}

                      {/* Date */}
                      <div className="text-xs text-muted-foreground">{formatDate(item.date)}</div>

                      {/* Nutrition Info */}
                      <div className="flex gap-1 flex-wrap">
                        {item.nutrition.protein && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            P: {item.nutrition.protein}g
                          </Badge>
                        )}
                        {item.nutrition.carbs && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            C: {item.nutrition.carbs}g
                          </Badge>
                        )}
                        {item.nutrition.fat && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            F: {item.nutrition.fat}g
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Show more button jika ada lebih dari 8 item */}
          {historyData.length > displayCount && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={handleShowMore}
                // onClick={() => {
                //   toast({
                //     title: "Fitur Segera Hadir",
                //     description: "Fitur untuk melihat lebih banyak riwayat akan segera tersedia.",
                //   })
                // }}
              >
                Lihat Lebih Banyak ({historyData.length - displayCount} lainnya)
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
