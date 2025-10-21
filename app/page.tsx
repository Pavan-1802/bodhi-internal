"use client";
import { Enquiry } from "@/types";
import { useEffect, useState } from "react";
import EnquiryCard from "./components/EnquiryCard"; // <-- CHANGED
import EnquiryForm from "./components/EnquiryForm";
import ConfirmationModal from "./components/ConfirmationModal";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import { Plus, Search, FileX } from "lucide-react";

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "prepared"
  >("all");

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/enquiries");
        const data = await response.json();
        setEnquiries(data);
      } catch (error) {
        console.error("Failed to fetch enquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (enquiry.customer_phone &&
        enquiry.customer_phone.includes(searchTerm)) ||
      enquiry.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filterStatus === "all") {
      return matchesSearch;
    }
    return matchesSearch && enquiry.status === filterStatus;
  });
  
  const handleEditEnquiry = (enquiry: Enquiry) => setSelectedEnquiry(enquiry);
  const handleCreateEnquiry = () => { /* ... */ };
  const handleDeleteEnquiry = async (id: number) => { /* ... */ };
  const handleSubmitEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'created_at'>) => { /* ... */ };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Enquiries</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all customer enquiries from one place.
            </p>
          </div>
          <button
            onClick={handleCreateEnquiry}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Enquiry
          </button>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "pending" | "prepared")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="prepared">Prepared</option>
            </select>
          </div>
        </div>

        {/* --- NEW LAYOUT: Replaces the entire <table> structure --- */}
        <div className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : filteredEnquiries.length > 0 ? (
            <div className="space-y-4">
              {filteredEnquiries.map((enquiry) => (
                <EnquiryCard
                  key={enquiry.id}
                  enquiry={enquiry}
                  onEdit={() => handleEditEnquiry(enquiry)}
                  onDelete={() => setEnquiryToDelete(enquiry)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 border-2 border-dashed border-gray-200 rounded-lg">
              <FileX className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No Enquiries Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you are looking for.
              </p>
            </div>
          )}
        </div>
      </main>

      {selectedEnquiry && (
        <EnquiryForm
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onSubmit={handleSubmitEnquiry}
        />
      )}

      {enquiryToDelete && (
        <ConfirmationModal
          message={`Are you sure you want to delete the enquiry for "${enquiryToDelete.customer_name}"?`}
          onConfirm={() => handleDeleteEnquiry(enquiryToDelete.id)}
          onCancel={() => setEnquiryToDelete(null)}
        />
      )}
    </div>
  );
}