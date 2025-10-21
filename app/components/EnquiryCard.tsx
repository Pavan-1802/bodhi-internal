import { Enquiry } from "@/types";
import { formatDate } from "@/utils";
import StatusBadge from "./StatusBadge";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  File,
  Calendar,
  Clock,
} from "lucide-react";

export default function EnquiryCard({
  enquiry,
  onEdit,
  onDelete,
}: {
  enquiry: Enquiry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-5 flex justify-between items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-3">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
              {enquiry.customer_name}
            </h3>
            <div className="mt-2 sm:mt-0">
              <StatusBadge status={enquiry.status} />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {enquiry.description}
          </p>

          {/* Details Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-sm text-gray-500 pt-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
              <strong>Deadline:</strong>
              <span className="ml-1">{formatDate(enquiry.deadline)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
              <strong>Created:</strong>
              <span className="ml-1">
                {formatDate(enquiry.created_at || new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="ml-4">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-2 text-gray-500 bg-transparent rounded-full hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <MoreVertical className="w-5 h-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link href={`/costings/${enquiry.id}`} className={`${active ? "bg-gray-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}>
                        <DollarSign className="w-4 h-4 mr-2" /> View Costing
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link href={`/quotation/${enquiry.id}`} className={`${active ? "bg-gray-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}>
                        <FileText className="w-4 h-4 mr-2" /> View Quotation
                      </Link>
                    )}
                  </Menu.Item>
                   <Menu.Item>
                    {({ active }) => (
                      <Link href={`/invoice/${enquiry.id}`} className={`${active ? "bg-gray-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}>
                        <File className="w-4 h-4 mr-2" /> View Invoice
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={onEdit} className={`${active ? "bg-gray-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={onDelete} className={`${active ? "bg-red-50 text-red-800" : "text-red-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}