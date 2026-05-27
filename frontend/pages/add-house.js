import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AddHouseForm from "../components/AddHouseForm";

export default function AddHousePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/OAuthlogin");
  }, [status]);

  if (status === "loading" || !session) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <AddHouseForm token={session?.djangoAccessToken} />
      </div>
    </div>
  );
}
