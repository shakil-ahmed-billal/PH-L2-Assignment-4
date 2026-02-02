
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();

      console.log(cookieStore.toString());
     

      const res = await fetch(`${API_URL}/api/auth/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      console.log(res)
      const session = await res.json();

      if (session === null) {
        return { data: null, error: { message: "Session is missing." } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};