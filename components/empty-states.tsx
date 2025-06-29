"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations"
import { 
  Palette, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  ShoppingBag,
  Users,
  Package,
  Search
} from "lucide-react"

interface EmptyStateProps {
  type: 'collections' | 'products' | 'artists' | 'search'
  title?: string
  description?: string
  primaryAction?: {
    label: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
  secondaryAction?: {
    label: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

const emptyStateConfig = {
  collections: {
    icon: Palette,
    title: "Aucune Collection Disponible",
    description: "Nous n'avons pas encore de collections organisées, mais vous pouvez découvrir toutes nos magnifiques pièces céramiques créées par nos artistes talentueux.",
    primaryAction: {
      label: "Voir Tous les Produits",
      href: "/products",
      icon: ArrowRight
    },
    secondaryAction: {
      label: "Découvrir nos Artistes",
      href: "/artists",
      icon: Heart
    }
  },
  products: {
    icon: Package,
    title: "Aucun Produit Trouvé",
    description: "Nous n'avons pas trouvé de produits correspondant à vos critères. Essayez d'ajuster vos filtres ou explorez nos autres catégories.",
    primaryAction: {
      label: "Réinitialiser les Filtres",
      href: "/products",
      icon: ArrowRight
    },
    secondaryAction: {
      label: "Voir Toutes les Collections",
      href: "/collections",
      icon: Palette
    }
  },
  artists: {
    icon: Users,
    title: "Aucun Artiste Disponible",
    description: "Nous n'avons pas encore d'artistes partenaires présentés, mais notre boutique propose des créations céramiques exceptionnelles.",
    primaryAction: {
      label: "Voir les Produits",
      href: "/products",
      icon: ShoppingBag
    },
    secondaryAction: {
      label: "Nous Contacter",
      href: "/contact",
      icon: Heart
    }
  },
  search: {
    icon: Search,
    title: "Aucun Résultat",
    description: "Nous n'avons trouvé aucun résultat pour votre recherche. Essayez d'autres mots-clés ou parcourez nos catégories.",
    primaryAction: {
      label: "Voir Tous les Produits",
      href: "/products",
      icon: ArrowRight
    },
    secondaryAction: {
      label: "Parcourir les Collections",
      href: "/collections",
      icon: Palette
    }
  }
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  primaryAction, 
  secondaryAction 
}: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const Icon = config.icon
  const PrimaryIcon = primaryAction?.icon || config.primaryAction.icon
  const SecondaryIcon = secondaryAction?.icon || config.secondaryAction.icon

  const finalTitle = title || config.title
  const finalDescription = description || config.description
  const finalPrimaryAction = primaryAction || config.primaryAction
  const finalSecondaryAction = secondaryAction || config.secondaryAction

  return (
    <div className="text-center py-16">
      <FadeIn>
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-600 rounded-full flex items-center justify-center mb-6">
              <Icon className="w-12 h-12 text-stone-500 dark:text-stone-400" />
            </div>
            <Sparkles className="absolute top-0 right-1/2 transform translate-x-8 w-6 h-6 text-stone-400 dark:text-stone-500" />
          </div>
          
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {finalTitle}
          </h2>
          
          <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed">
            {finalDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
              <Link href={finalPrimaryAction.href} className="flex items-center gap-2">
                {finalPrimaryAction.label}
                {PrimaryIcon && <PrimaryIcon className="w-4 h-4" />}
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-stone-300 dark:border-stone-600">
              <Link href={finalSecondaryAction.href} className="flex items-center gap-2">
                {SecondaryIcon && <SecondaryIcon className="w-4 h-4" />}
                {finalSecondaryAction.label}
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

interface UpcomingPreviewProps {
  items?: string[]
}

export function UpcomingPreview({ items }: UpcomingPreviewProps) {
  const defaultItems = [
    "Collection \"Terre & Mer\"",
    "Série \"Éléments Bruts\"",
    "Collection \"Lumières d'Automne\""
  ]

  const displayItems = items || defaultItems

  return (
    <FadeIn delay={0.2}>
      <div className="relative">
        <div className="bg-white dark:bg-stone-700 rounded-lg p-6 shadow-lg">
          <h3 className="font-playfair text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">
            À Venir Prochainement
          </h3>
          <ul className="space-y-2 text-stone-600 dark:text-stone-300">
            {displayItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FadeIn>
  )
}
