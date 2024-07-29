import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import remarkPoem from './src/utils/remark-poem.mjs';


export default defineConfig({
  markdown: {
    remarkPlugins: [remarkToc, remarkPoem],
  },
});
