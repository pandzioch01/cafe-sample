// Wszystkie dane marki i ceny są przykładowe. Zmień je przed publikacją.
export const cafe = {
  name: 'Między',
  street: 'ul. Dobra 24',
  city: 'Warszawa, Powiśle',
  email: 'czesc@miedzy.example',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dobra+24+Warszawa',
  hours: [
    { label: 'Poniedziałek – piątek', value: '8:00 – 20:00' },
    { label: 'Sobota – niedziela', value: '9:00 – 20:00' },
  ],
};

export const categories = [
  { id: 'favorites', label: 'Nasze ulubione' },
  { id: 'coffee', label: 'Kawa' },
  { id: 'sweets', label: 'Coś słodkiego' },
  { id: 'other', label: 'Bez kawy' },
];

export const menu = [
  { id: 'flat-white', category: 'coffee', name: 'Flat white', description: 'Podwójne espresso, aksamitne mleko. Mały, codzienny rytuał.', price: 17, size: '180 ml', image: 'coffee', badge: 'NASZ CODZIENNY RYTUAŁ', favorite: true, allergens: 'Mleko. Napój owsiany dostępny na życzenie (+2 zł).' },
  { id: 'basque', category: 'sweets', name: 'Sernik baskijski', description: 'Kremowy środek, karmelowy wierzch. Miłość od pierwszego kęsa.', price: 24, size: 'porcja', image: 'cake', badge: 'PIECZEMY NA MIEJSCU', favorite: true, allergens: 'Mleko, jaja. Przygotowywany w kuchni, w której używa się glutenu i orzechów.' },
  { id: 'croissant', category: 'sweets', name: 'Croissant maślany', description: 'Złocisty, chrupiący i taki, jak trzeba. Najlepszy jeszcze ciepły.', price: 12, size: '1 szt.', image: 'croissant', badge: 'DOBRY POCZĄTEK DNIA', favorite: true, allergens: 'Gluten (pszenica), mleko, jaja.' },
  { id: 'espresso', category: 'coffee', name: 'Espresso', description: 'Podwójne. Czekolada, orzech i odrobina owoców.', price: 11, size: '40 ml', allergens: 'Bez deklarowanych alergenów.' },
  { id: 'americano', category: 'coffee', name: 'Americano', description: 'Nasze espresso w nieco dłuższej odsłonie.', price: 13, size: '200 ml', allergens: 'Bez deklarowanych alergenów.' },
  { id: 'cappuccino', category: 'coffee', name: 'Cappuccino', description: 'Klasyczna równowaga kawy i mlecznej pianki.', price: 16, size: '180 ml', allergens: 'Mleko. Napój owsiany +2 zł.' },
  { id: 'latte', category: 'coffee', name: 'Caffè latte', description: 'Delikatna, mleczna i na dłuższą chwilę.', price: 19, size: '300 ml', allergens: 'Mleko. Napój owsiany +2 zł.' },
  { id: 'filter', category: 'coffee', name: 'Przelew dnia', description: 'Świeże ziarna specialty. O dzisiejsze zapytaj przy barze.', price: 16, size: '250 ml', allergens: 'Bez deklarowanych alergenów.' },
  { id: 'brownie', category: 'sweets', name: 'Brownie czekoladowe', description: 'Intensywnie czekoladowe, z odrobiną soli morskiej.', price: 18, size: 'porcja', allergens: 'Gluten (pszenica), mleko, jaja. Może zawierać orzechy.' },
  { id: 'seasonal', category: 'sweets', name: 'Ciasto sezonowe', description: 'To, co właśnie najlepsze. Zapytaj o dzisiejszy wypiek.', price: 22, size: 'porcja', allergens: 'Skład zmienia się sezonowo. Zapytaj obsługę o aktualne alergeny.' },
  { id: 'matcha', category: 'other', name: 'Iced matcha latte', description: 'Japońska matcha, napój owsiany i kostki lodu.', price: 22, size: '300 ml', image: 'matcha', allergens: 'Napój owsiany może zawierać gluten. Sprawdź skład u obsługi.' },
  { id: 'tea', category: 'other', name: 'Herbata liściasta', description: 'Earl Grey, zielona lub ziołowa. Cały dzbanek spokoju.', price: 16, size: '400 ml', allergens: 'Zapytaj o skład wybranej mieszanki.' },
  { id: 'lemonade', category: 'other', name: 'Domowa lemoniada', description: 'Cytryna, świeża mięta i odrobina słodyczy.', price: 17, size: '300 ml', allergens: 'Bez deklarowanych alergenów.' },
];

export const categoryPhotos = { coffee: 'coffee', sweets: 'cake', other: 'matcha' };
export const categoryCaptions = { coffee: 'Dobre ziarna. Dobre poranki.', sweets: 'Szczęście pachnie masłem.', other: 'Każdy ma swój mały rytuał.' };

export const gallery = [
  { image: 'interior', title: 'Twój ulubiony stolik', description: 'Dużo światła, ciepłe drewno i miejsce na oddech.' },
  { image: 'hero', title: 'Poranki bez pośpiechu', description: 'Kawa, croissant i cały dzień przed Tobą.' },
  { image: 'cake', title: 'Zawsze jest pora na ciasto', description: 'Małe przyjemności, które pieczemy na miejscu.' },
  { image: 'coffee', title: 'Z miłości do kawy', description: 'Każda filiżanka zasługuje na chwilę uwagi.' },
  { image: 'matcha', title: 'Odrobina zieleni', description: 'Dla tych, którzy lubią swój dzień z matchą.' },
];

export const faqs = [
  { question: 'Czy mogę wpaść z psem?', answer: 'Jasne! Czworonożni goście są u nas mile widziani. Miska z wodą już czeka — poproś o nią przy barze.' },
  { question: 'Czy macie napoje roślinne?', answer: 'Tak, każdą kawę mleczną możemy przygotować z napojem owsianym (+2 zł). Naszą matchę domyślnie podajemy właśnie z nim.' },
  { question: 'Czy mogę popracować z laptopem?', answer: 'Tak. Mamy Wi-Fi i kilka stolików z dostępem do gniazdek. W weekendy między 10:00 a 14:00 zachęcamy do odłożenia laptopa, żeby każdy znalazł miejsce na kawę.' },
  { question: 'Czy trzeba rezerwować stolik?', answer: 'Na codzienną kawę po prostu wpadaj. Jeśli planujesz spotkanie większej grupy, napisz do nas wcześniej — wspólnie znajdziemy dobrą porę.' },
];

export function getMenu(category) {
  return menu.filter(item => category === 'favorites' ? item.favorite : item.category === category);
}

export const formatPrice = value => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(value) + ' zł';
