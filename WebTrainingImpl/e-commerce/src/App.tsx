import { startTransition, Suspense, useOptimistic, useRef, useState, useTransition } from 'react'
import { preconnect, prefetchDNS } from 'react-dom'
import { addToCartRequest } from './api/cart'
import { fetchProducts } from './api/products'
import ErrorBoundary from './components/ErrorBoundary'
import ProductDetails from './components/ProductDetails'
import ProductList from './components/ProductList'
import RegisterForm from './components/RegisterForm'
import UserProfile from './components/UserProfile'
import { useUser } from './context/UserContext'
import UserProvider from './context/UserProvider'
import type { Product } from './types'

function PageMeta() {
  const { user } = useUser()
  const title = user
    ? `Products for ${user.name} – Mini E-Commerce Store`
    : 'Mini E-Commerce Store – Products'
  const description = user
    ? `Browse and add products to your cart, ${user.name}.`
    : 'Browse our product catalogue, then register to start shopping.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  )
}

function Shell() {
  const { user } = useUser()
  const [cartCount, setCartCount] = useState(0)

  const [optimisticCount, addOptimisticItem] = useOptimistic(
    cartCount,
    (current: number, delta: number) => current + delta,
  )
  const [isAdding, startAdding] = useTransition()
  const [cartError, setCartError] = useState<string | null>(null)
  const [failCart, setFailCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [productsPromise, setProductsPromise] = useState(() => fetchProducts())

  preconnect('https://dummyjson.com') 
  preconnect('https://cdn.dummyjson.com') 
  prefetchDNS('https://fonts.gstatic.com')
  
  function addToCart(product: Product) {
    startAdding(async () => {
      setCartError(null)
      addOptimisticItem(1) 
      try {
        await addToCartRequest(product, { shouldFail: failCart })
        startTransition(() => setCartCount((count) => count + 1))
      } catch (error) {
        startTransition(() =>
          setCartError(error instanceof Error ? error.message : 'Could not add to cart.'),
        )
      }
    })
  }

  function focusRegisterForm() {
    nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    nameInputRef.current?.focus()
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 pb-16 sm:px-6">
      <PageMeta />

      <header className="flex items-center justify-between gap-6 py-8">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold">Flipkart</h1>
          <p className="mt-3 text-slate-600">
            Register to grab deals.
          </p>
          <p className="mt-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            Cart: {optimisticCount} {optimisticCount === 1 ? 'item' : 'items'}
            {isAdding && <span className="ml-2 text-xs font-normal opacity-70">(updating…)</span>}
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <input type="checkbox" checked={failCart} onChange={(e) => setFailCart(e.target.checked)} />
            Simulate cart API failure
          </label>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        <main className="min-w-0 flex-1">
          {selectedProduct ? (
            <ProductDetails
              product={selectedProduct}
              canBuy={user !== null}
              isAdding={isAdding}
              error={cartError}
              onAdd={addToCart}
              onBack={() => {
                setSelectedProduct(null)
                setCartError(null)
              }}
              onRequestRegister={focusRegisterForm}
            />
          ) : (
            <>
              {cartError && (
                <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900">
                  {cartError}
                </p>
              )}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Products</h2>
                <button
                  type="button"
                  onClick={() => setProductsPromise(fetchProducts({ shouldFail: true }))}
                  className="text-sm text-slate-500 underline underline-offset-2"
                >
                  Simulate load error
                </button>
              </div>

              <ErrorBoundary onReset={() => setProductsPromise(fetchProducts())}>
                <Suspense>
                  <ProductList
                    productsPromise={productsPromise}
                    canBuy={user !== null}
                    onAdd={addToCart}
                    onSelect={setSelectedProduct}
                  />
                </Suspense>
              </ErrorBoundary>
            </>
          )}
        </main>

        <aside className="w-80 shrink-0 space-y-5 sticky top-6">
          <UserProfile />
          <RegisterForm nameInputRef={nameInputRef} />
        </aside>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <UserProvider>
      <Shell />
    </UserProvider>
  )
}
