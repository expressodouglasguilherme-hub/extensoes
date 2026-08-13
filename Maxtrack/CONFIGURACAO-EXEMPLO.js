/**
 * ARQUIVO DE CONFIGURAÇÃO DE EXEMPLO
 * 
 * Este arquivo mostra diferentes formas de configurar os seletores
 * dependendo da estrutura da tabela do Maxtrack.
 * 
 * IMPORTANTE: Este é apenas um arquivo de referência!
 * As configurações reais devem ser feitas em content.js
 */

// ============================================================================
// EXEMPLO 1: Usando índices de colunas (nth-child)
// ============================================================================
// Use quando as colunas não têm classes CSS específicas

const SELECTORS_EXEMPLO_1 = {
  tableRow: 'tr.selected, tr.active, tr[aria-selected="true"]',
  tableBody: 'tbody tr',
  
  empresa: 'td:nth-child(1)',              // 1ª coluna
  cliente: 'td:nth-child(2)',              // 2ª coluna
  identificador: 'td:nth-child(3)',        // 3ª coluna
  informacoesAdicionais: 'td:nth-child(4)', // 4ª coluna
  localidade: 'td:nth-child(5)',           // 5ª coluna
  nome: 'td:nth-child(6)',                 // 6ª coluna
  criticidade: 'td:nth-child(7)',          // 7ª coluna
  data: 'td:nth-child(8)',                 // 8ª coluna
  status: 'td:nth-child(9)',               // 9ª coluna
  tipoClassificacao: 'td:nth-child(10)'    // 10ª coluna
};

// ============================================================================
// EXEMPLO 2: Usando classes CSS
// ============================================================================
// Use quando as células têm classes específicas

const SELECTORS_EXEMPLO_2 = {
  tableRow: 'tr.selected, tr.active',
  tableBody: 'tbody tr',
  
  empresa: 'td.empresa, td[data-field="empresa"]',
  cliente: 'td.cliente, td[data-field="cliente"]',
  identificador: 'td.identificador, td[data-field="placa"]',
  informacoesAdicionais: 'td.info-adicional, td[data-field="motorista"]',
  localidade: 'td.localidade, td[data-field="localizacao"]',
  nome: 'td.tipo-alerta, td[data-field="tipo"]',
  criticidade: 'td.criticidade, td[data-field="nivel"]',
  data: 'td.data-hora, td[data-field="data"]',
  status: 'td.status, td[data-field="status"]',
  tipoClassificacao: 'td.classificacao, td[data-field="classificacao"]'
};

// ============================================================================
// EXEMPLO 3: Usando atributos data-*
// ============================================================================
// Use quando as células têm atributos data-field ou data-column

const SELECTORS_EXEMPLO_3 = {
  tableRow: 'tr.row-selected',
  tableBody: 'table.events tbody tr',
  
  empresa: 'td[data-column="empresa"]',
  cliente: 'td[data-column="cliente"]',
  identificador: 'td[data-column="identificador"]',
  informacoesAdicionais: 'td[data-column="informacoes"]',
  localidade: 'td[data-column="localidade"]',
  nome: 'td[data-column="nome"]',
  criticidade: 'td[data-column="criticidade"]',
  data: 'td[data-column="data"]',
  status: 'td[data-column="status"]',
  tipoClassificacao: 'td[data-column="classificacao"]'
};

// ============================================================================
// EXEMPLO 4: Combinação (fallback múltiplo)
// ============================================================================
// Tenta múltiplos seletores até encontrar um válido

const SELECTORS_EXEMPLO_4 = {
  tableRow: 'tr.selected, tr.active, tr[class*="select"]',
  tableBody: 'tbody tr, .table-body tr',
  
  // Tenta classe, depois atributo, depois índice
  empresa: 'td.empresa, td[data-field="empresa"], td:nth-child(1)',
  cliente: 'td.cliente, td[data-field="cliente"], td:nth-child(2)',
  identificador: 'td.identificador, td[data-field="placa"], td:nth-child(3)',
  informacoesAdicionais: 'td.info-adicional, td[data-field="motorista"], td:nth-child(4)',
  localidade: 'td.localidade, td[data-field="localizacao"], td:nth-child(5)',
  nome: 'td.tipo-alerta, td[data-field="tipo"], td:nth-child(6)',
  criticidade: 'td.criticidade, td[data-field="nivel"], td:nth-child(7)',
  data: 'td.data-hora, td[data-field="data"], td:nth-child(8)',
  status: 'td.status, td[data-field="status"], td:nth-child(9)',
  tipoClassificacao: 'td.classificacao, td[data-field="classificacao"], td:nth-child(10)'
};

