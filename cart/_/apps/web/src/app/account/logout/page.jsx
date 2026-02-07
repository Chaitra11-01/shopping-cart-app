import useAuth from "@/utils/useAuth";
import { ShoppingCart } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
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

        {/* Card */}
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2 text-center">
            Sign out
          </h1>
          <p className="text-center text-black text-opacity-60 dark:text-white dark:text-opacity-60 mb-8">
            Are you sure you want to sign out?
          </p>

          <button
            onClick={handleSignOut}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-gray-700 dark:active:bg-gray-300 transition-colors duration-200"
          >
            Sign Out
          </button>

          <div className="mt-4">
            <a
              href="/"
              className="block text-center py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </a>
          </div>
        </div>

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
