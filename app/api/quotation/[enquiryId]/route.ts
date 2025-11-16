import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { enquiryId: bigint } }) {
  const enquiryId = await params.enquiryId;
  console.log("Enquiry ID:", enquiryId);
  const quotation = await pool.query(
    "SELECT id, item_name, profit_percent, tax_percent, quantity, total_cost FROM costings WHERE enquiry_id=$1",
    [enquiryId]
  );
  const customer = await pool.query(
    "SELECT customer_name, customer_phone, customer_address FROM enquiries WHERE id=$1",
    [enquiryId]
  );
  console.log("Customer Info:", customer.rows[0].customer_name, customer.rows[0].customer_phone);
  return NextResponse.json({ items: quotation.rows, customer_name: customer.rows[0].customer_name, customer_phone: customer.rows[0].customer_phone, customer_address: customer.rows[0].customer_address }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { enquiryId: string } }) {
  const enquiryId = await params.enquiryId;
  const body = await request.json();
  const { items } = body;
  for (const item of items) {
    if (!item.id || !item.item_name || item.quantity == null || item.tax_percent == null || item.total_cost == null || item.profit_percent == null) {
      return NextResponse.json({ message: "Invalid item data" }, { status: 400 });
    }
    await pool.query(
      "UPDATE costings SET item_name=$1, quantity=$2, profit_percent=$3, tax_percent=$4, total_cost=$5 WHERE id=$6 AND enquiry_id=$7",
      [item.item_name, item.quantity, item.profit_percent, item.tax_percent, item.total_cost, item.id, enquiryId]
    );
  }
  await pool.query(
    "UPDATE enquiries SET status=$1 WHERE id=$2",["quotation prepared", enquiryId]
  )
  return NextResponse.json({ message: "Quotation updated successfully" }, { status: 200 });
}