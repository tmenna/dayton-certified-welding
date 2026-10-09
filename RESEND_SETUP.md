# Estimate form email setup

The form sends one notification to David. It does not email the visitor
automatically. Reply-To is the visitor's address. Request data is not saved in a
database; an error leaves the form filled so the visitor can retry or call.

## Domain DNS verification

`daytoncertifiedwelding.com` has been added to the connected Resend account.
Sending is enabled; receiving and click/open tracking are disabled.

In Resend → Domains → daytoncertifiedwelding.com, copy the exact DNS records.
At your DNS provider, add:

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| TXT | `resend._domainkey` | Copy the full `p=...` DKIM public key from Resend | — |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |
| CNAME | `rsend` | `send.forge.rmta.net` | — |

Use automatic/default TTL. Some DNS providers need the full domain name instead
of only the Host shown here; do not append the domain twice. Keep any CNAME
record DNS-only if the provider offers a web-proxy option.

Do not replace the root-domain MX records or enable Resend inbound receiving.
These sending records are separate from the existing business mailbox. If one
of the listed hosts already exists, inspect it rather than replacing it blindly.

Click Verify in Resend and wait until the sending domain is verified.

## Render environment

Create a new Resend API key with sending-only access restricted to Dayton's
domain. Paste it directly into Render → service → Environment:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Secret Resend sending key |
| `ESTIMATE_FROM_EMAIL` | `Dayton Certified Welding <estimates@daytoncertifiedwelding.com>` |
| `ESTIMATE_TO_EMAIL` | `david@daytoncertifiedwelding.com` |

Save and redeploy. Never commit an API key or use a `VITE_` prefix for it.
The Replit connector is not available to the application running on Render.
For local development, add a separate key through Replit Secrets.

## Verify

Submit a clearly marked test inquiry on the live website. Confirm that:

- The page shows a success message and clears the fields only after Resend
  accepts the email.
- The message appears in Resend's email log and arrives in David's inbox.
- Reply addresses the visitor.
- Invalid inputs are rejected, and failures preserve the entered details.

Success means the provider accepted the message, not a guarantee of inbox
delivery. Check delivery/bounce events in Resend. No live send is claimed until
domain verification, Render key configuration, and the inbox check are done.

## Spam controls

The endpoint validates lengths/email addresses, rejects populated spam-trap
fields, checks browser origins in production, and limits each IP address to five
attempts per 15 minutes using atomic counters in the existing PostgreSQL database.
Counters survive restarts and are shared by all instances. IPv6 addresses are
grouped by /56 subnet. Invalid inquiries and failed verifications count as attempts.
If storage is unavailable, the endpoint returns 503 and sends no email.
Unchanged retries reuse a Resend idempotency key to reduce duplicate emails.

### Turnstile setup (required before accepting inquiries)

The integration catalog was checked: Cloudflare's available integration manages
DNS/infrastructure, not Turnstile widgets. This app uses Cloudflare's public
Turnstile client script and server-side Siteverify API directly; it does not
require connecting Cloudflare DNS or moving your domain.

1. In the Cloudflare dashboard, open **Turnstile → Add widget** and select
   **Managed** mode (no image puzzles). Add `daytoncertifiedwelding.com`,
   `www.daytoncertifiedwelding.com`, and the exact Render hostname if you serve
   the form there. Use a separate widget for development hostnames.
2. Configure the following in Render → service → Environment (and Replit
   Secrets/environment for development). Never commit secret keys:

   | Variable | Purpose |
   | --- | --- |
   | `VITE_TURNSTILE_SITE_KEY` | Public widget site key; embedded during the website build |
   | `TURNSTILE_SECRET_KEY` | Secret key for that same widget; server only |
   | `TURNSTILE_ALLOWED_HOSTNAMES` | Comma-separated exact hostnames above, without protocols/paths |
   | `DATABASE_URL` | Connection to your existing PostgreSQL database; use the same DB on every instance |
   | `RATE_LIMIT_SECRET` | Long random server-only secret shared across instances, used to HMAC IP keys; `SESSION_SECRET` is an alternative if already configured |

3. Apply the additive table to that existing database before deploying:
   `pnpm --filter @workspace/db run push`. Review the proposed changes; this adds
   only the `estimate_rate_limits` table and its expiry index. Run with the target
   database configured in your deployment environment; do not copy database
   credentials into commands, chat, or source control.
4. Rebuild and redeploy the website as well as the API. Changing the public
   `VITE_` site key requires a new build. Missing/unsafe CAPTCHA configuration
   disables submissions; there is no production bypass. Do not deploy until
   these values and the table are ready.

Tokens must pass Siteverify with `success: true`, action `estimate`, and an
explicitly allowed hostname. Cloudflare rejects expired (five-minute) and reused
tokens. The backend has a five-second verification timeout and returns 503 on
provider/configuration failures, never sending email without verification.
Missing/oversized tokens are rejected with 400; failed/expired tokens return 403.
Browser origin checks remain supplemental; requests without Origin still require
verification. No client-supplied IP header is used directly. Render must keep
its single trusted reverse-proxy hop; do not enable unrestricted `trust proxy`.
Other deployments need an audited proxy policy, otherwise visitors share the
direct connection's IP limit.

Only HMAC-derived IP/subnet keys, attempt counts, and expiry times are persisted,
not inquiry details, raw IPs, or verification tokens. Expired counters older than
a day are pruned on startup and hourly. Keep the HMAC secret stable: rotating it
starts new counters. The limit returns 429 with `Retry-After` and rate-limit
headers; it is five attempts per IP/subnet, not a global email spending cap.

### Verification checklist

- A normal verified inquiry succeeds; the form resets only after acceptance.
- Missing, fabricated, expired, reused, wrong-action, and wrong-hostname tokens
  never call Resend, including requests without an Origin header.
- Six attempts from the same IP are limited, even after a restart or across
  concurrent instances. IPv6 address rotation within a /56 cannot bypass it.
- A database or verification outage sends no email. Entered details remain for
  retry; every submission attempt gets a fresh token while retaining the same
  email idempotency key for an unchanged inquiry.
- Check keyboard navigation and screen-reader status announcements. If the
  script is blocked or the check expires/fails, the retry button and direct
  phone/email links remain available.
- `pnpm --filter @workspace/api-server run test:estimates` uses synthetic
  Siteverify/Resend responses (no real emails) and isolated counters in the
  development database. Run it after applying the table.
- For manual widget tests use Cloudflare's documented dummy keys **only in
  development**, never production. Configure an allowed hostname matching the
  verifier response and verify the `estimate` action. Production rejects dummy
  keys; no test bypass is provided by the application.
