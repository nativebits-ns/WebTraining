import { Suspense, useState } from 'react'
import { preconnect, prefetchDNS } from 'react-dom'
import { fetchProducts } from './api/products'
import ErrorBoundary from './components/ErrorBoundary'
import ProductList from './components/ProductList'
import RegisterForm from './components/RegisterForm'
import UserProfile from './components/UserProfile'
import { useUser } from './context/UserContext'
import UserProvider from './context/UserProvider'

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
  const [productsPromise, setProductsPromise] = useState(() => fetchProducts())

  preconnect('https://dummyjson.com') 
  preconnect('https://cdn.dummyjson.com') 
  prefetchDNS('https://fonts.gstatic.com')
  
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
            Cart: {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        <main>
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
                onAdd={() => setCartCount((count) => count + 1)}
              />
            </Suspense>
          </ErrorBoundary>
        </main>

        <aside className="w-80 shrink-0 space-y-5 sticky top-6">
          <UserProfile />
          <RegisterForm />
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
