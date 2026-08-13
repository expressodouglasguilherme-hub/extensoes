# 📝 Exemplo Prático de Atualização

## Cenário: Você corrigiu um bug no content.js

### 1️⃣ Edite o arquivo localmente
```javascript
// content.js - linha 150
// ANTES:
if (email.includes('@')) {
  // código com bug
}

// DEPOIS:
if (email && email.includes('@')) {
  // bug corrigido!
}
```

### 2️⃣ Atualize o version.json
```json
{
  "version": "1.0.1",
  "changelog": "Corrigido erro ao validar emails vazios",
  "releaseDate": "2026-08-14",
  "files": [
    "content.js"
  ]
}
```

### 3️⃣ Faça upload no GitHub

**Passo a passo visual:**

1. Acesse: `https://github.com/SEU-USUARIO/creare-extension`

2. Clique em `content.js`

3. Clique no ✏️ (lápis de edição)

4. Cole o código novo

5. Em "Commit changes":
   - Mensagem: `fix: corrigido validação de emails`
   - Clique em **"Commit changes"**

6. Repita para `version.json`:
   - Clique no arquivo
   - Clique no ✏️
   - Altere a versão para `1.0.1`
   - Altere o changelog
   - Commit!

### 4️⃣ O que acontece agora?

**Automático:**
- ✅ Em até 6 horas, todos os usuários recebem notificação
- ✅ Notificação mostra: "Creare v1.0.1 disponível! Corrigido erro ao validar emails vazios"
- ✅ Usuário clica em "Atualizar agora"
- ✅ Extensão recarrega
- ✅ Pronto! Bug corrigido para todos!

---

## 🚀 Exemplo: Grande Atualização (nova funcionalidade)

### Você adicionou botão de copiar telefone

1. **Edite os arquivos:**
   - `content.js` - adicione a nova função
   - `styles.css` - adicione estilos do botão

2. **Atualize version.json:**
```json
{
  "version": "1.1.0",
  "changelog": "✨ Novo botão para copiar telefone do motorista",
  "releaseDate": "2026-08-15",
  "files": [
    "content.js",
    "styles.css"
  ]
}
```

3. **Upload no GitHub** (ambos os arquivos)

4. **Resultado:**
   - Notificação: "Creare v1.1.0 disponível! ✨ Novo botão para copiar telefone do motorista"

---

## ⚡ Atualização de Emergência (bug crítico)

Se encontrar um bug crítico e quiser forçar atualização IMEDIATA:

### Opção 1: Avisar no grupo
```
"Pessoal, atualizei a extensão! 
Execute no console: checkUpdates()
Ou recarregue em chrome://extensions"
```

### Opção 2: Reduzir intervalo temporariamente
No `background.js` e `updater.js`:
```javascript
checkInterval: 5 * 60 * 1000,  // 5 minutos (só durante emergência!)
```

Depois volte para 6 horas.

---

## 📊 Exemplo de Histórico de Versões

```
v1.0.0 - 2026-08-13
- Versão inicial com auto-update

v1.0.1 - 2026-08-14
- Corrigido erro ao validar emails vazios
- Melhorada performance do botão copiar

v1.1.0 - 2026-08-15
- ✨ Novo botão para copiar telefone
- ✨ Novo botão para copiar placa
- Melhorado design dos botões

v1.1.1 - 2026-08-16
- Corrigido bug no botão de telefone
- Ajustado CSS para telas menores

v2.0.0 - 2026-08-20
- 🎉 Nova funcionalidade: integração com WhatsApp
- 🎉 Modo escuro
- Refatoração completa do código
```

---

## 🎯 Checklist Antes de Atualizar

- [ ] Testei as mudanças localmente
- [ ] Incrementei o número da versão corretamente
- [ ] Escrevi changelog descritivo
- [ ] Listei todos os arquivos alterados no version.json
- [ ] Fiz commit de TODOS os arquivos alterados no GitHub
- [ ] Aguardei 5 minutos e testei manualmente com `checkUpdates()`

---

## 💡 Dicas

### Use emojis no changelog para destacar:
```json
{
  "changelog": "✨ Nova funcionalidade | 🐛 Correção de bugs | ⚡ Performance"
}
```

### Estruture bem o changelog:
```json
{
  "changelog": "v1.2.0: ✨ Botão WhatsApp | 🐛 Corrigido erro emails | ⚡ +50% mais rápido"
}
```

### Para múltiplas mudanças:
```json
{
  "changelog": "Múltiplas melhorias: novo botão copiar, correção validação emails, design melhorado",
  "files": [
    "content.js",
    "styles.css",
    "textos-padrao.js"
  ]
}
```
