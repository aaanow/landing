import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';
import { TableOfContents } from '@/components/TableOfContents';
import { ShareButtons } from '@/components/ShareButtons';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { BannerFade } from '@/components/BannerFade';
import { calculateReadingTime, formatReadingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/format';
import { getMediaUrl } from '@/types/cms';
import type { Post, DynamicPageProps } from '@/types/cms';

// Fallback revalidation; on-demand revalidation handles immediate updates
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

  // Fetch related articles (same category first, then recent)
  let relatedPosts: Post[] = [];
  try {
    const payload = await getPayloadClient();
    if (post.category) {
      const sameCat = await payload.find({
        collection: 'posts',
        where: {
          _status: { equals: 'published' },
          category: { equals: post.category },
          slug: { not_equals: post.slug },
        },
        sort: '-publishedAt',
        limit: 3,
      });
      relatedPosts = sameCat.docs as Post[];
    }
    // Fill remaining slots with recent posts
    if (relatedPosts.length < 3) {
      const excludeSlugs = [post.slug, ...relatedPosts.map((p) => p.slug)];
      const recent = await payload.find({
        collection: 'posts',
        where: {
          _status: { equals: 'published' },
          slug: { not_in: excludeSlugs },
        },
        sort: '-publishedAt',
        limit: 3 - relatedPosts.length,
      });
      relatedPosts = [...relatedPosts, ...(recent.docs as Post[])];
    }
  } catch {
    // Silently fail — related articles are non-critical
  }

  return (
    <section className="section sticky">
      <div className="container top-padding">
        <BannerFade targetSelector=".blog-article__img-wrapper" />
        <div
          data-category={post.category || ''}
          className="blog-article__img-wrapper"
        >
          <img
            src={backgroundImage}
            loading="lazy"
            alt={post.title}
            className="blog-article__banner-img"
          />
          <div className="blog-article__gradient"></div>
          <div className="blog__banner-wrapper">
            <div className="blog__data">
              {post.category && <span>{post.category}</span>}
              {post.category && post.publishedAt && <span>/</span>}
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {(post.category || post.publishedAt) && <span>/</span>}
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

        {relatedPosts.length > 0 && (
          <div className="related-articles">
            <h2 className="related-articles__heading">Related Articles</h2>
            <div className="related-articles__grid">
              {relatedPosts.map((related) => {
                const relatedImage = getMediaUrl(related.featuredImage) || '/images/aisc_blog_bg-01.svg';
                return (
                  <div
                    key={related.id}
                    data-category={related.category || ''}
                    className="articles-grid__card"
                  >
                    <img loading="lazy" src={relatedImage} alt="" className="articles-grid__bg-img" />
                    <div className="articles-grid__gradient"></div>
                    <div className="articles-grid__content">
                      <div className="articles-card__meta">
                        {related.publishedAt && (
                          <p className="articles-card__date">{formatDate(related.publishedAt)}</p>
                        )}
                        <span className="articles-card__reading-time">
                          {formatReadingTime(calculateReadingTime(related.content))}
                        </span>
                      </div>
                      <h3>{related.title}</h3>
                      <div className="articles-grid__btn">
                        <PlusIcon />
                      </div>
                    </div>
                    <a href={`/posts/${related.slug}`} className="articles-grid__link"></a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
