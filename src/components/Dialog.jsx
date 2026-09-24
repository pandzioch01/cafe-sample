import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageProvider';

// Native dialog handles focus trapping, Escape, inert background and focus return.
export function Dialog({ open, onClose, title, children, className = '' }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!open) { if (dialog.open) dialog.close(); return; }
    const previous = document.activeElement;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {open && <div className="dialog-content">
      <button className="icon-button dialog-close" aria-label={t('Zamknij okno')} onClick={onClose} autoFocus><X size={22} /></button>
      {children}
    </div>}
  </dialog>;
}
