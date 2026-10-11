import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MessageCircle, X, Send, Loader2, ArrowUpRight, RotateCcw } from "lucide-react";
import { company } from "../../../../data/company";
import { getQuickAnswer, starterQuestions } from "../../../../data/relocationAssistant";

const welcome = { role: "assistant", content: "Hi! I’m Om Rudra’s AI moving assistant. Ask me about packing, planning your move, vehicle transport or our services.", kind: "welcome" };
const apiBase = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8787" : "https://api.omrudrapackersandmovers.com")).trim().replace(/\/+$/, "").replace(/\/api$/, "");

export default function RelocationChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const launcher = launcherRef.current;
    if (!open) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      launcher?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, pending, open]);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function sendQuestion(value) {
    const content = value.trim();
    if (!content || content.length > 2000 || requestRef.current) return;
    const conversation = [...messages.filter((item) => item.kind !== "welcome"), { role: "user", content }].slice(-9).map(({ role, content: text }) => ({ role, content: text }));
    // Keep the API's bounded context under its total character limit.
    while (conversation.length > 1 && conversation.reduce((sum, item) => sum + item.content.length, 0) > 12000) conversation.shift();
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 25000);
    setMessages((previous) => [...previous, { role: "user", content }]);
    setQuestion("");
    setError("");
    setPending(true);
    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }), signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          setError(result.error || "Please wait a minute before trying again.");
          setQuestion(content);
          setMessages((previous) => previous.slice(0, -1));
          return;
        }
        throw new Error("Assistant unavailable");
      }
      if (typeof result.answer !== "string" || !result.answer.trim()) throw new Error("Empty answer");
      setMessages((previous) => [...previous, { role: "assistant", content: result.answer.slice(0, 2000), kind: "ai" }]);
    } catch {
      const answer = getQuickAnswer(content);
      if (answer) {
        setMessages((previous) => [...previous, { role: "assistant", content: answer, kind: "guide" }]);
      } else {
        setMessages((previous) => previous.slice(0, -1));
        setQuestion(content);
        setError("The AI assistant is unavailable right now. Try again, choose a common question, or speak to our team.");
      }
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
      setPending(false);
    }
  }

  return (
    <>
      <button ref={launcherRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="relocation-chat" className="chat-launcher fixed right-4 md:right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-3 shadow-lg hover:bg-accent transition-colors" aria-label="Ask our moving assistant">
        <MessageCircle size={21} aria-hidden="true" />
        <span className="text-sm font-semibold">Moving help</span>
      </button>
      <dialog ref={dialogRef} id="relocation-chat" className="relocation-chat rounded-2xl border border-border bg-background text-text shadow-2xl p-0" aria-labelledby="chat-title" aria-describedby="chat-disclaimer" onCancel={() => setOpen(false)} onClick={(event) => { if (event.target === dialogRef.current) { const rect = dialogRef.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false); } }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-5 py-4 bg-primary text-white shrink-0">
            <div className="rounded-xl bg-white/15 p-2"><MessageCircle size={22} aria-hidden="true" /></div>
            <div className="flex-1"><h2 id="chat-title" className="text-base font-bold">Your moving assistant</h2><p className="text-xs text-white/80">Om Rudra · AI guidance</p></div>
            <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-white/15" aria-label="Close moving assistant"><X size={20} /></button>
          </div>
          <div ref={logRef} role="log" aria-label="Moving assistant conversation" aria-live="polite" aria-relevant="additions" className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[92%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-primary text-white rounded-br-sm" : "bg-surface text-text rounded-bl-sm"}`}>
                  <span className="sr-only">{message.role === "user" ? "You" : "Moving assistant"}: </span>
                  {message.kind === "guide" && <p className="text-[11px] font-semibold text-primary mb-2">Quick guide · AI currently unavailable</p>}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}
            {messages.length === 1 && <div className="flex flex-wrap gap-2">{starterQuestions.map((item) => <button key={item} type="button" disabled={pending} onClick={() => sendQuestion(item)} className="text-xs text-primary text-left rounded-xl border border-primary/20 px-3 py-2.5 hover:bg-brand-soft disabled:opacity-50">{item}</button>)}</div>}
            {pending && <p role="status" className="flex items-center gap-2 text-xs text-text-muted"><Loader2 size={15} className="animate-spin" aria-hidden="true" />Thinking about your move…</p>}
          </div>
          <div className="px-4 pt-3 pb-4 border-t border-border shrink-0">
            <div className="flex items-center gap-3 mb-3 text-xs font-semibold">
              <Link to="/get-quote" onClick={() => setOpen(false)} className="text-primary inline-flex items-center gap-1">Get a quote<ArrowUpRight size={14} /></Link>
              <a href={`https://wa.me/${company.phone.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary">Talk to the team</a>
              <button type="button" disabled={pending} onClick={() => { setMessages([welcome]); setError(""); setQuestion(""); inputRef.current?.focus(); }} className="ml-auto p-1 text-text-muted hover:text-primary disabled:opacity-40" aria-label="Start a new conversation"><RotateCcw size={15} /></button>
            </div>
            {error && <p role="alert" className="text-xs text-danger mb-2">{error}</p>}
            <form onSubmit={(event) => { event.preventDefault(); sendQuestion(question); }} className="flex items-end gap-2">
              <label htmlFor="moving-question" className="sr-only">Your relocation question</label>
              <textarea ref={inputRef} id="moving-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={2000} rows={2} placeholder="Ask a moving question…" disabled={pending} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); sendQuestion(question); } }} className="flex-1 min-w-0 resize-none rounded-xl border border-border bg-surface px-3 py-2 text-base md:text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60" />
              <button type="submit" disabled={pending || !question.trim()} aria-label="Send question" className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-accent disabled:opacity-40"><Send size={18} /></button>
            </form>
            <p id="chat-disclaimer" className="text-[10px] leading-relaxed text-text-muted mt-2">AI answers can be mistaken. The team confirms quotes and bookings. Messages are processed by Cloudflare AI; avoid sensitive details. <Link to="/privacy" onClick={() => setOpen(false)} className="underline">Privacy</Link></p>
          </div>
        </div>
      </dialog>
    </>
  );
}
