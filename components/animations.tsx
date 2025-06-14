"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Fade In Animation
interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export function FadeIn({ children, delay = 0, duration = 0.6, className, direction = "up" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(30px)"
      case "down":
        return "translateY(-30px)"
      case "left":
        return "translateX(30px)"
      case "right":
        return "translateX(-30px)"
      default:
        return "translateY(30px)"
    }
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : getTransform(),
        transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {children}
    </div>
  )
}

// Stagger Animation
interface StaggerProps {
  children: React.ReactNode[]
  delay?: number
  staggerDelay?: number
  className?: string
}

export function Stagger({ children, delay = 0, staggerDelay = 0.1, className }: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={delay + index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

// Hover Scale Animation
interface HoverScaleProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

export function HoverScale({ children, scale = 1.05, className }: HoverScaleProps) {
  return (
    <div
      className={cn("transition-transform duration-300 ease-out", className)}
      style={{
        transform: "scale(1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      {children}
    </div>
  )
}

// Parallax Effect
interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffset(rate)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  )
}

// Floating Animation
interface FloatingProps {
  children: React.ReactNode
  duration?: number
  delay?: number
  className?: string
}

export function Floating({ children, duration = 3, delay = 0, className }: FloatingProps) {
  return (
    <div
      className={cn("animate-float", className)}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// Magnetic Effect
interface MagneticProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0px, 0px)"
  }

  return (
    <div
      ref={ref}
      className={cn("transition-transform duration-300 ease-out", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// Reveal Animation
interface RevealProps {
  children: React.ReactNode
  className?: string
}

export function Reveal({ children, className }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "transition-all duration-1000 ease-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  )
}
