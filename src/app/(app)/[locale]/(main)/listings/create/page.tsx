import CreateListingForm from "@/app/features/create-listing/ui/create-listing-form";
import { Card, CardContent } from "@/app/shared/ui";
import { getTranslations } from "next-intl/server";

export default async function CreateListingPage() {
   const tCreateListingPage = await getTranslations("createListingPage");
   
   return (
      <div className="container mx-auto px-4 flex flex-col gap-4 py-12">
         <div>
            <h2>{tCreateListingPage("title")}</h2>
            <p className="text-sm text-neutral-500">{tCreateListingPage("requiredFields")}</p>
         </div>
         <Card>
            <CardContent>
               <CreateListingForm />
            </CardContent>
         </Card>
      </div>
   );
}
