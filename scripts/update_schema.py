import sys

with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update StoreSettings
old_settings = '  announcementEn        String   @default("✨ Free shipping on orders over 1500 EGP + complimentary luxury samples with every order ✨")\n  updatedAt             DateTime @updatedAt'
new_settings = '''  announcementEn        String   @default("✨ Free shipping on orders over 1500 EGP + complimentary luxury samples with every order ✨")
  logoUrl               String?  @default("/dc_logo.jpg")
  invoiceTermsAr        String?  @default("ضمان سنتين على الأجهزة والكاميرات ضد عيوب الصناعة — الاستبدال خلال 14 يوماً وفق الشروط")
  adminPin              String?  @default("2026")
  updatedAt             DateTime @updatedAt'''

if old_settings in content:
    content = content.replace(old_settings, new_settings)
    print('Updated StoreSettings')
else:
    print('StoreSettings pattern not found directly, checking fallback')

# 2. Update Customer (remove @unique from phone)
content = content.replace('phone         String    @unique', 'phone         String')

# 3. Add Employee and EmployeeAdvance
if 'model Employee {' not in content:
    employee_models = '''

model Employee {
  id             String            @id @default(cuid())
  name           String
  phone          String
  nationalId     String?
  role           String            @default("فني تركيبات")
  basicSalary    Float             @default(0.0)
  commissionRate Float             @default(0.0)
  totalEarned    Float             @default(0.0)
  totalAdvances  Float             @default(0.0)
  hireDate       DateTime          @default(now())
  status         String            @default("ACTIVE")
  notes          String?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
  advances       EmployeeAdvance[]
}

model EmployeeAdvance {
  id         String    @id @default(cuid())
  employeeId String
  employee   Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  amount     Float
  reason     String?
  date       DateTime  @default(now())
  createdAt  DateTime  @default(now())
}
'''
    content += employee_models
    print('Added Employee models')

with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully written schema.prisma')
