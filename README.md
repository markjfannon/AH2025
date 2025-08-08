# MeowJam

## Build 

1. Install `pnpm`
2. `pnpm i` to install deps
3. Maybe have to install node with `pnpm env use --global latest` for latest version
4. Build with `pnpm build`
5. Serve dist directory with whatever webserver you want. It is static.

## Serve

With docker the following compose file will work for Caddy. (Note the included docker-compose file uses port 4242 on the host).

```yaml
services:
  meowjam:
    image: caddy:2-alpine
    ports:
      - "80:80"
    volumes:
      - ./dist:/usr/share/caddy:ro
      - ./caddy_data:/data
    restart: unless-stopped
```