with open(r'd:\Work\minipick\prisma\schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}'''
replacement = '''datasource db {
  provider = "postgresql"
}'''

if target in content:
    content = content.replace(target, replacement, 1)
    with open(r'd:\Work\minipick\prisma\schema.prisma', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Reverted datasource block cleanly!")
