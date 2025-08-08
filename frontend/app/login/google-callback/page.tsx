"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    fetch("https://laboissim.onrender.com/auth/google/jwt/", {
      credentials: "include",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('JWT Error:', errorData);
          throw new Error(errorData.detail || "Failed to get JWT");
        }
        const data = await res.json();
        localStorage.clear(); // Clear all localStorage
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        // Fetch user data from backend
        const userRes = await fetch("https://laboissim.onrender.com/api/user/", {
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
        console.error('Authentication error:', error);
        router.push("/login?error=google&message=" + encodeURIComponent(error.message));
      });
  }, [router, setUser]);

  return <div>Connexion en cours...</div>;
} 