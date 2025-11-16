import { getRecentListings } from "@/lib/data-access/listings";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listings = await getRecentListings();
        return NextResponse.json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        return NextResponse.json(
            { error: "Failed to fetch listings" },
            { status: 500 }
        );
    }
}