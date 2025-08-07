"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    console.log("Google callback page loaded");
    console.log("Search params:", Object.fromEntries(searchParams.entries()));
    
    // Check if we have user data from URL parameters (new flow)
    const userParam = searchParams.get('user');
    const accessParam = searchParams.get('access');
    const refreshParam = searchParams.get('refresh');

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

      fetch(`${backendUrl}/auth/google/jwt/`, {
        credentials: "include",
      })
        .then(async (res) => {
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
        })
        .catch((error) => {
          console.error("Google callback error:", error);
          router.push("/login?error=google");
        });
    }
  }, [router, setUser, searchParams]);

  return <div>Connexion en cours...</div>;
} 