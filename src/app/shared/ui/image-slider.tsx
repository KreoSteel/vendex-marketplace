"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/app/shared/utils/utils";

interface ImageSliderProps {
   slides: string[];
}

export default function ImageSlider({ slides }: ImageSliderProps) {
   const [currentIndex, setCurrentIndex] = useState(0);
   const validSlides = slides.filter((slide) => slide && slide.trim() !== "");

   useEffect(() => {
      if (currentIndex >= validSlides.length) {
         setCurrentIndex(0);
      }
   }, [currentIndex, validSlides.length]);

   if (!validSlides || validSlides.length === 0) {
      return (
         <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-400">No images available</p>
         </div>
      );
   }

   function goToPrevious() {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? validSlides.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
   }

   function goToNext() {
      const isLastSlide = currentIndex === validSlides.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
   }

   function goToSlide(slideIndex: number) {
      setCurrentIndex(slideIndex);
   }

   return (
      <div className="relative w-full h-full group">
         <div className="relative w-full h-full">
            <Image
               src={validSlides[currentIndex]}
               alt={`Slide ${currentIndex + 1}`}
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw"
               priority
            />
         </div>

         {validSlides.length > 1 && (
            <div>
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronLeftIcon className="w-6 h-6" />
                  <span className="sr-only">Previous image</span>
               </Button>

               <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRightIcon className="w-6 h-6" />
                  <span className="sr-only">Next image</span>
               </Button>

               <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2">
                     {validSlides.map((_, slideIndex) => (
                        <button
                           key={slideIndex}
                           onClick={() => goToSlide(slideIndex)}
                           className={cn(
                              "w-2 h-2 rounded-full transition-all duration-200",
                              currentIndex === slideIndex
                                 ? "bg-white w-8"
                                 : "bg-white/60 hover:bg-white/80"
                           )}
                           aria-label={`Go to slide ${slideIndex + 1}`}
                        />
                     ))}
                  </div>
               </div>
            </div>
         )}

         <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {validSlides.length}
         </div>
      </div>
   );
}
