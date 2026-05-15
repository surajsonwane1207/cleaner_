"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star as StarIcon } from "lucide-react";

export default function RatePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setStatus("submitting");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Rate your Cleaning Session</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="text-center py-10">
              <div className="text-green-600 font-bold mb-2">Thank you!</div>
              <p>Your review has been submitted. Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`transition-colors ${rating >= s ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                  >
                    <StarIcon className="h-10 w-10 fill-current" />
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Comments (Optional)</label>
                <textarea
                  className="w-full border rounded-md p-2 h-32"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the service?"
                />
              </div>

              <Button type="submit" className="w-full" disabled={rating === 0 || status === "submitting"}>
                {status === "submitting" ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
