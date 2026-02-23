# PixelPerfect Screenshot API — Frontend

React-based dashboard and marketing frontend for the [PixelPerfect Screenshot API](https://pixelperfectapi.net), built with **React 18**, **React Router v6**, **Tailwind CSS**, and **Stripe.js**.

**Production URL:** `https://pixelperfectapi.net`  
**Backend API:** `https://api.pixelperfectapi.net`

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| React Router DOM | 6.20 | Client-side routing (SPA) |
| Tailwind CSS | 3.4 | Utility-first styling |
| @tailwindcss/typography | 0.5 | Prose / blog content styling |
| @tailwindcss/forms | 0.5 | Form element base styles |
| @stripe/react-stripe-js | 2.9 | Stripe Elements integration |
| @stripe/stripe-js | 2.4 | Stripe.js loader |
| axios | 1.6 | HTTP client |
| react-hot-toast | 2.5 | Toast notifications |
| react-toastify | 11.0 | Extended toast system |

**Node.js requirement:** `20.x`

---

## Getting Started

### 1. Clone and install

```bash
cd frontend
npm install
```

### 2. Configure environment

Copy the local dev environment file:

```bash
cp .env.example .env
```

At minimum, set:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

See [Environment Variables](#environment-variables) for the full reference.

### 3. Start the development server

```bash
npm start
```

The app will be available at `http://localhost:3000`. The API is expected at `http://localhost:8000` by default.

### 4. Start with LAN access (mobile testing)

```bash
npm run start:lan
```

This binds the API URL to your local network IP (`192.168.1.x`) and enables verbose API logging, useful for testing on physical devices over Wi-Fi.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start development server (source maps disabled) |
| `npm run start:lan` | Start with LAN IP API URL + verbose logging enabled |
| `npm run build` | Production build (source maps disabled, ESLint errors non-blocking) |

> Source maps are disabled in all build modes (`GENERATE_SOURCEMAP=false`) to keep bundle sizes lean and avoid exposing source in production.

---

## Application Routes

### Public Routes

| Path | Page | Description |
|---|---|---|
| `/` | Marketing | Landing page |
| `/about` | About | About OneTechly / PixelPerfect |
| `/features` | Features | Feature overview |
| `/pricing` | Pricing | Subscription tiers and plans |
| `/docs` | Documentation | API reference and docs |
| `/documentation` | Documentation | Alias for `/docs` |
| `/guides` | Guides | Developer guide listing |
| `/guides/:guideId` | GuideDetail | Individual guide by ID |
| `/api` | API | API overview page |
| `/status` | ApiStatus | Live API status |
| `/api-status` | ApiStatus | Alias for `/status` |
| `/help` | HelpCenter | Help center |
| `/help-center` | HelpCenter | Alias for `/help` |
| `/faq` | FAQ | Frequently asked questions |
| `/contact` | Contact | Contact form |
| `/blog` | BlogList | Blog post index |
| `/blog/:slug` | BlogPost | Individual blog post |
| `/privacy` | Privacy | Privacy policy |
| `/terms` | Terms | Terms of service |
| `/cookies` | Cookies | Cookie policy |

### Authentication Routes (Public-only)

Authenticated users are automatically redirected to `/dashboard`.

| Path | Page | Description |
|---|---|---|
| `/login` | LoginPage | Email / username login |
| `/register` | Register | New user registration |
| `/signup` | Register | Alias for `/register` |

### Protected Routes (Authentication required)

Unauthenticated users are redirected to `/login?next=<original_path>` and returned after login.

| Path | Page | Description |
|---|---|---|
| `/dashboard` | DashboardPage | Main user dashboard |
| `/screenshot` | ScreenshotPage | Single screenshot capture |
| `/batch` | BatchJobs | Batch job management |
| `/history` | History | Screenshot history |
| `/activity` | Activity | API usage activity log |
| `/subscription` | SubscriptionPage | Plan management and billing |
| `/settings` | AccountSettings | Account settings |
| `/account-settings` | AccountSettings | Alias for `/settings` |
| `/change-password` | ChangePasswordPage | Password update form |

### Error Routes

| Path | Page | Description |
|---|---|---|
| `*` | NotFoundPage | 404 catch-all |

---

## Authentication Flow

Authentication state is managed via `AuthContext`. Tokens are stored using the key `auth_token` in `localStorage` (persistent) or `sessionStorage` (session-only).

**ProtectedRoute** — wraps all authenticated pages. Redirects to `/login?next=<path>` if no valid session is found, and restores the original destination after successful login.

**PublicRoute** — wraps login and register pages. Redirects already-authenticated users directly to `/dashboard`.

Both route guards show a loading spinner while the auth state is being resolved to prevent layout flashing or premature redirects.

---

## Feature Flags

The following features can be toggled via environment variables:

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_ENABLE_BATCH` | `true` | Enable batch screenshot UI |
| `REACT_APP_ENABLE_WEBHOOKS` | `true` | Enable webhook-related UI |
| `REACT_APP_ENABLE_WEB_SEARCH` | `false` | Reserved for future use |
| `REACT_APP_ENABLE_MEMORY` | `false` | Reserved for future use |

---

## Stripe Integration

Stripe.js is loaded via `@stripe/react-stripe-js`. The publishable key is provided at build time via environment variable and is safe to expose in the browser.

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

> Use `pk_test_...` for development and staging environments. Never use or expose your Stripe secret key on the frontend.

Checkout sessions are initiated via the backend (`POST /billing/create_checkout_session`) and redirect to Stripe-hosted checkout. On completion, users are returned to `/dashboard?checkout=success`.

---

## Environment Variables

### Local Development (`.env`)

```env
# API
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_BASE_URL=http://localhost:8000

# App metadata
REACT_APP_NAME=PixelPerfect
REACT_APP_VERSION=1.0.0
REACT_APP_BUILD_DATE=2026-01-22

# Stripe (test key — safe to commit for dev)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# API behavior
REACT_APP_API_TIMEOUT=30000
REACT_APP_API_RETRY_ATTEMPTS=3

# Screenshot defaults
REACT_APP_DEFAULT_WIDTH=1920
REACT_APP_DEFAULT_HEIGHT=1080
REACT_APP_DEFAULT_FORMAT=png
REACT_APP_DEFAULT_JPEG_QUALITY=90

# Password rules
REACT_APP_PASSWORD_MIN_LEN=8
REACT_APP_PASSWORD_MAX_LEN=128

# Feature flags
REACT_APP_ENABLE_BATCH=true
REACT_APP_ENABLE_WEBHOOKS=true
REACT_APP_ENABLE_WEB_SEARCH=false
REACT_APP_ENABLE_MEMORY=false

# Debug
REACT_APP_DEBUG=true
REACT_APP_VERBOSE_API_LOGS=true
GENERATE_SOURCEMAP=false
```

### Production (`.env.production`)

```env
# API
REACT_APP_API_URL=https://api.pixelperfectapi.net
REACT_APP_API_BASE_URL=https://api.pixelperfectapi.net

# App metadata
REACT_APP_NAME=PixelPerfect
REACT_APP_VERSION=1.0.0
REACT_APP_BUILD_DATE=2026-01-07

# Stripe (live publishable key)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Feature flags
REACT_APP_ENABLE_BATCH=true
REACT_APP_ENABLE_WEBHOOKS=true
REACT_APP_ENABLE_WEB_SEARCH=false
REACT_APP_ENABLE_MEMORY=false

# Debug
REACT_APP_DEBUG=false
REACT_APP_VERBOSE_API_LOGS=false
GENERATE_SOURCEMAP=false
```

> **Important:** All `REACT_APP_*` variables are embedded at build time and become part of the static bundle. Never place secret keys or server credentials in environment variables prefixed with `REACT_APP_`.

---

## Production Build

```bash
npm run build
```

This produces an optimized static build in the `build/` directory. The output is suitable for deployment to any static hosting provider (Render Static Site, Netlify, Vercel, S3 + CloudFront, etc.).

Key build optimizations applied:
- Source maps disabled (`GENERATE_SOURCEMAP=false`)
- ESLint errors treated as warnings (`ESLINT_NO_DEV_ERRORS=true`)
- Targets modern browsers only (no IE 11 support)

### SPA Routing on Static Hosts

This app uses React Router v6 for client-side routing. All requests must be rewritten to `index.html` at the server/CDN level. Without this, direct navigation to any route other than `/` will return a 404 from the host.

**Render (Static Site):** Set the rewrite rule to `/* → /index.html` in Render's dashboard.

**Netlify:** Create a `_redirects` file in `public/`:

```
/*  /index.html  200
```

**Apache:** Add a `.htaccess` file in the build output:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

---

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/           # Shared / reusable components
│   │   └── ErrorBoundary.js  # Top-level error boundary
│   ├── contexts/
│   │   └── AuthContext.js    # Auth state, token management
│   ├── pages/                # Route-level page components
│   │   ├── Marketing.js      # Landing page
│   │   ├── LoginPage.js
│   │   ├── Register.js
│   │   ├── DashboardPage.js
│   │   ├── ScreenshotPage.js
│   │   ├── BatchJobs.js
│   │   ├── History.js
│   │   ├── Activity.js
│   │   ├── SubscriptionPage.js
│   │   ├── AccountSettings.js
│   │   ├── BlogList.js
│   │   ├── BlogPost.js
│   │   ├── Guides.js
│   │   ├── GuideDetail.js
│   │   ├── Documentation.js
│   │   ├── Pricing.js
│   │   ├── Features.js
│   │   ├── About.js
│   │   ├── ApiStatus.js
│   │   ├── HelpCenter.js
│   │   ├── Contact.js
│   │   ├── FAQ.js
│   │   ├── Privacy.js
│   │   ├── Terms.js
│   │   ├── Cookies.js
│   │   ├── API.js
│   │   └── NotFoundPage.js
│   ├── App.js                # Route definitions and auth guards
│   └── index.js              # React DOM entry point
├── .env                      # Local development environment
├── .env.production           # Production environment
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## ESLint Configuration

Linting is configured via `package.json` and extends `react-app`:

- `no-unused-vars` — warns, ignoring variables prefixed with `_`
- `no-console` — off (console usage permitted)
- `react-hooks/exhaustive-deps` — warns
- `no-debugger` — warns
- `default-case` — off

ESLint errors are demoted to warnings during builds (`ESLINT_NO_DEV_ERRORS=true`) to prevent build failures from blocking deployments.

---

## Browser Support

| Environment | Targets |
|---|---|
| Production | >0.2% market share, not dead, not IE 11, not Opera Mini |
| Development | Latest Chrome, Firefox, Safari |

---

## License

Copyright © 2026 [OneTechly](https://pixelperfectapi.net)  
All rights reserved.

This project is proprietary software unless otherwise stated. Unauthorized copying, modification, or distribution of this software, in whole or in part, is strictly prohibited.