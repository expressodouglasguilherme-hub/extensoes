# ⚡ Guia Rápido: Configurar GitHub (5 minutos)

## 🎯 O que você vai fazer:
1. Criar conta no GitHub (se não tiver)
2. Criar repositório
3. Configurar a extensão
4. Fazer upload dos arquivos
5. Pronto! ✅

---

## 📝 Passo a Passo

### 1. Criar Conta no GitHub (se não tiver)
- Acesse: https://github.com/signup
- Preencha email, senha, username
- Confirme email
- ✅ Pronto!

### 2. Criar Repositório
1. Acesse: https://github.com/new
2. Preencha:
   ```
   Nome: creare-extension
   Descrição: Extensão Creare com auto-update
   Visibilidade: Private (recomendado)
   ✅ Marque: "Add a README file"
   ```
3. Clique em **"Create repository"**
4. ✅ Anote seu username! (aparece na URL: github.com/SEU-USERNAME)

### 3. Configurar Extensão

Abra os arquivos e edite:

**`background.js` (linha 7-9):**
```javascript
owner: 'douglasg',              // ← TROQUE pelo seu username
repo: 'creare-extension',       // ← Nome do repositório que criou
branch: 'main',                 // ← Deixe 'main'
```

**`updater.js` (linha 7-9):**
```javascript
owner: 'douglasg',              // ← TROQUE pelo seu username
repo: 'creare-extension',       // ← Nome do repositório que criou
branch: 'main',                 // ← Deixe 'main'
```

### 4. Fazer Upload dos Arquivos

1. Acesse seu repositório: `https://github.com/SEU-USERNAME/creare-extension`

2. Clique em **"Add file" > "Upload files"**

3. Arraste TODOS estes arquivos:
   ```
   ✅ manifest.json
   ✅ content.js
   ✅ textos-padrao.js
   ✅ auto-click-invalidar.js
   ✅ background.js
   ✅ updater.js
   ✅ version.json
   ✅ styles.css
   ✅ icon16.png
   ✅ icon48.png
   ✅ icon128.png
   ```

4. Em "Commit changes", escreva: `Initial commit`

5. Clique em **"Commit changes"**

6. ✅ **PRONTO!** Aguarde o upload terminar.

---

## 🧪 Testar se Funcionou

1. Recarregue a extensão em `chrome://extensions`

2. Abra o Creare no navegador

3. Pressione **F12** (abre console)

4. Digite no console:
   ```javascript
   checkUpdates()
   ```

5. Se aparecer "✅ Extensão está atualizada!", funcionou! 🎉

---

## 🎯 Como Atualizar Daqui pra Frente

### Processo Simples (3 passos):

1. **Edite o arquivo** que quer atualizar

2. **Atualize version.json:**
   ```json
   {
     "version": "1.0.1",  ← Aumente este número
     "changelog": "Correção de bugs"
   }
   ```

3. **Faça upload no GitHub:**
   - Acesse o repositório
   - Clique no arquivo
   - Clique em ✏️ (editar)
   - Cole o novo conteúdo
   - Commit!

**Todos os usuários recebem notificação em até 6 horas!** ✅

---

## 📞 Precisa de Ajuda?

### Problema: "Não encontrei meu username"
**Solução:** Acesse https://github.com e olhe no canto superior direito, ou na URL.

### Problema: "Erro 404 ao verificar atualizações"
**Solução:** Verifique se:
- Configurou o `owner` certo em background.js e updater.js
- O repositório tem os arquivos na raiz (não em pasta)
- O repositório é público OU você está logado no GitHub

### Problema: "Como sei se o upload deu certo?"
**Solução:** Acesse `https://github.com/SEU-USERNAME/creare-extension` e veja se os arquivos aparecem

---

## 🎉 Checklist Final

- [ ] Criei conta no GitHub
- [ ] Criei repositório `creare-extension`
- [ ] Editei `owner` em background.js
- [ ] Editei `owner` em updater.js
- [ ] Fiz upload de TODOS os arquivos
- [ ] Testei com `checkUpdates()` no console
- [ ] Apareceu "✅ Extensão está atualizada!"

**Se marcou todos, está pronto!** 🚀

---

## 💡 Próximos Passos

Leia os arquivos:
- `AUTO-UPDATE-SETUP.md` - Guia completo
- `EXEMPLO-ATUALIZACAO.md` - Exemplos práticos

---

**Tempo estimado:** 5-10 minutos
**Dificuldade:** Fácil ⭐
**Resultado:** Auto-update funcionando para sempre! 🎯
