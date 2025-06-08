"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
    Heart,
    Shield,
    Zap,
    Apple,
    Fish,
    Leaf,
    Droplets,
    Activity,
    BookOpen,
    ChevronRight,
    Star,
    Clock,
    Target,
    TrendingUp,
} from "lucide-react"

export default function EducationPage() {
    const [activeSection, setActiveSection] = useState(0)
    const [isVisible, setIsVisible] = useState({})
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible((prev) => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting,
                    }))
                })
            },
            { threshold: 0.1 },
        )

        const sections = document.querySelectorAll("[data-animate]")
        sections.forEach((section) => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    const nutritionBasics = [
        {
            icon: <Zap className="h-8 w-8" />,
            title: "Karbohidrat",
            description: "Sumber energi utama tubuh",
            details: "45-65% dari total kalori harian",
            color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
            foods: ["Nasi merah", "Quinoa", "Ubi jalar", "Oatmeal"],
        },
        {
            icon: <Activity className="h-8 w-8" />,
            title: "Protein",
            description: "Membangun dan memperbaiki jaringan",
            details: "10-35% dari total kalori harian",
            color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
            foods: ["Ikan salmon", "Tahu", "Telur", "Kacang almond"],
        },
        {
            icon: <Droplets className="h-8 w-8" />,
            title: "Lemak Sehat",
            description: "Mendukung fungsi otak dan hormon",
            details: "20-35% dari total kalori harian",
            color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            foods: ["Alpukat", "Minyak zaitun", "Kacang-kacangan", "Ikan berlemak"],
        },
        {
            icon: <Leaf className="h-8 w-8" />,
            title: "Vitamin & Mineral",
            description: "Mendukung sistem imun dan metabolisme",
            details: "Dari berbagai sayur dan buah",
            color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            foods: ["Bayam", "Brokoli", "Jeruk", "Wortel"],
        },
    ]

    const healthConditions = [
        {
            condition: "Diabetes",
            icon: <Target className="h-6 w-6" />,
            description: "Makanan dengan indeks glikemik rendah",
            foods: [
                {
                    name: "Beras Merah",
                    benefit: "Mengontrol gula darah",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/beras-merah.jfif",
                },
                {
                    name: "Ikan Salmon",
                    benefit: "Omega-3 untuk jantung",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/manfaat-ikan-salmon.webp",
                },
                {
                    name: "Sayuran Hijau",
                    benefit: "Serat tinggi, kalori rendah",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/sayuran-hijau.jpg",
                },
            ],
            tips: ["Makan dalam porsi kecil tapi sering", "Hindari makanan tinggi gula", "Pilih karbohidrat kompleks"],
            color: "border-blue-200 dark:border-blue-800",
        },
        {
            condition: "Hipertensi",
            icon: <Heart className="h-6 w-6" />,
            description: "Makanan rendah sodium, tinggi kalium",
            foods: [
                {
                    name: "Pisang",
                    benefit: "Tinggi kalium",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/pisang.jpeg",
                },
                {
                    name: "Oatmeal",
                    benefit: "Menurunkan kolesterol",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/oatmel.jpg",
                },
                {
                    name: "Yogurt Rendah Lemak",
                    benefit: "Kalsium untuk jantung",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/yougurt-rendah-lemak.jpg",
                },
            ],
            tips: ["Batasi asupan garam < 2300mg/hari", "Perbanyak buah dan sayur", "Hindari makanan olahan"],
            color: "border-red-200 dark:border-red-800",
        },
        {
            condition: "Kolesterol Tinggi",
            icon: <TrendingUp className="h-6 w-6" />,
            description: "Makanan tinggi serat, rendah lemak jenuh",
            foods: [
                {
                    name: "Alpukat",
                    benefit: "Lemak tak jenuh tunggal",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/alpukat.jpg",
                },
                {
                    name: "Kacang Almond",
                    benefit: "Menurunkan LDL",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/kcang-almond.webp",
                },
                {
                    name: "Apel",
                    benefit: "Serat larut tinggi",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/apel.jfif",
                },
            ],
            tips: ["Konsumsi serat 25-30g per hari", "Pilih protein tanpa lemak", "Batasi lemak jenuh"],
            color: "border-yellow-200 dark:border-yellow-800",
        },
        {
            condition: "Obesitas",
            icon: <Activity className="h-6 w-6" />,
            description: "Makanan rendah kalori, tinggi nutrisi",
            foods: [
                {
                    name: "Brokoli",
                    benefit: "Rendah kalori, tinggi serat",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/brokoli.webp",
                },
                {
                    name: "Ikan Tuna",
                    benefit: "Protein tinggi, lemak rendah",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/ikan tuna.jpeg",
                },
                {
                    name: "Quinoa",
                    benefit: "Protein lengkap",
                    image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/quinoa.webp",
                },
            ],
            tips: ["Kontrol porsi makan", "Makan perlahan dan mindful", "Perbanyak aktivitas fisik"],
            color: "border-purple-200 dark:border-purple-800",
        },
    ]

    const superfoods = [
        {
            name: "Salmon",
            category: "Protein",
            benefits: ["Omega-3", "Protein tinggi", "Vitamin D"],
            image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/manfaat-ikan-salmon.webp",
            rating: 5,
        },
        {
            name: "Blueberry",
            category: "Buah",
            benefits: ["Antioksidan", "Vitamin C", "Serat"],
            image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/blubery.jpg",
            rating: 5,
        },
        {
            name: "Quinoa",
            category: "Biji-bijian",
            benefits: ["Protein lengkap", "Serat", "Mineral"],
            image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/quinoa.webp",
            rating: 4,
        },
        {
            name: "Alpukat",
            category: "Buah",
            benefits: ["Lemak sehat", "Kalium", "Folat"],
            image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/alpukat.jpg",
            rating: 5,
        },
        {
            name: "Bayam",
            category: "Sayuran",
            benefits: ["Zat besi", "Folat", "Vitamin K"],
            image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/bayam.jpeg",
            rating: 4,
        },
        {
            name: "Kacang Almond",
            category: "Kacang",
            benefits: ["Vitamin E", "Magnesium", "Protein"],
            image: "https://1xg7ah.leapcellobj.com/team-capstone-y434-dncs-vqmu666g/kcang-almond.webp",
            rating: 4,
        },
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-10"></div>
                <div className="container relative z-10">
                    <div
                        className={`text-center transition-all duration-1000 ${isVisible.hero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}
                        id="hero"
                        data-animate
                    >
                        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6 animate-bounce">
                            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-green-700 dark:text-green-300 font-medium">Pusat Edukasi Nutrisi</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Panduan Lengkap
                            <br />
                            Makanan Sehat
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            Pelajari nutrisi yang tepat untuk tubuh Anda dan temukan rekomendasi makanan sehat berdasarkan kondisi
                            kesehatan spesifik
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 group">
                                <Link href="#learn-nutrition">Learn More</Link>

                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/dashboard">Analisis Makanan Saya</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-float">
                    <div className="bg-green-200 dark:bg-green-800 p-3 rounded-full">
                        <Apple className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="absolute top-32 right-16 animate-float-delayed">
                    <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-full">
                        <Fish className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <div className="absolute bottom-20 left-20 animate-float">
                    <div className="bg-purple-200 dark:bg-purple-800 p-3 rounded-full">
                        <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
            </section>

            {/* Nutrition Basics */}
            <section className="py-20 bg-background">
                <div className="container">
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible.nutrition ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}
                        id="nutrition"
                        data-animate
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700 dark:text-green-400">
                            Dasar-Dasar Nutrisi
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Memahami makronutrien dan mikronutrien yang dibutuhkan tubuh untuk kesehatan optimal
                        </p>
                    </div>

                    <div id="learn-nutrition" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nutritionBasics.map((item, index) => (
                            <Card
                                key={index}
                                className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 ${isVisible.nutrition ? "animate-slide-up" : ""
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="text-center">
                                    <div
                                        className={`inline-flex p-4 rounded-full ${item.color} mx-auto mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        {item.icon}
                                    </div>
                                    <CardTitle className="text-xl">{item.title}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center mb-4">
                                        <Badge variant="secondary" className="text-xs">
                                            {item.details}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Sumber terbaik:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {item.foods.map((food, foodIndex) => (
                                                <Badge key={foodIndex} variant="outline" className="text-xs">
                                                    {food}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Superfoods Section */}
            <section className="py-20 bg-green-50 dark:bg-green-950/20">
                <div className="container">
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible.superfoods ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}
                        id="superfoods"
                        data-animate
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700 dark:text-green-400">
                            Superfood Pilihan
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Makanan dengan kandungan nutrisi tertinggi yang memberikan manfaat luar biasa bagi kesehatan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {superfoods.map((food, index) => (
                            <Card
                                key={index}
                                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${isVisible.superfoods ? "animate-slide-up" : ""
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <Image
                                        src={food.image || "/placeholder.svg"}
                                        alt={food.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                                        <Badge variant="secondary" className="text-xs">
                                            {food.category}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold">{food.name}</h3>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < food.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {food.benefits.map((benefit, benefitIndex) => (
                                            <Badge key={benefitIndex} variant="outline" className="text-xs">
                                                {benefit}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Health Conditions */}
            <section className="py-20 bg-background">
                <div className="container">
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible.conditions ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}
                        id="conditions"
                        data-animate
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700 dark:text-green-400">
                            Rekomendasi Berdasarkan Kondisi Kesehatan
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Panduan makanan sehat yang disesuaikan dengan kondisi kesehatan spesifik untuk membantu pengelolaan dan
                            pencegahan penyakit
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {healthConditions.map((condition, index) => (
                            <Card
                                key={index}
                                className={`${condition.color} hover:shadow-lg transition-all duration-300 ${isVisible.conditions ? "animate-slide-up" : ""
                                    }`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">{condition.icon}</div>
                                        <div>
                                            <CardTitle className="text-xl">{condition.condition}</CardTitle>
                                            <CardDescription>{condition.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Recommended Foods */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Apple className="h-4 w-4" />
                                            Makanan Direkomendasikan
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {condition.foods.map((food, foodIndex) => (
                                                <div key={foodIndex} className="text-center group">
                                                    <div className="relative h-16 w-16 mx-auto mb-2 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={food.image || "/placeholder.svg"}
                                                            alt={food.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    </div>
                                                    <p className="text-xs font-medium">{food.name}</p>
                                                    <p className="text-xs text-muted-foreground">{food.benefit}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tips */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Tips Penting
                                        </h4>
                                        <ul className="space-y-2">
                                            {condition.tips.map((tip, tipIndex) => (
                                                <li key={tipIndex} className="flex items-start gap-2 text-sm">
                                                    <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Daily Tips */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="container">
                    <div
                        className={`text-center transition-all duration-1000 ${isVisible.tips ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}
                        id="tips"
                        data-animate
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">Tips Harian untuk Hidup Sehat</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <Clock className="h-8 w-8" />,
                                    title: "Makan Teratur",
                                    tip: "3 kali makan utama + 2 snack sehat",
                                },
                                {
                                    icon: <Droplets className="h-8 w-8" />,
                                    title: "Hidrasi Cukup",
                                    tip: "8-10 gelas air putih per hari",
                                },
                                {
                                    icon: <Leaf className="h-8 w-8" />,
                                    title: "5 Porsi Sayur Buah",
                                    tip: "Variasi warna untuk nutrisi lengkap",
                                },
                                {
                                    icon: <Activity className="h-8 w-8" />,
                                    title: "Aktivitas Fisik",
                                    tip: "30 menit olahraga ringan setiap hari",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className={`text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 ${isVisible.tips ? "animate-slide-up" : ""
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">{item.icon}</div>
                                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                    <p className="text-white/80">{item.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-background">
                <div className="container text-center">
                    <div
                        className={`transition-all duration-1000 ${isVisible.cta ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            }`}
                        id="cta"
                        data-animate
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700 dark:text-green-400">
                            Siap Memulai Hidup Sehat?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Gunakan aplikasi Oishi Life untuk menganalisis makanan Anda dan mendapatkan rekomendasi personal
                        </p>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8 animate-slide-up justify-center">
                            {isAuthenticated ? (
                                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg">
                                    <Link href="/dashboard">Coba Analisis Makanan</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg">
                                        <Link href="/register">Mulai Sekarang</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="bg-white/10 text-black hover:bg-white/20 border-green-600 shadow-lg shadow-green-600/30 backdrop-blur-sm"
                                    >
                                        <Link href="/login">Login</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
