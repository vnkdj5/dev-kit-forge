import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Info } from "lucide-react";
import { addToHistory } from "@/lib/history";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolWorkspace, WorkspacePane } from "@/components/tools/ToolWorkspace";

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
      <ToolWorkspace
        title="Decimal ↔ Binary Converter"
        description="Inspect and toggle every bit of an unsigned 64-bit integer"
        status="Unsigned 64-bit"
        actions={<Button variant="ghost" size="sm" onClick={reset}><RotateCcw />Reset</Button>}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="grid shrink-0 grid-cols-1 divide-y divide-border border-b border-border md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="space-y-3 bg-card p-4">
              <div className="flex items-center justify-between"><label htmlFor="decimal-value" className="text-xs font-semibold uppercase text-muted-foreground">Decimal</label><Badge variant="outline">0 – 2⁶⁴−1</Badge></div>
              <div className="flex gap-2">
                <Input
                  id="decimal-value"
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
            </div>
            <div className="space-y-3 bg-code-background p-4">
              <div className="flex items-center justify-between"><label htmlFor="binary-value" className="text-xs font-semibold uppercase text-muted-foreground">Binary</label><Badge variant="outline">64 bits</Badge></div>
              <div className="flex gap-2">
                <Input
                  id="binary-value"
                  value={binary}
                  readOnly
                  className="font-mono text-xs text-primary"
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
          </div>

          <WorkspacePane label="Interactive 64-bit map" className="min-h-[34rem] overflow-auto lg:min-h-0">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 sm:p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                Click a bit to toggle its value. Hover or focus for its position.
              </div>
            
            {/* Bit Grid - 8 bytes, 8 bits each */}
            <div className="grid gap-2">
              {bits.length > 0 && [7, 6, 5, 4, 3, 2, 1, 0].map((byteIndex) => {
                const byteBits = getBitsForByte(byteIndex);
                return (
                  <div key={byteIndex} className="grid grid-cols-[3.75rem_minmax(0,1fr)_2.5rem] items-center gap-2 rounded-md border border-border bg-code-background p-2 sm:grid-cols-[4.5rem_minmax(0,1fr)_3rem]">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">
                      Byte {byteIndex + 1}
                    </div>
                    <div className="grid min-w-0 grid-cols-8 gap-1">
                      {byteBits.map((bit) => (
                        <Tooltip key={bit.position}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={bit.value ? "default" : "outline"}
                              size="sm"
                              className={`h-9 min-w-0 w-full p-0 font-mono text-xs transition-all ${
                                hoveredBit === bit.position 
                                  ? "ring-2 ring-primary/50 scale-110" 
                                  : ""
                              }`}
                              onClick={() => toggleBit(bit.position)}
                              onMouseEnter={() => setHoveredBit(bit.position)}
                              onMouseLeave={() => setHoveredBit(null)}
                              aria-label={`Toggle bit ${bit.position}, currently ${bit.value}`}
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
                    <div className="text-right font-mono text-xs text-muted-foreground">
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
            
            <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Most significant byte at top</span>
              <span>Least significant byte at bottom</span>
            </div>
          </div>
          </WorkspacePane>
        </div>
      </ToolWorkspace>
    </TooltipProvider>
  );
}
