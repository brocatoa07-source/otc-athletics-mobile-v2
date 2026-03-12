import { create } from 'zustand';
import type { ParseResult } from '@/lib/program-import';

interface ImportStore {
  parseResult: ParseResult | null;
  setParseResult: (result: ParseResult | null) => void;
  clear: () => void;
}

export const useImportStore = create<ImportStore>((set) => ({
  parseResult: null,
  setParseResult: (result) => set({ parseResult: result }),
  clear: () => set({ parseResult: null }),
}));
