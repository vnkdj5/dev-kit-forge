import { useState, useEffect, useMemo } from "react";
import { Search, Command } from "lucide-react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tools } from "@/lib/tool-registry";
import { Tool } from "@/types/tools";
import { useNavigate } from "react-router-dom";

interface ToolSearchProps {
  onSelect?: (tool: Tool) => void;
  className?: string;
}

export function ToolSearch({ onSelect, className }: ToolSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>(tools);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: ['name', 'description', 'keywords', 'category'],
      threshold: 0.4,
      includeScore: true
    });
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(tools);
    } else {
      const searchResults = fuse.search(query);
      setResults(searchResults.map(result => result.item));
    }
  }, [query, fuse]);

  const handleSelectTool = (tool: Tool) => {
    if (onSelect) {
      onSelect(tool);
    } else {
      navigate(`/tool/${tool.id}`);
    }
    setIsOpen(false);
    setQuery("");
  };

  const categoryColors = {
    encoding: 'bg-blue-500/10 text-blue-700 border-blue-300',
    formatting: 'bg-green-500/10 text-green-700 border-green-300',
    conversion: 'bg-purple-500/10 text-purple-700 border-purple-300',
    string: 'bg-orange-500/10 text-orange-700 border-orange-300',
    crypto: 'bg-red-500/10 text-red-700 border-red-300',
    utility: 'bg-gray-500/10 text-gray-700 border-gray-300'
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tools... (⌘K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 pr-10"
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          <Command className="h-3 w-3" />
          K
        </kbd>
      </div>

      {isOpen && (query.trim() !== "" || results.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-auto border shadow-lg">
          <div className="p-2">
            {results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No tools found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {results.slice(0, 8).map((tool) => (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 hover:bg-muted/50"
                    onClick={() => handleSelectTool(tool)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{tool.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${categoryColors[tool.category] || categoryColors.utility}`}
                          >
                            {tool.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

// Keyboard shortcut hook
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}