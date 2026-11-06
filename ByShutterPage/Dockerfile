# Buduje frontend i pakuje go razem z Caddy (serwer plikow + reverse proxy).
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# Cypress nie jest potrzebny do builda
RUN CYPRESS_INSTALL_BINARY=0 npm ci

COPY . .

# Ta sama domena co API -> sciezki wzgledne, zero CORS
ARG VITE_HOME_PROFILE_ID
ENV VITE_BACKEND_ORIGIN=/api/ \
    VITE_IMAGE_SOURCE_ORIGIN=/media/ \
    VITE_HOME_PROFILE_ID=${VITE_HOME_PROFILE_ID}

RUN npm run build-only

FROM caddy:2-alpine
COPY --from=build /app/dist /srv/www
