import type { EstimateInput } from "@workspace/api-zod";

export class EmailSendError extends Error {
  constructor(public readonly providerStatus?: number) {
    super("Estimate email could not be sent");
  }
}

export async function sendEstimateEmail(
  inquiry: EstimateInput,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new EmailSendError();
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `estimate-${inquiry.requestId}`,
    },
    body: JSON.stringify({
      from: process.env.ESTIMATE_FROM_EMAIL ||
        "Dayton Certified Welding <estimates@daytoncertifiedwelding.com>",
      to: [process.env.ESTIMATE_TO_EMAIL || "david@daytoncertifiedwelding.com"],
      reply_to: inquiry.email,
      subject: "New Project Estimate Request — Dayton Certified Welding",
      text: [
        "New inquiry from the Free Project Estimates form",
        "",
        `Name / Company: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        "",
        "Project details:",
        inquiry.details,
      ].join("\n"),
    }),
  });
  if (!response.ok) throw new EmailSendError(response.status);
  const result = await response.json() as { id?: unknown };
  if (typeof result.id !== "string" || !result.id) throw new EmailSendError();
  return result.id;
}
