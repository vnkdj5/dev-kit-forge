import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, ClipboardPaste, Trash2 } from "lucide-react";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";
import { ToolWorkspace, WorkspacePane, editorClassName } from "@/components/tools/ToolWorkspace";

export default function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      addToHistory({
        toolId: 'url-encoder',
        input,
        output: encoded,
        action: 'URL Encode'
      });
    } catch (error) {
      toast({
        title: "Encoding Error",
        description: "Failed to encode the URL",
        variant: "destructive"
      });
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      addToHistory({
        toolId: 'url-encoder',
        input,
        output: decoded,
        action: 'URL Decode'
      });
    } catch (error) {
      toast({
        title: "Decoding Error",
        description: "Invalid URL encoded string",
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
    try { setInput(await navigator.clipboard.readText()); }
    catch { toast({ title: "Paste unavailable", description: "Use your keyboard paste shortcut instead.", variant: "destructive" }); }
  };

  const clear = () => { setInput(""); setOutput(""); };

  return (
    <ToolWorkspace title="URL Encoder / Decoder" description="Encode and decode URL strings and parameters" actions={<><div className="flex rounded-md border border-border bg-secondary p-0.5"><Button size="sm" variant={mode === "encode" ? "default" : "ghost"} onClick={() => mode !== "encode" && switchMode()}>Encode</Button><Button size="sm" variant={mode === "decode" ? "default" : "ghost"} onClick={() => mode !== "decode" && switchMode()}>Decode</Button></div><Button variant="ghost" size="sm" onClick={clear}><Trash2 />Clear</Button><Button size="sm" onClick={handleProcess} disabled={!input}>{mode === "encode" ? "Encode" : "Decode"}</Button></>} status={output ? "Complete" : "Ready"}>
      <div className="tool-pane-grid">
        <WorkspacePane label={mode === 'encode' ? 'Original URL or text' : 'Encoded URL'} actions={<Button variant="ghost" size="sm" onClick={pasteInput}><ClipboardPaste />Paste</Button>}>
            <Textarea
              aria-label={mode === 'encode' ? 'Original URL or text' : 'Encoded URL'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode' 
                  ? 'Enter URL or text to encode...\nExample: Hello World!' 
                  : 'Enter encoded URL to decode...\nExample: Hello%20World%21'
              }
              className={editorClassName}
              spellCheck={false}
            />
        </WorkspacePane>
        <WorkspacePane label={mode === 'encode' ? 'Encoded result' : 'Decoded text'} actions={<Button variant="ghost" size="sm" onClick={() => copyValue(output)} disabled={!output}><Copy />Copy</Button>} className="bg-code-background">
            <Textarea
              aria-label={mode === 'encode' ? 'Encoded result' : 'Decoded text'}
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