import { Context, Next } from "hono";
import { Bindings } from "../types";

export const verifyTurnstile = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
  const secretKey = c.env.TURNSTILE_SECRET_KEY;

  // In local development or if no secret is configured, bypass Turnstile
  if (!secretKey) {
    return await next();
  }

  const body = (await c.req.raw.clone().json().catch(() => ({}))) as Record<string, any>;
  const token = body["cf-turnstile-response"] || body["turnstileToken"];

  if (!token) {
    return c.json({ error: "Turnstile verification token missing." }, 400);
  }

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);
  formData.append("remoteip", c.req.header("CF-Connecting-IP") || "");

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const result = await res.json() as { success: boolean };
    if (!result.success) {
      return c.json({ error: "Security check failed. Please try again." }, 403);
    }
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return c.json({ error: "Could not complete security validation." }, 500);
  }

  await next();
};
