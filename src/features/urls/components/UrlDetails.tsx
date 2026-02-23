import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useGetByCode, useDelete, getListAllQueryKey } from '@/api/generated/urls/urls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Calendar, BarChart3, Copy, Trash2, Loader2, ExternalLink, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { EditUrlDialog } from './EditUrlDialog'
import { QrCodeDialog } from './QrCodeDialog'
import { Link } from '@tanstack/react-router'
import { QrCode } from 'lucide-react'

interface UrlDetailsProps {
    code: string
}

export function UrlDetails({ code }: UrlDetailsProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useGetByCode(code)
    const { mutateAsync: deleteUrl, isPending: isDeleting } = useDelete()

    const url = data?.status === 200 ? data.data : undefined

    const handleCopy = () => {
        if (url?.shortUrl) {
            navigator.clipboard.writeText(url.shortUrl)
            toast.success('Link copiado!')
        }
    }

    const handleDelete = async () => {
        try {
            if (!code) return
            await deleteUrl({ code })
            await queryClient.invalidateQueries({ queryKey: getListAllQueryKey() })
            toast.success('URL excluída com sucesso!')
            navigate({ to: '/' })
        } catch {
            // Erro já tratado pelo interceptor global
        }
    }

    if (isLoading) return <UrlDetailsSkeleton />
    if (isError || !url) return <UrlDetailsError />

    return (
        <div className="w-full max-w-6xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" />
                            Voltar
                        </Link>
                        <span>/</span>
                        <span>Detalhes</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight font-mono">/{url.code}</h1>
                        <Badge variant={url.isActive ? 'default' : 'secondary'} className="h-6">
                            {url.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Criado em {new Date(url.createdAt || '').toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <QrCodeDialog
                        url={url.shortUrl || ''}
                        code={url.code || ''}
                        trigger={
                            <Button variant="outline" size="sm" className="gap-2">
                                <QrCode className="h-4 w-4" />
                                QR Code
                            </Button>
                        }
                    />
                    <EditUrlDialog url={url} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Link</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza? O link <span className="font-mono font-bold">/{url.code}</span> deixará de funcionar imediatamente.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Excluir'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Main Info Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Destino</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">URL Original</label>
                            <div className="flex items-center gap-2 max-w-full">
                                <div className="flex-1 p-3 bg-muted/40 rounded-md border font-mono text-sm truncate">
                                    {url.originalUrl}
                                </div>
                                <Button variant="outline" size="icon" asChild>
                                    <a href={url.originalUrl} target="_blank" rel="noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">Short Link</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 p-3 bg-muted/40 rounded-md border font-mono text-sm truncate text-primary">
                                    {url.shortUrl}
                                </div>
                                <Button variant="outline" size="icon" onClick={handleCopy}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cliques</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{url.clickCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Acessos registrados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Último Acesso</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mt-1.5">
                            {url.lastClickAt ? new Date(url.lastClickAt).toLocaleDateString('pt-BR', {
                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                            }) : '—'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {url.lastClickAt ? 'Data do último clique' : 'Nenhum clique ainda'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function UrlDetailsSkeleton() {
    return (
        <div className="container max-w-5xl py-10 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-48 md:col-span-2" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
        </div>
    )
}

function UrlDetailsError() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Link não encontrado</h1>
            <p className="text-muted-foreground">O link que você está procurando não existe ou foi removido.</p>
            <Button asChild variant="secondary">
                <Link to="/">Voltar para o Início</Link>
            </Button>
        </div>
    )
}
