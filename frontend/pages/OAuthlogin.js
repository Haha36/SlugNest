import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // If already logged in, skip this page
  useEffect(() => {
    if (session) router.push("/my-listings");
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Choose a Verification Method to Continue
        </h1>
        {router.query.error === "AccessDenied" && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded p-3">
            Access denied. Please use your @ucsc.edu account.
          </p>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/my-listings" })}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors"
        >
          Verify with your @ucsc.edu account
        </button>
      </div>
    </div>
  );
}
