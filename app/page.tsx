"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown, Play, Users, Zap, Star, Mail, Phone, MapPin, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Fixed3DSlideLanding() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement[]>([])
  const totalSlides = 5
  const isScrollingRef = useRef(false)

  // Optimized scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        const maxScroll = (totalSlides - 1) * windowHeight

        // Calculate scroll progress (0 to 1)
        const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1)
        setScrollProgress(progress)

        // Calculate current slide
        const slideProgress = progress * (totalSlides - 1)
        const newSlide = Math.round(slideProgress)
        setCurrentSlide(Math.max(0, Math.min(newSlide, totalSlides - 1)))

        // Apply 3D transforms to all slides
        slidesRef.current.forEach((slide, index) => {
          if (slide) {
            const transform = getSlideTransform(index, slideProgress)
            slide.style.transform = transform.transform
            slide.style.opacity = transform.opacity.toString()
            slide.style.zIndex = transform.zIndex.toString()
          }
        })

        isScrollingRef.current = false
      })
    }
  }, [totalSlides])

  useEffect(() => {
    // Set initial document height
    document.body.style.height = `${totalSlides * 100}vh`

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.body.style.height = "auto"
    }
  }, [handleScroll, totalSlides])

  const getSlideTransform = (slideIndex: number, currentProgress: number) => {
    const distance = slideIndex - currentProgress

    // Enhanced 3D calculations
    const translateZ = distance * -300 // Increased backward movement
    const rotateX = Math.max(-45, Math.min(45, distance * 20)) // Controlled rotation
    const rotateY = Math.max(-15, Math.min(15, distance * 5)) // Subtle Y rotation
    const scale = Math.max(0.6, 1 - Math.abs(distance) * 0.15) // More pronounced scaling
    const opacity = Math.max(0.1, 1 - Math.abs(distance) * 0.4) // Better opacity control

    return {
      transform: `translate3d(0, 0, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: Math.round(100 - Math.abs(distance) * 10),
    }
  }

  const scrollToSlide = (slideIndex: number) => {
    const targetScroll = slideIndex * window.innerHeight
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    })
  }

  const addSlideRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      slidesRef.current[index] = el
    }
  }

  return (
    <div className="relative">
      {/* 3D Perspective Container */}
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden perspective-container"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Slide Navigation Dots */}
        <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white scale-125 shadow-lg ring-2 ring-white/50"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Slide 1: Hero */}
        <div
          ref={(el) => addSlideRef(el, 0)}
          className="slide-container absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                Future Vision 3D
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Experience the next dimension of digital innovation with immersive 3D presentations that captivate and
                engage
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-white text-purple-900 hover:bg-blue-50 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl transform-gpu"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Journey
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-900 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
                >
                  Explore More
                </Button>
              </div>
            </div>
          </div>
          <ChevronDown className="absolute bottom-8 left-1/2 transform -translate-x-1/2 h-8 w-8 animate-bounce text-white/80" />
        </div>

        {/* Slide 2: Features */}
        <div
          ref={(el) => addSlideRef(el, 1)}
          className="slide-container absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-16 text-slate-800">
              Revolutionary Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "3D Performance",
                  desc: "Hardware-accelerated 3D transformations for buttery smooth experiences",
                  color: "from-yellow-400 to-orange-500",
                },
                {
                  icon: Users,
                  title: "Immersive Design",
                  desc: "Depth-based interactions that engage users on multiple sensory levels",
                  color: "from-blue-400 to-purple-500",
                },
                {
                  icon: Star,
                  title: "Premium Experience",
                  desc: "Cinema-quality presentations with professional polish and attention to detail",
                  color: "from-green-400 to-teal-500",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="feature-card transform transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:-translate-y-4 cursor-pointer group"
                >
                  <CardContent className="p-6 md:p-8 text-center relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <feature.icon className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-4 md:mb-6 text-blue-600 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed">{feature.desc}</p>
                    <div className="mt-4 md:mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ArrowRight className="h-5 w-5 mx-auto text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 3: Services */}
        <div
          ref={(el) => addSlideRef(el, 2)}
          className="slide-container absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900 to-teal-900 text-white"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
              <div className="space-y-6 md:space-y-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-100 leading-tight">
                  Our Services
                </h2>
                <p className="text-lg md:text-xl text-emerald-200 leading-relaxed">
                  We deliver cutting-edge 3D experiences that transform how users interact with digital content,
                  creating memorable and impactful user journeys.
                </p>
                <div className="space-y-4">
                  {[
                    "3D Web Development & Optimization",
                    "Interactive Presentation Design",
                    "Immersive User Interface Creation",
                    "Performance & Accessibility Auditing",
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 transform hover:translate-x-2 transition-all duration-300 cursor-pointer group"
                    >
                      <Check className="h-6 w-6 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-base md:text-lg text-emerald-200 group-hover:text-white transition-colors duration-300">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="stats-card bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 transform hover:scale-105 transition-all duration-500">
                  <div className="grid grid-cols-2 gap-4 md:gap-6 text-center">
                    {[
                      { value: "500+", label: "Projects Delivered" },
                      { value: "98%", label: "Client Satisfaction" },
                      { value: "24/7", label: "Support Available" },
                      { value: "50ms", label: "Average Load Time" },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="stat-item transform hover:scale-110 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2 group-hover:text-white transition-colors duration-300">
                          {stat.value}
                        </div>
                        <div className="text-emerald-200 text-xs md:text-sm group-hover:text-emerald-100 transition-colors duration-300">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 4: Portfolio */}
        <div
          ref={(el) => addSlideRef(el, 3)}
          className="slide-container absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-16 text-slate-800">
              Success Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "E-Commerce Revolution",
                  description:
                    "Transformed online shopping with 3D product visualization, increasing conversions by 340% and reducing return rates significantly",
                  metrics: "340% increase in conversions",
                  category: "E-Commerce",
                },
                {
                  title: "Educational Platform",
                  description:
                    "Created immersive learning experiences that improved student engagement by 250% and knowledge retention by 180%",
                  metrics: "250% better engagement",
                  category: "Education",
                },
              ].map((project, index) => (
                <Card
                  key={index}
                  className="portfolio-card group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl"
                >
                  <CardContent className="p-0 overflow-hidden">
                    <div className="relative h-40 md:h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                      <div className="text-white text-4xl md:text-6xl font-bold opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                        3D
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed text-sm md:text-base">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {project.metrics}
                        </span>
                        <ArrowRight className="h-5 w-5 text-blue-600 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 5: Contact */}
        <div
          ref={(el) => addSlideRef(el, 4)}
          className="slide-container absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-16">
              Let's Create Together
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-200">Ready for the Future?</h3>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                  Transform your digital presence with cutting-edge 3D experiences that captivate, convert, and create
                  lasting impressions on your audience.
                </p>
                <div className="space-y-4 md:space-y-6">
                  {[
                    { icon: Mail, text: "hello@3dfuture.com", color: "text-blue-400" },
                    { icon: Phone, text: "+1 (555) 3D-FUTURE", color: "text-green-400" },
                    { icon: MapPin, text: "San Francisco, CA", color: "text-purple-400" },
                  ].map((contact, index) => (
                    <div
                      key={index}
                      className="contact-item flex items-center space-x-4 transform hover:translate-x-2 transition-all duration-300 cursor-pointer group"
                    >
                      <contact.icon
                        className={`h-6 w-6 ${contact.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      <span className="text-base md:text-lg text-slate-300 group-hover:text-white transition-colors duration-300">
                        {contact.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="contact-form bg-white/10 backdrop-blur-sm border-white/20 transform hover:scale-105 transition-all duration-500">
                <CardContent className="p-6 md:p-8">
                  <form className="space-y-4 md:space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="form-input p-3 md:p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="form-input p-3 md:p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="form-input w-full p-3 md:p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    />
                    <textarea
                      placeholder="Tell us about your project..."
                      rows={4}
                      className="form-input w-full p-3 md:p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-300"
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl transform-gpu"
                    >
                      Launch Project
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
