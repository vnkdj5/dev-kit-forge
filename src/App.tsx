import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Index from "./pages/Index";
import ToolPage from "./pages/ToolPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper to conditionally show sidebar
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isEmbedded = searchParams.get('embedded') === 'true' || location.pathname.startsWith('/embed/');
  const hideSidebar = searchParams.get('hideSidebar') === 'true' || location.pathname.startsWith('/embed/');
  const hideHeader = searchParams.get('hideHeader') === 'true' || location.pathname.startsWith('/embed/');
  
  const showSidebar = (location.pathname.startsWith('/tool/') || location.pathname === '/history') && !hideSidebar;

  // If embedded mode, show minimal layout
  if (isEmbedded) {
    return (
      <div className="min-h-screen bg-background">
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    );
  }

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {!hideHeader && (
            <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger className="ml-4" />
            </header>
          )}
          <main className={`overflow-hidden ${hideHeader ? 'flex-1' : 'flex-1'}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tool/:toolId" element={<ToolPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/embed/tool/:toolId" element={<ToolPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
