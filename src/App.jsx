import { useEffect, useMemo, useState } from 'react'
import ProductCard from './components/ProductCard'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [cart, setCart] = useState({})

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (category) params.append('category', category)
      const res = await fetch(`${backend}/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const seedIfEmpty = async () => {
    try {
      const res = await fetch(`${backend}/api/products`)
      const data = await res.json()
      if (Array.isArray(data) && data.length === 0) {
        await fetch(`${backend}/api/products/seed`, { method: 'POST' })
        await fetchProducts()
      }
    } catch {}
  }

  useEffect(() => {
    fetchProducts()
    seedIfEmpty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const id = setTimeout(() => fetchProducts(), 300)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category])

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category))
    return ['All', ...Array.from(set)]
  }, [products])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev[product.id] || { ...product, qty: 0 }
      return { ...prev, [product.id]: { ...existing, qty: existing.qty + 1 } }
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const subtotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <a href="/" className="font-bold text-xl">ShopX</a>
          <div className="flex-1 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-100 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value === 'All' ? '' : e.target.value)}
              className="bg-gray-100 rounded-lg px-3 py-2"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <a href="/test" className="text-sm text-blue-600 hover:underline">Backend Test</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border">
              <p className="text-gray-600">No products found. Try different filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />)
              )}
            </div>
          )}
        </section>

        <aside className="md:col-span-1">
          <div className="bg-white rounded-xl border p-4 sticky top-20">
            <h2 className="font-semibold text-lg">Your Cart</h2>
            {Object.keys(cart).length === 0 ? (
              <p className="text-gray-500 mt-4">Cart is empty.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {Object.values(cart).map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.qty} x ${item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-600">Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 border-t pt-4 flex items-center justify-between">
              <p className="font-semibold">Subtotal</p>
              <p className="font-bold">${subtotal.toFixed(2)}</p>
            </div>
            <button
              disabled={Object.keys(cart).length === 0}
              onClick={() => alert('Checkout coming soon')}
              className="mt-4 w-full bg-blue-600 disabled:bg-gray-300 text-white rounded-lg py-2"
            >
              Checkout
            </button>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
