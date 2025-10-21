"use client";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  FileCheck,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [currentSection, setCurrentSection] = useState({
    name: "Enquiries",
    href: "/",
    icon: Search,
  });

  const navigation = [
    { name: "Enquiries", href: "/", icon: Search },
    { name: "Costings", href: "/costings", icon: DollarSign },
    { name: "Quotation", href: "/quotations", icon: FileCheck },
    { name: "Invoice", href: "/invoices", icon: FileText },
  ];

  // Determine current section based on pathname
  useEffect(() => {
    if (pathname === "/") {
      setCurrentSection(navigation[0]);
    } else if (
      pathname.startsWith("/costings") ||
      pathname.startsWith("/create-costings/")
    ) {
      setCurrentSection(navigation[1]);
    } else if (
      pathname.startsWith("/quotation")
    ) {
      setCurrentSection(navigation[2]);
    } else if (
      pathname.startsWith("/invoice") 
    ) {
      setCurrentSection(navigation[3]);
    }
  }, [pathname]);

  const goBack = () => {
    router.back();
  };

  const logout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      router.push("/login");
    }
  };

  const goForward = () => {
    router.forward();
  };

  return (
    <nav className="bg-white print:hidden shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BQ</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Bodhi Quotation
              </span>
            </Link>
          </div>

          {/* Center: Navigation Controls & Current Section */}
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button onClick={goBack} title="Go back">
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Current Section Display */}
            {currentSection && (
              <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                {currentSection.icon && (
                  <currentSection.icon className="w-4 h-4 mr-2" />
                )}
                <span className="font-medium text-sm hidden sm:inline">
                  {currentSection.name}
                </span>
                <span className="font-medium text-sm sm:hidden">
                  {currentSection.name.slice(0, 3)}
                </span>
              </div>
            )}

            {/* Forward Button */}
            <button onClick={goForward} title="Go forward">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <button onClick={logout} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
