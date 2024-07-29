import { z, defineCollection } from 'astro:content';

const categoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    categoryId: z.string(),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
  }),
});

const poemsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    summary: z.string(),
  }),
});

const translationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    summary: z.string(),
  }),
});

export const collections = {
  'categories': categoriesCollection,
  'pages': pagesCollection,
  'poems': poemsCollection,
  'translations': translationsCollection,
};
