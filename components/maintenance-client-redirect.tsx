"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function MaintenanceClientRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const allowedPaths = ["/maintenance", "/customer/login", "/customer/forgot-password", "/admin"]
    const isAllowed = allowedPaths.some(p => pathname === p || pathname.startsWith(p + "/"))

    if (isAllowed) return

    fetch("/api/maintenance/status")
      .then(res => res.json())
      .then(data => {
        if (data.maintenance) {
          router.replace("/maintenance")
        }
      })
      .catch(() => {})
  }, [pathname, router])

  return null
}
