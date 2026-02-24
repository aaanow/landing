import { Metadata } from 'next';
import { getPayloadClient } from '@/src/payload';
import type { Post } from '@/types/cms';
import { ArticlesContent } from '@/components/ArticlesContent';

// Revalidate every 5 minutes for frequently updated content
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Articles - AAAnow',
  description: 'Read the latest articles, news, and stories about agency growth, client retention, and how AiSC is transforming the industry.',
};

export default async function ArticlesPage() {
  let posts: Post[] = [];

  try {
    const payload = await getPayloadClient();

    const postsResult = await payload.find({
      collection: 'posts',
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: '-publishedAt',
      limit: 100,
    });

    posts = postsResult.docs as Post[];
  } catch (error) {
    console.error('Articles: Failed to fetch posts:', error);
  }

  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div className="section-header__wrapper hero-animate hero-animate-delay-1">
          <h1>Articles, News &amp; Stories</h1>
        </div>

        <div className="section__content-wrapper hero-animate hero-animate-delay-2">
          <ArticlesContent posts={posts} />
        </div>
      </div>
    </section>
  );
}
