import { getCollection } from 'astro:content';


export async function getArticles() {
  const articles = await getArticlesByCategory('poems');
  return articles;
}

export async function getArticlesByCategory(category) {
  const posts = await getCollection(category);

  return posts.map((post) => {
    const { data, slug, body } = post;

    const summary = data.summary;

    return {
      ...data,
      title: data.title || slug,
      category: data.category || category,
      url: `/${category}/${slug}`,
      slug,
      summary,
    };
  });
}
