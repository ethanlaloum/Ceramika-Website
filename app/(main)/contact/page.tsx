"use client"

import { useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // call API or service here
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      toast({ title: "Message envoyé", description: "Nous vous contacterons bientôt." })
      setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" })
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-playfair font-bold text-stone-800 dark:text-stone-100 mb-8">
          Contact
        </h1>

        {/* contact info row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-stone-600 dark:text-stone-300" />
            <div>
              <h3 className="font-semibold text-stone-800 dark:text-stone-100">Adresse Postale</h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm">
                16 Avenue de Cannes<br />06220 Vallauris<br />Alpes-Maritimes FRANCE
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-stone-600 dark:text-stone-300" />
            <div>
              <h3 className="font-semibold text-stone-800 dark:text-stone-100">Numéro de Téléphone</h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm">
                04 93 64 48 94<br />07 78 57 38 46
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-stone-600 dark:text-stone-300" />
            <div>
              <h3 className="font-semibold text-stone-800 dark:text-stone-100">Adresse Mail</h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm">contact@latelierbyceramika.com</p>
            </div>
          </div>
        </div>

        {/* map + form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96">
            <iframe
              title="Carte"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2881.334514413629!2d7.012488315499118!3d43.6101883791211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12cdd560a389cd1f%3A0x9c2b60b082ccaaa4!2s16%20Av.%20de%20Cannes%2C%2006220%20Vallauris!5e0!3m2!1sfr!2sfr!4v1700000000000"
              width="100%"
              height="100%"
              frameBorder="0"
              className="border-0"
              allowFullScreen={false}
              aria-hidden="false"
              tabIndex={0}
            ></iframe>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Objet *</Label>
              <Input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className="h-32"
              />
            </div>

            <Button type="submit" disabled={submitting} className="mt-2">
              {submitting ? "Envoi…" : "Envoyer"}
            </Button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Link href="/artists" className="text-stone-700 dark:text-stone-300 underline">
            ← Retour aux artistes
          </Link>
        </div>
      </div>
    </div>
  )
}
