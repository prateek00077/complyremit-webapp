import { NextResponse } from "next/server";

export async function POST() {
  const signed_agreement_id = crypto.randomUUID();
  return NextResponse.json({
    signing_url: `/onboarding/tos/sign?agreement_id=${signed_agreement_id}`,
    signed_agreement_id,
  });
}
