import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useReducedMotion } from 'motion/react';
import { translate } from './messages';

const LanguageContext = createContext(null);
const storageKey = 'miedzy-language';
const pageTitle = 'Między — kawa, ciasto, dobry czas.';
const pageDescription = 'Między — kawa specialty, domowe wypieki i chwila dla siebie. Poznaj menu i znajdź swój ulubiony stolik. Autorski szablon strony kawiarni.';

function readLanguage() {
  try { return localStorage.getItem(storageKey) === 'en' ? 'en' : 'pl'; }
  catch { return 'pl'; }
}

function readingPosition() {
  if (window.scrollY < 100) return null;
  const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom ?? 0;
  const sections = [...document.querySelectorAll('main > section, main > .values-wrap, footer')];
  const element = sections
    .filter(section => {
      const rect = section.getBoundingClientRect();
      return rect.bottom > headerBottom + 24 && rect.top < window.innerHeight;
    })
    .sort((left, right) => Math.abs(left.getBoundingClientRect().top - headerBottom) - Math.abs(right.getBoundingClientRect().top - headerBottom))[0];
  return element ? { element, top: element.getBoundingClientRect().top } : null;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readLanguage);
  const [isSwitching, setIsSwitching] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const busy = useRef(false);
  const reduced = useReducedMotion();
  const t = useCallback(text => translate(language, text), [language]);

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.title = t(pageTitle);
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(pageDescription));
    try { localStorage.setItem(storageKey, language); } catch { /* Private browsing may block storage. */ }
  }, [language, t]);

  const changeLanguage = async next => {
    if (!['pl', 'en'].includes(next) || next === language || busy.current) return;
    busy.current = true;
    setIsSwitching(true);
    const position = readingPosition();
    let committed = false;
    let fade;
    const commit = () => {
      if (committed) return;
      committed = true;
      // Keep React's state update inside the browser's snapshot transaction.
      // Children stay mounted: category, gallery, FAQ, focus and dialogs retain their state.
      flushSync(() => {
        setLanguage(next);
        setAnnouncement(translate(next, 'Język zmieniony na polski.'));
      });
      if (position?.element.isConnected) {
        window.scrollBy({ top: position.element.getBoundingClientRect().top - position.top, behavior: 'instant' });
      }
    };
    try {
      if (reduced) {
        commit();
      } else if (typeof document.startViewTransition === 'function') {
        document.documentElement.dataset.languageTransition = 'true';
        const transition = document.startViewTransition(commit);
        // A hidden tab can skip the visual transition while still applying the update.
        transition.ready.catch(() => {});
        await transition.finished;
      } else {
        // Smooth fallback for browsers without View Transitions; no extra wrapper or remount.
        fade = document.body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 130, easing: 'ease-in', fill: 'forwards' });
        await fade.finished;
        commit();
        fade.cancel();
        fade = document.body.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 230, easing: 'ease-out' });
        await fade.finished;
      }
    } catch {
      commit();
    } finally {
      fade?.cancel();
      delete document.documentElement.dataset.languageTransition;
      busy.current = false;
      setIsSwitching(false);
    }
  };

  const price = value => new Intl.NumberFormat(language === 'en' ? 'en-GB' : 'pl-PL', { maximumFractionDigits: 0 }).format(value) + (language === 'en' ? ' PLN' : ' zł');

  return <LanguageContext.Provider value={{ language, t, price, changeLanguage, isSwitching }}>
    {children}
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
  </LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
