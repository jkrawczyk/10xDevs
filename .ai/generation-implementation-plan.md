# API Endpoint Implementation Plan: Generate Correction Proposal

## 1. Przegląd punktu końcowego

Endpoint POST `/api/corrections/generate` umożliwia generowanie propozycji korekty oryginalnego tekstu. Użytkownik, który jest niezadowolony z początkowej propozycji, może przesłać odrzucony tekst (`denied_proposed_text`) aby dostarczyć dodatkowy kontekst do regeneracji propozycji. Endpoint zwraca przygotowany tekst wraz z komentarzem edukacyjnym, wyjaśniającym co zostało poprawione oraz jakie błędy występowały w oryginalnym tekście.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **URL:** `/api/corrections/generate`
- **Parametry:**
  - Wymagane:
    - `original_text` (string): Oryginalny tekst do korekty.
    - `correction_style` (string): Jeden z typów: `formal` lub `natural`.
  - Opcjonalne:
    - `denied_proposed_text` (string): Tekst, który nie został zaakceptowany, dostarczając kontekst do ponownej propozycji.
- **Request Body (JSON):**
  ```json
  {
    "original_text": "...",
    "denied_proposed_text": "...",
    "correction_style": "formal | natural"
  }
  ```

## 3. Wykorzystywane typy

- **Command Model:** `GenerateCorrectionProposalCommand`
  - Zawiera: `original_text`, `denied_proposed_text`, `correction_style`
- **DTO odpowiedzi:** `GenerateCorrectionProposalResponseDTO`
  - Zawiera: `original_text`, `proposed_text`, `correction_style`, `educational_comment`

Dodatkowo, istnieją typy związane z innymi operacjami, takie jak `CreateCorrectionCommand` oraz DTO dla korekt, które mogą służyć przy integracji z innymi fragmentami systemu.

## 4. Szczegóły odpowiedzi

- **200 OK:**
  - Zwracany JSON:
    ```json
    {
      "original_text": "...",
      "proposed_text": "New proposed text with comments",
      "correction_style": "formal | natural",
      "educational_comment": "..."
    }
    ```

- **Błędy:**
  - **400 Bad Request:** Błędne dane wejściowe lub niekompletny JSON.
  - **401 Unauthorized:** Brak wymaganej autoryzacji.
  - **500 Internal Server Error:** Błąd po stronie serwera (np. nieoczekiwane wyjątki podczas przetwarzania). 

## 5. Przepływ danych

1. Klient wysyła żądanie POST z danymi: `original_text`, `denied_proposed_text`, `correction_style`.
2. Endpoint weryfikuje, czy użytkownik jest uwierzytelniony (sprawdzenie sesji Supabase).
3. Walidacja danych wejściowych za pomocą schematu (np. przy użyciu Zod) zapewnia, że wymagane pola są obecne i poprawne, a `original_text` ma nie więcej niż 2000 znaków
4. Logika biznesowa (service layer) odpowiada za:
   - Przetwarzanie zapytania
   - Integrację z potencjalnym systemem generowania treści (poprzez API OpenRouter) w celu wygenerowania nowej propozycji korekty.
   - Generację komentarza edukacyjnego opisującego zmiany.
5. (Opcjonalnie) Zapis danych w tabeli `corrections` w bazie danych, powiązanych z bieżącym `user_id`.
6. Zwrócenie odpowiedzi ze strukturą `GenerateCorrectionProposalResponseDTO`.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie i autoryzacja:** Upewnij się, że tylko zalogowani użytkownicy mogą korzystać z endpointu. Integracja z Supabase Auth w celu weryfikacji sesji.
- **Walidacja danych:** Użycie walidatorów (np. Zod) dla danych wejściowych, aby zapobiec nieprawidłowym operacjom.
- **Rate Limiting:** Implementacja mechanizmu ograniczania liczby żądań (np. middleware rate limiting) aby zapobiec nadużyciom.
- **Ochrona przed atakami:** Zabezpieczenie przed potencjalnymi atakami typu injection oraz DDoS.

## 7. Obsługa błędów

- **400 Bad Request:** Gdy walidacja danych nie powiedzie się (np. brak wymaganego pola, niepoprawny format correction_style).
- **401 Unauthorized:** Gdy sesja użytkownika nie jest ważna lub użytkownik nie jest zalogowany.
- **500 Internal Server Error:** Błędy nieoczekiwane, np. awarie serwera lub problem z integracją z zewnętrznym API.

Każdy błąd powinien być odpowiednio logowany, aby umożliwić szybką diagnozę problemów.

## 8. Rozważania dotyczące wydajności

- **Timeout dla wywołania AI**: 60 sekund
- **Asynchroniczne przetwarzanie:** W zależności od wymaganej logiki generowania korekty, przetwarzanie asynchroniczne może poprawić wydajność.

## 9. Etapy wdrożenia

1. **Stworzenie Route Handlera:** 
   - Utworzyć plik w `src/app/api/corrections/generate/route.ts` zgodnie z Next.js App Router.
2. **Walidacja wejścia:** 
   - Zaimplementować walidację danych wejściowych przy użyciu Zod lub innego narzędzia walidacyjnego.
3. **Implementacja Service Layer:** 
   - Wyodrębnić logikę biznesową do serwisu, który przyjmie dane wejściowe i zwróci wynik w postaci DTO.
4. **Integracja z generatorem treści:** 
   - Zaimplementować lub zintegrować moduł generowania propozycji (na bazie OpenRouter.ai).
5. **Interakcja z bazą danych:** 
   - Jeżeli wymagane, zapisać dane dotyczące korekty w tabeli `corrections` powiązanej z `user_id`.
6. **Obsługa błędów i logowanie:** 
   - Dodać mechanizmy obsługi błędów oraz logowania, aby zapewnić diagnostykę oraz szybkie reagowanie na problemy.
7. **Dokumentacja:** 
   - Zaktualizować dokumentację API i wewnętrzne README, aby ułatwić przyszłe utrzymanie.

Po wykonaniu powyższych kroków endpoint będzie gotowy do wdrożenia, zapewniając spójność z archetypem aplikacji Next.js oraz integracją z Supabase. 