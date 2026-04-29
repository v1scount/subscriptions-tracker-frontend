'use client'

import { createContext, useContext, ReactNode } from 'react'

const DictionaryContext = createContext<any>(null)

export function DictionaryProvider({ 
  children, 
  dictionary 
}: { 
  children: ReactNode, 
  dictionary: any 
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary() {
  const context = useContext(DictionaryContext)
  if (context === null) {
    throw new Error('useDictionary must be used within a DictionaryProvider')
  }
  return context
}
