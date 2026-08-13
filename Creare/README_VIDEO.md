# 📹 Funcionalidade de Captura de Vídeos - Creare

## 🎯 Visão Geral

A extensão Creare agora inclui funcionalidade de captura de frames de vídeos, adaptada do sistema do Maxtrack. Esta funcionalidade permite capturar screenshots (prints) de qualquer vídeo presente nas páginas de tratativas do Creare.

## ✨ Funcionalidades

### 📸 Captura de Frame
- **Botão flutuante** aparece automaticamente sobre qualquer player de vídeo
- **Posicionado no canto superior direito** do vídeo para fácil acesso
- **Captura o frame atual** do vídeo com um único clique
- **Pausa automática** ao capturar para garantir nitidez
- **Download automático** da imagem em formato PNG

### ⌨️ Atalhos de Teclado
- **Tecla P**: Captura rápida quando o vídeo está em foco
- **Simples e intuitivo** para operadores que precisam de agilidade

### 🎨 Design Visual
- **Gradiente roxo** (estilo Creare) para combinar com a identidade visual
- **Feedback visual** em tempo real:
  - 🟣 Roxo: Estado normal
  - 🟠 Laranja: Processando captura
  - 🟢 Verde: Captura bem-sucedida
  - 🔴 Vermelho: Erro na captura
- **Animações suaves** ao passar o mouse e clicar
- **Responsivo** para diferentes tamanhos de tela

## 🔧 Diferenças do Maxtrack

### O que é diferente:
1. **Um vídeo por vez**: O Creare geralmente mostra 1 vídeo por tratativa (não múltiplas câmeras como o Maxtrack)
2. **Botão sempre visível**: O botão fica fixo no canto do vídeo (não em overlay fullscreen)
3. **Integração com layout**: Respeita o layout da página de tratativas do Creare

### O que é similar:
1. **Mesma tecnologia de captura**: Usa `chrome.tabs.captureVisibleTab` via background script
2. **Mesmo sistema de recorte**: Captura apenas a área do vídeo (não a página inteira)
3. **Mesmo formato de saída**: PNG com timestamp no nome

## 📁 Arquivos Modificados/Criados

### Novos Arquivos:
- `background.js` - Background script para captura de tela via API do Chrome

### Arquivos Modificados:
- `manifest.json` - Adicionadas permissões necessárias (`activeTab`, `tabs`, `scripting`)
- `content.js` - Adicionado observador de vídeos e sistema de captura (~220 linhas)
- `styles.css` - Adicionados estilos para o botão de captura (~80 linhas)

## 🚀 Como Usar

### Para Operadores:
1. Abra uma tratativa que contenha vídeo
2. O botão "📷 Capturar Frame" aparecerá automaticamente no canto superior direito do vídeo
3. Clique no botão OU pressione **P** no teclado
4. O vídeo pausará e a imagem será salva automaticamente na pasta de Downloads
5. Nome do arquivo: `creare-video-YYYY-MM-DDTHH-MM-SS.png`

### Para Desenvolvedores:
```javascript
// O sistema é totalmente automático
// Não requer configuração adicional
// Detecta automaticamente qualquer tag <video> na página
```

## 🔍 Detalhamento Técnico

### Fluxo de Captura:
1. **Detecção**: MutationObserver detecta elementos `<video>` adicionados à página
2. **Processamento**: Marca o vídeo como processado e adiciona o botão
3. **Captura**:
   - Pausa o vídeo
   - Solicita screenshot ao background script
   - Recebe imagem em base64
   - Cria canvas e recorta apenas a área do vídeo
   - Converte para blob PNG
   - Cria link de download e dispara automaticamente
4. **Finalização**: Retoma reprodução se o vídeo estava tocando

### Estrutura do Código:
```javascript
// Principais funções:
- observarVideos()           // Inicializa o sistema
- detectarEMelhorarVideos()  // Busca vídeos na página
- melhorarVideo(video)       // Adiciona botão a um vídeo específico
- captureScreen()            // Handler do clique no botão
```

### Permissões Necessárias:
```json
{
  "permissions": [
    "clipboardWrite",  // Já existia (copiar textos)
    "activeTab",       // NOVO: Acessar aba ativa
    "tabs",            // NOVO: Capturar screenshot
    "scripting"        // NOVO: Injetar scripts
  ],
  "host_permissions": [
    "*://*.goawakecloud.com.br/*"
  ],
  "background": {
    "service_worker": "background.js"  // NOVO
  }
}
```

## 🐛 Solução de Problemas

### Botão não aparece:
- Verifique se o elemento é uma tag `<video>` válida
- Abra o console (F12) e procure por logs `🎥`
- Recarregue a página

### Captura não funciona:
- Verifique se a extensão tem permissões necessárias
- Confirme que o vídeo está visível na tela
- Tente rolar a página para o vídeo aparecer completamente

### Imagem cortada:
- Isso é normal - apenas a área do vídeo é capturada
- Certifique-se de que o vídeo não está coberto por outros elementos

## 📝 Changelog

### Versão 1.1.0 (Atual)
- ✅ Adicionado sistema de captura de frames de vídeo
- ✅ Criado background script para screenshot
- ✅ Adicionado botão flutuante nos players
- ✅ Implementado atalho de teclado (P)
- ✅ Feedback visual completo
- ✅ Responsivo para mobile

### Versão 1.0.0 (Anterior)
- Copiar informações de alertas
- Colar textos padrão
- Grupos de emails
- Auto-clique em Invalidar
- Botão Concluir clonado

## 👨‍💻 Autor

**Douglas G.**
- Extensão Creare - Colinha
- Baseado no sistema do Maxtrack WhatsApp Helper

## 📌 Notas

- A funcionalidade é **totalmente automática** - não requer configuração
- **Não interfere** nas funcionalidades existentes da extensão
- **Leve e eficiente** - não impacta performance da página
- **Compatível** com Chrome/Edge (Manifest V3)

---

💡 **Dica**: Para capturar múltiplos frames rapidamente, use o atalho **P** em vez de clicar no botão!
