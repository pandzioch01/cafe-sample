# Inspiracje i pochodzenie komponentów

Przegląd wykonano 22 września 2026 r. Projekt jest własną kompozycją; nie kopiuje żadnego szablonu 1:1.

## Strony kawiarni

- [Kawiarnia Patio](https://kawiarniapatio.pl/) — historia miejsca, zdjęcia wnętrza i specjałów, godziny, adres, nawigacja do menu i wizyty. W projekcie wykorzystano te praktyczne kategorie informacji, bez kopiowania treści lub fotografii.
- [Story Coffee Roasters](https://storycoffee.info/kawiarnia/) — komunikacja kawy specialty i lokalizacji. Strona odnaleziona w wynikach wyszukiwania; bezpośredni odczyt całej podstrony był niedostępny.

## Biblioteki wskazane w zadaniu

- [Motion](https://motion.dev/examples) — używany pakiet `motion`; animacje wejścia, przejścia kategorii i obsługa ograniczonego ruchu. Własna implementacja z publicznym API, bez kopiowania płatnych przykładów Motion+.
- [Embla Carousel](https://www.embla-carousel.com/docs/v8/api/options) — zapętlony slider galerii, płynne przewijanie i obsługa przeciągania; pakiet `embla-carousel-react` 8.6.0 (MIT).
- [Kokonut UI — Attract Button](https://kokonutui.com/docs/buttons/attract-button) — `src/components/AttractLink.jsx` adaptuje publiczny komponent z rejestru https://kokonutui.com/r/attract-button.json. Zachowany efekt przyciągania cząstek, zmieniona estetyka, semantyczny link, dodane zdarzenia fokusu i preferencja ograniczonego ruchu. MIT, autor @dorianbaffier.
- [Motion Primitives — Spinning Text](https://motion-primitives.com/docs/spinning-text) — `src/components/SpinningText.jsx`: adaptacja liter rozmieszczonych wokół koła; własna typografia, tempo i ograniczenie ruchu.
- [Motion Primitives — Animated Background](https://motion-primitives.com/docs/animated-background) — `src/components/AnimatedBackground.jsx`: adaptacja ruchomego tła aktywnej zakładki. Sterowany stan, semantyka ARIA i nawigacja klawiaturą. Kod obu komponentów odczytano z publicznego rejestru `/c/[nazwa].json`, ponieważ strony dokumentacji odrzucały bezpośredni odczyt.
- [Watermelon UI](https://ui.watermelon.sh/home) — przegląd katalogu bloków i kompozycji; punkt odniesienia dla modularnych sekcji. Nie skopiowano komponentu z tego serwisu.
- [Bklit](https://bklit.com/docs/components) — wskazany katalog obecnie zawiera głównie wykresy (area, bar, gauge, heatmap itd.). Przejrzany, lecz nie dodano wykresów niepasujących do strony kawiarni.

## Szablony

- [Envato — cafe website templates](https://elements.envato.com/graphic-templates/websites/cafe) — odnaleziony katalog szablonów kawiarni; pierwotny adres wyszukiwania z zadania nie dawał się bezpośrednio odczytać.
- [Mokka — Coffee Shop & Cafe](https://elements.envato.com/mokka-coffee-shop-cafe-elementor-template-kit-LCE6EJH) — przegląd opisu zestawu i zakresu: Home, About, Menu, FAQ, Contact. Inspiracja zakresem informacji, bez pobierania płatnych zasobów lub kopiowania szablonu.

## Zdjęcia i fonty

Wszystkie sześć fotografii powstało w wbudowanym `image_gen`. Pełne prompty znajdują się w `image-prompts.json`. Pliki `public/images/*-large.webp` mają szerokość 1440 px, a `*-small.webp` 640 px. Konwersja do WebP nie zmieniała treści obrazów. Oryginały PNG pozostawiono w katalogu narzędzia; projekt jest całkowicie samodzielny i korzysta wyłącznie z własnych plików WebP.

Fonty Cormorant Garamond i DM Sans są dołączone lokalnie przez pakiety Fontsource (SIL Open Font License). Ikony pochodzą z Lucide. Licencje zależności są w ich pakietach npm.
