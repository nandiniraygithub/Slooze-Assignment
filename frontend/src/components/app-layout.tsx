'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/products': 'Products',
};

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    useEffect(() => {
        setMounted(true);
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [pathname]);

    if (!mounted) return null;
    if (isAuthPage) return <>{children}</>;
    if (!user) return <>{children}</>;

    const pageTitle = PAGE_TITLES[pathname] || 'Page';

    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <SidebarInset>
                {/* Top header bar */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur px-4 sticky top-0 z-40">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-semibold">{pageTitle}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                {/* Page content */}
                <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
