with open(r'd:\Work\minipick\prisma\schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

target = 'datasource db {\n\n  provider = "postgresql"\n\n}'
replacement = '''datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}'''

if target in content:
    content = content.replace(target, replacement, 1)
    with open(r'd:\Work\minipick\prisma\schema.prisma', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Target not found!")
