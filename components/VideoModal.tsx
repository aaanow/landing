'use client'

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

interface VideoModalProps {
  videoUrl: string
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ videoUrl, isOpen, onClose }: VideoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  if (!isOpen) return null

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      onClick={handleOverlayClick}
    >
      <div
        className="modal-dialog"
        ref={dialogRef}
        tabIndex={-1}
        style={{ maxWidth: 960, minHeight: 'auto', background: '#000' }}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close video"
          onClick={onClose}
        >
          <Image src="/images/icon-cross.svg" alt="" width={16} height={16} className="icon-16" />
        </button>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={videoUrl}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
