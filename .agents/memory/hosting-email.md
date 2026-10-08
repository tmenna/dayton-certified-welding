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
