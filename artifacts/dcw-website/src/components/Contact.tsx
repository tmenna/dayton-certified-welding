import { FadeIn } from "./animations";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useSubmitEstimate } from "@workspace/api-client-react";
import { BotVerification } from "./BotVerification";

export function Contact() {
  const mutation = useSubmitEstimate({ mutation: { retry: false } });
  const [feedback, setFeedback] = useState<{ error: boolean; text: string } | null>(null);
  const sending = useRef(false);
  const lastRequest = useRef<{ payload: string; id: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationVersion, setVerificationVersion] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (!turnstileToken) {
      setFeedback({ error: true, text: "Please complete the security check before sending." });
      return;
    }
    const form = event.currentTarget;
    const fields = new FormData(form);
    const data = {
      name: String(fields.get("name") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      details: String(fields.get("details") || "").trim(),
      website: String(fields.get("website") || ""),
    };
    if (data.name.length < 2 || data.details.length < 10) {
      setFeedback({ error: true, text: "Please enter a name and at least 10 characters of project details." });
      return;
    }
    // Keep the same id when retrying an unchanged request after a network error.
    const payload = JSON.stringify(data);
    if (lastRequest.current?.payload !== payload) {
      lastRequest.current = { payload, id: crypto.randomUUID() };
    }
    sending.current = true;
    setFeedback(null);
    try {
      const result = await mutation.mutateAsync({
        data: { ...data, requestId: lastRequest.current!.id, turnstileToken },
      });
      setFeedback({ error: false, text: result.message });
      form.reset();
      lastRequest.current = null;
    } catch (error) {
      const apiError = error as { data?: { error?: string } };
      setFeedback({
        error: true,
        text: apiError.data?.error || "We couldn’t send your request. Please try again or call (951) 297-0622.",
      });
    } finally {
      sending.current = false;
      // Tokens may be consumed even on network/email failure. Keep the inquiry
      // and its idempotency key, but always obtain a fresh verification token.
      setTurnstileToken("");
      setVerificationVersion((version) => version + 1);
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/40 hidden lg:block border-l border-border pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center justify-center gap-3">
                <span className="w-8 h-[2px] bg-primary block"></span>
                Get In Touch
                <span className="w-8 h-[2px] bg-primary block"></span>
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground">
                Free Project Estimates
              </h3>
            </div>

            <div className="bg-white border border-border p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-2xl font-display font-semibold text-foreground mb-6">
                    Expert Consultation
                  </h4>
                  <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                    Contact Dayton Certified Welding for a free estimate and expert consultation tailored to your project's precise welding and fabrication requirements.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone</span>
                        <a href="tel:+19512970622" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          (951) 297-0622
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</span>
                        <a href="mailto:david@daytoncertifiedwelding.com" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          david@daytoncertifiedwelding.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Location</span>
                        <span className="text-lg font-semibold text-foreground">
                          Temecula, California
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-border p-6 md:p-8">
                  <h4 className="font-display font-semibold text-xl text-foreground mb-6 pb-4 border-b border-border">
                    Request an Inquiry
                  </h4>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="estimate-name" className="block text-sm font-semibold text-foreground mb-2">Name / Company</label>
                      <input id="estimate-name" name="name" type="text" required minLength={2} maxLength={150} autoComplete="name" disabled={mutation.isPending} className="w-full bg-white border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="John Doe - Acme Corp" />
                    </div>
                    <div>
                      <label htmlFor="estimate-email" className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                      <input id="estimate-email" name="email" type="email" required maxLength={254} autoComplete="email" disabled={mutation.isPending} className="w-full bg-white border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label htmlFor="estimate-details" className="block text-sm font-semibold text-foreground mb-2">Project Details</label>
                      <textarea id="estimate-details" name="details" rows={4} required minLength={10} maxLength={5000} disabled={mutation.isPending} className="w-full bg-white border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Describe your welding requirements..."></textarea>
                    </div>
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="estimate-website">Leave this field blank</label>
                      <input id="estimate-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>
                    <BotVerification key={verificationVersion} onToken={setTurnstileToken} />
                    {feedback && (
                      <p role={feedback.error ? "alert" : "status"} aria-live="polite" className="text-sm font-medium text-foreground">
                        {feedback.text}
                      </p>
                    )}
                    <button type="submit" disabled={mutation.isPending || !turnstileToken} className="w-full bg-foreground text-background font-bold uppercase tracking-wider py-4 hover:bg-primary hover:text-white transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {mutation.isPending ? "Sending…" : "Send Request"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
