import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserProfileDropdown() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user initials from email
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/30 transition-colors outline-none">
          {getInitials(user?.email)}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
      >
        {/* User Info Section */}
        <div className="px-4 py-3 border-b border-border/50">
          <DropdownMenuLabel className="p-0 mb-2 text-sm font-semibold text-foreground">
            Account
          </DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email || 'Not signed in'}
              </p>
              <p className="text-xs text-muted-foreground">
                Fraud Analyst
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <DropdownMenuItem
            onClick={handleSignOut}
            className="px-3 py-2 cursor-pointer focus:bg-red-500/10 text-red-600 hover:text-red-700 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Sign Out</span>
            </div>
          </DropdownMenuItem>
        </div>

        {/* Footer Info */}
        <div className="px-4 py-3 border-t border-border/50 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            CyberGuard Fraud Detection v2.0
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
