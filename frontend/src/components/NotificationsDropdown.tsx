import { useState, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, AlertTriangle, Info, CheckCircle2, Shield } from 'lucide-react';
import { useBatch } from '@/contexts/BatchContext';

interface NotificationsDropdownProps {
  hasUnread: boolean;
  onMarkAllRead: () => void;
}

export default function NotificationsDropdown({ hasUnread, onMarkAllRead }: NotificationsDropdownProps) {
  const { batchData } = useBatch();

  // Find the highest-risk transaction (highest reconstruction error among fraudulent transactions)
  const highestRiskTransaction = useMemo(() => {
    if (!batchData?.results) return null;
    
    const fraudulentTxns = batchData.results.filter(txn => txn.isFraud);
    if (fraudulentTxns.length === 0) return null;
    
    return fraudulentTxns.reduce((highest, current) => 
      current.reconstructionError > highest.reconstructionError ? current : highest
    );
  }, [batchData]);

  // Mock notifications
  const mockNotifications = [
    {
      id: 'system-update',
      icon: Info,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      title: 'System Update',
      description: 'GraphSAGE model optimized for better detection accuracy',
      time: '2h ago',
    },
    {
      id: 'batch-complete',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      title: 'Batch Analysis Complete',
      description: batchData ? `Successfully processed ${batchData.totalTransactions} transactions` : 'Ready to process your first batch',
      time: batchData ? '1h ago' : '—',
    },
  ];

  // Dynamically add high-risk notification if available
  const notifications = useMemo(() => {
    if (highestRiskTransaction) {
      return [
        {
          id: 'high-risk',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          title: '🚨 High-Risk Anomaly Detected',
          description: `${highestRiskTransaction.transactionId} • $${highestRiskTransaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} • Error: ${highestRiskTransaction.reconstructionError.toFixed(4)}`,
          time: 'Just now',
        },
        ...mockNotifications,
      ];
    }
    return mockNotifications;
  }, [highestRiskTransaction, mockNotifications, batchData]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted/50 text-muted-foreground hover:text-foreground transition-colors relative outline-none">
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-96 p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <DropdownMenuLabel className="p-0 text-base font-semibold text-foreground">
            Notifications
          </DropdownMenuLabel>
          {hasUnread && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <DropdownMenuItem className="px-4 py-3 cursor-pointer focus:bg-muted/50 transition-colors">
                  <div className="flex gap-3 w-full">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${notification.bgColor} border ${notification.borderColor} flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
                {index < notifications.length - 1 && (
                  <DropdownMenuSeparator className="my-0 bg-border/50" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-border/50 bg-muted/20">
            <button className="w-full text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              View all notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
