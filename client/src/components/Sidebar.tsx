import { Link, useLocation } from "wouter";
import { LayoutDashboard, Bell, Activity, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose = () => {} }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/explorer", label: "Data Explorer", icon: Activity },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-border/50">
          <h1 className="text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Lumina<span className="text-foreground">Oracle</span>
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">SYSTEM ONLINE</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          {user ? (
            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email || 'No email'}</p>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors py-2 rounded-lg hover:bg-destructive/10"
                data-testid="button-logout"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-secondary/30 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">Not signed in</p>
              <Link 
                href="/api/login" 
                className="block w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                data-testid="button-login"
              >
                Login via Replit
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  return (
    <Button 
      size="icon" 
      variant="ghost" 
      className="md:hidden"
      onClick={onClick}
      data-testid="button-mobile-menu"
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </Button>
  );
}
