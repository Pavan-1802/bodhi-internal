import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET environment variable is not set.");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (email === process.env.OWNER_EMAIL && password === process.env.OWNER_PASSWORD) {
            
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: '7d' });
            
            const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days
            
            const cookieString = `token=${token}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax; Secure=true`;

            const response = new NextResponse(
                JSON.stringify({ success: true, message: "Login successful" }),
                {
                    status: 200,
                }
            );

            response.headers.set('Set-Cookie', cookieString);

            return response;

        } else {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
