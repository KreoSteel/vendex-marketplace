import "dotenv/config";
import { PrismaClient } from "@/app/shared/lib/generated/client";
import { ListingCondition, ListingStatus } from "@/app/shared/lib/generated/enums";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL environment variable is required");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

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

const testUsers = [
  {
    email: "john.doe@example.com",
    name: "John Doe",
    phone: "+1234567890",
    location: "New York, NY",
    avatarImg: "https://i.pravatar.cc/150?img=12",
  },
  {
    email: "jane.smith@example.com",
    name: "Jane Smith",
    phone: "+1234567891",
    location: "Los Angeles, CA",
    avatarImg: "https://i.pravatar.cc/150?img=45",
  },
  {
    email: "mike.johnson@example.com",
    name: "Mike Johnson",
    phone: "+1234567892",
    location: "Chicago, IL",
    avatarImg: "https://i.pravatar.cc/150?img=33",
  },
  {
    email: "sarah.williams@example.com",
    name: "Sarah Williams",
    phone: "+1234567893",
    location: "Houston, TX",
    avatarImg: "https://i.pravatar.cc/150?img=27",
  },
  {
    email: "david.brown@example.com",
    name: "David Brown",
    phone: "+1234567894",
    location: "Phoenix, AZ",
    avatarImg: "https://i.pravatar.cc/150?img=51",
  },
];

