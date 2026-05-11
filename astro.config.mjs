// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://julia-tang.site',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  build: {
    assets: 'assets',
  },
});
