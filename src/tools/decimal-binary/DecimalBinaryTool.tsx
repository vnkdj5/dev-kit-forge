import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Info } from "lucide-react";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BitData {
  position: number;
  value: 0 | 1;
  byteIndex: number;
  bitInByte: number;
}

export default function DecimalBinaryTool() {
  const [decimal, setDecimal] = useState<string>("42");
  const [binary, setBinary] = useState<string>("");
  const [bits, setBits] = useState<BitData[]>([]);
  const [hoveredBit, setHoveredBit] = useState<number | null>(null);
  const { toast } = useToast();

  const MAX_64_BIT = BigInt("18446744073709551615"); // 2^64 - 1

  useEffect(() => {
    try {
      const num = decimal === "" ? BigInt(0) : BigInt(decimal);
      if (num < 0 || num > MAX_64_BIT) {
        return; // Don't update if invalid
      }
      
      const binaryStr = num.toString(2).padStart(64, '0');
      setBinary(binaryStr);
      
      const bitData: BitData[] = binaryStr
        .split('')
        .reverse()
        .map((bit, index) => ({
          position: index,
          value: parseInt(bit) as 0 | 1,
          byteIndex: Math.floor(index / 8),
          bitInByte: index % 8
        }));
      
      setBits(bitData);
    } catch (error) {
      // Invalid input, keep previous state
    }
  }, [decimal]);

  // Initialize bits on first render
  useEffect(() => {
    if (bits.length === 0) {
      const num = BigInt(decimal);
      const binaryStr = num.toString(2).padStart(64, '0');
      const bitData: BitData[] = binaryStr
        .split('')
        .reverse()
        .map((bit, index) => ({
          position: index,
          value: parseInt(bit) as 0 | 1,
          byteIndex: Math.floor(index / 8),
          bitInByte: index % 8
        }));
      setBits(bitData);
    }
  }, []);

  const handleDecimalChange = (value: string) => {
    if (value === "") {
      setDecimal("");
      return;
    }
    
    try {
      const numValue = BigInt(value);
      if (numValue >= 0 && numValue <= MAX_64_BIT) {
        setDecimal(value);
        addToHistory({
          toolId: 'decimal-binary',
          input: value,
          output: numValue.toString(2),
          action: 'Convert to Binary'
        });
      }
    } catch (error) {
      // Invalid input, don't update
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
      acc + (bit.value ? BigInt(2) ** BigInt(bit.position) : BigInt(0)), BigInt(0)
    );
    
    const oldDecimal = decimal;
    setDecimal(newDecimal.toString());
    setBinary(newDecimal.toString(2).padStart(64, '0'));
    
    addToHistory({
      toolId: 'decimal-binary',
      input: `Toggle bit ${position} (${oldDecimal} → ${newDecimal.toString()})`,
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

  const getBitsForByte = (byteIndex: number) => {
    return bits.filter(bit => bit.byteIndex === byteIndex).sort((a, b) => b.bitInByte - a.bitInByte);
  };

  const getBitTooltip = (bit: BitData) => {
    const power = BigInt(2) ** BigInt(bit.position);
    return `Bit ${bit.position} (2^${bit.position} = ${power.toString()})`;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Decimal ↔ Binary Converter (64-bit)
          </h1>
          <p className="text-muted-foreground mt-1">
            Convert between decimal and binary with interactive 64-bit manipulation
          </p>
        </div>

        {/* Input/Output Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">Decimal</label>
                <Badge variant="outline">0 - 2^64-1</Badge>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={decimal}
                  onChange={(e) => handleDecimalChange(e.target.value)}
                  placeholder="Enter decimal number"
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
                <Badge variant="outline">64-bit</Badge>
              </div>
              <div className="flex gap-2">
                <Input
                  value={binary}
                  readOnly
                  className="font-mono text-primary text-xs"
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

        {/* Interactive Bit Display */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                Interactive 64-bit Manipulation
              </h3>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            {/* Bit Grid - 8 bytes, 8 bits each */}
            <div className="space-y-3">
              {bits.length > 0 && [7, 6, 5, 4, 3, 2, 1, 0].map((byteIndex) => {
                const byteBits = getBitsForByte(byteIndex);
                return (
                  <div key={byteIndex} className="flex items-center gap-2">
                    <div className="w-16 text-sm font-medium text-muted-foreground">
                      Byte {byteIndex + 1}:
                    </div>
                    <div className="flex gap-1">
                      {byteBits.map((bit) => (
                        <Tooltip key={bit.position}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={bit.value ? "default" : "outline"}
                              size="sm"
                              className={`w-8 h-8 font-mono text-xs p-0 transition-all ${
                                hoveredBit === bit.position 
                                  ? "ring-2 ring-primary/50 scale-110" 
                                  : ""
                              }`}
                              onClick={() => toggleBit(bit.position)}
                              onMouseEnter={() => setHoveredBit(bit.position)}
                              onMouseLeave={() => setHoveredBit(null)}
                            >
                              {bit.value}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getBitTooltip(bit)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                    {/* Byte separator for readability */}
                    <div className="text-xs text-muted-foreground ml-2">
                      {(() => {
                        const byteBits = getBitsForByte(byteIndex);
                        if (byteBits.length === 0) return '0';
                        const binaryString = byteBits.map(b => b.value).join('');
                        const byteValue = parseInt(binaryString, 2);
                        return isNaN(byteValue) ? '0' : byteValue.toString();
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-sm text-muted-foreground bg-muted/30 rounded p-3">
              <p><strong>Tip:</strong> Click any bit to toggle it and see how it affects the decimal value. Hover for bit position details!</p>
              <p className="mt-1"><strong>Layout:</strong> Most significant bits (Byte 8) at top, least significant (Byte 1) at bottom.</p>
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}
