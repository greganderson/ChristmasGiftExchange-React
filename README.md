# Christmas Gift Exchange

A simple webapp for determining who has who for Christmas.

## How pairings work

Pairings are calculated from the year, so the same year always gives the same result. Everyone starts by giving to the next person in the list, and that is shifted by `year % (people - 1)` places. Nobody ever draws themselves, and with four people the cycle repeats every three years.

Changing the list of people in `src/App.tsx` changes the pairings for every year, past years included.

## Development

```sh
npm install
npm run dev     # start the dev server
npm run build   # type-check and build into dist/
npm run lint
```

## Deployment

Deployed on Railway with Nixpacks (`nixpacks.toml`), which serves the built `dist/` folder with Caddy (`Caddyfile`).
