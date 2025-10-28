"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Image as ImageIcon, Plus, Search, User, Eye, Pencil, Trash2, Palette } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { DeleteArtistDialog } from "./delete-artist-dialog"

interface Artist {
  id: string
  name: string
  bio?: string | null
  image?: string | null
  _count?: {
    products: number
  }
}

export function ArtistsComponent() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [newArtist, setNewArtist] = useState({ name: "", bio: "", image: "" })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editing, setEditing] = useState<Artist | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detail, setDetail] = useState<any | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Artist | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const res = await fetch("/api/admin/artists")
      if (!res.ok) throw new Error("Impossible de charger les artistes")
      const data = await res.json()
      setArtists(data)
    } catch (e) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return artists
    return artists.filter((a) => a.name.toLowerCase().includes(q))
  }, [artists, search])

  const handleCreate = async () => {
    if (!newArtist.name.trim()) {
      toast({ title: "Nom requis", description: "Veuillez saisir un nom d'artiste.", variant: "destructive" })
      return
    }
    setAddLoading(true)
    try {
      const res = await fetch("/api/admin/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newArtist.name.trim(),
          bio: newArtist.bio.trim() || null,
          image: newArtist.image.trim() || null,
        }),
      })
      if (!res.ok) throw new Error("Échec de la création de l'artiste")
      toast({ title: "Artiste créé" })
      setIsAddOpen(false)
      setNewArtist({ name: "", bio: "", image: "" })
      await fetchArtists()
    } catch (e) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" })
    } finally {
      setAddLoading(false)
    }
  }

  const openEdit = (artist: Artist) => {
    setEditing(artist)
    setIsEditOpen(true)
  }

  const handleEdit = async () => {
    if (!editing) return
    if (!editing.name?.trim()) {
      toast({ title: "Nom requis", description: "Veuillez saisir un nom d'artiste.", variant: "destructive" })
      return
    }
    setEditLoading(true)
    try {
      const res = await fetch(`/api/admin/artists/${editing.id}` , {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editing.name.trim(), bio: editing.bio || null, image: editing.image || null }),
      })
      if (!res.ok) throw new Error("Échec de la mise à jour")
      toast({ title: "Artiste mis à jour" })
      setIsEditOpen(false)
      setEditing(null)
      await fetchArtists()
    } catch (e) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" })
    } finally {
      setEditLoading(false)
    }
  }

  const openDelete = (artist: Artist) => {
    setToDelete(artist)
    setIsDeleteOpen(true)
  }

  const openDetails = async (artist: Artist) => {
    setIsDetailOpen(true)
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/admin/artists/${artist.id}`)
      if (!res.ok) throw new Error("Impossible de charger les détails")
      const data = await res.json()
      setDetail(data)
    } catch (e) {
      toast({ title: "Erreur", description: (e as Error).message, variant: "destructive" })
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Artistes</h1>
          <p className="text-gray-600">Créez et gérez les artistes liés aux produits</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{artists.length} artistes</Badge>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel artiste
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher un artiste..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((artist) => (
            <Card key={artist.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="aspect-[3/2] relative rounded-lg overflow-hidden bg-gray-100">
                  {artist.image ? (
                    <Image src={artist.image} alt={artist.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Palette className="h-4 w-4 text-gray-500" /> {artist.name}
                    </h3>
                    {artist._count?.products !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">{artist._count.products} produits</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDetails(artist)}>
                      <Eye className="h-4 w-4 mr-2" /> Voir
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(artist)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDelete(artist)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {artist.bio && <p className="text-sm text-gray-600 line-clamp-2">{artist.bio}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">Aucun artiste trouvé</CardContent>
        </Card>
      )}

      {/* Add dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvel artiste</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={newArtist.name} onChange={(e) => setNewArtist((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" value={newArtist.bio} onChange={(e) => setNewArtist((s) => ({ ...s, bio: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image (URL)</Label>
              <Input id="image" value={newArtist.image} onChange={(e) => setNewArtist((s) => ({ ...s, image: e.target.value }))} />
            </div>
            <Button onClick={handleCreate} disabled={addLoading} className="w-full">
              {addLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Éditer l'artiste</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom *</Label>
                <Input id="edit-name" value={editing.name || ""} onChange={(e) => setEditing((s) => s ? { ...s, name: e.target.value } : s)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <Input id="edit-bio" value={editing.bio || ""} onChange={(e) => setEditing((s) => s ? { ...s, bio: e.target.value } : s)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image (URL)</Label>
                <Input id="edit-image" value={editing.image || ""} onChange={(e) => setEditing((s) => s ? { ...s, image: e.target.value } : s)} />
              </div>
              <Button onClick={handleEdit} disabled={editLoading} className="w-full">
                {editLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Enregistrer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Details modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'artiste</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="py-12 text-center text-gray-600">Chargement…</div>
          ) : detail ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  {detail.image ? (
                    <Image src={detail.image} alt={detail.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{detail.name}</h2>
                  {detail.bio && <p className="text-sm text-gray-600 mt-1">{detail.bio}</p>}
                  <div className="mt-2 flex gap-2 text-xs text-gray-500">
                    <Badge variant="outline">{detail._count?.products ?? 0} produits</Badge>
                    <Badge variant="outline">{detail._count?.collections ?? 0} collections</Badge>
                  </div>
                </div>
              </div>

              {/* Produits */}
              <div>
                <h3 className="font-medium mb-2">Produits</h3>
                {detail.products?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detail.products.map((p: any) => (
                      <Card key={p.id}>
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded bg-gray-100 overflow-hidden">
                            {p.images?.[0] ? (
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{p.name}</p>
                            <p className="text-sm text-gray-600">€{p.price}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aucun produit</p>
                )}
              </div>

              {/* Collections */}
              <div>
                <h3 className="font-medium mb-2">Collections</h3>
                {detail.collections?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detail.collections.map((c: any) => (
                      <Card key={c.id}>
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded bg-gray-100 overflow-hidden">
                            {c.image ? (
                              <Image src={c.image} alt={c.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{c.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aucune collection</p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-600">Aucun détail</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <DeleteArtistDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        artist={toDelete ? { id: toDelete.id, name: toDelete.name } : null}
        onSuccess={fetchArtists}
      />
    </div>
  )
}
