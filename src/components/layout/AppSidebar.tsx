import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  History, 
  Search,
  Settings,
  ChevronDown,
  Binary,
  Code,
  Link,
  Braces
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { tools, getCategories } from "@/lib/tool-registry";
import { getRecentTools } from "@/lib/history";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const iconMap = {
  Binary,
  Code,
  Link,
  Braces,
  Home,
  History,
  Search,
  Settings
};

const categoryLabels = {
  encoding: 'Encoding',
  formatting: 'Formatting', 
  conversion: 'Conversion',
  string: 'String Tools',
  crypto: 'Cryptography',
  utility: 'Utilities'
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const [recentToolIds, setRecentToolIds] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['conversion']));

  useEffect(() => {
    const updateRecent = () => setRecentToolIds(getRecentTools());
    updateRecent();
    
    const handleHistoryUpdate = () => updateRecent();
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => window.removeEventListener('historyUpdated', handleHistoryUpdate);
  }, []);

  const recentTools = recentToolIds.map(id => tools.find(tool => tool.id === id)).filter(Boolean);
  const categories = getCategories();

  const getNavClasses = (isActive: boolean) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary" 
      : "hover:bg-sidebar-accent/50 transition-colors";

  const toggleCategory = (category: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(category)) {
      newOpen.delete(category);
    } else {
      newOpen.add(category);
    }
    setOpenCategories(newOpen);
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/" 
                  end 
                  className={({ isActive }) => getNavClasses(isActive)}
                >
                  <Home className="h-4 w-4" />
                  {!collapsed && <span>Home</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/history" 
                  className={({ isActive }) => getNavClasses(isActive)}
                >
                  <History className="h-4 w-4" />
                  {!collapsed && <span>History</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Recent Tools */}
        {!collapsed && recentTools.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentTools.slice(0, 3).map((tool) => {
                  const IconComponent = iconMap[tool!.icon as keyof typeof iconMap];
                  return (
                    <SidebarMenuItem key={tool!.id}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={`/tool/${tool!.id}`}
                          className={({ isActive }) => getNavClasses(isActive)}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="truncate">{tool!.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Tools by Category */}
        {!collapsed && categories.map((category) => {
          const categoryTools = tools.filter(tool => tool.category === category);
          const isOpen = openCategories.has(category);
          
          return (
            <Collapsible key={category} open={isOpen} onOpenChange={() => toggleCategory(category)}>
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer hover:text-sidebar-primary transition-colors flex items-center justify-between">
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                    <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {categoryTools.map((tool) => {
                        const IconComponent = iconMap[tool.icon as keyof typeof iconMap];
                        return (
                          <SidebarMenuItem key={tool.id}>
                            <SidebarMenuButton asChild>
                              <NavLink 
                                to={`/tool/${tool.id}`}
                                className={({ isActive }) => getNavClasses(isActive)}
                              >
                                <IconComponent className="h-4 w-4" />
                                <span className="truncate">{tool.name}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}