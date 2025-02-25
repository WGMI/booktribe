import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function LoadingLibrary() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {[...Array(12)].map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader className="aspect-[3/4] p-0">
            <Skeleton className="h-full w-full rounded-t-lg" />
          </CardHeader>
          <CardContent className="flex-grow space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

