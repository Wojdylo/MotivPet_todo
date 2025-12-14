# 📱 MotivPet - Instrukcja Instalacji Mobilnej

## Jak zainstalować aplikację na telefonie?

MotivPet to **Progressive Web App (PWA)**, która działa jak natywna aplikacja mobilna!

### Krok 1: Uruchom serwer deweloperski

```bash
npm run dev
```

Serwer uruchomi się na `http://0.0.0.0:3000` (dostępny w sieci lokalnej).

### Krok 2: Znajdź adres IP swojego komputera

**Windows:**
```powershell
ipconfig
```
Szukaj "IPv4 Address" (np. `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
```

### Krok 3: Otwórz aplikację na telefonie

1. Upewnij się, że telefon i komputer są w tej samej sieci WiFi
2. Na telefonie otwórz przeglądarkę (Chrome/Safari)
3. Wpisz adres: `http://[TWÓJ_IP]:3000` (np. `http://192.168.1.100:3000`)

### Krok 4: Zainstaluj jako aplikację

**Android (Chrome):**
1. Dotknij menu (⋮) w prawym górnym rogu
2. Wybierz "Dodaj do ekranu głównego" / "Install app"
3. Potwierdź instalację

**iOS (Safari):**
1. Dotknij ikony "Udostępnij" (kwadrat ze strzałką w górę)
2. Przewiń w dół i wybierz "Dodaj do ekranu głównego"
3. Dotknij "Dodaj"

### Gotowe! 🎉

Aplikacja będzie działać jak natywna aplikacja mobilna z pełnym ekranem i ikoną na ekranie głównym!

## Funkcje PWA

✅ Działa offline (po pierwszym załadowaniu)  
✅ Szybkie ładowanie  
✅ Pełnoekranowy tryb  
✅ Ikona na ekranie głównym  
✅ Brak paska adresu przeglądarki  

## Deployment w Internecie

Aby aplikacja była dostępna globalnie, możesz ją wdrożyć za darmo na:

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Przeciągnij folder `dist` po `npm run build`
- **GitHub Pages**: Użyj GitHub Actions

Po wdrożeniu, każdy może zainstalować aplikację z dowolnego miejsca!

## Rozwój

```bash
npm run dev     # Uruchom serwer deweloperski
npm run build   # Zbuduj wersję produkcyjną
npm run preview # Podgląd buildu produkcyjnego
```

## Technologie

- ⚛️ React 18
- 🎨 Tailwind CSS
- 📦 Vite
- 🤖 Google Gemini AI
- 📱 PWA (Vite PWA Plugin)
