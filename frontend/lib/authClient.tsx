import { createAuthClient } from "better-auth/react";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL: API_URL,  
  fetchOptions: {
    credentials: 'include', 
  },
});

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  fetchOptions: {
    credentials: 'include',
  }
});

