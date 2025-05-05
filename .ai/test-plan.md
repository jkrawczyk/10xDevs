Najpierw muszę przeanalizować repozytorium projektu, aby lepiej zrozumieć jego strukturę i komponenty.

Ran tool
Sprawdźmy strukturę katalogu app, aby poznać główne funkcjonalności aplikacji:

Ran tool
Zobaczmy teraz komponenty aplikacji:

Ran tool
Sprawdźmy API:

Ran tool
Zobaczmy więcej informacji o implementacji Supabase:

Ran tool
Zobaczmy jakie typy danych są wykorzystywane w projekcie:

Search files...
Sprawdźmy teraz strukturę aplikacji API:

Read file: src/app/api/corrections/route.ts
Sprawdźmy teraz plik typów:

Read file: src/types.ts
Sprawdźmy serwis korekcji:

Ran tool

Read file: src/lib/services/correction.service.ts
Sprawdźmy jeszcze serwis obsługujący komunikację z OpenRouter:

Read file: src/lib/openrouter.service.ts
Sprawdźmy komponenty UI:

Read file: src/components/TextInputForm.tsx

Read file: src/components/ResultsSection.tsx
Po analizie dostępnych informacji, stworzę szczegółowy plan testów dla projektu Angielski Korektor.

# Plan Testów - Angielski Korektor

## 1. Wprowadzenie i cele testowania

Niniejszy plan testów określa strategię testowania aplikacji "Angielski Korektor" - narzędzia do poprawiania i doskonalenia tekstów w języku angielskim. Głównym celem procesu testowego jest zapewnienie wysokiej jakości, niezawodności i użyteczności aplikacji przed jej udostępnieniem użytkownikom końcowym.

### Cele strategiczne:
- Zweryfikowanie zgodności implementacji z założeniami projektowymi
- Zapewnienie poprawnego działania wszystkich funkcjonalności
- Identyfikacja i eliminacja błędów w interfejsie użytkownika i logice biznesowej
- Potwierdzenie bezpieczeństwa danych użytkowników i ich tekstów
- Sprawdzenie wydajności aplikacji pod różnym obciążeniem
- Zweryfikowanie poprawnego działania integracji z zewnętrznymi serwisami (Supabase, OpenRouter.ai)

## 2. Zakres testów

### W zakresie testów:
- Funkcjonalności poprawiania tekstu angielskiego
- System autentykacji i autoryzacji użytkowników
- Zarządzanie historiami poprawionych tekstów
- Interfejs użytkownika i jego responsywność
- Integracja z OpenRouter.ai do generowania poprawek tekstów
- Integracja z Supabase jako backendem aplikacji
- Bezpieczeństwo danych i komunikacji
- Wydajność aplikacji

### Poza zakresem testów:
- Testy wersji mobilnych aplikacji
- Testy wsparcia dla innych języków niż angielski
- Testy importu formatów innych niż zwykły tekst (PDF, DOCX, itp.)
- Testy funkcjonalności jeszcze niezaimplementowanych

## 3. Typy testów do przeprowadzenia

### 3.1. Testy jednostkowe
- **Zakres**: Komponenty React, funkcje pomocnicze, serwisy
- **Narzędzia**: Jest (lub szybsza alternatywa: Vitest), React Testing Library
- **Fokus**: Izolowane testowanie logiki biznesowej, funkcji pomocniczych, komponentów UI

### 3.2. Testy integracyjne
- **Zakres**: Interakcje między komponentami, komunikacja z API
- **Narzędzia**: Jest, MSW (Mock Service Worker)
- **Fokus**: Sprawdzenie poprawności komunikacji między modułami aplikacji

### 3.3. Testy end-to-end (E2E)
- **Zakres**: Pełne ścieżki użytkownika, od rejestracji po korzystanie z funkcjonalności
- **Narzędzia**: Playwright (rekomendowany ze względu na szersze wsparcie przeglądarek i potencjalnie większą stabilność) lub Cypress
- **Fokus**: Symulacja rzeczywistych interakcji użytkownika z aplikacją

### 3.4. Testy API
- **Zakres**: Endpointy API aplikacji, integracja z Supabase, OpenRouter.ai
- **Narzędzia**: REST Client, Postman, SuperTest (do automatycznych testów API w CI/CD)
- **Fokus**: Weryfikacja poprawności działania API, formatów danych, obsługi błędów

### 3.5. Testy wydajnościowe
- **Zakres**: Responsywność UI, czas odpowiedzi API, obsługa dużych tekstów
- **Narzędzia**: Lighthouse, k6
- **Fokus**: Pomiar czasu odpowiedzi, identyfikacja wąskich gardeł

### 3.6. Testy bezpieczeństwa
- **Zakres**: Autentykacja, autoryzacja, zabezpieczenie danych, podatności zależności
- **Narzędzia**: OWASP ZAP (DAST), SonarQube (SAST), Skanery zależności (np. `npm audit`, Snyk)
- **Fokus**: Identyfikacja luk w zabezpieczeniach, weryfikacja polityk RLS w Supabase, wykrywanie znanych podatności w bibliotekach

