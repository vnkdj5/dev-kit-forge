import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";

interface BitData {
  position: number;
  value: 0 | 1;
  decimal: number;
}

export default function DecimalBinaryTool() {
  const [decimal, setDecimal] = useState<string>("42");
  const [binary, setBinary] = useState<string>("");
  const [bits, setBits] = useState<BitData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const num = parseInt(decimal) || 0;
    const binaryStr = num.toString(2).padStart(8, '0');
    setBinary(binaryStr);
    
    const bitData: BitData[] = binaryStr
      .split('')
      .reverse()
      .map((bit, index) => ({
        position: index,
        value: parseInt(bit) as 0 | 1,
        decimal: Math.pow(2, index)
      }));
    
    setBits(bitData);
  }, [decimal]);

  const handleDecimalChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 255) {
      setDecimal(value);
      addToHistory({
        toolId: 'decimal-binary',
        input: value,
        output: numValue.toString(2),
        action: 'Convert to Binary'
      });
    }
  };

  const toggleBit = (position: number) => {
    const newBits = bits.map(bit => 
      bit.position === position 
        ? { ...bit, value: (1 - bit.value) as 0 | 1 }
        : bit
    );
    setBits(newBits);
    
    const newDecimal = newBits.reduce((acc, bit) => 
      acc + (bit.value * bit.decimal), 0
    );
    
    setDecimal(newDecimal.toString());
    setBinary(newDecimal.toString(2).padStart(8, '0'));
    
    addToHistory({
      toolId: 'decimal-binary',
      input: `Toggle bit ${position}`,
      output: newDecimal.toString(),
      action: 'Bit Toggle'
    });
  };

  const copyValue = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const reset = () => {
    setDecimal("0");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Decimal ↔ Binary Converter
        </h1>
        <p className="text-muted-foreground mt-1">
          Convert between decimal and binary with interactive bit manipulation
        </p>
      </div>

      {/* Input/Output Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">Decimal</label>
              <Badge variant="outline">0-255</Badge>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
                min="0"
                max="255"
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyValue(decimal, "Decimal")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">Binary</label>
              <Badge variant="outline">8-bit</Badge>
            </div>
            <div className="flex gap-2">
              <Input
                value={binary}
                readOnly
                className="font-mono text-primary"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyValue(binary, "Binary")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Bit Table */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              Interactive Bit Manipulation
            </h3>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Bit Position</TableHead>
                  <TableHead className="text-center">Decimal Value</TableHead>
                  <TableHead className="text-center">Binary Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bits.slice().reverse().map((bit) => (
                  <TableRow key={bit.position} className="hover:bg-muted/50">
                    <TableCell className="text-center font-mono">
                      2<sup>{bit.position}</sup>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {bit.decimal}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={bit.value ? "default" : "outline"}
                        size="sm"
                        className="w-12 h-8 font-mono"
                        onClick={() => toggleBit(bit.position)}
                      >
                        {bit.value}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="text-sm text-muted-foreground bg-muted/30 rounded p-3">
            <p><strong>Tip:</strong> Click any binary digit to toggle it and see how it affects the decimal value!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}