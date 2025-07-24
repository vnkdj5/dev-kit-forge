import { HistoryPanel } from "@/components/layout/HistoryPanel";

export default function HistoryPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Activity History</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your recent tool usage history
        </p>
      </div>
      
      <HistoryPanel className="h-[calc(100vh-200px)]" />
    </div>
  );
}