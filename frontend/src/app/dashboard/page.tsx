'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Package,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Layers,
  Activity,
  UserPlus,
  Mail,
  Lock,
  CheckCircle2,
  X,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardService, UserService, AuthService } from '@/services/api';
import { SalesChart } from '@/components/sales-chart';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [storeKeepers, setStoreKeepers] = useState<any[]>([]);
  const [showAddKeeper, setShowAddKeeper] = useState(false);
  const [keeperForm, setKeeperForm] = useState({ email: '', password: '' });
  const [keeperLoading, setKeeperLoading] = useState(false);
  const [keeperError, setKeeperError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    if (parsedUser.role !== 'MANAGER') {
      router.push('/products');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const statsData = await DashboardService.getStats();
      setStats(statsData);
      const keepersData = await UserService.getStoreKeepers();
      setStoreKeepers(keepersData);
    } catch (err) {
      toast.error('Failed to update dashboard data');
    }
  };

  const handleAddStoreKeeper = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeeperLoading(true);
    setKeeperError('');

    try {
      const result = await AuthService.createStoreKeeper(keeperForm.email, keeperForm.password);
      if (result.errors) {
        setKeeperError(result.errors[0]?.message || 'Failed to create account');
        toast.error('Failed to create store keeper account');
        return;
      }

      toast.success(`Store Keeper "${keeperForm.email}" created successfully!`);
      setKeeperForm({ email: '', password: '' });
      setShowAddKeeper(false);

      const keepersData = await UserService.getStoreKeepers();
      setStoreKeepers(keepersData);
    } catch (err) {
      setKeeperError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setKeeperLoading(false);
    }
  };

  if (!user || user.role !== 'MANAGER') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const mainStats = [
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? 0,
      description: 'Items in your catalog',
      iconPath: '/icons/icons8-product-50.png',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      trend: '+12.5%',
    },
    {
      title: 'Inventory Vol.',
      value: (stats?.totalQuantity ?? 0).toLocaleString(),
      description: 'Total stock units',
      iconPath: '/icons/icons8-products-pile-50.png',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      trend: '+4.3%',
    },
    {
      title: 'Store Keepers',
      value: storeKeepers.length,
      description: 'Active operators',
      iconPath: '/icons/',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      trend: 'Managed',
    },
    {
      title: 'Revenue Forecast',
      value: '₹24.5k',
      description: 'Estimated inventory value',
      iconPath: '/icons/icons8-budget-50.png',
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      trend: '+70.5%',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            Dashboard
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
              Manager
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">Real-time insights and team management.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button variant="outline" className="h-10 border-blue-100 dark:border-blue-900 font-semibold" onClick={loadData}>
            <Activity className="w-4 h-4 mr-2" />
            Sync Data
          </Button> */}
          <Button onClick={() => router.push('/products')} className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
            <div className="relative w-5 h-5">
              <Image
                src="/icons/icons8-add-shopping-cart-50.png"
                alt="Add"
                fill
                className="object-contain invert brightness-0"
              />
            </div>
            Add Commodity
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300">
            <div className={cn("absolute inset-0 opacity-10 blur-3xl", stat.bg)} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg relative w-10 h-10 flex items-center justify-center", stat.bg)}>
                <div className="relative w-6 h-6">
                  <Image
                    src={stat.iconPath}
                    alt={stat.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.description}</p>
                </div>
                <div className={cn("text-xs font-bold flex items-center pb-1",
                  stat.trend.startsWith('+') ? "text-green-600" : "text-blue-600"
                )}>
                  {stat.trend}
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Management + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 h-[400px]">
          <SalesChart />
        </div>

        {/* Team Management Panel */}
        {/* Recent Sales List */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base font-bold">Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: 'Indra Maulana', email: 'indramaulana@gmail.com', amount: '+₹1,500.00' },
                { name: 'Sarah Wilson', email: 'sarah.wilson@example.com', amount: '+₹2,350.00' },
                { name: 'Michael Chen', email: 'michael.c@company.com', amount: '+₹850.00' },
                { name: 'Emily Davis', email: 'emily.davis@design.net', amount: '+₹3,200.00' },
                { name: 'David Miller', email: 'miller.david@tech.io', amount: '+₹1,100.00' },
              ].map((sale, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                      {sale.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-none">{sale.name}</p>
                      <p className="text-[11px] text-muted-foreground">{sale.email}</p>
                    </div>
                  </div>
                  <div className="font-bold text-sm tracking-tight">{sale.amount}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
