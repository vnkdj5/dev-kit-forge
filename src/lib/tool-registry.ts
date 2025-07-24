import { lazy } from 'react';
import { Tool } from '@/types/tools';

// Tool registry - automatically discovers and registers tools
export const tools: Tool[] = [
  {
    id: 'decimal-binary',
    name: 'Decimal ↔ Binary Converter',
    description: 'Convert decimal numbers to binary with interactive bit manipulation',
    category: 'conversion',
    icon: 'Binary',
    component: lazy(() => import('@/tools/decimal-binary/DecimalBinaryTool')),
    keywords: ['decimal', 'binary', 'convert', 'bits', 'toggle', 'number', 'base']
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    category: 'encoding',
    icon: 'Code',
    component: lazy(() => import('@/tools/base64/Base64Tool')),
    keywords: ['base64', 'encode', 'decode', 'encoding', 'string']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL strings and parameters',
    category: 'encoding',
    icon: 'Link',
    component: lazy(() => import('@/tools/url-encoder/UrlEncoderTool')),
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', 'encoding']
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate and beautify JSON data',
    category: 'formatting',
    icon: 'Braces',
    component: lazy(() => import('@/tools/json-formatter/JsonFormatterTool')),
    keywords: ['json', 'format', 'beautify', 'validate', 'minify', 'pretty']
  },
  {
    id: 'text-to-json',
    name: 'Text to JSON Converter',
    description: 'Convert plain text to JSON format with prettification',
    category: 'conversion',
    icon: 'FileText',
    component: lazy(() => import('@/tools/text-to-json/TextToJsonTool')),
    keywords: ['text', 'json', 'convert', 'plain', 'string', 'format']
  },
  {
    id: 'html-viewer',
    name: 'HTML Viewer & Editor',
    description: 'Edit HTML code with live preview and real-time updates',
    category: 'formatting',
    icon: 'Code',
    component: lazy(() => import('@/tools/html-viewer/HtmlViewerTool')),
    keywords: ['html', 'preview', 'editor', 'live', 'viewer', 'render']
  }
];

export const getToolById = (id: string): Tool | undefined => {
  return tools.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: string) => {
  return tools.filter(tool => tool.category === category);
};

export const getCategories = () => {
  const categories = new Set(tools.map(tool => tool.category));
  return Array.from(categories);
};