// ============================================================
// DEBUG: DESCOBRIR PROCESSO DE INVALIDAÇÃO
// Cole este código no console do navegador (F12)
// ============================================================

console.log('🔍 DEBUG INVALIDAR: Iniciando análise...');
console.log('═══════════════════════════════════════════════════════════════');

// 1. PROCURA O SELECT/DROPDOWN DE TRATATIVA
console.log('\n📋 PASSO 1: Procurando dropdown de Tratativa...');
const selects = document.querySelectorAll('select, p-dropdown, .ui-dropdown');
console.log(`   ✓ Encontrei ${selects.length} dropdowns/selects`);

selects.forEach((sel, index) => {
  const label = sel.querySelector('.ui-dropdown-label');
  const text = label ? label.textContent : (sel.options?.[sel.selectedIndex]?.text || sel.textContent);
  console.log(`   ${index + 1}. Dropdown:`, sel);
  console.log(`      Texto selecionado: "${text}"`);
  console.log(`      Classes:`, sel.className);
});

// 2. PROCURA BOTÕES "INVALIDAR" OU "FINALIZAR"
console.log('\n🔘 PASSO 2: Procurando botões de ação...');
const buttons = document.querySelectorAll('button, .btn, [role="button"]');
const botoesRelevantes = [];

buttons.forEach(btn => {
  const text = btn.textContent.trim().toUpperCase();
  if (text.includes('INVALID') || text.includes('FINALI') || text.includes('CONCLU') || text.includes('SALVAR')) {
    botoesRelevantes.push({
      elemento: btn,
      texto: btn.textContent.trim(),
      classes: btn.className,
      visible: btn.offsetParent !== null,
      onclick: btn.onclick?.toString() || 'Sem onclick direto',
      ngClick: btn.getAttribute('ng-click') || btn.getAttribute('(click)') || 'Sem ng-click'
    });
  }
});

console.log(`   ✓ Encontrei ${botoesRelevantes.length} botões relevantes:`);
botoesRelevantes.forEach((info, index) => {
  console.log(`\n   ${index + 1}. BOTÃO: "${info.texto}"`);
  console.log(`      Elemento:`, info.elemento);
  console.log(`      Classes: ${info.classes}`);
  console.log(`      Visível: ${info.visible ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`      onclick: ${info.onclick}`);
  console.log(`      ng-click: ${info.ngClick}`);
});

// 3. INTERCEPTA CLIQUES EM TODOS OS BOTÕES
console.log('\n🎯 PASSO 3: Instalando interceptador de cliques...');
let clickCount = 0;

buttons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    clickCount++;
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`🖱️ CLIQUE #${clickCount} DETECTADO!`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📍 Botão clicado:', this);
    console.log('📝 Texto:', this.textContent.trim());
    console.log('🎨 Classes:', this.className);
    console.log('🔍 ID:', this.id);
    
    // Verifica o estado do dropdown de tratativa
    const dropdownAtual = document.querySelector('.ui-dropdown-label');
    if (dropdownAtual) {
      console.log('📋 Tratativa selecionada:', dropdownAtual.textContent.trim());
    }
    
    // Captura o stack trace
    console.log('📚 Stack trace:');
    console.trace();
    
    console.log('═══════════════════════════════════════════════════════════════\n');
  }, true); // true = captura na fase de captura
});

console.log('   ✅ Interceptador instalado em todos os botões!');

// 4. MONITORA POPUPS QUE APARECEM
console.log('\n👁️ PASSO 4: Instalando monitor de popups...');
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const text = node.textContent || '';
        
        // Detecta popup de confirmação
        if (text.includes('tem certeza') || text.includes('deseja finalizar')) {
          console.log('\n🚨 POPUP DE CONFIRMAÇÃO DETECTADO!');
          console.log('═══════════════════════════════════════════════════════════════');
          console.log('📍 Elemento:', node);
          console.log('📝 Texto completo:', text);
          console.log('🎨 Classes:', node.className);
          console.log('🔍 HTML:', node.outerHTML?.substring(0, 500));
          
          // Lista todos os botões dentro do popup
          const botoesPopup = node.querySelectorAll('button, .btn');
          console.log(`\n🔘 Botões no popup (${botoesPopup.length}):`);
          botoesPopup.forEach((btn, i) => {
            console.log(`   ${i + 1}. "${btn.textContent.trim()}"`);
            console.log(`      Classes: ${btn.className}`);
            console.log(`      Elemento:`, btn);
          });
          
          // Verifica qual tratativa está selecionada NESTE MOMENTO
          const tratativaSelecionada = document.querySelector('.ui-dropdown-label');
          if (tratativaSelecionada) {
            console.log('\n📋 TRATATIVA SELECIONADA QUANDO O POPUP APARECEU:');
            console.log(`   "${tratativaSelecionada.textContent.trim()}"`);
          }
          
          console.log('═══════════════════════════════════════════════════════════════\n');
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('   ✅ Monitor de popups instalado!');

// 5. MONITORA MUDANÇAS NO DROPDOWN
console.log('\n📊 PASSO 5: Instalando monitor de dropdown...');
const dropdownObserver = new MutationObserver(() => {
  const label = document.querySelector('.ui-dropdown-label');
  if (label && label.textContent.trim() !== 'Selecione uma Tratativa') {
    console.log('\n📋 TRATATIVA ALTERADA:', label.textContent.trim());
  }
});

const dropdown = document.querySelector('p-dropdown, .ui-dropdown');
if (dropdown) {
  dropdownObserver.observe(dropdown, {
    childList: true,
    subtree: true,
    characterData: true
  });
  console.log('   ✅ Monitor de dropdown instalado!');
} else {
  console.log('   ⚠️ Dropdown não encontrado');
}

// INSTRUÇÕES FINAIS
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('✅ DEBUG INSTALADO COM SUCESSO!');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n📝 INSTRUÇÕES:');
console.log('1. Agora selecione uma tratativa de INVALIDAR no dropdown');
console.log('2. Clique no botão para finalizar/concluir');
console.log('3. Observe os logs que vão aparecer aqui no console');
console.log('4. Copie TODOS os logs e me envie');
console.log('\n💡 Os logs vão mostrar:');
console.log('   - Qual botão foi clicado');
console.log('   - Qual tratativa estava selecionada');
console.log('   - Quando o popup apareceu');
console.log('   - Todos os botões disponíveis no popup');
console.log('\n═══════════════════════════════════════════════════════════════\n');