### 3.7. Testy dostępności
- **Zakres**: Zgodność z WCAG 2.1 AA
- **Narzędzia**: Axe, Lighthouse, `eslint-plugin-jsx-a11y` (statyczna analiza), `@axe-core/react`/`playwright-axe` (integracja w testach)
- **Fokus**: Zapewnienie dostępności dla użytkowników z niepełnosprawnościami, wczesne wykrywanie problemów

### 3.8. Testy kompatybilności
- **Zakres**: Różne przeglądarki i urządzenia
- **Narzędzia**: BrowserStack, LambdaTest
- **Fokus**: Sprawdzenie spójności działania w różnych środowiskach

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1. Rejestracja i logowanie użytkownika
1. **Rejestracja nowego użytkownika:**
   - Weryfikacja poprawnej rejestracji z poprawnymi danymi
   - Sprawdzenie walidacji formularza (email, hasło)
   - Obsługa błędów (np. email już istnieje)

2. **Logowanie użytkownika:**
   - Poprawne logowanie z prawidłowymi danymi
   - Sprawdzenie mechanizmu sesji
   - Obsługa błędnych danych logowania
   - Test funkcji "Zapomniałem hasła"

### 4.2. Poprawianie tekstów
1. **Generowanie propozycji poprawy:**
   - Wprowadzenie tekstu w formularzu
   - Wybór stylu korekty (formal/natural)
   - Weryfikacja poprawności generowanej propozycji
   - Sprawdzenie wyświetlania komentarzy edukacyjnych

2. **Regeneracja poprawki:**
   - Test funkcji regeneracji poprawki po jej odrzuceniu
   - Weryfikacja uwzględniania wcześniej odrzuconej poprawki

3. **Akceptacja poprawki:**
   - Sprawdzenie zapisywania zaakceptowanej poprawki do historii
   - Weryfikacja poprawności danych zapisanych w bazie

### 4.3. Zarządzanie historią poprawek
1. **Przeglądanie historii:**
   - Wyświetlenie listy poprawionych tekstów
   - Sprawdzenie paginacji i sortowania
   - Weryfikacja filtrowania (jeśli zaimplementowane)

2. **Szczegóły poprawki:**
   - Wyświetlenie szczegółów konkretnej poprawki
   - Sprawdzenie poprawności wyświetlanych danych

3. **Usuwanie poprawek:**
   - Test usuwania pojedynczej poprawki
   - Weryfikacja usunięcia danych z bazy

### 4.4. Ustawienia użytkownika
1. **Zmiana domyślnego stylu poprawek:**
   - Zmiana ustawienia z "formal" na "natural" i odwrotnie
   - Weryfikacja zapisania preferencji
   - Sprawdzenie, czy nowe ustawienie jest uwzględniane przy generowaniu poprawek

## 5. Środowisko testowe

### 5.1. Środowisko deweloperskie (Development)
- **Cel**: Bieżące testy podczas rozwoju funkcjonalności
- **Konfiguracja**: Lokalne środowisko z bazą danych Supabase w trybie lokalnym lub testowym
- **Dostęp**: Deweloperzy

### 5.2. Środowisko testowe (Staging)
- **Cel**: Testy integracyjne i end-to-end przed wdrożeniem na produkcję
- **Konfiguracja**: Środowisko zbliżone do produkcyjnego, używające testowej instancji Supabase i OpenRouter.ai
- **Dostęp**: Deweloperzy, testerzy, product owner

### 5.3. Środowisko produkcyjne (Production)
- **Cel**: Testy akceptacyjne i monitorowanie działającej aplikacji
- **Konfiguracja**: Docelowa konfiguracja produkcyjna hostowana na DigitalOcean
- **Dostęp**: Ograniczony (tylko testy smoke i monitorowanie)

## 6. Narzędzia do testowania

### 6.1. Narzędzia do testów automatycznych
- **Vitest**: Testy jednostkowe i integracyjne
- **React Testing Library**: Testy komponentów React
- **Playwright**: Testy end-to-end
- **MSW (Mock Service Worker)**: Mockowanie API
- **SuperTest**: Automatyczne testy API
- **k6**: Testy wydajnościowe
- **Lighthouse**: Audyty wydajności i dostępności
- **Axe**: Testy dostępności (audyty)
- **`eslint-plugin-jsx-a11y`**: Statyczna analiza dostępności JSX
- **`@axe-core/react`/`playwright-axe`**: Integracja Axe w testach
- **SonarQube**: Analiza statyczna kodu (SAST)
- **Skanery zależności (`npm audit`, Snyk)**: Wykrywanie podatności w zależnościach

