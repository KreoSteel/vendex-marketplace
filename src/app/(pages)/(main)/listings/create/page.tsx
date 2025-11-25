import CreateListingForm from "@/components/forms/CreateListingForm";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateListingPage() {
   return (
      <div className="container mx-auto px-4 flex flex-col gap-4 py-12">
         <div>
            <h2>Create a new listing</h2>
            <p className="text-sm text-neutral-500">
               <span className="text-red-500">*</span> - required fields
            </p>
         </div>
         <Card>
            <CardContent>
               <CreateListingForm />
            </CardContent>
         </Card>
      </div>
   );
}
