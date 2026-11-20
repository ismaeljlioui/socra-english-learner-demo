module.exports = {
  content: ['./src/components/ui/ai-chat-input.tsx', './src/components/ui/interactive-grid.tsx', './src/ChatStudio.tsx'],
  important: ':is(.reference-input, .interactive-grid-scope)',
  corePlugins: { preflight: false },
  theme: { extend: {
    colors: Object.fromEntries(['background','foreground','card','muted','muted-foreground','border','ring','accent','primary','primary-foreground'].map(name => [name, `hsl(var(--${name}) / <alpha-value>)`])),
    transitionDuration: { 400: '400ms' },
  } },
  plugins: [require('tailwindcss-animate')],
};
