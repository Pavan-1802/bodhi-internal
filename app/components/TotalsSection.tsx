interface TotalsSectionProps {
  subTotal: number;
  totalTax: number;
  grandTotal: number;
}

const TotalsSection = ({ subTotal, totalTax, grandTotal }: TotalsSectionProps) => {
  return (
    <div className="mt-8 flex justify-end">
      <div className="w-full max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-gray-800 font-medium">₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total Tax</span>
          <span className="text-gray-800 font-medium">₹{totalTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-200">
          <span className="text-base font-bold text-gray-900">Total</span>
          <span className="text-base font-bold text-gray-900">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;