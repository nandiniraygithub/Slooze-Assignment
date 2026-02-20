'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LayoutDashboard, Package, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/login');
    };

    if (pathname === '/login' || pathname === '/signup' || !user) {
        return null;
    }

    const isAdmin = user?.role === 'MANAGER';

    const navItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            show: isAdmin,
        },
        {
            name: 'Products',
            href: '/products',
            icon: Package,
            show: true,
        },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-blue-600 dark:text-blue-400">
                        SLOOZE
                    </Link>
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.filter(item => item.show).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <div className="flex items-center space-x-3 pl-4 border-l">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium leading-none">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
