# Render setup

This deploys the website and Express API as one Node Web Service. The estimate
form sends through Resend once the sending domain is verified and the Render
service has `RESEND_API_KEY`. See `RESEND_SETUP.md`.

## Recommended: use the Blueprint

1. Push this repository's `main` branch to GitHub.
2. In Render, select **New → Blueprint**.
3. Connect GitHub and select `tmenna/dayton-certified-welding`.
4. Use `render.yaml` from the repository root.
5. Review the service and plan, then create the Blueprint.
6. Open the assigned Render URL and verify the website and `/api/healthz`.

The Blueprint uses Render's free web service for initial testing. Free services
can sleep when idle. Review a paid always-on plan before routing the live business
domain. No database is required for the website's current functionality.

## Manual Web Service configuration

- Runtime: Node
- Branch: `main`
- Root directory: leave blank
- Build command:
  `pnpm install --frozen-lockfile --prod=false && pnpm run build:render`
- Start command: `pnpm run start:render`
- Health check: `/api/healthz`
- Auto-deploy: on commit
- Environment:
  - `NODE_VERSION=24`
  - `NODE_ENV=production`
  - `SERVE_WEBSITE=true`

Render supplies the runtime `PORT`. Do not set it manually. Development
dependencies must be installed during the build because Vite is a build tool.
Use Render's existing pnpm command. Do not run `corepack enable`: it attempts to
replace binaries under `/usr/bin`, which is read-only in Render's build environment.
Do not use the root `build` script: it also builds unrelated preview artifacts.

## Connect the custom domain after testing

1. Open the service's **Settings → Custom Domains**.
2. Add `daytoncertifiedwelding.com`.
3. Follow Render's displayed DNS instructions for the root and `www` hostnames.
4. Preserve existing business email MX, SPF, DKIM, and other mail DNS records.
5. Verify the domain and wait for Render's HTTPS certificate.
6. Check both domain variants and navigation.

Do not change live DNS until the Render website has been checked. Store any
future Resend API key only in Render's environment settings, never in Git.
