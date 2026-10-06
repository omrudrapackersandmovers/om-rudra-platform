import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "../../shared/components/ThemeToggle";
import { useAuth } from "../../../../store/AuthContext";
import { companyConfig } from "../../../../configs/company.config";
import {
  useResendLogin2FAOtpMutation,
  useForgotPasswordRequestOtpMutation,
  useForgotPasswordResetMutation,
} from "../../../../store/apiSlices/authApiSlice";

const carouselSlides = [
  {
    image: "/images/process-for-home-service/transport-v2.webp",
    tag: "Safe Transportation",
    title: "Transport planned around your move",
    description: "Confirm vehicle arrangements, delivery timing, and available transit cover before moving day.",
  },
  {
    image: "/images/process-for-home-service/packing-v2.webp",
    tag: "Expert Packaging",
    title: "Protective packing for your belongings",
    description: "Discuss suitable materials and special handling for furniture, appliances, and fragile items.",
  },
  {
    image: "/images/process-for-home-service/loading-v2.webp",
    tag: "Trained Operations Crew",
    title: "Careful loading and handling",
    description: "Plan loading access, equipment, and crew requirements for your belongings.",
  },
  {
    image: "/images/process-for-home-service/unpacking-v2.webp",
    tag: "Complete Settlement",
    title: "Unpacking and placement at your new home",
    description: "Include unpacking, furniture assembly, and placement in your agreed service scope when needed.",
  },
  {
    image: "/images/process-for-home-service/settled-v2.webp",
    tag: "Customer Satisfaction",
    title: "Check your belongings and settle in",
    description: "Review delivered items and their placement with the team before completing the handover.",
  },
];

