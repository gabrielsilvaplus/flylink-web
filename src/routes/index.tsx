import { createFileRoute } from '@tanstack/react-router'
import { QuickShortener } from '@/features/urls/components/QuickShortener'
import { UrlList } from '@/features/urls/components/UrlList'
import { DemoUrlList } from '@/features/urls/components/DemoUrlList'
import { useAuth } from '@/features/auth/AuthProvider'

export const Route = createFileRoute('/')({
    component: HomePage,
})

function HomePage() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="space-y-12 w-full max-w-6xl mx-auto py-12 md:py-20 relative">
            {/* Background Grid Pattern */}
            <div
                className="absolute inset-0 z-0 h-[600px] w-full pointer-events-none"
                style={{
                    backgroundSize: '100px 100px',
                    backgroundPosition: 'center top',
                    backgroundImage: `
                        linear-gradient(to right, rgba(128, 128, 128, 0.2) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(128, 128, 128, 0.2) 1px, transparent 1px)
                    `,
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                }}
            />

            {/* Hero Section */}
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter pb-2 bg-gradient-to-br from-foreground to-muted-foreground/50 bg-clip-text text-transparent drop-shadow-sm">
                    Encurte seus links <br />num piscar de olhos.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Transforme URLs gigantes em links curtos, elegantes e rastreáveis.
                    Tudo isso com a velocidade e design que você merece.
                </p>

                {/* Quick Shortener Input */}
                <div className="pt-4">
                    <QuickShortener />
                </div>
            </div>

            {/* Separator / Content */}
            <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <h2 className="text-xl font-semibold tracking-tight">
                        {isAuthenticated ? 'Recentes' : 'Exemplos'}
                    </h2>
                    {!isAuthenticated && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                            Demo
                        </span>
                    )}
                </div>
                {isAuthenticated ? <UrlList /> : <DemoUrlList />}
            </div>
        </div>
    )
}
