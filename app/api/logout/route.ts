import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = new NextResponse(
      JSON.stringify({ success: true, message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const cookieString = `token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure=true`;
    response.headers.set("Set-Cookie", cookieString);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
