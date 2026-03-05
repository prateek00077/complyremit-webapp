import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const agreementId = request.nextUrl.searchParams.get("signed_agreement_id");
  return NextResponse.redirect(
    new URL(
      `/onboarding/tos/complete?signed_agreement_id=${agreementId}`,
      request.url
    )
  );
}
