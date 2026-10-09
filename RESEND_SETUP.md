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
attempts per 15 minutes. Rate limits are in-memory and reset when the service
restarts; multi-instance deployments would need a shared rate-limit store.
Unchanged retries reuse a Resend idempotency key to reduce duplicate emails.
