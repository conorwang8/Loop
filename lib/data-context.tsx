"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockRecommendations, mockServices, type Recommendation, type Service } from "./mock-data"

export interface Comment {
  id: string
  postId: string
  author: {
    name: string
    avatar: string
  }
  content: string
  createdAt: Date
}

interface UserInteraction {
  likedPosts: Set<string>
  viewedPosts: Set<string>
  categoryPreferences: Record<string, number>
}

interface DataContextType {
  recommendations: Recommendation[]
  services: Service[]
  userInteractions: UserInteraction
  comments: Comment[]
  addRecommendation: (rec: Omit<Recommendation, "id" | "createdAt">) => void
  updateRecommendation: (id: string, rec: Partial<Recommendation>) => void
  deleteRecommendation: (id: string) => void
  toggleLike: (id: string, category: string) => void
  markAsViewed: (id: string, category: string) => void
  getPersonalizedRecommendations: () => Recommendation[]
  getLikedRecommendations: () => Recommendation[]
  getUserRecommendations: (authorName: string) => Recommendation[]
  isLiked: (id: string) => boolean
  addComment: (postId: string, content: string, author: { name: string; avatar: string }) => void
  getComments: (postId: string) => Comment[]
  getCommentCount: (postId: string) => number
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const STORAGE_KEYS = {
  RECOMMENDATIONS: "urban_living_recommendations",
  INTERACTIONS: "urban_living_interactions",
  COMMENTS: "urban_living_comments",
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [services] = useState<Service[]>(mockServices)
  const [comments, setComments] = useState<Comment[]>([])
  const [userInteractions, setUserInteractions] = useState<UserInteraction>({
    likedPosts: new Set(),
    viewedPosts: new Set(),
    categoryPreferences: {},
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedRecs = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS)
    const storedInteractions = localStorage.getItem(STORAGE_KEYS.INTERACTIONS)
    const storedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS)

    if (storedRecs) {
      const parsed = JSON.parse(storedRecs)
      const recsWithDates = parsed.map((rec: any) => ({
        ...rec,
        createdAt: new Date(rec.createdAt),
      }))
      setRecommendations(recsWithDates)
    } else {
      setRecommendations(mockRecommendations)
    }

    if (storedInteractions) {
      const parsed = JSON.parse(storedInteractions)
      setUserInteractions({
        likedPosts: new Set(parsed.likedPosts || []),
        viewedPosts: new Set(parsed.viewedPosts || []),
        categoryPreferences: parsed.categoryPreferences || {},
      })
    }

    if (storedComments) {
      const parsed = JSON.parse(storedComments)
      const commentsWithDates = parsed.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      }))
      setComments(commentsWithDates)
    }

    setIsInitialized(true)
  }, [])

  // Save recommendations to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && recommendations.length > 0) {
      localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations))
    }
  }, [recommendations, isInitialized])

  // Save interactions to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      const interactionsToStore = {
        likedPosts: Array.from(userInteractions.likedPosts),
        viewedPosts: Array.from(userInteractions.viewedPosts),
        categoryPreferences: userInteractions.categoryPreferences,
      }
      localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactionsToStore))
    }
  }, [userInteractions, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
    }
  }, [comments, isInitialized])

  const addRecommendation = (rec: Omit<Recommendation, "id" | "createdAt">) => {
    const newRec: Recommendation = {
      ...rec,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setRecommendations((prev) => [newRec, ...prev])
  }

  const updateRecommendation = (id: string, updates: Partial<Recommendation>) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, ...updates } : rec)))
  }

  const deleteRecommendation = (id: string) => {
    setRecommendations((prev) => prev.filter((rec) => rec.id !== id))
    // Also remove associated comments
    setComments((prev) => prev.filter((comment) => comment.postId !== id))
  }

  const toggleLike = (id: string, category: string) => {
    setUserInteractions((prev) => {
      const newLikedPosts = new Set(prev.likedPosts)
      const isCurrentlyLiked = newLikedPosts.has(id)

      if (isCurrentlyLiked) {
        newLikedPosts.delete(id)
      } else {
        newLikedPosts.add(id)
        const newPreferences = { ...prev.categoryPreferences }
        newPreferences[category] = (newPreferences[category] || 0) + 2
        return {
          ...prev,
          likedPosts: newLikedPosts,
          categoryPreferences: newPreferences,
        }
      }

      return {
        ...prev,
        likedPosts: newLikedPosts,
      }
    })
  }

  const markAsViewed = (id: string, category: string) => {
    setUserInteractions((prev) => {
      const newViewedPosts = new Set(prev.viewedPosts)
      if (!newViewedPosts.has(id)) {
        newViewedPosts.add(id)
        const newPreferences = { ...prev.categoryPreferences }
        newPreferences[category] = (newPreferences[category] || 0) + 1
        return {
          ...prev,
          viewedPosts: newViewedPosts,
          categoryPreferences: newPreferences,
        }
      }
      return prev
    })
  }

  const getPersonalizedRecommendations = (): Recommendation[] => {
    if (Object.keys(userInteractions.categoryPreferences).length === 0) {
      return [...recommendations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    const scoredRecs = recommendations.map((rec) => {
      let score = 0
      const categoryScore = userInteractions.categoryPreferences[rec.category] || 0
      score += categoryScore * 10
      score += rec.rating * 5
      if (userInteractions.viewedPosts.has(rec.id)) {
        score -= 5
      }
      if (userInteractions.likedPosts.has(rec.id)) {
        score += 50
      }
      const daysSincePost = (Date.now() - rec.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      score += Math.max(0, 10 - daysSincePost)
      return { ...rec, score }
    })

    return scoredRecs.sort((a, b) => b.score - a.score)
  }

  const getLikedRecommendations = (): Recommendation[] => {
    return recommendations.filter((rec) => userInteractions.likedPosts.has(rec.id))
  }

  const getUserRecommendations = (authorName: string): Recommendation[] => {
    return recommendations.filter((rec) => {
      if (typeof rec.author === "string") {
        return rec.author === authorName
      }
      return rec.author?.name === authorName
    })
  }

  const isLiked = (id: string) => userInteractions.likedPosts.has(id)

  const addComment = (postId: string, content: string, author: { name: string; avatar: string }) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author,
      content,
      createdAt: new Date(),
    }
    setComments((prev) => [...prev, newComment])
  }

  const getComments = (postId: string): Comment[] => {
    return comments
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  const getCommentCount = (postId: string): number => {
    return comments.filter((comment) => comment.postId === postId).length
  }

  return (
    <DataContext.Provider
      value={{
        recommendations,
        services,
        userInteractions,
        comments,
        addRecommendation,
        updateRecommendation,
        deleteRecommendation,
        toggleLike,
        markAsViewed,
        getPersonalizedRecommendations,
        getLikedRecommendations,
        getUserRecommendations,
        isLiked,
        addComment,
        getComments,
        getCommentCount,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
