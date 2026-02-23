import { z } from 'zod'

/**
 * Schema de validação para criação de URL encurtada.
 */
export const createUrlSchema = z.object({
    originalUrl: z.string().url('Digite uma URL válida (ex: https://google.com)'),
    customCode: z
        .string()
        .min(3, 'O código deve ter no mínimo 3 caracteres')
        .max(50, 'O código deve ter no máximo 50 caracteres')
        .regex(/^[a-zA-Z0-9-_]+$/, 'Apenas letras, números, hífens e underlines')
        .optional()
        .or(z.literal('')),
})

/**
 * Schema de validação para edição de URL encurtada.
 */
export const updateUrlSchema = z.object({
    originalUrl: z.string().url('Digite uma URL válida'),
    customCode: z.string()
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-Z0-9-_]+$/, 'Apenas letras, números, hífens e underlines')
        .optional()
        .or(z.literal(''))
})

export type CreateUrlFormData = z.infer<typeof createUrlSchema>
export type UpdateUrlFormData = z.infer<typeof updateUrlSchema>
