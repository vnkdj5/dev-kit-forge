import { ToolHistory } from '@/types/tools';

export { type ToolHistory } from '@/types/tools';

const HISTORY_KEY = 'dev-tools-history';
const MAX_HISTORY_ITEMS = 10;

export const getHistory = (): ToolHistory[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addToHistory = (entry: Omit<ToolHistory, 'id' | 'timestamp'>): void => {
  try {
    const history = getHistory();
    const newEntry: ToolHistory = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('historyUpdated', { detail: updatedHistory }));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new CustomEvent('historyUpdated', { detail: [] }));
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const getRecentTools = (limit: number = 5): string[] => {
  const history = getHistory();
  const toolIds = new Set<string>();
  const result: string[] = [];
  
  for (const entry of history) {
    if (!toolIds.has(entry.toolId) && result.length < limit) {
      toolIds.add(entry.toolId);
      result.push(entry.toolId);
    }
  }
  
  return result;
};