'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { VideoModal } from './VideoModal'

interface HeroPlayButtonProps {
  videoUrl: string
}

export function HeroPlayButton({ videoUrl }: HeroPlayButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-transparent border-none"
        aria-label="Play video"
      >
        <Image
          src="/images/play-icon.svg"
          alt="Play"
          width={80}
          height={80}
          className="transition-transform hover:scale-110"
        />
      </button>
      <VideoModal videoUrl={videoUrl} isOpen={isOpen} onClose={close} />
    </>
  )
}
