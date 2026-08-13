# Atualização Automática de Datas

## 📅 Funcionalidade

A extensão agora possui um botão que atualiza automaticamente os filtros de período na página de eventos do Maxtrack.

## 🎯 Objetivo

Eliminar a necessidade de alterar manualmente as datas de período e fim do período toda vez que você inicia um turno.

## ⚙️ Como Funciona

### Período Configurado

O botão configura automaticamente:
- **Data Início**: 1 dia antes da data atual do PC
- **Data Fim**: 1 dia depois da data atual do PC

### Exemplo

Se hoje é **28/07/2026**:
- **Período**: 27/07/2026
- **Fim**: 29/07/2026

## 🔘 Como Usar

1. Acesse a página: `https://go.maxtrack.com.br/#event/Event`
2. Aguarde o carregamento completo da página (cerca de 3 segundos)
3. Procure pelo botão **"Atualizar Período"** (🗓️ ícone azul) no topo da área de filtros
4. Clique no botão
5. As datas serão atualizadas automaticamente
6. O sistema tentará aplicar o filtro automaticamente

## ✅ Confirmação

Após clicar no botão, você verá uma notificação verde no canto superior direito com:
- ✅ Período atualizado!
- As datas configuradas (Ex: 27/07/2026 até 29/07/2026)

## 🔍 Detalhes Técnicos

### Identificação dos Campos

A extensão procura automaticamente os campos de data através de:
1. **Nomes dos campos**: `periodo`, `inicio`, `fim`, `start`, `end`
2. **Placeholders**: Textos como "Período", "Início", "Fim", "Data"
3. **Labels**: Rótulos próximos aos campos
4. **Ordem**: Se não identificar pelos nomes, usa os dois primeiros campos de data encontrados

### Formato de Data

As datas são sempre formatadas como: `DD/MM/YYYY`

### Aplicação do Filtro

Após atualizar as datas, a extensão tenta automaticamente:
1. Disparar os eventos necessários para o sistema reconhecer a mudança
2. Localizar e clicar no botão de "Filtrar" ou "Pesquisar"
3. Atualizar os dados na tela

## ⚠️ Observações

- O botão só aparece quando você está na página de eventos
- É necessário aguardar o carregamento completo da página (3 segundos)
- Se os campos de data não forem encontrados, uma notificação de aviso será exibida
- O botão é recriado automaticamente quando você navega entre páginas

## 🐛 Solução de Problemas

### Botão não aparece
- Verifique se você está na URL correta: `https://go.maxtrack.com.br/#event/Event`
- Aguarde mais alguns segundos para a página carregar completamente
- Recarregue a página (F5)

### Datas não são atualizadas
- Verifique se os campos de período estão visíveis na tela
- Tente atualizar manualmente um dos campos primeiro
- Recarregue a extensão nas configurações do navegador

### Filtro não é aplicado automaticamente
- Clique manualmente no botão de "Filtrar" após atualizar as datas
- Verifique se há outros filtros que precisam ser configurados

## 📝 Histórico de Versões

### v1.1.0 (Atual)
- ✨ Adicionado botão de atualização automática de datas
- 🎨 Novo estilo visual com ícone de calendário
- 🔍 Detecção inteligente de campos de data
- 🤖 Aplicação automática do filtro

### v1.0.0
- ✅ Funcionalidade básica de copiar dados para WhatsApp

---

**Desenvolvido por Douglas G.**
