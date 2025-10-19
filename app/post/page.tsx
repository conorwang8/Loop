"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, Recommendation } from "@/lib/mock-data"
import { useState, useEffect } from "react"
import { ImagePlus, MapPin, Star, CheckCircle2, Lock, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useData } from "@/lib/data-context"


export default function PostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const { data: session, status } = useSession()
  const { addRecommendation, updateRecommendation, recommendations } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    rating: "5",
  })
  useEffect(() => {
    if (editId) {
      const existingRec = recommendations.find((r) => r.id === editId)
      if (existingRec) {
        setFormData({
          title: existingRec.title,
          category: existingRec.category,
          description: existingRec.description,
          location: existingRec.location,
          rating: existingRec.rating.toString(),
        })
        if (existingRec.image) {
          setImagePreview(existingRec.image)
        }
      }
    }
  }, [editId, recommendations])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/post")
    }
  }, [status, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imagePreview && !editId) {
      alert("Please upload an image for your recommendation")
      return
    }

    setIsSubmitting(true)

    const recData: Omit<Recommendation, "id" | "createdAt"> = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      location: formData.location,
      rating: Number.parseFloat(formData.rating),
      author: session?.user?.name || "Anonymous",
      authorAvatar: session?.user?.image || "/placeholder.svg?height=40&width=40",
      image: imagePreview || "/urban-location.jpg",
    }

    if (editId) {
      updateRecommendation(editId, recData)
    } else {
      addRecommendation(recData)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Redirect after success
    setTimeout(() => {
      router.push("/community")
    }, 2000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:pt-20">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:pt-20">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
                  <p className="text-muted-foreground mb-6">You need to be signed in to post recommendations</p>
                  <Button asChild>
                    <Link href="/login?callbackUrl=/post">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:pt-20">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">
                    {editId ? "Recommendation Updated!" : "Recommendation Posted!"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {editId
                      ? "Your changes have been saved. Redirecting to feed..."
                      : "Thank you for sharing with the community. Redirecting to feed..."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:pt-20">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <section className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{editId ? "Edit Recommendation" : "Share a Recommendation"}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {editId ? "Update your recommendation details" : "Help your community discover great places and services"}
            </p>
          </section>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Details</CardTitle>
              <CardDescription>Fill in the information about your recommendation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Best Coffee in Downtown"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                    <SelectTrigger style={{cursor:"pointer"}} id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} style={{cursor:"pointer"}} value={category.id}>
                          <span className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., Downtown District"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Share your experience and why you recommend this..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating">Your Rating *</Label>
                  <Select value={formData.rating}  onValueChange={(value) => handleChange("rating", value)} required>
                    <SelectTrigger style={{cursor:"pointer"}} id="rating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((rating) => (
                        <SelectItem key={rating} style={{cursor:"pointer"}} value={rating.toString()}>
                          <span className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <span>{rating} stars</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Add Photo *</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                        style={{height: "100%"}}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        style={{cursor:"pointer"}}
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image"
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block"
                    >
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!editId}
                      />
                    <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </label>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    style={{cursor:"pointer"}}
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" style={{cursor:"pointer"}} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting
                      ? editId
                        ? "Updating..."
                        : "Posting..."
                      : editId
                        ? "Update Recommendation"
                        : "Post Recommendation"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-6 bg-muted">
            <CardHeader>
              <CardTitle className="text-base">Tips for Great Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Be specific about what makes this place or service special</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Include helpful details like best times to visit or insider tips</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Add a photo to help others recognize the location</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Be honest and constructive in your review</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
