import { ReactNode } from "react";
import { CheckCircle2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolWorkspaceProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  status?: string;
  className?: string;
}

export function ToolWorkspace({
  title,
  description,
  actions,
  children,
  status = "Ready",
  className,
}: ToolWorkspaceProps) {
  return (
    <section className={cn("tool-workspace", className)}>
      <header className="tool-workspace-header">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Code2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold text-foreground">{title}</h1>
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{actions}</div>}
      </header>

      <div className="min-h-0 flex-1">{children}</div>

      <footer className="flex h-8 shrink-0 items-center justify-between border-t border-border bg-code-background px-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          {status}
        </div>
        <span className="text-[11px] uppercase text-muted-foreground">Local processing</span>
      </footer>
    </section>
  );
}

interface WorkspacePaneProps {
  label: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function WorkspacePane({ label, actions, children, className }: WorkspacePaneProps) {
  return (
    <section className={cn("flex min-h-[22rem] min-w-0 flex-1 flex-col bg-card lg:min-h-0", className)}>
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-code-background/60 px-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</h2>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export const editorClassName =
  "h-full min-h-[22rem] w-full resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm leading-6 shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring focus-visible:ring-offset-0 lg:min-h-0";