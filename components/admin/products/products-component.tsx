"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { ProductsHeader } from "./products-header"
import { ProductFilters } from "./product-filters"
import { ProductsGrid } from "./products-grid"
import { LoadingState } from "./loading-state"
import { EmptyState } from "./empty-state"
import { AddProductDialog } from "./add-product-dialog"
import { EditProductDialog } from "./edit-product-dialog"
import { ViewProductDialog } from "./view-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import type { Product, Artist, Collection } from "@prisma/client"

interface ProductWithRelations extends Product {
  artist: Artist
  collection?: Collection
}

// Types temporaires pour éviter les conflits null/undefined en production
type ProductAny = any
type ArtistAny = any  
type CollectionAny = any

export function ProductsComponent() {
  const [products, setProducts] = useState<Product[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
    fetchArtists()
    fetchCollections()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists")
      if (response.ok) {
        const data = await response.json()
        setArtists(data)
      }
    } catch (error) {
      toast({
        title: "Avertissement",
        description: "Impossible de charger la liste des artistes",
        variant: "destructive",
      })
    }
  }

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/collections")
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      }
    } catch (error) {
      // Erreur silencieuse pour les collections
    }
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[]

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <ProductsHeader onAddProduct={() => setIsAddDialogOpen(true)} />

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <ProductsGrid
          products={filteredProducts as any}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteClick}
        />
      )}

      <AddProductDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        artists={artists as any}
        collections={collections as any}
        onSuccess={fetchProducts}
      />

      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        product={selectedProduct as any}
        artists={artists as any}
        collections={collections as any}
        onSuccess={fetchProducts}
      />

      <ViewProductDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        product={selectedProduct as any}
      />

      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        product={productToDelete as any}
        onSuccess={fetchProducts}
      />
    </div>
  )
}
