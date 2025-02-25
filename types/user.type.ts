export type User = {
  id: string;             // UUID
  clerk_id: string;       // Clerk User ID
  full_name: string;      
  email: string;
  avatar_url?: string;    // Optional profile picture URL
  location?: string;      // Optional location
  books_count: number;
  created_at: string;     // Timestamp
  updated_at: string;     // Timestamp
} 