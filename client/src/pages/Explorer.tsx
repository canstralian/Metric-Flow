import { Sidebar } from "@/components/Sidebar";
import { Activity } from "lucide-react";

export default function Explorer() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-3">Data Explorer</h1>
          <p className="text-muted-foreground mb-8">
            Advanced historical data query and export tools are coming soon. 
            Access raw Oracle feeds via our API Gateway.
          </p>
          <div className="p-4 bg-card border border-border rounded-xl text-left font-mono text-sm overflow-x-auto">
            <div className="text-muted-foreground mb-2">// Example API Query</div>
            <div className="text-primary">curl -X GET https://api.lumina.zone/v1/metrics \</div>
            <div className="pl-4 text-primary">-H "Authorization: Bearer KEY" \</div>
            <div className="pl-4 text-primary">-d "symbol=BTC-USD&type=volatility"</div>
          </div>
        </div>
      </main>
    </div>
  );
}
