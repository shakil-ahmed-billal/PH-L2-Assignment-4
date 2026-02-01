"use client"

import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-background to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="pt-12 pb-8 px-6">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                <Shield className="h-12 w-12 text-red-600" />
              </div>
              <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xl font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className="text-center mb-4">
            <h1 className="text-6xl font-bold text-red-600 mb-2">403</h1>
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>

          {/* Description */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 text-center">
              This area is restricted to authorized personnel only. If you believe this is an error, 
              please contact your administrator.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Error Code: AUTH_FORBIDDEN_403
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}