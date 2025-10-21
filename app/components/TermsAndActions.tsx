interface TermsAndActionsProps {
  onPrint: () => void;
}

const TermsAndActions = ({ onPrint }: TermsAndActionsProps) => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="mb-10">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Terms & Conditions
        </h3>
        <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside">
          <li>Payment terms: 50% advance, 50% on delivery.</li>
          <li>Delivery timeline: Within 30 working days from order confirmation.</li>
          <li>This quotation is valid for 30 days from the date of issue.</li>
          <li>All disputes are subject to local jurisdiction.</li>
        </ol>
      </div>
      
      <div className="mt-12 text-center print:hidden">
        <button
          onClick={onPrint}
          className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Save & Print Invoice
        </button>
      </div>
    </div>
  );
};

export default TermsAndActions;