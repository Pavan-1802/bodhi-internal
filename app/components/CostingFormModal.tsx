import { Costing, LineItem } from "@/types";
import { useState, useEffect } from "react";

interface CostingFormModalProps {
  onConfirm: (costing: Costing) => void;
  onCancel: () => void;
  costing?: Costing;
}

export default function CostingFormModal({
  onConfirm,
  onCancel,
  costing,
}: CostingFormModalProps) {
  const [itemName, setItemName] = useState(costing?.item_name || "");
  const [lineItems, setLineItems] = useState<LineItem[]>(
    costing?.line_items || [{ item: "", quantity_description: "", price: 0 }]
  );

  useEffect(() => {
    if (costing) {
      setItemName(costing.item_name);
      setLineItems(costing.line_items);
    }
  }, [costing]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { item: "", quantity_description: "", price: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  };

  const handleSubmit = () => {
    const costingData: Costing = {
      ...costing,
      item_name: itemName,
      line_items: lineItems,
      total_cost: calculateTotal(),
    } as Costing;
    onConfirm(costingData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {costing ? "Edit Costing" : "Create New Costing"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Line Items
              </label>
              <button
                onClick={addLineItem}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Line Item
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((lineItem, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-md space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-gray-600">
                      Line Item {index + 1}
                    </span>
                    {lineItems.length > 1 && (
                      <button
                        onClick={() => removeLineItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={lineItem.item}
                    onChange={(e) =>
                      updateLineItem(index, "item", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Item description"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={lineItem.quantity_description}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "quantity_description",
                          e.target.value
                        )
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Quantity"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={lineItem.price}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Price"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total Cost:
              </span>
              <span className="text-xl font-bold text-blue-600">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md"
          >
            {costing ? "Update" : "Create"} Costing
          </button>
        </div>
      </div>
    </div>
  );
}
