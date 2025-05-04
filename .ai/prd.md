# Dokument wymagań produktu (PRD) - Angielski Korektor

## 1. Przegląd produktu
Angielski Korektor to aplikacja webowa umożliwiająca automatyczną korektę tekstu w języku angielskim. Główne funkcje obejmują poprawę tekstu zachowując oryginalny styl, generowanie szczegółowych komentarzy edukacyjnych oraz wyjaśnień błędów, a także możliwość wyboru stylu korekty (formalny lub naturalny). Aplikacja umożliwia również zapis historii korekt oraz zarządzanie kontem użytkownika, co pozwala na bezpieczny dostęp do zapisanych danych.

## 2. Problem użytkownika
W dzisiejszych czasach język angielski jest powszechnie używany, ale wielu użytkowników odczuwa niepewność i stres podczas korzystania z niego. Problem polega na tym, że użytkownicy potrzebują narzędzia, które:
- Umożliwi szybkie i efektywne poprawienie tekstu,
- Zapewni edukacyjne wyjaśnienia błędów,
- Umożliwi naukę poprzez zrozumienie popełnionych błędów,
- Zapewni bezpieczne przechowywanie historii poprawek.

## 3. Wymagania funkcjonalne
- Korekta tekstu wprowadzonego przez użytkownika poprzez kopiuj-wklej
  - limit długości tekstu to 2000 znaków
- Generowanie szczegółowych, kontekstowych komentarzy edukacyjnych, które wyjaśniają popełnione błędy.
- Możliwość wyboru stylu korekty (formalny lub naturalny) przy każdej operacji, wraz z opcją ustawienia domyślnego wyboru w profilu użytkownika.
- Funkcja ponownego generowania tekstu w przypadku niezadowolenia z początkowego rezultatu.
- Automatyczne zapisywanie historii użytkownika poprawionych tekstów, z możliwością ich przeglądania i usuwania.
- System kont użytkowników umożliwiający bezpieczną rejestrację, logowanie oraz dostęp do historii korekt i ustawień profilu.

## 4. Granice produktu
- Import plików w formatach innych niż tekst (np. PDF, DOCX) nie jest częścią MVP.
- Produkt będzie obsługiwał tylko język angielski.
- Nie będą udostępniane sugestie dotyczące treści (np. "Jak napisać mail do HR?").
- MVP obejmuje jedynie wersję webową aplikacji – aplikacja mobilna nie będzie wspierana w pierwszej wersji.

## 5. Historyjki użytkowników
US-001
Tytuł: Wprowadzenie tekstu i poprawa korekty
Opis: Użytkownik wprowadza tekst w języku angielskim do pola tekstowego, wybiera preferowany styl korekty (formalny lub naturalny) i wysyła tekst do analizy przez AI. System zwraca poprawiony tekst wraz ze szczegółowymi komentarzami edukacyjnymi.
Kryteria akceptacji:
- Użytkownik może wprowadzić tekst i wybrać styl korekty.
- System zwraca poprawiony tekst zgodnie z wybranym stylem.
- Wyświetlane są szczegółowe komentarze edukacyjne dotyczące popełnionych błędów.

US-002
Tytuł: Ponowne generowanie poprawki
Opis: Użytkownik, niezadowolony z otrzymanego rezultatu, korzysta z opcji ponownego generowania tekstu. System generuje i wyświetla nową wersję poprawionego tekstu.
Kryteria akceptacji:
- Opcja ponownego generowania jest widoczna i dostępna dla użytkownika.
- Po kliknięciu przycisku, system generuje nową wersję tekstu wraz z komentarzami edukacyjnymi.
- Liczba żądań ponownego generowania jest rejestrowana w systemie.

US-003
Tytuł: Zapisywanie i przegląd historii korekt
Opis: Po zaakceptowaniu poprawionego tekstu, system automatycznie zapisuje oryginalny oraz poprawiony tekst w historii użytkownika. Użytkownik może przeglądać zapisane korekty oraz usuwać wybrane wpisy.
Kryteria akceptacji:
- Poprawione teksty są automatycznie zapisywane w historii.
- Użytkownik może przeglądać historię korekt.
- Użytkownik ma możliwość usunięcia wybranego wpisu z historii.

US-004
Tytuł: Ustawienia profilu i domyślny styl korekty
Opis: Użytkownik zalogowany do systemu może ustawić swój domyślny preferowany styl korekty, który będzie automatycznie stosowany przy kolejnych operacjach.
Kryteria akceptacji:
- Użytkownik ma dostęp do ustawień profilu.
- Użytkownik może wybrać domyślny styl korekty (formalny lub naturalny).
- Wybrany domyślny styl jest zapisywany i stosowany przy kolejnych operacjach korekty.

US-005
Tytuł: Bezpieczne logowanie i rejestracja
Opis: Nowy użytkownik może zarejestrować konto oraz zalogować się do systemu, co umożliwia bezpieczny dostęp do generowania korekt, zapisanej historii korekt oraz ustawień profilu.
Kryteria akceptacji:
- Użytkownik może zarejestrować konto.
- System umożliwia logowanie użytkownika z weryfikacją danych.
- Podstawowy widok formularza generowania korekty jest widoczny bez logowania, natomiast samo generowanie nie jest możliwe dla niezalogowanych użytkowników
- Przycisk generowania korekty jest zastąpiony przyciskiem logowania, np. "Sign in to generate correction"
- Dostęp do możliwości generowania korekt, historii korekt użytkownika i ustawień profilu jest ograniczony do zalogowanych użytkowników.
- Użytkownik może logować się do systemu poprzez przycisk w prawym górnym rogu lub zastąpiony przycisk generowania korekt
- Użytkownik może się wylogować z systemu poprzez przycisk w prawym górnym rogu
- Logowanie i rejestracja odbywa się na dedykowanych stronach
- Odzyskiwanie hasła powinno być możliwe

## 6. Metryki sukcesu
- Liczba żądań ponownego generowania tekstu - główny wskaźnik efektywności systemu.
- Cel: 75% użytkowników korzysta z funkcji ponownego generowania co najmniej 3 razy tygodniowo.
- Liczba aktywnych użytkowników i częstotliwość korzystania z funkcji korekty. 