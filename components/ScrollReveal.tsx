'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  /** Vertical offset in pixels (default 40) */
  y?: number
  /** Animation duration in seconds (default 0.8) */
  duration?: number
  /** Stagger delay when the wrapper has multiple direct children */
  delay?: number
}

export function ScrollReveal({
  children,
  y = 40,
  duration = 0.8,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, { opacity: 0, y })

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [y, duration, delay])

  return <div ref={ref}>{children}</div>
}
