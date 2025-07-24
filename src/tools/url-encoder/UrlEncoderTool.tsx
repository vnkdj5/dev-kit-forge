import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ArrowUpDown } from "lucide-react";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">URL Encoder/Decoder</h1>
        <p className="text-muted-foreground mt-1">
          Encode and decode URL strings and parameters
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={mode === 'encode' ? 'default' : 'secondary'}>
          {mode === 'encode' ? 'Encoding Mode' : 'Decoding Mode'}
        </Badge>
        <Button variant="outline" onClick={switchMode}>
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">
                {mode === 'encode' ? 'Original URL/Text' : 'Encoded URL'}
              </label>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode' 
                  ? 'Enter URL or text to encode...\nExample: Hello World!' 
                  : 'Enter encoded URL to decode...\nExample: Hello%20World%21'
              }
              className="min-h-32 font-mono text-sm"
            />
            <Button onClick={handleProcess} className="w-full">
              {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">
                {mode === 'encode' ? 'Encoded Result' : 'Decoded Text'}
              </label>
              {output && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyValue(output)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="min-h-32 font-mono text-sm bg-muted/30"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}