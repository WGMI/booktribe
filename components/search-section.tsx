"use client"

import { useState } from "react";

export function SearchSection() {
  const [searchType, setSearchType] = useState<"books" | "users">("books");
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <select
          className="bg-gray-100 text-sm text-gray-700 px-3 py-2 border-r border-gray-300 outline-none"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "books" | "users")}
        >
          <option value="books">Books</option>
          <option value="users">Users</option>
        </select>
        <input
          type="text"
          placeholder={`Search for ${searchType}...`}
          className="w-full px-3 py-2 text-sm outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 text-sm">
          Search
        </button>
      </div>
    </div>
  );
}
