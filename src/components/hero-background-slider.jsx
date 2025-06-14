"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const HeroBackgroundSlider = ({ children }) => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const healthyFoodImages = [
        {
            src: "/images/caesar-salad.jpg",
            alt: "caesar-salad",
        },
        {
            src: "/images/club_sandwich_16496_16x9.jpg.webp",
            alt: "club_sandwich",
        },
        {
            src: "/images/Eggs-Benedict.jpg",
            alt: "Eggs-Benedict",
        },
        {
            src: "/images/pcc-rosemary-grilled-salmon-flo.jpg",
            alt: "grilled salmon",
        },
        {
            src: "/images/vegan-miso-soup.jpg",
            alt: "vegan-miso-soup",
        },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % healthyFoodImages.length)
        }, 5000) 

        return () => clearInterval(interval)
    }, [healthyFoodImages.length])

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Background Images */}
            {healthyFoodImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        quality={85}
                    />
                </div>
            ))}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>

            {/* Content */}
            <div className="relative z-10 h-full">{children}</div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex space-x-2">
                    {healthyFoodImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
                <div
                    className="h-full bg-green-400 transition-all duration-300 ease-linear"
                    style={{
                        width: `${((currentSlide + 1) / healthyFoodImages.length) * 100}%`,
                    }}
                />
            </div>
        </div>
    )
}

export default HeroBackgroundSlider
