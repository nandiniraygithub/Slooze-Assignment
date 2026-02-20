'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    LogOut,
    User as UserIcon,
    ChevronRight,
    Boxes,
    BarChart3,
    Home,
    Store,
    CreditCard,
    Settings,
    LifeBuoy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppSidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const router = useRouter();
    const isAdmin = user?.role === 'MANAGER';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/login');
    };

    const navItems = [
        {
            title: 'Products',
            url: '/products',
            icon: Package,
            items: []
        },
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboard,
            items: []
        },
        // {
        //     title: 'Store',
        //     url: '#',
        //     icon: Store,
        //     isOpen: true, // Default open for demo
        //     items: [
        //         { title: 'Product', url: '/products' },
        //         { title: 'Add Product', url: '/products?action=new' },
        //     ]
        // },
        // {
        //     title: 'Analytic',
        //     url: '#',
        //     icon: BarChart3,
        //     items: [
        //         { title: 'Traffic', url: '#' },
        //         { title: 'Earning', url: '#' },
        //     ]
        // },
        // {
        //     title: 'Finances',
        //     url: '#',
        //     icon: CreditCard,
        //     items: [
        //         { title: 'Payment', url: '#' },
        //         { title: 'Payout', url: '#' },
        //     ]
        // },
        // {
        //     title: 'Account Setting',
        //     url: '#',
        //     icon: Settings,
        //     items: [
        //         { title: 'My Profile', url: '#' },
        //         { title: 'Security', url: '#' },
        //     ]
        // },
        // {
        //     title: 'Help And Support',
        //     url: '#',
        //     icon: LifeBuoy,
        //     items: []
        // },
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                    <Boxes className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-black tracking-tight text-base">SLOOZE</span>
                                    <span className="truncate text-[10px] text-muted-foreground uppercase tracking-widest">
                                        {isAdmin ? 'Manager Portal' : 'Store Keeper'}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <CollapsibleNavItem key={item.title} item={item} pathname={pathname} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between p-1 gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg bg-blue-600 text-white">
                                            <AvatarFallback className="rounded-lg bg-blue-600 text-white font-bold text-sm">
                                                {user?.email?.[0]?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.email}</span>
                                            <span className="truncate text-xs text-muted-foreground capitalize">
                                                {user?.role?.toLowerCase().replace('_', ' ')}
                                            </span>
                                        </div>
                                        <ChevronRight className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56 rounded-xl"
                                    side="top"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <ThemeToggle />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

function CollapsibleNavItem({ item, pathname }: { item: any, pathname: string }) {
    const [isOpen, setIsOpen] = React.useState(item.isOpen || false);
    const hasChildren = item.items && item.items.length > 0;
    const isActive = pathname === item.url || (hasChildren && item.items.some((i: any) => pathname === i.url));

    // Auto-open if child is active
    React.useEffect(() => {
        if (hasChildren && item.items.some((i: any) => pathname === i.url)) {
            setIsOpen(true);
        }
    }, [pathname, hasChildren, item.items]);

    return (
        <SidebarMenuItem>
            {hasChildren ? (
                <>
                    <SidebarMenuButton
                        onClick={() => setIsOpen(!isOpen)}
                        isActive={isActive && !isOpen} // Highlight parent if closed and child active (optional)
                        className="group/collapsible"
                    >
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className={cn("ml-auto transition-transform duration-200", isOpen && "rotate-90")} />
                    </SidebarMenuButton>
                    {isOpen && (
                        <SidebarMenuSub>
                            {item.items.map((subItem: any) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                        <Link href={subItem.url}>
                                            {subItem.title}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    )}
                </>
            ) : (
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        {/* Add chevron for single items too if design requires, but usually not needed */}
                        {/* <ChevronRight className="ml-auto opacity-50" /> */}
                    </Link>
                </SidebarMenuButton>
            )}
        </SidebarMenuItem>
    );
}
