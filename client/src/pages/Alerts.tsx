import { Sidebar } from "@/components/Sidebar";
import { CreateAlertDialog } from "@/components/CreateAlertDialog";
import { useAlerts, useDeleteAlert } from "@/hooks/use-alerts";
import { Bell, Trash2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Alerts() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: alerts, isLoading: alertsLoading, error } = useAlerts();
  const deleteAlert = useDeleteAlert();

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Please log in to configure monitoring alerts and receive notifications when metrics cross your defined thresholds.
          </p>
          <Link href="/api/login">
            <Button size="lg" className="font-bold">Login via Replit</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display text-foreground">Active Alerts</h2>
            <p className="text-muted-foreground mt-1">Manage your monitoring thresholds</p>
          </div>
          <CreateAlertDialog />
        </header>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {alertsLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading alerts...</div>
          ) : alerts?.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium">No alerts configured</h3>
              <p className="text-muted-foreground mt-2 mb-6">Create your first alert to start monitoring.</p>
              <CreateAlertDialog />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-secondary/30 border-b border-border">
                <tr>
                  <th className="p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Condition</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Symbol</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {alerts?.map((alert) => (
                  <tr key={alert.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{alert.name}</div>
                      <div className="text-xs text-muted-foreground">Created {format(new Date(alert.createdAt!), 'MMM d, yyyy')}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-secondary/50 text-xs font-mono">
                        {alert.metricType} {alert.condition === 'gt' ? '>' : '<'} {Number(alert.threshold)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm">{alert.symbol}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${alert.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className="text-sm">{alert.isActive ? 'Active' : 'Paused'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteAlert.mutate(alert.id)}
                        disabled={deleteAlert.isPending}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
