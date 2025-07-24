export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  keywords: string[];
}

export type ToolCategory = 
  | 'encoding'
  | 'formatting'
  | 'conversion'
  | 'string'
  | 'crypto'
  | 'utility';

export interface ToolHistory {
  id: string;
  toolId: string;
  timestamp: number;
  input: string;
  output: string;
  action?: string;
}

export interface ToolMetadata {
  title: string;
  description: string;
  example?: string;
  shortcuts?: Record<string, string>;
}