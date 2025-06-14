"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface GlobalLoaderProps {
  isLoading: boolean
  message?: string
}

export function GlobalLoader({ isLoading, message }: GlobalLoaderProps) {
  const [show, setShow] = useState(false)

  // Ajouter un léger délai avant d'afficher le loader pour éviter les flashs
  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isLoading) {
      timeout = setTimeout(() => setShow(true), 300)
    } else {
      setShow(false)
    }

    return () => clearTimeout(timeout)
  }, [isLoading])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-20 h-20 animate-spin-slow">
        <Image src="/logo-ceramika.svg" alt="Chargement..." fill className="object-contain" priority />
      </div>
      {message && <p className="mt-4 text-gray-700 font-medium">{message}</p>}
    </div>
  )
}
