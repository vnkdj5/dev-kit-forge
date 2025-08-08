import { Suspense } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { getToolById } from "@/lib/tool-registry";
import { HistoryPanel } from "@/components/layout/HistoryPanel";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isEmbedded = searchParams.get('embedded') === 'true' || location.pathname.startsWith('/embed/');
  const hideHistory = searchParams.get('hideHistory') === 'true' || location.pathname.startsWith('/embed/');
  

  
  if (!toolId) {
    return <Navigate to="/" replace />;
  }

  const tool = getToolById(toolId);
  
  if (!tool) {
    return <Navigate to="/" replace />;
  }

  const ToolComponent = tool.component;

  return (
    <div className={`flex h-full ${isEmbedded ? 'p-0' : ''}`}>
      {/* Main tool area */}
      <div className={`flex-1 overflow-auto ${isEmbedded ? 'p-4' : 'p-6'}`}>
        <Suspense fallback={<ToolSkeleton />}>
          <ToolComponent />
        </Suspense>
      </div>
      
      {/* History sidebar - completely hidden in embedded mode or when hideHistory is true */}
      {(isEmbedded || hideHistory) ? null : (
        <div className="w-80 border-l border-border p-4">
          <HistoryPanel currentToolId={toolId} className="h-full" />
        </div>
      )}
    </div>
  );
}

function ToolSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <Skeleton className="h-64 w-full" />
      </Card>
    </div>
  );
}