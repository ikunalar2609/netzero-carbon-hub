import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  Trash2,
  Database,
  AlertTriangle,
  Leaf,
  TrendingUp,
  Info,
  X,
} from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "update" | "alert" | "info" | "success";
}

const defaultNotifications: Notification[] = [
  {
    id: "n1",
    title: "New EPA eGRID Data Available",
    message: "EPA eGRID 2024 emission factors have been updated with latest grid mix data for all US subregions.",
    time: "2 hours ago",
    read: false,
    type: "update",
  },
  {
    id: "n2",
    title: "DEFRA 2025 Preview Released",
    message: "DEFRA has released preview emission factors for 2025. Review and compare with current DEFRA 2024 data.",
    time: "5 hours ago",
    read: false,
    type: "update",
  },
  {
    id: "n3",
    title: "Calculation Saved Successfully",
    message: "Your flight emissions calculation (JFK → LHR) has been saved to history.",
    time: "1 day ago",
    read: true,
    type: "success",
  },
  {
    id: "n4",
    title: "High Emission Factor Alert",
    message: "R-410A refrigerant (2,088 kgCO₂e/kg) flagged in your recent Industry calculations. Consider R-32 alternatives.",
    time: "2 days ago",
    read: true,
    type: "alert",
  },
  {
    id: "n5",
    title: "ecoinvent v3.10 Integration",
    message: "25 new emission factors from ecoinvent v3.10 are now available in the benchmark database.",
    time: "3 days ago",
    read: true,
    type: "info",
  },
  {
    id: "n6",
    title: "GLEC Framework Update",
    message: "GLEC Framework v3.0 logistics emission factors updated for intermodal and last-mile delivery.",
    time: "5 days ago",
    read: true,
    type: "update",
  },
];

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "update": return <Database className="h-3.5 w-3.5 text-[#4F46E5]" />;
      case "alert": return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
      case "success": return <Leaf className="h-3.5 w-3.5 text-emerald-500" />;
      case "info": return <Info className="h-3.5 w-3.5 text-[#0EA5E9]" />;
      default: return <Bell className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  const getBg = (type: string, read: boolean) => {
    if (read) return "bg-white";
    switch (type) {
      case "update": return "bg-[#4F46E5]/[0.03]";
      case "alert": return "bg-amber-50/50";
      case "success": return "bg-emerald-50/50";
      case "info": return "bg-[#0EA5E9]/[0.03]";
      default: return "bg-white";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-16 top-[50px] z-50 w-[380px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[9px] font-bold bg-[#4F46E5] text-white px-1.5 py-0.5 rounded-full leading-none">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-medium text-[#4F46E5] hover:underline px-2 py-1 rounded transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-[10px] font-medium text-gray-400 hover:text-gray-600 px-2 py-1 rounded transition-colors"
                >
                  Clear all
                </button>
                <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors ml-1">
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-[12px] text-gray-400">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${getBg(n.type, n.read)}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[11px] font-semibold truncate ${n.read ? "text-gray-600" : "text-gray-900"}`}>
                            {n.title}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                            className="p-0.5 rounded hover:bg-gray-200 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3 text-gray-300 hover:text-gray-500" />
                          </button>
                        </div>
                        <p className={`text-[10px] leading-relaxed mt-0.5 ${n.read ? "text-gray-400" : "text-gray-500"}`}>
                          {n.message}
                        </p>
                        <span className="text-[9px] text-gray-300 mt-1 block">{n.time}</span>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-[#4F46E5] mt-1.5 shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
