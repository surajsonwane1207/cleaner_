"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Our team has been notified and we are working to fix it.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg" variant="outline">
          Try again
        </Button>
        <Button asChild size="lg">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
