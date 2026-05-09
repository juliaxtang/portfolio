// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://juliaxtang.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  build: {
    assets: 'assets',
  },
});
