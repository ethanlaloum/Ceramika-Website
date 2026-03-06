"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter, Mail, Phone, Smartphone, MapPin, Linkedin } from "lucide-react"
import { FadeIn, Stagger } from "@/components/animations"

export function Footer() {

  const footerSections = [
    {
      title: "Informations",
      links: [
        { href: "/mentions-legales", label: "Mentions Légales" },
        { href: "/terms", label: "Conditions Générales de Vente" },
        { href: "/privacy", label: "Politique de Confidentialité" },
      ],
    },
  ]

  return (
    <footer className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <FadeIn className="lg:col-span-2">
            <div>
              <h3 className="font-playfair text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                <span className="bg-gradient-to-r from-stone-800 to-stone-600 dark:from-stone-100 dark:to-stone-300 bg-clip-text text-transparent">
                  CéramiKa
                </span>
              </h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm mb-6 max-w-md">
                Biscuits en céramique 100% Made In France fabriqués dans notre atelier à Vallauris, au cœur d’un territoire reconnu pour son savoir-faire artisanal.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <Mail className="h-4 w-4" />
                  <span>contact@cerami-ka.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <Smartphone className="h-4 w-4" />
                  <span>07 78 57 38 46</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <Phone className="h-4 w-4" />
                  <span>04 93 64 48 94</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <MapPin className="h-4 w-4" />
                  <span>10 rue Solférino - 06220 Vallauris</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Link
                  href="https://www.instagram.com/ceramika_vallauris?igsh=NzgyZXRkOGF3eGph"
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/sas-c%C3%A9ramika/"
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Footer Links */}
          <Stagger staggerDelay={0.1} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-stone-800 dark:text-stone-100 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Stagger>
        </div>

        {/* Copyright */}
        <FadeIn delay={0.6}>
          <div className="border-t border-stone-200 dark:border-stone-700 mt-8 pt-8 text-center">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              &copy; 2026 CéramiKa - Tous droits réservés
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
