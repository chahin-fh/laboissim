"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get URL parameters using window.location
        const urlParams = new URLSearchParams(window.location.search);
        console.log("Google callback page loaded");
        console.log("Search params:", Object.fromEntries(urlParams.entries()));
        
        // Check if we have user data from URL parameters (new flow)
        const userParam = urlParams.get('user');
        const accessParam = urlParams.get('access');
        const refreshParam = urlParams.get('refresh');

        console.log("User param:", userParam);
        console.log("Access param:", accessParam);
        console.log("Refresh param:", refreshParam);

        if (userParam && accessParam && refreshParam) {
          try {
            // Decode and parse user data from URL
            const userData = JSON.parse(decodeURIComponent(userParam));
            const accessToken = decodeURIComponent(accessParam);
            const refreshToken = decodeURIComponent(refreshParam);

            // Store tokens
            localStorage.clear();
            localStorage.setItem("access", accessToken);
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

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/dashboard");
          } catch (error) {
            console.error("Error parsing user data:", error);
            router.push("/login?error=google");
          }
        } else {
          // Fallback to old flow (for backward compatibility)
          const backendUrl = process.env.NODE_ENV === 'production' 
            ? 'https://laboissim.onrender.com' 
            : 'http://localhost:8000';

          const res = await fetch(`${backendUrl}/auth/google/jwt/`, {
            credentials: "include",
          });
          
          if (!res.ok) throw new Error("Failed to get JWT");
          const data = await res.json();
          localStorage.clear();
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          
          const userRes = await fetch(`${backendUrl}/api/user/`, {
            headers: {
              "Authorization": `Bearer ${data.access}`,
            },
          });
          if (!userRes.ok) throw new Error("Failed to fetch user data");
          const userData = await userRes.json();
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
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        router.push("/login?error=google");
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [router, setUser]);

  return <div>Connexion en cours...</div>;
} 