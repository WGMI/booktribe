"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, RefreshCw, Users } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative px-4 py-12 md:py-24 lg:py-32 bg-[url('/library.jpg')] bg-cover bg-center bg-no-repeat">
        {/* Translucent overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="container flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1 text-sm text-slate-300">
            <BookOpen className="mr-2 h-4 w-4" />
            Join our community of book lovers
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tighter text-white sm:text-5xl">
            Swap Books with Fellow Book Lovers
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Build your library, discover new books, and connect with readers all over the country. Trade books you've read for ones you want to read.
          </p>
          <div className="mt-6 flex flex-col gap-4 min-[400px]:flex-row">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/home')}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700 text-black hover:bg-slate-800"
            >
              Browse Books
            </Button>
          </div>
        </div>
      </section>


      {/* Featured Books Section */}
      {/* <section className="px-4 py-12">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold text-white">Featured Books Available for Swap</h2>
          <div className="no-scrollbar flex w-full gap-6 overflow-x-auto pb-6">
            {featuredBooks.map((book) => (
              <Card key={book.id} className="min-w-[250px] bg-slate-800">
                <div className="p-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 250px) 100vw, 250px"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{book.title}</h3>
                  <p className="text-sm text-slate-400">{book.author}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section id="about" className="px-4 py-12 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">How Book Swapping Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-blue-600/10 p-4">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-lg bg-blue-600 px-6 py-12 text-center md:px-12 md:py-24">
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Ready to Start Swapping?
              </h2>
              <p className="mb-6 text-lg text-blue-100">
                Join thousands of readers who are already sharing their favorite books.
              </p>
              <Button size="lg" variant="secondary">
                Create Your Library
              </Button>
            </div>
            <div
              className="absolute inset-0 z-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,107,158,0.5)_50%,transparent_75%,transparent_100%)]"
              style={{ backgroundSize: '20px 20px' }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

const featuredBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "/placeholder.svg?height=450&width=300"
  },
  {
    id: 2,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    cover: "/placeholder.svg?height=450&width=300"
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "/placeholder.svg?height=450&width=300"
  },
  {
    id: 4,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    cover: "/placeholder.svg?height=450&width=300"
  },
  {
    id: 5,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    cover: "/placeholder.svg?height=450&width=300"
  }
]

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-blue-500" />,
    title: "List Your Books",
    description: "Add books you own to your library and mark them as available for swapping."
  },
  {
    icon: <Users className="h-6 w-6 text-blue-500" />,
    title: "Find Matches",
    description: "Browse other users' libraries and find books you want to read."
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-blue-500" />,
    title: "Make Trades",
    description: "Propose trades and accept offers from other readers in your area."
  }
]

