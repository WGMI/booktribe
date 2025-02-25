'use client'

import { useEffect, useState } from 'react'
import { currentUser } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookPlus, AlertCircle } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { Book } from '@/types/book.type'

const bookFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    description: z.string().optional(),
    condition: z.enum(["New", "Good", "Fair", "Poor"]),
    isbn: z.string().optional(),
    open_lib_id: z.string().optional(),
    image_url: z.instanceof(File).optional(),
    status: z.enum(["Available", "Swapped"]),
    owner_id: z.string()
})

type BookFormValues = z.infer<typeof bookFormSchema>

type SearchResult = {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    isbn?: string[];
}

export function BookFormModal({ userId, numberOfBooks, bookToEdit, showAddButton = true }: { userId: string, numberOfBooks: number, bookToEdit?: Book | null, showAddButton?: boolean }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [showAllFields, setShowAllFields] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searching, setSearching] = useState(false)
    const [addingBook, setAddingBook] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [cover, setCover] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookFormSchema),
        defaultValues: {
            title: "",
            author: "",
            description: "",
            condition: "New",
            isbn: "",
            open_lib_id: "",
            status: "Available",
            owner_id: ""
        },
    })

    useEffect(() => {
        if (bookToEdit) {
            console.log(bookToEdit)
            setShowAllFields(true)
            setOpen(true)
            form.setValue('title', bookToEdit.title)
            form.setValue('author', bookToEdit.author)
            form.setValue('description', bookToEdit.description)
            form.setValue('condition', bookToEdit.condition)
            form.setValue('isbn', bookToEdit.isbn || "")
            form.setValue('open_lib_id', bookToEdit.open_lib_id || "")
            form.setValue('status', bookToEdit.status)
            form.setValue('owner_id', bookToEdit.owner_id)
            setCover(bookToEdit.image_url || null)
        }
    }, [bookToEdit])
    const uploadFile = async (file: File, bookId: string) => {
        setError(null);

        const fileExtension = file.name.split('.').pop();
        const fileName = `covers/${bookId}.${fileExtension}`;

        // Upload file to Supabase
        const { error } = await supabase.storage
            .from('booktribe')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type, // Ensure correct MIME type
            });

        if (error) {
            setError('Upload failed');
            console.error('Upload failed:', error.message);
            return null;
        }

        // Correctly retrieve the public URL
        const { data } = supabase.storage.from('booktribe').getPublicUrl(fileName);

        if (!data) {
            setError('Failed to retrieve image URL');
            return null;
        }

        return data.publicUrl; // Store this in your database
    };

    const updateUserBooksCount = async (userId: string) => {
        const { data, error } = await supabase.from('users').update({ books_count: numberOfBooks + 1 }).eq('clerk_id', userId)
        if (error) {
            console.error('Error updating user books count:', error)
        }
    }

    const onSubmit = async (data: BookFormValues) => {
        setAddingBook(true)
        try {
            setError(null)
            const bookData: Record<string, any> = {};

            // Append all fields to FormData, but handle ISBN specially
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) {
                    // For ISBN, only include if it's not empty
                    if (key === 'isbn') {
                        bookData[key] = value || null; // Convert empty string to null
                    } else {
                        bookData[key] = value;
                    }
                }
            })

            const id = uuidv4()
            bookData.id = id
            bookData.image_url = cover

            if (bookData.image_url) {
                const imageUrl = (selectedFile) ? await uploadFile(selectedFile, id) : bookData.image_url
                bookData.image_url = imageUrl
            }

            bookData.owner_id = userId
            const { data: book, error: supabaseError } = (bookToEdit) ? 
            await supabase.from('books').update(bookData).eq('id', bookToEdit.id).select() 
            : 
            await supabase.from('books').insert([bookData]).select()

            if (supabaseError) {
                setAddingBook(false)
                setError(supabaseError.message || `Failed to ${bookToEdit ? 'update' : 'add'} book. Please try again.`)
                console.error('Error:', supabaseError)
                return
            }

            if (book) {
                setShowAllFields(false)
                updateUserBooksCount(userId)
                setAddingBook(false)
                setOpen(false)
                setCover(null)
                form.reset()
                router.refresh()
            }
        } catch (error) {
            setAddingBook(false)
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
            setError(errorMessage)
            console.error('Error adding book:', error)
        }
    }

    const queryOpenLibrary = (query: string) => {
        if (!query.trim()) return;

        setSearching(true)
        setSearchResults([])
        const limit = 12

        axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
            .then((res) => {
                const data = res.data.docs as SearchResult[]
                setSearchResults(data.slice(0, limit))
                setSearching(false)
            })
            .catch((err) => {
                console.error(err)
                setSearching(false)
            })
    }

    const handleBookSelect = (book: SearchResult) => {
        // Populate the form with the selected book's data
        form.setValue('title', book.title)
        form.setValue('author', book.author_name?.[0] || 'Unknown')
        if (book.isbn?.[0]) {
            form.setValue('isbn', book.isbn[0])
        }
        // Set OpenLibrary ID
        form.setValue('open_lib_id', book.key)
        setCover(book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '/placeholder-cover.jpg')
        setShowAllFields(true)
    }

    const handleModalState = (open: boolean) => {
        setOpen(open)
        if (!open) {
            // Reset everything when modal closes
            form.reset()
            setShowAllFields(false)
            setSearchQuery('')
            setSearchResults([])
            setCover(null)
            setSelectedFile(null)
            setError(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleModalState}>
            {showAddButton && <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <BookPlus className="mr-2 h-4 w-4" />
                    Add New Book
                </Button>
            </DialogTrigger>}
            <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>

                {showAllFields && <Button className='bg-blue-600 hover:bg-blue-700 w-fit' onClick={() => setShowAllFields(false)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>}


                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!showAllFields && (
                    <>
                        <Input
                            placeholder="Search for a title or author"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    queryOpenLibrary(searchQuery);
                                }
                            }}
                            value={searchQuery}
                        />

                        <div className="flex justify-end">
                            <Button
                                disabled={searching}
                                className={cn('bg-blue-600 hover:bg-blue-700', searching && "bg-blue-400 animate-none")}
                                type="button"
                                onClick={() => queryOpenLibrary(searchQuery)}
                            >
                                {searching ? "Searching..." : "Search Open Library"}
                            </Button>
                            <Button
                                className={cn('ml-2 bg-white text-blue-600 border-2 border-blue-600 hover:border-blue-700 hover:bg-blue-50')}
                                type="button"
                                onClick={() => setShowAllFields(true)}>
                                Add Details Manually
                            </Button>

                        </div>

                        {searchResults.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                {searchResults.map((book) => {
                                    const imageUrl = book.cover_i
                                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                                        : '/placeholder-cover.jpg'

                                    return (
                                        <div
                                            key={book.key}
                                            className="border rounded-lg p-1.5 cursor-pointer hover:border-blue-500 transition-colors"
                                            onClick={() => handleBookSelect(book)}
                                        >
                                            <div className="aspect-[2/3] relative mb-1">
                                                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
                                                <Image
                                                    src={imageUrl}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover rounded transition-opacity duration-200 opacity-0"
                                                    onLoadingComplete={(image) => {
                                                        image.classList.remove('opacity-0');
                                                    }}
                                                    onError={(e) => {
                                                        const img = e.target as HTMLImageElement
                                                        img.src = '/placeholder-cover.jpg'
                                                    }}
                                                />
                                            </div>

                                            <div className="text-xs">
                                                <p className="font-medium truncate">{book.title}</p>
                                                <p className="text-gray-500 truncate">
                                                    {book.author_name?.[0] || 'Unknown author'}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {showAllFields && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Book title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Author name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Book description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Condition</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select condition" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="New">New</SelectItem>
                                                    <SelectItem value="Good">Good</SelectItem>
                                                    <SelectItem value="Fair">Fair</SelectItem>
                                                    <SelectItem value="Poor">Poor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isbn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ISBN (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ISBN" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image_url"
                                    render={({ field: { onChange, ...field } }) => (
                                        <FormItem>
                                            <FormLabel>Book Cover (Optional)</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setSelectedFile(file);
                                                                setCover(URL.createObjectURL(file));
                                                                onChange(file);
                                                            }
                                                        }}
                                                        {...field}
                                                        value={undefined}
                                                    />
                                                    {selectedFile && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {selectedFile.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {cover && (
                                    <div className="relative w-[200px] h-[300px] rounded-md overflow-hidden">
                                        <Image
                                            src={cover || '/placeholder-book.jpg'}
                                            alt="Image"
                                            width={200}
                                            height={300}
                                            // className="object-cover"
                                            loading="lazy"
                                            onLoadingComplete={(image) => {
                                                image.classList.remove('opacity-0');
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="flex justify-end">
                                    <Button type="submit">{addingBook ? "Submitting..." : "Submit"}</Button>
                                </div>
                            </>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 