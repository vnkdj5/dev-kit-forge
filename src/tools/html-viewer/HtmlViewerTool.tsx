import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Code, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToHistory } from "@/lib/history";

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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">HTML Viewer & Editor</h1>
        <p className="text-muted-foreground">
          Edit HTML code and see live preview with real-time updates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              HTML Editor
            </CardTitle>
            <CardDescription>
              Edit your HTML code here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleBeautify}>
                Beautify
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your HTML code here..."
              className="flex-1 min-h-0 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Real-time HTML rendering
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 border border-border rounded-lg overflow-hidden">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="HTML Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}