const listingTemplates = [
  // Electronics & Appliances
  {
    title: "iPhone 15 Pro Max 256GB - Like New",
    description: "Selling my iPhone 15 Pro Max in excellent condition. Comes with original box, charger, and unused cable. Battery health at 98%. No scratches or dents. Reason for selling: upgraded to newer model.",
    categorySlug: "electronics-appliances",
    price: 899,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "iphone,smartphone,mobile",
  },
  {
    title: "MacBook Pro M3 14-inch 512GB",
    description: "Barely used MacBook Pro with M3 chip. Perfect for developers and creative professionals. Includes original packaging and accessories. AppleCare+ valid until 2025.",
    categorySlug: "electronics-appliances",
    price: 1599,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "macbook,laptop,computer",
  },
  {
    title: "Samsung 55\" 4K Smart TV",
    description: "Great condition Samsung QLED TV. Perfect picture quality, smart features work flawlessly. Wall mount included. Moving to smaller apartment, need to downsize.",
    categorySlug: "electronics-appliances",
    price: 450,
    condition: ListingCondition.USED,
    imageQuery: "television,tv,smart-tv",
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description: "Premium noise-cancelling headphones in pristine condition. Excellent sound quality, comfortable for long use. Comes with case and all accessories.",
    categorySlug: "electronics-appliances",
    price: 280,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "headphones,audio,sony",
  },
  {
    title: "iPad Air 5th Gen with Apple Pencil",
    description: "iPad Air 64GB with Apple Pencil 2nd generation. Screen protector applied from day one. Perfect for students or digital artists. Includes keyboard case.",
    categorySlug: "electronics-appliances",
    price: 499,
    condition: ListingCondition.USED,
    imageQuery: "ipad,tablet,apple",
  },

  // Vehicles
  {
    title: "2019 Toyota Camry SE - Low Mileage",
    description: "Well-maintained Toyota Camry with only 35k miles. Regular oil changes, never been in an accident. Single owner. Clean title. Recent inspection completed.",
    categorySlug: "vehicles",
    price: 22500,
    condition: ListingCondition.USED,
    imageQuery: "car,toyota,sedan",
  },
  {
    title: "2021 Honda CBR500R Motorcycle",
    description: "Excellent sport bike for beginners or commuters. Garage kept, regular maintenance. Comes with helmet and riding gear. Clean title, ready to ride.",
    categorySlug: "vehicles",
    price: 6800,
    condition: ListingCondition.USED,
    imageQuery: "motorcycle,bike,honda",
  },
  {
    title: "Trek Mountain Bike - Full Suspension",
    description: "Professional grade mountain bike with full suspension. Perfect for trail riding. Recently serviced, new tires. Upgrades include hydraulic brakes and carbon seat post.",
    categorySlug: "vehicles",
    price: 1200,
    condition: ListingCondition.USED,
    imageQuery: "bicycle,mountain-bike,cycling",
  },

  // Home & Garden
  {
    title: "Modern Grey Sectional Sofa",
    description: "Beautiful sectional sofa in excellent condition. Pet-free, smoke-free home. Very comfortable, perfect for movie nights. Dimensions: 110\"L x 85\"W. Selling due to relocation.",
    categorySlug: "home-garden",
    price: 800,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "sofa,couch,furniture",
  },
  {
    title: "Queen Size Bed Frame with Mattress",
    description: "Solid wood bed frame with memory foam mattress (2 years old). Mattress protector included. Frame has storage drawers. Very sturdy and comfortable.",
    categorySlug: "home-garden",
    price: 450,
    condition: ListingCondition.USED,
    imageQuery: "bed,bedroom,mattress",
  },
  {
    title: "Dining Table Set - 6 Chairs",
    description: "Elegant wooden dining table with 6 cushioned chairs. Perfect for family dinners. Minor wear on table surface, easily refinished. Great value!",
    categorySlug: "home-garden",
    price: 550,
    condition: ListingCondition.USED,
    imageQuery: "dining-table,furniture,chairs",
  },
  {
    title: "Electric Lawn Mower - Eco Friendly",
    description: "Cordless electric lawn mower with two batteries. Quiet operation, perfect for suburban lawns. Recently serviced. Includes grass catcher attachment.",
    categorySlug: "home-garden",
    price: 220,
    condition: ListingCondition.USED,
    imageQuery: "lawnmower,garden,tools",
  },

  // Fashion & Beauty
  {
    title: "Designer Leather Jacket - Men's L",
    description: "Genuine leather jacket, barely worn. Classic style that never goes out of fashion. Fits size Large. Original price $800. No damage or wear.",
    categorySlug: "fashion-beauty",
    price: 350,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "leather-jacket,fashion,clothing",
  },
  {
    title: "Nike Air Jordan 1 - Size 10",
    description: "Authentic Air Jordan 1 Mid in great condition. Worn only a few times. Comes with original box. Classic colorway. Price is firm.",
    categorySlug: "fashion-beauty",
    price: 180,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "sneakers,shoes,nike",
  },
  {
    title: "Women's Designer Handbag",
    description: "Luxury handbag in excellent condition. Authentic with certificate. Barely used, like new. Classic design, perfect for any occasion.",
    categorySlug: "fashion-beauty",
    price: 650,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "handbag,purse,fashion",
  },

  // Sports & Hobbies
  {
    title: "Peloton Bike - Barely Used",
    description: "Peloton bike in perfect working condition. Includes weights, mat, and heart rate monitor. Subscription not included. Great way to stay fit at home!",
    categorySlug: "sports-hobbies",
    price: 1200,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "exercise-bike,fitness,workout",
  },
  {
    title: "Electric Guitar + Amp Package",
    description: "Fender Stratocaster electric guitar with 20W amplifier. Perfect for beginners. Includes guitar case, cables, and strap. Everything you need to start playing!",
    categorySlug: "sports-hobbies",
    price: 450,
    condition: ListingCondition.USED,
    imageQuery: "guitar,music,instrument",
  },
  {
    title: "Adjustable Dumbbell Set 5-50lbs",
    description: "Space-saving adjustable dumbbells. Replaces 15 sets of weights. Compact design, perfect for home gym. Barely used, like new condition.",
    categorySlug: "sports-hobbies",
    price: 280,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "dumbbells,weights,fitness",
  },
  {
    title: "Kayak with Paddle and Life Vest",
    description: "Single-person kayak in great condition. Stable and easy to maneuver. Includes paddle and adult life vest. Perfect for lakes and calm rivers.",
    categorySlug: "sports-hobbies",
    price: 380,
    condition: ListingCondition.USED,
    imageQuery: "kayak,water-sports,outdoor",
  },

  // Books & Learning
  {
    title: "Computer Science Textbook Collection",
    description: "Collection of 15 CS textbooks covering algorithms, data structures, networking, and more. Great condition. Perfect for college students. Selling as bundle.",
    categorySlug: "books-learning",
    price: 200,
    condition: ListingCondition.USED,
    imageQuery: "books,textbooks,education",
  },
  {
    title: "Digital Drawing Tablet - Wacom",
    description: "Wacom Intuos Pro drawing tablet. Perfect for digital artists and designers. Includes pen with extra nibs. Works with Windows and Mac.",
    categorySlug: "books-learning",
    price: 220,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "drawing-tablet,wacom,digital-art",
  },

  // Baby & Kids
  {
    title: "Baby Crib with Mattress - Convertible",
    description: "3-in-1 convertible crib that transforms from crib to toddler bed to daybed. Solid wood construction. Includes organic mattress. No scratches or damage.",
    categorySlug: "baby-kids",
    price: 280,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "baby-crib,nursery,furniture",
  },
  {
    title: "Kids Bike with Training Wheels",
    description: "16-inch kids bike for ages 4-7. Includes training wheels and helmet. Bright colors, great condition. My child outgrew it quickly!",
    categorySlug: "baby-kids",
    price: 85,
    condition: ListingCondition.USED,
    imageQuery: "kids-bike,bicycle,children",
  },
  {
    title: "Lego Collection - Over 50 Sets",
    description: "Huge Lego collection including Star Wars, City, and Creator sets. All complete with instructions. Hours of building fun! Some sets still sealed.",
    categorySlug: "baby-kids",
    price: 450,
    condition: ListingCondition.USED,
    imageQuery: "lego,toys,building-blocks",
  },

  // Property (services)
  {
    title: "Coworking Desk Space - Monthly",
    description: "Private desk in modern coworking space. High-speed internet, printing facilities, kitchen access. Great location downtown. Month-to-month contract.",
    categorySlug: "property",
    price: 250,
    condition: ListingCondition.NEW,
    imageQuery: "office,coworking,desk",
  },

  // Pets
  {
    title: "Large Dog Crate - Like New",
    description: "XXL dog crate suitable for large breeds. Barely used, dog preferred sleeping on bed! Easy to fold and store. Includes divider panel.",
    categorySlug: "pets",
    price: 90,
    condition: ListingCondition.LIKE_NEW,
    imageQuery: "dog-crate,pet,supplies",
  },
  {
    title: "Aquarium Setup 50 Gallon",
    description: "Complete aquarium setup with filter, heater, lights, and decorations. Stand included. Everything you need except fish! Great condition.",
    categorySlug: "pets",
    price: 180,
    condition: ListingCondition.USED,
    imageQuery: "aquarium,fish-tank,pet",
  },

  // For Free
  {
    title: "Free Moving Boxes - Various Sizes",
    description: "About 30 moving boxes in various sizes. All clean and sturdy. Must pick up this week. First come first served!",
    categorySlug: "free",
    price: 0,
    condition: ListingCondition.USED,
    imageQuery: "boxes,moving,cardboard",
  },
  {
    title: "Free Desk Lamp - Works Great",
    description: "Basic desk lamp in working condition. Adjustable arm. Just bought a new one. Free to anyone who needs it!",
    categorySlug: "free",
    price: 0,
    condition: ListingCondition.USED,
    imageQuery: "lamp,desk,lighting",
  },

  // Business & Industrial
  {
    title: "Commercial Coffee Machine",
    description: "Professional espresso machine perfect for cafe or office. Recently serviced. Makes excellent coffee. Upgrading to larger model.",
    categorySlug: "business-industrial",
    price: 1800,
    condition: ListingCondition.USED,
    imageQuery: "coffee-machine,espresso,commercial",
  },
  {
    title: "Office Chair - Ergonomic Herman Miller",
    description: "Genuine Herman Miller Aeron chair. Size B (medium). Excellent condition, all adjustments work perfectly. Retail $1200+. Great investment in comfort!",
    categorySlug: "business-industrial",
    price: 550,
    condition: ListingCondition.USED,
    imageQuery: "office-chair,herman-miller,ergonomic",
  },
];

