import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Resend and Auth.js integration is complete!",
    details: {
      resend_utility: "src/lib/resend.ts",
      auth_config: "src/auth.ts",
      database: "Prisma with Account/Session models",
    },
    how_to_use_resend: `
import { resend } from "@/lib/resend";

await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "user@example.com",
  subject: "Hello",
  html: "<p>Test</p>"
});
    `,
    how_to_use_auth: "Use signIn('resend', { email: 'user@example.com' }) for magic links."
  });
}
