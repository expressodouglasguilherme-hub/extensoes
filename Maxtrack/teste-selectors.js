/**
 * SCRIPT DE TESTE DE SELETORES
 * 
 * Como usar:
 * 1. Abra o Maxtrack (https://go.maxtrack.com.br/)
 * 2. Pressione F12 para abrir o Console
 * 3. Cole todo este script no console e pressione Enter
 * 4. Clique em uma linha da tabela
 * 5. Digite no console: testarSelectors()
 * 6. Verifique os resultados para ajustar os seletores em content.js
 */

function testarSelectors() {
  console.log('🔍 ========== TESTE DE SELETORES ==========\n');
  
  // Seletores a serem testados (copie os mesmos de content.js)
  const SELECTORS = {
    tableRow: 'tr.selected, tr.active, tr[class*="selected"]',
    tableBody: 'tbody tr',
    empresa: 'td:nth-child(1)',
    cliente: 'td:nth-child(2)',
    identificador: 'td:nth-child(3)',
    informacoesAdicionais: 'td:nth-child(4)',
    localidade: 'td:nth-child(5)',
    nome: 'td:nth-child(6)',
    criticidade: 'td:nth-child(7)',
    data: 'td:nth-child(8)',
    status: 'td:nth-child(9)',
    tipoClassificacao: 'td:nth-child(10)'
  };
  
  // Tentar encontrar linha selecionada
  console.log('📍 Procurando linha selecionada...');
  let selectedRow = document.querySelector(SELECTORS.tableRow);
  
  if (!selectedRow) {
    selectedRow = document.querySelector('tr.last-clicked');
  }
  
  if (!selectedRow) {
    selectedRow = document.querySelector('tr[aria-selected="true"]');
  }
  
  if (!selectedRow) {
    console.error('❌ ERRO: Nenhuma linha selecionada encontrada!');
    console.log('💡 Dica: Clique em uma linha da tabela antes de executar este teste');
    console.log('💡 Ou tente testar todos os seletores com: testarTodosSelectors()');
    return;
  }
  
  console.log('✅ Linha selecionada encontrada!\n');
  console.log('📊 Testando extração de dados...\n');
  
  // Testar cada seletor
  const resultados = {};
  let sucessos = 0;
  let falhas = 0;
  
  for (const [campo, seletor] of Object.entries(SELECTORS)) {
    if (campo === 'tableRow' || campo === 'tableBody') continue;
    
    const elemento = selectedRow.querySelector(seletor);
    const valor = elemento ? elemento.textContent.trim() : null;
    
    if (elemento && valor) {
      console.log(`✅ ${campo.padEnd(25)} → "${valor}"`);
      resultados[campo] = valor;
      sucessos++;
    } else {
      console.log(`❌ ${campo.padEnd(25)} → NÃO ENCONTRADO (seletor: ${seletor})`);
      resultados[campo] = null;
      falhas++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📈 Resultado: ${sucessos} sucessos, ${falhas} falhas`);
  console.log('='.repeat(60) + '\n');
  
  if (falhas > 0) {
    console.log('⚠️  ATENÇÃO: Alguns seletores não funcionaram!');
    console.log('🔧 Sugestões:');
    console.log('   1. Use: inspecionarTabela() para ver a estrutura HTML');
    console.log('   2. Ajuste os seletores em content.js');
    console.log('   3. Execute este teste novamente para validar\n');
  } else {
    console.log('🎉 SUCESSO! Todos os seletores funcionaram!\n');
  }
  
  console.log('📋 Mensagem que será gerada:\n');
  console.log(gerarMensagemTeste(resultados));
  
  return resultados;
}

function testarTodosSelectors() {
  console.log('🔍 ========== ANÁLISE DE TODAS AS LINHAS ==========\n');
  
  const linhas = document.querySelectorAll('tbody tr');
  
  if (linhas.length === 0) {
    console.error('❌ Nenhuma linha encontrada na tabela!');
    return;
  }
  
  console.log(`📊 Encontradas ${linhas.length} linhas na tabela\n`);
  console.log('Analisando primeira linha como exemplo...\n');
  
  const primeiraLinha = linhas[0];
  const celulas = primeiraLinha.querySelectorAll('td');
  
  console.log('📋 Estrutura das colunas:\n');
  
  celulas.forEach((celula, index) => {
    const conteudo = celula.textContent.trim().substring(0, 50);
    const classes = celula.className || '(sem classe)';
    const dataAttrs = Array.from(celula.attributes)
      .filter(attr => attr.name.startsWith('data-'))
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(', ') || '(sem data-*)';
    
    console.log(`Coluna ${index + 1}:`);
    console.log(`  Seletor básico: td:nth-child(${index + 1})`);
    console.log(`  Classes: ${classes}`);
    console.log(`  Atributos: ${dataAttrs}`);
    console.log(`  Conteúdo: "${conteudo}${conteudo.length >= 50 ? '...' : ''}"`);
    console.log('');
  });
  
  console.log('💡 Use estas informações para ajustar os seletores em content.js\n');
}

function inspecionarTabela() {
  console.log('🔍 ========== INSPEÇÃO DA TABELA ==========\n');
  
  const tabelas = document.querySelectorAll('table');
  
  if (tabelas.length === 0) {
    console.error('❌ Nenhuma tabela encontrada na página!');
    return;
  }
  
  console.log(`📊 Encontradas ${tabelas.length} tabela(s) na página\n`);
  
  tabelas.forEach((tabela, index) => {
    console.log(`Tabela ${index + 1}:`);
    console.log(`  ID: ${tabela.id || '(sem id)'}`);
    console.log(`  Classes: ${tabela.className || '(sem classe)'}`);
    console.log(`  Linhas: ${tabela.querySelectorAll('tbody tr').length}`);
    console.log('');
  });
  
  const tbody = document.querySelector('tbody');
  if (tbody) {
    const linhas = tbody.querySelectorAll('tr');
    console.log(`✅ tbody encontrado com ${linhas.length} linhas\n`);
    
    if (linhas.length > 0) {
      console.log('📋 Estrutura da primeira linha:\n');
      console.log(linhas[0].outerHTML.substring(0, 500) + '...\n');
    }
  }
}

function gerarMensagemTeste(dados) {
  const msg = `🏢 *Empresa:* ${dados.empresa || '[VAZIO]'}
📍 *Filial:* ${dados.cliente || '[VAZIO]'}
🚛 *Placa / Prefixo:* ${dados.identificador || '[VAZIO]'}
👤 *Motorista:* ${dados.informacoesAdicionais?.split('\n')[0] || '[VAZIO]'}
🗺️ *Localização:* ${dados.localidade || '[VAZIO]'}

⚠️ *Classificação*
- *Tipo:* ${dados.nome || '[VAZIO]'}
- *Nível de Risco:* ${dados.criticidade || '[VAZIO]'}

🕒 *Data/Hora do Alerta:* ${dados.data || '[VAZIO]'}

👨‍💼 *Operador Responsável:* Douglas G.

📝 *Tratativa*
${dados.status || '[VAZIO]'}${dados.tipoClassificacao ? ' - ' + dados.tipoClassificacao : ''}

📷 *Evidências*
🔗 *Link das imagens:* ${window.location.href}`;
  
  return msg;
}

function ajudaSeletores() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          AJUDA - TESTE DE SELETORES DO MAXTRACK            ║
╚════════════════════════════════════════════════════════════╝

📚 COMANDOS DISPONÍVEIS:

1. testarSelectors()
   → Testa os seletores na linha selecionada da tabela
   → Mostra quais campos foram extraídos com sucesso
   → Gera prévia da mensagem do WhatsApp

2. testarTodosSelectors()
   → Analisa todas as linhas da tabela
   → Mostra a estrutura de cada coluna
   → Lista classes CSS e atributos data-*
   → Útil para descobrir os seletores corretos

3. inspecionarTabela()
   → Lista todas as tabelas da página
   → Mostra estrutura básica do HTML
   → Ajuda a identificar qual tabela usar

4. ajudaSeletores()
   → Mostra esta mensagem de ajuda

═══════════════════════════════════════════════════════════

📋 PASSO A PASSO RECOMENDADO:

1. Execute: inspecionarTabela()
   → Para ver a estrutura geral

2. Execute: testarTodosSelectors()
   → Para identificar cada coluna

3. Ajuste os seletores em content.js baseado nos resultados

4. Clique em uma linha da tabela

5. Execute: testarSelectors()
   → Para validar se os seletores funcionam

═══════════════════════════════════════════════════════════

💡 DICAS:

• Use F12 → Elements → Clique no ícone 🎯 para inspecionar
• Seletores por índice: td:nth-child(1), td:nth-child(2)...
• Seletores por classe: td.empresa, td.cliente...
• Seletores por atributo: td[data-field="empresa"]
• Múltiplos seletores: 'td.empresa, td:nth-child(1)'

═══════════════════════════════════════════════════════════
  `);
}

// Executar ajuda automaticamente
console.log('%c🚀 Script de Teste de Seletores Carregado!', 'color: #25D366; font-size: 16px; font-weight: bold;');
console.log('Digite: ajudaSeletores() para ver os comandos disponíveis\n');
