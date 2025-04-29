# API Endpoint Implementation Plan: Corrections Endpoints

## 1. Przegląd punktu końcowego
Implementujemy dwa punkty końcowe REST API:
- **GET /api/corrections**: Pobiera paginowaną listę korekt stworzonych przez uwierzytelnionego użytkownika.
- **DELETE /api/corrections/{id}**: Usuwa wybraną korektę z historii użytkownika.

## 2. Szczegóły żądania

### GET /api/corrections
- **Metoda HTTP**: GET
- **URL**: /api/corrections
- **Parametry zapytania**:
  - *Opcjonalne*: 
    - `page`: numer strony (paginacja)
    - `limit`: liczba rekordów na stronę
    - `sort`: kryterium sortowania (np. `created_at`)
- **Request Body**: Brak

### DELETE /api/corrections/{id}
- **Metoda HTTP**: DELETE
- **URL**: /api/corrections/{id} (gdzie `{id}` to identyfikator korekty)
- **Parametry**:
  - *Wymagane*: 
    - `id`: identyfikator korekty przekazany jako część URL
- **Request Body**: Brak

## 3. Wykorzystywane typy

- `CorrectionDTO`: DTO reprezentujący rekord korekty z polami: `id`, `user_id`, `original_text`, `approved_text`, `correction_style`, `created_at`.
- `GetCorrectionsResponseDTO`: Tablica `CorrectionDTO` używana jako odpowiedź dla GET /api/corrections.
- `DeleteCorrectionResponseDTO`: DTO zawierające obiekt { message: string } zwracany po usunięciu korekty.
- (Opcjonalnie) Inne modele jak `CreateCorrectionCommand` czy `GenerateCorrectionProposalCommand` mogą być inspiracją, choć nie są bezpośrednio używane w tych endpointach.

## 4. Szczegóły odpowiedzi

### GET /api/corrections
- **200 OK**: 
  - Odpowiedź: JSON zawierający tablicę obiektów korekty, przykładowo:
  ```json
  [
    {
      "id": "UUID",
      "user_id": "UUID",
      "original_text": "...",
      "approved_text": "...",
      "correction_style": "formal | natural",
      "created_at": "timestamp"
    }
  ]
  ```
- **Błędy**:
  - 401 Unauthorized – gdy użytkownik nie jest uwierzytelniony.

### DELETE /api/corrections/{id}
- **200 OK**: 
  - Odpowiedź: JSON, przykładowo:
  ```json
  { "message": "Correction deleted successfully." }
  ```
- **Błędy**:
  - 401 Unauthorized – brak uwierzytelnienia.
  - 404 Not Found – korekta o podanym `id` nie istnieje.

## 5. Przepływ danych

1. Klient wysyła żądanie do API (GET lub DELETE) z odpowiednimi parametrami.
2. Middleware autoryzacyjne weryfikuje token/autoryzację użytkownika (np. Supabase Auth, JWT).
3. Kontroler przekazuje żądanie do warstwy serwisowej (np. CorrectionsService):
   - Dla GET: Pobiera korekty powiązane z `user_id`, stosując paginację i sortowanie.
   - Dla DELETE: Weryfikuje istnienie korekty oraz jej przynależność do zalogowanego użytkownika, następnie wykonuje operację usunięcia.
4. Wynik operacji (dane lub potwierdzenie usunięcia) jest zwracany do klienta w formacie JSON.

## 6. Względy bezpieczeństwa

- **Autoryzacja**: Każde żądanie musi być wysłane przez uwierzytelnionego użytkownika. Dostęp do operacji jest przyznawany tylko dla właściciela korekty.
- **Walidacja**: Wszystkie dane wejściowe (query parameters, id) muszą być walidowane – np. sprawdzanie, czy `page` i `limit` są liczbami, a `id` jest poprawnym UUID.
- **Ochrona przed atakami**: Używanie parametrów zapytań lub ORM zapobiega atakom SQL Injection.
- **Kontrola dostępu**: Operacje modyfikujące dane są dostępne tylko dla autoryzowanych użytkowników posiadających odpowiedni `user_id`.

## 7. Obsługa błędów

- **400 Bad Request**: W przypadku niepoprawnych danych wejściowych, np. błędny format parametrów.
- **401 Unauthorized**: Gdy brak jest poprawnej autoryzacji lub token jest nieprawidłowy.
- **404 Not Found**: Gdy próbuje się usunąć korektę, która nie istnieje lub nie należy do użytkownika.
- **500 Internal Server Error**: Dla błędów po stronie serwera (np. problem z bazą danych).
- Dodatkowo, wszystkie błędy powinny być logowane przy użyciu wybranego mechanizmu logowania, aby ułatwić diagnozowanie problemów.

## 8. Rozważania dotyczące wydajności

- **Paginacja**: Umożliwia ograniczenie liczby rekordów zwracanych w jednym żądaniu.
- **Indeksowanie**: Kluczowe kolumny, takie jak `user_id` i `created_at`, powinny być indeksowane w bazie danych.
- **Optymalizacja zapytań**: Wykorzystanie ORM lub pre-kompilowanych zapytań zapewniających szybki dostęp do danych.

## 9. Etapy wdrożenia

1. **Utworzenie endpointów**:
   - Stworzenie pliku/route dla GET `/api/corrections` w katalogu `src/app/api/corrections/route.ts`.
   - Stworzenie pliku/route dla DELETE `/api/corrections/{id}` w katalogu `src/app/api/corrections/[id]/route.ts`.
2. **Implementacja autoryzacji i walidacji**:
   - Integracja z systemem uwierzytelniania (np. Supabase Auth) i sprawdzanie tokenów.
   - Walidacja query parameters oraz ID przy użyciu odpowiednich bibliotek (np. Zod lub custom middleware).
3. **Warstwa serwisowa**:
   - Utworzenie lub modyfikacja `CorrectionsService` odpowiedzialnej za:
     - Pobieranie korekt (metoda z obsługą paginacji i sortowania).
     - Usuwanie korekty po weryfikacji autoryzacji.
4. **Implementacja DTO i modeli**:
   - Upewnienie się, że typy z `src/types.ts` są wykorzystywane, np. `CorrectionDTO`, `GetCorrectionsResponseDTO`, `DeleteCorrectionResponseDTO`.
