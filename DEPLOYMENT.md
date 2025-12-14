# 🚀 Instrukcja wdrożenia na GitHub Pages

## Krok 1: Włącz GitHub Pages w repozytorium

1. Otwórz https://github.com/Wojdylo/MotivPet_todo
2. Przejdź do **Settings** (Ustawienia)
3. W menu po lewej wybierz **Pages**
4. W sekcji "Source" wybierz:
   - Source: **GitHub Actions**
5. Kliknij **Save**

## Krok 2: (Opcjonalnie) Dodaj klucz API Gemini

Jeśli chcesz, aby AI działało w wersji online:

1. W tym samym repozytorium idź do **Settings**
2. W menu po lewej wybierz **Secrets and variables** → **Actions**
3. Kliknij **New repository secret**
4. Nazwa: `GEMINI_API_KEY`
5. Wartość: Twój klucz API Gemini
6. Kliknij **Add secret**

## Krok 3: Workflow automatycznie zbuduje aplikację

GitHub Actions automatycznie:
- Pobierze kod
- Zainstaluje zależności
- Zbuduje aplikację
- Wdroży na GitHub Pages

Możesz śledzić postęp w zakładce **Actions** w repozytorium.

## ✅ Gotowe!

Po zakończeniu build'a, aplikacja będzie dostępna pod adresem:

**https://wojdylo.github.io/MotivPet_todo/**

### 📱 Instalacja na telefonie:

1. Otwórz powyższy link na telefonie
2. **Android**: Menu → "Dodaj do ekranu głównego"
3. **iOS**: Udostępnij → "Dodaj do ekranu głównego"

---

### 🔄 Automatyczne aktualizacje

Każda zmiana wypchnięta do branch `main` automatycznie zaktualizuje aplikację online!

```bash
git add .
git commit -m "Moja zmiana"
git push
```

Zmiany będą widoczne za ~2-3 minuty na https://wojdylo.github.io/MotivPet_todo/
