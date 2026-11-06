# Wdrożenie (Docker + Cloudflare Tunnel)

```
Internet ──HTTPS──> Cloudflare ──tunel──> cloudflared ──HTTP──> caddy:80
                                                                 ├─ /api/*   -> backend:8080 -> postgres (sieć wewnętrzna)
                                                                 ├─ /media/* -> wolumen `media` (read-only)
                                                                 └─ /*       -> zbudowany frontend (SPA)
```

Żaden kontener nie publikuje portów na serwerze — firewall może blokować cały ruch przychodzący (poza SSH).

## 1. Tunel w Cloudflare
1. Zero Trust → Networks → Tunnels → **Create a tunnel** → Cloudflared → skopiuj **token**.
2. W tunelu dodaj **Public Hostname**: `byshutter.pl` (opcjonalnie `www`) → Service `HTTP` → `caddy:80`.
3. SSL/TLS → tryb **Full**, włącz **Always Use HTTPS**.
4. Zalecane: Security → WAF → Rate limiting rule dla `/api/auth/login` (np. 10 req / 1 min / IP).

## 2. Serwer
```bash
git clone … && cd ByShutter-FrontPage        # ByShutterBackend musi leżeć obok ByShutterPage
cp .env.example .env && nano .env             # DOMAIN, token, hasła
docker compose up -d --build
docker compose logs -f backend cloudflared
```
Konto admina tworzy się przy pierwszym starcie z `ADMIN_USERNAME` / `ADMIN_PASSWORD` (min. 12 znaków).

## 3. Przeniesienie istniejących zdjęć
```bash
docker run --rm -v byshutter_media:/dst -v "$PWD/ByShutterBackend/site:/src:ro" alpine \
  sh -c 'cp -a /src/. /dst/ && chown -R 1654:1654 /dst'
```
(1654 = użytkownik `app` w obrazie ASP.NET). Bazę z dev-a przenieś przez `pg_dump` / `psql`.

## 4. Backup
```bash
docker compose exec -T postgres pg_dump -U byshutter byshutter | gzip > db-$(date +%F).sql.gz
docker run --rm -v byshutter_media:/m:ro -v "$PWD:/b" alpine tar czf /b/media-$(date +%F).tgz -C /m .
```

## Aktualizacja
`git pull && docker compose up -d --build`. Po usunięciu zdjęcia może być ono jeszcze w cache Cloudflare —
w razie potrzeby Caching → Purge (Custom: URL `/media/<plik>`).

## Lokalny development
Bez zmian: `ByShutterBackend/compose.yaml` (Postgres + Caddy na :5702 + API na :5700) i `npm run dev` w `ByShutterPage`.
