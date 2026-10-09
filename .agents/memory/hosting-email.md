---
name: Hosting and estimate email
description: User's requested hosting and transactional email providers.
---

The user wants code pushed to GitHub, then deployed through Render, with Resend sending requests from the Free Project Estimates form.

**Why:** The user explicitly requested this hosting and email setup.

**How to apply:** Prepare portable server-side email code and Render deployment configuration. Do not assume a Replit-hosted connector will authenticate an application running on Render.

GitHub integration status can report active/healthy while workspace Git authentication fails and the reconnect prompt rejects the connection.

**Why:** This workspace returned inconsistent connection and authorization states during a GitHub push attempt.

**How to apply:** Verify access with Git rather than trusting status alone. If the authorization prompt cannot repair access, direct the user to reconnect GitHub in account Git Providers settings, as recommended by Replit's Git documentation.

Render's native build environment can make `/usr/bin` read-only; do not run `corepack enable` to replace its package-manager binaries.

**Why:** Render failed before installation with `EROFS` when Corepack attempted to unlink `/usr/bin/pnpm`.

**How to apply:** Use the existing pnpm command or invoke Corepack directly without installing system-wide shims.

Orval's automatic Zod-version detection can emit Zod 4 syntax even when this workspace's catalog installs Zod 3.

**Why:** Adding email and UUID formats produced unsupported top-level validators during code generation.

**How to apply:** Keep generated validation syntax aligned with the installed major version; configure the generator explicitly rather than editing generated output.
