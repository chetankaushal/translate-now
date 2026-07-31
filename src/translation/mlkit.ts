import TranslateText, {
  TranslateLanguage,
} from '@react-native-ml-kit/translate-text';
import type {
  LanguageCode,
  TranslateRequest,
  TranslateResult,
  TranslationProvider,
} from './types';
import { TranslationError } from './types';

/**
 * Google ML Kit on-device translation.
 *
 * Free, unlimited, no API key, no account, works offline once the language
 * model is on disk. Models are ~30MB per language and cached by the OS.
 * This is what keeps the app at $0 running cost.
 *
 * Note on the casts below: the library types `sourceLanguage`/`targetLanguage`
 * as a `TranslateLanguage` enum, and declares its return type as an empty
 * interface even though the native module resolves a plain string. Both are
 * narrowed here so the rest of the app can work in ordinary BCP-47 strings.
 * `src/languages.ts` only lists codes the enum actually supports.
 */
class MLKitProvider implements TranslationProvider {
  readonly id = 'mlkit-on-device';

  /**
   * No-op. ML Kit has no separate download call — model fetching is requested
   * inline via `downloadModelIfNeeded` on the translate call itself.
   */
  async prepare(): Promise<void> {}

  async translate({ text, from, to }: TranslateRequest): Promise<TranslateResult> {
    if (!text.trim()) return { text: '', engine: this.id };

    try {
      const raw = await TranslateText.translate({
        text,
        sourceLanguage: from as TranslateLanguage,
        targetLanguage: to as TranslateLanguage,
        // First use of a language pair pulls the model down; afterwards
        // everything is local and works with no connection at all.
        downloadModelIfNeeded: true,
      });

      return { text: (raw as unknown as string) ?? '', engine: this.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes("doesn't seem to be linked")) {
        throw new TranslationError(
          'The translation engine is not available in this build. Run `expo prebuild` and rebuild the app.',
          err,
        );
      }

      throw new TranslationError(
        `Couldn't translate ${from} to ${to}. The language pack may still be downloading — check your connection and try again.`,
        err,
      );
    }
  }
}

export const mlkitProvider = new MLKitProvider();

/** Codes ML Kit supports on-device, for validating the picker list. */
export const SUPPORTED_CODES: ReadonlySet<LanguageCode> = new Set(
  Object.values(TranslateLanguage),
);
