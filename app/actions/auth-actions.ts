"use server"

import { signOut } from "@/auth"
import { redirect } from "next/navigation"

export async function clearInvalidSession() {
  await signOut({ redirect: false })
  redirect("/customer/login?error=session-expired")
}
