import "dotenv/config";
import { PrismaClient } from "@/utils/generated/client";

const prisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL!,
});

const categories = [
  {
    name: "Electronics & Appliances",
    slug: "electronics-appliances",
    icon: "Smartphone",
    description: "Mobile phones, laptops, TVs, home appliances and more",
  },
  {
    name: "Vehicles",
    slug: "vehicles",
    icon: "Car",
    description: "Cars, motorcycles, bikes, auto parts and accessories",
  },
  {
    name: "Property",
    slug: "property",
    icon: "Home",
    description: "Houses, apartments, land, commercial property",
  },
  {
    name: "Fashion & Beauty",
    slug: "fashion-beauty",
    icon: "Shirt",
    description: "Clothing, shoes, accessories, cosmetics and beauty products",
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    icon: "Sprout",
    description: "Furniture, home decor, garden tools and plants",
  },
  {
    name: "Sports & Hobbies",
    slug: "sports-hobbies",
    icon: "Dumbbell",
    description: "Sports equipment, fitness gear, musical instruments, games",
  },
  {
    name: "Books & Learning",
    slug: "books-learning",
    icon: "Book",
    description: "Books, textbooks, courses and educational materials",
  },
  {
    name: "Pets",
    slug: "pets",
    icon: "Dog",
    description: "Dogs, cats, birds, pet food and accessories",
  },
  {
    name: "Services",
    slug: "services",
    icon: "Wrench",
    description: "Professional services, repairs, cleaning and more",
  },
  {
    name: "Jobs",
    slug: "jobs",
    icon: "Briefcase",
    description: "Job opportunities, part-time and full-time positions",
  },
  {
    name: "Business & Industrial",
    slug: "business-industrial",
    icon: "Building2",
    description: "Office equipment, machinery, tools and supplies",
  },
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    icon: "Baby",
    description: "Baby gear, toys, kids clothing and accessories",
  },
  {
    name: "Other",
    slug: "other",
    icon: "Package",
    description: "Other categories",
  },
  {
    name: "For Free",
    slug: "free",
    icon: "Gift",
    description: "Listings for free",
  },
];

async function main() {
  console.log("🌱 Seeding categories...");

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        description: category.description,
      },
      create: category,
    });
    console.log(`✅ Created/Updated: ${created.name}`);
  }

  console.log("✨ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });