import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/layout/Navbar'
import { VerticalThemeSwitch } from '@/components/ui/VerticalThemeSwitch'
import type { AuthContextValue } from '@/features/auth/AuthProvider'

interface RouterContext {
    auth: AuthContextValue
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            <div className="min-h-screen bg-background text-foreground relative">
                <Navbar />
                <VerticalThemeSwitch />
                <main className="container mx-auto max-w-screen-2xl py-6 px-4 md:px-6">
                    <Outlet />
                </main>
            </div>
            <Toaster />
            <TanStackRouterDevtools />
        </>
    ),
})
