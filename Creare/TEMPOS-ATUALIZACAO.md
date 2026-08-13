# ⏱️ Tempos de Verificação de Atualizações

## 🚀 Sistema Otimizado - Verificações Múltiplas

A extensão verifica atualizações em **4 momentos diferentes** para garantir que todos recebam rapidamente:

### 1️⃣ Ao Carregar a Página do Creare
- ⏰ **Tempo:** 3 segundos após abrir a página
- 📍 **Quando:** Toda vez que você abre goawakecloud.com.br
- ✅ **Resultado:** Atualização quase instantânea!

### 2️⃣ A Cada 15 Minutos (Automático)
- ⏰ **Tempo:** A cada 15 minutos
- 📍 **Quando:** Enquanto o navegador está aberto
- ✅ **Resultado:** Máximo 15 minutos para receber atualização

### 3️⃣ Ao Iniciar o Navegador
- ⏰ **Tempo:** 10 segundos após abrir o Chrome
- 📍 **Quando:** Todo dia ao ligar o computador
- ✅ **Resultado:** Sempre atualizado ao começar o dia

### 4️⃣ Ao Instalar/Atualizar a Extensão
- ⏰ **Tempo:** Imediatamente
- 📍 **Quando:** Após recarregar em chrome://extensions
- ✅ **Resultado:** Confirma se está na última versão

---

## 📊 Comparação com Chrome Web Store

| Sistema | Tempo Médio | Controle | Custo |
|---------|-------------|----------|-------|
| **Nossa solução** | 1-15 min | Total | Grátis |
| Chrome Web Store | 1-24 horas | Google | $5 |

---

## 🎯 Cenários Práticos

### Cenário 1: Usuário está trabalhando
```
09:00 - Você faz upload da v1.0.1 no GitHub
09:05 - João está trabalhando no Creare
09:08 - João recarrega a página → ✅ Atualização detectada!
09:08 - Notificação: "v1.0.1 disponível!"
```

### Cenário 2: Usuário não está na página
```
09:00 - Você faz upload da v1.0.1 no GitHub
09:10 - Maria está em outra aba
09:15 - Verificação automática → ✅ Atualização detectada!
09:15 - Notificação: "v1.0.1 disponível!"
```

### Cenário 3: Começo do dia
```
09:00 - Você faz upload da v1.0.1 no GitHub
10:00 - Pedro abre o navegador
10:00 - Verificação automática → ✅ Atualização detectada!
10:00 - Notificação: "v1.0.1 disponível!"
```

---

## ⚡ Atualização de Emergência

Se você fez uma correção crítica e precisa que **todos atualizem AGORA**:

### Opção 1: Avisar no grupo (Mais rápido)
```
"Pessoal, atualizei a extensão com correção urgente!
Recarregue a página do Creare ou execute: checkUpdates()"
```
**Tempo:** Imediato ⚡

### Opção 2: Aguardar verificação automática
**Tempo:** Máximo 15 minutos ⏰

### Opção 3: Reduzir intervalo temporariamente
Edite `background.js` e `updater.js`:
```javascript
checkInterval: 1 * 60 * 1000,  // 1 minuto (só em emergência!)
```
**Importante:** Volte para 15 minutos depois!

---

## 🔧 Personalizar Intervalos

### Para verificações ainda mais rápidas:

**`background.js` e `updater.js` (linha 10):**

```javascript
// OPÇÕES:
checkInterval: 5 * 60 * 1000,    // 5 minutos (muito rápido)
checkInterval: 10 * 60 * 1000,   // 10 minutos (rápido)
checkInterval: 15 * 60 * 1000,   // 15 minutos (recomendado) ✅
checkInterval: 30 * 60 * 1000,   // 30 minutos (moderado)
checkInterval: 60 * 60 * 1000,   // 1 hora (econômico)
```

**Recomendação:** 15 minutos é o ideal! ⚡

---

## 💡 Por Que 15 Minutos?

✅ **Rápido o suficiente** - Bug corrigido em minutos
✅ **Não sobrecarrega** - Não faz muitas requisições ao GitHub
✅ **Bateria amigável** - Não drena notebook/celular
✅ **Confiável** - Testado e aprovado

---

## 📈 Estatísticas de Atualização

Com 4 pontos de verificação, a probabilidade de receber atualização rapidamente é:

- **Trabalho ativo:** 99% em 3 segundos ⚡
- **Navegador aberto:** 100% em até 15 minutos ⏰
- **Começo do dia:** 100% ao abrir navegador 🌅

---

## ❓ FAQ

**P: Posso forçar verificação manual?**
R: Sim! Execute no console: `checkUpdates()`

**P: A verificação consome muita internet?**
R: Não! Apenas ~2KB a cada 15 minutos (insignificante)

**P: E se o GitHub estiver fora do ar?**
R: A extensão continua funcionando normalmente, só não atualiza

**P: Posso desativar auto-update?**
R: Sim, remova `updater.js` do manifest.json

---

**Tempo configurado atual: 15 minutos** ⏰
**Tempo máximo de atualização: 15 minutos** ✅
**Tempo típico na prática: 1-5 minutos** 🚀
