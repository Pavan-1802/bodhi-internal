import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
    const { customer_name, customer_phone, description, deadline } = await request.json();
    if (!customer_name || !customer_phone || !description || !deadline) {
        return NextResponse.json({ error: 'Customer name, customer phone, description and deadline are required' }, { status: 400 });
    }
    if(customer_phone.toString().length < 10){
        return NextResponse.json({ error: 'Customer phone must be at least 10 digits' }, { status: 400 });
    }
    const enquiry = await pool.query('INSERT INTO enquiries (customer_name, customer_phone, description, deadline) VALUES ($1, $2, $3, $4) RETURNING *', [customer_name, customer_phone, description, deadline]);
    return NextResponse.json(enquiry.rows[0], { status: 200 });
}

export async function GET(request: Request) {
    const enquiries = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    return NextResponse.json(enquiries.rows, { status: 200 });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await pool.query('DELETE FROM costing WHERE enquiry_id = $1', [id]);
    const enquiry = await pool.query('DELETE FROM enquiries WHERE id = $1 RETURNING *', [id]);
    return NextResponse.json(enquiry.rows[0], { status: 200 });
}

export async function PUT(request: Request) {
    const { id, customer_name, customer_phone, description, deadline } = await request.json();
    console.log(customer_phone);
    if (!id || !customer_name || !customer_phone || !description || !deadline) {
        return NextResponse.json({ error: 'ID, customer name, customer phone, description and deadline are required' }, { status: 400 });
    }
    const enquiry = await pool.query('UPDATE enquiries SET customer_name = $1, customer_phone = $2, description = $3, deadline = $4 WHERE id = $5 RETURNING *', [customer_name, customer_phone, description, deadline, id]);
    return NextResponse.json(enquiry.rows[0], { status: 200 });
}