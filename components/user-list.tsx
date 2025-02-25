import React from 'react'
import { User } from '@/types/user.type'
import Image from 'next/image'

const UserList = ({users}: {users: User[]}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="flex flex-col items-center space-y-3"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <Image
              src={user.avatar_url || '/default-avatar.png'}
              alt={user.full_name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          
          <h3 className="font-semibold text-lg text-gray-800">
            {user.full_name}
          </h3>
          
          <div className="text-sm text-gray-600">
            Joined {formatDate(user.created_at)}
          </div>
          
          <div className="text-sm text-gray-600">
            {user.books_count || 0} books
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserList