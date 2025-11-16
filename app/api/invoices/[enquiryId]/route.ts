import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { enquiryId: string } }) {
  const enquiryId = params.enquiryId;

  try {
    const invoice = await pool.query("SELECT * FROM invoices WHERE enquiry_id = $1", [enquiryId]);
    const items = await pool.query(
    "SELECT id, item_name, profit_percent, tax_percent, quantity, total_cost FROM costings WHERE enquiry_id=$1",
    [enquiryId]
    );
  const customer = await pool.query(
    "SELECT customer_name, customer_phone, customer_address FROM enquiries WHERE id=$1",
    [enquiryId]
  );
    console.log(invoice.rows[0])
    return NextResponse.json({ invoice: invoice.rows[0], items: items.rows, customer: customer.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH (request: NextRequest, { params }: { params: { enquiryId: string } }) {
  const enquiryId = params.enquiryId;
  const body = await request.json();
  const { additionalCosts } = body;
  console.log(JSON.stringify(additionalCosts))
  try {
    const result = await pool.query(
      "UPDATE invoices SET additional_costs=$1 WHERE id=$2 RETURNING *",
      [JSON.stringify(additionalCosts), enquiryId]
    );
    await pool.query(
      "UPDATE enquiries SET status=$1 WHERE id=$2",["order delivered",enquiryId]
    )
    return NextResponse.json({ invoice: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}