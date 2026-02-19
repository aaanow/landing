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
    <div className="flex-[7] min-w-0 flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {hasImages
            ? slides.map((slide, i) => {
                const url = getMediaUrl(slide.image)
                return (
                  <div key={slide.id ?? i} className="relative flex-[0_0_100%] min-w-0 aspect-[16/10] bg-primary-900 border border-border flex items-center justify-center overflow-hidden">
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
                <div key={i} className="relative flex-[0_0_100%] min-w-0 aspect-[16/10] bg-primary-900 border border-border flex items-center justify-center overflow-hidden">
                  <span className="text-primary-200 font-body text-sm">{s.label}</span>
                </div>
              ))
          }
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({ length: slideCount }, (_, i) => (
          <button
            key={i}
            className="relative w-8 h-1 rounded-full border-none bg-border p-0 cursor-pointer overflow-hidden transition-colors"
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
