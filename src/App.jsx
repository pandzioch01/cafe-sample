import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Coffee, Croissant, Heart, Leaf, MapPin, Menu as MenuIcon, Plus, Sun, Wifi, X, PawPrint, Mail, Clock, Printer, MoveUpRight } from 'lucide-react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { SpinningText } from './components/SpinningText';
import { AttractLink } from './components/AttractLink';
import { Dialog } from './components/Dialog';
import { cafe, categories, categoryPhotos, categoryCaptions, gallery, faqs, getMenu } from './data';
import { useLanguage } from './i18n/LanguageProvider';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const navLinks = [{ href: '#menu', label: 'Menu' }, { href: '#o-nas', label: 'Nasza historia' }, { href: '#galeria', label: 'Galeria' }, { href: '#kontakt', label: 'Kontakt' }];
const asset = (name, size = 'large') => `${import.meta.env.BASE_URL}images/${name}-${size}.webp`;

function Photo({ name, alt, className = '', eager = false, sizes = '(max-width: 760px) 100vw, 50vw' }) {
  return <img className={className} src={asset(name)} srcSet={`${asset(name, 'small')} 640w, ${asset(name)} 1440w`} sizes={sizes} alt={alt} draggable={false} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" width="1440" height={['hero', 'interior'].includes(name) ? '960' : '1440'} />;
}

function Reveal({ children, className = '', delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }} {...props}>{children}</motion.div>;
}

function Brand({ footer = false }) {
  const { t } = useLanguage();
  return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#start" aria-label={t("Między — strona główna")}><span>między<span className="brand-dot">.</span></span>{!footer && <small>{t("KAWA I DOBRY CZAS")}</small>}</a>;
}

