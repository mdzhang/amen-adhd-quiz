import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  base: '/amen-adhd-quiz',
  site: 'https://mdzhang.github.io/amen-adhd-quiz/',
  trailingSlash: 'always',
  integrations: [tailwind({}), sitemap(), robotsTxt()],
});
