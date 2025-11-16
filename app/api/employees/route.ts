import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
    const { employeeName } = await request.json()
    try {
    const employee = await pool.query("INSERT INTO employees (employee_name) VALUES ($1) RETURNING *",[employeeName])
        return NextResponse.json({ employee: employee.rows[0] }, { status: 200 });
    } catch(error) {
        console.error("Error updating invoice:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { employeeName, id } = await request.json()
    try {
    const employee = await pool.query("INSERT INTO employees (employee_name) VALUES ($1) WHERE id=$2 RETURNING *",[employeeName, id])
        return NextResponse.json({ employee: employee.rows[0] }, { status: 200 });
    } catch(error) {
        console.error("Error updating invoice:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request){
    try {
        const employees = await pool.query("SELECT * FROM employees ORDER BY created_at DESC")
        return NextResponse.json({ employees: employees.rows }, { status: 200 });
    } catch(error) {
        console.error(error)
        return NextResponse.json({error:"Error fetching Employees"})
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json()
    try {
        await pool.query("DELETE FROM employees WHERE id=$1",[id])
        return NextResponse.json({ message: "Employee removed successfully" }, { status: 200 });
    } catch(error) {
        console.error(error)
        return NextResponse.json({error:"Error deleting Employee"})
    }
}