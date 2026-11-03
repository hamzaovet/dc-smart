import { prisma } from "../lib/prisma";
import StoreFront from "./StoreFront";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories, reviews] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    prisma.review.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <StoreFront
      initialProducts={products}
      categories={categories}
      reviews={reviews}
    />
  );
}
