"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Star, MapPin, Heart, MessageCircle, Share2, TrendingUp, Edit, Trash2 } from "lucide-react"
import { categories } from "@/lib/mock-data"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useData } from "@/lib/data-context"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [commentingOn, setCommentingOn] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  const {
    recommendations,
    toggleLike,
    isLiked,
    markAsViewed,
    deleteRecommendation,
    addComment,
    getComments,
    getCommentCount,
  } = useData()
  const { data: session } = useSession()
  const router = useRouter()

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((rec) => {
      const matchesSearch =
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || rec.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [recommendations, searchQuery, selectedCategory])

  useEffect(() => {
    filteredRecommendations.forEach((rec) => {
      markAsViewed(rec.id, rec.category)
    })
  }, [filteredRecommendations.map((r) => r.id).join(",")])

  const handleToggleLike = (id: string, category: string) => {
    toggleLike(id, category)
  }

  const isUserPost = (authorName: string) => {
    return session?.user?.name === authorName
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteRecommendation(deleteId)
      setDeleteId(null)
    }
  }

  const handleCommentSubmit = (postId: string) => {
    if (commentText.trim() && session?.user) {
      addComment(postId, commentText, {
        name: session.user.name || "Anonymous",
        avatar: session.user.image || "/placeholder.svg?height=40&width=40",
      })
      setCommentText("")
      setCommentingOn(null)
    }
  }

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen dflex bg-background pb-20 md:pb-8 md:pt-20">
      <Navigation />

      <main className="container genw px-4 py-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Feed</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover recommendations from your neighbors
              </p>
            </div>
            <Link href="/post">
              <Button size="lg" className="shrink-0">
                Share Yours
              </Button>
            </Link>
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="shrink-0"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </section>

        {/* Results Count */}
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredRecommendations.length}{" "}
              {filteredRecommendations.length === 1 ? "recommendation" : "recommendations"}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Sorted by trending</span>
            </div>
          </div>
        </section>

        {/* Recommendations Feed */}
        <section>
          {filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recommendations found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  <Link href="/post">
                    <Button>Be the first to post</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 post-width">
              {filteredRecommendations.map((rec) => (
                <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Author Info */}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rec.author?.avatar || rec.authorAvatar || "/placeholder.svg"}
                          alt={rec.author?.name || rec.author}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{rec.author?.name || rec.author}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {rec.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                          {rec.rating}
                        </Badge>
                        {isUserPost(rec.author?.name || rec.author) && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              style={{cursor:"pointer"}}
                              onClick={() => router.push(`/post?edit=${rec.id}`)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(rec.id)}
                              style={{cursor:"pointer"}}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{rec.description}</p>
                    </div>
                    {rec.image && (
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <img
                          src={rec.image || "/placeholder.svg"}
                          alt={rec.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div>
                      <Badge variant="outline">
                        {categories.find((c) => c.id === rec.category)?.icon}{" "}
                        {categories.find((c) => c.id === rec.category)?.name}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{cursor:"pointer"}}
                        onClick={() => handleToggleLike(rec.id, rec.category)}
                        className={`transition-colors duration-200 ${isLiked(rec.id) ? "text-red-500" : ""}`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 transition-all duration-200 ${isLiked(rec.id) ? "fill-red-500 scale-110" : ""}`}
                        />
                        {isLiked(rec.id) ? "Liked" : "Like"}
                      </Button>
                      <Button variant="ghost" size="sm" style={{cursor:"pointer"}} onClick={() => toggleComments(rec.id)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment ({getCommentCount(rec.id)})
                      </Button>
                      <Button variant="ghost" size="sm"style={{cursor:"pointer"}}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    {expandedComments.has(rec.id) && (
                      <div className="pt-4 border-t space-y-4">
                        {/* Existing Comments */}
                        <div className="space-y-3">
                          {getComments(rec.id).map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <img
                                src={comment.author.avatar || "/placeholder.svg"}
                                alt={comment.author.name}
                                className="h-8 w-8 rounded-full"
                              />
                              <div className="flex-1 bg-muted rounded-lg p-3">
                                <div className="font-semibold text-sm">{comment.author.name}</div>
                                <p className="text-sm mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment */}
                        {session ? (
                          <div className="flex gap-3">
                            <img
                              src={session.user?.image || "/placeholder.svg"}
                              alt={session.user?.name || ""}
                              className="h-8 w-8 rounded-full"
                            />
                            <div className="flex-1">
                              <Textarea
                                placeholder="Write a comment..."
                                value={commentingOn === rec.id ? commentText : ""}
                                onChange={(e) => {
                                  setCommentingOn(rec.id)
                                  setCommentText(e.target.value)
                                }}
                                rows={2}
                                className="mb-2"
                              />
                              <Button
                                size="sm"
                                style={{cursor:"pointer"}}
                                onClick={() => handleCommentSubmit(rec.id)}
                                disabled={!commentText.trim()}
                              >
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            <Link href="/login" className="text-primary hover:underline">
                              Sign in
                            </Link>{" "}
                            to comment
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Load More */}
        {filteredRecommendations.length > 0 && (
          <section className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Load More Recommendations
            </Button>
          </section>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recommendation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your recommendation and all associated
              comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{cursor: "pointer"}}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              style={{color: "#fff", cursor: "pointer"}}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
