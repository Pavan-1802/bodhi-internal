import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request, { params }: { params: { enquiry_id: string } }) {
  const enquiry_id = params.enquiry_id;
  const costing = await pool.query(
    "SELECT * FROM costings WHERE enquiry_id=$1",
    [enquiry_id]
  );
  const enquiryStatus = await pool.query(
    "SELECT status FROM enquiries WHERE id=$1",
    [enquiry_id]
  )
  const statusValue: string = enquiryStatus.rows[0].status;
  console.log(statusValue)
  return NextResponse.json({costings: costing.rows, status: statusValue});
}

export async function POST(request: Request, { params }: { params: { enquiry_id: string } }) {
    const enquiry_id = params.enquiry_id;
    const {item_name, line_items, total_cost } = await request.json();
    if (!line_items || !total_cost ) {
        return NextResponse.json({ error: 'Enquiry ID, item_name, line items and total cost are required' }, { status: 400 });
    }
    try {
        const costing = await pool.query('INSERT INTO costings (enquiry_id, item_name, line_items, total_cost) VALUES ($1, $2, $3, $4) RETURNING *', [enquiry_id, item_name, JSON.stringify(line_items), total_cost]);
        await pool.query('UPDATE enquiries SET status = $1 where id = $2', ['cost sheets prepared', enquiry_id])
        return NextResponse.json(costing.rows[0]);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
