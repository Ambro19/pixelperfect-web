<!-- # PixelPerfect Screenshot API — Frontend

React-based dashboard and marketing site for [PixelPerfect](https://pixelperfectapi.net), built with **React 18**, **React Router v6**, **Tailwind CSS**, and **Stripe.js**.

**Production URL:** `https://pixelperfectapi.net`  
**Backend API:** `https://api.pixelperfectapi.net`

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| React Router DOM | 6.20 | Client-side routing |
| Tailwind CSS | 3.4 | Styling |
| @stripe/react-stripe-js | 2.9 | Stripe Elements |
| axios | 1.6 | HTTP client |
| react-hot-toast | 2.5 | Notifications |

**Node.js:** `20.x`

---

## Getting Started

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`. Backend expected at `http://localhost:8000` by default.

**LAN / mobile testing:**

```bash
npm run start:lan
```

**Production build:**

```bash
npm run build
```

---

## Environment Setup

Copy `.env.example` to `.env` and set at minimum:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> All `REACT_APP_*` variables are embedded at build time. Never place secret keys in frontend environment variables.

---

## SPA Routing — Render Deployment

This app uses React Router v6. All requests must be rewritten to `index.html` at the host level.

**Render (current host — configured and working):**

In Render's Static Site settings, set the rewrite rule:

```
Source: /*   →   Destination: /index.html   →   Action: Rewrite
```

**Netlify** — add `public/_redirects`:

```
/*  /index.html  200
```

**Nginx:**

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## PWA Icons

All app icons are stored under `public/favicons/`. The `manifest.json` references all icons using the `/favicons/` path prefix. Do not move icons to the public root or reference them without the `/favicons/` prefix — this will result in a 404 in the browser console and a broken PWA manifest.

---

## Stripe

Checkout sessions are created by the backend. The frontend uses only the Stripe **publishable key** — never the secret key.

```env
# Development
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Production
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## License

Copyright © 2026 [OneTechly](https://onetechlyambr19.blogspot.com/2025/04/exploring-unixlinux-based-environments.html)  
All rights reserved.

This is proprietary software. Unauthorized copying, modification, or distribution is strictly prohibited. -->


# PixelPerfect Screenshot API — Frontend

React-based dashboard and marketing site for [PixelPerfect](https://pixelperfectapi.net), built with **React 18**, **React Router v6**, **Tailwind CSS**, and **Stripe.js**.

**Production URL:** `https://pixelperfectapi.net`  
**Backend API:** `https://api.pixelperfectapi.net`

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| React Router DOM | 6.20 | Client-side routing |
| Tailwind CSS | 3.4 | Styling |
| @stripe/react-stripe-js | 2.9 | Stripe Elements |
| axios | 1.6 | HTTP client |
| react-hot-toast | 2.5 | Notifications |

**Node.js:** `20.x`

---

## Getting Started

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`. Backend expected at `http://localhost:8000` by default.

**LAN / mobile testing:**

```bash
npm run start:lan
```

**Production build:**

```bash
npm run build
```

---

## Environment Setup

Copy `.env.example` to `.env` and set at minimum:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> All `REACT_APP_*` variables are embedded at build time. Never place secret keys in frontend environment variables.

---

## SPA Routing — Render Deployment

This app uses React Router v6. All requests must be rewritten to `index.html` at the host level.

**Render (current host — configured and working):**

In Render's Static Site settings, set the rewrite rule:

```
Source: /*   →   Destination: /index.html   →   Action: Rewrite
```

**Netlify** — add `public/_redirects`:

```
/*  /index.html  200
```

**Nginx:**

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## PWA Icons

All app icons are stored under `public/favicons/`. The `manifest.json` references all icons using the `/favicons/` path prefix. Do not move icons to the public root or reference them without the `/favicons/` prefix — this will result in a 404 in the browser console and a broken PWA manifest.

---

## Stripe

Checkout sessions are created by the backend. The frontend uses only the Stripe **publishable key** — never the secret key.

```env
# Development
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Production
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## License

Copyright © 2026 [OneTechly](https://onetechly.com)  
All rights reserved.

This is proprietary software. Unauthorized copying, modification, or distribution is strictly prohibited.