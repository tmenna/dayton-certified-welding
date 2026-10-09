---
name: Email-test idempotency
description: Avoid duplicate external sends when sandbox utility availability differs from documented behavior.
---

Give each authorized test send a stable idempotency key, and reuse it if the same send must be retried.

**Why:** This sandbox reported crypto as unavailable and disabled Date.now in durable execution despite the tool documentation describing those utilities as available. Utility failures occurred before any email was sent.

**How to apply:** Do not depend on durable clock or crypto APIs to prepare a send. Use a request-specific key that contains no personal information, or generate a nonce once in an impure helper and retain its returned value before sending. Check the provider's message status after acceptance rather than resending to confirm delivery.
