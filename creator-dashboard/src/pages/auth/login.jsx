import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Github, Chrome, FolderOpen } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import AuthGuardLogin from "../../components/auth/AuthGuardLogin";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const inputClass = (hasError) =>
    `w-full h-12 px-4 bg-[#F8F8F8] dark:bg-[#1A1A1A] border ${
      hasError
        ? "border-red-400 focus:border-red-500 dark:border-red-500/60"
        : "border-[#EEEEEE] dark:border-[#333333] focus:border-black dark:focus:border-white"
    } rounded-xl text-sm font-inter transition-all outline-none`;

  const validate = (data) => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        email: true,
        password: true,
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/logIn",
        formData,
      );
      const message =
        res?.data?.message ??
        (res?.data?.success
          ? "Logged in successfully."
          : "Login failed. Please try again.");
      if (res?.data?.success === false) {
        showToast("error", message);
        return;
      }
      router.push("/home");
      dispatch(setUser(res?.data?.user));
      localStorage.setItem("token", res?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
      showToast("success", message);
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
    <AuthGuardLogin>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FolderOpen size={18} className="text-white dark:text-black" />
            </div>

            <h1 className="text-3xl font-sora font-bold text-black dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-[#999999] mt-2 font-inter">
              Enter your details to access your dashboard
            </p>
          </div>

          <div className="bg-white dark:bg-[#111111] p-8 rounded-[32px] border border-[#EEEEEE] dark:border-[#222222] shadow-sm">
            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    : "Use the email tied to your account."}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-[10px] font-bold text-[#999999] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-black dark:text-white uppercase tracking-wider hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
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

              <button
                disabled={isSubmitting}
                className={`w-full h-12 rounded-xl font-bold text-sm transition-all shadow-lg shadow-black/10 mt-2 ${
                  isSubmitting
                    ? "bg-black/80 dark:bg-white/80 text-white dark:text-black cursor-not-allowed"
                    : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent dark:border-black/70" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#EEEEEE] dark:border-[#222222]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="bg-white dark:bg-[#111111] px-4 text-[#999999]">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-12 flex items-center justify-center gap-2 border border-[#EEEEEE] dark:border-[#333333] rounded-xl hover:bg-[#F8F8F8] dark:hover:bg-[#1A1A1A] transition-all font-semibold text-sm"
                >
                  <Chrome size={18} />
                  Google
                </button>
                <button
                  type="button"
                  className="h-12 flex items-center justify-center gap-2 border border-[#EEEEEE] dark:border-[#333333] rounded-xl hover:bg-[#F8F8F8] dark:hover:bg-[#1A1A1A] transition-all font-semibold text-sm"
                >
                  <Github size={18} />
                  GitHub
                </button>
              </div>

              <p className="text-center text-sm text-[#999999] mt-6">
                Don't have an account?{" "}
                <a
                  href="/auth/signup"
                  className="text-black dark:text-white font-bold hover:underline"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-[#999999] font-inter">
            &copy; 2026 Digital Realm Studio. All rights reserved.
          </p>
        </div>
      </div>
    </AuthGuardLogin>
  );
}
