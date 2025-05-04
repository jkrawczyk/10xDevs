# Specyfikacja modułu autentykacji

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Opis ogólny
- Warstwa frontendu zostanie podzielona na widoki dostępne dla użytkowników zalogowanych (auth) oraz niezalogowanych (non-auth).
- W Next.js (App Router) umiejscowimy nowe strony, takie jak:
  - `src/app/login/page.tsx` – formularz logowania
  - `src/app/register/page.tsx` – formularz rejestracji
  - `src/app/forgot-password/page.tsx` – formularz odzyskiwania hasła
  - `src/app/reset-password/page.tsx` – formularz resetowania hasła (po kliknięciu w link z e-mailem)
- Layouty zostaną rozdzielone w zależności od stanu autentykacji, np. poprzez dedykowane pliki layout (np. `layout.auth.tsx` dla stron chronionych i `layout.public.tsx` dla stron publicznych).

### Komponenty i podział odpowiedzialności
- **Komponenty klienta**:
  - Formularze: `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm` – wszystkie oznaczone dyrektywą `use client` dla obsługi interakcji użytkownika.
  - Elementy UI: komponenty formularzy, przyciski, pola tekstowe, komunikaty błędów.
  - Walidacja: wstępna walidacja po stronie klienta (np. wymagane pola, format email) przy użyciu HTML5 lub bibliotek takich jak React Hook Form.

- **Komponenty serwera**:
  - Layouty i strony, które pobierają dane (np. dane sesji) z Supabase przez serwerowe funkcje w Next.js.
  - Komponenty, które decydują o przekierowaniu użytkownika w zależności od stanu autentykacji.

### Walidacja i komunikaty błędów
- **Klient:**
  - Walidacja formularzy na poziomie pola, informowanie użytkownika o brakujących danych lub niepoprawnym formacie (np. nieprawidłowy email, zbyt krótkie hasło).
- **Serwer:**
  - Walidacja przekazanych danych przy użyciu bibliotek takich jak Zod. Schematy walidacji będą definiowane dla każdego endpointu.
  - W przypadku niepowodzenia operacji (np. użytkownik już istnieje, niepoprawne dane do logowania) zwracane są szczegółowe komunikaty błędów, które trafiają do klienta i są wyświetlane obok odpowiednich pól formularza.

### Scenariusze użytkownika
- **Rejestracja:**
  - Użytkownik wprowadza dane (email, hasło, ewentualne potwierdzenie hasła) i wysyła formularz.
  - Po stronie serwera następuje walidacja danych i próba utworzenia konta przy użyciu Supabase Auth.
  - W przypadku błędów (np. konto już istnieje) użytkownik otrzymuje komunikat o błędzie.

- **Logowanie:**
  - Użytkownik wprowadza email i hasło.
  - Dane są przesyłane do API, gdzie następuje walidacja, a w przypadku sukcesu tworzona jest sesja użytkownika za pomocą Supabase Auth.
  - W przypadku błędnych danych użytkownik otrzymuje komunikat o niepoprawnych danych logowania.

- **Odzyskiwanie hasła:**
  - Użytkownik wpisuje swój adres email w formularzu odzyskiwania hasła.
  - System wysyła żądanie do backendu, który inicjuje wysłanie e-maila z linkiem resetującym hasło.
  - Komunikaty informacyjne (np. "Wysłano link do zmiany hasła") są wyświetlane użytkownikowi.

- **Wylogowanie:**
  - Widoczny przycisk "Wyloguj" dla użytkowników zalogowanych, który wywołuje odpowiedni endpoint API do zakończenia sesji.

## 2. LOGIKA BACKENDOWA

### Struktura endpointów API
Endpointy umieszczone będą w obrębie `src/app/api/auth`:

- **POST /api/auth/register**
  - Odbiera dane rejestracyjne użytkownika, waliduje je, a następnie tworzy konto przy użyciu Supabase Auth.

- **POST /api/auth/login**
  - Odbiera dane logowania, weryfikuje je i inicjuje sesję użytkownika z użyciem Supabase Auth.

- **POST /api/auth/logout**
  - Kończy sesję użytkownika, usuwając informacje o autentykacji.

- **POST /api/auth/forgot-password**
  - Przyjmuje adres email, waliduje go i inicjuje proces odzyskiwania hasła poprzez wysłanie e-maila z tokenem resetującym.

- **POST /api/auth/reset-password**
  - Odbiera nowe hasło oraz token weryfikacyjny i dokonuje zmiany hasła w systemie.

### Modele danych i walidacja
- Zostaną stworzone odpowiednie kontrakty (np. interfejs `User`) definiujące strukturę danych użytkownika (id, email, created_at, itp.).
- Dla każdego endpointu zostaną przygotowane schematy walidacji oparte na Zod, np.:
  - Rejestracja: email (wymagany, poprawny format), hasło (min. 8 znaków), potwierdzenie hasła.
  - Logowanie: email i hasło muszą być niepuste i zgodne z zapisami w bazie.
  - Odzyskiwanie hasła: poprawny format email.

