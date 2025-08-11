"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const accessParam = urlParams.get('access');
    const refreshParam = urlParams.get('refresh');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      console.error('Google OAuth error:', errorParam);
      router.push("/login?error=google&message=" + encodeURIComponent(errorParam));
      return;
    }

    if (!userParam || !accessParam || !refreshParam) {
      console.error('Missing OAuth parameters');
      router.push("/login?error=google&message=" + encodeURIComponent("Missing authentication data"));
      return;
    }

    try {
      // Decode the parameters
      const userData = JSON.parse(decodeURIComponent(userParam));
      const accessToken = decodeURIComponent(accessParam);
      const refreshToken = decodeURIComponent(refreshParam);

      // Store tokens consistently with auth provider
      localStorage.clear(); // Clear all localStorage
      localStorage.setItem("token", accessToken); // Store as "token" to match auth provider
      localStorage.setItem("refresh", refreshToken);

      // Create user object
      const role: "admin" | "member" = userData.is_staff || userData.is_superuser ? "admin" : "member";
      const user = {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.username,
        password: "",
        role,
        status: "active" as const,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        verified: true,
      };

      // Set user in auth context
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error('Error processing OAuth response:', error);
      router.push("/login?error=google&message=" + encodeURIComponent("Failed to process authentication"));
    }
  }, [router, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-lg text-slate-700">Connexion en cours...</p>
      </div>
    </div>
  );
} 