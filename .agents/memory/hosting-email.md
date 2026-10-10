---
name: Hosting and estimate email
description: User's requested hosting and transactional email providers.
---

The user wants code pushed to GitHub, then deployed through Render, with Resend sending requests from the Free Project Estimates form.

**Why:** The user explicitly requested this hosting and email setup.

**How to apply:** Prepare portable server-side email code and Render deployment configuration. Do not assume a Replit-hosted connector will authenticate an application running on Render.

GitHub integration status or an active GitHub CLI login does not prove that workspace Git can push.

**Why:** This workspace has reported healthy integration status despite authorization failures, and a valid CLI login while HTTPS Git had no working credential helper.

**How to apply:** Verify write access with a Git push dry run. For HTTPS with a valid CLI login, configure Git to use that login's credential helper; never copy a token into the remote URL. If integration authorization itself is broken, use the documented Git Providers reconnection flow.

Render's native build environment can make `/usr/bin` read-only; do not run `corepack enable` to replace its package-manager binaries.

**Why:** Render failed before installation with `EROFS` when Corepack attempted to unlink `/usr/bin/pnpm`.

**How to apply:** Use the existing pnpm command or invoke Corepack directly without installing system-wide shims.

Orval's automatic Zod-version detection can emit Zod 4 syntax even when this workspace's catalog installs Zod 3.

**Why:** Adding email and UUID formats produced unsupported top-level validators during code generation.

**How to apply:** Keep generated validation syntax aligned with the installed major version; configure the generator explicitly rather than editing generated output.
