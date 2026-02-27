'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { calculateReadingTime, formatReadingTime } from '@/lib/reading-time';
import { formatDate } from '@/lib/format';
import { SearchIcon, PlusIcon } from '@/components/icons';
import type { Post } from '@/types/cms';

interface ArticlesContentProps {
  posts: Post[];
}

export function ArticlesContent({ posts }: ArticlesContentProps) {
  const [search, setSearch] = useState('');

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
      </div>

      {filtered.length > 0 ? (
        <div
          role="list"
          className="articles-grid"
        >
          {filtered.map((post, index) => {
            const postLink = post.externalLink || `/posts/${post.slug}`;
            const isExternal = !!post.externalLink;

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
