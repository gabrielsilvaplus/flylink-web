import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUpdateUrl, getGetByCodeQueryKey, getListAllQueryKey } from '@/api/generated/urls/urls'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import type { UpdateUrlRequest, UrlResponse } from '@/api/generated/schemas'
import { Pencil, Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { updateUrlSchema, type UpdateUrlFormData } from '../schemas/url.schema'

interface EditUrlDialogProps {
    url: UrlResponse
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function EditUrlDialog({ url, open: controlledOpen, onOpenChange: controlledOnOpenChange }: EditUrlDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const { mutateAsync: updateUrl, isPending } = useUpdateUrl()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const isOpen = controlledOpen ?? internalOpen

    // Helper to call both controlled and internal state updaters
    const setOpen = (value: boolean) => {
        if (controlledOnOpenChange) {
            controlledOnOpenChange(value)
        } else {
            setInternalOpen(value)
        }
    }

    const form = useForm<UpdateUrlFormData>({
        resolver: zodResolver(updateUrlSchema),
        defaultValues: {
            originalUrl: url.originalUrl || '',
            customCode: url.code || '',
        },
    })

    // Atualiza o form se a URL mudar (ex: revalidação)
    useEffect(() => {
        if (url.originalUrl) {
            form.setValue('originalUrl', url.originalUrl)
        }
        if (url.code) {
            form.setValue('customCode', url.code)
        }
    }, [url, form])

    async function onSubmit(values: UpdateUrlFormData) {
        try {
            const payload: UpdateUrlRequest = {
                originalUrl: values.originalUrl,
                customCode: values.customCode || undefined
            }

            // Assumindo que o hook aceita { code, data } com base no padrão Orval
            await updateUrl({ code: url.code!, data: payload })

            toast.success('URL atualizada com sucesso!')
            setOpen(false)

            // Invalida a lista para refletir mudanças na Home
            await queryClient.invalidateQueries({ queryKey: getListAllQueryKey() })

            // Se o código mudou, precisamos navegar para a nova URL
            if (values.customCode && values.customCode !== url.code) {
                navigate({ to: '/urls/$code', params: { code: values.customCode } })
            } else {
                // Senão, também invalida a query de detalhes atual
                queryClient.invalidateQueries({ queryKey: getGetByCodeQueryKey(url.code!) })
            }
        } catch {
            // Erro já tratado pelo interceptor global
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {!controlledOpen && (
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Editar
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar URL</DialogTitle>
                    <DialogDescription>
                        Altere o destino da sua URL encurtada <strong>/{url.code}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="originalUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL de Destino</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="customCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código Personalizado</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center">
                                            <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">/</span>
                                            <Input className="rounded-l-none" placeholder="meu-link" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
