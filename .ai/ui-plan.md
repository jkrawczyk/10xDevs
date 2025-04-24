# Architektura UI dla Angielski Korektor

## 1. Przegląd struktury UI

Główny interfejs składa się z trzech podstawowych widoków, które odpowiadają głównym funkcjom aplikacji:
- Ekran wprowadzania tekstu (z dynamiczną sekcją prezentacji poprawionego tekstu i edukacyjnych komentarzy)
- Widok historii korekt
- Ekran ustawień profilu

Nawigacja odbywa się poprzez statyczne menu boczne, które gwarantuje intuicyjne przechodzenie między widokami. Aplikacja oferuje mechanizmy walidacji danych, obsługi stanów ładowania oraz komunikatów błędów (poprzez modale).

## 2. Lista widoków

### a. Ekran wprowadzania tekstu
- **Ścieżka widoku:** `/`
- **Główny cel:** Umożliwienie użytkownikowi wprowadzenia tekstu, który ma zostać poddany korekcie, oraz wyboru stylu korekty (formalny lub naturalny). Początkowo widoczny jest jedynie formularz – pole tekstowe, przełącznik wyboru stylu oraz przycisk submit. Po wysłaniu żądania do backendu, pod formularzem dynamicznie wyświetlana jest sekcja wyników z poprawionym tekstem oraz edukacyjnymi komentarzami.
- **Kluczowe informacje do wyświetlenia:**
  - Początkowo: pole tekstowe (do 2000 znaków), opcja wyboru stylu korekty (radio/select) oraz przycisk wysyłki.
  - Po otrzymaniu odpowiedzi: sekcja wyników prezentująca poprawiony tekst i edukacyjne komentarze, wraz z informacjami o stanie ładowania oraz ewentualnymi komunikatami błędów.
- **Kluczowe komponenty widoku:** Formularz wprowadzania tekstu (pole, przełącznik stylu, przycisk submit) oraz sekcja wyników (obsługująca prezentację poprawionego tekstu i komentarzy edukacyjnych).
- **Uwagi UX, dostępność i bezpieczeństwo:** Interfejs zapewnia wyraźny podział między fazą wprowadzania danych a prezentacją wyników. Natychmiastowa walidacja oraz responsywny design zwiększają dostępność i bezpieczeństwo użytkownika.

### b. Widok historii korekt
- **Ścieżka widoku:** `/history`
- **Główny cel:** Umożliwienie użytkownikowi przeglądania i zarządzania zapisanymi korektami.
- **Kluczowe informacje do wyświetlenia:**
  - Lista wcześniejszych korekt (z informacjami o oryginalnym i poprawionym tekście, dacie oraz stylu korekty).
  - Opcja usunięcia korekty (z modalnym potwierdzeniem przed usunięciem).
- **Kluczowe komponenty widoku:** Lista elementów, modal potwierdzający usunięcie, opcjonalna paginacja.
- **Uwagi UX, dostępność i bezpieczeństwo:** Czytelna prezentacja historii, możliwość filtrowania/sortowania oraz zabezpieczenie przed przypadkowym usunięciem.

### c. Ekran ustawień profilu
- **Ścieżka widoku:** `/profile`
- **Główny cel:** Umożliwienie zarządzania ustawieniami konta, w szczególności ustawienia domyślnego stylu korekty.
- **Kluczowe informacje do wyświetlenia:**
  - Formularz z aktualnymi ustawieniami.
  - Opcje wyboru stylu korekty.
  - Przycisk zapisu zmian.
- **Kluczowe komponenty widoku:** Formularz ustawień, select/radio input, przycisk zapisu.
- **Uwagi UX, dostępność i bezpieczeństwo:** Intuicyjny interfejs z natychmiastową walidacją oraz czytelnym oznaczeniem elementów formularza.

## 3. Mapa podróży użytkownika

1. **Ekran wprowadzania tekstu:** Użytkownik wprowadza tekst oraz wybiera styl korekty (lub korzysta z ustawienia domyślnego) i klika przycisk "Koryguj".
2. **Dynamiczna prezentacja wyników:** Po wysłaniu żądania do backendu (POST /api/correction/generate), pod formularzem pojawia się sekcja z poprawionym tekstem i edukacyjnymi komentarzami, z opcją zatwierdzenia lub ponownego generowania poprawki.
3. **Widok historii korekt:** Po zaakceptowaniu korekty, użytkownik może przeglądać zapisane korekty w widoku historii (GET /api/corrections) i usuwać wpisy po potwierdzeniu.
4. **Ekran ustawień:** Użytkownik może przejść do ustawień, aby zmienić domyślne preferencje korekty (PUT /api/user-settings), co wpływa na przyszłe operacje.

## 4. Układ i struktura nawigacji

- **Statyczne menu boczne:** Obecne we wszystkich widokach, umożliwiające szybkie przełączanie między następującymi sekcjami:
  - Ekran wprowadzania tekstu
  - Historia
  - Ustawienia
- **Routing:** Implementacja z użyciem Next.js App Router, gdzie każda ścieżka odpowiada funkcji aplikacji.
- **Dostępność:** Menu zoptymalizowane dla użytkowników korzystających z klawiatury i czytników ekranu, ze stosownymi oznaczeniami oraz odpowiednim kontrastem.

## 5. Kluczowe komponenty

- **Formularz wprowadzania tekstu:** Umożliwia wpisanie tekstu oraz wybór stylu korekty z walidacją limitu 2000 znaków.
- **Sekcja wyników:** Dynamicznie wyświetlana część interfejsu prezentująca poprawiony tekst oraz edukacyjne komentarze zaraz pod formularzem.
- **Komponent listy historii korekt:** Renderuje listę zapisanych korekt z opcją usuwania (z modalnym potwierdzeniem).
- **Panel ustawień profilu:** Formularz do zarządzania ustawieniami użytkownika, głównie domyślnym stylem korekty.
- **Nawigacja (Sidebar):** Statyczne menu boczne umożliwiające łatwe przemieszczanie się między widokami.
- **Modale błędów:** Komponent odpowiedzialny za prezentowanie komunikatów o błędach.
- **Komponent ładowania:** Spinner lub skeleton informujący o oczekiwaniu na odpowiedź API. 