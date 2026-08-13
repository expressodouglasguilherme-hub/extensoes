# 🔄 Sistema de Auto-Update - Creare Extension

## 📋 Como Funciona

A extensão agora verifica automaticamente se há atualizações disponíveis no GitHub a cada **6 horas**.

Quando uma nova versão é detectada:
1. ✅ Mostra uma notificação
2. 📥 Você clica em "Atualizar agora" ou recarrega manualmente
3. 🎉 A extensão é atualizada automaticamente

---

## 🚀 Configuração Inicial (Fazer UMA VEZ)

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (botão verde)
3. Configure:
   - **Nome:** `creare-extension` (ou outro nome)
   - **Descrição:** Extensão Creare com auto-update
   - **Visibilidade:** 
     - ✅ **Private** (se for só para sua empresa)
     - ou **Public** (se quiser compartilhar)
   - ✅ Marque **"Add a README file"**
4. Clique em **"Create repository"**

### Passo 2: Configurar os Arquivos

1. Abra os arquivos:
   - `background.js` (linha 7-9)
   - `updater.js` (linha 7-9)

2. Substitua:
   ```javascript
   owner: 'SEU-USUARIO-GITHUB',    // Troque pelo seu usuário do GitHub
   repo: 'creare-extension',        // Troque pelo nome do seu repositório
   branch: 'main',                  // Ou 'master' se for o caso
   ```

   **Exemplo:**
   ```javascript
   owner: 'douglasg',
   repo: 'creare-extension',
   branch: 'main',
   ```

### Passo 3: Fazer Upload dos Arquivos

**Opção A - Pelo Site do GitHub:**
1. Acesse seu repositório
2. Clique em **"Add file" > "Upload files"**
3. Arraste TODOS os arquivos da extensão:
   - `manifest.json`
   - `content.js`
   - `textos-padrao.js`
   - `auto-click-invalidar.js`
   - `styles.css`
   - `background.js`
   - `updater.js`
   - `version.json`
   - Ícones (icon16.png, icon48.png, icon128.png)
4. Clique em **"Commit changes"**

**Opção B - Usando Git (se souber):**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/creare-extension.git
git push -u origin main
```

---

## 📦 Como Atualizar a Extensão (Processo Normal)

### Para atualizar para todos os usuários:

1. **Edite os arquivos** que você quer atualizar localmente
2. **Atualize o `version.json`:**
   ```json
   {
     "version": "1.0.1",  ← AUMENTE ESTE NÚMERO
     "changelog": "Correção de bugs e melhorias",
     "releaseDate": "2026-08-14"
   }
   ```

3. **Faça upload no GitHub:**
   - Acesse o repositório
   - Clique no arquivo que quer atualizar
   - Clique em ✏️ (edit)
   - Cole o novo conteúdo
   - Clique em **"Commit changes"**

4. **Pronto!** Em até 6 horas, todos os usuários receberão uma notificação de atualização

---

## 🔧 Formato do version.json

```json
{
  "version": "1.0.1",
  "changelog": "Correção de bugs na função X e melhoria na performance",
  "releaseDate": "2026-08-14",
  "files": [
    "content.js",
    "textos-padrao.js",
    "styles.css"
  ]
}
```

**Campos:**
- `version`: Sempre incremente (1.0.0 → 1.0.1 → 1.1.0 → 2.0.0)
- `changelog`: Descreva o que mudou
- `files`: Lista dos arquivos que serão baixados (se omitir, baixa todos)

---

## ⚡ Regras de Versionamento

- **1.0.0 → 1.0.1**: Correção de bugs pequenos
- **1.0.0 → 1.1.0**: Nova funcionalidade menor
- **1.0.0 → 2.0.0**: Grande atualização

---

## 🧪 Testar Manualmente

Abra o console da página (F12) e execute:
```javascript
checkUpdates()
```

Isso força uma verificação imediata.

---

## ⚙️ Configurações Avançadas

### Alterar Frequência de Verificação

Em `background.js` e `updater.js`, linha 10:
```javascript
checkInterval: 6 * 60 * 60 * 1000,  // 6 horas
```

**Exemplos:**
- 1 hora: `1 * 60 * 60 * 1000`
- 12 horas: `12 * 60 * 60 * 1000`
- 24 horas (1 dia): `24 * 60 * 60 * 1000`

---

## 🎯 Fluxo Completo de Atualização

```
1. Você edita content.js localmente
2. Você aumenta version.json para 1.0.1
3. Você faz upload no GitHub
4. Em até 6 horas, todos os usuários recebem notificação
5. Usuários clicam em "Atualizar agora"
6. Extensão recarrega com nova versão
```

---

## ❓ Troubleshooting

### "Não está verificando atualizações"
- Verifique se configurou `owner` e `repo` corretamente
- Verifique se o repositório é público ou se tem acesso
- Abra chrome://extensions e veja o console do service worker

### "Erro 404 ao verificar"
- Verifique se os arquivos estão na raiz do repositório
- Verifique se o branch está correto (main vs master)

### "Versão não atualiza"
- Certifique-se de aumentar o número da versão corretamente
- Formato deve ser X.Y.Z (ex: 1.0.0, não "v1.0.0")

---

## 📞 Suporte

Criado por Douglas G.
Sistema de auto-update implementado em 13/08/2026
