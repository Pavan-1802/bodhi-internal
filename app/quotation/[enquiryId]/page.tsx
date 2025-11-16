"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { Costing } from "@/types";

export default function QuotationPage({
  params,
}: {
  params: Promise<{ enquiryId: string }>;
}) {
  const { enquiryId } = use(params);
  const [items, setItems] = useState<Costing[]>([]);
  const [editingProfit, setEditingProfit] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  const [customerAddress, setCustomerAddress] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchQuotation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quotation/${enquiryId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      const data = await response.json();
      console.log(JSON.stringify(data));
      setItems(data.items);
      setCustomerName(data.customer_name);
      setCustomerPhone(data.customer_phone);
      setCustomerAddress(data.customer_address);
      if (data.items.length === 0) {
        toast.error("No items found in this quotation.");
        router.back();
      }
    } catch (error) {
      toast.error("Error fetching quotation.");
      console.error("Error fetching quotation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, []);

  const handleItemChange = (
    id: number,
    field: keyof Costing,
    value: string
  ) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    if (isNaN(numericValue)) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: numericValue } : item
      )
    );
  };

  const handlePrint = async() => {
    setShowSettings(false)
    const response = await fetch(`/api/quotation/${enquiryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || "Failed to update quotation.");
      return;
    } else {
      window.print();
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const calculateTotals = () => {
    let subTotal = 0;
    let totalTax = 0;

    items.forEach((item) => {
      const quantity = item.quantity || 0;
      const cost = item.total_cost || 0;
      const profitPercent = item.profit_percent || 0;
      const taxPercent = item.tax_percent || 0;

      const costWithProfit = cost * (1 + profitPercent / 100);
      const taxAmountForLine = costWithProfit * (taxPercent / 100) * quantity;

      subTotal += costWithProfit * quantity;
      totalTax += taxAmountForLine;
    });

    const grandTotal = subTotal + totalTax;
    return { subTotal, totalTax, grandTotal };
  };

  const { subTotal, totalTax, grandTotal } = calculateTotals();

  if (loading) return <LoadingSpinner />;

  return (
    <>
          <Navbar />
      <div className="bg-gray-200 min-h-screen">
        <div
          className="max-w-[210mm] bg-white shadow-md mx-auto"
          style={{ minHeight: "297mm" }}
        >
          <div className="p-16">
            <div className="mb-12">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    QUOTATION
                  </h1>
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Date: {today}</p>
                    <p className="font-medium">
                      Quotation No: QT-{enquiryId}
                    </p>
                    <p className="font-medium">
                      Valid Until: 30 days from date
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex justify-end">
                  <img
                    src='/logo.png'
                    alt="Bodhi Creations Logo"
                    className="h-16 w-auto"
                  />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Moozhikulam, Kurumassery, Ernakulam District 683579
                  </p>
                  <p className="text-sm text-gray-600">Phone: +919496279486</p>
                  <p className="text-sm text-gray-600">
                    Email: bodhicreations08@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-10 pb-6 border-b">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                QUOTATION FOR:
              </h3>
              <div className="text-sm text-gray-800">
                <p>{customerName}</p>
                <p>Phone: +91 {customerPhone}</p>
                <p>Address: {customerAddress}</p>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-sm text-blue-600 print:hidden hover:text-blue-800 underline"
              >
                {showSettings ? "Hide" : "Show"} Edit Options
              </button>
            </div>
            
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-3 text-sm font-semibold text-gray-800">
                    SL.
                  </th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-800">
                    DESCRIPTION
                  </th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-800">
                    QTY
                  </th>
                  {showSettings && (
                    <>
                      <th className="text-center print:hidden py-3 text-sm font-semibold text-gray-800">
                        MARGIN
                      </th>
                    </>
                  )}
                  <th className="text-center py-3 text-sm font-semibold text-gray-800">
                    TAX
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-800">
                    UNIT PRICE
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-800">
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const quantity = item.quantity || 1;
                  const cost = item.total_cost || 0;
                  const profitPercent = item.profit_percent || 0;
                  const taxPercent = item.tax_percent || 0;

                  const costWithProfit = cost * (1 + profitPercent / 100);
                  const pricePerUnit = costWithProfit * (1 + taxPercent / 100);
                  const lineTotal = pricePerUnit * quantity;

                  return (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-4 text-sm text-gray-700">
                        {index + 1}.
                      </td>
                      <td className="py-4 text-sm text-gray-800 pr-4">
                        {item.item_name}
                      </td>
                      <td className="py-4 text-center">
                        {showSettings ? (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-16 text-center text-sm border-b print:border-white border-gray-300 focus:border-blue-500 focus:outline-none"
                          />
                        ) : (
                          <span className="text-sm text-gray-700">
                            {quantity}
                          </span>
                        )}
                      </td>
                      {showSettings && (
                        <>
                          <td className="py-4 text-center print:hidden">
                            {editingProfit === item.id ? (
                              <input
                                type="number"
                                value={item.profit_percent}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "profit_percent",
                                    e.target.value
                                  )
                                }
                                onBlur={() => setEditingProfit(null)}
                                className="w-16 text-center text-sm border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                autoFocus
                              />
                            ) : (
                              <span
                                onClick={() => setEditingProfit(item.id)}
                                className="text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                              >
                                {profitPercent}%
                              </span>
                            )}
                          </td>
                        </>
                      )}
                      <td className="py-4 text-center">
                        <input
                          type="number"
                          value={item.tax_percent}
                          onChange={(e) =>
                            handleItemChange(item.id, "tax_percent", e.target.value)
                          }
                          className="w-16 text-center text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-4 text-right text-sm text-gray-700">
                        ₹{pricePerUnit.toFixed(2)}
                      </td>
                      <td className="py-4 text-right text-sm font-medium text-gray-800">
                        ₹{lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end mb-12">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-800">
                    ₹{subTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium text-gray-800">
                    ₹{totalTax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-3 mt-2">
                  <span className="text-lg font-bold text-gray-900">TOTAL</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                TERMS & CONDITIONS
              </h3>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>Payment terms: 50% advance, 50% on delivery</li>
                <li>
                  Delivery timeline: Within 30 working days from order
                  confirmation
                </li>
                <li>
                  Prices are exclusive of any additional charges unless
                  specified
                </li>
                <li>
                  This quotation is valid for 30 days from the date of issue
                </li>
                <li>All disputes are subject to local jurisdiction</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex justify-center gap-4 print:hidden">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
              >
                Print Quotation
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
