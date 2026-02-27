'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { HeroSlide } from '@/types/cms'
import { getMediaUrl } from '@/types/cms'

interface HeroCarouselProps {
  slides?: HeroSlide[]
  autoplayDuration?: number
}

const FALLBACK_SLIDES = [
  { label: 'Screen 1' },
  { label: 'Screen 2' },
  { label: 'Screen 3' },
]

export function HeroCarousel({ slides = [], autoplayDuration = 5000 }: HeroCarouselProps) {
  const hasImages = slides.length > 0
  const slideCount = hasImages ? slides.length : FALLBACK_SLIDES.length

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef(0)

  const scrollTo = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const scrollNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % slideCount)
  }, [slideCount])

  const scrollPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + slideCount) % slideCount)
  }, [slideCount])

  // Swipe support
  const touchStartRef = useRef<number | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartRef.current
    touchStartRef.current = null
    if (Math.abs(delta) < 50) return
    if (delta < 0) scrollNext()
    else scrollPrev()
  }, [scrollNext, scrollPrev])

  // Reset timer whenever the selected slide changes
  useEffect(() => {
    startRef.current = Date.now()
    requestAnimationFrame(() => setProgress(0))
  }, [selectedIndex])

  // Autoplay + progress tick
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min(elapsed / autoplayDuration, 1)
      setProgress(pct)

      if (pct >= 1) {
        scrollNext()
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [selectedIndex, autoplayDuration, scrollNext])

  return (
    <div className="flex-[7] min-w-0 flex flex-col gap-4">
      <div className="relative overflow-hidden aspect-[16/10]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {hasImages
          ? slides.map((slide, i) => {
              const url = getMediaUrl(slide.image)
              return (
                <div
                  key={slide.id ?? i}
                  className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-border/20 overflow-hidden transition-all duration-500 ease-out"
                  style={{
                    opacity: i === selectedIndex ? 1 : 0,
                    transform: i === selectedIndex ? 'scale(1)' : 'scale(0.92)',
                    pointerEvents: i === selectedIndex ? 'auto' : 'none',
                  }}
                >
                  {url ? (
                    <Image
                      src={url}
                      alt={slide.alt || `Slide ${i + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={i === 0}
                    />
                  ) : (
                    <span className="text-primary-200 font-body text-sm">Slide {i + 1}</span>
                  )}
                </div>
              )
            })
          : FALLBACK_SLIDES.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-border/20 overflow-hidden transition-all duration-500 ease-out"
                style={{
                  opacity: i === selectedIndex ? 1 : 0,
                  transform: i === selectedIndex ? 'scale(1)' : 'scale(0.92)',
                  pointerEvents: i === selectedIndex ? 'auto' : 'none',
                }}
              >
                <span className="text-primary-200 font-body text-sm">{s.label}</span>
              </div>
            ))
        }
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({ length: slideCount }, (_, i) => (
          <button
            key={i}
            className="relative w-12 h-1 rounded-full border-none bg-border p-0 cursor-pointer overflow-hidden transition-colors"
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === selectedIndex && (
              <span
                className="block absolute inset-0 bg-primary-900 rounded-full origin-left will-change-transform pointer-events-none"
                style={{ transform: `scaleX(${progress})` }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
