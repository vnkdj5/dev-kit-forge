import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolSearch, useSearchShortcut } from "@/components/search/ToolSearch";
import { HistoryPanel } from "@/components/layout/HistoryPanel";
import { tools, getCategories } from "@/lib/tool-registry";
import { Tool } from "@/types/tools";
import { 
  Binary, 
  Code, 
  Link, 
  Braces, 
  ArrowRight,
  Zap,
  Terminal,
  Layers
} from "lucide-react";

const iconMap = {
  Binary,
  Code,
  Link,
  Braces
};

const categoryLabels = {
  encoding: 'Encoding',
  formatting: 'Formatting', 
  conversion: 'Conversion',
  string: 'String Tools',
  crypto: 'Cryptography',
  utility: 'Utilities'
};

const categoryIcons = {
  encoding: Code,
  formatting: Braces,
  conversion: Binary,
  string: Terminal,
  crypto: Zap,
  utility: Layers
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  useSearchShortcut(() => {
    setSearchFocused(!searchFocused);
  });

  const categories = getCategories();
  const filteredTools = selectedCategory 
    ? tools.filter(tool => tool.category === selectedCategory)
    : tools;

  const handleToolSelect = (tool: Tool) => {
    navigate(`/tool/${tool.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Developer Utilities
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A modular collection of essential developer tools for encoding, formatting, conversion, and more.
            </p>
            
            <div className="max-w-xl mx-auto">
              <ToolSearch 
                onSelect={handleToolSelect}
                className="mb-6"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Terminal className="h-4 w-4" />
                {tools.length} Tools Available
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                No Page Reloads
              </div>
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                Modular Architecture
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Categories</h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  size="sm"
                >
                  All Tools
                </Button>
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      {categoryLabels[category as keyof typeof categoryLabels] || category}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const IconComponent = iconMap[tool.icon as keyof typeof iconMap];
                return (
                  <Card 
                    key={tool.id} 
                    className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer"
                    onClick={() => handleToolSelect(tool)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {tool.name}
                            </CardTitle>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="mb-3">
                        {tool.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[tool.category as keyof typeof categoryLabels] || tool.category}
                        </Badge>
                        <div className="flex gap-1">
                          {tool.keywords.slice(0, 2).map((keyword) => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="w-80 hidden lg:block">
            <HistoryPanel className="sticky top-8 h-[calc(100vh-4rem)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
