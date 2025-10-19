"use client";

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, Users, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { categories } from "@/lib/mock-data"
import { useData } from "@/lib/data-context"
import { useEffect, useRef, useState } from "react"
import { motion, } from "framer-motion"
import type { Variants } from "framer-motion"

export default function HomePage() {
  const { getPersonalizedRecommendations, recommendations, markAsViewed } = useData()
  const personalizedRecs = getPersonalizedRecommendations()
  const topRecommendations = personalizedRecs.slice(0, 2)
  const topCategories = categories.slice(0, 4)
  const [location, setLocation] = useState<string>("Detecting location...");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRecommendations.forEach((rec) => {
      markAsViewed(rec.id, rec.category)
    })
  }, [topRecommendations.map((r) => r.id).join(",")])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  } satisfies Variants

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "Unknown area";
          setLocation(city);
        } catch {
          setLocation("Location unavailable");
        }
      },
      () => setLocation("Location permission denied")
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen dflex bg-background pb-20 md:pb-8 md:pt-20">
      <Navigation />

      <main className="container genw px-4 py-8">
        {/* Hero Section */}
        <motion.section
                  className="relative min-h-screen flex flex-col items-center justify-start text-center mb-12 px-4 overflow-hidden pt-32"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
          {/* --- Background image gradient --- */}
      <div className="absolute inset-0 bg-[url('/city-skyline.jpg')] bg-cover bg-center opacity-30 blur-sm" />

      {/* --- Animated gradient blur overlay --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background/70 to-background animate-gradientMove blur-3xl opacity-70" />
          
          
          <div ref={ref}
          className={`flex flex-col gap-4 max-w-2xl transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div 
                className="flex items-center justify-center gap-2 text-muted-foreground opacity-0 animate-slideUp"
                style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <MapPin className="h-5 w-5" />
              <span className="text-m">Your Location: {location}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight opacity-0 animate-slideUp"
                style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                  Welcome to{" "}
              <span className="text-primary">
                {location !== "Detecting location..." ? location : "Your City"}
              </span>
            </h1>
            <h2 className="text-2xl md:text-2xl text-balance leading-tight opacity-0 animate-slideUp"
                style={{ animationDelay: "0.3s", animationFillMode: "forwards", color: "#474747" }}>
                  Get in the Loop
            </h2>
            <p  className="text-lg text-muted-foreground text-pretty leading-relaxed opacity-0 animate-slideUp"
                style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              Discover local services, connect with your community, and navigate urban life with ease.
            </p>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-primary" />
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div className="text-2xl font-bold">2.4K</div>
                  <div className="text-xs text-muted-foreground">Active Members</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Star className="h-5 w-5 text-amber-500" />
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="text-2xl font-bold">{recommendations.length}</div>
                <div className="text-xs text-muted-foreground">Recommendations</div>
              </div>
            </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <MapPin className="h-5 w-5 text-primary" />
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="text-2xl font-bold">350+</div>
                <div className="text-xs text-muted-foreground">Local Services</div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🏙️</span>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">Neighborhoods</div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </motion.section>

        {/* Explore Categories */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Explore Categories</h2>
            <Link href="/discover">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {topCategories.map((category, index) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={`/discover?category=${category.id}`}>
                  <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <motion.div
                          className="text-4xl"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {category.icon}
                        </motion.div>
                      <div className="font-semibold text-sm">{category.name}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Trending Recommendations */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <p className="text-sm text-muted-foreground mt-1">Based on your interests and activity</p>
            </div>
            <Link href="/community">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {topRecommendations.map((rec) => (
              <motion.div key={rec.id} variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                {rec.image && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <motion.img
                        src={rec.image || "/placeholder.svg"}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription className="mt-2 leading-relaxed">{rec.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                      {rec.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                            typeof rec.author === "object" ? rec.author.avatar : rec.authorAvatar || "/placeholder.svg"
                          }
                          alt={typeof rec.author === "object" ? rec.author.name : rec.author}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="text-sm">
                        <div className="font-medium">
                            {typeof rec.author === "object" ? rec.author.name : rec.author}
                          </div>
                        <div className="text-muted-foreground">{rec.location}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="bg-primary text-primary-foreground hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Share Your Experience</h3>
                  <p className="text-primary-foreground/90 leading-relaxed">
                    Help your neighbors discover the best your city has to offer. Post your recommendations today!
                  </p>
                </div>
                <Link href="/post">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="secondary" className="shrink-0">
                      Create Post
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  )
}
