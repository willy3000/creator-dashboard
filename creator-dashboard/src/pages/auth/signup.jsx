import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, FolderOpen } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/constants";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const inputClass = (hasError) =>
    `w-full h-12 px-4 bg-[#F8F8F8] dark:bg-[#1A1A1A] border ${
      hasError
        ? "border-red-400 focus:border-red-500 dark:border-red-500/60"
        : "border-[#EEEEEE] dark:border-[#333333] focus:border-black dark:focus:border-white"
    } rounded-xl text-sm font-inter transition-all outline-none`;

  const validate = (data) => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.username.trim()) {
      nextErrors.username = "Username is required.";
    } else if (data.username.trim().length < 2) {
      nextErrors.username = "Username must be at least 2 characters.";
    }

    if (!data.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(data.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!data.password) {
      nextErrors.password = "Password is required.";
    } else if (data.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!data.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (data.confirmPassword !== data.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!data.terms) {
      nextErrors.terms = "You must agree to the terms.";
    }

    return nextErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  };

  const handleChange = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    if (touched[field]) {
      const nextErrors = validate(nextData);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  };

  const showToast = (type, message) => {
    if (type === "success") {
      toast.success(message);
      return;
    }
    toast.error(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setTouched({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        terms: true,
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/signUp`,
        formData,
      );
      const message =
        res?.data?.message ??
        (res?.data?.success
          ? "Account created successfully."
          : "Signup failed. Please try again.");
      if (res?.data?.success === false) {
        showToast("error", res.data.error);
        return;
      }
      showToast("success", message);
      router.push("/auth/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Something went wrong. Please try again.";
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-100 space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FolderOpen size={18} className="text-white dark:text-black" />
          </div>
          <h1 className="text-3xl font-sora font-bold text-black dark:text-white tracking-tight">
            Create account
          </h1>
          <p className="text-[#999999] mt-2 font-inter">
            Join 10k+ creators using Digital Realm Studio
          </p>
        </div>

        <div className="bg-white dark:bg-[#111111] p-8 rounded-[32px] border border-[#EEEEEE] dark:border-[#222222] shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <input
                name="username"
                type="text"
                required
                placeholder="Alex Rivet"
                className={inputClass(touched.username && errors.username)}
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("name")}
              />
              <p
                className={`text-[10px] mt-2 ml-1 ${
                  touched.username && errors.username
                    ? "text-red-500"
                    : "text-[#999999]"
                }`}
              >
                {touched.username && errors.username
                  ? errors.username
                  : "Use your real name so collaborators can find you."}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="alex@example.com"
                className={inputClass(touched.email && errors.email)}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
              />
              <p
                className={`text-[10px] mt-2 ml-1 ${
                  touched.email && errors.email
                    ? "text-red-500"
                    : "text-[#999999]"
                }`}
              >
                {touched.email && errors.email
                  ? errors.email
                  : "We will only use this for account access."}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className={inputClass(touched.password && errors.password)}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p
                className={`text-[10px] mt-2 ml-1 italic ${
                  touched.password && errors.password
                    ? "text-red-500"
                    : "text-[#999999]"
                }`}
              >
                {touched.password && errors.password
                  ? errors.password
                  : "Must be at least 8 characters"}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-2 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className={inputClass(
                    touched.confirmPassword && errors.confirmPassword,
                  )}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p
                className={`text-[10px] mt-2 ml-1 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "text-red-500"
                    : "text-[#999999]"
                }`}
              >
                {touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : "Re-enter your password to confirm."}
              </p>
            </div>

            <div className="px-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.terms}
                  onChange={(e) => handleChange("terms", e.target.checked)}
                  onBlur={() => handleBlur("terms")}
                  className="w-4 h-4 rounded border-[#DDDDDD] dark:border-[#333333]"
                />
                <span className="text-xs text-[#999999]">
                  I agree to the{" "}
                  <a href="#" className="text-black dark:text-white underline">
                    Terms & Conditions
                  </a>
                </span>
              </div>
              <p
                className={`text-[10px] mt-2 ml-1 ${
                  touched.terms && errors.terms
                    ? "text-red-500"
                    : "text-[#999999]"
                }`}
              >
                {touched.terms && errors.terms
                  ? errors.terms
                  : "Required to create your account."}
              </p>
            </div>

            <button
              disabled={isSubmitting}
              className={`w-full h-12 rounded-xl font-bold text-sm transition-all shadow-lg shadow-black/10 ${
                isSubmitting
                  ? "bg-black/80 dark:bg-white/80 text-white dark:text-black cursor-not-allowed"
                  : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent dark:border-black/70" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-[#999999] mt-6">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-black dark:text-white font-bold hover:underline"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-[#999999] font-inter">
          &copy; 2026 AssetsFlow Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
