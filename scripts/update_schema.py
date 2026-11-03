import os

schema_path = r"d:\Work\rovy-store\prisma\schema.prisma"
with open(schema_path, "r", encoding="utf-8") as f:
    content = f.read()

new_models = '''
model SalesReturn {
  id            String   @id @default(cuid())
  returnNumber  String   @unique // e.g. RET-SALES-1001
  orderId       String?
  orderNumber   String?
  customerName  String
  customerPhone String
  items         String   @db.Text // JSON items returned
  totalRefund   Float
  refundMethod  String   @default("CASH") // CASH, INSTAPAY, STORE_CREDIT
  reason        String
  restockItems  Boolean  @default(true)
  recordedBy    String?
  status        String   @default("COMPLETED")
  notes         String?
  createdAt     DateTime @default(now())
}

model Supplier {
  id             String            @id @default(cuid())
  name           String
  phone          String
  company        String?
  category       String            @default("خامات وزيوت") // زيوت عطرية، زجاجات وكريستال، بخاخات، كرتون وبوكسات، كحول
  address        String?
  openingBalance Float             @default(0.0) // رصيد بداية المدة
  totalPurchases Float             @default(0.0)
  totalPaid      Float             @default(0.0)
  currentBalance Float             @default(0.0) // الرصيد الحالي المستحق
  notes          String?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
  purchases      PurchaseInvoice[]
  payments       SupplierPayment[]
  returns        PurchaseReturn[]
}

model PurchaseInvoice {
  id              String         @id @default(cuid())
  invoiceNumber   String         @unique // e.g. PUR-2026-101
  supplierId      String
  supplier        Supplier       @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  items           String         @db.Text // JSON items
  totalAmount     Float
  paidAmount      Float          @default(0.0)
  remainingAmount Float          @default(0.0)
  paymentMethod   String         @default("CASH") // CASH, INSTAPAY, BANK_TRANSFER, DEFERRED
  status          String         @default("COMPLETED")
  notes           String?
  recordedBy      String?
  invoiceDate     DateTime       @default(now())
  createdAt       DateTime       @default(now())
}

model SupplierPayment {
  id            String   @id @default(cuid())
  paymentNumber String   @unique // e.g. PAY-1001
  supplierId    String
  supplier      Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  amount        Float
  paymentMethod String   @default("CASH") // CASH, INSTAPAY, BANK_TRANSFER
  notes         String?
  recordedBy    String?
  paymentDate   DateTime @default(now())
  createdAt     DateTime @default(now())
}

model PurchaseReturn {
  id           String   @id @default(cuid())
  returnNumber String   @unique // e.g. RET-PUR-1001
  supplierId   String
  supplier     Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  items        String   @db.Text
  totalRefund  Float
  refundMethod String   @default("DEDUCT_BALANCE")
  reason       String
  notes        String?
  recordedBy   String?
  createdAt    DateTime @default(now())
}

model Promotion {
  id                   String    @id @default(cuid())
  titleAr              String
  titleEn              String
  type                 String    @default("PERCENTAGE") // PERCENTAGE, FIXED, BOGO, BUNDLE
  discountValue        Float     @default(0.0)
  badgeText            String?
  applicableProductIds String?   @db.Text
  startDate            DateTime?
  endDate              DateTime?
  isActive             Boolean   @default(true)
  bannerImage          String?
  descriptionAr        String?
  descriptionEn        String?
  createdAt            DateTime  @default(now())
}
'''

content_norm = content.replace("\r\n", "\n")

# Replace StoreSettings
old_settings = """model StoreSettings {
  id                  String   @id @default("rovy_settings")
  isEmergencyLockdown Boolean  @default(false)
  storeNameAr         String   @default("روفي ستور — للعطور الفاخرة")
  storeNameEn         String   @default("Rovy Store — Luxury Fragrances")
  taglineAr           String   @default("أفخم العطور العالمية والبدائل المستوحاة بثبات وأصالة لا تُقاوم")
  taglineEn           String   @default("Ultra-luxury designer & inspired niche fragrances")
  whatsappPhone       String   @default("01000000000")
  hotline             String   @default("01000000000")
  deliveryFee         Float    @default(50.0)
  addressAr           String   @default("القاهرة والشيخ زايد — شحن سريع لجميع المحافظات")
  addressEn           String   @default("Cairo & Sheikh Zayed — Express Delivery All Egypt")
  announcementAr      String   @default("✨ شحن مجاني للطلبات فوق 1500 ج.م + عينات مجانية فاخرة مع كل طلب ✨")
  announcementEn      String   @default("✨ Free shipping on orders over 1500 EGP + complimentary luxury samples with every order ✨")
  updatedAt           DateTime @updatedAt
}"""

new_settings = """model StoreSettings {
  id                    String   @id @default("rovy_settings")
  isEmergencyLockdown   Boolean  @default(false)
  storeNameAr           String   @default("روفي ستور — للعطور الفاخرة")
  storeNameEn           String   @default("Rovy Store — Luxury Fragrances")
  taglineAr             String   @default("أفخم العطور العالمية والبدائل المستوحاة بثبات وأصالة لا تُقاوم")
  taglineEn             String   @default("Ultra-luxury designer & inspired niche fragrances")
  whatsappPhone         String   @default("01000000000")
  hotline               String   @default("01000000000")
  deliveryFee           Float    @default(50.0)
  freeShippingThreshold Float    @default(1500.0)
  addressAr             String   @default("القاهرة والشيخ زايد — شحن سريع لجميع المحافظات")
  addressEn             String   @default("Cairo & Sheikh Zayed — Express Delivery All Egypt")
  workingHoursAr        String   @default("يومياً من 10 صباحاً وحتى 12 منتصف الليل")
  workingHoursEn        String   @default("Daily from 10:00 AM to 12:00 Midnight")
  instagramHandle       String   @default("rovystore2")
  announcementAr        String   @default("✨ شحن مجاني للطلبات فوق 1500 ج.م + عينات مجانية فاخرة مع كل طلب ✨")
  announcementEn        String   @default("✨ Free shipping on orders over 1500 EGP + complimentary luxury samples with every order ✨")
  updatedAt             DateTime @updatedAt
}"""

if old_settings in content_norm:
    content_norm = content_norm.replace(old_settings, new_settings)
    print("StoreSettings replaced successfully.")
else:
    print("StoreSettings already updated or pattern mismatch.")

if "model SalesReturn" not in content_norm:
    content_norm = content_norm.strip() + "\n" + new_models.strip() + "\n"
    print("New models appended.")

with open(schema_path, "w", encoding="utf-8") as f:
    f.write(content_norm.replace("\n", "\r\n"))

print("schema.prisma written successfully.")
