import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useMetrics(type?: 'price' | 'volatility' | 'funding', symbol?: string) {
  return useQuery({
    queryKey: [api.metrics.list.path, type, symbol],
    queryFn: async () => {
      const url = buildUrl(api.metrics.list.path);
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (symbol) params.append('symbol', symbol);
      params.append('limit', '100'); // Get history

      const res = await fetch(`${url}?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.metrics.list.responses[200].parse(await res.json());
    },
    // Poll every 5 seconds for "real-time" feel without WebSocket complexity yet
    refetchInterval: 5000, 
  });
}

export function useLatestMetrics() {
  return useQuery({
    queryKey: [api.metrics.latest.path],
    queryFn: async () => {
      const res = await fetch(api.metrics.latest.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch latest metrics");
      return api.metrics.latest.responses[200].parse(await res.json());
    },
    refetchInterval: 3000, // Update tickers faster
  });
}
