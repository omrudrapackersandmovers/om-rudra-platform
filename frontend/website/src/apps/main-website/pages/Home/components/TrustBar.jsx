import { MapPin, Truck, Package, PhoneCall } from "lucide-react";

const items = [
  { icon: MapPin, title: "Local & interstate", description: "Find a route that fits your move." },
  { icon: Package, title: "Packing & handling", description: "Plan care for furniture and fragile items." },
  { icon: Truck, title: "A clear moving plan", description: "Agree on scope, transport and delivery." },
  { icon: PhoneCall, title: "Direct team support", description: "Discuss costs and requirements before booking." },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-b border-border py-8 sm:py-10" aria-label="Plan your move with confidence">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-7">
        {items.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Icon size={22} className="text-primary shrink-0 mt-1" aria-hidden="true" />
            <div><h2 className="text-sm sm:text-base font-bold mb-1">{title}</h2><p className="text-sm text-text-muted leading-relaxed">{description}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
