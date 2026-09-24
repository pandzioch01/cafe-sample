import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageProvider';

export function LanguageSwitcher() {
  const { language, changeLanguage, isSwitching, t } = useLanguage();
  const id = useId();
  const reduced = useReducedMotion();

  return <div className="language-switcher" role="group" aria-label={t('Język strony')} aria-busy={isSwitching}>
    {[{ id: 'pl', name: 'Polski' }, { id: 'en', name: 'English' }].map(option =>
      <button key={option.id} type="button" lang={option.id} aria-label={option.name} title={option.name} aria-pressed={language === option.id} aria-disabled={isSwitching} onClick={() => changeLanguage(option.id)}>
        {language === option.id && <motion.span className="language-indicator" layoutId={`language-${id}`} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 35 }} />}
        <span className="language-code">{option.id.toUpperCase()}</span>
      </button>
    )}
  </div>;
}
