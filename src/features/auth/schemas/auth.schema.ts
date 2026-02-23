import { z } from 'zod'

/**
 * Schema de validação para login.
 */
export const loginSchema = z.object({
    email: z.string().email('Digite um email válido'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

/**
 * Schema de validação para registro de novo usuário.
 */
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.string().email('Digite um email válido'),
    password: z
        .string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres')
        .max(100, 'A senha deve ter no máximo 100 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
