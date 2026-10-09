export class VerificationUnavailable extends Error {}

export async function verifyEstimateToken(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const hostnames = (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "")
    .split(",").map((host) => host.trim()).filter(Boolean);
  if (!secret || !hostnames.length ||
      (process.env.NODE_ENV === "production" && /^[123]x0{20,}/.test(secret))) {
    throw new VerificationUnavailable("Turnstile configuration missing or unsafe");
  }
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new VerificationUnavailable("Verification service unavailable");
    const result = await response.json() as {
      success?: boolean; hostname?: string; action?: string; "error-codes"?: string[];
    } | null;
    if (!result || typeof result.success !== "boolean") {
      throw new VerificationUnavailable("Invalid verification response");
    }
    if (result["error-codes"]?.some((code) =>
      ["internal-error", "missing-input-secret", "invalid-input-secret"].includes(code))) {
      throw new VerificationUnavailable("Verification service unavailable");
    }
    // Siteverify enforces expiry and single-use. Check context as well, even for
    // direct requests with no Origin header.
    return result.success === true && result.action === "estimate" &&
      typeof result.hostname === "string" && hostnames.includes(result.hostname);
  } catch {
    throw new VerificationUnavailable("Verification service unavailable");
  }
}
