# 🚀 Guia Rápido de Instalação e Uso

## ⚡ Instalação em 3 Passos

### 1️⃣ Abrir Extensões do Chrome
Digite na barra de endereços:
```
chrome://extensions/
```

### 2️⃣ Ativar Modo Desenvolvedor
Clique no botão **"Modo do desenvolvedor"** no canto superior direito

### 3️⃣ Carregar a Extensão
1. Clique em **"Carregar sem compactação"**
2. Selecione a pasta: `maxtrack-whatsapp-extension`
3. Pronto! ✅

---

## 📅 NOVA FUNCIONALIDADE v1.1.0: Atualização Automática de Datas

### 🎯 O que faz?
Atualiza automaticamente os filtros de período na página de eventos, eliminando a necessidade de alterar as datas manualmente todo início de turno.

### 📍 Como usar:
1. **Acesse:** `https://go.maxtrack.com.br/#event/Event`
2. **Aguarde** 3 segundos para o botão carregar
3. **Procure** pelo botão azul **"Atualizar Período"** (ícone 🗓️) no topo dos filtros
4. **Clique** no botão

### ✨ Resultado:
- **Data Início:** Será configurada para 1 dia ANTES da data atual do PC
- **Data Fim:** Será configurada para 1 dia DEPOIS da data atual do PC
- **Filtro aplicado automaticamente**

**Exemplo:** Se hoje é 28/07/2026:
- Período: **27/07/2026**
- Fim: **29/07/2026**

💡 **Notificação verde confirmará:** "✅ Período atualizado! 27/07/2026 até 29/07/2026"

📘 **Documentação completa:** [ATUALIZACAO-DATAS.md](ATUALIZACAO-DATAS.md)

---

## 📱 Copiar Evento para WhatsApp

1. **Acesse:** https://go.maxtrack.com.br/
2. **Clique** em uma linha da tabela de eventos
3. **Clique** no botão verde "Copiar para WhatsApp"
4. **Cole** no WhatsApp (Ctrl+V)

---

## ⚙️ Ajuste Inicial Necessário

### 🔍 Identificar Seletores da Tabela

A extensão precisa saber onde buscar os dados na tabela do Maxtrack.

**Passos:**

1. Acesse o Maxtrack
2. Pressione **F12** (abrir DevTools)
3. Clique no ícone de seleção (🎯) no DevTools
4. Clique em cada coluna da tabela para ver seu seletor
5. Anote os seletores CSS de cada coluna

**Exemplo de seletores:**
- Empresa: `td.empresa` ou `td:nth-child(1)`
- Cliente: `td.cliente` ou `td:nth-child(2)`
- Identificador (placa): `td.identificador` ou `td:nth-child(3)`

### 📝 Editar Seletores

Abra o arquivo `content.js` e encontre a seção:

```javascript
const SELECTORS = {
  tableRow: 'tr.selected, tr.active',
  tableBody: 'tbody tr',
  
  // AJUSTE AQUI ⬇️
  empresa: 'td:nth-child(1)',              // ← Coluna da Empresa
  cliente: 'td:nth-child(2)',              // ← Coluna do Cliente/Filial
  identificador: 'td:nth-child(3)',        // ← Placa/Prefixo
  informacoesAdicionais: 'td:nth-child(4)', // ← Motorista
  localidade: 'td:nth-child(5)',           // ← Localização
  nome: 'td:nth-child(6)',                 // ← Tipo do alerta
  criticidade: 'td:nth-child(7)',          // ← Nível de risco
  data: 'td:nth-child(8)',                 // ← Data/Hora
  status: 'td:nth-child(9)',               // ← Status
  tipoClassificacao: 'td:nth-child(10)'    // ← Tipo de classificação
};
```

**Substitua:**
- `td:nth-child(X)` pelo índice correto da coluna (começa em 1)
- Ou use classes CSS se a tabela tiver (ex: `td.empresa`)

### 🔄 Atualizar Extensão

Após editar:
1. Vá em `chrome://extensions/`
2. Clique no ícone de **atualizar** (🔄) da extensão
3. Recarregue a página do Maxtrack (F5)

---

## 🧪 Testar Extração

Para verificar se os dados estão sendo extraídos corretamente:

1. Abra o Console (F12 → aba Console)
2. Clique em uma linha da tabela
3. Clique no botão "Copiar para WhatsApp"
4. Procure no console a mensagem: `"Mensagem copiada: ..."`
5. Verifique se todos os campos estão preenchidos

---

## ❓ FAQ Rápido

### O botão não aparece?
✅ Aguarde 2-3 segundos após carregar a página  
✅ Recarregue com Ctrl+F5 (força reload)  
✅ Verifique console (F12) por erros

### Mensagem vem com dados vazios?
❌ Seletores estão incorretos  
✅ Ajuste os seletores em `content.js`  
✅ Use F12 para inspecionar a tabela

### Como identificar o índice da coluna?
1. Pressione F12
2. Clique no ícone 🎯 (seletor)
3. Clique na célula da tabela
4. No HTML verá algo como: `<td data-index="3">` ou conte as colunas manualmente (começa em 1)

---

## 📞 Dicas Extras

### Extrair ID do Evento

Se o Maxtrack armazena o ID do evento como atributo, ajuste:

```javascript
const eventoId = row.getAttribute('data-id') ||    // Tenta data-id
                 row.getAttribute('data-event') || // Tenta data-event
                 row.id ||                         // Tenta id
                 '';
```

### Placa e Prefixo Separados

Se placa e prefixo estão em colunas diferentes:

```javascript
const SELECTORS = {
  // ...
  placa: 'td:nth-child(3)',    // Coluna específica da placa
  prefixo: 'td:nth-child(4)',  // Coluna específica do prefixo
};
```

E ajuste a função `extractDataFromRow`:

```javascript
const placa = getData(SELECTORS.placa);
const prefixo = getData(SELECTORS.prefixo);
```

---

## 🎯 Checklist Final

Antes de considerar a instalação concluída:

- [ ] Extensão instalada e ativa no Chrome
- [ ] Botão verde aparece no Maxtrack
- [ ] Clicar em linha da tabela a destaca
- [ ] Botão copia mensagem para clipboard
- [ ] Todos os campos vêm preenchidos
- [ ] Emojis aparecem corretamente
- [ ] Link de evidências funciona

---

**Pronto! Sua extensão está funcionando! 🎉**

Qualquer dúvida, consulte o [README.md](README.md) completo.
