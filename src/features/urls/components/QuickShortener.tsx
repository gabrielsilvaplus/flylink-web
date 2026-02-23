import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Link as LinkIcon, Loader2 } from 'lucide-react'
import { useCreateUrl, getListAllQueryKey } from '@/api/generated/urls/urls'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/AuthProvider'
import { useNavigate } from '@tanstack/react-router'

export function QuickShortener() {
    const [originalUrl, setOriginalUrl] = useState('')
    const { mutateAsync: createUrl, isPending } = useCreateUrl()
    const queryClient = useQueryClient()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!originalUrl) return

        if (!isAuthenticated) {
            navigate({ to: '/login' })
            return
        }

        try {
            await createUrl({ data: { originalUrl } })
            await queryClient.invalidateQueries({ queryKey: getListAllQueryKey() })
            toast.success('Link encurtado com sucesso!')
            setOriginalUrl('')
        } catch {
            // Erro já tratado pelo interceptor global
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto my-8">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center p-1.5 bg-card border border-border rounded-full transition-all duration-200 focus-within:border-ring hover:border-ring/50">
                    {/* Icon */}
                    <div className="pl-4 pr-3 text-muted-foreground">
                        <LinkIcon className="w-5 h-5" />
                    </div>

                    {/* Input */}
                    <input
                        type="url"
                        placeholder="Cole seu link aqui..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground h-10 font-mono"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                    />

                    {/* Button */}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "rounded-full px-5 h-9 text-sm font-medium",
                            "disabled:opacity-70"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <span>Encurtar</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        )}
                    </Button>
                </div>
            </form>

            {/* Helper Text */}
            <p className="mt-3 text-center text-xs text-muted-foreground">
                Pressione <kbd className="font-mono text-[10px] bg-muted border border-border px-1 py-0.5 rounded">Enter</kbd> para encurtar
            </p>
        </div>
    )
}
