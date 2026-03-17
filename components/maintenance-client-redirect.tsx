"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function MaintenanceClientRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch("/api/maintenance/status")
      .then(res => res.json())
      .then(data => {
        if (data.maintenance && pathname !== "/maintenance") {
          router.replace("/maintenance")
        }
      })
      .catch(() => {})
  }, [pathname, router])

  return null
}
