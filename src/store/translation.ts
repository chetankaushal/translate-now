import { create } from 'zustand';
import { getProvider, TranslationError } from '../translation';

export interface HistoryEntry {
  id: string;
  source: string;
  result: string;
  from: string;
  to: string;
  at: number;
}

interface State {
  from: string;
  to: string;
  input: string;
  output: string;
  engine: string | null;
  status: 'idle' | 'translating' | 'error';
  error: string | null;
  history: HistoryEntry[];

  setInput: (v: string) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  swap: () => void;
  translate: () => Promise<void>;
  clearHistory: () => void;
}

export const useTranslation = create<State>((set, get) => ({
  from: 'en',
  to: 'es',
  input: '',
  output: '',
  engine: null,
  status: 'idle',
  error: null,
  history: [],

  setInput: (input) => set({ input, error: null }),
  setFrom: (from) => set({ from, output: '', error: null }),
  setTo: (to) => set({ to, output: '', error: null }),

  swap: () => {
    const { from, to, input, output } = get();
    set({
      from: to,
      to: from,
      input: output || input,
      output: output ? input : '',
      error: null,
    });
  },

  translate: async () => {
    const { input, from, to } = get();
    if (!input.trim()) return;

    set({ status: 'translating', error: null });

    try {
      const result = await getProvider().translate({ text: input, from, to });
      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        source: input,
        result: result.text,
        from,
        to,
        at: Date.now(),
      };
      set((s) => ({
        output: result.text,
        engine: result.engine,
        status: 'idle',
        history: [entry, ...s.history].slice(0, 100),
      }));
    } catch (err) {
      set({
        status: 'error',
        error:
          err instanceof TranslationError
            ? err.message
            : 'Something went wrong. Try again.',
      });
    }
  },

  clearHistory: () => set({ history: [] }),
}));
