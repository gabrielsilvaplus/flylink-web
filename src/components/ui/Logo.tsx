import { Link } from "@tanstack/react-router";

import logoDark from "@/assets/logos/logo-flylink-preto.png";
import logoLight from "@/assets/logos/logo-flylink-branco.png";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <Link to="/" className={cn("flex items-center gap-2 h-9 w-auto", className)}>
            <img
                src={logoDark}
                alt="FlyLink Logo"
                className="dark:hidden block h-full w-auto object-contain"
            />
            <img
                src={logoLight}
                alt="FlyLink Logo"
                className="hidden dark:block h-full w-auto object-contain"
            />
            <span className="font-bold text-lg tracking-tight">FlyLink</span>
        </Link>
    );
}
