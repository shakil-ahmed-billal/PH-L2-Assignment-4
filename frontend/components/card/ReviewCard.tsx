import { Star } from "lucide-react";
import { Review } from "@/lib/mockData";
import { Card, CardContent } from "../ui/card";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="">
      <CardContent>
        <div className="flex items-start gap-4">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-foreground">{review.userName}</h4>
            <span className="text-sm text-muted-foreground">
              {new Date(review.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
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
            {review.comment}
          </p>
        </div>
      </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
