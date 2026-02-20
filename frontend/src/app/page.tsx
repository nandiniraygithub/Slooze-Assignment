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
import { AuthService } from '@/services/api';
import { toast } from 'sonner';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await AuthService.login(email, password);
      if (response?.data?.login) {
        localStorage.setItem('token', response.data.login.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.login.user));
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">SLOOZE</CardTitle>
            <CardDescription className="text-center">
              Commodities Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div>
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="manager@slooze.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Demo Access
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Manager:</span>
                  <span className="font-mono">manager@slooze.com / password123</span>
                </div>
                <div className="flex justify-between">
                  <span>Store Keeper:</span>
                  <span className="font-mono">store@slooze.com / password123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
