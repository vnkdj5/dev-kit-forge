import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Copy, Clock } from "lucide-react";
import { ToolHistory, getHistory, clearHistory } from "@/lib/history";
import { tools } from "@/lib/tool-registry";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  currentToolId?: string;
  className?: string;
}

export function HistoryPanel({ currentToolId, className }: HistoryPanelProps) {
  const [history, setHistory] = useState<ToolHistory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const updateHistory = () => setHistory(getHistory());
    updateHistory();
    
    const handleHistoryUpdate = (event: CustomEvent) => {
      setHistory(event.detail);
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate as EventListener);
    return () => window.removeEventListener('historyUpdated', handleHistoryUpdate as EventListener);
  }, []);

  const filteredHistory = currentToolId 
    ? history.filter(item => item.toolId === currentToolId)
    : history;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const handleClear = () => {
    clearHistory();
    toast({
      title: "History cleared",
      description: "All history entries have been removed",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const getToolName = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    return tool?.name || toolId;
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <h3 className="font-semibold">
            {currentToolId ? "Tool History" : "Recent Activity"}
          </h3>
        </div>
        {filteredHistory.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClear}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No history yet</p>
            <p className="text-sm">Your recent activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="p-3 rounded-lg bg-muted/30 border border-muted hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {!currentToolId && (
                      <Badge variant="secondary" className="text-xs">
                        {getToolName(item.toolId)}
                      </Badge>
                    )}
                    {item.action && (
                      <Badge variant="outline" className="text-xs">
                        {item.action}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                
                {item.input && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Input:</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopy(item.input)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-code-background border border-code-border rounded p-2 block mt-1 break-all">
                      {item.input.length > 100 ? `${item.input.slice(0, 100)}...` : item.input}
                    </code>
                  </div>
                )}
                
                {item.output && (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Output:</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopy(item.output)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-code-background border border-code-border rounded p-2 block mt-1 break-all">
                      {item.output.length > 100 ? `${item.output.slice(0, 100)}...` : item.output}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}