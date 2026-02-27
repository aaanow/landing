'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useModal } from './ModalContext';
import { GetStartedForm } from './GetStartedForm';

export function GetStartedModal() {
  const { isOpen, close } = useModal();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) close();
    },
    [close],
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
    >
      <div
        className="modal-dialog"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close modal"
          onClick={close}
        >
          <Image src="/images/icon-cross.svg" alt="" width={16} height={16} className="icon-16" />
        </button>

        <div className="modal-content">
          <div className="modal-content__form">
            <GetStartedForm />
          </div>

          <div className="modal-content__preview">
            <Image
              src="/images/aisc_product-01_1aisc_product-01.avif"
              alt="AiSC Product Preview"
              width={750}
              height={500}
              className="modal-content__preview-img"
              priority
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
