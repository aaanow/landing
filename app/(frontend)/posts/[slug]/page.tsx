import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';
import { TableOfContents } from '@/components/TableOfContents';
import { ShareButtons } from '@/components/ShareButtons';
import { calculateReadingTime, formatReadingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/format';
import { getMediaUrl } from '@/types/cms';
import type { Post, DynamicPageProps } from '@/types/cms';

// Revalidate every hour for standard content
export const revalidate = 3600;

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    const post = result.docs[0] as Post | undefined;
    if (!post) return { title: 'Post - AAAnow' };

    const title = post.meta?.title || `${post.title} - AAAnow`;
    const description = post.meta?.description || post.excerpt || '';
    const image = getMediaUrl(post.featuredImage);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `/posts/${slug}`,
        ...(image && { images: [{ url: image }] }),
        ...(post.publishedAt && { publishedTime: post.publishedAt }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image && { images: [image] }),
      },
    };
  } catch {
    return {
      title: 'Post - AAAnow',
    };
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 100,
    });

    return result.docs.map((doc) => ({
      slug: (doc as Post).slug,
    }));
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  let post: Post | undefined;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    post = result.docs[0] as Post | undefined;
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const backgroundImage = getMediaUrl(post.featuredImage) || '/images/aisc_blog_bg-01.svg';

  return (
    <section className="section sticky">
      <div className="container top-padding">
        <div
          data-category={post.category || ''}
          className="blog-article__img-wrapper"
        >
          <img
            src={backgroundImage}
            loading="lazy"
            alt=""
            className="blog-article__banner-img"
          />
          <div className="blog-article__gradient"></div>
          <div className="blog__banner-wrapper">
            <div className="bog__data">
              {post.category && <span>{post.category}</span>}
              {post.category && post.publishedAt && <span>/</span>}
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              <span>/</span>
              <span>{formatReadingTime(calculateReadingTime(post.content))}</span>
            </div>
            <h1>{post.title}</h1>
            {post.excerpt && (
              <div className="blog-title__subheading-wrapper">
                <p className="body__subheading">{post.excerpt}</p>
              </div>
            )}
            <ShareButtons title={post.title} description={post.excerpt} />
          </div>
        </div>

        <div className="blog__content-wrapper">
          <div className="blog__content-layout">
            <div className="blog__content-text top-padding">
              {post.content ? (
                <RichText content={post.content} />
              ) : (
                <p>No content available.</p>
              )}
            </div>
            {post.content && (
              <aside className="blog__toc-sidebar">
                <TableOfContents content={post.content} />
              </aside>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
