# Przegląd bezpieczeństwa (październik 2026)

Model: jedna osoba (fotograf) loguje się do panelu `/config`, reszta świata tylko ogląda (publiczne GET).

## Co zostało naprawione

| Obszar | Było | Jest |
|---|---|---|
| Upload – nazwa pliku | `FileName` od klienta szło prosto do `Path.Combine` → path traversal (`../../app/x.dll`), nadpisywanie plików | biała lista znaków i rozszerzeń, max 32 zn., `FileMode.CreateNew`, kontrola że ścieżka jest w katalogu uploadów |
| Upload – zawartość | dowolny plik (np. `.html`/`.svg`) serwowany z tej samej domeny → stored XSS | sprawdzanie magic bytes (JPEG/PNG/GIF/WEBP/AVIF/HEIC), Caddy serwuje z `/media` tylko obrazy, z CSP `sandbox` + `nosniff` |
| Upload – rozmiar | domyślne 30 MB Kestrela, brak limitu w proxy | 50 MB w API, 60 MB w Caddy |
| Usuwanie zdjęcia | usuwany tylko rekord, plik dalej publiczny | plik też jest kasowany |
| Logowanie | brak limitu prób, różny czas odpowiedzi dla złego loginu | 5 prób/min/IP (429), stały czas, limity długości |
| Sesja | cookie bez `Secure`, `SameSite=Lax`, bez wygasania, klucze Data Protection giną przy restarcie | `Secure` + `SameSite=Strict` (prod), 8 h sliding, klucze na wolumenie |
| CSRF | antiforgery wyłączone | zostaje wyłączone, ale: ta sama domena, `SameSite=Strict` i sprawdzanie nagłówka `Origin` dla POST/PUT/DELETE |
| Paginacja (publiczne GET) | `pageSize` bez limitu → tani DoS, ujemne wartości = 500 | `pageSize` 1–100, `page` ≥ 0, inaczej 400 |
| Błędy | wyjątki → 500 | 400/404/409/413 jako ProblemDetails, bez stack trace |
| Swagger/OpenAPI | wystawione publicznie | tylko w Development |
| Sekrety | hasło DB i admina (`change-me`) w kodzie/appsettings | z `.env`; prod nie wystartuje z hasłem < 12 znaków |
| Infrastruktura | Postgres na `0.0.0.0:5432` z domyślnym hasłem, obraz SDK jako root | brak publikowanych portów, Postgres w sieci `internal`, runtime `aspnet` jako `app`, read-only FS, `no-new-privileges`, `cap_drop` |
| Caddy | `localhost` z self-signed TLS, serwował wszystko z `/srv` (np. `.DS_Store`), brak nagłówków | patrz `deploy/Caddyfile`: HSTS, CSP, X-Frame-Options, cache, blokada ukrytych plików, brak listingu |

Wszystkie POST/PUT/DELETE miały już `RequireAuthorization()` — to było OK. Guard w routerze Vue jest tylko kosmetyczny, prawdziwa ochrona jest w API.

## Pozostałe zagrożenia (świadomie zaakceptowane / do decyzji)

1. **Antiforgery wyłączone.** Przy obecnych zabezpieczeniach (Strict cookie + Origin + jedna domena) realny wektor CSRF praktycznie znika. Ryzyko wraca, jeśli API zostanie przeniesione na inną domenę albo `FrontendOrigin` dostanie obcy origin.
2. **Panel logowania jest publiczny.** Jedno hasło chroni całą stronę. Najmocniejsze tanie wzmocnienie: **Cloudflare Access** (darmowe do 50 osób) na `byshutter.pl/config*` i `byshutter.pl/api/auth/*` z logowaniem mailem — wtedy brute force jest niemożliwy. Do tego reguła rate-limit w WAF.
3. **Brak zmiany hasła / unieważniania sesji.** Zmiana `ADMIN_PASSWORD` po pierwszym starcie nic nie zmienia; skradzione cookie działa do 8 h. Wylogowanie wszędzie = usunięcie wolumenu `dpkeys` i restart.
4. **EXIF w zdjęciach.** Oryginały mogą zawierać GPS, model aparatu, datę — wszystko publiczne. Usuwać metadane przed wgraniem (Lightroom: Export → Metadata: Copyright only) albo dodać strip po stronie serwera (np. ImageSharp).
5. **Wszystkie zdjęcia są publiczne od razu po uploadzie** — `GET /api/photos/{size}/{page}` listuje też te spoza albumów, a nazwy plików są przewidywalne. Nie wgrywać niczego, co nie ma być publiczne.
6. **Cache Cloudflare** może jeszcze przez jakiś czas serwować usunięte zdjęcie (TTL 30 dni) — purge ręczny.
7. **Wyciek drobnych informacji**: DTO zwraca `ServerPath` (`/app/uploads`); klucz licencji MediatR jest w kodzie — przy publicznym repo lepiej przenieść go do `.env` (`MediatR__LicenseKey`).
8. **Dane dev w repo**: `appsettings.Development.json` (`piotrek` / `change-me`) i `ByShutterBackend/compose.yaml` (`byshutter_password`) — tylko lokalnie, nigdy na serwerze.
9. **Supply chain**: obrazy `cloudflare/cloudflared:latest`, `caddy:2-alpine`, `postgres:16-alpine` są pływające — rozważ przypięcie wersji i regularne `docker compose pull`; `npm audit` / `dotnet list package --vulnerable`.
10. **Backup**: wolumeny `pgdata` i `media` to jedyna kopia danych — patrz DEPLOY.md.
11. **CSP** zezwala na `'unsafe-inline'` dla styli (Vue/Tailwind) i na beacon Cloudflare Web Analytics. Jeśli włączysz Rocket Loader albo inne skrypty CF, CSP je zablokuje.
