import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreateAlert } from "@/hooks/use-alerts";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Form validation schema - matching backend types but strict on frontend
const alertFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  metricType: z.enum(["price", "volatility", "funding"]),
  condition: z.enum(["gt", "lt"]),
  threshold: z.coerce.number().min(0, "Must be positive"),
});

export function CreateAlertDialog() {
  const [open, setOpen] = useState(false);
  const createAlert = useCreateAlert();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    symbol: "BTC-USD",
    metricType: "price",
    condition: "gt",
    threshold: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create alerts", variant: "destructive" });
      return;
    }
    try {
      const validated = alertFormSchema.parse(formData);
      createAlert.mutate({
        ...validated,
        userId: user.id,
        threshold: validated.threshold.toString() // Convert number back to string/decimal for DB
      }, {
        onSuccess: () => {
          setOpen(false);
          toast({ title: "Success", description: "Alert created successfully" });
          setFormData({
             name: "",
             symbol: "BTC-USD",
             metricType: "price",
             condition: "gt",
             threshold: "",
          });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: "Validation Error", description: err.errors[0].message, variant: "destructive" });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          New Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create Monitor Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Alert Name</Label>
            <Input 
              value={formData.name}
              onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g. Bitcoin Breakout" 
              className="bg-background border-input focus:ring-primary/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Select 
                value={formData.symbol} 
                onValueChange={val => setFormData(prev => ({...prev, symbol: val}))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC-USD">BTC-USD</SelectItem>
                  <SelectItem value="ETH-USD">ETH-USD</SelectItem>
                  <SelectItem value="SOL-USD">SOL-USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Metric</Label>
              <Select 
                value={formData.metricType} 
                onValueChange={val => setFormData(prev => ({...prev, metricType: val}))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volatility">Volatility</SelectItem>
                  <SelectItem value="funding">Funding Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={val => setFormData(prev => ({...prev, condition: val}))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">Greater Than</SelectItem>
                  <SelectItem value="lt">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Threshold</Label>
              <Input 
                type="number"
                step="any"
                value={formData.threshold}
                onChange={e => setFormData(prev => ({...prev, threshold: e.target.value}))}
                placeholder="0.00" 
                className="bg-background"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createAlert.isPending}>
              {createAlert.isPending ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
