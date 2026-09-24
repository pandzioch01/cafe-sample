# Między — szablon kawiarni

Autorska, responsywna strona w React i Vite. Kremowy papier, typografia Cormorant Garamond i DM Sans, oliwkowe detale oraz sześć wygenerowanych fotografii kawy, ciast i wnętrza.

## Uruchomienie

Wymagany Node.js 22.12+ (projekt przygotowany na Node 24).

```sh
npm install
npm run dev
```

Podgląd: http://127.0.0.1:5173. Produkcja: `npm run build`, następnie `npm run preview`. Katalog `dist/` można umieścić na dowolnym hostingu stron statycznych. Przy publikacji pod podkatalogiem dostosuj `base` w `vite.config.js` i ścieżki obrazów.

## Zawartość

- Pełne wersje PL / EN, przełącznik w nagłówku i zapamiętanie wyboru na urządzeniu.
- Płynne przenikanie treści przy zmianie języka, z zachowaniem aktywnej zakładki, galerii, FAQ i miejsca na stronie. Animacja uwzględnia `prefers-reduced-motion`.
- Menu z czterema zakładkami, 13 pozycjami, cenami, porcjami i oknami z alergenami.
- Pełna karta z widokiem do wydruku (także „Zapisz jako PDF” w przeglądarce).
- Historia kawiarni i płynny, zapętlony slider zdjęć: strzałki, przeciąganie myszką i gesty na telefonie, wybór zdjęcia kropkami, klawiatura oraz powiększenie. Slider pokazuje trzy zdjęcia na komputerze, dwa na tablecie i jedno z fragmentem kolejnego na telefonie.
- Godziny otwarcia, kontakt e-mail, link do mapy i FAQ.
- Mobilna nawigacja, semantyczny HTML, obsługa klawiatury, fokus w oknach dialogowych i respektowanie `prefers-reduced-motion`.
- Dopasowana wizualnie strona 404, favicon oraz opisowe teksty alternatywne dla wszystkich zdjęć w obu językach.
- Lokalne fonty oraz lokalne fotografie WebP w dwóch rozmiarach, `srcset`, leniwe ładowanie poza zdjęciem głównym.

## Personalizacja

- `src/data.js`: dane kontaktowe, ceny, opisy, alergeny, godziny, galeria i pytania.
- `src/App.jsx`: teksty sekcji i układ strony.
- `src/i18n/messages.js`: tłumaczenia angielskie (kluczami są polskie teksty). Po zmianie polskiej treści dopisz jej angielski odpowiednik tutaj. Ceny pozostają w PLN w obu językach.
- `src/i18n/LanguageProvider.jsx`: wybór i zapis języka, aktualizacja `lang`, tytułu i opisu strony oraz przejście językowe. Domyślnie polski; zapis w `localStorage` pod kluczem `miedzy-language`. Brak dostępu do pamięci nie blokuje przełączania.
- `src/styles.css`: kolory, typografia, odstępy i progi responsywności.
- `public/images/`: gotowe fotografie; `docs/image-prompts.json`: pełne prompty z wbudowanego narzędzia image_gen; `docs/image-manifest.json`: rozmiary obrazów.
- `docs/INSPIRATIONS.md`: źródła inspiracji i wykorzystane komponenty; `docs/licenses/`: licencje komponentów.

Między jest fikcyjną marką demonstracyjną. Adres, menu i godziny to dane przykładowe, a adres e-mail używa zarezerwowanej domeny `.example`. Przed publikacją podmień je, zweryfikuj alergeny i zmień mapkę na rzeczywistą lokalizację. Strona celowo nie udaje działających rezerwacji ani zamówień: kontakt otwiera program pocztowy, a mapa Google Maps. Nie ma backendu, kont użytkowników, analityki ani plików cookie. Wszystkie fotografie są wygenerowane przez AI.

## Weryfikacja

`npm run build` — kompilacja produkcyjna.

`npm test` — testy Playwright dla menu, okien, galerii, FAQ, klawiatury, obu języków, zapamiętywania wyboru, animacji i szerokości 320 / 390 / 768 / 1440 px. Konfiguracja korzysta z lokalnie zainstalowanego Chrome. Przy braku Chrome zainstaluj przeglądarkę Playwright i usuń `channel: 'chrome'` w konfiguracji.

Przejście językowe korzysta z [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) oraz [React flushSync](https://react.dev/reference/react-dom/flushSync), z animowanym fallbackiem Web Animations API dla starszych przeglądarek. Nie wymaga dodatkowych pakietów.

Nie są potrzebne klucze API ani zewnętrzne usługi do uruchomienia.

Nie umieszczaj kluczy OpenAI ani innych sekretów w zmiennych `VITE_*`: Vite dołącza użyte wartości do kodu działającego w przeglądarce. Pliki `.env*` są ignorowane, a `npm run build` skanuje źródła i gotowy katalog `dist/` bez wypisywania wartości znalezionego sekretu. Ewentualne wywołania API wymagające klucza należy prowadzić przez osobny backend.

Galeria korzysta z [Embla Carousel 8](https://www.embla-carousel.com/docs/v8/api/options) (`embla-carousel-react`). Zdjęcia przesuwają się po stałym torze, z zapętleniem w obie strony i bez automatycznego odtwarzania. Strzałki oraz klawisze Home / End działają przy fokusie w galerii. Ukryte slajdy są wyłączone z fokusu i drzewa dostępności, a ustawienie ograniczonego ruchu wyłącza animację przycisków nawigacji.
