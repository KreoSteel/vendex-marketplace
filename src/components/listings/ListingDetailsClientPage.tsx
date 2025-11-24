"use client";
import ToggleFavorite from "@/components/favorites/ToggleFavorite";
import { useGetListingById } from "@/hooks/useListing";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { ListingCondition } from "@/utils/generated/enums";
import { ArrowLeftIcon, CalendarIcon, HeartIcon, MapPinIcon, StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import ImageSlider from "../ui/image-slider";

export default function ListingDetailsClientPage({ id }: { id: string }) {
   const { data: listing } = useGetListingById(id);
   const router = useRouter();

   const handleViewProfile = () => {
      router.push(`/profile/${listing?.user?.id}`);
   };

   if (!listing) {
      return <div>Listing not found</div>;
   }

   const conditions = {
      [ListingCondition.NEW]: "New",
      [ListingCondition.LIKE_NEW]: "Like New",
      [ListingCondition.USED]: "Used",
      [ListingCondition.FOR_PARTS]: "For Parts",
   };
   return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
         <Button variant="outline" className="w-fit shadow-md cursor-pointer mb-4" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-4 h-4" />
            Back To Listings
         </Button>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="relative w-full aspect-3/2 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                  <ImageSlider slides={listing?.images.map((image) => image.url) || []} />
               </div>

               <Card className="shadow-sm">
                  <CardHeader className="space-y-4">
                     <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                           {listing?.title}
                        </h1>
                     </div>

                     <Separator />

                     <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                           Description
                        </h2>
                        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                           {listing?.description}
                        </p>

                        <Separator className="my-6" />

                        <div className="space-y-4">
                           <h2 className="text-lg font-semibold text-gray-900">
                              Details
                           </h2>
                           <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                              <div className="space-y-1">
                                 <p className="text-sm font-medium text-gray-500">
                                    Condition
                                 </p>
                                 <p className="text-base font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded-lg border border-primary-200 inline-block">
                                    {
                                       conditions[
                                          listing?.condition as ListingCondition
                                       ]
                                    }
                                 </p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm font-medium text-gray-500">
                                    Category
                                 </p>
                                 <p className="text-base font-medium text-gray-900">
                                    {listing?.category?.name}
                                 </p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm font-medium text-gray-500">
                                    Location
                                 </p>
                                 <div className="flex items-center gap-1.5">
                                    <MapPinIcon className="w-4 h-4 text-gray-600" />
                                    <p className="text-base font-medium text-gray-900">
                                       {listing?.location}
                                    </p>
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm font-medium text-gray-500">
                                    Posted
                                 </p>
                                 <div className="flex items-center gap-1.5">
                                    <CalendarIcon className="w-4 h-4 text-gray-600" />
                                    <p className="text-base font-medium text-gray-900">
                                       {listing?.createdAt.toLocaleDateString()}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </CardHeader>
               </Card>
            </div>

            <div className="lg:col-span-1">
               <div className="sticky top-18 space-y-4">
                  <Card className="shadow-md">
                     <CardHeader className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                           <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">
                                 Price
                              </p>
                              <h2 className="text-4xl font-bold text-green-600">
                                 {listing?.price
                                    ? `€${listing?.price.toLocaleString()}`
                                    : "€0"}
                              </h2>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                            {listing?.featured && (
                              <div className="flex items-center gap-2 text-gray-600">
                                 <StarIcon className="w-4 h-4" />
                                 <span className="text-sm font-medium">Featured</span>
                              </div>
                            )}
                              <div className="flex items-center gap-2 text-gray-600">
                                 <MapPinIcon className="w-4 h-4" />
                                 <span className="text-sm font-medium">
                                    {listing?.location}
                                 </span>
                              </div>
                           </div>
                        </div>

                        <Separator />
                        <div className="space-y-2 flex gap-2">
                           <Button className="w-6/7 shadow-md cursor-pointer">Contact Seller</Button>
                           <ToggleFavorite 
                              listingId={listing.id} 
                              variant="outline" 
                              size="default"
                              className="w-1/6 shadow-md" 
                           />
                        </div>
                     </CardHeader>
                  </Card>
                  <Card className="shadow-md flex flex-col gap-2">
                    <CardHeader>
                      <CardTitle>
                        <h2 className="text-2xl font-bold">Seller Information</h2>
                      </CardTitle>
                    </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-14 h-14">
                                <AvatarImage src={listing?.user?.avatarImg || ""} />
                                <AvatarFallback>
                                    {listing?.user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {listing?.user?.name}
                                </h3>
                                {listing?.user?.createdAt && listing?.user?.createdAt < new Date() ? (
                                    <p className="text-base text-gray-500">
                                        Member since: Today
                                    </p>
                                ) : (
                                    <p className="text-base text-gray-500">
                                        Member since: {format(listing?.user?.createdAt || new Date(), "d MMM yyyy")}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-gray-600">Active Listings</p>
                                <p>0</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-gray-600">Items Sold</p>
                                <p>0</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-gray-600">Overall Rating</p>
                                <div className="flex items-center gap-2">
                                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span>4.5</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-gray-600">Location</p>
                                <p>{listing?.user?.location}</p>
                            </div>
                        </div>
                        
                        <Separator className="mt-4 mb-6" />

                        <Button variant="outline" className="w-full shadow-md cursor-pointer" onClick={handleViewProfile}>View Profile</Button>
                      </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}
