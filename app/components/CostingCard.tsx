import { Costing } from "@/types"

interface CostingCardProps {
  costing: Costing
  selectCosting: (costing: Costing) => void
  onDelete: (id: number) => void
}

export default function CostingCard({ costing, selectCosting, onDelete }: CostingCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-medium text-gray-900">{costing.item_name}</h3>
        <p className="text-xl font-semibold text-blue-600 mt-1">
          ₹{costing.total_cost.toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => selectCosting(costing)}
          className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          View / Edit
        </button>
        <button
          onClick={() => onDelete(costing.id)}
          className="flex-1 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
