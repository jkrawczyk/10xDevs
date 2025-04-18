# Schemat bazy danych dla Angielski Korektor

## Tabele

### 1. `users`
- Zarządzana przez Supabase Auth.
- Kolumny przykładowe (nie uwzględnione w tym schemacie): `id`, `email`, `created_at`, `encrypted_password`, `confirmed_at`.

### 2. `corrections`
- `id`: UUID, PRIMARY KEY.
- `user_id`: UUID, NOT NULL, FOREIGN KEY od `users` (`users.id`).
- `original_text`: VARCHAR(2000).
- `approved_text`: TEXT, NOT NULL.
- `correction_style`: VARCHAR, NOT NULL, CHECK (correction_style IN ('formal', 'natural')).
- `created_at`: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP.

### 3. `user_settings`
- `user_id`: UUID, PRIMARY KEY, FOREIGN KEY do `users` (`users.id`).
- `default_correction_style`: VARCHAR, NOT NULL, CHECK (default_correction_style IN ('formal', 'natural')).

## Relacje

- Jeden użytkownik (`users`) może posiadać wiele wpisów w tabeli `corrections` (relacja 1:N).
- Jeden użytkownik (`users`) ma jedno powiązane ustawienie w tabeli `user_settings` (relacja 1:1).

## Indeksy

- Tabela `corrections`: indeks na kolumnie `user_id`.
- Tabela `corrections`: indeks na kolumnie `created_at`.

## Zasady RLS (Row-Level Security)

- Włączyć RLS na tabelach `corrections` oraz `user_settings`.
- Przykładowa polityka RLS dla tabeli `corrections`:

  ```sql
  ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can access own corrections"
    ON corrections
    FOR ALL
    USING (user_id::text = current_setting('request.jwt.claim.sub'));
  ```

- Przykładowa polityka RLS dla tabeli `user_settings`:

  ```sql
  ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can access own settings"
    ON user_settings
    FOR ALL
    USING (user_id::text = current_setting('request.jwt.claim.sub'));
  ```

## Dodatkowe uwagi

- Schemat uwzględnia wszystkie wymagania z dokumentu PRD oraz notatek sesji.
- Ograniczenie długości kolumny `original_text` oraz walidacja dla `correction_style` i `default_correction_style` zapewniają spójność danych.
- Indeksy na kolumnach `user_id` i `created_at` w tabeli `corrections` poprawiają wydajność zapytań.
- Schemat jest zoptymalizowany pod kątem integracji z Supabase Auth oraz zasad RLS, zapewniających bezpieczeństwo danych. 