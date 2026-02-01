import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";

/** Supports both API shape (user.name, user.image, createdAt) and legacy mock shape (userName, userAvatar, date) */
interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt?: string;
    date?: string;
    user?: { name: string; image: string | null };
    userName?: string;
    userAvatar?: string;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const userName = review.user?.name ?? review.userName ?? "Anonymous";
  const userAvatar =
    review.user?.image ?? review.userAvatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";
  const dateStr = review.createdAt ?? review.date ?? "";

  return (
    <Card className="">
      <CardContent>
        <div className="flex items-start gap-4">
        <img
          src={userAvatar}
          alt={userName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-foreground">{userName}</h4>
            {dateStr && (
              <span className="text-sm text-muted-foreground">
                {new Date(dateStr).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment ?? ""}
          </p>
        </div>
      </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
