export type LanguageCode = string;

export interface TranslateRequest {
  text: string;
  from: LanguageCode;
  to: LanguageCode;
}

export interface TranslateResult {
  text: string;
  /** Which engine produced this. Surfaced in the UI so offline vs online is never a mystery. */
  engine: string;
}

export interface TranslationProvider {
  readonly id: string;
  /** Optional warm-up hook. Engines with no setup step implement this as a no-op. */
  prepare(): Promise<void>;
  translate(req: TranslateRequest): Promise<TranslateResult>;
}

export class TranslationError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'TranslationError';
  }
}
