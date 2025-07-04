import { ProductCard } from "./product-card"
import type { Product, Artist, Collection } from "@prisma/client"

interface ProductWithRelations extends Product {
  artist: Artist
  collection?: Collection
}

interface ProductsGridProps {
  products: ProductWithRelations[]
  onViewProduct: (product: ProductWithRelations) => void
  onEditProduct: (product: ProductWithRelations) => void
  onDeleteProduct: (product: ProductWithRelations) => void
}

export function ProductsGrid({ products, onViewProduct, onEditProduct, onDeleteProduct }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={() => onViewProduct(product)}
          onEdit={() => onEditProduct(product)}
          onDelete={() => onDeleteProduct(product)}
        />
      ))}
    </div>
  )
}
