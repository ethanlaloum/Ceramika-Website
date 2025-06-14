"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter, Mail, Phone, Smartphone, MapPin } from "lucide-react"
import { FadeIn, Stagger } from "@/components/animations"
import { useLanguage } from "@/components/providers"

export function Footer() {
  useLanguage()

  const footerSections = [
    {
      title: "Shop",
      links: [
        { href: "/collections", label: "Collections" },
        { href: "/artists", label: "Artists" },
        { href: "/new-arrivals", label: "New Arrivals" },
        { href: "/bestsellers", label: "Bestsellers" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/shipping", label: "Shipping Info" },
        { href: "/returns", label: "Returns" },
        { href: "/care", label: "Care Instructions" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/press", label: "Press" },
        { href: "/sustainability", label: "Sustainability" },
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
                  Céramika
                </span>
              </h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm mb-6 max-w-md">
                Ustensiles en céramique fabriqués à la main par des artistes renommés, apportant le talent artistique à votre expérience culinaire quotidienne.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <Mail className="h-4 w-4" />
                  <span>contact@cerami-ka.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <Smartphone className="h-4 w-4" />
                  <span>+33 (0)7 78 57 38 46</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <Phone className="h-4 w-4" />
                  <span>+33 (0)4 93 64 48 94</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-stone-600 dark:text-stone-300">
                  <MapPin className="h-4 w-4" />
                  <span>10 rue Solférino - 06220 Vallauris</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="h-5 w-5" />
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

        {/* Newsletter Signup */}
        <FadeIn delay={0.6}>
          <div className="border-t border-stone-200 dark:border-stone-700 mt-8 pt-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="font-semibold text-stone-800 dark:text-stone-100 mb-2">Stay Updated</h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
                Subscribe to our newsletter for new arrivals and exclusive offers
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-300"
                />
                <button className="px-4 py-2 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-sm rounded-md hover:bg-stone-700 dark:hover:bg-stone-200 transition-all duration-300 hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Copyright */}
        <FadeIn delay={0.8}>
          <div className="border-t border-stone-200 dark:border-stone-700 mt-8 pt-8 text-center">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              &copy; 2025 Céramique. All rights reserved. |
              <Link href="/privacy" className="hover:text-stone-800 dark:hover:text-stone-200 ml-1">
                Privacy Policy
              </Link>{" "}
              |
              <Link href="/terms" className="hover:text-stone-800 dark:hover:text-stone-200 ml-1">
                Terms of Service
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
