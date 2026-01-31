"use client";

import { authClient } from "@/lib/authClient";
import { ReactNode, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  role?: string; // Add 'role' if required
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const fetchSession = async () => {
      try {
        const result = await authClient.getSession();
        if (result.data) {
          setSession(result.data);
          setUser(result.data.user || null);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const signUp = async (data: SignUpData) => {
    console.log(data);
    try {
      const result = await authClient.signUp.email(data);
      if (result.error) {
        return { error: result.error };
      }
      if (data.role == "PROVIDER") {
       
      }
     if(data.role === "PROVIDER"){
        const createProvider = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              role: data.role,
            }),
          },
        );
        console.log(createProvider);
     }
      const sessionResult = await authClient.getSession();
      if (sessionResult.data) {
        setSession(sessionResult.data);
        setUser(sessionResult.data.user || null);
      }
      return { data: result.data, error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Failed to create account",
        },
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      console.log(result);

      if (result.error) {
        return { error: result.error };
      }

      // Refresh session after sign in
      const sessionResult = await authClient.getSession();
      if (sessionResult.data) {
        setSession(sessionResult.data);
        setUser(sessionResult.data.user || null);
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Failed to sign in",
        },
      };
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      // Clear session after sign out
      setSession(null);
      setUser(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const data = authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000",
    });

    console.log(data);
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    logout,
    handleGoogleLogin,
  };
}
