//import { getArticlesByCategory } from './getArticles';

//import { getCollection } from 'astro:content';

export async function getCategory(categories, categoryId) {
  if (categoryId === 'pages') {
    // Root pages don't have category data
    return null;
  }

  // Get all categories from the collection

  // Find the category by ID
  const category = categories.find((entry) => entry.data.categoryId === categoryId);

  if (!category) {
    console.log(categories);
    throw new Error(`Category ${categoryId} not found. Make sure you have a file with 'categoryId: ${categoryId}'`);
  }

  return category;
}
