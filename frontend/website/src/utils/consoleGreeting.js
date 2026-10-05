import { company } from "../data/company.js";

// Run from the browser entry point, outside React's render/effect lifecycle.
export function printConsoleGreeting() {
  console.info(
    "%c OM RUDRA %c Packers and Movers ",
    "background:#be123c;color:#fff;padding:8px 12px;border-radius:6px;font-size:18px;font-weight:800;",
    "color:#be123c;padding:8px;font-size:16px;font-weight:700;"
  );
  console.info(
    "%cHello, curious visitor! Thanks for taking a look under the hood.\n%cPlan a move: %s\nContact our team: %s\nBuilt by Unyrise Tech: https://unyrisetech.com/",
    "color:#be123c;font-weight:600;font-size:13px;",
    "color:#64748b;font-size:12px;line-height:1.8;",
    new URL("/get-quote", window.location.origin).href,
    new URL("/contact", window.location.origin).href
  );
  console.info("%c%s", "color:#64748b;font-size:11px;", company.legalName);
}
