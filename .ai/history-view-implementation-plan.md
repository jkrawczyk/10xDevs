# Plan implementacji widoku historii korekt

## 1. Przegląd
Widok historii korekt umożliwia użytkownikowi przeglądanie zapisanych korekt wraz z informacjami o oryginalnym oraz poprawionym tekście, datą utworzenia i stylem korekty. Widok ten umożliwia także usuwanie wybranych korekt z potwierdzeniem w modalu, zapewniając bezpieczną i czytelną interakcję.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/history`.

## 3. Struktura komponentów
- **HistoryView**: Główny kontener widoku odpowiedzialny za pobieranie danych, zarządzanie stanem oraz renderowanie listy korekt.
- **CorrectionList**: Komponent odpowiedzialny za renderowanie listy korekt.
- **CorrectionListItem**: Podkomponent prezentujący szczegóły pojedynczej korekty (oryginalny tekst, poprawiony tekst, data utworzenia, styl korekty) oraz przycisk inicjujący usunięcie.
- **DeleteConfirmationModal**: Modal wyświetlany przed usunięciem korekty, służący do potwierdzenia operacji.
- **Pagination (opcjonalnie)**: Komponent umożliwiający paginację wyników, jeśli liczba korekt przekroczy domyślny limit.

## 4. Szczegóły komponentów
### HistoryView
- **Opis**: Główny kontener, który odpowiada za pobranie listy korekt z API, zarządzanie stanem ładowania, błędów oraz przetwarzanie operacji usuwania.
- **Główne elementy**: Wywołanie API GET do `/api/corrections`, renderowanie komponentu CorrectionList, opcjonalnie komponentu Pagination.
- **Obsługiwane interakcje**: Pobieranie danych przy montażu, aktualizacja listy po usunięciu korekty.
- **Typy**: Korzysta z typu `CorrectionDTO` zdefiniowanego w `src/types.ts`.
- **Propsy**: Brak (komponent nadrzędny).

### CorrectionList
- **Opis**: Renderuje listę korekt przekazaną jako prop.
- **Główne elementy**: Iteracja po tablicy korekt i renderowanie komponentów CorrectionListItem.
- **Obsługiwane interakcje**: Przekazywanie callback do usunięcia korekty dla każdego elementu.
- **Typy**: Przyjmuje prop `correctionList: CorrectionDTO[]`.
- **Propsy**: `correctionList` (tablica korekt), `onDelete` (callback wywoływany po usunięciu korekty).

### CorrectionListItem
- **Opis**: Prezentuje szczegóły pojedynczej korekty.
- **Główne elementy**: Wyświetlanie oryginalnego i poprawionego tekstu, daty oraz stylu korekty, przycisk "Usuń".
- **Obsługiwane interakcje**: Kliknięcie przycisku "Usuń" inicjuje otwarcie modala potwierdzającego usunięcie.
- **Typy**: Korzysta z typu `CorrectionDTO`.
- **Propsy**: `correction` (obiekt korekty), `onDelete` (callback do inicjowania procesu usunięcia).

### DeleteConfirmationModal
- **Opis**: Modal służący do potwierdzenia operacji usunięcia korekty.
- **Główne elementy**: Wiadomość ostrzegawcza, przycisk potwierdzenia usunięcia oraz przycisk anulowania.
- **Obsługiwane interakcje**: Kliknięcie przycisku „Potwierdź” wywołuje funkcję usuwania (DELETE API), kliknięcie „Anuluj” zamyka modal.
- **Typy**: Możliwość przyjmowania identyfikatora korekty (`correctionId: string`) lub całego obiektu korekty.
- **Propsy**: `isOpen` (stan modala), `onConfirm` (callback wykonywany przy potwierdzeniu), `onCancel` (callback przy anulowaniu).

### Pagination (opcjonalnie)
- **Opis**: Komponent do nawigacji między stronami wyników.
- **Główne elementy**: Przycisk poprzedniej strony, aktualna strona, przycisk następnej strony.
- **Obsługiwane interakcje**: Zmiana strony, która powoduje ponowne pobranie danych z API z odpowiednimi parametrami.
- **Typy**: `currentPage: number`, `totalPages: number`.
- **Propsy**: `currentPage`, `totalPages`, `onPageChange` (callback zmiany strony).

## 5. Typy
- **CorrectionDTO**: Typ zdefiniowany w `src/types.ts`, zawiera pola: `id`, `user_id`, `original_text`, `approved_text`, `correction_style`, `created_at`.
- **HistoryViewModel (opcjonalnie)**: Model widoku, który może zawierać pole `corrections: CorrectionDTO[]`, status ładowania, błędy itp.
- Typy odpowiedzi z API:
  - GET `/api/corrections`: Tablica `CorrectionDTO`.
  - DELETE `/api/corrections/{id}`: Obiekt z polem `message` (string).

## 6. Zarządzanie stanem
- W komponencie `HistoryView` użyjemy `useState` i `useEffect` do zarządzania stanem listy korekt, stanu ładowania i błędów.
- Opcjonalnie można zaimplementować custom hook `useCorrections` do obsługi pobierania, usuwania i paginacji korekt.
- Po usunięciu korekty stan zostanie zaktualizowany przez filtrację listy lub ponowne pobranie danych z API.

## 7. Integracja API
- **GET `/api/corrections`**: Wywołanie API przy montażu widoku w celu pobrania listy korekt, z obsługą parametrów `page`, `limit` i `sort`.
- **DELETE `/api/corrections/{id}`**: Wywołanie API przy potwierdzaniu usunięcia korekty. Po pomyślnym usunięciu aktualizujemy stan widoku.
- Sprawdzamy kody statusu (200 OK, 401 Unauthorized, 404 Not Found) i obsługujemy ewentualne błędy, wyświetlając komunikaty użytkownikowi.

## 8. Interakcje użytkownika
- Użytkownik przegląda listę korekt z widocznymi informacjami: oryginalny tekst, poprawiony tekst, data, styl korekty.
- Kliknięcie przycisku "Usuń" przy danej korekcie otwiera `DeleteConfirmationModal` z prośbą o potwierdzenie.
- Po potwierdzeniu, wywoływane jest API DELETE i widok zostaje zaktualizowany o usuniętą korektę.
- W przypadku błędów (np. brak autoryzacji, korekta nie istnieje) użytkownik otrzymuje odpowiedni komunikat.
- (Opcjonalnie) Użytkownik może przełączać strony, co powoduje pobieranie danych z odpowiednimi parametrami paginacji.

## 9. Warunki i walidacja
- Przed wywołaniem API DELETE weryfikujemy, czy przekazany identyfikator korekty jest poprawnym UUID.
- Walidujemy odpowiedź API pod kątem statusu i struktury zwracanych danych.
- Zabezpieczamy operację usunięcia za pomocą modala, aby zapobiec przypadkowemu usunięciu.

## 10. Obsługa błędów
- W przypadku błędu podczas pobierania korekt wyświetlamy komunikat "Wystąpił błąd podczas pobierania korekt. Spróbuj ponownie później.".
- W przypadku błędu przy usuwaniu korekty, wyświetlamy odpowiedni komunikat i umożliwiamy ponowienie operacji.
- Obsługujemy statusy 401 (przekierowanie do logowania lub odpowiedni komunikat) oraz 404 (korekta nie została znaleziona).

## 11. Kroki implementacji
1. Utworzenie nowej strony `/history` w Next.js App Router.
2. Zaimplementowanie komponentu `HistoryView` do pobierania danych z API i zarządzania stanem widoku.
3. Utworzenie komponentów `CorrectionList` i `CorrectionListItem` do prezentacji listy korekt.
4. Implementacja komponentu `DeleteConfirmationModal` do potwierdzenia usunięcia korekty.
5. (Opcjonalnie) Dodanie komponentu `Pagination` do obsługi paginacji wyników.
6. Integracja komponentów w ramach `HistoryView` oraz implementacja logiki wywołań API (GET i DELETE) z odpowiednią obsługą błędów.
7. Testowanie widoku pod kątem poprawności wyświetlania, interakcji użytkownika oraz obsługi błędów.
8. Refaktoryzacja kodu i finalna integracja wraz z przeglądem przez zespół. 