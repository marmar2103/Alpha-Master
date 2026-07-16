export const Colors = {
  bg: '#0a0a0f',
  bg2: '#111118',
  bg3: '#1a1a24',
  card: '#14141e',
  card2: '#1c1c28',
  text: '#f0eee8',
  muted: 'rgba(240,238,232,0.45)',
  faint: 'rgba(240,238,232,0.18)',
  mint: '#7ef2c3',
  violet: '#a78bfa',
  amber: '#f59e0b',
  rose: '#fb7185',
  sky: '#38bdf8',
  emerald: '#34d399',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
} as const;

export const DimensionColors: Record<string, string> = {
  sleep: Colors.sky,
  stress: Colors.rose,
  energy: Colors.amber,
  focus: Colors.violet,
  mood: Colors.mint,
  digestion: Colors.emerald,
  habit: Colors.mint,
  hrv: Colors.sky,
};
