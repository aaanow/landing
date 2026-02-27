'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { RichText } from './RichText';
import { useLenis } from './AnimationProvider';
import type { Popup } from '@/types/cms';
import { getMediaUrl } from '@/types/cms';

function updateUrlParam(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set('popup', slug);
  } else {
    url.searchParams.delete('popup');
  }
  window.history.pushState({}, '', url.toString());
}

interface PopupCardsProps { popups: Popup[]; pageTitle?: string; initialPopupSlug?: string; parentPageSlug?: string }

export function PopupCards(props: PopupCardsProps) {
  return (
    <Suspense>
      <PopupCardsInner {...props} />
    </Suspense>
  );
}

function PopupCardsInner({ popups, pageTitle, initialPopupSlug, parentPageSlug }: PopupCardsProps) {
  const searchParams = useSearchParams();
  const [activePopup, setActivePopup] = useState<Popup | null>(null);
  const [closing, setClosing] = useState(false);
  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Open popup from initialPopupSlug (direct popup URL rendered as parent page)
  useEffect(() => {
    if (initialPopupSlug && parentPageSlug && popups.length > 0) {
      const match = popups.find((p) => p.slug === initialPopupSlug);
      if (match) {
        requestAnimationFrame(() => setActivePopup(match));
        // Replace the popup's direct URL with the parent page URL + query param
        window.history.replaceState({}, '', `/${parentPageSlug}?popup=${initialPopupSlug}`);
      }
    }
  }, [initialPopupSlug, parentPageSlug, popups]);

  // Open popup from URL ?popup=slug on mount
  useEffect(() => {
    if (initialPopupSlug) return; // Already handled above
    const slug = searchParams.get('popup');
    if (slug && popups.length > 0) {
      const match = popups.find((p) => p.slug === slug);
      if (match) requestAnimationFrame(() => setActivePopup(match));
    }
  }, [searchParams, popups, initialPopupSlug]);

  // Update prev/next button state
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  // Stop Lenis smooth scroll when modal is open
  useEffect(() => {
    if (activePopup || closing) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [activePopup, closing, lenis]);

  // Intercept native wheel/touch events on the overlay so Lenis never sees them
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !activePopup) return;

    const stop = (e: Event) => e.stopImmediatePropagation();
    el.addEventListener('wheel', stop, true);
    el.addEventListener('touchmove', stop, true);
    return () => {
      el.removeEventListener('wheel', stop, true);
      el.removeEventListener('touchmove', stop, true);
    };
  }, [activePopup]);

  const closeModal = useCallback(() => {
    if (closing) return;
    setClosing(true);
  }, [closing]);

  const openPopup = useCallback((popup: Popup) => {
    setActivePopup(popup);
    updateUrlParam(popup.slug);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (closing) {
      setClosing(false);
      setActivePopup(null);
      updateUrlParam(null);
    }
  }, [closing]);

  // Sync modal with browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const slug = new URL(window.location.href).searchParams.get('popup');
      if (slug) {
        const match = popups.find((p) => p.slug === slug);
        if (match) {
          setClosing(false);
          setActivePopup(match);
        }
      } else if (activePopup) {
        setClosing(true);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [popups, activePopup]);

  // Close on Escape
  useEffect(() => {
    if (!activePopup) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activePopup, closeModal]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closeModal();
    },
    [closeModal],
  );

  if (!popups || popups.length === 0) return null;

  return (
    <>
      <div className="popup-slider">
        {/* Navigation arrows */}
        <div className="popup-slider__nav">
          <button
            type="button"
            className="embla__prev"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            style={{ opacity: canPrev ? 1 : 0.3 }}
          >
            <Image src="/images/icon-arrow-right-2.svg" alt="" width={20} height={20} />
          </button>
          <button
            type="button"
            className="embla__next"
            aria-label="Next"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            style={{ opacity: canNext ? 1 : 0.3 }}
          >
            <Image src="/images/icon-arrow-right-2.svg" alt="" width={20} height={20} />
          </button>
        </div>

        {/* Embla carousel */}
        <div className="embla" ref={emblaRef} style={{ marginTop: 0 }}>
          <div className="embla__container">
            {popups.map((popup) => {
              const iconUrl = getMediaUrl(popup.icon);
              return (
                <button
                  key={popup.id}
                  type="button"
                  className="embla__slide popup-card"
                  onClick={() => openPopup(popup)}
                >
                  {iconUrl && (
                    <div className="icon__48" style={{ marginBottom: '0.75rem' }}>
                      <Image
                        className="icon__48-img"
                        src={iconUrl}
                        alt=""
                        width={48}
                        height={48}
                      />
                    </div>
                  )}
                  <h4 style={{ margin: '0 0 0.5rem' }}>{popup.name}</h4>
                  {popup.shortDescription && (
                    <p className="body__small" style={{ margin: 0, opacity: 0.7 }}>
                      {popup.shortDescription}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activePopup && createPortal(
        <div
          ref={overlayRef}
          className={`modal-overlay popup-modal-overlay${closing ? ' closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-modal-title"
          onClick={handleOverlayClick}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="modal-dialog popup-modal-dialog">
            <button
              type="button"
              className="modal-close"
              aria-label="Close modal"
              onClick={closeModal}
            >
              <Image src="/images/icon-cross.svg" alt="" width={16} height={16} className="icon-16" />
            </button>

            <div className="popup-modal-body">
              <div className="popup-modal-header">
                {pageTitle && (
                  <p className="popup-modal-page-label">{pageTitle}</p>
                )}
                <h2 id="popup-modal-title" style={{ margin: 0 }}>{activePopup.name}</h2>
                {activePopup.shortDescription && (
                  <p className="body__subheading" style={{ margin: '0.5rem 0 0' }}>
                    {activePopup.shortDescription}
                  </p>
                )}
              </div>

              {activePopup.content && (
                <div className="blog__content-text" style={{ maxWidth: 'none', marginLeft: 0, marginRight: 0 }}>
                  <RichText content={activePopup.content} />
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
