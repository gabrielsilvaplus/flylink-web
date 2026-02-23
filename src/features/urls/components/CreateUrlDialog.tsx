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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateUrl, useListAll } from '@/api/generated/urls/urls'
import { toast } from 'sonner'
import { useState } from 'react'
import type { CreateUrlRequest } from '@/api/generated/schemas'
import { Plus, Loader2 } from 'lucide-react'
import { createUrlSchema, type CreateUrlFormData } from '../schemas/url.schema'

export function CreateUrlDialog() {
    const [open, setOpen] = useState(false)
    const { mutateAsync: createUrl, isPending } = useCreateUrl()
    const { refetch } = useListAll()

    const form = useForm<CreateUrlFormData>({
        resolver: zodResolver(createUrlSchema),
        defaultValues: {
            originalUrl: '',
            customCode: '',
        },
    })

    async function onSubmit(values: CreateUrlFormData) {
        try {
            const payload: CreateUrlRequest = {
                originalUrl: values.originalUrl,
                customCode: values.customCode || undefined,
            }

            await createUrl({ data: payload })

            toast.success('URL encurtada com sucesso!')
            form.reset()
            setOpen(false)
            // Atualiza a lista automaticamente
            refetch()
        } catch {
            // Erro já tratado pelo interceptor global
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova URL
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Encurtar URL</DialogTitle>
                    <DialogDescription>
                        Cole o link longo e crie um encurtador personalizado.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="originalUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Original</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://exemplo.com/artigo-muito-longo" {...field} />
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
                                    <FormLabel>
                                        Código Personalizado <span className="text-muted-foreground text-xs">(Opcional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="meu-link-legal" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Se deixar em branco, geraremos um código aleatório.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Encurtar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
