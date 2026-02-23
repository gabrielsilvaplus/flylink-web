import { useListAll, useDelete, getListAllQueryKey, useToggleActive } from '@/api/generated/urls/urls'
import type { listAllResponse } from '@/api/generated/urls/urls'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { EditUrlDialog } from './EditUrlDialog'
import { QrCodeDialog } from './QrCodeDialog'
import type { UrlResponse } from '@/api/generated/schemas'
import { Copy, ExternalLink, Pencil, Trash2, Eye, QrCode } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'

export function UrlList() {
    const { data, isLoading, isError } = useListAll()
    const queryClient = useQueryClient()
    const { mutateAsync: deleteUrl } = useDelete()
    const { mutateAsync: toggleActive } = useToggleActive()

    // State for delete dialog
    const [urlToDelete, setUrlToDelete] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // State for edit dialog
    const [editingUrl, setEditingUrl] = useState<UrlResponse | null>(null)

    const handleDelete = async () => {
        if (!urlToDelete) return
        try {
            await deleteUrl({ code: urlToDelete })
            await queryClient.invalidateQueries({ queryKey: getListAllQueryKey() })
            toast.success('URL excluída com sucesso!')
        } catch {
            // Erro já tratado pelo interceptor global
        } finally {
            setIsDeleteDialogOpen(false)
            setUrlToDelete(null)
        }
    }

    const handleToggle = async (url: UrlResponse) => {
        if (!url.code) return

        const previousData = queryClient.getQueryData<listAllResponse>(getListAllQueryKey())

        // Optimistic Update
        queryClient.setQueryData<listAllResponse>(getListAllQueryKey(), (old) => {
            // Only update if we have a successful response with data
            if (!old || old.status !== 200) return old

            return {
                ...old,
                data: old.data.map((u) =>
                    u.code === url.code ? { ...u, isActive: !u.isActive } : u
                )
            }
        })

        try {
            await toggleActive({ code: url.code })
            // We delay invalidation slightly or rely on optimistic update until next refetch
            // But to ensure consistency, we should invalidate.
            // With layout animation, the re-sort after invalidation should be smooth.
            await queryClient.invalidateQueries({ queryKey: getListAllQueryKey() })
            toast.success(`URL ${!url.isActive ? 'ativada' : 'desativada'} com sucesso!`)
        } catch {
            // Rollback do optimistic update
            if (previousData) {
                queryClient.setQueryData(getListAllQueryKey(), previousData)
            }
        }
    }

    const handleCopy = (shortUrl: string) => {
        navigator.clipboard.writeText(shortUrl)
        toast.success('Link copiado!')
    }

    if (isLoading) {
        return (
            <div className="rounded-xl border border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/40">
                            <TableHead className="w-[200px] h-12">Short Link</TableHead>
                            <TableHead className="h-12">Link Original</TableHead>
                            <TableHead className="w-[100px] h-12">Cliques</TableHead>
                            <TableHead className="w-[100px] h-12">Status</TableHead>
                            <TableHead className="w-[150px] h-12">Data</TableHead>
                            <TableHead className="w-[100px] h-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i} className="hover:bg-transparent border-border/40">
                                <TableCell className="h-16"><Skeleton className="h-5 w-24 rounded-full opacity-50" /></TableCell>
                                <TableCell className="h-16"><Skeleton className="h-5 w-64 rounded-full opacity-40" /></TableCell>
                                <TableCell className="h-16"><Skeleton className="h-5 w-8 rounded-full opacity-30" /></TableCell>
                                <TableCell className="h-16"><Skeleton className="h-5 w-12 rounded-full opacity-30" /></TableCell>
                                <TableCell className="h-16"><Skeleton className="h-5 w-20 rounded-full opacity-30" /></TableCell>
                                <TableCell className="h-16 text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto opacity-20" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                Erro ao carregar URLs. Tente novamente mais tarde.
            </div>
        )
    }

    const urls = data?.status === 200 ? data.data : []

    if (urls.length === 0) {
        return (
            <div className="flex h-[200px] flex-col items-center justify-center space-y-4 rounded-xl border border-dashed py-12 text-center">
                <div className="text-xl font-semibold">Nenhuma URL encontrada</div>
                <p className="text-muted-foreground">Comece encurtando uma URL acima!</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/40 h-10">
                        <TableHead className="w-[200px] text-xs font-medium text-muted-foreground uppercase tracking-wider pl-6">Short Link</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destino</TableHead>
                        <TableHead className="w-[100px] text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliques</TableHead>
                        <TableHead className="w-[100px] text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
                        <TableHead className="w-[150px] text-xs font-medium text-muted-foreground uppercase tracking-wider">Criado em</TableHead>
                        <TableHead className="w-[100px] text-xs font-medium text-right pr-6"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {urls.map((url) => (
                        <TableRow
                            key={url.code}
                            className="group h-16 hover:bg-muted/30 border-b border-border/40 transition-colors"
                        >
                            <TableCell className="font-medium py-2 pl-6">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-semibold tracking-tight">/{url.code}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                        onClick={() => url.shortUrl && handleCopy(url.shortUrl)}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                                        asChild
                                    >
                                        <a href={url.shortUrl || '#'} target="_blank" rel="noreferrer">
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell className="py-2">
                                <div className="flex items-center gap-2 max-w-[350px]" title={url.originalUrl}>
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${url.originalUrl}&sz=32`}
                                        alt=""
                                        className="w-4 h-4 rounded-[2px] opacity-60 grayscale group-hover:grayscale-0 transition-all"
                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                    <span className="truncate text-sm text-muted-foreground font-mono">{url.originalUrl}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2">
                                <span className="text-sm font-mono text-muted-foreground">{url.clickCount}</span>
                            </TableCell>
                            <TableCell className="py-2">
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        checked={url.isActive}
                                        onCheckedChange={() => handleToggle(url)}
                                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                                    />
                                    <span className={`text-xs font-medium w-[48px] ${url.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {url.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2 text-muted-foreground text-xs font-mono">
                                {url.createdAt && new Date(url.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right py-2 pr-6">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" asChild>
                                        <Link to="/urls/$code" params={{ code: url.code || '' }}>
                                            <Eye className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>

                                    <QrCodeDialog
                                        url={url.shortUrl || ''}
                                        code={url.code || ''}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                                <QrCode className="h-3.5 w-3.5" />
                                            </Button>
                                        }
                                    />

                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setEditingUrl(url)}>
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            setUrlToDelete(url.code || null)
                                            setIsDeleteDialogOpen(true)
                                        }}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir URL?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta URL? Esta ação é irreversível.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog - controlled by state */}
            {
                editingUrl && (
                    <EditUrlDialog
                        url={editingUrl}
                        open={!!editingUrl}
                        onOpenChange={(open) => !open && setEditingUrl(null)}
                    />
                )
            }
        </div >
    )
}


