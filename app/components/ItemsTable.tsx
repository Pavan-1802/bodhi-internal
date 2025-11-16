import { useState } from "react";
import { Costing } from "@/types";

interface ItemsTableProps {
  items: Costing[];
  showSettings: boolean;
  onItemChange: (id: number, field: keyof Costing, value: string) => void;
}

const ItemsTable = ({ items, showSettings, onItemChange }: ItemsTableProps) => {
  const [editingProfit, setEditingProfit] = useState<number | null>(null);

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-0">#</th>
                <th scope="col" className="py-3.5 px-3 text-left">Description</th>
                <th scope="col" className="py-3.5 px-3 text-center">Qty</th>
                {showSettings && <th scope="col" className="py-3.5 px-3 text-center print:hidden">Margin</th>}
                <th scope="col" className="py-3.5 px-3 text-center">Tax %</th>
                <th scope="col" className="py-3.5 px-3 text-right">Unit Price</th>
                <th scope="col" className="py-3.5 pl-3 pr-4 text-right sm:pr-0">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {items.map((item, index) => {
                const costWithProfit = (item.total_cost || 0) * (1 + (item.profit_percent || 0) / 100);
                const pricePerUnit = costWithProfit;
                const lineTotal = pricePerUnit * (item.quantity || 0) * (1 + (item.tax_percent || 0) / 100);

                return (
                  <tr key={item.id} className="text-sm text-gray-700 even:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">{index + 1}</td>
                    <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">{item.item_name}</td>
                    <td className="whitespace-nowrap py-4 px-3 text-center">
                      {showSettings ? (
                        <input type="number" value={item.quantity} onChange={(e) => onItemChange(item.id, "quantity", e.target.value)} className="w-16 text-center bg-transparent border-b focus:outline-none focus:border-blue-500"/>
                      ) : (
                        item.quantity
                      )}
                    </td>
                    {showSettings && (
                      <td className="whitespace-nowrap py-4 px-3 text-center print:hidden">
                        {editingProfit === item.id ? (
                          <input type="number" value={item.profit_percent} onChange={(e) => onItemChange(item.id, "profit_percent", e.target.value)} onBlur={() => setEditingProfit(null)} className="w-16 text-center bg-transparent border-b focus:outline-none focus:border-blue-500" autoFocus />
                        ) : (
                          <span onClick={() => setEditingProfit(item.id)} className="cursor-pointer hover:text-blue-600">{item.profit_percent}%</span>
                        )}
                      </td>
                    )}
                     <td className="whitespace-nowrap py-4 px-3 text-center">
                       <input type="number" value={item.tax_percent} onChange={(e) => onItemChange(item.id, "tax_percent", e.target.value)} className="w-16 text-center bg-transparent print:border-white  border-b focus:outline-none focus:border-blue-500"/>
                    </td>
                    <td className="whitespace-nowrap py-4 px-3 text-right">₹{pricePerUnit.toFixed(2)}</td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right font-medium text-gray-900 sm:pr-0">₹{lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsTable;