import React from 'react'
import { supabase } from '@/lib/supabase'
import UserList from '@/components/user-list'

const page = async () => {
    const { data: users } = await supabase.from('users').select('*')

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <UserList users={users || []} />
        </div>
    )
}

export default page