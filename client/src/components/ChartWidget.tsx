import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Metric } from "@shared/schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChartWidgetProps {
  title: string;
  data: Metric[];
  type: 'price' | 'volatility' | 'funding';
  color?: string;
}

export function ChartWidget({ title, data, type, color = "hsl(var(--primary))" }: ChartWidgetProps) {
  // Simple optimization: prevent showing too many points
  const chartData = data.slice(-50).map(d => ({
    ...d,
    value: Number(d.value),
    formattedTime: format(new Date(d.timestamp!), 'HH:mm')
  }));

  return (
    <div className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold font-display">{title}</h3>
          <p className="text-sm text-muted-foreground">Real-time data feed</p>
        </div>
        <div className="flex gap-2">
          {['1H', '24H', '7D'].map((range) => (
            <button 
              key={range}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="formattedTime" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => type === 'price' ? `$${val}` : val}
              width={60}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#gradient-${type})`} 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
