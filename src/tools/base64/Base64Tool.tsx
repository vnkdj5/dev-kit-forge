import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, ClipboardPaste, Trash2 } from "lucide-react";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";
import { ToolWorkspace, WorkspacePane, editorClassName } from "@/components/tools/ToolWorkspace";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      addToHistory({
        toolId: 'base64',
        input,
        output: encoded,
        action: 'Encode'
      });
    } catch (error) {
      toast({
        title: "Encoding Error",
        description: "Failed to encode the input",
        variant: "destructive"
      });
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      addToHistory({
        toolId: 'base64',
        input,
        output: decoded,
        action: 'Decode'
      });
    } catch (error) {
      toast({
        title: "Decoding Error",
        description: "Invalid Base64 input",
        variant: "destructive"
      });
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const switchMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput("");
  };

  const pasteInput = async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      toast({ title: "Paste unavailable", description: "Use your keyboard paste shortcut instead.", variant: "destructive" });
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <ToolWorkspace
      title="Base64 Encoder / Decoder"
      description="Encode or decode Base64 text locally in your browser"
      actions={<><div className="flex rounded-md border border-border bg-secondary p-0.5"><Button size="sm" variant={mode === "encode" ? "default" : "ghost"} onClick={() => mode !== "encode" && switchMode()}>Encode</Button><Button size="sm" variant={mode === "decode" ? "default" : "ghost"} onClick={() => mode !== "decode" && switchMode()}>Decode</Button></div><Button variant="ghost" size="sm" onClick={clear}><Trash2 />Clear</Button><Button size="sm" onClick={handleProcess} disabled={!input}>{mode === "encode" ? "Encode" : "Decode"}</Button></>}
      status={output ? "Complete" : "Ready"}
    >
      <div className="tool-pane-grid">
        <WorkspacePane label={mode === 'encode' ? 'Plain text input' : 'Base64 input'} actions={<Button variant="ghost" size="sm" onClick={pasteInput}><ClipboardPaste />Paste</Button>}>
            <Textarea
              aria-label={mode === 'encode' ? 'Plain text input' : 'Base64 input'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              className={editorClassName}
              spellCheck={false}
            />
        </WorkspacePane>
        <WorkspacePane label={mode === 'encode' ? 'Base64 result' : 'Decoded text'} actions={<Button variant="ghost" size="sm" onClick={() => copyValue(output)} disabled={!output}><Copy />Copy</Button>} className="bg-code-background">
            <Textarea
              aria-label={mode === 'encode' ? 'Base64 result' : 'Decoded text'}
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className={editorClassName}
            />
        </WorkspacePane>
      </div>
    </ToolWorkspace>
  );
}