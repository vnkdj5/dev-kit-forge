import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToHistory } from "@/lib/history";

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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Text to JSON Converter</h1>
        <p className="text-muted-foreground">
          Convert plain text to JSON format or prettify existing JSON
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input Text
            </CardTitle>
            <CardDescription>
              Enter plain text or existing JSON to convert
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={handleConvert}
              placeholder="Enter your text here..."
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPrettify(!prettify)}
              >
                {prettify ? "Prettify: On" : "Prettify: Off"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              JSON Output
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(output)}
                  className="ml-auto"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Generated JSON output
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex items-center gap-2 p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            ) : (
              <div className="relative">
                <pre className="bg-code-background border border-code-border rounded-lg p-4 text-sm font-mono overflow-auto min-h-[300px] whitespace-pre-wrap">
                  {output || "JSON output will appear here..."}
                </pre>
                {output && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    Valid JSON
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}