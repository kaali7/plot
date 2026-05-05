import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children, 
  footer,
  maxWidth = '2xl'
}) => {
  const modalRef = useFocusTrap(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const maxWidthClasses = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
    xl: 'md:max-w-xl',
    '2xl': 'md:max-w-2xl',
    '3xl': 'md:max-w-3xl',
    '4xl': 'md:max-w-4xl',
    '5xl': 'md:max-w-5xl',
  };

  return createPortal(
    <div className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 ${isOpen ? 'animate-fade-in' : 'opacity-0 transition-opacity duration-300'}`}>
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          relative w-full h-[92vh] md:h-auto md:max-h-[95vh] 
          glass-modal rounded-t-[24px] md:rounded-[24px]
          overflow-hidden flex flex-col
          ${maxWidthClasses[maxWidth]}
          ${isOpen ? 'animate-slide-up-mobile md:animate-slide-up' : 'translate-y-full md:translate-y-4 transition-transform duration-300'}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 md:p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="space-y-0.5">
            <h3 id="modal-title" className="text-lg md:text-2xl font-sans font-bold text-white tracking-tight leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-[11px] md:text-sm text-editor-text-muted/80 font-sans leading-relaxed max-w-[90%]">
                {description}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 -mr-1.5 text-editor-text-muted hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <FiX className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 overscroll-contain font-sans">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-5 md:p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-3 md:gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
