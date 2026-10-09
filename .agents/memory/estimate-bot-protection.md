---
name: Estimate bot protection
description: Provider selection and deployment boundaries for public estimate spam prevention.
---

Use Turnstile's direct Siteverify API rather than assuming a connected Cloudflare infrastructure integration configures Turnstile.

**Why:** The integration catalog offered Cloudflare DNS/infrastructure management, not widget credential provisioning. The user also needs portable Render hosting.

**How to apply:** Widget creation and per-environment keys require Cloudflare setup. Keep server verification mandatory and fail closed; never use development dummy keys in production.

Shared limits must use the existing PostgreSQL provider, not introduce or replace a database.

**Why:** The assigned requirement explicitly forbids changing database providers and requires protection across restarts and multiple instances.

**How to apply:** All serving instances must point at the same existing database and use a stable shared HMAC secret. Provision configuration before deploying; missing configuration should never bypass spam protection.
