FROM node:16.15.1-stretch-slim AS build

WORKDIR /dest

# Copy package.json and package-lock.json
COPY ./package* .

# Copy env file
COPY ./.env .

# Install packages
RUN npm install

# Copy source code
COPY . .

# RUN npm run build
RUN npm run build:vite

# Copy build to caddy server
FROM caddy:2.4.6-alpine
# FROM caddy:2.7.6-alpine

# Debug Tool
# RUN apk --no-cache add curl

COPY --from=build /dest/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /dest/build /usr/share/caddy

# HEALTHCHECK --start-period=5s\
#     CMD curl -fs http://localhost/healthcheck || exit 1


# Start caddy server
# CMD caddy run --config /etc/caddy/Caddyfile
# ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
# EXPOSE 80