### 6.2. Narzędzia do testów manualnych
- **Postman/Insomnia**: Testy API
- **BrowserStack/LambdaTest**: Testy kompatybilności
- **OWASP ZAP**: Testy bezpieczeństwa
- **DevTools przeglądarek**: Debugowanie, analiza wydajności

### 6.3. Narzędzia do zarządzania testami
- **GitHub Issues**: Zarządzanie zgłaszanymi błędami
- **GitHub Actions**: CI/CD i automatyzacja testów

## 7. Harmonogram testów

### 7.1. Testy podczas rozwoju (ongoing)
- Testy jednostkowe i integracyjne wykonywane przez deweloperów podczas implementacji funkcjonalności
- Podstawowe testy komponentów UI
- Code review z uwzględnieniem testów

### 7.2. Testy przed wydaniem wersji (pre-release)
- Pełne testy regresyjne
- Testy end-to-end całej aplikacji
- Testy wydajnościowe i bezpieczeństwa
- Testy dostępności
- Testy kompatybilności

### 7.3. Testy po wdrożeniu (post-deployment)
- Testy smoke na środowisku produkcyjnym
- Monitoring działania aplikacji
- Analiza logów i metryk

## 8. Kryteria akceptacji testów

### 8.1. Kryteria akceptacji dla testów funkcjonalnych
- 100% pokrycie krytycznych ścieżek użytkownika
- Wszystkie testy jednostkowe przechodzą (min. 85% pokrycia kodu)
- Wszystkie testy integracyjne przechodzą
- Testy end-to-end pokrywają wszystkie kluczowe scenariusze użytkownika

### 8.2. Kryteria akceptacji dla testów niefunkcjonalnych
- Czas ładowania strony głównej < 2s (Lighthouse Performance Score > 90)
- Czas generowania poprawki tekstu < 5s dla tekstu o długości 2000 znaków
- Score dostępności (Lighthouse Accessibility) > 90
- Brak błędów krytycznych i wysokiego ryzyka w testach bezpieczeństwa
- Aplikacja działa poprawnie w najnowszych wersjach Chrome, Firefox, Safari i Edge

## 9. Role i odpowiedzialności w procesie testowania

### 9.1. Deweloperzy
- Pisanie i utrzymywanie testów jednostkowych
- Wykonywanie podstawowych testów integracyjnych
- Rozwiązywanie zidentyfikowanych błędów

### 9.2. Inżynierowie QA
- Planowanie i wykonywanie testów
- Pisanie testów automatycznych (E2E, API)
- Weryfikacja napraw błędów
- Raportowanie wyników testów

### 9.3. DevOps
- Konfiguracja i utrzymanie środowisk testowych
- Wsparcie w konfigurowaniu CI/CD dla testów
- Monitoring środowisk

### 9.4. Product Owner
- Weryfikacja zgodności z wymaganiami biznesowymi
- Zatwierdzanie kryteriów akceptacji
- Priorytetyzacja błędów

## 10. Procedury raportowania błędów

### 10.1. Format zgłaszania błędów
- **Tytuł**: Krótki, opisowy tytuł błędu
- **Priorytet**: Krytyczny / Wysoki / Średni / Niski
- **Środowisko**: Dev / Staging / Production
- **Kroki reprodukcji**: Szczegółowe kroki do odtworzenia błędu
- **Oczekiwane zachowanie**: Co powinno się wydarzyć
- **Aktualne zachowanie**: Co się dzieje zamiast tego
- **Załączniki**: Zrzuty ekranu, filmy, logi

### 10.2. Proces obsługi błędów
1. Zgłoszenie błędu w GitHub Issues
2. Triaging i priorytetyzacja przez zespół
3. Przypisanie błędu do dewelopera
4. Implementacja poprawki
5. Weryfikacja poprawki przez QA
6. Zamknięcie zgłoszenia

### 10.3. Klasyfikacja błędów
- **Krytyczny**: Blokuje kluczową funkcjonalność, powoduje utratę danych
- **Wysoki**: Poważne problemy z funkcjonalnością, istnieją obejścia
- **Średni**: Problemy, które wpływają na UX, ale nie blokują głównych funkcjonalności
- **Niski**: Drobne problemy kosmetyczne, sugestie ulepszeń

## 11. Wnioski i rekomendacje

- Szczególną uwagę należy poświęcić testowaniu integracji z OpenRouter.ai ze względu na krytyczny wpływ na działanie aplikacji
- Testy wydajnościowe powinny obejmować różne rozmiary tekstów, aby zapewnić dobre doświadczenie użytkownika
- Sugeruje się wdrożenie monitoringu produkcyjnego dla kluczowych metryk aplikacji
- Zaleca się regularne audyty bezpieczeństwa z uwagi na przechowywanie tekstów użytkowników
- Warto systematycznie wykonywać testy regresyjne przy dodawaniu nowych funkcjonalności

Ten plan testów będzie aktualizowany wraz z rozwojem projektu i może być modyfikowany w przypadku zmiany wymagań lub pojawienia się nowych funkcjonalności w aplikacji.
