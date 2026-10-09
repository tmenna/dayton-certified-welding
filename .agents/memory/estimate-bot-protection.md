---
name: Estimate bot protection
description: Provider selection and deployment boundaries for public estimate spam prevention.
---

Use Turnstile's direct Siteverify API rather than assuming a connected Cloudflare infrastructure integration configures Turnstile.

**Why:** The integration catalog offered Cloudflare DNS/infrastructure management, not widget credential provisioning. The user also needs portable Render hosting.

**How to apply:** Widget creation and per-environment keys require Cloudflare setup. Keep server verification mandatory and fail closed; never use development dummy keys in production.

Provisioning production PostgreSQL for Render must not replace or migrate the Replit development database.

**Why:** The user authorized a dedicated production database for Render. This is separate production setup, not a migration of the existing development database.

**How to apply:** All instances of the same Render web service must share its production database and a stable HMAC secret. Provision configuration before deploying; missing configuration should never bypass spam protection.
