export interface Enquiry {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    description: string;
    deadline: string;
    status: string;
    created_at: string;
}

export interface Costing {
    id: number;
    enquiry_id: number;
    item_name: string;
    profit_percent?: number;
    tax_percent?: number;
    quantity?: number;
    total_cost: number;
    line_items: LineItem[];
    created_at?: string;
}

export interface LineItem {
    item: string;
    quantity_description: string;
    price: number;
}

export interface AdditionalCost {
  description: string;
  amount: number;
}

export interface Customer {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}