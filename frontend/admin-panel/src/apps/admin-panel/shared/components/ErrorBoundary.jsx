import React from "react";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { companyConfig } from "../../../../configs/company.config";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to remote logging service (e.g., Sentry, Cloudflare Logs)
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    });
    window.location.href = "/";
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  handleCopyDetails = () => {
    const details = `[${companyConfig.name} - System Diagnostic]
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error:
${this.state.error?.toString() || "Unknown error"}

Component Stack:
${this.state.errorInfo?.componentStack || "No stack trace available"}
`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(details).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2500);
      });
    }
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, copied, showDetails } = this.state;

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
            {/* Header with Emergency Badge */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-b from-rose-50/50 to-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded-full">
                      System Exception
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {companyConfig.shortName} OS
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Something went wrong
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    The operations interface encountered an unexpected error while rendering this view. Your saved database records are safe.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Action Section */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reload Page</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReset}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-98"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Go to Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleCopyDetails}
                  className="flex items-center gap-2 ml-auto text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                  title="Copy technical diagnostic report"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Report Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Diagnostic</span>
                    </>
                  )}
                </button>
              </div>

              {/* Collapsible Technical Diagnostics */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-100">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-semibold text-slate-300 font-mono">
                      Technical Error Stack
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({showDetails ? "Click to collapse" : "Click to view"})
                    </span>
                  </div>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showDetails && (
                  <div className="p-4 pt-1 border-t border-slate-800 space-y-3 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto">
                    <div>
                      <div className="text-rose-400 font-bold mb-1">Exception:</div>
                      <div className="bg-black/50 p-2.5 rounded-lg text-rose-300 break-all select-all">
                        {error?.toString() || "No error message provided"}
                      </div>
                    </div>

                    {errorInfo?.componentStack && (
                      <div>
                        <div className="text-slate-400 font-bold mb-1">Component Stack:</div>
                        <pre className="bg-black/50 p-2.5 rounded-lg text-slate-300 whitespace-pre-wrap overflow-x-auto text-[10px] select-all">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Support & Helpline Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <p>
                  Need help? Contact system administration or operations team:
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-0.5">
                  <a
                    href={`tel:${companyConfig.phone}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{companyConfig.phone}</span>
                  </a>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <a
                    href={`mailto:${companyConfig.email}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 break-all sm:break-normal"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{companyConfig.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
