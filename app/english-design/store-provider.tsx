'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
    type EnglishVideo,
    createEnglishVideo,
    initEnglishVideo,
} from './store'

export type EnglishVideoApi = ReturnType<typeof createEnglishVideo>

export const EnglishVideoContext = createContext<EnglishVideoApi | undefined>(
    undefined,
)

export interface EnglishVideoProviderProps {
    children: ReactNode
}

export const EnglishVideoProvider = ({
    children,
}: EnglishVideoProviderProps) => {
    const storeRef = useRef<EnglishVideoApi>()
    if (!storeRef.current) {
        storeRef.current = createEnglishVideo(initEnglishVideo())
    }

    return (
        <EnglishVideoContext.Provider value={storeRef.current}>
            {children}
        </EnglishVideoContext.Provider>
    )
}

export const useEnglishVideo = <T,>(
    selector: (store: EnglishVideo) => T,
): T => {
    const englishVideoContext = useContext(EnglishVideoContext)

    if (!englishVideoContext) {
        throw new Error(`useEnglishVideo must be used within EnglishVideoProvider`)
    }

    return useStore(englishVideoContext, selector)
}