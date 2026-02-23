import Axios, { type AxiosError } from 'axios'
import { toast } from 'sonner'
import { getToken } from '@/features/auth/authStore'
import { triggerAuthExpired } from '@/features/auth/authStore'

/**
 * Instância Axios base configurada.
 */
export const AXIOS_INSTANCE = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - adicionar token JWT
AXIOS_INSTANCE.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - tratamento global de erros
AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ignora cancelamentos do React Query (navegação rápida, unmount)
        if (Axios.isCancel(error)) {
            return Promise.reject(error)
        }

        // Erro de conexão/rede (Backend offline)
        if (!error.response) {
            toast.error('Não foi possível conectar ao servidor', {
                description: 'Verifique se o backend está rodando.',
            })
            return Promise.reject(error)
        }

        // 401 Unauthorized
        if (error.response.status === 401) {
            const isAuthEndpoint = error.config?.url?.includes('/auth/')

            if (isAuthEndpoint) {
                // Credenciais erradas (login) → mostra mensagem da API
                const data = error.response?.data
                const message = data?.message || 'Credenciais inválidas'
                toast.error(message)
            } else {
                // Token expirado → limpa auth, route guard redireciona
                triggerAuthExpired()
            }

            return Promise.reject(error)
        }

        // Erros da API com mensagem estruturada
        const data = error.response?.data
        const message = data?.message || 'Ocorreu um erro inesperado'
        const description = data?.path || `Status: ${error.response.status}`

        // Evita toast para 404 de favicon ou assets
        if (error.response.status === 404 && error.config?.url?.includes('favicon')) {
            return Promise.reject(error)
        }

        toast.error(message, {
            description,
        })

        return Promise.reject(error)
    }
)

/**
 * Custom instance para Orval.
 * Orval gera código com assinatura (url: string, options?: RequestInit).
 * Esta função adapta para usar Axios internamente.
 */
export const customInstance = async <T>(
    url: string,
    options?: RequestInit
): Promise<T> => {
    const response = await AXIOS_INSTANCE({
        url,
        method: (options?.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') || 'GET',
        data: options?.body,
        headers: options?.headers as Record<string, string>,
        signal: options?.signal as AbortSignal,
    })

    // Retorna estrutura compatível com o que Orval espera
    return {
        data: response.data,
        status: response.status,
        headers: response.headers,
    } as T
}

// Tipos exportados para uso com React Query (Orval os importa)
export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData

export default customInstance
