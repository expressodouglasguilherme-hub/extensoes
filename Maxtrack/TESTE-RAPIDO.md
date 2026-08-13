# 🧪 Guia Rápido de Teste - Player Customizado

## ✅ O QUE TESTAR

### 1️⃣ Página de Eventos (DEVE ABRIR FULLSCREEN)

**Como testar:**
1. Vá para a tabela de eventos do Maxtrack
2. Clique em um vídeo de alerta/evento
3. **Esperado**: Vídeo abre em tela cheia com controles personalizados

**Console deve mostrar:**
```
🎬 Abrindo vídeo em tela cheia customizada...
```

**Você deve ver:**
- ✅ Fundo gradiente preto/azul escuro
- ✅ Vídeo centralizado com bordas arredondadas
- ✅ Painel de controles na parte inferior:
  - ⏪ ▶/⏸ ⏩ (Play/Pause no centro)
  - ⏱️ Tempo (ex: 1:23 / 3:45)
  - ⚡ Velocidade (botão azul)
  - 🔊 Volume
  - 📥 Download (botão verde)
- ✅ Botão X vermelho (canto superior direito)
- ✅ Info de tempo (canto superior esquerdo)
- ✅ Barra de progresso azul (parte inferior)

---

### 2️⃣ Página de DVR (NÃO DEVE ABRIR FULLSCREEN)

**Como testar:**
1. Vá para a página de DVR (com mapa e timeline)
2. Clique em um vídeo ou deixe tocar
3. **Esperado**: Vídeo toca normalmente no player nativo do DVR

**Console deve mostrar:**
```
🎬 DVR detectado via hash: #dvr
🎬 Página de DVR detectada - vídeo não será aberto em tela cheia
```

**Você deve ver:**
- ✅ Vídeo no player nativo (lado esquerdo)
- ✅ Mapa ao lado direito
- ✅ Timeline embaixo do vídeo
- ❌ NÃO abre em fullscreen
- ❌ NÃO mostra controles personalizados

---

## 🎮 COMO USAR OS CONTROLES

### Botões Visuais:
- **⏪** → Voltar 10 segundos
- **▶/⏸** → Play/Pause (botão grande branco)
- **⏩** → Avançar 10 segundos
- **⚡ 1x** → Altera velocidade (0.5x → 2x)
- **🔊** → Mute/Unmute
- **📥 Download** → Baixar vídeo
- **X (vermelho)** → Fechar

### Atalhos de Teclado:
| Tecla | Ação |
|-------|------|
| `Espaço` ou `K` | Play/Pause |
| `←` ou `J` | Voltar 10s |
| `→` ou `L` | Avançar 10s |
| `M` | Mute/Unmute |
| `F` | Fullscreen nativo do navegador |
| `Esc` | Fechar player |

### Outras Interações:
- **Clicar na barra de progresso** → Vai para aquele momento
- **Mover o mouse** → Mostra os controles (se estavam escondidos)
- **Clicar fora do vídeo** → Fecha o player

---

## 🐛 PROBLEMAS COMUNS

### ❌ Problema: Não abre em tela cheia na página de eventos

**Verificar:**
1. Abra o Console (F12)
2. Veja se aparece: `🎬 DVR detectado...`
3. Se aparecer, a página está sendo detectada incorretamente como DVR

**Solução:**
```javascript
// No console, execute:
console.log('Hash:', window.location.hash);
console.log('Timeline:', document.querySelector('canvas[style*="cursor"]'));
console.log('Mapa:', document.querySelector('.leaflet-container'));

// Se Timeline ou Mapa estiver presente incorretamente, reporte o bug
```

---

### ❌ Problema: Abre em tela cheia no DVR

**Verificar:**
1. Você está na URL com `#dvr`?
2. Tem mapa e timeline na tela?

**Solução:**
```javascript
// No console, execute:
console.log('É DVR?', 
  window.location.hash === '#dvr' ||
  (!!document.querySelector('canvas[style*="cursor"]') && 
   !!document.querySelector('.leaflet-container'))
);

// Se retornar false, a detecção falhou
```

---

### ❌ Problema: Controles não aparecem

**Verificar:**
1. Os controles somem após 3 segundos (auto-hide)
2. Mova o mouse para fazê-los aparecer
3. Se o vídeo estiver pausado, sempre ficam visíveis

**Forçar mostrar:**
- Mova o mouse sobre o player
- Pause o vídeo (Espaço)

---

### ❌ Problema: Atalhos de teclado não funcionam

**Verificar:**
1. O player está com foco?
2. Clique no vídeo primeiro
3. Tente apertar `K` (deve pausar/despausar)

---

## 📊 CHECKLIST DE TESTE

### Página de Eventos:
- [ ] Vídeo abre em fullscreen customizado
- [ ] Botão Play/Pause funciona
- [ ] Botões de skip (⏪⏩) funcionam
- [ ] Velocidade muda e salva
- [ ] Volume liga/desliga
- [ ] Barra de progresso é clicável
- [ ] Atalhos de teclado funcionam (Espaço, J, K, L, M)
- [ ] Controles somem após 3s (auto-hide)
- [ ] Controles aparecem ao mover mouse
- [ ] Botão X fecha o player
- [ ] ESC fecha o player
- [ ] Download funciona

### Página de DVR:
- [ ] Vídeo NÃO abre em fullscreen
- [ ] Vídeo toca no player nativo
- [ ] Timeline funciona normalmente
- [ ] Mapa fica visível ao lado

---

## 🎯 RESULTADO ESPERADO FINAL

### ✅ Sucesso Total:
- Eventos → Fullscreen customizado ✅
- DVR → Player nativo ✅
- Controles funcionam ✅
- Atalhos funcionam ✅
- Auto-hide funciona ✅
- Download funciona ✅

---

## 📝 COMO REPORTAR BUGS

Se encontrar problemas, reporte com:

1. **Página onde ocorreu** (Eventos ou DVR?)
2. **URL/Hash** (`window.location.hash`)
3. **Console logs** (copie as mensagens)
4. **Comportamento esperado vs atual**
5. **Screenshot** (se possível)

**Exemplo:**
```
Página: Eventos
Hash: #Event/Event?id=abc123
Log: (nenhum log apareceu)
Esperado: Abrir fullscreen
Atual: Não abriu
```

---

**Versão**: 1.3.1  
**Data**: Agosto 2026  
**Testador**: _________
