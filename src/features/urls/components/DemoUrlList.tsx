import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { UrlResponse } from '@/api/generated/schemas'

const DEMO_URLS: UrlResponse[] = [
    {
        id: 1,
        code: 'yt2025',
        originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        shortUrl: 'http://localhost:8080/yt2025',
        clickCount: 1842,
        isActive: true,
        createdAt: '2025-01-15T10:30:00Z',
        expiresAt: undefined,
    },
    {
        id: 2,
        code: 'gh-repo',
        originalUrl: 'https://github.com/gabrielplus/flylink-api',
        shortUrl: 'http://localhost:8080/gh-repo',
        clickCount: 523,
        isActive: true,
        createdAt: '2025-02-01T14:20:00Z',
        expiresAt: undefined,
    },
    {
        id: 3,
        code: 'docs',
        originalUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes',
        shortUrl: 'http://localhost:8080/docs',
        clickCount: 287,
        isActive: true,
        createdAt: '2025-02-10T09:15:00Z',
        expiresAt: undefined,
    },
    {
        id: 4,
        code: 'portfolio',
        originalUrl: 'https://linkedin.com/in/gabrielplus',
        shortUrl: 'http://localhost:8080/portfolio',
        clickCount: 94,
        isActive: false,
        createdAt: '2025-02-18T16:45:00Z',
        expiresAt: undefined,
    },
]

/**
 * Lista estática de URLs demo para exibição quando o usuário não está autenticado.
 * Usa a mesma estrutura visual da UrlList real, sem interatividade.
 */
export function DemoUrlList() {
    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden opacity-80">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/40 h-10">
                        <TableHead className="w-[200px] text-xs font-medium text-muted-foreground uppercase tracking-wider pl-6">Short Link</TableHead>
                        <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destino</TableHead>
                        <TableHead className="w-[100px] text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliques</TableHead>
                        <TableHead className="w-[100px] text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
                        <TableHead className="w-[150px] text-xs font-medium text-muted-foreground uppercase tracking-wider">Criado em</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {DEMO_URLS.map((url) => (
                        <TableRow
                            key={url.code}
                            className="h-16 hover:bg-muted/30 border-b border-border/40 transition-colors"
                        >
                            <TableCell className="font-medium py-2 pl-6">
                                <span className="font-mono text-sm font-semibold tracking-tight">/{url.code}</span>
                            </TableCell>
                            <TableCell className="py-2">
                                <div className="flex items-center gap-2 max-w-[350px]" title={url.originalUrl}>
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${url.originalUrl}&sz=32`}
                                        alt=""
                                        className="w-4 h-4 rounded-[2px] opacity-60"
                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                    <span className="truncate text-sm text-muted-foreground font-mono">{url.originalUrl}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-2">
                                <span className="text-sm font-mono text-muted-foreground">{url.clickCount}</span>
                            </TableCell>
                            <TableCell className="py-2">
                                <Badge variant={url.isActive ? 'default' : 'secondary'} className="text-xs">
                                    {url.isActive ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-2 text-muted-foreground text-xs font-mono">
                                {url.createdAt && new Date(url.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
