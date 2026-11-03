import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding ERP initial data for Mini Pick...");

  // 1. Initial Luxury Inventory Items
  const inventoryItems = [
    {
      name: "زجاجات كريستال ملكية مربعة 100 مل (أسود مطفي)",
      category: "زجاجات فاخرة",
      quantity: 140,
      unit: "قطعة",
      minStock: 30,
      costPerUnit: 65,
      supplier: "شركة الأهرام للزجاج والكريستال الفاخر",
    },
    {
      name: "زجاجات كريستال اسطوانية شفافة ثقيلة 50 مل",
      category: "زجاجات فاخرة",
      quantity: 85,
      unit: "قطعة",
      minStock: 25,
      costPerUnit: 48,
      supplier: "شركة الأهرام للزجاج والكريستال الفاخر",
    },
    {
      name: "بخاخات رذاذ ميكرو دقيقة ذهبية مغناطيسية (Magnetic Caps)",
      category: "بخاخات وأغطية",
      quantity: 210,
      unit: "قطعة",
      minStock: 50,
      costPerUnit: 22,
      supplier: "مورد إيطاليا للبخاخات العطرية",
    },
    {
      name: "بخاخات معدنية فاخرة أسود لامع مع كاب ثقيل",
      category: "بخاخات وأغطية",
      quantity: 160,
      unit: "قطعة",
      minStock: 40,
      costPerUnit: 20,
      supplier: "مورد إيطاليا للبخاخات العطرية",
    },
    {
      name: "زيت عطر Ombre Nomade مركز خام نقي (Pure French Oil)",
      category: "زيوت عطرية فرنسية",
      quantity: 1200,
      unit: "جرام",
      minStock: 300,
      costPerUnit: 3.5,
      supplier: "مجموعة جراس للعطور - فرنسا (Grasse)",
    },
    {
      name: "زيت عطر Baccarat Rouge 540 خام نقي درجة أولى",
      category: "زيوت عطرية فرنسية",
      quantity: 950,
      unit: "جرام",
      minStock: 250,
      costPerUnit: 4.2,
      supplier: "مجموعة جراس للعطور - فرنسا (Grasse)",
    },
    {
      name: "زيت عطر Sauvage Elixir مركز سوبر بيور",
      category: "زيوت عطرية فرنسية",
      quantity: 800,
      unit: "جرام",
      minStock: 200,
      costPerUnit: 3.8,
      supplier: "مجموعة جراس للعطور - فرنسا (Grasse)",
    },
    {
      name: "زيت عود كمبودي معتق طبيعي وفاخر",
      category: "زيوت عطرية فرنسية",
      quantity: 350,
      unit: "تولة",
      minStock: 50,
      costPerUnit: 45,
      supplier: "دار العود والمسك الملكي",
    },
    {
      name: "كحول عطري طبي نقي 96% خالي من الرائحة (Perfumer's Alcohol)",
      category: "كحول نقي",
      quantity: 75,
      unit: "لتر",
      minStock: 20,
      costPerUnit: 85,
      supplier: "الشركة الدولية للكحوليات الطبية",
    },
    {
      name: "بوكسات هدايا ميني بيك الفاخرة بطانة قطيفة أسود ملكي",
      category: "تغليف وبوكسات",
      quantity: 320,
      unit: "بوكس",
      minStock: 60,
      costPerUnit: 35,
      supplier: "مطابع رويال باك للعلب الفاخرة",
    },
    {
      name: "أكياس ميني بيك كارتون مقوى يد جلد ذهبية",
      category: "تغليف وبوكسات",
      quantity: 500,
      unit: "كيس",
      minStock: 100,
      costPerUnit: 14,
      supplier: "مطابع رويال باك للعلب الفاخرة",
    },
    {
      name: "عينات وتسترات مصغرة 3 مل مجانية للإهداء",
      category: "عينات وتسترات",
      quantity: 450,
      unit: "عينة",
      minStock: 100,
      costPerUnit: 8,
      supplier: "ورشة التعبئة الخاصة بميني بيك",
    },
  ];

  for (const item of inventoryItems) {
    const existing = await prisma.inventoryItem.findFirst({
      where: { name: item.name },
    });
    if (!existing) {
      await prisma.inventoryItem.create({ data: item });
    }
  }
  console.log("Inventory items seeded.");

  // 2. Initial Customers
  const customers = [
    {
      name: "سارة المهندس",
      phone: "01099887766",
      city: "الإسكندرية",
      address: "سموحة، برج الأطباء، ش مصطفى كامل",
      totalOrders: 4,
      totalSpent: 4200,
      isVip: true,
      notes: "عميلة VIP مفضلة لعطور توم فورد وبكاراه روج",
    },
    {
      name: "أحمد الفيشاوي",
      phone: "01122334455",
      city: "القاهرة",
      address: "المعادي، دجلة، شارع 206",
      totalOrders: 3,
      totalSpent: 3850,
      isVip: true,
      notes: "عاشق للأومبري نوماد والتسترات الأصلية بالباركود",
    },
    {
      name: "م. نورهان السعدني",
      phone: "01234567890",
      city: "الجيزة",
      address: "الشيخ زايد، كمبوند بيفرلي هيلز",
      totalOrders: 5,
      totalSpent: 6900,
      isVip: true,
      notes: "تطلب دائماً هدايا وبوكسات تغليف قطيفة",
    },
    {
      name: "كريم عبد العزيز النجار",
      phone: "01011223344",
      city: "القاهرة",
      address: "مدينة نصر، عباس العقاد",
      totalOrders: 2,
      totalSpent: 2150,
      isVip: false,
      notes: "يفضل الدفع بالإنستاباي",
    },
    {
      name: "د. ريم مصطفى الشافعي",
      phone: "01556677889",
      city: "القاهرة",
      address: "التجمع الخامس، النرجس عمارات",
      totalOrders: 3,
      totalSpent: 3400,
      isVip: true,
      notes: "عميلة دورية لعطور الشتاء والنيش",
    },
  ];

  for (const cust of customers) {
    await prisma.customer.upsert({
      where: { phone: cust.phone },
      update: cust,
      create: cust,
    });
  }
  console.log("Customers CRM seeded.");

  // 3. Initial Expenses
  const expenses = [
    {
      description: "توريد شحنة زجاجات كريستال 100 مل وبخاخات ذهبية",
      amount: 4500,
      category: "خامات وزيوت",
      recordedBy: "المايسترو",
    },
    {
      description: "طباعة 500 بوكس هدايا فاخر مخملي مع أكياس اللوجو الذهبي",
      amount: 3200,
      category: "تغليف وبوكسات",
      recordedBy: "المايسترو",
    },
    {
      description: "حملة إعلانات ممولة تيك توك وإنستجرام (تشكيلة شتاء 2026)",
      amount: 2800,
      category: "إعلانات وتسويق",
      recordedBy: "مدير التشغيل العام",
    },
    {
      description: "تسوية شحنات مناديب القاهرة والإسكندرية عبر بوسطة",
      amount: 1450,
      category: "شحن وتوصيل",
      recordedBy: "مدير التشغيل العام",
    },
    {
      description: "مصروفات صيانة البوتيك والكهرباء والضيافة الأسبوعية",
      amount: 850,
      category: "تشغيل ومصروفات",
      recordedBy: "مدير التشغيل العام",
    },
  ];

  const existingExpensesCount = await prisma.expense.count();
  if (existingExpensesCount === 0) {
    for (const exp of expenses) {
      await prisma.expense.create({ data: exp });
    }
  }
  console.log("Expenses seeded.");

  // 4. Initial Sample Orders (if none exist)
  const existingOrdersCount = await prisma.order.count();
  if (existingOrdersCount === 0) {
    const sampleOrders = [
      {
        orderNumber: "ROVY-9120",
        customerName: "سارة المهندس",
        customerPhone: "01099887766",
        customerCity: "الإسكندرية",
        customerAddress: "سموحة، برج الأطباء، ش مصطفى كامل",
        notes: "يرجى وضع عينات توم فورد مع الأوردر",
        items: JSON.stringify([
          {
            nameAr: "تستر أصلي لويس فيتون أومبري نوماد 100 مل",
            nameEn: "Ombre Nomade Louis Vuitton (Original Tester)",
            price: 1350,
            quantity: 1,
            type: "TESTER",
            volume: "100 ml",
          },
        ]),
        subtotal: 1350,
        deliveryFee: 65,
        totalAmount: 1415,
        status: "DELIVERED",
        paymentMethod: "INSTAPAY",
        orderType: "web",
        cashierName: "المايسترو",
        courierName: "كابتن أحمد (بوسطة إكسبريس)",
        courierPhone: "01022334455",
      },
      {
        orderNumber: "ROVY-8450",
        customerName: "أحمد الفيشاوي",
        customerPhone: "01122334455",
        customerCity: "القاهرة",
        customerAddress: "المعادي، دجلة، شارع 206",
        notes: "تغليف هدية فاخر",
        items: JSON.stringify([
          {
            nameAr: "باكارا روج 540 إكستري دو بارفيوم 100 مل",
            nameEn: "Baccarat Rouge 540 Extrait de Parfum",
            price: 1450,
            quantity: 1,
            type: "ORIGINAL",
            volume: "100 ml",
          },
        ]),
        subtotal: 1450,
        deliveryFee: 50,
        totalAmount: 1500,
        status: "SHIPPED",
        paymentMethod: "COD",
        orderType: "web",
        cashierName: "مدير التشغيل العام",
        courierName: "كابتن محمود (الأسطول الخاص)",
        courierPhone: "01155443322",
      },
      {
        orderNumber: "ROVY-7310",
        customerName: "عميل صالة البوتيك",
        customerPhone: "01000000000",
        customerCity: "القاهرة",
        customerAddress: "استلام مباشر من البوتيك",
        notes: "كاشير فوري",
        items: JSON.stringify([
          {
            nameAr: "سوفاج إلكسير ديور المركز 100 مل",
            nameEn: "Sauvage Elixir Dior",
            price: 1250,
            quantity: 1,
            type: "ORIGINAL",
            volume: "100 ml",
          },
        ]),
        subtotal: 1250,
        deliveryFee: 0,
        totalAmount: 1250,
        status: "DELIVERED",
        paymentMethod: "CASH",
        orderType: "pos",
        cashierName: "كاشير البوتيك",
      },
    ];

    for (const ord of sampleOrders) {
      await prisma.order.create({ data: ord });
    }
    console.log("Sample orders seeded.");
  }

  console.log("All ERP seed data loaded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
