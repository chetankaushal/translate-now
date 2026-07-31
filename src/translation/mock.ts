import type { TranslateRequest, TranslateResult, TranslationProvider } from './types';

/**
 * Deterministic offline provider used by the CI smoke tests.
 *
 * Why this exists: the real ML Kit provider downloads a ~30MB model from
 * Google's CDN on first use. Wiring that into a smoke test means a red build
 * every time the CDN is slow — the test would be measuring Google's uptime,
 * not our app. This provider makes the assertion "the app translates" testable
 * end to end (UI -> store -> provider -> UI) without any network at all.
 *
 * Selected via EXPO_PUBLIC_TRANSLATION_PROVIDER=mock. Never active in a release build.
 */
class MockProvider implements TranslationProvider {
  readonly id = 'mock';

  async prepare(): Promise<void> {
    /* nothing to download */
  }

  async translate({ text, to }: TranslateRequest): Promise<TranslateResult> {
    // Small delay so the loading state is actually exercised by the test.
    await new Promise((r) => setTimeout(r, 120));
    if (!text.trim()) return { text: '', engine: this.id };
    return { text: `[${to}] ${text}`, engine: this.id };
  }
}

export const mockProvider = new MockProvider();
