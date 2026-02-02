import getCookies from "@/constants/getCookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: any = {}
  ): Promise<ApiResponse<T>> {
    const cookies = await getCookies();
    console.log(cookies);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(cookies && { Cookie: cookies }),
          ...options.headers,
        },
        // withCredentials: true,
      });

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: { message: error.message },
        };
      }
      return {
        success: false,
        error: { message: "An error occurred" },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_URL);
