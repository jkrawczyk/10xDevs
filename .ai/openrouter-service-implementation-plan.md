# OpenRouter Service Implementation Plan

## 1. Opis usługi

Usługa OpenRouter jest zaprojektowana do integracji z API OpenRouter, umożliwiając uzupełnianie czatów opartych na modelach LLM. Usługa pośredniczy pomiędzy interfejsem użytkownika a API, zajmując się budowaniem poprawnych żądań, przetwarzaniem odpowiedzi, obsługą błędów oraz zapewnieniem bezpieczeństwa. Implementacja usługi jest zgodna z wymaganym stackiem technologicznym, wykorzystując Next.js, TypeScript oraz najlepsze praktyki związane z budowaniem skalowalnych i bezpiecznych aplikacji.

## 2. Opis konstruktora

Konstruktor usługi inicjalizuje kluczowe ustawienia, w tym:

- Konfigurację endpointu API (np. `apiEndpoint`),
- Klucze autoryzacyjne (np. `apiKey`),
- Domyślną nazwę modelu (np. `openrouter-llm`),
- Domyślne parametry modelu (np. `{ temperature: 0.7, max_tokens: 300 }`),
- Szablony komunikatów systemowego oraz użytkownika.

Parametry te są przekazywane jako obiekt konfiguracyjny, co ułatwia dalszą modyfikację i testowanie usługi.

## 3. Publiczne metody i pola

**Publiczne metody:**

1. `sendChatMessage(message: string, options?: Partial<ModelOptions>): Promise<Response>`
   * Wysyła komunikat użytkownika do API i zwraca odpowiedź modelu.
2. `setConfiguration(config: Configuration): void`
   * Umożliwia aktualizację konfiguracji, w tym kluczy API, endpointu oraz parametrów modelu.
3. `getModelDetails(): ModelDetails`
   * Zwraca aktualne ustawienia modelu, takie jak nazwa i parametry.

**Publiczne pola:**

- `config: Configuration` – przechowuje bieżące ustawienia usługi.
- `defaultResponseFormat` – definiuje oczekiwany format odpowiedzi, zgodny z ustalonym schematem JSON.

## 4. Prywatne metody i pola

**Prywatne metody:**

1. `_buildRequestPayload(systemMessage: string, userMessage: string, options: Partial<ModelOptions>): RequestPayload`
   * Buduje ładunek żądania, łącząc komunikat systemowy, komunikat użytkownika oraz dodatkowe parametry modelu.
2. `_parseApiResponse(apiResponse: any): ParsedResponse`
   * Waliduje i przetwarza odpowiedź API zgodnie z określonym `response_format` (przykład: { type: 'json_schema', json_schema: { name: 'OpenRouterResponse', strict: true, schema: { text: 'string', tokens: 'number' } } }).
3. `_handleError(error: Error, context: string): void`
   * Centralizuje obsługę błędów, logując je i przekazując odpowiednie komunikaty do użytkownika.

**Prywatne pola:**

- `_apiClient` – instancja klienta HTTP odpowiedzialna za komunikację z API.
- `_retryCount` – licznik podejmowanych prób wysłania żądania w przypadku wystąpienia błędów sieciowych lub innych problemów.

## 5. Obsługa błędów

Kluczowe scenariusze błędów i ich obsługa:

1. **Błąd sieciowy:**
   - *Wyzwanie:* Niestabilne połączenie może skutkować timeoutami lub brakiem odpowiedzi.
   - *Rozwiązanie:* Implementacja mechanizmu automatycznego ponawiania żądań (retry) z wykładniczym opóźnieniem.

2. **Nieprawidłowy format odpowiedzi:**
   - *Wyzwanie:* Otrzymanie odpowiedzi, która nie spełnia zdefiniowanego `response_format`.
   - *Rozwiązanie:* Walidacja odpowiedzi JSON za pomocą odpowiednich bibliotek i natychmiastowe zgłaszanie błędu.

3. **Błąd autoryzacji:**
   - *Wyzwanie:* Brak lub nieważny klucz API może prowadzić do błędów autoryzacyjnych.
   - *Rozwiązanie:* Weryfikacja konfiguracji przy starcie usługi oraz natychmiastowe powiadamianie o błędach autoryzacji.

4. **Ograniczenia API (rate limiting):**
   - *Wyzwanie:* Przekroczenie limitów wywołań prowadzi do odpowiedzi 429.
   - *Rozwiązanie:* Wdrożenie mechanizmu kolejkowania żądań oraz zarządzania czasem oczekiwania między kolejnymi próbami.

## 6. Kwestie bezpieczeństwa

1. Przechowywanie kluczy API i wrażliwych danych w zmiennych środowiskowych.
2. Używanie HTTPS do komunikacji z API, aby zabezpieczyć transmisję danych.
3. Walidacja i sanityzacja wejść użytkownika w celu zapobiegania atakom typu injection.
4. Minimalizowanie logowania danych wrażliwych, szczególnie w środowisku produkcyjnym.
5. Ustalanie limitów oraz mechanizmów ochrony przed atakami typu brute force.

## 7. Plan wdrożenia krok po kroku

1. **Inicjalizacja modułu usługi**
   - Utworzenie nowego modułu (np. w katalogu `/src/lib` lub `/src/services`).
   - Inicjalizacja konstruktora z domyślną konfiguracją (endpoint, klucz API, nazwa modelu i parametry).

2. **Implementacja głównych metod**
   - Zaimplementowanie metody `sendChatMessage` wraz z wywołaniem wewnętrznych metod: `_buildRequestPayload` i `_parseApiResponse`.
   - Dodanie metody `setConfiguration` umożliwiającej aktualizację ustawień usługi.
   - Implementacja metody `getModelDetails` do pobierania aktualnych ustawień modelu.

3. **Definicja szablonów wiadomości**
   - **Komunikat systemowy:**
     1. Przykład: "System: Integracja z OpenRouter API. Umożliwia komunikację między UI a modelem LLM."
   - **Komunikat użytkownika:**
     2. Przykład: "User: [Treść pytania użytkownika]"

4. **Konfiguracja `response_format`**
   - Określenie struktury odpowiedzi:
     3. Przykład:
        { type: 'json_schema', json_schema: { name: 'OpenRouterResponse', strict: true, schema: { text: 'string', tokens: 'number' } } }

5. **Ustalenie nazwy modelu i parametrów**
   - **Nazwa modelu:**
     4. Przykład: "openrouter-llm"
   - **Parametry modelu:**
     5. Przykład: { temperature: 0.7, max_tokens: 300 }


---

Niniejszy przewodnik implementacji stanowi kompletny plan wdrożenia usługi OpenRouter, uwzględniając wszystkie kluczowe aspekty techniczne, obsługę błędów oraz bezpieczeństwo, zgodnie z najlepszymi praktykami i wymaganiami projektu. 