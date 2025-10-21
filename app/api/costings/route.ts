import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request) {
    const { id, enquiryId, item_name, line_items, total_cost } = await request.json();
    if (!id || !line_items || !total_cost) {
        return NextResponse.json({ error: 'ID, line items, and total cost are required' }, { status: 400 });
    }
    try {
        const costing = await pool.query('UPDATE costings SET line_items = $1, item_name = $2, total_cost = $3 WHERE id = $4 RETURNING *', [JSON.stringify(line_items), item_name, total_cost, id]);
        await pool.query('UPDATE enquiries SET status = $1 where id = $2', ['preparing cost', enquiryId])
        return NextResponse.json(costing.rows[0]);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    try {
        const costing = await pool.query('DELETE FROM costings WHERE id = $1 RETURNING *', [id]);
        return NextResponse.json(costing.rows[0]);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

