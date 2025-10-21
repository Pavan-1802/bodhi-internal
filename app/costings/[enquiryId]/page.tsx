"use client";
import { Costing } from "@/types";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { use } from "react";
import toast from "react-hot-toast";
import { PlusIcon, File } from "lucide-react";
import CostingCard from "@/app/components/CostingCard";
import CostingFormModal from "@/app/components/CostingFormModal";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import Link from "next/link";

export default function CreateCosting({
  params,
}: {
  params: Promise<{ enquiryId: string }>;
}) {
  const { enquiryId } = use(params);
  const [costings, setCostings] = useState<Costing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCosting, setSelectedCosting] = useState<Costing>({
    id: 0,
    enquiry_id: 0,
    item_name: "",
    line_items: [],
    total_cost: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [costingToDelete, setCostingToDelete] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  const selectCosting = (costing: Costing) => {
    setSelectedCosting(costing);
    setShowModal(true);
  };

  const onCancel = () => {
    setSelectedCosting({
      id: 0,
      enquiry_id: 0,
      item_name: "",
      line_items: [],
      total_cost: 0,
    });
    setShowModal(false);
  };

  const onConfirm = async (costing: Costing) => {
    setIsLoading(true);
    const url = selectedCosting.id
      ? "/api/costings"
      : `/api/costings/${enquiryId}`;
    const method = selectedCosting.id ? "PUT" : "POST";
    const body = {
      ...(selectedCosting.id && { id: costing.id, enquiryId }),
      item_name: costing.item_name,
      line_items: costing.line_items,
      total_cost: costing.total_cost,
    };
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setSelectedCosting({
          id: 0,
          enquiry_id: 0,
          item_name: "",
          line_items: [],
          total_cost: 0,
        });
        setShowModal(false);
        toast.success(
          selectedCosting.id
            ? "Update Successful"
            : "Costing creation successful"
        );
        fetchCostings();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCostingToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setCostingToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    if (costingToDelete === null) return;
    try {
      const response = await fetch("/api/costings", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: costingToDelete,
        }),
      });

      if (response.ok) {
        toast.success("Costing deleted successfully");
        fetchCostings();
      } else {
        toast.error("Costing could not be deleted");
      }
    } catch (error) {
      toast.error("Costing deletion error");
    } finally {
      setCostingToDelete(null);
      setShowDeleteConfirm(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCostings();
  }, [enquiryId]);

  const fetchCostings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/costings/${enquiryId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.costings.length > 0) {
          setCostings(data.costings);
          setStatus(data.status);
        } else {
          setCostings([]);
        }
      } else {
        setCostings([]);
      }
    } catch (error) {
      toast.error("Error fetching costings");
      setCostings([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading costings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cost Estimates
              </h1>
              <p className="mt-2 text-gray-600">
                Manage and track cost estimates for Enquiry #{enquiryId}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon />
                Add New Costing
              </button>
              <Link
               href={`/quotation/${enquiryId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <File />
                Quotation
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {costings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {costings.map((costing) => (
              <CostingCard
                key={costing.id}
                costing={costing}
                selectCosting={selectCosting}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No costings created yet
            </h3>
            <p className="mt-2 text-gray-500">
              Get started by creating a new cost estimate for this enquiry.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              Create First Costing
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <CostingFormModal
          onCancel={onCancel}
          onConfirm={onConfirm}
          costing={selectedCosting.id ? selectedCosting : undefined}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          message="Are you sure you want to delete this costing? This action cannot be undone."
        />
      )}
    </div>
  );
}
