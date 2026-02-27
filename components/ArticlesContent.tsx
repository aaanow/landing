'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { calculateReadingTime, formatReadingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/format';
import { GridIcon, ListIcon, SearchIcon, PlusIcon } from '@/components/icons';
import { getMediaUrl } from '@/types/cms';
import type { Post } from '@/types/cms';

interface ArticlesContentProps {
  posts: Post[];
}

export function ArticlesContent({ posts }: ArticlesContentProps) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }, [posts, search]);

  return (
    <>
      <div className="articles-toolbar hero-animate hero-animate-delay-3">
        <div className="articles-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="articles-search__input"
          />
        </div>
        <div className="articles-view-toggle">
          <button
            aria-label="Grid view"
            className={`articles-view-btn${view === 'grid' ? ' articles-view-btn--active' : ''}`}
            onClick={() => setView('grid')}
          >
            <GridIcon />
          </button>
          <button
            aria-label="List view"
            className={`articles-view-btn${view === 'list' ? ' articles-view-btn--active' : ''}`}
            onClick={() => setView('list')}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div
          role="list"
          className={view === 'grid' ? 'articles-grid' : 'articles-list'}
        >
          {filtered.map((post, index) => {
            const postLink = post.externalLink || `/posts/${post.slug}`;
            const backgroundImage =
              getMediaUrl(post.featuredImage) || '/images/aisc_blog_bg-01.svg';

            const isExternal = !!post.externalLink;
            const ListCardTag = isExternal ? 'a' : Link;
            const listCardProps = isExternal
              ? { href: postLink, target: '_blank' as const, rel: 'noopener noreferrer' }
              : { href: postLink };

            if (view === 'list') {
              return (
                <ListCardTag
                  key={post.id}
                  {...listCardProps}
                  data-category={post.category || ''}
                  role="listitem"
                  className="articles-list__card articles-card-animate"
                  style={{ animationDelay: `${0.45 + index * 0.07}s` }}
                >
                  <div className="articles-list__img-wrapper" style={{ position: 'relative' }}>
                    <Image src={backgroundImage} alt="" fill style={{ objectFit: 'cover' }} className="articles-list__img" />
                  </div>
                  <div className="articles-list__body">
                    <div className="articles-card__meta">
                      <p className="articles-card__date">{formatDate(post.publishedAt)}</p>
                      <span className="articles-card__reading-time">
                        {formatReadingTime(calculateReadingTime(post.content))}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    {post.excerpt && <p className="articles-card__excerpt">{post.excerpt}</p>}
                  </div>
                </ListCardTag>
              );
            }

            return (
              <div
                key={post.id}
                data-category={post.category || ''}
                role="listitem"
                className="articles-grid__card articles-card-animate"
                style={{ animationDelay: `${0.45 + index * 0.07}s` }}
              >
                <Image src="/images/aisc_blog_bg-01.svg" alt="" fill style={{ objectFit: 'cover' }} className="articles-grid__bg-img" />
                <div className="articles-grid__gradient"></div>
                <div className="articles-grid__content">
                  <div className="articles-card__meta">
                    <p className="articles-card__date">{formatDate(post.publishedAt)}</p>
                    <span className="articles-card__reading-time">
                      {formatReadingTime(calculateReadingTime(post.content))}
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <div className="articles-grid__btn">
                    <PlusIcon />
                  </div>
                </div>
                {isExternal ? (
                  <a href={postLink} target="_blank" rel="noopener noreferrer" className="articles-grid__link"></a>
                ) : (
                  <Link href={postLink} className="articles-grid__link"></Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="articles-empty">
          <p>No articles found.</p>
        </div>
      )}
    </>
  );
}
