import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, X, Minimize2, Maximize2 } from "lucide-react";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">JSON Formatter</h1>
        <p className="text-muted-foreground mt-1">
          Format, validate and beautify JSON data
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={mode === 'format' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('format')}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Format
          </Button>
          <Button
            variant={mode === 'minify' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('minify')}
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            Minify
          </Button>
        </div>
        {getValidationBadge()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">Input JSON</label>
            </div>
            <Textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsValid(null);
              }}
              placeholder='Enter JSON to format...\nExample: {"name": "John", "age": 30}'
              className="min-h-48 font-mono text-sm"
            />
            <Button onClick={handleProcess} className="w-full">
              {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">
                {mode === 'format' ? 'Formatted JSON' : 'Minified JSON'}
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
              placeholder="Formatted result will appear here..."
              className="min-h-48 font-mono text-sm bg-muted/30"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}