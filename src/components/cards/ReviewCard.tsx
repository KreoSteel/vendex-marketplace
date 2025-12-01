import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { TPublicReview } from "@/utils/zod-schemas/reviews";

interface ReviewCardProps {
    review: TPublicReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {

    return (
        <Card className="h-full hover:shadow-md transition-all duration-200 border-neutral-200 flex flex-col py-3">
            <CardHeader className="p-4 flex flex-row items-start gap-3 space-y-0">
                <Link href={`/profile/${review.reviewer.id}`} className="shrink-0">
                    <Avatar className="h-10 w-10 border border-neutral-100 hover:border-neutral-200 transition-colors">
                        <AvatarImage 
                            src={review.reviewer.avatarImg || ""} 
                            alt={review.reviewer.name || ""} 
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/5 text-primary font-semibold text-sm">
                            {review.reviewer.name?.charAt(0).toUpperCase() || ""}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                
                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                    <div className="flex justify-between items-start gap-2">
                        <Link 
                            href={`/profile/${review.reviewer.id}`}
                            className="font-semibold text-sm text-neutral-900 hover:text-primary transition-colors truncate"
                        >
                            {review.reviewer.name}
                        </Link>
                        <span className="text-xs text-neutral-400 whitespace-nowrap shrink-0 mt-0.5">
                            {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </span>
                    </div>
                    
                    {review.listing && (
                        <div className="text-xs text-neutral-500 flex items-center gap-1.5 min-w-0">
                            <span className="shrink-0">Purchased:</span>
                            {review.listing?.id ? (
                                <Link 
                                    href={`/listings/${review.listing.id}`}
                                    className="font-medium text-blue-600 hover:underline truncate block"
                                    title={review.listing.title}
                                >
                                    {review.listing.title}
                                </Link>
                            ) : (
                                <span className="font-medium text-neutral-700 truncate" title={review.listing.title}>
                                    {review.listing.title}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 space-y-2 flex-1">
                <div className="flex gap-0.5" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star 
                            key={index}
                            className={`size-4 ${
                                index < review.rating 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-neutral-200 fill-neutral-200"
                            }`} 
                        />
                    ))}
                </div>
                
                {review.comment ? (
                    <p className="text-sm text-neutral-600 leading-relaxed wrap-break-words">
                        {review.comment}
                    </p>
                ) : (
                    <p className="text-sm text-neutral-400 italic">
                        No written review
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
