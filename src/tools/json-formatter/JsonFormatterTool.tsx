import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, X, ClipboardPaste, Trash2 } from "lucide-react";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";
import { ToolWorkspace, WorkspacePane, editorClassName } from "@/components/tools/ToolWorkspace";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const { toast } = useToast();

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      addToHistory({
        toolId: 'json-formatter',
        input,
        output: formatted,
        action: 'Format JSON'
      });
    } catch (error) {
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      addToHistory({
        toolId: 'json-formatter',
        input,
        output: minified,
        action: 'Minify JSON'
      });
    } catch (error) {
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const handleProcess = () => {
    if (mode === 'format') {
      handleFormat();
    } else {
      handleMinify();
    }
  };

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
  };

  const getValidationBadge = () => {
    if (isValid === null) return null;
    return (
      <Badge variant={isValid ? "default" : "destructive"} className="ml-2">
        {isValid ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            Valid
          </>
        ) : (
          <>
            <X className="h-3 w-3 mr-1" />
            Invalid
          </>
        )}
      </Badge>
    );
  };

  const pasteInput = async () => {
    try { setInput(await navigator.clipboard.readText()); setIsValid(null); }
    catch { toast({ title: "Paste unavailable", description: "Use your keyboard paste shortcut instead.", variant: "destructive" }); }
  };

  const clear = () => { setInput(""); setOutput(""); setIsValid(null); };

  return (
    <ToolWorkspace title="JSON Formatter" description="Format, validate, and minify JSON data" status={isValid === false ? "Invalid JSON" : output ? "Valid JSON" : "Ready"} actions={<>
        <div className="flex rounded-md border border-border bg-secondary p-0.5">
          <Button
            variant={mode === 'format' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('format')}
          >
            Format
          </Button>
          <Button
            variant={mode === 'minify' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('minify')}
          >
            Minify
          </Button>
        </div>
        {getValidationBadge()}
        <Button variant="ghost" size="sm" onClick={clear}><Trash2 />Clear</Button>
        <Button size="sm" onClick={handleProcess} disabled={!input}>{mode === 'format' ? 'Format' : 'Minify'}</Button>
      </>}>
      <div className="tool-pane-grid">
        <WorkspacePane label="Input JSON" actions={<Button variant="ghost" size="sm" onClick={pasteInput}><ClipboardPaste />Paste</Button>}>
            <Textarea
              aria-label="Input JSON"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsValid(null);
              }}
              placeholder='Enter JSON to format...\nExample: {"name": "John", "age": 30}'
              className={editorClassName}
              spellCheck={false}
            />
        </WorkspacePane>
        <WorkspacePane label={mode === 'format' ? 'Formatted JSON' : 'Minified JSON'} actions={<Button variant="ghost" size="sm" onClick={() => copyValue(output)} disabled={!output}><Copy />Copy</Button>} className="bg-code-background">
            <Textarea
              aria-label={mode === 'format' ? 'Formatted JSON' : 'Minified JSON'}
              value={output}
              readOnly
              placeholder="Formatted result will appear here..."
              className={editorClassName}
            />
        </WorkspacePane>
      </div>
    </ToolWorkspace>
  );
}