# 📋 Extensão: Copiar Informações de Alerta

> **Criado por Douglas G.**

Extensão profissional para navegadores Chrome/Edge que facilita o trabalho com alertas de monitoramento.

## ✨ Funcionalidades

### 1️⃣ Copiar Informações com Emojis
- ✅ Detecta automaticamente a área com informações do alerta
- ✅ Adiciona um botão "Copiar" no canto superior direito
- ✅ Copia todos os dados formatados com emojis bonitos
- ✅ Identifica o risco automaticamente (🔵 Baixo / 🟡 Médio / 🔴 Alto)
- ✅ Formato otimizado para WhatsApp

### 2️⃣ Textos Padrão Inteligentes
- ✅ Detecta o campo "Observações" automaticamente
- ✅ Botão azul "📝 Colar Texto Padrão"
- ✅ Menu moderno com gradiente roxo
- ✅ Textos organizados por tipo de alerta
- ✅ Funciona em criar e revisar tratativa

## 📦 Instalação

### Chrome / Edge

1. **Baixe os arquivos da extensão**
   - Certifique-se de ter a pasta `copy-alert-extension` com todos os arquivos

2. **Abra as extensões do navegador**
   - Chrome: Digite `chrome://extensions/` na barra de endereços
   - Edge: Digite `edge://extensions/` na barra de endereços

3. **Ative o Modo do Desenvolvedor**
   - No canto superior direito, ative a opção "Modo do desenvolvedor"

4. **Carregue a extensão**
   - Clique em "Carregar sem compactação" ou "Load unpacked"
   - Selecione a pasta `copy-alert-extension`

5. **Pronto!**
   - A extensão será carregada e estará ativa
   - Acesse a página com as informações de alerta

## 🎯 Como usar

1. Acesse a página que contém as informações do alerta
2. Um botão verde "Copiar" aparecerá automaticamente no canto superior direito da área de informações
3. Clique no botão para copiar todos os dados
4. Cole onde desejar (Ctrl+V ou Cmd+V)

## 📝 Formato copiado

Os dados são copiados no seguinte formato:

```
**Empresa**
Bracell

**Filial**
GRID 2

**Placa / Prefixo**
SSV0A56 - SSV0A56

**Motorista**
MARCIO JOSE DA SILVA

**Tipo de Alerta**
Bocejo

**Risco**
Baixo Risco

**Data Alerta**
20/07/2026, 13:06:45

**Velocidade**
18km/h

**ID da Auditoria**
55330958

**Autor Tratativa**
Douglas Guilherme de Miranda

**Tratativa**
Bocejo

**Observações**
[MOTORISTA COM CINTO] monitorado
```

## 🔧 Estrutura dos arquivos

```
copy-alert-extension/
├── manifest.json       # Configuração da extensão
├── content.js          # Script principal
├── styles.css          # Estilos do botão
├── icon16.png          # Ícone 16x16
├── icon48.png          # Ícone 48x48
├── icon128.png         # Ícone 128x128
└── README.md           # Este arquivo
```

## ⚠️ Observação sobre ícones

A extensão requer ícones para funcionar corretamente. Você pode:

1. **Usar ícones simples** (recomendado para teste):
   - Crie imagens PNG simples de 16x16, 48x48 e 128x128 pixels
   - Nomeie como `icon16.png`, `icon48.png`, `icon128.png`
   - Coloque na pasta da extensão

2. **Remover a exigência de ícones** (temporário):
   - Edite o arquivo `manifest.json`
   - Remova a seção `"icons"`

## 🐛 Solução de problemas

**O botão não aparece:**
- Verifique se a página contém os campos esperados (Empresa, Filial, etc.)
- Atualize a página (F5)
- Verifique se a extensão está ativada em `chrome://extensions/`

**Erro ao copiar:**
- Verifique as permissões do navegador
- Teste em uma aba normal (não em páginas do chrome:// ou edge://)

## 📱 Compatibilidade

- ✅ Google Chrome (versão 88+)
- ✅ Microsoft Edge (versão 88+)
- ✅ Brave
- ✅ Opera
- ✅ Outros navegadores baseados em Chromium

## 📄 Licença

Livre para uso pessoal e comercial.

---

<p align="center">
  <strong>🚀 Desenvolvido por Douglas G.</strong><br>
  <em>Extensão para otimizar o trabalho com alertas de monitoramento</em>
</p>
