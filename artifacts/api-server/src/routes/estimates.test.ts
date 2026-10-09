import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import estimatesRouter from "./estimates";

test("estimate validation, delivery, failure and abuse controls", async () => {
  const originalFetch = globalThis.fetch;
  const savedEnv = {
    key: process.env.RESEND_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    from: process.env.ESTIMATE_FROM_EMAIL,
    to: process.env.ESTIMATE_TO_EMAIL,
  };
  process.env.NODE_ENV = "production";
  delete process.env.ESTIMATE_FROM_EMAIL;
  delete process.env.ESTIMATE_TO_EMAIL;
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
  };
  let ip = 1;
  const send = (body: unknown, origin?: string, fixedIp?: string) => originalFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": fixedIp || `192.0.2.${ip++}`,
      ...(origin ? { Origin: origin } : {}),
    },
    body: JSON.stringify(body),
  });
  let calls = 0;
  let outgoing: Record<string, unknown> = {};
  let outgoingHeaders: Headers | undefined;
  globalThis.fetch = async (input, options) => {
    assert.equal(input, "https://api.resend.com/emails");
    calls++;
    outgoing = JSON.parse(String(options?.body));
    outgoingHeaders = new Headers(options?.headers);
    return new Response(JSON.stringify({ id: "synthetic-email-id" }), {
      status: 200, headers: { "Content-Type": "application/json" },
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
    ]) {
      assert.equal((await send(invalid)).status, 400);
    }
    assert.equal(calls, 0);
    assert.equal((await send(valid, "https://untrusted.example")).status, 403);
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

    globalThis.fetch = async () => new Response('{"error":"provider rejected"}', { status: 403 });
    const failed = await send(valid);
    assert.equal(failed.status, 503);
    assert.match(((await failed.json()) as { error: string }).error, /couldn’t send/);
    globalThis.fetch = async () => { throw new Error("simulated network failure"); };
    assert.equal((await send(valid)).status, 503);
    for (let i = 0; i < 5; i++) {
      assert.equal((await send({}, undefined, "192.0.2.200")).status, 400);
    }
    const limited = await send({}, undefined, "192.0.2.200");
    assert.equal(limited.status, 429);
    assert.ok(limited.headers.get("Retry-After"));
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({
      RESEND_API_KEY: savedEnv.key,
      NODE_ENV: savedEnv.nodeEnv,
      ESTIMATE_FROM_EMAIL: savedEnv.from,
      ESTIMATE_TO_EMAIL: savedEnv.to,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
