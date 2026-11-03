import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import ProductDetailsClient from "./ProductDetailsClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "منتج غير موجود | ميني بيك",
    };
  }

  return {
    title: `${product.nameAr} (${product.brandAr}) | ميني بيك`,
    description: product.descriptionAr.slice(0, 160),
    openGraph: {
      title: `${product.nameAr} - ${product.brandAr}`,
      description: product.descriptionAr.slice(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: { category: true },
  });

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
