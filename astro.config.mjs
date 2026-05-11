// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// Keystatic is local-dev only — excluded from production builds so the
// GitHub Pages static output stays clean.
const isProd = process.env.NODE_ENV === 'production';

const integrations = [mdx(), react()];
if (!isProd) {
  const { default: keystatic } = await import('@keystatic/astro');
  integrations.push(keystatic());
}

export default defineConfig({
  site: 'https://julia-tang.site',
  trailingSlash: 'ignore',
  integrations,
  build: {
    assets: 'assets',
  },
});
