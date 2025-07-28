"use client"

import React, { useRef, useEffect } from 'react'
import styles from './SayAboutUs.module.css'

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing platform! Found the perfect badminton court near my home."
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 5,
    comment: "Great variety of venues and academies."
  },
  {
    id: 3,
    name: "Priya Sharma",
    rating: 4,
    comment: "Love the user interface."
  },
  {
    id: 4,
    name: "David Wilson",
    rating: 5,
    comment: "The whole process from search to payment took less than 2 minutes!"
  },
  {
    id: 5,
    name: "Aisha Khan",
    rating: 5,
    comment: "The platform is a game-changer for sports enthusiasts like me."
  }
]

export default function SayAboutUs() {
  const containerRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const scroll = scrollRef.current

    let animationFrameId
    let scrollAmount = 0
    const speed = 0.5 // Adjust speed here (lower = slower)

    const scrollContent = () => {
      if (!scroll) return // Add null check
      scrollAmount += speed
      if (scrollAmount >= scroll.scrollWidth / 2) {
        scrollAmount = 0
      }
      scroll.style.transform = `translateX(-${scrollAmount}px)`
      animationFrameId = requestAnimationFrame(scrollContent)
    }

    animationFrameId = requestAnimationFrame(scrollContent)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Duplicate the testimonials for seamless looping
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>What Our Users Say</h2>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.scrollContainer} ref={scrollRef}>
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className={styles.card}>
              <div className={styles.header}>
                <h3 className={styles.name}>{testimonial.name}</h3>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={styles.comment}>"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}