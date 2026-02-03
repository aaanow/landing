import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/src/payload';
import { RichText } from '@/components/RichText';
import { calculateReadingTime, formatReadingTime } from '@/lib/reading-time';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  thumbnailImage?: string;
  excerpt?: string;
  content?: unknown;
  publishedAt?: string;
  status?: string;
  category?: string;
  author?: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    const post = result.docs[0] as Post | undefined;

    return {
      title: post ? `${post.title} - AAAnow` : 'Post - AAAnow',
      description: post?.excerpt,
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
      where: { status: { equals: 'published' } },
      limit: 100,
    });

    return result.docs.map((doc) => ({
      slug: (doc as Post).slug,
    }));
  } catch {
    return [];
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function PostPage({ params }: PageProps) {
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

  const backgroundImage = post.featuredImage || post.thumbnailImage || '/images/aisc_blog_bg-01.svg';

  return (
    <section className="section sticky">
      <div className="w-layout-blockcontainer container top-padding w-container">
        <div className="section__content-wrapper">
          <div className="post-header">
            {backgroundImage && (
              <img
                src={backgroundImage}
                alt={post.title}
                className="post-featured-image"
              />
            )}
            <div className="post-meta">
              {post.category && <span className="post-category">{post.category}</span>}
              {post.publishedAt && <span className="post-date">{formatDate(post.publishedAt)}</span>}
              <span className="post-reading-time">{formatReadingTime(calculateReadingTime(post.content))}</span>
              {post.author && <span className="post-author">By {post.author}</span>}
            </div>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          </div>
          <div className="div-block-115 animate">
            <div className="post-content rich-text">
              {post.content ? (
                <RichText content={post.content} />
              ) : (
                <p>No content available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
