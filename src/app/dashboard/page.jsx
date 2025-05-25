"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, RefreshCw, Check, X, Info, Salad } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result)
        setAnalyzed(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    toast({
      title: "Akses Kamera",
      description: "Fitur kamera akan tersedia dalam versi berikutnya.",
    })
  }

  const analyzeFood = () => {
    if (!selectedImage) {
      toast({
        title: "Tidak ada gambar",
        description: "Silakan unggah gambar makanan terlebih dahulu.",
        variant: "destructive",
      })
      return
    }

    setAnalyzing(true)

    setTimeout(() => {
      setAnalyzing(false)
      setAnalyzed(true)
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
    <div className="container py-8  m-[40px]">
      <h1 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-400  m-[40px]">Dashboard Analisis Makanan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6  m-[40px]">
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
                          <p className="text-sm text-muted-foreground">
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
                    <div
                      className="relative w-full max-w-md h-64 border-2 border-dashed border-green-200 dark:border-green-800 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                      onClick={handleCameraCapture}
                    >
                      <Camera className="h-10 w-10 text-green-500 mb-2" />
                      <p className="text-sm text-muted-foreground">Klik untuk mengakses kamera</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center">
                <Button
                  onClick={analyzeFood}
                  disabled={!selectedImage || analyzing}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
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
        <div className="mt-8  m-[40px]">
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
                  src={`/globe.svg?height=150&width=300`}
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
