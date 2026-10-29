import assert from "node:assert/strict";
import { trackEnquiry, consentKey, measurementId } from "../src/utils/analytics.js";

let consent = null;
const inserted = [];
globalThis.document = { createElement: () => ({}), head: { appendChild: element => inserted.push(element) } };
globalThis.window = {
  location: { hostname: "omrudrapackersandmovers.com", pathname: "/get-quote", search: "?phone=private&gclid=example" },
  localStorage: { getItem: key => key === consentKey ? consent : null },
};
trackEnquiry("generate_lead", "moving_quote");
assert.equal(window.dataLayer, undefined, "No measurement before consent");
consent = "declined";
trackEnquiry("click_to_call", "website");
assert.equal(window.dataLayer, undefined, "No measurement after declining");
consent = "accepted";
trackEnquiry("generate_lead", "moving_quote");
const events = () => window.dataLayer.map(args => Array.from(args));
assert.equal(inserted.length, 1, "Loads the tag once");
assert.equal(events().filter(event => event[1] === "generate_lead").length, 1);
assert.equal(events().at(-1)[2].page_location, "https://omrudrapackersandmovers.com/get-quote");
assert(!JSON.stringify(events()).includes("private"), "Never include URL query data");
const count = window.dataLayer.length;
trackEnquiry("generate_lead", "someone@example.com");
trackEnquiry("arbitrary_event", "moving_quote");
assert.equal(window.dataLayer.length, count, "Reject unknown labels and events");
trackEnquiry("click_whatsapp", "website");
assert.equal(events().at(-1)[1], "click_whatsapp", "Contact clicks remain distinct from submitted leads");
window[`ga-disable-${measurementId}`] = true;
const disabledCount = window.dataLayer.length;
trackEnquiry("generate_lead", "moving_quote");
assert.equal(window.dataLayer.length, disabledCount, "Revocation stops measurement");
console.log("Enquiry analytics checks passed: consent, event allowlist, query redaction and contact/lead separation.");
