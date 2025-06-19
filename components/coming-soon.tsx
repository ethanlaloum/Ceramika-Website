"use client"

import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn, Floating } from "@/components/animations"

interface ComingSoonProps {
  title?: string
  description?: string
  backLink?: string
  backLabel?: string
}

export function ComingSoon({ title, description, backLink = "/", backLabel }: ComingSoonProps) {

  const defaultTitle = title || "Bientôt Disponible"
  const defaultDescription =
    description || "Nous travaillons dur pour vous apporter cette fonctionnalité. Restez à l'écoute !"
  const defaultBackLabel = backLabel || "Retour à l'accueil"

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Floating Animation Elements */}
          <div className="relative mb-12">
            <Floating duration={4} delay={0} className="absolute -top-10 -left-10 opacity-20">
              <div className="w-8 h-8 bg-stone-400 dark:bg-stone-600 rounded-full" />
            </Floating>
            <Floating duration={3} delay={1} className="absolute -top-5 right-10 opacity-20">
              <div className="w-6 h-6 bg-stone-500 dark:bg-stone-500 rounded-full" />
            </Floating>
            <Floating duration={5} delay={2} className="absolute top-20 -right-5 opacity-20">
              <div className="w-4 h-4 bg-stone-600 dark:bg-stone-400 rounded-full" />
            </Floating>

            <FadeIn>
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Clock className="h-24 w-24 text-stone-300 dark:text-stone-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-600 dark:from-stone-100 dark:to-stone-300 opacity-20 rounded-full animate-pulse" />
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-6">
              <span className="bg-gradient-to-r from-stone-800 via-stone-600 to-stone-800 dark:from-stone-100 dark:via-stone-300 dark:to-stone-100 bg-clip-text text-transparent">
                {defaultTitle}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-xl text-stone-600 dark:text-stone-300 mb-12 max-w-lg mx-auto leading-relaxed">
              {defaultDescription}
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <Button variant="outline" asChild className="hover:scale-105 transition-transform duration-300">
              <Link href={backLink}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {defaultBackLabel}
              </Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
