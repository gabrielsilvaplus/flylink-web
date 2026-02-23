import { Link } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '@/features/auth/AuthProvider'

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
                <Logo className="transition-opacity hover:opacity-80" />

                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        <a href="http://localhost:8080/docs.html" target="_blank" rel="noreferrer">
                            API Docs
                        </a>
                    </Button>
                    <div className="h-4 w-[1px] bg-border" />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium hidden sm:inline">
                                {user?.name}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="h-8 gap-2 text-muted-foreground hover:text-destructive"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Sair</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button variant="default" size="sm" className="h-8 px-4 rounded-full" asChild>
                                <Link to="/register">Criar conta</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}
