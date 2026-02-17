'use client'

import useEmblaCarousel from 'embla-carousel-react'
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

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(Date.now())

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  )

  // Reset timer whenever the selected slide changes
  useEffect(() => {
    startRef.current = Date.now()
    setProgress(0)
  }, [selectedIndex])

  // Autoplay + progress tick
  useEffect(() => {
    if (!emblaApi) return

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min(elapsed / autoplayDuration, 1)
      setProgress(pct)

      if (pct >= 1) {
        emblaApi.scrollNext()
      }
    }, 30)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [emblaApi, selectedIndex, autoplayDuration])

  return (
    <div className="nhero__carousel">
      <div className="nhero__carousel-viewport" ref={emblaRef}>
        <div className="nhero__carousel-container">
          {hasImages
            ? slides.map((slide, i) => {
                const url = getMediaUrl(slide.image)
                return (
                  <div key={slide.id ?? i} className="nhero__screen">
                    {url ? (
                      <Image
                        src={url}
                        alt={slide.alt || `Slide ${i + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={i === 0}
                      />
                    ) : (
                      <span className="nhero__screen-label">Slide {i + 1}</span>
                    )}
                  </div>
                )
              })
            : FALLBACK_SLIDES.map((s, i) => (
                <div key={i} className="nhero__screen">
                  <span className="nhero__screen-label">{s.label}</span>
                </div>
              ))
          }
        </div>
      </div>
      <div className="nhero__carousel-dots">
        {Array.from({ length: slideCount }, (_, i) => (
          <button
            key={i}
            className={`nhero__carousel-dot${i === selectedIndex ? ' nhero__carousel-dot--active' : ''}`}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === selectedIndex && (
              <span
                className="nhero__carousel-dot-fill"
                style={{ transform: `scaleX(${progress})` }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
