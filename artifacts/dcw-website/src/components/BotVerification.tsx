import { useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window { turnstile?: Turnstile }
}

let scriptPromise: Promise<Turnstile> | undefined;
function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      scriptPromise = undefined;
      reject(new Error("Security check could not load"));
    };
    const timer = window.setTimeout(fail, 15000);
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timer);
      if (window.turnstile) resolve(window.turnstile);
      else fail();
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function BotVerification({ onToken }: { onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState("Loading security check…");
  const [failed, setFailed] = useState(false);
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const configured = Boolean(sitekey) &&
    !(import.meta.env.PROD && /^[123]x0{15,}/.test(sitekey!));

  useEffect(() => {
    onToken("");
    if (!configured) {
      setStatus("Online requests are currently unavailable. Please call or email us for an estimate.");
      return;
    }
    let cancelled = false;
    let widget: string | undefined;
    let api: Turnstile | undefined;
    setFailed(false);
    setStatus("Loading security check…");
    const fail = () => {
      if (cancelled) return;
      onToken("");
      setFailed(true);
      setStatus("Security check failed. Retry below, or call or email us for an estimate.");
    };
    loadTurnstile().then((loaded) => {
      if (cancelled || !container.current) return;
      api = loaded;
      widget = api.render(container.current, {
        sitekey, action: "estimate", theme: "light", size: "flexible",
        "response-field": false,
        callback: (token: string) => {
          if (cancelled) return;
          onToken(token);
          setFailed(false);
          setStatus("Security check complete.");
        },
        "expired-callback": () => {
          if (cancelled) return;
          onToken("");
          setFailed(true);
          setStatus("Security check expired. Please retry the check.");
        },
        "timeout-callback": fail,
        "error-callback": () => { fail(); return true; },
      });
      setStatus("Please complete the security check.");
    }).catch(fail);
    return () => {
      cancelled = true;
      if (widget !== undefined) api?.remove(widget);
    };
  }, [configured, sitekey, retry, onToken]);

  return (
    <div className="space-y-2">
      <div ref={container} aria-label="Security verification" />
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
      {failed && configured && (
        <button type="button" onClick={() => setRetry((value) => value + 1)}
          className="text-sm font-semibold underline text-foreground">
          Retry security check
        </button>
      )}
      <p className="text-sm text-muted-foreground">
        Having trouble? <a href="tel:+19512970622" className="underline">Call (951) 297-0622</a>
        {" or "}<a href="mailto:david@daytoncertifiedwelding.com" className="underline">email us</a>.
      </p>
      <noscript>Please call or email us for an estimate; online verification requires JavaScript.</noscript>
    </div>
  );
}
