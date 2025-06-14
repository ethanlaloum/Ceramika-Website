"use client"

import { ProfileForm } from "@/components/dashboard/profile-form"
import { AddressForm } from "@/components/dashboard/address-form"

interface ProfileTabProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  address: {
    id: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    isDefault: boolean
  } | null
}

export function ProfileTab({ user, address }: ProfileTabProps) {
  const initialPersonalInfo = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
  }

  const initialAddress = address
    ? {
        id: address.id,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      }
    : {
        id: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: true,
      }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-stone-800 mb-2">Mon Profil</h1>
        <p className="text-stone-600">Gérez vos informations personnelles</p>
      </div>

      <ProfileForm initialData={initialPersonalInfo} />
      <AddressForm initialData={initialAddress} />
    </div>
  )
}
