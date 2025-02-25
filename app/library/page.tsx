import { LibraryHeader } from "@/components/library-header"
import { LoadingLibrary } from "@/components/loading"
import { Suspense } from "react"

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container py-8">
        <LibraryHeader />
        <Suspense fallback={<LoadingLibrary />}>
          {/* <BookLibrary /> */}
        </Suspense>
      </div>
    </div>
  )
}

