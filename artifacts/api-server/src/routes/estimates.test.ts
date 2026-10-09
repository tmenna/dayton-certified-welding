import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import { createHmac, randomUUID } from "node:crypto";
import { once } from "node:events";
import estimatesRouter from "./estimates";
import { pool } from "@workspace/db";
import { consumeEstimateAttempt, pruneEstimateLimits } from "../lib/estimate-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";

test("estimate validation, delivery, failure and abuse controls", async () => {
  const originalFetch = globalThis.fetch;
  const savedEnv = {
    key: process.env.RESEND_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    from: process.env.ESTIMATE_FROM_EMAIL,
    to: process.env.ESTIMATE_TO_EMAIL,
    turnstile: process.env.TURNSTILE_SECRET_KEY,
    hosts: process.env.TURNSTILE_ALLOWED_HOSTNAMES,
    rateSecret: process.env.RATE_LIMIT_SECRET,
  };
  process.env.NODE_ENV = "production";
  delete process.env.ESTIMATE_FROM_EMAIL;
  delete process.env.ESTIMATE_TO_EMAIL;
  process.env.TURNSTILE_SECRET_KEY = "synthetic-turnstile-key-not-valid";
  process.env.TURNSTILE_ALLOWED_HOSTNAMES = "daytoncertifiedwelding.com";
  const rateSecret = randomUUID();
  process.env.RATE_LIMIT_SECRET = rateSecret;
  const testKeys: string[] = [];
  const counterKey = (ip: string) => createHmac("sha256", rateSecret)
    .update(`estimate:${ipKeyGenerator(ip)}`).digest("hex");
  const app = express();
  app.set("trust proxy", 1);
  app.use(pinoHttp({ logger: pino({ level: "silent" }) }));
  app.use(express.json());
  app.use("/api", estimatesRouter);
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/api/estimates`;
  const valid = {
    name: "Synthetic Test Company",
    email: "visitor@example.com",
    details: "Synthetic test of pipeline welding inquiry.",
    website: "",
    requestId: randomUUID(),
    turnstileToken: "synthetic-token",
  };
  let ip = 1;
  const send = (body: unknown, origin?: string, fixedIp?: string) => {
    const address = fixedIp || `192.0.2.${ip++}`;
    testKeys.push(counterKey(address));
    return originalFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": address,
      ...(origin ? { Origin: origin } : {}),
    },
    body: JSON.stringify(body),
    });
  };
  let calls = 0;
  let outgoing: Record<string, unknown> = {};
  let outgoingHeaders: Headers | undefined;
  let verificationCalls = 0;
  let verificationResult: unknown = {
    success: true, action: "estimate", hostname: "daytoncertifiedwelding.com",
  };
  let verificationStatus = 200;
  let verificationThrows = false;
  let emailStatus = 200;
  let emailThrows = false;
  globalThis.fetch = async (input, options) => {
    if (input === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
      verificationCalls++;
      const verification = JSON.parse(String(options?.body));
      assert.equal(verification.response, valid.turnstileToken);
      assert.equal(verification.secret, process.env.TURNSTILE_SECRET_KEY);
      assert.ok(verification.remoteip);
      assert.ok(options?.signal);
      if (verificationThrows) throw new Error("synthetic timeout");
      return new Response(JSON.stringify(verificationResult), { status: verificationStatus });
    }
    assert.equal(input, "https://api.resend.com/emails");
    calls++;
    if (emailThrows) throw new Error("synthetic email network failure");
    outgoing = JSON.parse(String(options?.body));
    outgoingHeaders = new Headers(options?.headers);
    return new Response(JSON.stringify({ id: "synthetic-email-id" }), {
      status: emailStatus, headers: { "Content-Type": "application/json" },
    });
  };
  try {
    process.env.RESEND_API_KEY = "synthetic-key-not-valid";
    for (const invalid of [
      { ...valid, email: "not-an-email" },
      { ...valid, name: "    " },
      { ...valid, name: "Name\nInjected" },
      { ...valid, details: "       " },
      { ...valid, details: "x".repeat(5001) },
      { ...valid, requestId: "bad-id" },
      { ...valid, website: "spam.example" },
      { ...valid, turnstileToken: undefined },
      { ...valid, turnstileToken: "" },
      { ...valid, turnstileToken: "x".repeat(2049) },
      { ...valid, turnstileToken: 123 },
    ]) {
      assert.equal((await send(invalid)).status, 400);
    }
    assert.equal(calls, 0);
    assert.equal(verificationCalls, 0);
    assert.equal((await send(valid, "https://untrusted.example")).status, 403);
    const verified = verificationResult;
    for (const result of [
      { success: false, "error-codes": ["invalid-input-response"] },
      { success: false, "error-codes": ["timeout-or-duplicate"] },
      { success: true, action: "login", hostname: "daytoncertifiedwelding.com" },
      { success: true, action: "estimate", hostname: "untrusted.example" },
      { success: true, action: "estimate" },
    ]) {
      verificationResult = result;
      assert.equal((await send(valid)).status, 403);
      assert.equal(calls, 0);
    }
    for (const result of [null, {}, { success: false, "error-codes": ["internal-error"] }]) {
      verificationResult = result;
      assert.equal((await send(valid)).status, 503);
      assert.equal(calls, 0);
    }
    verificationResult = verified;
    verificationStatus = 500;
    assert.equal((await send(valid)).status, 503);
    verificationStatus = 200;
    verificationThrows = true;
    assert.equal((await send(valid)).status, 503);
    verificationThrows = false;
    delete process.env.TURNSTILE_SECRET_KEY;
    assert.equal((await send(valid)).status, 503);
    process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
    assert.equal((await send(valid)).status, 503);
    process.env.TURNSTILE_SECRET_KEY = "synthetic-turnstile-key-not-valid";
    delete process.env.TURNSTILE_ALLOWED_HOSTNAMES;
    assert.equal((await send(valid)).status, 503);
    process.env.TURNSTILE_ALLOWED_HOSTNAMES = "daytoncertifiedwelding.com";
    assert.equal(calls, 0);
    delete process.env.RESEND_API_KEY;
    assert.equal((await send(valid)).status, 503);
    assert.equal(calls, 0);
    process.env.RESEND_API_KEY = "synthetic-key-not-valid";
    const accepted = await send(valid, "https://daytoncertifiedwelding.com");
    assert.equal(accepted.status, 202);
    assert.match(((await accepted.json()) as { message: string }).message, /submitted/);
    assert.deepEqual(outgoing.to, ["david@daytoncertifiedwelding.com"]);
    assert.equal(outgoing.from, "Dayton Certified Welding <estimates@daytoncertifiedwelding.com>");
    assert.equal(outgoing.reply_to, valid.email);
    assert.match(String(outgoing.text), /Synthetic test of pipeline/);
    assert.equal(outgoingHeaders?.get("Idempotency-Key"), `estimate-${valid.requestId}`);
    assert.equal(outgoing.html, undefined);
    assert.ok(!String(outgoing.text).includes(valid.turnstileToken));

    emailStatus = 403;
    const failed = await send(valid);
    assert.equal(failed.status, 503);
    assert.match(((await failed.json()) as { error: string }).error, /couldn’t send/);
    emailThrows = true;
    assert.equal((await send(valid)).status, 503);
    for (let i = 0; i < 5; i++) {
      assert.equal((await send({}, undefined, "192.0.2.200")).status, 400);
    }
    const limited = await send({}, undefined, "192.0.2.200");
    assert.equal(limited.status, 429);
    assert.ok(limited.headers.get("Retry-After"));
    assert.equal(limited.headers.get("RateLimit-Remaining"), "0");
    for (let i = 1; i <= 5; i++) {
      assert.equal((await send({}, undefined, `2001:db8:1234:5600::${i}`)).status, 400);
    }
    assert.equal((await send({}, undefined, "2001:db8:1234:56ff::99")).status, 429);
    // A client prepending a fake forwarded IP does not change the nearest
    // trusted proxy's appended address.
    assert.equal((await send({}, undefined, "198.51.100.9, 192.0.2.200")).status, 429);
    testKeys.push(counterKey("192.0.2.200"));

    // Atomic concurrency: exactly five of twenty contenders are permitted.
    const concurrentKey = `test-${randomUUID()}`;
    testKeys.push(concurrentKey);
    const attempts = await Promise.all(Array.from({ length: 20 },
      () => consumeEstimateAttempt(concurrentKey)));
    assert.equal(attempts.filter((attempt) => attempt.hits <= 5).length, 5);
    assert.equal((await consumeEstimateAttempt(concurrentKey)).hits, 6);
    // New connection sees the persisted counter (no process-local state).
    const connection = await pool.connect();
    try {
      const persisted = await connection.query("SELECT hits FROM estimate_rate_limits WHERE key = $1", [concurrentKey]);
      assert.equal(persisted.rows[0].hits, 6);
    } finally { connection.release(); }
    await pool.query("UPDATE estimate_rate_limits SET reset_at = now() - interval '1 second' WHERE key = $1", [concurrentKey]);
    assert.equal((await consumeEstimateAttempt(concurrentKey)).hits, 1);
    const oldKey = `test-${randomUUID()}`;
    testKeys.push(oldKey);
    await pool.query("INSERT INTO estimate_rate_limits VALUES ($1, 6, now() - interval '2 days')", [oldKey]);
    await pruneEstimateLimits();
    assert.equal((await pool.query("SELECT key FROM estimate_rate_limits WHERE key = $1", [oldKey])).rowCount, 0);
    assert.equal((await consumeEstimateAttempt(concurrentKey)).hits, 2);

    // A fresh application instance still rejects the IP's sixth attempt.
    const secondApp = express();
    secondApp.set("trust proxy", 1);
    secondApp.use(pinoHttp({ logger: pino({ level: "silent" }) }));
    secondApp.use(express.json());
    secondApp.use("/api", estimatesRouter);
    const secondServer = secondApp.listen(0, "127.0.0.1");
    await once(secondServer, "listening");
    try {
      const secondAddress = secondServer.address();
      assert.ok(secondAddress && typeof secondAddress !== "string");
      const response = await originalFetch(`http://127.0.0.1:${secondAddress.port}/api/estimates`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Forwarded-For": "192.0.2.200" },
        body: JSON.stringify(valid),
      });
      assert.equal(response.status, 429);
    } finally {
      await new Promise<void>((resolve) => secondServer.close(() => resolve()));
    }

    const query = pool.query;
    const emailsBefore = calls;
    pool.query = (() => { throw new Error("synthetic database outage"); }) as typeof pool.query;
    try {
      assert.equal((await send(valid)).status, 503);
      assert.equal(calls, emailsBefore);
    } finally { pool.query = query; }
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({
      RESEND_API_KEY: savedEnv.key,
      NODE_ENV: savedEnv.nodeEnv,
      ESTIMATE_FROM_EMAIL: savedEnv.from,
      ESTIMATE_TO_EMAIL: savedEnv.to,
      TURNSTILE_SECRET_KEY: savedEnv.turnstile,
      TURNSTILE_ALLOWED_HOSTNAMES: savedEnv.hosts,
      RATE_LIMIT_SECRET: savedEnv.rateSecret,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await pool.query("DELETE FROM estimate_rate_limits WHERE key = ANY($1::text[])", [testKeys]);
    await pool.end();
  }
});
