import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface Product {
  id: number
  title: string
  price: number
  thumbnail: string
  category: string
}

interface ApiResponse {
  products: Product[]
}

const fetchProduct = async ({ queryKey }: { queryKey: [string, { search: string }] }) => {
  const [_, { search }] = queryKey

  const response = await fetch('https://dummyjson.com/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();
  let products = data.products;

  if (search && search.trim() !== "") {
    const searchTerm = search.trim().toLowerCase();
    
    products = products.filter((e: any) => 
      e.title.toLowerCase().includes(searchTerm)
    );
  }

  return {
    ...data,
    products: products
  };
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const { 
    data, 
    isPending, 
    isFetching, 
    isError, 
    isSuccess, 
    error,
    refetch 
  } = useQuery<ApiResponse, Error>({
    queryKey: ["product", { search: searchTerm }],
    queryFn: fetchProduct,
    staleTime: 30 * 1000,     
    gcTime: 5 * 60 * 1000,    
  })

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex flex-row justify-between gap-4 border-b border-gray-200 pb-5 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Product List</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()} 
            disabled={isPending || isFetching}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing...
              </>
            ) : 'Refresh Products'}
          </button>
        </div>
      </div>

      <div>
          <input type="text" className='w-3xl border-2 border-black p-3 m-5 rounded-2xl' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

      {isPending && (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading data...</p>
        </div>
      )}

      {isError && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">API Connection failure</h3>
              <p className="mt-1 text-sm text-red-700">{error.message || 'API fetching failed.'}</p>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <>
        <ul role="list" className="divide-y divide-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
          {data?.products?.map((product) => (
            <li 
              key={product.id} 
              className="relative flex items-center justify-between gap-x-6 p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex min-w-0 gap-x-4 items-center">
                <img 
                  className="h-14 w-14 flex-none rounded-lg bg-gray-50 object-cover border border-gray-100" 
                  src={product.thumbnail} 
                  alt={product.title} 
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-400 uppercase tracking-wider">
                    {product.category || 'Beauty'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <p className="text-sm font-bold leading-6 text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  )
}

export default App
