## How `use()` is implemented
`src/components/ProductList.tsx` calls `use(productsPromise)`. The Promise comes from `fetchProducts()` (`src/api/products.ts`), which calls `https://dummyjson.com/products` and maps the response to our `Product` type and is created once in `App` with `useState(() => fetchProducts())`, so its identity is stable across renders. While pending, `use()` suspends the component; if the Promise rejects, the error is thrown to the nearest error boundary. `useUser()` also uses `use(UserContext)` to read context.

## How `<Suspense>` is implemented
In `App.tsx`, `<ProductList>` is wrapped in `<Suspense fallback={<ProductListSkeleton />}>`. The skeleton grid shows while the request is in flight. An `ErrorBoundary` sits outside the `Suspense` and renders an error message with a **Try again** button, which creates a fresh Promise.

## How `useActionState()` is implemented
`RegisterForm` uses `useActionState<RegisterState, FormData>(action, initialState)`. The action receives the previous state and the submitted `FormData`, validates the values (`src/validation.ts`), awaits the simulated request (`src/api/register.ts`, `setTimeout`) and returns the next state: field errors, an error or success message and the values to keep in the inputs. The returned `formAction` is passed to `<form action={formAction}>`. There is no `onSubmit`.

## Hiw `useFormStatus()` is implemented
Called in child components of the form (it only reads the status of its parent `<form>`): `SubmitButton` disables itself and shows a spinner and “Creating account…” while pending and each `Field` makes its input read-only during submission.

## How Context is implemented using React 19 syntax
`src/context/UserContext.ts` defines `UserContext` with `createContext`. `UserProvider` renders `<UserContext value={{ user, setUser }}>` directly, without `.Provider`. After a successful registration `RegisterForm` calls `setUser` and `UserProfile` (a separate component) displays the user. The password is never stored.

## Which Asset Loading APIs were selected and why
All four APIs are called in `App` and are deduplicated by React:

| API | Resource | Why |
| --- | --- | --- |
| `preconnect('https://dummyjson.com')` | Product API | The `fetch` fires right after mount; opening DNS, TCP and TLS early removes connection setup from the critical path. |
| `preconnect('https://cdn.dummyjson.com')` | Product thumbnails | Images load from this CDN as soon as data arrives, so the connection is ready before the first `<img>` request. |
| `prefetchDNS('https://fonts.gstatic.com')` | Font files | Font files are requested only after the CSS is parsed, so only the cheap DNS lookup is done early rather than a full connection. |

## How Document Metadata is implemented
`PageMeta` in `App.tsx` renders `<title>` and `<meta name="description">` as normal JSX. React 19 hoists them into `<head>` and updates them when state changes: the default is “Mini E-Commerce Store – Products” and after registration it becomes “Products for {name} – Mini E-Commerce Store”.

---

## What React Compiler does
React Compiler (`babel-plugin-react-compiler`, enabled in `vite.config.ts` through `reactCompilerPreset()`) is a build-time step that analyses components and hooks and automatically memoizes values, JSX and functions where it's safe. It removes the need to write `useMemo`, `useCallback` and `React.memo` by hand, while following the Rules of React.

**How it helps here:**
- `Shell` re-renders on every cart or optimistic change. The compiler memoizes the unchanged parts of the tree (e.g. `<UserProfile />`, `<RegisterForm nameInputRef=... />`, header text), so they don't re-render when only the cart count changes.
- `ProductList` renders 12 cards. `addToCart` and `setSelectedProduct` change identity on each render of `Shell`, which would defeat `React.memo` on a card; the compiler stabilises them and skips re-rendering cards whose `product` is unchanged.
- **Example:** `observeImage` in `ProductDetails` is wrapped in `useCallback` so its identity is stable and React doesn't run the ref cleanup/re-attach the `ResizeObserver` on every render. With the compiler enabled this manual `useCallback` is optional, because the compiler memoizes the function itself. (It is kept to make the ref behaviour explicit and to keep it correct even if the compiler is switched off.)
