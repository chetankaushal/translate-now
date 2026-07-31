/**
 * Design tokens.
 *
 * Direction: translation is transfer across a boundary, so the boundary is the
 * hero — a hairline seam splitting source from target, with the swap control
 * sitting in it. Everything else stays quiet: near-black ground, one warm
 * signal colour (amber, for the illuminated-manuscript association), generous
 * type for the text itself since that's the whole content of the app.
 */
export const color = {
  ground: '#0E1116',
  surface: '#161A21',
  surfaceLift: '#1D222B',
  seam: '#2A313C',
  accent: '#F2B441',
  accentDim: '#5C4718',
  text: '#ECEFF4',
  textMuted: '#8B97A8',
  textFaint: '#5A6472',
  danger: '#E5695B',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const type = {
  display: { fontSize: 15, fontWeight: '700', letterSpacing: 1.4 },
  body: { fontSize: 22, lineHeight: 30, fontWeight: '400' },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 1.1 },
  caption: { fontSize: 13, fontWeight: '500' },
} as const;

export const radius = { sm: 8, md: 14, pill: 999 } as const;