function Header() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    if (!expanded) return;
    const onKey = event => { if (event.key === 'Escape') { setExpanded(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded]);
  return <header className="header">
    <div className="container header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label={t("Główna nawigacja")}>{navLinks.map(link => <a key={link.href} href={link.href}>{t(link.label)}</a>)}</nav>
      <div className="header-actions">
      <LanguageSwitcher />
      <AttractLink href="#kontakt" className="header-cta">{t("Wpadnij do nas")}</AttractLink>
      <button ref={toggle} className="icon-button mobile-toggle" aria-label={t(expanded ? 'Zamknij nawigację' : 'Otwórz nawigację')} aria-expanded={expanded} aria-controls="mobile-nav" onClick={() => setExpanded(!expanded)}>{expanded ? <X /> : <MenuIcon />}</button>
      </div>
    </div>
    <AnimatePresence>{expanded && <motion.nav id="mobile-nav" aria-label={t("Nawigacja mobilna")} className="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{navLinks.map(link => <a key={link.href} href={link.href} onClick={() => setExpanded(false)}>{t(link.label)}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function Hero() {
  const { t } = useLanguage();
  return <section className="hero container" aria-labelledby="hero-title">
    <div className="hero-copy">
      <Reveal><p className="eyebrow hero-eyebrow"><span className="little-sun"><Sun size={15} /></span> {t("TWOJA CHWILA W ŚRODKU MIASTA")}</p></Reveal>
      <Reveal delay={0.08}><h1 id="hero-title">{t("Dobre rzeczy")}<br />{t("dzieją się")}<br /><em>między.</em><span className="heading-star" aria-hidden="true">✳</span></h1></Reveal>
      <Reveal delay={0.16}><p className="hero-description">{t("Między jednym planem a drugim.")}<br />{t("Między łykiem kawy a kolejnym kęsem.")}<br />{t("Znajdź chwilę, która jest tylko Twoja.")}</p></Reveal>
      <Reveal delay={0.24} className="hero-actions"><AttractLink href="#menu">{t("Zobacz nasze menu")}</AttractLink><a className="text-link" href="#o-nas">{t("Poznaj Między")} <ArrowRight size={16} /></a></Reveal>
      <Reveal delay={0.3} className="hero-footnote"><span className="line" /> {t("KAWA SPECIALTY. DOMOWE WYPIEKI. BEZ POŚPIECHU.")}</Reveal>
    </div>
    <Reveal className="hero-visual" delay={0.1}>
      <div className="hero-photo"><Photo name="hero" alt={t("Cappuccino i maślany croissant na drewnianym stoliku w słonecznej kawiarni")} eager /></div>
      <div className="coffee-seal"><SpinningText>{t("MAŁE PRZYJEMNOŚCI • KAŻDEGO DNIA • ")}</SpinningText><Sun size={34} strokeWidth={1.25} /></div>
      <div className="hero-photo-note"><span className="note-icon"><Coffee size={25} strokeWidth={1.4} /></span><div><strong>{t("Tu jest Ci dobrze.")}</strong><span>{t("Reszta może chwilę poczekać.")}</span></div><span className="note-heart" aria-hidden="true">♡</span></div>
      <div className="photo-caption"><span>{t("TWÓJ ULUBIONY PRZYSTANEK")}</span><span>{t("Warszawa, Powiśle")} <ArrowUpRight size={13} /></span></div>
    </Reveal>
  </section>;
}

function Values() {
  const { t } = useLanguage();
  const values = [
    { icon: Coffee, title: 'Kawa z dobrego źródła', text: 'Ziarna specialty, parzone z uwagą.' },
    { icon: Croissant, title: 'Rano pachnie wypiekami', text: 'Codziennie świeże. Po prostu pyszne.' },
    { icon: Heart, title: 'Miejsce na Twój moment', text: 'Na spotkanie. Na książkę. Na nic.' },
  ];
  return <div className="values-wrap"><div className="values container">{values.map(({ icon: Icon, title, text }) => <div className="value" key={title}><Icon size={29} strokeWidth={1.25} /><div><h3>{t(title)}</h3><p>{t(text)}</p></div></div>)}</div></div>;
}

function MenuSection({ onProduct, onFullMenu }) {
  const { t, price } = useLanguage();
  const [category, setCategory] = useState('favorites');
  const reduced = useReducedMotion();
  function onTabKey(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categories.length - 1;
    else return;
    event.preventDefault();
    setCategory(categories[next].id);
    document.getElementById(`tab-${categories[next].id}`).focus();
  }
  return <section id="menu" className="menu-section container section" aria-labelledby="menu-title">
    <Reveal className="section-heading"><div><p className="eyebrow">{t("MAŁE PRZYJEMNOŚCI, WIELKI WYBÓR")}</p><h2 id="menu-title">{t("Na co masz dziś ")}<em>{t("ochotę?")}</em></h2></div><p>{t("Dobra kawa lubi dobre towarzystwo.")}<br />{t("Znajdź swoje ulubione połączenie.")}</p></Reveal>
    <Reveal className="menu-controls"><div className="menu-tabs" role="tablist" aria-label={t("Kategorie menu")}><AnimatedBackground value={category} onValueChange={setCategory}>{categories.map((item, i) => <button key={item.id} id={`tab-${item.id}`} data-id={item.id} role="tab" aria-controls="menu-panel" tabIndex={category === item.id ? 0 : -1} onKeyDown={event => onTabKey(event, i)}>{item.id === 'favorites' && <Heart size={14} />}{t(item.label)}</button>)}</AnimatedBackground></div><span className="menu-season"><Leaf size={14} /> {t("Zawsze świeżo, zawsze od serca")}</span></Reveal>
    <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${category}`} tabIndex={0} className="menu-panel">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={category} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {category === 'favorites' ? <div className="product-grid">{getMenu(category).map(item => <button className="product-card" key={item.id} onClick={() => onProduct(item)} aria-label={`${t(item.name)}, ${price(item.price)} — ${t('szczegóły i alergeny')}`}><div className="product-photo"><Photo name={item.image} alt={t(item.name)} sizes="(max-width: 640px) 100vw, 33vw" /><span className="product-badge">{t(item.badge)}</span><span className="product-open"><Plus size={21} /></span></div><div className="product-heading"><h3>{t(item.name)}</h3><span>{price(item.price)}</span></div><p>{t(item.description)}</p><span className="product-detail-link">{t("Poznaj bliżej")} <ArrowUpRight size={13} /></span></button>)}</div>
          : <div className="category-menu"><div className="category-photo"><Photo name={categoryPhotos[category]} alt={t(categoryCaptions[category])} /><span>{t(categoryCaptions[category])}</span></div><div className="menu-list">{getMenu(category).map(item => <button key={item.id} className="menu-row" onClick={() => onProduct(item)}><span><strong>{t(item.name)}<small>{t(item.size)}</small></strong><span>{t(item.description)}</span></span><span className="menu-row-price">{price(item.price)}<Plus size={15} /></span></button>)}<p className="menu-list-note">{t("Kliknij pozycję, aby sprawdzić szczegóły i alergeny.")}</p></div></div>}
        </motion.div>
      </AnimatePresence>
    </div>
    <div className="menu-bottom"><span><Leaf size={15} /> {t("Mleko owsiane? Jasne. Powiedz nam, co lubisz.")}</span><button className="text-link" onClick={onFullMenu}>{t("Cała karta menu")} <ArrowUpRight size={17} /></button></div>
  </section>;
}

function Story() {
  const { t } = useLanguage();
  return <section id="o-nas" className="story-section" aria-labelledby="story-title"><div className="container story-grid">
    <Reveal className="story-photos"><div className="story-main-photo"><Photo name="interior" alt={t("Przytulne wnętrze Między: drewniane stoliki, skórzana kanapa i światło z dużych okien")} /></div><div className="story-small-photo"><Photo name="croissant" alt={t("Świeżo upieczony croissant podany na ceramicznym talerzu")} sizes="300px" /></div><span className="story-photo-tag">{t("Dobrze, że jesteś.")}</span></Reveal>
    <Reveal className="story-copy"><p className="eyebrow">{t("CZEŚĆ. TO MY, MIĘDZY.")}</p><h2 id="story-title">{t("Nie tylko kawa.")}<br /><em>{t("Twoje małe miejsce.")}</em></h2><p>{t("Wierzymy, że najlepsze momenty nie potrzebują wielkich planów. Wystarczy dobry stolik, ciepła filiżanka i ktoś po drugiej stronie. Albo po prostu Ty.")}</p><p>{t("Stworzyliśmy Między, żeby mieć gdzie zwolnić. Sami wybieramy ziarna, pieczemy nasze ulubione ciasta i pamiętamy, jaką kawę pijesz. Rozgość się — jesteś u siebie.")}</p><div className="story-signature"><span>{t("Do zobaczenia przy kawie,")}</span><strong>{t("ekipa Między")} <Heart size={18} /></strong></div><div className="amenities"><span><PawPrint size={17} /> {t("Psiolubni")}</span><span><Wifi size={17} /> Wi-Fi</span><span><Leaf size={17} /> {t("Roślinne opcje")}</span></div></Reveal>
  </div></section>;
}

function Gallery({ onOpen }) {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const [viewportRef, slider] = useEmblaCarousel({
    loop: true,
    align: 'start',
    duration: 32,
    breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } },
  });
  const [offset, setOffset] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState([0, 1, 2]);

  useEffect(() => {
    if (!slider) return;
    const updateSelection = () => setOffset(slider.selectedScrollSnap());
    const updateVisibility = () => setVisibleSlides(slider.slidesInView());
    const update = () => { updateSelection(); updateVisibility(); };
    update();
    slider.on('select', updateSelection).on('slidesInView', updateVisibility).on('reInit', update);
    return () => {
      slider.off('select', updateSelection).off('slidesInView', updateVisibility).off('reInit', update);
    };
  }, [slider]);

  function onGalleryKey(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    // Keep focus on the viewport when the previously focused photo moves offscreen.
    event.currentTarget.focus({ preventScroll: true });
    if (event.key === 'ArrowLeft') slider?.scrollPrev(reduced);
    else if (event.key === 'ArrowRight') slider?.scrollNext(reduced);
    else slider?.scrollTo(event.key === 'Home' ? 0 : gallery.length - 1, reduced);
  }

  return <section id="galeria" className="gallery-section section container" aria-labelledby="gallery-title">
    <Reveal className="section-heading"><div><p className="eyebrow">{t("ŚWIATŁO, ZAPACH, SPOKÓJ")}</p><h2 id="gallery-title">{t("Zobacz, jak u nas ")}<em>{t("jest.")}</em></h2></div><div className="gallery-controls"><button className="icon-button" aria-controls="gallery-viewport" aria-label={t("Poprzednie zdjęcia")} onClick={() => slider?.scrollPrev(reduced)}><ArrowLeft size={20} /></button><button className="icon-button" aria-controls="gallery-viewport" aria-label={t("Następne zdjęcia")} onClick={() => slider?.scrollNext(reduced)}><ArrowRight size={20} /></button></div></Reveal>
    <p id="gallery-help" className="sr-only">{t('Przeciągnij zdjęcia lub użyj strzałek w lewo i w prawo. Klawisze Home i End przenoszą do pierwszego i ostatniego zdjęcia.')}</p>
    <div ref={viewportRef} id="gallery-viewport" className="gallery-viewport" tabIndex={0} role="group" aria-roledescription={t('karuzela')} aria-label={t('Galeria zdjęć')} aria-describedby="gallery-help" onKeyDown={onGalleryKey}>
      <div className="gallery-track">{gallery.map((photo, index) => <div className="gallery-slide" key={photo.image} role="group" aria-roledescription={t('slajd')} aria-label={`${index + 1} / ${gallery.length}`} aria-hidden={!visibleSlides.includes(index)} inert={!visibleSlides.includes(index)}>
        <button className="gallery-card" onClick={() => onOpen(index)} aria-label={`${t('Powiększ zdjęcie')}: ${t(photo.title)}`}><Photo name={photo.image} alt={t(photo.title)} sizes="(max-width: 760px) 85vw, (max-width: 1100px) 50vw, 33vw" /><div className="gallery-caption"><span>{t(photo.title)}</span><span><MoveUpRight size={21} /></span></div></button>
      </div>)}</div>
    </div>
    <div className="gallery-footnote"><span>{t("Trochę codzienności z naszego małego świata.")}</span><div className="gallery-dots" role="group" aria-label={t('Wybierz zdjęcie')}>{gallery.map((photo, index) => <button key={photo.image} className="gallery-dot" aria-label={`${t('Przejdź do zdjęcia')}: ${t(photo.title)}`} aria-current={offset === index ? 'true' : undefined} aria-controls="gallery-viewport" onClick={() => slider?.scrollTo(index, reduced)}><span /></button>)}</div><span aria-live="polite" aria-atomic="true">{String(offset + 1).padStart(2, '0')} <span className="muted">/ {String(gallery.length).padStart(2, '0')}</span></span></div>
  </section>;
}

function PauseBanner() {
  const { t } = useLanguage();
  return <section className="pause-banner"><div className="container"><Sun size={42} strokeWidth={1} /><p>{t("Nie wszystko musi być na już.")}<br /><em>{t("Na dobrą kawę zawsze jest pora.")}</em></p><a className="round-link" href="#kontakt" aria-label={t("Znajdź nas i wpadnij na kawę")}><ArrowUpRight size={28} strokeWidth={1.2} /></a></div></section>;
}

function NeighborhoodMap() {
  const { t } = useLanguage();
  return <a className="neighborhood-map" href={cafe.mapUrl} target="_blank" rel="noreferrer" aria-label={t("Zobacz przykładową lokalizację przy ulicy Dobrej 24 w Google Maps")}>
    <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="420" fill="#ecebe2" /><path d="M470-40C450 80 555 140 515 270S555 400 550 470L700 450V-50Z" fill="#cddbd5" /><path d="M25 0V420M165-30L245 450M355-50L420 460M-20 96L640 24M-20 240L640 168M-20 390L640 318" fill="none" stroke="#faf8f0" strokeWidth="18" /><path d="M0 150L600 82M-20 313L590 245M92-30L157 455M285-30L350 455" fill="none" stroke="#faf8f0" strokeWidth="7" /><path d="M407 70L468 64L487 151L425 156Z" fill="#d7dfc9" /><path d="M36 259L111 251L129 353L36 362Z" fill="#d7dfc9" /><g fill="#cfd2c6"><rect x="56" y="171" width="71" height="38" rx="4" transform="rotate(-7 56 171)" /><rect x="264" y="256" width="58" height="46" rx="4" transform="rotate(-7 264 256)" /><rect x="258" y="110" width="54" height="51" rx="4" transform="rotate(-7 258 110)" /><rect x="177" y="9" width="77" height="39" rx="4" transform="rotate(-7 177 9)" /><rect x="373" y="335" width="84" height="49" rx="4" transform="rotate(-7 373 335)" /></g><g fill="#858b7b" fontFamily="sans-serif" fontSize="10" letterSpacing="3"><text x="248" y="228" transform="rotate(-7 248 228)">DOBRA</text><text x="43" y="86" transform="rotate(-7 43 86)">TAMKA</text><text x="532" y="198" transform="rotate(83 532 198)">{t("WISŁA")}</text><text x="59" y="303" fontSize="8" letterSpacing="1">{t("SKWER")}</text><text x="418" y="105" fontSize="8" letterSpacing="1">{t("ZIELEŃ")}</text></g></svg>
    <div className="map-label"><span className="map-pin"><Coffee size={24} /></span><strong>między.</strong><span>{t("Tu zwalniamy.")}</span></div><span className="map-note">{t("MAPKA POGLĄDOWA")}</span><span className="map-open"><ArrowUpRight size={20} /></span>
  </a>;
}

function Contact() {
  const { t } = useLanguage();
  return <section id="kontakt" className="contact-section section container" aria-labelledby="contact-title">
    <Reveal className="contact-grid"><div className="contact-copy"><p className="eyebrow">{t("DO ZOBACZENIA PRZY STOLIKU")}</p><h2 id="contact-title">{t("Po drodze?")}<br /><em>{t("Wpadnij na chwilę.")}</em></h2><p>{t("Na szybką kawę albo całkiem długą rozmowę.")}<br />{t("Znajdzie się dla Ciebie miejsce.")}</p><div className="contact-details"><div><MapPin size={20} strokeWidth={1.5} /><div><h3>{t(cafe.street)}</h3><p>{t(cafe.city)}</p><small>{t("Przykładowa lokalizacja szablonu")}</small></div></div><div><Clock size={20} strokeWidth={1.5} /><div className="opening-hours">{cafe.hours.map(day => <p key={day.label}><span>{t(day.label)}</span><strong>{day.value}</strong></p>)}</div></div></div><AttractLink href={cafe.mapUrl} target="_blank" rel="noreferrer">{t("Pokaż drogę")}</AttractLink></div><div className="contact-map"><NeighborhoodMap /><div className="contact-mail"><div><span>{t("Masz coś na myśli?")}</span><a href={`mailto:${cafe.email}`}>{cafe.email} <ArrowUpRight size={16} /></a></div><Mail size={27} strokeWidth={1.2} /></div></div></Reveal>
  </section>;
}

function Faq() {
  const { t } = useLanguage();
  const [active, setActive] = useState(null);
  return <section className="faq-section container" aria-labelledby="faq-title"><div><p className="eyebrow">{t("DOBRZE WIEDZIEĆ")}</p><h2 id="faq-title">{t("Zanim ")}<em>{t("wpadniesz.")}</em></h2></div><div className="faq-list">{faqs.map((item, i) => <div className="faq-item" key={item.question}><h3><button aria-expanded={active === i} aria-controls={`answer-${i}`} onClick={() => setActive(active === i ? null : i)}>{t(item.question)}<ChevronDown size={18} className={active === i ? 'rotated' : ''} /></button></h3><div id={`answer-${i}`} hidden={active !== i}><p>{t(item.answer)}</p></div></div>)}</div></section>;
}

function Footer() {
  const { t } = useLanguage();
  return <footer className="footer"><div className="container"><div className="footer-top"><div><Brand footer /><p>{t("Kawa. Ciasto. Dobry czas.")}</p></div><nav aria-label={t("Nawigacja w stopce")}>{navLinks.map(link => <a key={link.href} href={link.href}>{t(link.label)}</a>)}</nav><a className="back-to-top" href="#start">{t("Do góry")} <ArrowUpRight size={18} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {t("Między. Z miłości do małych przyjemności.")}</span><span>{t("Szablon demonstracyjny · fikcyjna kawiarnia i dane · zdjęcia AI")}</span></div></div></footer>;
}

function FullMenu({ onProduct }) {
  const { t, price } = useLanguage();
  return <div className="full-menu"><p className="eyebrow">{t("MIĘDZY · KAWA I DOBRY CZAS")}</p><h2>{t("Coś ")}<em>{t("dobrego.")}</em></h2><p className="full-menu-intro">{t("Nasza cała karta. Ceny w złotych, porcja przy każdej pozycji.")}</p>{categories.filter(category => category.id !== 'favorites').map(category => <section key={category.id}><h3>{t(category.label)}</h3>{getMenu(category.id).map(item => <button key={item.id} className="full-menu-row" onClick={() => onProduct(item)}><span><strong>{t(item.name)}</strong><small>{t(item.size)}</small></span><span>{price(item.price)}<Plus size={14} /></span></button>)}</section>)}<p className="menu-list-note">{t("Napój owsiany +2 zł. Kliknij nazwę, by zobaczyć alergeny. Wypieki dostępne do wyczerpania — o aktualną ofertę zapytaj obsługę.")}</p><button className="button print-button" onClick={() => window.print()}>{t("Wydrukuj menu")} <Printer size={16} /></button></div>;
}

export default function App() {
  const { t, price } = useLanguage();
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);
  const showProduct = product => setModal({ type: 'product', product });
  const isGallery = modal?.type === 'gallery';
  useEffect(() => {
    if (!isGallery) return;
    const listener = event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      setModal(current => ({ ...current, index: (current.index + (event.key === 'ArrowRight' ? 1 : -1) + gallery.length) % gallery.length }));
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [isGallery]);
  const currentPhoto = isGallery ? gallery[modal.index] : null;
  return <>
    <a className="skip-link" href="#main">{t("Przejdź do treści")}</a>
    <div id="start" className="announcement"><span>{t("Mała przerwa. Wielka przyjemność.")}</span><span>{t("Do zobaczenia w Między")} <Sun size={12} /></span></div>
    <Header />
    <main id="main"><Hero /><Values /><MenuSection onProduct={showProduct} onFullMenu={() => setModal({ type: 'menu' })} /><Story /><Gallery onOpen={index => setModal({ type: 'gallery', index })} /><PauseBanner /><Contact /><Faq /></main>
    <Footer />
    <Dialog open={modal !== null} onClose={close} title={t(modal?.type === 'menu' ? 'Pełna karta menu' : modal?.type === 'product' ? modal.product.name : 'Galeria zdjęć')} className={isGallery ? 'lightbox' : modal?.type === 'menu' ? 'menu-dialog' : 'product-dialog'}>
      {modal?.type === 'menu' && <FullMenu onProduct={showProduct} />}
      {modal?.type === 'product' && <div className="product-modal">{modal.product.image && <Photo name={modal.product.image} alt={t(modal.product.name)} eager sizes="600px" />}<div className="product-modal-copy"><p className="eyebrow">{t("MIĘDZY · MAŁE PRZYJEMNOŚCI")}</p><div className="product-modal-heading"><h2>{t(modal.product.name)}</h2><strong>{price(modal.product.price)}</strong></div><p>{t(modal.product.description)}</p><span className="serving-size">{t(modal.product.size)}</span><div className="allergen-note"><Leaf size={18} /><div><strong>{t("Skład i alergeny")}</strong><p>{t(modal.product.allergens)}</p></div></div><button className="text-link" onClick={() => setModal({ type: 'menu' })}>{t("Zobacz całą kartę")} <ArrowRight size={16} /></button></div></div>}
      {isGallery && <div className="lightbox-inner"><Photo name={currentPhoto.image} alt={t(currentPhoto.title)} eager sizes="90vw" /><div className="lightbox-caption"><div aria-live="polite"><h2>{t(currentPhoto.title)}</h2><p>{t(currentPhoto.description)}</p></div><div className="lightbox-controls"><button className="icon-button" aria-label={t("Poprzednie zdjęcie")} onClick={() => setModal({ type: 'gallery', index: (modal.index - 1 + gallery.length) % gallery.length })}><ArrowLeft size={20} /></button><span>{modal.index + 1} / {gallery.length}</span><button className="icon-button" aria-label={t("Następne zdjęcie")} onClick={() => setModal({ type: 'gallery', index: (modal.index + 1) % gallery.length })}><ArrowRight size={20} /></button></div></div></div>}
    </Dialog>
  </>;
}
