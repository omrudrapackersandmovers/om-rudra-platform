import { Link, useLocation } from "react-router";
import SEO from "../../../../configs/seo";
import { company } from "../../../../data/company";

export default function QuoteReceived() {
  const received = useLocation().state?.quoteReceived === true;
  return <>
    <SEO title="Moving quote request confirmation" description="Review the next steps after sending your moving enquiry to Om Rudra Packers and Movers." noindex />
    <section className="bg-surface py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-primary font-semibold mb-4">YOUR MOVING ENQUIRY</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-6">{received ? "We received your quote request." : "Moving quote request confirmation"}</h1>
        <p className="text-text-muted leading-relaxed mb-8">{received ? "Our team will contact you to confirm your route, inventory and moving date before preparing your quote. Your enquiry is not a confirmed booking." : "This page is shown after a successful quote request. To send a new enquiry, please complete our moving quote form."}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a className="rounded-full bg-primary text-white px-6 py-3 font-semibold" href={`tel:${company.phone.primary}`}>Call our moving team</a>
          <Link className="rounded-full border border-border px-6 py-3 font-semibold" to="/get-quote">{received ? "Request another quote" : "Request a quote"}</Link>
        </div>
      </div>
    </section>
  </>;
}
