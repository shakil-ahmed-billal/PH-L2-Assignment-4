"use client";

import { api } from "@/lib/api";
import { authClient } from "@/lib/authClient";
import { ReactNode, useEffect, useState } from "react";

/* =====================
   Types
===================== */

interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role?: "USER" | "PROVIDER" | "ADMIN";
  providerId?: string;
  providerProfile?: any;
  userId?: any ;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "PROVIDER";
}

/* =====================
   Provider Wrapper
===================== */

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/* =====================
   useAuth Hook
===================== */

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* =====================
     Load Session
  ===================== */

  useEffect(() => {
    const loadSession = async () => {
      try {
        const result = await authClient.getSession();

        if (!result?.data) {
          setUser(null);
          setSession(null);
          return;
        }

        setSession(result.data);

        const authUser = result.data.user as AuthUser;

        // PROVIDER হলে provider profile fetch
        if (authUser.role === "PROVIDER") {
          try {
            const providerRes = await api.get(
              `/api/provider/profile/${authUser.id}`,
            );

            if (providerRes?.success) {
              setUser({
                ...authUser,
                id: providerRes.data.id ,
                providerProfile: providerRes.data,
                userId: authUser.id
              });
            } else {
              setUser(authUser);
            }
          } catch {
            setUser(authUser);
          }
        } else {
          setUser(authUser);
        }
      } catch (error) {
        console.error("Session load failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /* =====================
     Sign Up
  ===================== */

  const signUp = async (data: SignUpData) => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        return { error: result.error };
      }

      // PROVIDER হলে provider create
      if (data.role === "PROVIDER") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            role: "PROVIDER",
          }),
        });
      }

      // Refresh session
      const sessionResult = await authClient.getSession();

      if (sessionResult.data) {
        setSession(sessionResult.data);
        setUser(sessionResult.data.user as AuthUser);
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Failed to sign up",
        },
      };
    }
  };

  /* =====================
     Sign In
  ===================== */

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        return { error: result.error };
      }

      const sessionResult = await authClient.getSession();

      if (sessionResult.data) {
        const authUser = sessionResult.data.user as AuthUser;

        // PROVIDER হলে provider profile fetch
        if (authUser.role === "PROVIDER") {
          const providerRes = await api.get(
            `/api/provider/profile/${authUser.id}`,
          );

          if (providerRes?.success) {
            setUser({
              ...authUser,
              providerId: providerRes.data.id,
              providerProfile: providerRes.data,
            });
          } else {
            setUser(authUser);
          }
        } else {
          setUser(authUser);
        }

        setSession(sessionResult.data);
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

  /* =====================
     Logout
  ===================== */

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* =====================
     Google Login
  ===================== */

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000",
    });
  };

  /* =====================
     Return
  ===================== */

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
