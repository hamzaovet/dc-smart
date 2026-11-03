with open(r'd:\Work\minipick\app\card\page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('import InstagramIcon from "../../components/InstagramIcon";', 'import InstagramIcon from "../../components/InstagramIcon";\nimport FacebookIcon from "../../components/FacebookIcon";')
text = text.replace('<Facebook size={16}', '<FacebookIcon size={16}')

with open(r'd:\Work\minipick\app\card\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('Card page updated successfully with FacebookIcon')
