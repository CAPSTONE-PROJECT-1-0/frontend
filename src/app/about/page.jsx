import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Mail } from "lucide-react"

export default function About() {
  const teamMembers = [
    {
      name: "Takashi Yamada",
      role: "Project Lead",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Spesialis nutrisi dengan pengalaman 8 tahun dalam pengembangan aplikasi kesehatan.",
      social: {
        github: "#",
        linkedin: "#",
        email: "takashi@example.com",
      },
    },
    {
      name: "Ayu Nakamura",
      role: "UI/UX Designer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Designer dengan fokus pada pengalaman pengguna yang intuitif dan estetika Jepang modern.",
      social: {
        github: "#",
        linkedin: "#",
        email: "ayu@example.com",
      },
    },
    {
      name: "Kenji Tanaka",
      role: "Full Stack Developer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Developer dengan keahlian dalam Next.js dan pengembangan aplikasi berbasis AI.",
      social: {
        github: "#",
        linkedin: "#",
        email: "kenji@example.com",
      },
    },
    {
      name: "Sakura Ito",
      role: "Data Scientist",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Ahli dalam computer vision dan analisis nutrisi berbasis gambar.",
      social: {
        github: "#",
        linkedin: "#",
        email: "sakura@example.com",
      },
    },
    {
      name: "Hiroshi Suzuki",
      role: "Nutritionist",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Ahli gizi dengan spesialisasi dalam makanan Jepang dan pola makan seimbang.",
      social: {
        github: "#",
        linkedin: "#",
        email: "hiroshi@example.com",
      },
    },
    {
      name: "Yuki Watanabe",
      role: "Marketing Specialist",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Spesialis pemasaran digital dengan fokus pada aplikasi kesehatan dan gaya hidup.",
      social: {
        github: "#",
        linkedin: "#",
        email: "yuki@example.com",
      },
    },
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 text-green-700 dark:text-green-400">Tentang Kami</h1>
        <p className="max-w-3xl text-muted-foreground">
          HealthyNippon adalah aplikasi rekomendasi makanan sehat yang menggabungkan kecerdasan buatan dengan
          pengetahuan nutrisi untuk membantu Anda membuat pilihan makanan yang lebih sehat dengan sentuhan Jepang.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700 dark:text-green-400">Misi Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 dark:text-green-400"
                  >
                    <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM15.42 15.42l6.37-6.37a4.5 4.5 0 0 0-6.37-6.36l-6.36 6.36a4.5 4.5 0 0 0 6.36 6.37z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Kesehatan</h3>
                <p className="text-muted-foreground">
                  Mempromosikan pola makan sehat dan seimbang melalui teknologi yang mudah diakses.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 dark:text-green-400"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                    <path d="M8.5 8.5v.01"></path>
                    <path d="M16 15.5v.01"></path>
                    <path d="M12 12v.01"></path>
                    <path d="M11 17v.01"></path>
                    <path d="M7 14v.01"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Inovasi</h3>
                <p className="text-muted-foreground">
                  Menggunakan teknologi AI terbaru untuk menganalisis dan memberikan rekomendasi makanan yang personal.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 dark:text-green-400"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Edukasi</h3>
                <p className="text-muted-foreground">
                  Memberikan pengetahuan tentang nutrisi dan keseimbangan gizi untuk membantu membuat keputusan makanan
                  yang lebih baik.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700 dark:text-green-400">Tim Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-64 w-full">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex gap-3">
                  <a
                    href={member.social.github}
                    className="text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
