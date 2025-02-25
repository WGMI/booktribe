'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreVertical, Edit, Trash } from 'lucide-react'
import { Book } from "@/types/book.type"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookFormModal } from "./book-form-modal"
export function BookLibrary({ userId, books }: { userId: string, books: Book[] }) {
  const router = useRouter()
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null)

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <BookFormModal showAddButton={false} userId={userId} numberOfBooks={books?.length || 0} bookToEdit={bookToEdit} />
      {books.map((book) => (
        <Card key={book.id} className="group relative flex flex-col">
          <CardHeader className="relative aspect-[3/4] p-0">
            <Image
              src={book.image_url ? book.image_url : "/placeholder-cover.jpg"}
              alt={`Cover of ${book.title}`}
              fill
              className="rounded-t-lg object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwSkNOPTYwPTYyRkNWSFdQU1xkYWVobW1/gYF+f3NxeXNUY3f/2wBDARUXFx4aHR4eHXduWW53d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <div className="absolute right-2 top-2">
              <BookActions setBookToEdit={setBookToEdit} book={book} router={router} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8">

              <p className="text-sm line-clamp-1 font-medium text-white">
                {book.title}
              </p>
              <p className="text-xs line-clamp-1 font-medium text-white">
                {book.author}
              </p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

function BookActions({ setBookToEdit, book, router }: { setBookToEdit: (book: Book) => void, book: Book, router: any }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [resultMessage, setResultMessage] = useState({ title: '', description: '' })
  const [deleting, setDeleting] = useState(false)

  const deleteBook = async (bookId: string) => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) {
        setDeleting(false)
        throw error;
      }

      setResultMessage({
        title: 'Success',
        description: 'Book was successfully deleted'
      })
      setDeleting(false)
    } catch (error) {
      console.error('Error deleting book:', error);
      setDeleting(false)
      setResultMessage({
        title: 'Error',
        description: 'Failed to delete book. Please try again.'
      })
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
      setShowResultDialog(true)
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 dark:bg-slate-800/90"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => { setBookToEdit(book) }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteBook(book.id)}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResultDialog} onOpenChange={() => { setShowResultDialog(false); router.refresh() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{resultMessage.title}</DialogTitle>
            <DialogDescription>
              {resultMessage.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setShowResultDialog(false); router.refresh() }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

