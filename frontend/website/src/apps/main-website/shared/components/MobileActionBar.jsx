import { Link } from "react-router";
import { PhoneCall, MessageCircle } from "lucide-react";
import { company } from "../../../../data/company";

/**
 * MobileActionBar — persistent Call + WhatsApp bar, fixed to the
 * bottom of the viewport on mobile only (hidden on md and above).
 *
 * This is the highest-converting element for this industry on mobile.
 * It must be present on every page via MainWebsiteLayout.
 */
const MobileActionBar = () => {
  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}`
    : "#";

  const callUrl = company.phone.primary
    ? `tel:${company.phone.primary}`
    : "#";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Quick contact actions"
    >
      {/* Safe area spacer for iOS notch */}
      <div
        className="grid grid-cols-2 border-t border-border bg-background"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={callUrl}
          className="flex items-center justify-center gap-2.5 py-4 text-sm font-semibold text-primary border-r border-border active:bg-surface transition-colors duration-150"
          aria-label="Call us now"
        >
          <PhoneCall size={18} strokeWidth={2} />
          Call Now
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-4 text-sm font-semibold text-success active:bg-surface transition-colors duration-150"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle size={18} strokeWidth={2} />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default MobileActionBar;
