import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { SubmitEstimateBody, SubmitEstimateResponse } from "@workspace/api-zod";
import { EmailSendError, sendEstimateEmail } from "../lib/estimate-email";

const router = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait 15 minutes or call (951) 297-0622." },
});

router.post("/estimates", limiter, async (req, res) => {
  const origin = req.get("origin");
  const allowedOrigins = [
    "https://daytoncertifiedwelding.com",
    "https://www.daytoncertifiedwelding.com",
    process.env.RENDER_EXTERNAL_URL,
  ];
  if (process.env.NODE_ENV === "production" && origin && !allowedOrigins.includes(origin)) {
    res.status(403).json({ error: "Please submit your request from our website." });
    return;
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const parsed = SubmitEstimateBody.safeParse({
    ...body,
    name: typeof body.name === "string" ? body.name.trim() : body.name,
    email: typeof body.email === "string" ? body.email.trim() : body.email,
    details: typeof body.details === "string" ? body.details.trim() : body.details,
  });
  if (!parsed.success || parsed.data.website) {
    res.status(400).json({ error: "Please enter a name, valid email, and project details (10–5,000 characters)." });
    return;
  }
  try {
    const emailId = await sendEstimateEmail(parsed.data);
    req.log.info({ emailId }, "Estimate email accepted by Resend");
    res.status(202).json(SubmitEstimateResponse.parse({
      message: "Your request has been submitted. We’ll contact you about your project.",
    }));
  } catch (error) {
    // Never log the key, inquiry text, email address, or raw provider response.
    req.log.error({
      providerStatus: error instanceof EmailSendError ? error.providerStatus : undefined,
    }, "Estimate email delivery request failed");
    res.status(503).json({
      error: "We couldn’t send your request. Please try again or call (951) 297-0622.",
    });
  }
});

export default router;
