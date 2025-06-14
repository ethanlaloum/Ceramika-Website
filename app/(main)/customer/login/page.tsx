"use client"

import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/providers"

export default function CustomerLoginPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-playfair text-3xl font-bold text-stone-800">
            Céramika
          </Link>
          <p className="text-stone-600 mt-2">{t("Bienvenue")}</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("Sign In")}</TabsTrigger>
            <TabsTrigger value="signup">{t("Create Account")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t("Se connecter")}</CardTitle>
                <CardDescription>{t("Re-bonjour. Merci de vous connecter à votre compte.")}</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{t("Create Account")}</CardTitle>
                <CardDescription>{t("Join our community of ceramic enthusiasts.")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm isAdmin={false} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link href="/" className="text-stone-600 hover:text-stone-800 text-sm">
            ← {t("Back to store")}
          </Link>
        </div>
      </div>
    </div>
  )
}
