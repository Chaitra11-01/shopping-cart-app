import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { ShoppingCart } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-in. Please try again or use a different method.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-in method. Try another option.",
        EmailCreateAccount:
          "This email can't be used to create an account. It may already exist.",
        Callback: "Something went wrong during sign-in. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Incorrect email or password. Try again or reset your password.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration:
          "Sign-in isn't working right now. Please try again later.",
        Verification: "Your sign-in link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-inter flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white dark:text-black" />
          </div>
        </div>

        {/* Form */}
        <form
          noValidate
          onSubmit={onSubmit}
          className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-8"
        >
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2 text-center">
            Welcome back
          </h1>
          <p className="text-center text-black text-opacity-60 dark:text-white dark:text-opacity-60 mb-8">
            Sign in to continue shopping
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black dark:text-white">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black dark:text-white">
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg border-2 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-gray-700 dark:active:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-black text-opacity-60 dark:text-white dark:text-opacity-60">
              Don't have an account?{" "}
              <a
                href={`/account/signup${
                  typeof window !== "undefined" ? window.location.search : ""
                }`}
                className="text-black dark:text-white font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-black text-opacity-60 dark:text-white dark:text-opacity-60 hover:text-opacity-100 dark:hover:text-opacity-100 transition-opacity"
          >
            ← Back to shopping
          </a>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
