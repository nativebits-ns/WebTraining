# Modern Front-End Security – Vulnerable Starter Project

## Overview

This project is a deliberately vulnerable User Security Dashboard
created for the Modern Front-End Security Concepts training assignment.

## Technologies

- HTML
- CSS
- Vanilla JavaScript
- Node.js
- Express

## Setup

Install dependencies:

```bash
npm install
```

Start the application::

```bash
npm start
```

---

## 1. DOM-based XSS

**Vulnerable code** (`app.js`)

```js
const username = params.get("name") || window.initialUser?.name || "Guest";
app.innerHTML = `<section class="profile-card"><h2>Welcome, ${username}</h2> ...`;
```

**Why it is insecure:** `name` comes from the URL (attacker-controlled) and is
parsed as HTML by `innerHTML`. `http://localhost:3000/?name=<img src=x onerror=alert(1)>`
executes script in the application origin (session theft, actions as the user).
`/account` also interpolated values into HTML without encoding.

**Source:** `location.search` (and server data). **Sink:** `innerHTML`.

**Fix**
- `client/app.js` creates elements with `document.createElement` and sets
  `textContent`, so data is never parsed as markup. Name is length-limited.
- `server/server.js` HTML-encodes values rendered on `/account` with `escapeHtml()`.
- CSP (section 4) blocks inline handlers as a second layer.

## 2. Prototype pollution

**Vulnerable code** (`app.js` and `server.js`)

```js
for (const key in incomingSettings) {
    settings[key] = incomingSettings[key];
}
```

**Why it is insecure:** keys are copied without validation. `JSON.parse` creates an
own `__proto__` key, so `{"__proto__":{"isAdmin":true}}` makes
`settings["__proto__"] = ...` change the prototype of the object (and becomes global
pollution as soon as any recursive merge/`Object.assign` helper touches it).
`for...in` also walks inherited properties.

**Source:** JSON body of `POST /api/settings`. **Boundary:** client → server.

**Fix**
- `validateSettings()` (server) accepts only plain objects with allow-listed keys
  (`theme`, `language`, `fontSize`) and allow-listed values; any other key
  (including `__proto__`, `constructor`, `prototype`) → `400 Invalid settings.`
- The result object is built from the allow-list, using `Object.hasOwn`.
- Client `prepareSettings()` uses the same allow-list (UX only; the server is the
  authority). Body size limited to 10 KB.

## 3. SSR token leakage

**Vulnerable code** (`server.js`)

```js
const initialUserData = JSON.stringify(user);
... <script>window.initialUser = ${initialUserData};</script>
app.get("/api/profile", (req, res) => res.json(user));
```

**Why it is insecure:** the whole user object, including `sessionToken` and
`refreshToken`, is embedded in HTML and exposed via `window.initialUser`, so any XSS,
browser extension, cache or log can read it. Raw `JSON.stringify` inside `<script>` is
also an injection vector (`</script>` in a value).

**Boundary:** server → client serialisation.

**Fix**
- `toPublicUser()` exposes only `id, name, email, role` (page and `/api/profile`).
- Data is delivered in `<script type="application/json" id="initial-user">`, serialised
  with `serializeForHtml()` (escapes `<`, `>`, `&`, U+2028/2029).
- Session token is sent as `HttpOnly; SameSite=Strict` cookie (`Secure` in production),
  unreadable by JavaScript. Refresh token is never sent to the browser.

## 4. Content Security Policy

**Vulnerable code:** no CSP; inline `<script>` and `<style>` in server templates.

**Why it is insecure:** if any injection is missed, the browser will happily run it.

**Fix** (`securityHeaders` middleware, applied to every response)

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';
  img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
  base-uri 'none'; form-action 'self'; frame-ancestors 'none'
```

Inline script/style on `/` and `/account` were moved to `client/account.js` and
`client/account.css`; no `unsafe-inline` / `unsafe-eval`. Extra headers:
`X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
`Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `Permissions-Policy`,
and `X-Powered-By` removed.

## 5. Clickjacking

**Vulnerable code:** `/account` (with the "Delete Account" button) had no framing
restrictions, so `iframe-test.html` could embed it and overlay it with a decoy UI.

**Boundary:** another origin framing our page.

**Fix:** `Content-Security-Policy: frame-ancestors 'none'` (modern) plus
`X-Frame-Options: DENY` (legacy), sent on all responses.