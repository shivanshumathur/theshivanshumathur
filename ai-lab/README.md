# Igloo Inc. — Local Copy

Exact local copy of [Igloo Inc.](https://www.igloo.inc/) running on your machine.

## Quick start (recommended — exact copy)

Requires internet (proxies the live site):

```bash
cd igloo-clone
npm install
npm run dev
```

Open **http://localhost:3000/** — this is the identical site, served through a local proxy.

## Offline mirror (partial)

Download assets for offline use:

```bash
npm run mirror
npm run dev:offline
```

Note: The offline mirror may be missing some project-specific assets. Use `npm run dev` (proxy) for a guaranteed exact copy.
