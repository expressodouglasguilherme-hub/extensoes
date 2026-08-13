# 📱 Maxtrack WhatsApp Helper

Extensão privada para Google Chrome que adiciona funcionalidade de copiar informações de eventos/alertas do sistema Maxtrack formatadas para WhatsApp.

## 🎯 Funcionalidades

- ✅ Botão integrado na interface do Maxtrack
- 📋 Copia automaticamente mensagem formatada para o clipboard
- 🎨 Formatação completa com emojis para WhatsApp
- 🚦 Mapeamento automático de criticidade (🔴 Gravíssimo, 🟡 Médio, 🟢 Leve)
- 🔗 Inclui link direto para evidências do evento
- 💚 Visual integrado com cores do WhatsApp
- 🔔 Notificações visuais de sucesso/erro
- 📅 **NOVO:** Atualização automática de período de datas (1 dia antes até 1 dia depois)

## 📋 Formato da Mensagem Gerada

```
🏢 *Empresa:* [Nome da Empresa]
📍 *Filial:* [Nome do Cliente]
🚛 *Placa / Prefixo:* [Placa] / [Prefixo]
👤 *Motorista:* [Nome do Motorista]
🗺️ *Localização:* [Localidade]

⚠️ *Classificação*
- *Tipo:* [Tipo do Alerta]
- *Nível de Risco:* [Emoji] [Criticidade]

🕒 *Data/Hora do Alerta:* [Data/Hora]

👨‍💼 *Operador Responsável:* Douglas G.

📝 *Tratativa*
[Status] - [Tipo de Classificação]

📷 *Evidências*
🔗 *Link das imagens:* [URL do evento]
```

## 🚀 Instalação

### Passo 1: Preparar os Arquivos

Certifique-se de que você tem a seguinte estrutura de pastas:

```
maxtrack-whatsapp-extension/
├── manifest.json
├── content.js
├── styles.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Passo 2: Instalar no Chrome

1. **Abra o Chrome** e digite na barra de endereços:
   ```
   chrome://extensions/
   ```

2. **Ative o "Modo do desenvolvedor"** (botão no canto superior direito)

3. **Clique em "Carregar sem compactação"**

4. **Selecione a pasta** `maxtrack-whatsapp-extension`

5. A extensão aparecerá na lista com o ícone verde do WhatsApp ✅

### Passo 3: Verificar Instalação

- Você verá a extensão **"Maxtrack WhatsApp Helper"** na lista
- O ícone verde do WhatsApp indicará que está ativa
- Acesse https://go.maxtrack.com.br/ para testar

## 📖 Como Usar

### 1. Atualizar Período de Datas (NOVO) 📅

Na página de eventos (`https://go.maxtrack.com.br/#event/Event`):

1. **Aguarde o carregamento completo** da página (3 segundos)
2. **Procure pelo botão azul** "Atualizar Período" (com ícone de calendário 🗓️)
3. **Clique no botão** para atualizar automaticamente:
   - **Data Início:** 1 dia antes da data atual
   - **Data Fim:** 1 dia depois da data atual
4. **Confirmação:** Uma notificação verde mostrará as datas configuradas
5. **O filtro será aplicado automaticamente**

**Exemplo:** Se hoje é 28/07/2026:
- Período: 27/07/2026
- Fim: 29/07/2026

👉 **Veja mais detalhes em [ATUALIZACAO-DATAS.md](ATUALIZACAO-DATAS.md)**

---

### 2. Copiar Evento para WhatsApp

### 2.1. Acessar o Maxtrack

Navegue até https://go.maxtrack.com.br/ e faça login normalmente.

### 2.2. Selecionar um Evento

- Clique em qualquer linha da tabela de eventos/alertas
- A linha selecionada ficará destacada com borda verde

### 2.3. Copiar para WhatsApp

- Clique no botão **"Copiar para WhatsApp"** (verde com ícone do WhatsApp)
- Uma notificação aparecerá confirmando: **"✅ Mensagem copiada para a área de transferência!"**

### 2.4. Colar no WhatsApp

- Abra o WhatsApp Web ou o aplicativo
- Cole (Ctrl+V ou Cmd+V) a mensagem na conversa desejada
- A formatação com emojis será preservada ✨

## 🔧 Configuração Avançada

### Ajustar Seletores DOM

Se a estrutura da tabela do Maxtrack for diferente, edite o arquivo `content.js`:

```javascript
const SELECTORS = {
  tableRow: 'tr.selected, tr.active',
  empresa: 'td:nth-child(1)',      // Ajustar índice da coluna
  cliente: 'td:nth-child(2)',       // Ajustar índice da coluna
  // ... outros seletores
};
```

### Personalizar Operador

Para alterar o nome do operador, edite em `content.js`:

```javascript
function normalizarOperador(operador) {
  // Adicione suas regras personalizadas aqui
  if (operador.includes('Seu Nome')) {
    return 'Seu Apelido';
  }
  return operador;
}
```