// ============================================================================
// COMO DESCOBRIR OS SELETORES CORRETOS
// ============================================================================

/**
 * PASSO A PASSO:
 * 
 * 1. Acesse https://go.maxtrack.com.br/
 * 2. Pressione F12 (abrir DevTools)
 * 3. Clique no ícone de seleção 🎯 no canto superior esquerdo do DevTools
 * 4. Clique em uma célula da tabela
 * 5. No painel Elements, você verá algo como:
 * 
 *    <tr class="selected">
 *      <td class="empresa" data-field="empresa">Nome da Empresa</td>
 *      <td class="cliente">Filial XYZ</td>
 *      <td data-column="3">ABC-1234</td>
 *    </tr>
 * 
 * 6. Com base no que você vê, escolha o melhor seletor:
 *    - Se tem classe: use '.classe' (ex: 'td.empresa')
 *    - Se tem data-field: use '[data-field="valor"]'
 *    - Se não tem nada: use ':nth-child(N)' onde N é a posição (começa em 1)
 * 
 * 7. Copie o formato do exemplo que mais se parece com sua situação
 * 8. Cole em content.js na seção const SELECTORS = { ... }
 * 9. Recarregue a extensão em chrome://extensions/
 * 10. Teste clicando no botão e verificando o console
 */

// ============================================================================
// CONFIGURAÇÕES DE EXTRAÇÃO ESPECIAL
// ============================================================================

/**
 * Se a placa e prefixo estão em colunas separadas:
 */
const SELECTORS_PLACA_SEPARADA = {
  // ... outros seletores
  placa: 'td:nth-child(3)',     // Coluna só com placa
  prefixo: 'td:nth-child(4)',   // Coluna só com prefixo
  // Remover 'identificador' e ajustar extractDataFromRow()
};

/**
 * Se o motorista está em uma célula separada (não em "informações adicionais"):
 */
const SELECTORS_MOTORISTA_SEPARADO = {
  // ... outros seletores
  motorista: 'td:nth-child(5)',  // Coluna específica do motorista
  // Ajustar extractDataFromRow() para usar getData(SELECTORS.motorista)
};

/**
 * Se há múltiplas tabelas na página:
 */
const SELECTORS_TABELA_ESPECIFICA = {
  tableRow: '#eventos-table tr.selected',  // Especifica qual tabela
  tableBody: '#eventos-table tbody tr',
  // ... outros seletores
};

// ============================================================================
// CONFIGURAÇÃO DE MAPEAMENTO DE CRITICIDADE
// ============================================================================

/**
 * Ajuste os textos e emojis conforme o sistema usa:
 */
const CRITICIDADE_EMOJI_CUSTOMIZADO = {
  // Textos em português
  'gravíssimo': '🔴',
  'grave': '🔴',
  'alto': '🔴',
  
  'médio': '🟡',
  'moderado': '🟡',
  'amarelo': '🟡',
  
  'leve': '🟢',
  'baixo': '🟢',
  'verde': '🟢',
  
  // Em inglês (se o sistema usar)
  'critical': '🔴',
  'high': '🔴',
  'medium': '🟡',
  'low': '🟢',
  
  // Padrão
  'default': '⚪'
};

// ============================================================================
// DICAS DE DEBUG
// ============================================================================

/**
 * Para ver no console todos os dados extraídos, adicione em content.js:
 */
function extractDataFromRow(row) {
  if (!row) return null;
  
  const data = {
    // ... extração de dados
  };
  
  // ADICIONE ESTA LINHA PARA DEBUG:
  console.log('📊 Dados extraídos:', data);
  
  return data;
}

/**
 * Para ver todos os seletores tentados, adicione em content.js:
 */
const getData = (selector) => {
  const element = row.querySelector(selector);
  console.log(`🔍 Seletor: ${selector} → ${element ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌'}`);
  return element ? element.textContent.trim() : '';
};

// ============================================================================
// NOTAS FINAIS
// ============================================================================

/**
 * LEMBRE-SE:
 * - Este arquivo é apenas para referência
 * - Edite sempre o arquivo content.js original
 * - Teste após cada mudança
 * - Use o console (F12) para debugar
 * - Recarregue a extensão após editar arquivos
 */
