'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4200 },
    { name: 'Sep', value: 5100 },
    { name: 'Oct', value: 6200 },
    { name: 'Nov', value: 7800 },
    { name: 'Dec', value: 9100 },
];

export function SalesChart() {
    return (
        <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold">Sales Overview</CardTitle>
                    <CardDescription>Monthly performance revenue</CardDescription>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full">
                    +12.5% <ArrowUpRight className="w-4 h-4 ml-0.5" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pl-0">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                dy={10}
                                minTickGap={30}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(value) => `₹${value}`}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: 'hsl(var(--card-foreground))',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                }}
                                itemStyle={{ color: '#3b82f6' }}
                                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                formatter={(value: any) => [`₹${(value as number).toLocaleString()}`, 'Revenue']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