## 🐛 Solução de Problemas

### ❌ Botão de Datas não aparece

**Possíveis causas:**
- Não está na página correta
- A página ainda está carregando

**Solução:**
1. Certifique-se de estar em `https://go.maxtrack.com.br/#event/Event`
2. Aguarde 3-5 segundos após o carregamento
3. Recarregue a página (F5)
4. Verifique o console (F12) por erros

---

### ❌ Botão de WhatsApp não aparece

**Possíveis causas:**
- A página ainda está carregando → Aguarde alguns segundos
- Conflito com outras extensões → Desative outras extensões temporariamente
- JavaScript desabilitado → Verifique configurações do Chrome

**Solução:**
1. Abra o Console (F12)
2. Procure por erros relacionados a "Maxtrack WhatsApp Helper"
3. Recarregue a página (Ctrl+R)

---

### ⚠️ Datas não atualizam

**Solução:**
- Verifique se os campos de período estão visíveis na tela
- Tente atualizar um campo manualmente primeiro
- Recarregue a extensão em `chrome://extensions/`
- Os campos de data podem ter mudado de posição/nome no Maxtrack

---

### ⚠️ "Nenhuma linha selecionada"

**Solução:**
- Clique em uma linha da tabela antes de usar o botão
- Certifique-se de que a linha ficou destacada em verde claro

### 📋 Mensagem não copia

**Possíveis causas:**
- Permissões de clipboard bloqueadas
- Navegador não suporta Clipboard API

**Solução:**
1. Verifique se a extensão tem permissão de clipboard em `chrome://extensions/`
2. Tente usar Chrome atualizado (versão 66+)

### 🔍 Dados extraídos incorretamente

**Solução:**
1. Os seletores DOM podem estar desatualizados
2. Abra `content.js` e ajuste os seletores da seção `SELECTORS`
3. Use o Inspetor (F12) para identificar os seletores corretos da tabela

## 🎨 Personalização Visual

### Alterar Cores do Botão

Edite `styles.css`:

```css
.maxtrack-whatsapp-btn {
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  /* Altere as cores acima conforme preferência */
}
```

### Mover Posição do Botão

O botão é inserido automaticamente. Para forçar posição flutuante, edite `content.js`:

```javascript
button.classList.add('floating'); // Adiciona no canto superior direito
```

## 📊 Estrutura do Código

- **`manifest.json`** - Configuração da extensão e permissões
- **`content.js`** - Lógica principal de extração e formatação
- **`styles.css`** - Estilos visuais do botão e notificações
- **`icons/`** - Ícones da extensão em diferentes tamanhos

## 🔒 Segurança e Privacidade

- ✅ Extensão **100% privada** - não envia dados para servidores externos
- ✅ Funciona apenas em `go.maxtrack.com.br`
- ✅ Não coleta ou armazena informações pessoais
- ✅ Código-fonte aberto para auditoria

## 🔄 Atualizações

Para atualizar a extensão:

1. Faça as alterações nos arquivos
2. Vá em `chrome://extensions/`
3. Clique no botão de **atualizar** (ícone de círculo) da extensão
4. Recarregue a página do Maxtrack (F5)

## 🆘 Suporte

### Logs de Depuração

Para ver logs detalhados:

1. Abra o Console do Chrome (F12)
2. Aba "Console"
3. Procure por mensagens começando com "Maxtrack WhatsApp Helper"

### Desinstalar

1. Vá em `chrome://extensions/`
2. Clique em "Remover" na extensão
3. Confirme a remoção

## 📝 Notas Importantes

- A extensão depende da estrutura HTML do Maxtrack
- Se o Maxtrack atualizar seu layout, pode ser necessário ajustar os seletores
- Testado em Google Chrome 120+ e Microsoft Edge 120+
- Requer permissões de `clipboardWrite` e `activeTab`

## ⚙️ Requisitos Técnicos

- **Navegador:** Chrome 88+ ou Edge 88+
- **Permissões:** Clipboard Write, Active Tab
- **Site:** https://go.maxtrack.com.br/*

## 📄 Licença

Extensão de uso privado para operações internas.

---

**Desenvolvido para otimizar o fluxo de trabalho de comunicação de alertas do Maxtrack** 🚛💚

**Versão:** 1.1.0  
**Última atualização:** Julho 2026

---

## 📋 Changelog

### v1.1.0 (28/07/2026)
- ✨ **NOVO:** Botão de atualização automática de período de datas
- 🎯 Configuração inteligente: 1 dia antes até 1 dia depois da data atual
- 🔍 Detecção automática dos campos de data
- 🤖 Aplicação automática do filtro após atualização
- 📘 Documentação detalhada em ATUALIZACAO-DATAS.md

### v1.0.0
- ✅ Funcionalidade básica de copiar eventos para WhatsApp
- 🎨 Interface integrada com botões na tabela
- 🔔 Sistema de notificações visuais
- 🚦 Mapeamento de criticidade com emojis
