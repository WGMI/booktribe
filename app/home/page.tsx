import { Suspense } from "react"
import { Filter } from 'lucide-react'
import { LoadingStats } from "@/components/loading-stats"
import { StatsCards } from "@/components/stats-cards"
import { SearchSection } from "@/components/search-section"
import { LibraryHeader } from "@/components/library-header"
import { LoadingLibrary } from "@/components/loading"
import { BookLibrary } from "@/components/book-library"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookFormModal } from "@/components/book-form-modal"
import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"

// Create an async component to handle books fetching
async function BookSection({ userId }: { userId: string }) {
  // Fetch books
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('*')
    .eq('owner_id', userId)

  if (booksError) {
    console.error('Error fetching books:', booksError)
    throw new Error('Error fetching books')
  }

  return (
    <>
      <StatsCards numberOfBooks={books?.length || 0} />
      <SearchSection />
      <div className="flex items-center gap-4 my-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Swapped</SelectItem>
          </SelectContent>
        </Select>
        <BookFormModal userId={userId} numberOfBooks={books?.length || 0} />
      </div>
      <BookLibrary userId={userId} books={books || []} />
    </>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()
  const userId = user?.id
  
  if (!userId) {
    throw new Error('User not authenticated')
  }

  // Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError)
    throw new Error('Error fetching user data')
  }

  // Create user if doesn't exist
  if (!existingUser) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_id: userId,
        full_name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email: user?.emailAddresses[0]?.emailAddress || '',
        avatar_url: user?.imageUrl,
        books_count: 0
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      throw new Error('Error creating user')
    }
  }

  return (
    <div className="container p-8">
      <div className="mb-8 flex items-center justify-between">
        <LibraryHeader />
      </div>

      <Suspense fallback={<LoadingStats />}>
        <Suspense fallback={<LoadingLibrary />}>
          <BookSection userId={userId} />
        </Suspense>
      </Suspense>
    </div>
  )
}

