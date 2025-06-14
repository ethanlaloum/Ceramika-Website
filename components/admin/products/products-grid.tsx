import { ProductCard } from "./product-card"
import type { Product } from "./types"

interface ProductsGridProps {
  products: Product[]
  onViewProduct: (product: Product) => void
  onEditProduct: (product: Product) => void
  onDeleteProduct: (product: Product) => void
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
