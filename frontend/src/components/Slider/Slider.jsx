"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Trophy } from "lucide-react"
import "./Slider.css"

const slides = [
  {
    id: 1,
    title: "GROOVITI EVENTS",
    subtitle: "Premium Experiences",
    category: "Events",
    image: "/images/events.jpg",
    description: "Discover exclusive events, concerts, and premium experiences curated just for you.",
    features: "Colleges",
    capacity: "Venues",
    type: "All Categories",
  },
  {
    id: 2,
    title: "GROOVITI SPORTS",
    subtitle: "Athletic Excellence",
    category: "Sports",
    image: "/images/sp.jpg",
    description: "Join the ultimate sports community with training, competitions, and athletic events.",
    features: "Academy",
    capacity: "Play Together",
    type: "All Categories",
  },
]

export default function GroovitiSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === activeIndex) return
    setIsTransitioning(true)
    setActiveIndex(index)
  }

  const handleExploreClick = () => {
    if (activeIndex === 0) {
      // Handle Events click - you can add events URL here later
       window.open("http://localhost:5173/event", "_blank")
    } else {
      // Open sports section in new tab
      window.open("https://www.sports.grooviti.com/", "_blank")
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 800)
    return () => clearTimeout(timer)
  }, [activeIndex])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        prevSlide()
      } else if (event.key === "ArrowRight") {
        nextSlide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const activeSlide = slides[activeIndex]

  return (
    <div className="grooviti-slider">
      {/* Header */}
      <header className="slider-header">
        <div className="header-content">
          <div className="logo"></div>
        </div>
      </header>

      {/* Main Slider Container */}
      <div className="slider-container">
        {/* Background Image with Overlay */}
        <div className="background-image">
          <img src={activeSlide.image || "/placeholder.svg"} alt={activeSlide.title} className="bg-img" />
        </div>

        {/* Content Container */}
        <div className="content-container">
          <div className="content-wrapper">
            <div className="content-header">
              <div className="category-badge">
                <span className="category-text">{activeSlide.category}</span>
                <div className="category-line"></div>
              </div>

              <h1 className={`main-title ${isTransitioning ? "transitioning" : ""}`}>{activeSlide.title}</h1>
              <p className={`main-subtitle ${isTransitioning ? "transitioning" : ""}`}>{activeSlide.subtitle}</p>
            </div>

            <p className={`description ${isTransitioning ? "transitioning" : ""}`}>{activeSlide.description}</p>

            <div className={`features ${isTransitioning ? "transitioning" : ""}`}>
              <div className="feature-item">
                <div className="feature-background">
                  <Trophy className="feature-icon" />
                  <span>{activeSlide.features}</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-background">
                  <Users className="feature-icon" />
                  <span>{activeSlide.capacity}</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-background">
                  <Calendar className="feature-icon" />
                  <span>{activeSlide.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="action-button-container">
          {activeIndex === 0 ? (
            <button className="action-button" onClick={handleExploreClick}>
              Explore Events
            </button>
          ) : (
            <button className="action-button" onClick={handleExploreClick}>
              Explore Sports
            </button>
          )}
        </div>

        <div className="navigation-controls">
          <div className="controls-wrapper">
            <div className="slide-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`indicator ${index === activeIndex ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
