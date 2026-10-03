import { Star } from "lucide-react";

/**
 * TestimonialsBlock — only real, client-supplied testimonials go here.
 *
 * This component ships empty (no placeholder quotes) until the client
 * provides real testimonials. An empty array renders nothing.
 *
 * When testimonials are ready:
 * - Add them to the testimonials array below
 * - Each entry: { name, location, text, rating (1–5) }
 * - Never invent or paraphrase — use the customer's exact words
 */
const testimonials = [
  // TODO: add real testimonials from client — do NOT add invented quotes
  // Example shape (remove this comment when adding real ones):
  // {
  //   name: "Amit Kumar",
  //   location: "Patna to Delhi",
  //   text: "...",
  //   rating: 5,
  // },
];

const TestimonialsBlock = () => {
  if (testimonials.length === 0) return null;

  return (
    <section
      className="bg-background py-14 sm:py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-text mb-3"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
          >
            What families say after their move
          </h2>
          <p className="text-text-muted text-base leading-relaxed">
            Real words from people who trusted us with their belongings.
          </p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
        >
          {testimonials.map((t, i) => (
            <li
              key={i}
              className="flex flex-col p-6 rounded-[var(--radius-md)] border border-border bg-surface"
            >
              {/* Stars */}
              {t.rating && (
                <div
                  className="flex items-center gap-0.5 mb-4"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      strokeWidth={0}
                      fill={
                        idx < t.rating
                          ? "var(--color-accent)"
                          : "var(--color-border)"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-sm text-text leading-relaxed flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Attribution */}
              <footer className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold font-display shrink-0"
                  aria-hidden="true"
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text leading-tight">
                    {t.name}
                  </p>
                  {t.location && (
                    <p className="text-xs text-text-muted">{t.location}</p>
                  )}
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TestimonialsBlock;
