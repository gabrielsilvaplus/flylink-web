import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { login as apiLogin } from '@/api/generated/autenticação/autenticação'
import { register as apiRegister } from '@/api/generated/autenticação/autenticação'
import type { LoginRequest, RegisterRequest } from '@/api/generated/schemas'

import {
    getToken,
    getStoredUser,
    setToken,
    setStoredUser,
    clearAuthData,
    TOKEN_KEY,
    USER_KEY,
    setOnAuthExpired,
} from './authStore'

interface AuthUser {
    name: string
    email: string
}

export interface AuthContextValue {
    isAuthenticated: boolean
    user: AuthUser | null
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getStoredUser)
    const isAuthenticated = !!user && !!getToken()

    // Registra callback para o interceptor 401 atualizar o state React
    useEffect(() => {
        setOnAuthExpired(() => {
            clearAuthData()
            setUser(null)
        })
        return () => setOnAuthExpired(() => { })
    }, [])

    // Sincroniza entre abas via storage event
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === TOKEN_KEY && !e.newValue) {
                setUser(null)
            }
            if (e.key === USER_KEY) {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null)
                } catch {
                    setUser(null)
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const login = useCallback(async (data: LoginRequest) => {
        const response = await apiLogin(data)

        if (response.status !== 200) {
            throw new Error('Falha na autenticação')
        }

        const { token, name, email } = response.data
        setToken(token)
        setStoredUser({ name, email })
        setUser({ name, email })
    }, [])

    const register = useCallback(async (data: RegisterRequest) => {
        const response = await apiRegister(data)

        if (response.status !== 201) {
            throw new Error('Falha no registro')
        }

        const { token, name, email } = response.data
        setToken(token)
        setStoredUser({ name, email })
        setUser({ name, email })
    }, [])

    const logout = useCallback(() => {
        clearAuthData()
        setUser(null)
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({ isAuthenticated, user, login, register, logout }),
        [isAuthenticated, user, login, register, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
}
