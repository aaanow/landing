'use client';

import { useState, useMemo } from 'react';
import { SearchIcon } from '@/components/icons';
import { getIconPath, getResourceLink, formatResourceType } from '@/lib/resources';
import type { Resource } from '@/types/cms';

interface ReferenceContentProps {
  resources: Resource[];
}

export function ReferenceContent({ resources }: ReferenceContentProps) {
  const [search, setSearch] = useState('');

  // Filter resources by search query
  const filtered = useMemo(() => {
    if (!search.trim()) return resources;
    const q = search.toLowerCase();
    return resources.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.snippet && r.snippet.toLowerCase().includes(q)) ||
        (r.tag && r.tag.toLowerCase().includes(q))
    );
  }, [resources, search]);

  return (
    <>
      {/* Search Bar */}
      <div className="reference-toolbar hero-animate hero-animate-delay-3">
        <div className="articles-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="articles-search__input"
          />
        </div>
      </div>

      {/* Main Resources Table */}
      <div className="resource-table">
        <div className="resource-table-header">
          <span>Resource Name</span>
          <span>Format</span>
          <span>Description</span>
        </div>
        {filtered.length > 0 ? (
          filtered.map((resource, index) => (
            <div
              key={resource.id}
              className="resource-table-row articles-card-animate"
              style={{ animationDelay: `${0.45 + index * 0.07}s` }}
            >
              <span className="resource-name">
                <img src={getIconPath(resource.icon)} alt="" className="resource-icon" />
                {resource.name}
              </span>
              <span className="resource-type">{formatResourceType(resource)}</span>
              <span className="resource-snippet">{resource.snippet || '—'}</span>
              <a href={getResourceLink(resource)} className="card__link inline-block"></a>
            </div>
          ))
        ) : (
          <div className="articles-empty">
            <p>No resources found.</p>
          </div>
        )}
      </div>
    </>
  );
}
