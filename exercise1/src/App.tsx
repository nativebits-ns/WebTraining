import { useEffect, useState } from 'react'
import DashboardHeader from './components/DashboardHeader.tsx'
import ProductGrid from './components/ProductGrid.tsx'
import Sidebar from './components/Sidebar.tsx'
import { products } from './data/products.ts'

const SIDEBAR_ID = 'app-sidebar'

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-zinc-50/70 font-sans text-zinc-900 antialiased">
      <Sidebar id={SIDEBAR_ID} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-zinc-900">Shopping</span>
          </div>
        </div>

        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <DashboardHeader productCount={products.length} />
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  )
}

export default App