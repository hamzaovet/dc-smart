-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'manager',
    "phone" TEXT,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL DEFAULT 'rovy_settings',
    "isEmergencyLockdown" BOOLEAN NOT NULL DEFAULT false,
    "storeNameAr" TEXT NOT NULL DEFAULT '╪▒┘ê┘ü┘è ╪│╪¬┘ê╪▒ ΓÇö ┘ä┘ä╪╣╪╖┘ê╪▒ ╪º┘ä┘ü╪º╪«╪▒╪⌐',
    "storeNameEn" TEXT NOT NULL DEFAULT 'Rovy Store ΓÇö Luxury Fragrances',
    "taglineAr" TEXT NOT NULL DEFAULT '╪ú┘ü╪«┘à ╪º┘ä╪╣╪╖┘ê╪▒ ╪º┘ä╪╣╪º┘ä┘à┘è╪⌐ ┘ê╪º┘ä╪¿╪»╪º╪ª┘ä ╪º┘ä┘à╪│╪¬┘ê╪¡╪º╪⌐ ╪¿╪½╪¿╪º╪¬ ┘ê╪ú╪╡╪º┘ä╪⌐ ┘ä╪º ╪¬┘Å┘é╪º┘ê┘à',
    "taglineEn" TEXT NOT NULL DEFAULT 'Ultra-luxury designer & inspired niche fragrances',
    "whatsappPhone" TEXT NOT NULL DEFAULT '01503012856',
    "hotline" TEXT NOT NULL DEFAULT '01503012856',
    "secondaryPhone" TEXT DEFAULT '01556718249',
    "googleMapsUrl" TEXT DEFAULT 'https://maps.app.goo.gl/z2QCHZzSuJaaNHPV7',
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "freeShippingThreshold" DOUBLE PRECISION NOT NULL DEFAULT 1500.0,
    "addressAr" TEXT NOT NULL DEFAULT '6 ╪ú┘â╪¬┘ê╪¿╪▒ ΓÇö ╪º┘ä╪¡┘è ╪º┘ä╪▒╪º╪¿╪╣ (╪┤╪º╪▒╪╣ ┘à╪¼┘ä╪│ ╪º┘ä╪»┘ê┘ä╪⌐) ΓÇö ╪º┘ä╪¼┘è╪▓╪⌐',
    "addressEn" TEXT NOT NULL DEFAULT '6th of October ΓÇö 4th District (Council of State St) ΓÇö Giza',
    "workingHoursAr" TEXT NOT NULL DEFAULT '┘è┘ê┘à┘è╪º┘ï ┘à┘å 10 ╪╡╪¿╪º╪¡╪º┘ï ┘ê╪¡╪¬┘ë 12 ┘à┘å╪¬╪╡┘ü ╪º┘ä┘ä┘è┘ä',
    "workingHoursEn" TEXT NOT NULL DEFAULT 'Daily from 10:00 AM to 12:00 Midnight',
    "instagramHandle" TEXT NOT NULL DEFAULT 'rovystore2',
    "announcementAr" TEXT NOT NULL DEFAULT 'Γ£¿ ╪┤╪¡┘å ┘à╪¼╪º┘å┘è ┘ä┘ä╪╖┘ä╪¿╪º╪¬ ┘ü┘ê┘é 1500 ╪¼.┘à + ╪╣┘è┘å╪º╪¬ ┘à╪¼╪º┘å┘è╪⌐ ┘ü╪º╪«╪▒╪⌐ ┘à╪╣ ┘â┘ä ╪╖┘ä╪¿ Γ£¿',
    "announcementEn" TEXT NOT NULL DEFAULT 'Γ£¿ Free shipping on orders over 1500 EGP + complimentary luxury samples with every order Γ£¿',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "image" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandAr" TEXT NOT NULL,
    "brandEn" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ORIGINAL',
    "concentration" TEXT NOT NULL DEFAULT 'Eau de Parfum',
    "volume" TEXT NOT NULL DEFAULT '100 ml',
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isWinter" BOOLEAN NOT NULL DEFAULT false,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "stockQuantity" INTEGER NOT NULL DEFAULT 50,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.9,
    "reviewsCount" INTEGER NOT NULL DEFAULT 38,
    "descriptionAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "topNotesAr" TEXT NOT NULL,
    "topNotesEn" TEXT NOT NULL,
    "heartNotesAr" TEXT NOT NULL,
    "heartNotesEn" TEXT NOT NULL,
    "baseNotesAr" TEXT NOT NULL,
    "baseNotesEn" TEXT NOT NULL,
    "ingredientsAr" TEXT,
    "ingredientsEn" TEXT,
    "seasonAr" TEXT NOT NULL DEFAULT '┘â┘ä ╪º┘ä┘ü╪╡┘ê┘ä',
    "seasonEn" TEXT NOT NULL DEFAULT 'All Seasons',
    "genderAr" TEXT NOT NULL DEFAULT '┘ä┘ä╪¼┘å╪│┘è┘å',
    "genderEn" TEXT NOT NULL DEFAULT 'Unisex',
    "longevityAr" TEXT NOT NULL DEFAULT '╪½╪¿╪º╪¬ ┘è╪»┘ê┘à ╪ú┘â╪½╪▒ ┘à┘å 24 ╪│╪º╪╣╪⌐',
    "longevityEn" TEXT NOT NULL DEFAULT '24+ Hours Long Lasting',
    "sillageAr" TEXT NOT NULL DEFAULT '┘ü┘ê╪¡╪º┘å ┘é┘ê┘è ╪¼╪»╪º┘ï ┘è┘à┘ä╪ú ╪º┘ä┘à┘â╪º┘å',
    "sillageEn" TEXT NOT NULL DEFAULT 'Enormous Sillage & Projection',
    "image" TEXT NOT NULL,
    "gallery" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerCity" TEXT NOT NULL,
    "notes" TEXT,
    "items" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
    "trackingNumber" TEXT,
    "orderType" TEXT NOT NULL DEFAULT 'web',
    "cashierName" TEXT,
    "courierName" TEXT,
    "courierPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "expenseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT '┘é╪╖╪╣╪⌐',
    "minStock" INTEGER NOT NULL DEFAULT 10,
    "costPerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "supplier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "address" TEXT,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "lastOrderDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "customerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "city" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesReturn" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "orderId" TEXT,
    "orderNumber" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "totalRefund" DOUBLE PRECISION NOT NULL,
    "refundMethod" TEXT NOT NULL DEFAULT 'CASH',
    "reason" TEXT NOT NULL,
    "restockItems" BOOLEAN NOT NULL DEFAULT true,
    "recordedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "category" TEXT NOT NULL DEFAULT '╪«╪º┘à╪º╪¬ ┘ê╪▓┘è┘ê╪¬',
    "address" TEXT,
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalPurchases" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseInvoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "recordedBy" TEXT,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPayment" (
    "id" TEXT NOT NULL,
    "paymentNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "notes" TEXT,
    "recordedBy" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseReturn" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "totalRefund" DOUBLE PRECISION NOT NULL,
    "refundMethod" TEXT NOT NULL DEFAULT 'DEDUCT_BALANCE',
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "recordedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "discountValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "badgeText" TEXT,
    "applicableProductIds" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bannerImage" TEXT,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nameAr_key" ON "Category"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "SalesReturn_returnNumber_key" ON "SalesReturn"("returnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseInvoice_invoiceNumber_key" ON "PurchaseInvoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPayment_paymentNumber_key" ON "SupplierPayment"("paymentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseReturn_returnNumber_key" ON "PurchaseReturn"("returnNumber");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

