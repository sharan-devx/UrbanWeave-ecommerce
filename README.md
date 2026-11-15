# UrbanWeave

React + Vite fashion storefront with an admin dashboard. Data is served by
[json-server](https://github.com/typicode/json-server) from `../db.json`.

## Run it

```bash
npm install
npm run server   # API on http://localhost:5000  (terminal 1)
npm run dev      # app on http://localhost:5173  (terminal 2)
```

Admin login: `admin@uw.com` / `admin@uw` (route `/login`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run server` | Start json-server on port 5000 |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | Run ESLint |

Set `VITE_API_URL` (see `.env.example`) to use a different API address.
