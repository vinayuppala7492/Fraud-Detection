import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Search } from "lucide-react";
import SearchModal from "@/components/SearchModal";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import UserProfileDropdown from "@/components/UserProfileDropdown";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const handleMarkAllRead = () => {
    setHasUnreadNotifications(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSearchModalOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
              <NotificationsDropdown 
                hasUnread={hasUnreadNotifications}
                onMarkAllRead={handleMarkAllRead}
              />
              <UserProfileDropdown />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
      
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
    </SidebarProvider>
  );
}
