import { AdditionalCost } from "@/types";

interface AdditionalCostsTableProps {
  costs: AdditionalCost[];
  showSettings: boolean;
  onAdd: () => void;
  onChange: (index: number, field: "description" | "amount", value: string | number) => void;
  onDelete: (index: number) => void;
}

const AdditionalCostsTable = ({ costs, showSettings, onAdd, onChange, onDelete }: AdditionalCostsTableProps) => {
  if (costs.length === 0 && !showSettings) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-800">Additional Costs</h3>
        {showSettings && (
          <button onClick={onAdd} className="text-sm text-blue-600 hover:text-blue-800 font-medium print:hidden">
            + Add Cost
          </button>
        )}
      </div>
      {costs.length > 0 && (
        <table className="w-full text-sm">
          <tbody>
            {costs.map((cost, index) => (
              <tr key={index}>
                <td className="py-2 pr-4">
                  {showSettings ? (
                    <input type="text" value={cost.description} onChange={(e) => onChange(index, "description", e.target.value)} placeholder="Cost description" className="w-full bg-transparent focus:outline-none focus:border-blue-500"/>
                  ) : (
                    cost.description
                  )}
                </td>
                <td className="py-2 w-32 text-right">
                  {showSettings ? (
                    <input type="number" value={cost.amount} onChange={(e) => onChange(index, "amount", parseFloat(e.target.value) || 0)} className="w-24 text-right bg-transparent focus:outline-none focus:border-blue-500"/>
                  ) : (
                    `₹${cost.amount.toFixed(2)}`
                  )}
                </td>
                {showSettings && (
                  <td className="py-2 w-16 text-right print:hidden">
                    <button onClick={() => onDelete(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                      DELETE
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdditionalCostsTable;