#!/usr/bin/env python3
"""
Gerador de ícones para a extensão Maxtrack WhatsApp Helper
Requer: pip install pillow
"""

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("❌ Pillow não está instalado!")
    print("📦 Instale com: pip install pillow")
    exit(1)

import os

def create_icon(size, output_path):
    """Cria um ícone com gradiente verde do WhatsApp"""
    
    # Criar imagem com transparência
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Cores do WhatsApp
    color1 = (37, 211, 102)  # #25D366
    color2 = (18, 140, 126)  # #128C7E
    
    # Desenhar fundo com gradiente simulado (verde médio)
    bg_color = tuple((c1 + c2) // 2 for c1, c2 in zip(color1, color2))
    
    # Retângulo arredondado
    radius = size // 5
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=radius,
        fill=bg_color
    )
    
    # Círculo branco (fundo do ícone do WhatsApp)
    circle_size = int(size * 0.65)
    circle_pos = (size - circle_size) // 2
    draw.ellipse(
        [circle_pos, circle_pos, circle_pos + circle_size, circle_pos + circle_size],
        fill='white'
    )
    
    # Círculo verde interno (telefone)
    inner_size = int(size * 0.45)
    inner_pos = (size - inner_size) // 2
    draw.ellipse(
        [inner_pos, inner_pos, inner_pos + inner_size, inner_pos + inner_size],
        fill=color1
    )
    
    # Desenhar "telefone" simplificado
    phone_size = int(size * 0.15)
    center = size // 2
    line_width = max(2, size // 16)
    
    # Linha diagonal do telefone
    draw.line(
        [(center - phone_size, center - phone_size), 
         (center + phone_size, center + phone_size)],
        fill='white',
        width=line_width
    )
    
    # Salvar
    img.save(output_path, 'PNG')
    print(f"✅ Ícone criado: {output_path} ({size}x{size})")

def main():
    # Criar diretório icons se não existir
    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    # Gerar ícones nos tamanhos necessários
    sizes = [16, 48, 128]
    
    print("🎨 Gerando ícones da extensão Maxtrack WhatsApp Helper...\n")
    
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, output_path)
    
    print("\n✨ Todos os ícones foram gerados com sucesso!")
    print(f"📁 Localização: {icons_dir}")

if __name__ == '__main__':
    main()
