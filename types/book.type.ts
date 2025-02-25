export type Book = {
    id: string;
    title: string;
    author: string;
    description?: string;  // Optional field
    condition: 'New' | 'Good' | 'Fair' | 'Poor';
    isbn?: string | null;  // Can be null
    open_lib_id?: string | null;
    image_url?: string | null;
    status: 'Available' | 'Swapped' ;
    owner_id: string;
    created_at: string;
    updated_at: string;
};
