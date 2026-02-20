'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await AuthService.login(email, password);

      if (result.data?.login?.accessToken) {
        const { accessToken, user } = result.data.login;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Also set cookies for middleware
        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=86400; SameSite=Lax`;

        // Role-based redirection
        if (user.role === 'MANAGER') {
          router.push('/dashboard');
        } else {
          router.push('/products');
        }
      } else if (result.errors) {
        setError(result.errors[0]?.message || 'Invalid credentials');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-12 bg-muted/30 border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-12 bg-muted/30 border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="w-4 h-4 rounded border-muted text-blue-600 focus:ring-blue-500" />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Keep me signed in
              </label>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              {/* <span className="bg-background px-2 text-muted-foreground">Or</span> */}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 space-y-2">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Demo Access</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium">Manager</p>
                <code className="text-[10px] text-muted-foreground">manager@slooze.com / password123</code>
              </div>
              <div>
                <p className="font-medium">Store Keeper</p>
                <code className="text-[10px] text-muted-foreground">store@slooze.com / password123</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 mix-blend-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/30 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/30 blur-[100px] rounded-full animate-bounce duration-[10000ms]" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-pink-500/30 blur-[110px] rounded-full animate-pulse delay-700" />

            <div className="relative h-full flex flex-col items-center justify-center p-12 text-center space-y-6 z-10">
              <h2 className="text-6xl font-black text-white tracking-tighter">SLOOZE</h2>
              {/* <p className="text-xl text-blue-100/80 max-w-[400px] font-medium leading-relaxed">
                Empowering your supply chain with next-generation commodity management.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
