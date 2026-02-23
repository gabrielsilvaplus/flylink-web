export const TOKEN_KEY = 'flylink.auth.token'
export const USER_KEY = 'flylink.auth.user'

interface StoredUser {
    name: string
    email: string
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
}

export function getStoredUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null

    try {
        return JSON.parse(raw) as StoredUser
    } catch {
        clearStoredUser()
        return null
    }
}

export function setStoredUser(user: StoredUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredUser(): void {
    localStorage.removeItem(USER_KEY)
}

/**
 * Limpa todos os dados de autenticação de uma vez.
 */
export function clearAuthData(): void {
    clearToken()
    clearStoredUser()
}

/**
 * Callback global para o interceptor Axios sinalizar expiração de token.
 * Permite que o interceptor (fora do React) atualize o state React.
 */
let onAuthExpiredCallback: (() => void) | null = null

export function setOnAuthExpired(cb: () => void) {
    onAuthExpiredCallback = cb
}

export function triggerAuthExpired() {
    onAuthExpiredCallback?.()
}
