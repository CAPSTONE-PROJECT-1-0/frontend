import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Utensils, Leaf, Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center m-[40px]" >
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container relative z-10 flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Rekomendasi Makanan Sehat <span className="text-green-400">Oishi Life</span>
          </h1>
          <p className="max-w-[700px] text-white md:text-xl">
            Analisis keseimbangan gizi makanan Anda dan dapatkan rekomendasi makanan sehat dengan bahan yang sama.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/dashboard">Mulai Sekarang</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              <Link href="/about">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-green-50 dark:bg-green-950/20">
        <div className="container grid gap-6 md:gap-10">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-700 dark:text-green-400">
              Fitur Utama
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Nikmati kemudahan menganalisis makanan Anda dengan teknologi canggih kami.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 m-[40px]" >
            <Card className="border-2 border-green-100 dark:border-green-900/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Camera className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <CardTitle>Foto Makanan</CardTitle>
                  <CardDescription>Ambil foto makanan langsung dari kamera</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gunakan kamera perangkat Anda untuk memfoto makanan dan mendapatkan analisis gizi secara instan.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-100 dark:border-green-900/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <CardTitle>Unggah Gambar</CardTitle>
                  <CardDescription>Unggah gambar makanan dari galeri</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pilih dan unggah gambar makanan dari galeri perangkat Anda untuk dianalisis.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-100 dark:border-green-900/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Utensils className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <CardTitle>Rekomendasi Makanan</CardTitle>
                  <CardDescription>Dapatkan alternatif makanan sehat</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Terima rekomendasi makanan sehat dengan bahan yang sama berdasarkan analisis gizi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container grid gap-6 md:gap-10">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-700 dark:text-green-400">
              Cara Kerja
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Proses sederhana untuk mendapatkan rekomendasi makanan sehat.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Camera className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Langkah 1</h3>
              <p className="text-muted-foreground">Ambil foto makanan atau unggah gambar dari galeri Anda.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Langkah 2</h3>
              <p className="text-muted-foreground">Sistem kami menganalisis keseimbangan gizi makanan Anda.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Langkah 3</h3>
              <p className="text-muted-foreground">Dapatkan rekomendasi makanan sehat dengan bahan yang sama.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-green-600 dark:bg-green-800">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Mulai Hidup Sehat Sekarang
          </h2>
          <p className="max-w-[700px] text-white/80 md:text-xl">
            Bergabunglah dengan ribuan pengguna yang telah meningkatkan pola makan mereka dengan Oishi Life.
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90">
            <Link href="/dashboard">Mulai Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
