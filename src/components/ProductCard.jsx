import { ShoppingCart } from 'lucide-react'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
      {product.image && (
        <div className="aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-[2.5rem]">{product.description || 'No description'}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
            <p className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</p>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition"
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