// Helper function to get random image URLs using Picsum Photos
function getImageUrls(query: string, count: number): string[] {
  const urls: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Use random IDs between 1-1000 for variety
    const randomId = Math.floor(Math.random() * 1000) + 1;
    // Add blur parameter occasionally for variety
    const blur = Math.random() > 0.8 ? '?blur' : '';
    urls.push(`https://picsum.photos/800/600${blur}?random=${randomId}`);
  }
  
  return urls;
}

// Helper function to get random location
function getRandomLocation(): string {
  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "Charlotte, NC",
    "San Francisco, CA",
    "Indianapolis, IN",
    "Seattle, WA",
    "Denver, CO",
    "Boston, MA",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

// Helper to create random date within last 60 days
function getRandomDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 60);
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("🌱 Starting database seed...\n");

  // 1. Seed categories
  console.log("📁 Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        description: category.description,
      },
      create: category,
    });
  }
  console.log(`✅ Created/Updated ${categories.length} categories\n`);

  // 2. Create test users (without password - you'll need to register normally)
  console.log("👥 Seeding test users...");
  const createdUsers = [];
  for (const user of testUsers) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
    createdUsers.push(created);
  }
  console.log(`✅ Created/Updated ${createdUsers.length} test users\n`);

  // 3. Get all categories from DB
  const dbCategories = await prisma.category.findMany();
  const categoryMap = new Map(
    dbCategories.map((cat) => [cat.slug, cat.id])
  );

  // 4. Create listings with images
  console.log("📝 Seeding listings with images...");
  let listingCount = 0;

  for (const template of listingTemplates) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const categoryId = categoryMap.get(template.categorySlug);

    if (!categoryId) {
      console.warn(`⚠️  Category not found: ${template.categorySlug}`);
      continue;
    }

    // Random number of images (2-5)
    const imageCount = Math.floor(Math.random() * 4) + 2;
    const imageUrls = getImageUrls(template.imageQuery, imageCount);

    const listing = await prisma.listing.create({
      data: {
        title: template.title,
        description: template.description,
        price: template.price,
        condition: template.condition,
        status: ListingStatus.ACTIVE,
        location: getRandomLocation(),
        views: Math.floor(Math.random() * 100),
        categoryId: categoryId,
        userId: randomUser.id,
        createdAt: getRandomDate(),
        images: {
          create: imageUrls.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    listingCount++;
    console.log(`  ✓ Created: "${listing.title}" with ${listing.images.length} images`);
  }

  console.log(`\n✅ Created ${listingCount} listings with multiple images each`);
  console.log("\n✨ Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${createdUsers.length} test users`);
  console.log(`   - ${listingCount} listings`);
  console.log(`   - ~${listingCount * 3} images (avg 3 per listing)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
      await pool.end();
      console.log("\n✨ Database connection closed successfully!");
    } catch {
      // Ignore connection cleanup errors - data is already saved
      console.log("\n✨ Seeding complete! (Connection cleanup warning ignored)");
    }
    process.exit(0);
  });