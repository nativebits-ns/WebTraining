# Mini E-Commerce Store (React 19 + TypeScript)

Run: `npm install && npm run dev`.

> Delete the static `<title>` (and any description `<meta>`) from `index.html`. React 19 hoists its own into `<head>`, and a leftover static `<title>` would appear first and win.

Error state: use **Simulate load error** above the grid, then **Try again** (a real network or HTTP failure takes the same path). Register with `taken@example.com` to see a server-side error.

## `use()`
`src/components/ProductList.tsx` calls `use(productsPromise)`. The Promise comes from `fetchProducts()` (`src/api/products.ts`), which calls `https://dummyjson.com/products` and maps the response to our `Product` type and is created once in `App` with `useState(() => fetchProducts())`, so its identity is stable across renders. While pending, `use()` suspends the component; if the Promise rejects, the error is thrown to the nearest error boundary. `useUser()` also uses `use(UserContext)` to read context.

## `<Suspense>`
In `App.tsx`, `<ProductList>` is wrapped in `<Suspense fallback={<ProductListSkeleton />}>`. The skeleton grid shows while the request is in flight. An `ErrorBoundary` sits outside the `Suspense` and renders an error message with a **Try again** button, which creates a fresh Promise.

## `useActionState()`
`RegisterForm` uses `useActionState<RegisterState, FormData>(action, initialState)`. The action receives the previous state and the submitted `FormData`, validates the values (`src/validation.ts`), awaits the simulated request (`src/api/register.ts`, `setTimeout`), and returns the next state: field errors, an error or success message, and the values to keep in the inputs. The returned `formAction` is passed to `<form action={formAction}>`. There is no `onSubmit`.

## `useFormStatus()`
Called in child components of the form (it only reads the status of its parent `<form>`): `SubmitButton` disables itself and shows a spinner and “Creating account…” while pending, and each `Field` makes its input read-only during submission.

## Context (React 19 syntax)
`src/context/UserContext.ts` defines `UserContext` with `createContext`. `UserProvider` renders `<UserContext value={{ user, setUser }}>` directly, without `.Provider`. After a successful registration `RegisterForm` calls `setUser`, and `UserProfile` (a separate component) displays the user. The password is never stored.

## Asset Loading APIs (`react-dom`)
All four APIs are called in `App` and are deduplicated by React:

| API | Resource | Why |
| --- | --- | --- |
| `preconnect('https://dummyjson.com')` | Product API | The `fetch` fires right after mount; opening DNS, TCP and TLS early removes connection setup from the critical path. |
| `preconnect('https://cdn.dummyjson.com')` | Product thumbnails | Images load from this CDN as soon as data arrives, so the connection is ready before the first `<img>` request. |
| `preload('/hero.png', { as: 'image', fetchPriority: 'high' })` | Hero image | A known, above-the-fold file; preloading starts the download before the layout discovers it. |
| `preinit(FONT_CSS, { as: 'style' })` | Google Fonts stylesheet | The stylesheet is render-blocking for the font anyway; `preinit` fetches and applies it immediately instead of waiting for a `<link>`. |
| `prefetchDNS('https://fonts.gstatic.com')` | Font files | Font files are requested only after the CSS is parsed, so only the cheap DNS lookup is done early rather than a full connection. |

## Document Metadata
`PageMeta` in `App.tsx` renders `<title>` and `<meta name="description">` as normal JSX. React 19 hoists them into `<head>` and updates them when state changes: the default is “Mini E-Commerce Store – Products”, and after registration it becomes “Products for {name} – Mini E-Commerce Store”.