### Obsługa wyjątków
- Operacje krytyczne będą opakowane w bloki try-catch.
- W razie wystąpienia błędu serwer zwróci odpowiedni status HTTP (np. 400 dla błędu walidacji, 500 dla błędu serwera) wraz z komunikatem błędu.
- Logi błędów będą zbierane do systemu monitoringu.

### Aktualizacja renderowania stron
- Strony, takie jak profil użytkownika, będą renderowane po stronie serwera (SSR) z wykorzystaniem danych sesji zwracanych przez `src/lib/supabase/server.ts`.
- Konfiguracja renderowania zostanie skorygowana, by współgrać z istniejącą konfiguracją (np. uwzględniając ustawienia w @astro.config.mjs) poprzez odpowiednie middleware i mechanizmy Next.js App Router.

## 3. SYSTEM AUTENTYKACJI

### Wykorzystanie Supabase Auth
- Integracja z Supabase Auth będzie odbywać się poprzez:
  - `src/lib/supabase/client.ts` dla operacji po stronie klienta (np. inicjowanie logowania z poziomu przeglądarki)
  - `src/lib/supabase/server.ts` dla operacji serwerowych (np. obsługa rejestracji, walidacja sesji)
- Middleware autentykacji (umieszczone m.in. w `src/lib/supabase/middleware.ts`) będzie zabezpieczało dostęp do stron wymagających autoryzacji.

### Proces rejestracji
- Użytkownik wypełnia formularz rejestracji (na stronie `register/page.tsx`).
- Dane są wstępnie walidowane po stronie klienta, a następnie przesyłane do endpointu `/api/auth/register`.
- Po stronie serwera dane są walidowane za pomocą Zod i przesyłane do Supabase Auth w celu utworzenia konta.
- W przypadku powodzenia użytkownik zostanie automatycznie zalogowany lub przekierowany na stronę logowania.
- Dodatkowo, system generuje token potwierdzający i wysyła email aktywacyjny do użytkownika. Po kliknięciu w link aktywacyjny, który kieruje do ścieżki obsługiwanej w `src/app/auth/confirm`, konto użytkownika zostaje aktywowane.

### Proces logowania
- Obecnie logika logowania została już częściowo zaimplementowana:
  - Formularz logowania znajduje się na stronie `src/app/login/page.tsx`, a towarzyszący plik `src/app/login/actions.ts` obsługuje logikę serwerową przy użyciu serwerowych akcji.
- Dane logowania są przetwarzane przy użyciu Supabase Auth, gdzie funkcje zdefiniowane w `src/lib/supabase/server.ts` umożliwiają komunikację z backendem.
- Middleware autentykacji (`src/lib/supabase/middleware.ts`) zarządza sesjami użytkowników, przekierowując niezalogowanych użytkowników na stronę logowania.
- Po udanej weryfikacji sesja użytkownika jest dostępna zarówno w warstwie serwerowej, jak i klienckiej dzięki integracji z modułem `src/lib/supabase/client.ts`.
- W przypadku błędnych danych wyświetlany jest odpowiedni komunikat o błędzie.

### Proces wylogowania
- Użytkownik może wylogować się, klikając przycisk "Wyloguj", co wywoła endpoint `/api/auth/logout`.
- Sesja użytkownika zostanie usunięta, a interfejs użytkownika automatycznie przełączy się na widok publiczny.

### Proces odzyskiwania hasła
- Użytkownik wprowadza swój adres e-mail w formularzu odzyskiwania hasła (na stronie `forgot-password/page.tsx`).
- Endpoint `/api/auth/forgot-password` waliduje adres email i inicjuje wysłanie wiadomości e-mail z tokenem resetującym.
- Użytkownik korzysta z linku z e-maila, który prowadzi do strony resetowania hasła (`reset-password/page.tsx`), gdzie po ponownej walidacji tokenu może ustawić nowe hasło.

### Potwierdzanie konta
- System potwierdzania konta obsługuje aktywację adresu email poprzez token wysłany do użytkownika.
- Po kliknięciu w link aktywacyjny, użytkownik jest przekierowywany do ścieżki `src/app/auth/confirm`, gdzie następuje weryfikacja tokena.
- Po pomyślnej weryfikacji, konto użytkownika zostaje aktywowane, a interfejs informuje użytkownika o możliwości logowania.

## Podsumowanie
- Moduł autentykacji został zaprojektowany w oparciu o Next.js App Router, TypeScript, Tailwind CSS i supabase dla backendu.
- Frontend wykorzystuje oddzielne komponenty dla stanów auth i non-auth, z odpowiednią walidacją oraz obsługą błędów zarówno po stronie klienta jak i serwera.
- Na backendzie zastosowano dedykowane endpointy API z walidacją wejścia przy użyciu Zod, obsługą wyjątków i integracją z Supabase Auth.
- System autentykacji umożliwia rejestrację, logowanie, wylogowanie oraz odzyskiwanie hasła zgodnie z wymaganiami US-005 oraz ogólnymi wytycznymi projektu.

Ta specyfikacja zapewnia solidną i skalowalną architekturę modułu autentykacji, łatwo integrującą się z istniejącym projektem i spełniającą wymagania funkcjonalne oraz technologiczne. 