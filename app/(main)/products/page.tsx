"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useProducts } from "@/hooks/use-products"
import { useArtists } from "@/hooks/use-artists"
import { useCategories } from "@/hooks/use-categories"
import { ProductCardSkeleton } from "@/components/loading-states"
import { ErrorDisplay } from "@/components/error-boundary"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

  // Récupération des données
  const { products, loading: productsLoading, error: productsError, refetch } = useProducts({ fetchAll: true })

  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 0
    return Math.ceil(Math.max(...products.map(p => p.price)) / 10) * 10
  }, [products])

  useEffect(() => {
    if (maxProductPrice > 0) setPriceRange([0, maxProductPrice])
  }, [maxProductPrice])
  const { artists, loading: artistsLoading } = useArtists()
  const { categories, loading: categoriesLoading } = useCategories()

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return []

    const filtered = products.filter((product) => {
      // Recherche par nom ou référence (id)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesRef = product.id.toLowerCase().includes(query)
        if (!matchesName && !matchesRef) {
          return false
        }
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

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)

  // Reset pagination quand les filtres de recherche/tri changent
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, priceRange, inStockOnly, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setCurrentPage(1)
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleArtistChange = (artistId: string, checked: boolean) => {
    setCurrentPage(1)
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
    setPriceRange([0, maxProductPrice])
    setInStockOnly(false)
    setSortBy("newest")
    setCurrentPage(1)
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Catégories */}
      <div>
        <h3 className="font-semibold mb-3">Catégories</h3>
        <div className="space-y-2">
          {categoriesLoading ? (
            <div className="text-sm text-gray-500">Chargement...</div>
          ) : (
            categories.map((category) => (
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
            ))
          )}
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
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs text-gray-500 mb-1 block">Min</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceRange[1])
                  setPriceRange([Math.max(0, val), priceRange[1]])
                }}
                className="pr-6 text-sm"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
            </div>
          </div>
          <span className="text-gray-400 mt-5">—</span>
          <div className="flex-1">
            <Label className="text-xs text-gray-500 mb-1 block">Max</Label>
            <div className="relative">
              <Input
                type="number"
                min={priceRange[0]}
                max={maxProductPrice}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceRange[0])
                  setPriceRange([priceRange[0], Math.min(val, maxProductPrice)])
                }}
                className="pr-6 text-sm"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
            </div>
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
        <div className="mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            Tous nos Produits
          </h1>
          <p className="text-stone-600 dark:text-stone-300 max-w-2xl">
            Découvrez l'ensemble de notre collection de biscuits en céramique.
          </p>
        </div>

        {/* Barre de recherche et contrôles */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou référence..."
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

        <div className="flex gap-8">
          {/* Filtres desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4" />
                  <h2 className="font-semibold">Filtres</h2>
                </div>
                <FiltersContent />
              </CardContent>
            </Card>
          </div>

          {/* Grille de produits */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {productsLoading
                  ? "Chargement..."
                  : filteredAndSortedProducts.length === 0
                  ? "Aucun produit trouvé"
                  : `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} de ${filteredAndSortedProducts.length} produit(s)`}
              </p>
            </div>

            {productsLoading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {paginatedProducts.map((product) => (
                    <Card
                      key={product.id}
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
                                  {formatPrice(product.price)}€
                                </p>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <p className="text-sm text-stone-500 line-through">{formatPrice(product.originalPrice)}€</p>
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
                ))}
              </div>
            )}

            {/* Pagination */}
            {!productsLoading && filteredAndSortedProducts.length > itemsPerPage && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <Pagination className="mb-4">
                  <PaginationContent className="flex-wrap justify-center gap-2">

                    {/* Précédent */}
                    <PaginationItem>
                      <button
                        onClick={() => {
                          if (currentPage === 1) return
                          setCurrentPage((p) => p - 1)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${currentPage === 1
                            ? "opacity-50 cursor-not-allowed text-gray-400"
                            : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          }`}
                      >
                        ← Précédent
                      </button>
                    </PaginationItem>

                    {/* Pages */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isFirst = pageNum === 1
                      const isLast = pageNum === totalPages
                      const isNearCurrent = pageNum >= currentPage - 1 && pageNum <= currentPage + 1

                      if (isFirst || isLast || isNearCurrent) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => {
                                setCurrentPage(pageNum)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }

                      if (pageNum === 2 && currentPage > 3) {
                        return (
                          <PaginationItem key="ellipsis-left">
                            <span className="px-2 py-2 text-sm">...</span>
                          </PaginationItem>
                        )
                      }

                      if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                        return (
                          <PaginationItem key="ellipsis-right">
                            <span className="px-2 py-2 text-sm">...</span>
                          </PaginationItem>
                        )
                      }

                      return null
                    })}

                    {/* Suivant */}
                    <PaginationItem>
                      <button
                        onClick={() => {
                          if (currentPage === totalPages) return
                          setCurrentPage((p) => p + 1)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed text-gray-400"
                            : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          }`}
                      >
                        Suivant →
                      </button>
                    </PaginationItem>

                  </PaginationContent>
                </Pagination>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page <span className="font-semibold">{currentPage}</span> sur{" "}
                  <span className="font-semibold">{totalPages}</span>
                </p>
              </div>
            )}

            {!productsLoading && filteredAndSortedProducts.length === 0 && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
