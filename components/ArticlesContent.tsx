'use client';

import { useState, useMemo } from 'react';
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

            if (view === 'list') {
              return (
                <a
                  key={post.id}
                  href={postLink}
                  data-category={post.category || ''}
                  role="listitem"
                  className="articles-list__card articles-card-animate"
                  style={{ animationDelay: `${0.45 + index * 0.07}s` }}
                >
                  <div className="articles-list__img-wrapper">
                    <img loading="lazy" src={backgroundImage} alt="" className="articles-list__img" />
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
                </a>
              );
            }

            return (
              <div
                key={post.id}
                data-category={post.category || ''}
                role="listitem"
                className={`articles-grid__card articles-card-animate${index % 12 === 0 ? ' articles-grid__card--2x2' : index % 12 === 7 ? ' articles-grid__card--2x1' : ''}`}
                style={{ animationDelay: `${0.45 + index * 0.07}s` }}
              >
                <img loading="lazy" src="/images/aisc_blog_bg-01.svg" alt="" className="articles-grid__bg-img" />
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
                <a href={postLink} className="articles-grid__link"></a>
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
