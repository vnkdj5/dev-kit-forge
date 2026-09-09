import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, ClipboardPaste, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToHistory } from "@/lib/history";
import { ToolWorkspace, WorkspacePane, editorClassName } from "@/components/tools/ToolWorkspace";

export default function TextToJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [prettify, setPrettify] = useState(true);
  const { toast } = useToast();

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }

    try {
      // Try to parse as existing JSON first
      let parsed;
      try {
        parsed = JSON.parse(input);
      } catch {
        // If not valid JSON, treat as plain text and wrap it
        parsed = { text: input };
      }

      const result = prettify 
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed);
      
      setOutput(result);
      setError("");
      
      addToHistory({
        toolId: 'text-to-json',
        input: input,
        output: result,
        action: prettify ? 'convert-prettify' : 'convert-minify'
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Invalid input";
      setError(errorMsg);
      setOutput("");
    }
  }, [input, prettify]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
  }, [toast]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  const handlePaste = useCallback(async () => {
    try { setInput(await navigator.clipboard.readText()); }
    catch { toast({ title: "Paste unavailable", description: "Use your keyboard paste shortcut instead.", variant: "destructive" }); }
  }, [toast]);

  return (
    <ToolWorkspace title="Text to JSON Converter" description="Convert plain text to JSON or normalize existing JSON" status={error ? "Conversion error" : output ? "Valid JSON" : "Ready"} actions={<><Button variant={prettify ? "secondary" : "ghost"} size="sm" onClick={() => setPrettify(!prettify)}>Prettify {prettify ? "On" : "Off"}</Button><Button variant="ghost" size="sm" onClick={handleClear}><Trash2 />Clear</Button><Button size="sm" onClick={handleConvert} disabled={!input}>Convert</Button></>}>
      <div className="tool-pane-grid">
        <WorkspacePane label="Input text" actions={<Button variant="ghost" size="sm" onClick={handlePaste}><ClipboardPaste />Paste</Button>}>
            <Textarea
              aria-label="Input text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your text here..."
              className={editorClassName}
              spellCheck={false}
            />
        </WorkspacePane>
        <WorkspacePane label="JSON output" actions={<><Badge variant={output ? "secondary" : "outline"}>{output ? "Valid JSON" : "Waiting"}</Badge><Button variant="ghost" size="sm" onClick={() => handleCopy(output)} disabled={!output}><Copy />Copy</Button></>} className="bg-code-background">
            {error ? (
              <div className="m-5 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            ) : (
              <div className="h-full min-h-[22rem] lg:min-h-0">
                <pre className="h-full overflow-auto whitespace-pre-wrap p-5 font-mono text-sm leading-6 text-foreground">
                  {output || "JSON output will appear here..."}
                </pre>
              </div>
            )}
        </WorkspacePane>
      </div>
    </ToolWorkspace>
  );
}