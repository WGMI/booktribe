import { Book, RefreshCw, Clock } from 'lucide-react'

export function StatsCards({ numberOfBooks }: { numberOfBooks: number }) {
  // In a real app, these would be fetched from your database
  const stats = [
    {
      title: "Total Books",
      value: numberOfBooks,
      icon: <Book className="h-4 w-4 text-blue-600" />,
      description: "Books in your library"
    },
    {
      title: "Completed Swaps",
      value: "12",
      icon: <RefreshCw className="h-4 w-4 text-green-600" />,
      description: "Successful exchanges"
    },
    {
      title: "Pending Requests",
      value: "3",
      icon: <Clock className="h-4 w-4 text-orange-600" />,
      description: "Awaiting response"
    },
  ]

  return (
    <>
      <div className="flex flex-row items-center justify-between border border-blue-400 p-2 rounded-full shadow-sm">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`flex flex-1 justify-center items-center ${index !== stats.length - 1 ? 'border-r border-blue-400' : ''}`}>
              <div className="text-xs uppercase">{stat.title}</div>&nbsp;
              <div className="text-xl text-blue-600 font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </>
  )
}

