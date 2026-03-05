import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    customer_id: `cust_${crypto.randomUUID().slice(0, 8)}`,
    status: "pending_review",
    business_legal_name: payload.business_legal_name,
  });
}
