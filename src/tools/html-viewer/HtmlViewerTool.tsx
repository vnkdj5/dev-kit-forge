import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ClipboardPaste, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToHistory } from "@/lib/history";
import { ToolWorkspace, WorkspacePane, editorClassName } from "@/components/tools/ToolWorkspace";

export default function HtmlViewerTool() {
  const [input, setInput] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Preview</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .highlight { background-color: #ffeb3b; }
    </style>
</head>
<body>
    <h1>Welcome to HTML Viewer</h1>
    <p>This is a <span class="highlight">live preview</span> of your HTML!</p>
    <ul>
        <li>Edit the HTML on the left</li>
        <li>See changes instantly on the right</li>
        <li>Copy or export your code</li>
    </ul>
</body>
</html>`);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const updatePreview = useCallback(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(input);
        doc.close();
      }
    }
  }, [input]);

  useEffect(() => {
    updatePreview();
    
    if (input.trim()) {
      addToHistory({
        toolId: 'html-viewer',
        input: input,
        output: 'HTML rendered',
        action: 'preview'
      });
    }
  }, [input, updatePreview]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(input);
    toast({
      title: "Copied!",
      description: "HTML code copied to clipboard",
    });
  }, [input, toast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([input], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "HTML file saved as preview.html",
    });
  }, [input, toast]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const handleBeautify = useCallback(() => {
    try {
      // Simple HTML beautification (basic indentation)
      const beautified = input
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/gm, '')
        .split('\n')
        .map((line, index, array) => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          
          let indent = 0;
          for (let i = 0; i < index; i++) {
            const prevLine = array[i].trim();
            if (prevLine.match(/<[^\/][^>]*[^\/]>$/)) indent++;
            if (prevLine.match(/<\/[^>]+>$/)) indent--;
          }
          
          if (trimmed.match(/^<\/[^>]+>$/)) indent--;
          
          return '  '.repeat(Math.max(0, indent)) + trimmed;
        })
        .join('\n');
      
      setInput(beautified);
      toast({
        title: "Beautified!",
        description: "HTML has been formatted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to beautify HTML",
        variant: "destructive"
      });
    }
  }, [input, toast]);

  const handlePaste = useCallback(async () => {
    try { setInput(await navigator.clipboard.readText()); }
    catch { toast({ title: "Paste unavailable", description: "Use your keyboard paste shortcut instead.", variant: "destructive" }); }
  }, [toast]);

  return (
    <ToolWorkspace title="HTML Viewer & Editor" description="Edit HTML and see the rendered page update live" status={input ? "Preview live" : "Ready"} actions={<><Button variant="ghost" size="sm" onClick={handleBeautify}>Beautify</Button><Button variant="ghost" size="sm" onClick={handleClear}><Trash2 />Clear</Button><Button size="sm" onClick={handleDownload} disabled={!input}><Download />Export HTML</Button></>}>
      <div className="tool-pane-grid">
        <WorkspacePane label="HTML editor" actions={<><Button variant="ghost" size="sm" onClick={handlePaste}><ClipboardPaste />Paste</Button><Button variant="ghost" size="sm" onClick={handleCopy} disabled={!input}><Copy />Copy</Button></>}>
            <Textarea
              aria-label="HTML editor"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your HTML code here..."
              className={editorClassName}
              spellCheck={false}
            />
        </WorkspacePane>
        <WorkspacePane label="Live preview" className="bg-code-background">
            <div className="h-full min-h-[22rem] overflow-hidden bg-foreground lg:min-h-0">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="HTML Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
        </WorkspacePane>
      </div>
    </ToolWorkspace>
  );
}