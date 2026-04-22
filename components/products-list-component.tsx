"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "@/hooks/use-products"
import { ProductCardSkeleton } from "@/components/loading-states"
import { ErrorDisplay } from "@/components/error-boundary"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function ProductsListComponent() {
  const { addToCart } = useCart()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const {
    products,
    loading,
    error,
    refetch,
    totalPages,
  } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
  })

  if (error) {
    return <ErrorDisplay message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products.map((product) => (
              <Card
                key={product.id}
                className="group border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all duration-300 overflow-hidden bg-white dark:bg-stone-800"
              >
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative overflow-hidden bg-stone-100 dark:bg-stone-700">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-xs">
                          Vedette
                        </Badge>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-stone-800 dark:text-stone-100 mb-1 line-clamp-2 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mb-2">
                        Par {product.artist?.name || "Artiste"}
                      </p>
                    </div>
                  </Link>

                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-sm sm:text-base text-stone-800 dark:text-stone-100">
                          {formatPrice(product.price)}€
                        </p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-xs text-stone-500 line-through">
                            {formatPrice(product.originalPrice)}€
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            artist: product.artist?.name || "Artiste",
                            price: product.price,
                            image: product.images[0] || "/placeholder.svg",
                            quantity: 1,
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200 text-xs px-2 sm:px-3 h-8"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="flex-wrap gap-2">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Afficher les pages proches de la page actuelle
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              }

              // Afficher les points de suspension
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <PaginationItem key={`ellipsis-${pageNum}`}>
                    <span className="px-2">...</span>
                  </PaginationItem>
                )
              }

              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
