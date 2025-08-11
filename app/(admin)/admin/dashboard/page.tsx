"use client"

import { AnalyticsComponent } from "@/components/admin/analytics/analytics-component"
import { MaintenanceControl } from "@/components/admin/maintenance-control"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'état actuel du mode maintenance
    fetch('/api/admin/maintenance')
      .then(res => res.json())
      .then(data => {
        setMaintenanceMode(data.maintenanceMode)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Contrôle maintenance */}
      {!loading && (
        <MaintenanceControl initialMaintenanceMode={maintenanceMode} />
      )}
      
      {/* Analytics */}
      <AnalyticsComponent />
    </div>
  )
}
