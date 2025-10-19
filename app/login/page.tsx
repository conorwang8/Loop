"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, MapPin, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [darken, setDarken] = useState(false)

  const handleGoogleSignIn = () => {
    setDarken(true)
    signIn("google", { callbackUrl: "/profile"})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      {darken && (
      <div className="fixed inset-0 bg-opacity-60 z-50 transition-opacity duration-300" style={{backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent : "center", alignItems: "center"}}>
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{borderColor: "oklch(1 0 0)", borderTopColor: "transparent"}} />
      </div>)}
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-primary mb-2">Loop</h1>
          </Link>
          <p className="text-muted-foreground leading-relaxed">Your personal city assistant</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to share recommendations and connect with your community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 text-base bg-transparent"
              size="lg"
              style={{cursor: "pointer"}}
            >
              
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Why sign in?</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Share Your Discoveries</p>
                  <p className="text-xs text-muted-foreground">Post recommendations and help others</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Connect with Community</p>
                  <p className="text-xs text-muted-foreground">Like, comment, and engage with others</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Personalized Experience</p>
                  <p className="text-xs text-muted-foreground">Save favorites and get tailored suggestions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue as Guest */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Continue browsing as guest
          </Link>
        </div>
      </div>
    </div>
  )
}
