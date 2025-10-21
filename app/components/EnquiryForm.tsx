"use client";
import { useEffect, useState } from "react";
import { Enquiry } from "@/types";

export default function EnquiryForm({ enquiry, onClose, onSubmit }: { enquiry: Enquiry, onClose: () => void, onSubmit: (data: { customer_name: string; customer_phone: string; description: string; deadline: string; status: string }) => void }) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState(enquiry.customer_phone || '');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(enquiry.deadline || '');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            customer_name: customerName,
            customer_phone: customerPhone,
            description: description,
            deadline: deadline,
            status: enquiry.status || 'pending'
        });
    }
    useEffect(() => {
        if (enquiry) {
            console.log(JSON.stringify(enquiry));
            setCustomerName(enquiry.customer_name);
            setDescription(enquiry.description);
            const formattedDeadline = enquiry.deadline ? new Date(enquiry.deadline).toISOString().split('T')[0] : '';
            setDeadline(formattedDeadline);
        }
    }, [enquiry]);
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {enquiry.id ? 'Edit Enquiry' : 'New Enquiry'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name
                        </label>
                        <input
                            id="customerName"
                            type="text"
                            placeholder="Enter customer name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Phone
                        </label>
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="px-3 py-2 w-max items-center rounded-md text-gray-700">
                                +91
                            </div>
                            <input
                                id="customerPhone"
                                type="tel"
                                placeholder="Enter customer phone"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone((e.target.value))}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-colors"
                            />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Enter enquiry description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                            Deadline
                        </label>
                        <input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {enquiry.id ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}