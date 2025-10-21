import { Customer } from "@/types";

interface InvoiceHeaderProps {
  enquiryId: string;
  customer: Customer | null;
}

const InvoiceHeader = ({ enquiryId, customer }: InvoiceHeaderProps) => {
  const today = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="pb-8 border-b-2 border-gray-100">
      <div className="flex justify-between items-start">
        {/* Left Side: Invoice Title and Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>Date: <span className="font-medium text-gray-700">{today}</span></p>
            <p>Invoice No: <span className="font-medium text-gray-700">INV-{enquiryId}</span></p>
          </div>
        </div>
        {/* Right Side: Company Logo and Details */}
        <div className="text-right">
          <img src="/logo.png" alt="Company Logo" className="h-14 w-auto ml-auto" />
          <div className="mt-2 text-xs text-gray-500">
            <p className="font-bold text-gray-600">Bodhi Creations</p>
            <p>Moozhikulam, Kurumassery</p>
            <p>Ernakulam, 683579</p>
            <p>+91 9496279486</p>
          </div>
        </div>
      </div>
      {/* Customer Information */}
      <div className="mt-10">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Billed To</h3>
        <div className="text-sm text-gray-800">
          <p className="font-medium">{customer?.customer_name}</p>
          <p>+91 {customer?.customer_phone}</p>
        </div>
      </div>
    </header>
  );
};

export default InvoiceHeader;