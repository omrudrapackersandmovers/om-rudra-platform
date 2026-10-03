import React from "react";
import { AlertTriangle, RotateCcw, Home, PhoneCall, ChevronDown, ChevronUp } from "lucide-react";
import { company } from "@/data/company";
import Button from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to error monitoring (e.g. Sentry / LogRocket)
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
          <div className="max-w-xl w-full p-6 sm:p-10 rounded-3xl bg-surface border border-border shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Warning Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle size={32} />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                System Resilience Notice
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">
                Something Went Unexpectedly Wrong
              </h1>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md mx-auto">
                We encountered a temporary interface issue while loading this view. Your relocation inquiry and saved data remain completely secure.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={this.handleReload}
                variant="accent"
                size="sm"
                icon={<RotateCcw size={15} />}
                showArrow={false}
              >
                Reload Page
              </Button>

              <Button
                to="/"
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                icon={<Home size={15} />}
                showArrow={false}
              >
                Return to Homepage
              </Button>

              {company.phone.primary && (
                <Button
                  href={`tel:${company.phone.primary}`}
                  variant="outline"
                  size="sm"
                  icon={<PhoneCall size={15} className="text-primary" />}
                  showArrow={false}
                >
                  Call Helpline
                </Button>
              )}
            </div>

            {/* Support Reassurance */}
            <div className="pt-4 border-t border-border/80 text-xs text-text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>Need immediate move assistance?</span>
              <a
                href={`mailto:${company.email.general}`}
                className="font-bold text-primary hover:underline"
              >
                {company.email.general}
              </a>
            </div>

            {/* Developer Diagnostic Accordion (visible in dev mode or toggle) */}
            {isDev && this.state.error && (
              <div className="text-left pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex items-center justify-between w-full text-xs font-semibold text-text-muted hover:text-text py-1"
                >
                  <span>Technical Diagnostics (Dev Mode)</span>
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-black/90 text-amber-400 font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap leading-tight">
                    <p className="font-bold text-red-400 mb-1">{this.state.error?.toString()}</p>
                    <p className="text-white/60">{this.state.errorInfo?.componentStack}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
