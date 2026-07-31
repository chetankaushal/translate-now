import { mlkitProvider } from './mlkit';
import { mockProvider } from './mock';
import type { TranslationProvider } from './types';

const providers: Record<string, TranslationProvider> = {
  mlkit: mlkitProvider,
  mock: mockProvider,
};

/**
 * Swap engines here. Adding a cloud provider (DeepL, Google Cloud Translation,
 * an LLM) means writing one file that implements TranslationProvider and
 * registering it above — no UI changes.
 */
export function getProvider(): TranslationProvider {
  const requested = process.env.EXPO_PUBLIC_TRANSLATION_PROVIDER ?? 'mlkit';
  return providers[requested] ?? mlkitProvider;
}

export * from './types';
