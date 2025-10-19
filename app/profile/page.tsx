"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Mail, Calendar, MapPin, Heart, MessageSquare, Star, LogOut } from "lucide-react"
import { useData } from "@/lib/data-context"
import { categories } from "@/lib/mock-data"
import Link from "next/link"
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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"posts" | "liked">("posts")
  const { getUserRecommendations, getLikedRecommendations, getCommentCount, deleteRecommendation } = useData()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile")
    }
  }, [status, router])

  const handleDelete = () => {
    if (deleteId) {
      deleteRecommendation(deleteId)
      setDeleteId(null)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:pt-20">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading profile...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userPosts = getUserRecommendations(session.user?.name || "")
  const likedPosts = getLikedRecommendations()
  const totalComments = userPosts.reduce((sum, post) => sum + getCommentCount(post.id), 0)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:pt-20">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{session.user?.name}</h1>
                  <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{session.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Joined {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      <MapPin className="h-3 w-3" />
                      City Explorer
                    </span>
                  </div>
                </div>

                <Button variant="outline" onClick={() => signOut()} className="text-destructive hover:text-destructive" style={{cursor:"pointer"}}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userPosts.length}</p>
                    <p className="text-sm text-muted-foreground">Recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-accent/10 p-3">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{likedPosts.length}</p>
                    <p className="text-sm text-muted-foreground">Liked Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-success/10 p-3">
                    <MessageSquare className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalComments}</p>
                    <p className="text-sm text-muted-foreground">Comments Received</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4 border-b">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`pb-2 px-4 font-semibold transition-colors ${
                    activeTab === "posts" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                  }`}
                >
                  My Posts ({userPosts.length})
                </button>
                <button
                  onClick={() => setActiveTab("liked")}
                  className={`pb-2 px-4 font-semibold transition-colors ${
                    activeTab === "liked" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                  }`}
                >
                  Liked Posts ({likedPosts.length})
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "posts" ? (
                userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No recommendations yet</p>
                    <Button asChild>
                      <Link href="/post">Share Your First Recommendation</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <Button asChild>
                        <Link href="/post">Share Another Recommendation</Link>
                      </Button>
                    </div>
                    {userPosts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="">
                          <div className="flex gap-4">
                            {post.image && (
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt={post.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <Badge variant="outline">
                                  {categories.find((c) => c.id === post.category)?.icon}{" "}
                                  {categories.find((c) => c.id === post.category)?.name}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  {post.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {getCommentCount(post.id)}
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/post?edit=${post.id}`}>Edit</Link>
                            </Button>
                            <Button variant="outline" size="sm" 
                              className="text-destructive hover:text-destructive"
                              style={{backgroundColor:"oklch(0.577 0.245 27.325)", color: "#fff", cursor: "pointer"}}
                              onClick={() => setDeleteId(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              ) : likedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No liked posts yet</p>
                  <Button asChild>
                    <Link href="/community">Explore Community</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {likedPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          {post.image && (
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <Badge variant="outline">
                                {categories.find((c) => c.id === post.category)?.icon}{" "}
                                {categories.find((c) => c.id === post.category)?.name}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                {post.rating}
                              </span>
                              <span className="text-muted-foreground">by {post.author?.name || post.author}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
              style={{color: "#fff", cursor:"pointer"}}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
