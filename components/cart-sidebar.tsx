"use client"

import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart, useLanguage } from "@/components/providers"
import { cn } from "@/lib/utils"

export function CartSidebar() {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen, total, itemCount } = useCart()
  const { t } = useLanguage()

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl z-50 transition-all duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">{t("cart.title")}</h2>
              {itemCount > 0 && (
                <span className="bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-xs rounded-full px-2 py-1">
                  {itemCount}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="h-16 w-16 text-stone-300 dark:text-stone-600 mb-4" />
                <h3 className="text-lg font-medium text-stone-600 dark:text-stone-300 mb-2">{t("cart.empty")}</h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200"
                >
                  {t("cart.continue")}
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg transition-all duration-300 hover:shadow-md"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isOpen ? "slideInRight 0.5s ease-out forwards" : "none",
                    }}
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-stone-800 dark:text-stone-100 truncate">{item.name}</h4>
                      <p className="text-sm text-stone-600 dark:text-stone-400">by {item.artist}</p>
                      <p className="font-semibold text-stone-800 dark:text-stone-100">${item.price}</p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {t("cart.remove")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 dark:border-stone-700 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">{t("cart.subtotal")}</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">{t("cart.shipping")}</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-stone-200 dark:border-stone-700 pt-2">
                  <span>{t("cart.total")}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200 transition-all duration-300 hover:scale-105"
                size="lg"
              >
                {t("cart.checkout")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
