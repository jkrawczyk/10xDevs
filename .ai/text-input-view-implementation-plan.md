# Plan implementacji widoku Ekran wprowadzania tekstu

## 1. Przegląd
Widok ma na celu umożliwienie użytkownikowi wprowadzenia tekstu do korekty oraz wyboru stylu korekty (formalny lub naturalny). Po przesłaniu formularza widok pobiera odpowiedź z API, prezentując poprawiony tekst wraz z komentarzami edukacyjnymi. Interfejs dynamicznie przełącza się między fazą wprowadzania danych a fazą prezentacji wyników.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/`.

## 3. Struktura komponentów
- **Page** (główny komponent strony): Kontener całego widoku.
  - **TextInputForm**: Formularz wprowadzania tekstu (pole tekstowe, wybór stylu, przycisk submit).
  - **ResultsSection**: Sekcja prezentująca wyniki (poprawiony tekst, komentarze edukacyjne) oraz przycisk ponownego generowania poprawki.
  - **LoadingIndicator** (opcjonalnie): Wyświetla stan ładowania.
  - **ErrorMessage** (opcjonalnie): Prezentuje komunikaty błędów.

## 4. Szczegóły komponentów

### TextInputForm
- **Opis**: Komponent przyjmujący dane wejściowe od użytkownika. Umożliwia wpisanie tekstu do korekty, wybór stylu korekty oraz wysłanie formularza.
- **Główne elementy**:
  - Pole `textarea` do wprowadzenia tekstu (limit 2000 znaków).
  - Przełącznik (radio/select) wyboru stylu korekty: opcje "formal" i "natural".
  - Przycisk `submit` wysyłający żądanie do API.
- **Obsługiwane interakcje**:
  - Wprowadzanie tekstu.
  - Zmiana wyboru stylu.
  - Kliknięcie przycisku w celu wysłania formularza.
- **Warunki walidacji**:
  - Tekst nie może być pusty.
  - Maksymalna długość tekstu to 2000 znaków.
- **Typy**:
  - Payload: `GenerateCorrectionProposalCommand` (z pola `original_text`, `correction_style` i opcjonalnie `denied_proposed_text`).
- **Propsy**:
  - `onSubmit`: Funkcja przekazująca dane formularza do rodzica.

### ResultsSection
- **Opis**: Komponent prezentujący wyniki zwrócone przez API, czyli poprawiony tekst oraz komentarze edukacyjne.
- **Główne elementy**:
  - Wyświetlenie poprawionego tekstu (np. w elemencie paragrafu lub polu tekstowym).
  - Sekcja z komentarzami edukacyjnymi.
  - Przycisk "Ponów poprawkę" umożliwiający ponowne wygenerowanie korekty z dodatkowym kontekstem (pole `denied_proposed_text`).
- **Obsługiwane interakcje**:
  - Kliknięcie przycisku do ponownego generowania poprawki.
- **Warunki walidacji**:
  - Wyniki są wyświetlane tylko, gdy API zwróci prawidłowe dane.
- **Typy**:
  - Odpowiedź z API: `GenerateCorrectionProposalResponseDTO`.
- **Propsy**:
  - `correctionData`: Dane wynikowe pochodzące z odpowiedzi API.

### LoadingIndicator i ErrorMessage
- **Opis**: Komponenty pomocnicze do wyświetlania stanu ładowania oraz komunikatów o błędach.
- **Główne elementy**:
  - Spinner.
  - Tekstowy komunikat błędu.
- **Obsługiwane interakcje**: Brak interakcji – jedynie prezentacja stanu.
- **Warunki walidacji**: Widoczność zależy od stanu aplikacji (np. `isLoading` lub `error` nie jest pusty).

## 5. Typy
Wykorzystujemy istniejące typy z `types.ts`, rozszerzając je o typy widokowe:

- **GenerateCorrectionProposalCommand**:
  - `original_text: string`
  - `correction_style: "formal" | "natural"`
  - `denied_proposed_text?: string`

- **GenerateCorrectionProposalResponseDTO**:
  - `original_text: string`
  - `proposed_text: string`
  - `correction_style: "formal" | "natural"`
  - `educational_comment: string`

Dodatkowy typ ViewModel dla widoku:
```typescript
interface CorrectionViewModel {
  originalText: string;
  proposedText?: string;
  correctionStyle: "formal" | "natural";
  educationalComment?: string;
  error?: string;
  isLoading: boolean;
}
```

## 6. Zarządzanie stanem
Stan widoku obsługiwany będzie przy użyciu hooków React:
- `useState` do przechowywania:
  - Wprowadzonego tekstu
  - Wybranego stylu korekty
  - Danych wyniku z API (CorrectionViewModel)
  - Stanu ładowania (`isLoading`)
  - Komunikatu błędu (`error`)

## 7. Integracja API
Integracja z API odbywa się poprzez wywołanie endpointu POST `/api/corrections/generate`.
- **Żądanie**: Obiekt typu `GenerateCorrectionProposalCommand` z polami:
  - `original_text`
  - `correction_style`
  - Opcjonalnie `denied_proposed_text`
- **Odpowiedź**: Obiekt typu `GenerateCorrectionProposalResponseDTO` zawierający:
  - `original_text`, `proposed_text`, `correction_style`, `educational_comment`
- **Proces**:
  - Po submit formularza wysyłamy fetch request z odpowiednimi nagłówkami i treścią JSON.
  - Aktualizujemy stan widoku w zależności od odpowiedzi lub błędu.

## 8. Interakcje użytkownika
- Użytkownik wprowadza tekst w polu `textarea` i wybiera styl korekty.
- Kliknięcie przycisku `Wyślij` powoduje wysłanie żądania do API.
- Podczas oczekiwania widoczny jest `LoadingIndicator`.
- Po otrzymaniu odpowiedzi wyświetlane są dane w `ResultsSection`.
- Kliknięcie przycisku `Ponów poprawkę` umożliwia re-generację tekstu (dodatkowe przesłanie `denied_proposed_text`).

## 9. Warunki i walidacja
- Tekst nie może być pusty oraz nie może przekraczać 2000 znaków.
- Wybór stylu musi być jedną z dwóch opcji: "formal" lub "natural".
- Formularz zapobiega wysyłce jeśli aktualnie trwa przetwarzanie poprzedniego żądania.
- Komunikat o błędzie pojawia się przy nieprawidłowej odpowiedzi API lub błędach walidacyjnych.

## 10. Obsługa błędów
- Walidacja danych na poziomie klienta (sprawdzenie pustego tekstu, długości tekstu).
- Obsługa odpowiedzi błędnych z API (np. status 400, 401, 500) – wyświetlenie czytelnego komunikatu błędu.
- Logowanie błędów w konsoli dla ułatwienia debugowania.

## 11. Kroki implementacji
1. Utworzenie głównego komponentu widoku w pliku `/src/app/page.tsx`.
2. Implementacja komponentu `TextInputForm`:
   - Dodanie pola `textarea` z walidacją długości i pustego tekstu.
   - Implementacja wyboru stylu korekty (radio/select).
   - Dodanie przycisku `submit` wywołującego funkcję przesyłania danych.
3. Implementacja komponentu `ResultsSection` do prezentacji wyników.
4. Dodanie obsługi stanu przy użyciu hooków (`useState` dla tekstu, stylu, wyniku, ładowania i błędów).
5. Integracja z API za pomocą fetch – wysłanie żądania i obsługa odpowiedzi.
6. Dodanie komponentów `LoadingIndicator` i `ErrorMessage` dla lepszej komunikacji stanu aplikacji.
7. Stylowanie komponentów przy użyciu Tailwind CSS oraz zapewnienie responsywności i dostępności.
8. Testowanie funkcjonalności, warunków walidacji oraz obsługi błędów.
9. Finalna refaktoryzacja i dokumentacja kodu. 