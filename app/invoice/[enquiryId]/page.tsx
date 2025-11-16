"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import InvoiceHeader from "@/app/components/InvoiceHeader";
import ItemsTable from "@/app/components/ItemsTable";
import AdditionalCostsTable from "@/app/components/AdditionalCostsTable";
import TotalsSection from "@/app/components/TotalsSection";
import TermsAndActions from "@/app/components/TermsAndActions";

import { Costing, AdditionalCost, Customer } from "@/types";

export default function QuotationPage({
  params,
}: {
  params: Promise<{ enquiryId: string }>;
}) {
  const { enquiryId } = use(params);
  const router = useRouter();

  const [items, setItems] = useState<Costing[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([
    { description: "", amount: 0 },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await fetch(`/api/invoices/${enquiryId}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch quotation.");
        }
        const data = await response.json();

        if (data.items.length === 0) {
          toast.error("No items found in this quotation.");
          router.back();
          return;
        }
        console.log(JSON.stringify(data))
        setItems(data.items);
        setCustomer(data.customer);
        setAdditionalCosts(data.additional_costs || []);
      } catch (error) {
        console.error("Error fetching quotation");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [enquiryId, router]);

  const handleItemChange = (id: number, field: keyof Costing, value: string) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    if (isNaN(numericValue)) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: numericValue } : item
      )
    );
  };
  
  const handleAdditionalCostChange = (index: number, field: "description" | "amount", value: string | number) => {
    setAdditionalCosts((currentCosts) =>
      currentCosts.map((cost, i) =>
        i === index ? { ...cost, [field]: value } : cost
      )
    );
  };

  const handleAddAdditionalCost = () => {
    setAdditionalCosts([...additionalCosts, { description: "", amount: 0 }]);
  };

  const handleDeleteAdditionalCost = (index: number) => {
    setAdditionalCosts((currentCosts) => currentCosts.filter((_, i) => i !== index));
  };
  
  const handlePrint = async () => {
    setShowSettings(false)
    setSubmitLoading(true)
    try {
        const itemsUpdateResponse = await fetch(`/api/quotation/${enquiryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        });

        if (!itemsUpdateResponse.ok) {
            const error = await itemsUpdateResponse.json();
            setSubmitLoading(false)
            throw new Error(error.message || "Failed to update quotation items.");
        }

        const costsUpdateResponse = await fetch(`/api/invoices/${enquiryId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ additionalCosts }),
        });

        if (!costsUpdateResponse.ok) {
            const error = await costsUpdateResponse.json();
            throw new Error(error.message || "Failed to update additional costs.");
        }
        toast.success("Quotation updated successfully!");
        setSubmitLoading(false)
        window.print();
    } catch (error) {
        console.error("Error during print");
    }
  };


  const calculateTotals = () => {
    const subTotal = items.reduce((acc, item) => {
      const costWithProfit = (item.total_cost || 0) * (1 + (item.profit_percent || 0) / 100);
      return acc + costWithProfit * (item.quantity || 0);
    }, 0);

    const totalTax = items.reduce((acc, item) => {
      const costWithProfit = (item.total_cost || 0) * (1 + (item.profit_percent || 0) / 100);
      const taxAmount = costWithProfit * ((item.tax_percent || 0) / 100);
      return acc + taxAmount * (item.quantity || 0);
    }, 0);

    const additionalCostsTotal = additionalCosts.reduce((acc, cost) => acc + (cost.amount || 0), 0);
    
    const grandTotal = subTotal + totalTax + additionalCostsTotal;
    
    return { subTotal, totalTax, grandTotal };
  };

  const { subTotal, totalTax, grandTotal } = calculateTotals();

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 print:bg-white print:p-0">
        <div
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-sm"
          style={{ maxWidth: "210mm", minHeight: "297mm" }}
        >
          <div className="p-8 sm:p-12 md:p-16">
            <InvoiceHeader enquiryId={enquiryId} customer={customer} />
            
            <div className="my-4 flex justify-end print:hidden">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showSettings ? "Hide Edit Options" : "Show Edit Options"}
              </button>
            </div>

            <ItemsTable 
              items={items}
              showSettings={showSettings}
              onItemChange={handleItemChange}
            />

            <AdditionalCostsTable
              costs={additionalCosts}
              showSettings={showSettings}
              onAdd={handleAddAdditionalCost}
              onChange={handleAdditionalCostChange}
              onDelete={handleDeleteAdditionalCost}
            />

            <TotalsSection 
              subTotal={subTotal}
              totalTax={totalTax}
              grandTotal={grandTotal}
            />

            <TermsAndActions onPrint={handlePrint} buttonDisabled={submitLoading}/>
          </div>
        </div>
      </main>
    </>
  );
}