const Login = () => {
  // Modes: "credentials" | "2fa" | "forgot_request" | "forgot_reset"
  const [mode, setMode] = useState("credentials");

  // Credentials State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2FA State
  const [challengeToken, setChallengeToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // General State
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, verify2FA } = useAuth();
  const navigate = useNavigate();

  const [resendOtp] = useResendLogin2FAOtpMutation();
  const [requestResetOtp] = useForgotPasswordRequestOtpMutation();
  const [resetPassword] = useForgotPasswordResetMutation();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Resend OTP Cooldown Timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Credentials
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.require2FA) {
        setChallengeToken(res.challengeToken);
        setMaskedEmail(res.emailMasked);
        setOtpCode("");
        setMode("2fa");
        setResendCooldown(60);
      } else {
        navigate("/leads");
      }
    } catch (err) {
      setError(err.data?.error || err.message || "Invalid username/email or password");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit 2FA OTP Code
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verify2FA(challengeToken, otpCode);
      navigate("/leads");
    } catch (err) {
      setError(err.data?.error || err.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend 2FA OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);

    try {
      const res = await resendOtp({ challengeToken }).unwrap();
      setSuccessMessage(res.message || "A fresh OTP code has been sent to your email.");
      setResendCooldown(60);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.data?.error || err.message || "Failed to resend OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 (Request OTP)
  const handleForgotRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await requestResetOtp({
        identifier: forgotIdentifier,
      }).unwrap();
      setResetToken(res.resetToken);
      setMaskedEmail(res.emailMasked);
      setResetOtp("");
      setMode("forgot_reset");
      setSuccessMessage(`Reset code sent to ${res.emailMasked}`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.data?.error || err.message || "Failed to request password reset code.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 2 (Reset Password)
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        resetToken,
        otp: resetOtp,
        newPassword,
      }).unwrap();
      setSuccessMessage(res.message || "Password updated successfully! Please sign in.");
      setPassword(newPassword);
      setMode("credentials");
    } catch (err) {
      setError(err.data?.error || err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Header title & description based on current authentication mode
  const getHeaderContent = () => {
    switch (mode) {
      case "forgot_request":
        return {
          title: "Forgot Password",
          subtitle: "Enter your username or registered email to receive a reset code.",
        };
      case "forgot_reset":
        return {
          title: "Reset Password",
          subtitle: `Enter the 6-digit code sent to ${maskedEmail || "your email"} and set a new password.`,
        };
      case "2fa":
        return {
          title: "Two-Factor Verification",
          subtitle: `Enter the 6-digit verification code sent to ${maskedEmail || "your email"}.`,
        };
      default:
        return {
          title: "Sign In",
          subtitle: "Welcome back! Please enter your details to sign in.",
        };
    }
  };
  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-900 flex flex-col lg:flex-row">
      {/* Left Form Column */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white dark:bg-slate-900">
        <div className="absolute top-6 right-6 lg:right-[calc(50%+1.5rem)]"><ThemeToggle /></div>
        {/* Top Header / Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={companyConfig.logo.primary}
              alt={companyConfig.name}
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
        </div>

        {/* Center: Auth Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto py-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {headerContent.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {headerContent.subtitle}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-300" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: Standard Username/Email & Password */}
          {mode === "credentials" && (
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username or email"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Signing in..." : "Sign In"}</span>
              </button>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccessMessage("");
                    setForgotIdentifier(username);
                    setMode("forgot_request");
                  }}
                  className="text-xs text-brand-600 dark:text-brand-300 hover:text-brand-700 dark:hover:text-brand-300 font-medium hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: 2FA Email OTP Verification */}
          {mode === "2fa" && (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-rose-50 dark:bg-rose-950 text-brand-600 dark:text-brand-300 rounded-2xl border border-rose-100 dark:border-rose-800 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-center text-xl font-mono tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("credentials");
                  }}
                  className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendOtp}
                  className="text-brand-600 dark:text-brand-300 hover:text-brand-700 dark:hover:text-brand-300 font-semibold disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: Forgot Password - Request OTP */}
          {mode === "forgot_request" && (
            <form onSubmit={handleForgotRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Username or Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Enter username or email"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Sending Code..." : "Send Reset Code"}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("credentials");
                  }}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: Forgot Password - Verify OTP & Set New Password */}
          {mode === "forgot_reset" && (
            <form onSubmit={handleForgotResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  6-Digit Reset OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-center text-xl font-mono tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || resetOtp.length !== 6 || !newPassword}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Updating Password..." : "Update Password & Sign In"}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("credentials");
                  }}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          )}
        </div>

      {/* Bottom copyright info for left column */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center sm:text-left">
        <span>© {new Date().getFullYear()} {companyConfig.name}. All rights reserved.</span>
      </div>
    </div>

    {/* Right Column: Deep Brand Showcase with Real Moving Service Carousel (Desktop Only) */}
    <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden flex-col justify-between p-10 xl:p-14 text-white bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950">
      {/* Ambient atmospheric glow */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

      {/* Top Support Bar */}
      <div className="flex items-center justify-end z-10">
        <a
          href={`tel:${companyConfig.phone}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 text-xs font-medium text-slate-200 border border-white/10 backdrop-blur-md transition-colors"
        >
          <Headphones className="w-3.5 h-3.5 text-rose-300" />
          <span>Support: {companyConfig.phone}</span>
        </a>
      </div>

      {/* Center: Showcase Card with Carousel */}
      <div className="relative z-10 max-w-lg mx-auto my-auto w-full space-y-5">
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
          {/* Carousel Image Display */}
          <div className="relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner group">
            <img
              src={carouselSlides[currentSlide].image}
              alt={carouselSlides[currentSlide].title}
              key={carouselSlides[currentSlide].image}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />

            {/* Manual Arrows */}
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
              }
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              title="Previous slide"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
              }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              title="Next slide"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Text */}
          <div className="space-y-1.5 pt-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              {carouselSlides[currentSlide].title}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {carouselSlides[currentSlide].description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? "w-7 bg-brand-600"
                    : "w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Descriptive Tagline Under Card */}
        <div className="space-y-1 text-center">
          <h3 className="text-base font-bold text-white tracking-tight">
            {companyConfig.tagline || "Safer Moves, Brighter Tomorrows"}
          </h3>
          <p className="text-xs text-rose-100/80 max-w-sm mx-auto leading-relaxed">
            Serving Bihar, Jharkhand & Pan-India relocations with verified staff and transparent rates.
          </p>
        </div>
      </div>

      {/* Bottom Branches List */}
      <div className="flex items-center justify-between z-10 text-[11px] text-rose-100/80 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
          <span>Govt & IBA Approved Mover</span>
        </div>
        <div className="flex items-center gap-2.5 font-medium text-slate-300">
          <span>Patna</span>
          <span>•</span>
          <span>Ranchi</span>
          <span>•</span>
          <span>Jamshedpur</span>
          <span>•</span>
          <span>Dhanbad</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
