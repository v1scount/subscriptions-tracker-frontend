'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
<<<<<<< ours
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
||||||| ancestor
import { SessionProvider } from 'next-auth/react'
=======
>>>>>>> theirs
import { useState } from 'react'
import { DictionaryProvider } from '@/components/dictionary-provider'

export default function Providers({ 
  children, 
  session,
  dictionary
}: { 
  children: React.ReactNode, 
  session: Session | null,
  dictionary: any
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }))

  return (
<<<<<<< ours
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <DictionaryProvider dictionary={dictionary}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </DictionaryProvider>
      </QueryClientProvider>
    </SessionProvider>
||||||| ancestor
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </SessionProvider>
=======
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
>>>>>>> theirs
  )
}
