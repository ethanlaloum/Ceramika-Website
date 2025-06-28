"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useProducts } from "@/hooks/use-products"
import { useArtists } from "@/hooks/use-artists"
import { ProductCardSkeleton } from "@/components/loading-states"
import { ErrorDisplay } from "@/components/error-boundary"
import { FadeIn, Stagger, HoverScale } from "@/components/animations"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

const CATEGORIES = ["Bols", "Assiettes", "Vases", "Mugs", "Plateaux", "Sets", "Décoratif"]

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nom (A-Z)" },
  { value: "name-desc", label: "Nom (Z-A)" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "newest", label: "Plus récents" },
  { value: "featured", label: "Produits vedettes" },
]

export default function ProductsPage() {
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Récupération des données
  const { products, loading: productsLoading, error: productsError, refetch } = useProducts()
  const { artists, loading: artistsLoading } = useArtists()

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return []

    const filtered = products.filter((product) => {
      // Recherche par nom
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Filtre par catégorie
      if (selectedCategories.length > 0 && product.category && !selectedCategories.includes(product.category)) {
        return false
      }

      // Filtre par artiste
      if (selectedArtists.length > 0 && !selectedArtists.includes(product.artistId)) {
        return false
      }

      // Filtre par prix
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      // Filtre par stock
      if (inStockOnly && !product.inStock) {
        return false
      }

      return true
    })

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategories, selectedArtists, priceRange, inStockOnly, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleArtistChange = (artistId: string, checked: boolean) => {
    if (checked) {
      setSelectedArtists([...selectedArtists, artistId])
    } else {
      setSelectedArtists(selectedArtists.filter((a) => a !== artistId))
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedArtists([])
    setPriceRange([0, 500])
    setInStockOnly(false)
    setSortBy("newest")
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Catégories */}
      <div>
        <h3 className="font-semibold mb-3">Catégories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Artistes */}
      <div>
        <h3 className="font-semibold mb-3">Artistes</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {artistsLoading ? (
            <div className="text-sm text-gray-500">Chargement...</div>
          ) : (
            artists?.map((artist) => (
              <div key={artist.id} className="flex items-center space-x-2">
                <Checkbox
                  id={artist.id}
                  checked={selectedArtists.includes(artist.id)}
                  onCheckedChange={(checked) => handleArtistChange(artist.id, checked as boolean)}
                />
                <Label htmlFor={artist.id} className="text-sm">
                  {artist.name}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h3 className="font-semibold mb-3">Prix</h3>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={0} step={10} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
        />
        <Label htmlFor="inStock" className="text-sm">
          En stock uniquement
        </Label>
      </div>

      {/* Bouton reset */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Réinitialiser les filtres
      </Button>
    </div>
  )

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorDisplay message={productsError} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              Tous nos Produits
            </h1>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl">
              Découvrez notre collection complète de céramiques artisanales, créées avec passion par nos artistes
              talentueux.
            </p>
          </div>
        </FadeIn>

        {/* Barre de recherche et contrôles */}
        <FadeIn delay={0.2}>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tri */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mode d'affichage */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filtres mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>Affinez votre recherche avec nos filtres</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </FadeIn>

        <div className="flex gap-8">
          {/* Filtres desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FadeIn delay={0.3}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4" />
                    <h2 className="font-semibold">Filtres</h2>
                  </div>
                  <FiltersContent />
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Grille de produits */}
          <div className="flex-1">
            <FadeIn delay={0.4}>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {productsLoading ? "Chargement..." : `${filteredAndSortedProducts.length} produit(s) trouvé(s)`}
                </p>
              </div>
            </FadeIn>

            {productsLoading ? (
              <Stagger
                staggerDelay={0.1}
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {Array.from({ length: 9 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </Stagger>
            ) : (
              <Stagger
                staggerDelay={0.1}
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {filteredAndSortedProducts.map((product) => (
                  <HoverScale key={product.id} scale={1.02}>
                    <Card
                      className={`group cursor-pointer border-stone-200 dark:border-stone-700 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-stone-800 ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <Link href={`/products/${product.id}`}>
                        <CardContent className={`p-0 ${viewMode === "list" ? "flex" : ""}`}>
                          <div
                            className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}
                          >
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={viewMode === "list" ? 200 : 300}
                              height={viewMode === "list" ? 200 : 300}
                              className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                                viewMode === "list" ? "h-48 w-48" : "w-full h-48 sm:h-56 md:h-64"
                              }`}
                            />
                            {product.featured && (
                              <Badge className="absolute top-3 left-3 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-xs">
                                Vedette
                              </Badge>
                            )}
                            {!product.inStock && (
                              <Badge variant="destructive" className="absolute top-3 right-3 text-xs">
                                Rupture
                              </Badge>
                            )}
                          </div>
                          <div className={`p-4 sm:p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                            <h3 className="font-semibold text-base sm:text-lg text-stone-800 dark:text-stone-100 mb-2 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-2">
                              Par {product.artist.name}
                            </p>
                            {product.category && (
                              <Badge variant="outline" className="mb-3 text-xs">
                                {product.category}
                              </Badge>
                            )}
                            <div
                              className={`flex items-center ${viewMode === "list" ? "justify-between" : "justify-between"}`}
                            >
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-lg sm:text-xl text-stone-800 dark:text-stone-100">
                                  {product.price}€
                                </p>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <p className="text-sm text-stone-500 line-through">{product.originalPrice}€</p>
                                )}
                              </div>
                              {product.inStock && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    addToCart(product.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200 text-xs sm:text-sm px-3 sm:px-4"
                                >
                                  Ajouter
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </HoverScale>
                ))}
              </Stagger>
            )}

            {!productsLoading && filteredAndSortedProducts.length === 0 && (
              <FadeIn>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Essayez de modifier vos critères de recherche ou vos filtres.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
