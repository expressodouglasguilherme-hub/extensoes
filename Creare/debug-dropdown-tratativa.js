// ============================================================
// DEBUG: DESCOBRIR VALOR REAL DO DROPDOWN DE TRATATIVA
// Cole este código no console do navegador (F12) DEPOIS de 
// selecionar a tratativa "Invalidar" no dropdown
// ============================================================

console.log('🔍 DEBUG DROPDOWN: Iniciando análise...');
console.log('═══════════════════════════════════════════════════════════════');

// 1. PROCURA O LABEL VISÍVEL
console.log('\n📋 PASSO 1: Verificando label visível...');
const label = document.querySelector('.ui-dropdown-label');
if (label) {
  console.log('   ✅ Label encontrado:', label);
  console.log('   📝 Texto visível:', label.textContent.trim());
  console.log('   🎨 Classes:', label.className);
} else {
  console.log('   ❌ Label não encontrado');
}

// 2. PROCURA O COMPONENTE P-DROPDOWN
console.log('\n📦 PASSO 2: Verificando componente p-dropdown...');
const pDropdown = document.querySelector('p-dropdown');
if (pDropdown) {
  console.log('   ✅ p-dropdown encontrado:', pDropdown);
  console.log('   🎨 Classes:', pDropdown.className);
  
  // Tenta acessar o contexto Angular
  if (pDropdown.__ngContext__) {
    console.log('   ✅ __ngContext__ existe!');
    console.log('   📊 Contexto completo:', pDropdown.__ngContext__);
    
    // Procura pelo componente dentro do contexto
    for (let i = 0; i < pDropdown.__ngContext__.length; i++) {
      const item = pDropdown.__ngContext__[i];
      if (item && typeof item === 'object') {
        console.log(`\n   🔍 Item ${i}:`, item);
        
        // Procura propriedades relevantes
        if (item.value !== undefined) {
          console.log('   🎯 ENCONTROU VALUE:', item.value);
        }
        if (item.selectedOption !== undefined) {
          console.log('   🎯 ENCONTROU SELECTED OPTION:', item.selectedOption);
        }
        if (item.options !== undefined) {
          console.log('   🎯 ENCONTROU OPTIONS:', item.options);
        }
        if (item._value !== undefined) {
          console.log('   🎯 ENCONTROU _VALUE:', item._value);
        }
      }
    }
  } else {
    console.log('   ⚠️ __ngContext__ não existe');
  }
} else {
  console.log('   ❌ p-dropdown não encontrado');
}

// 3. PROCURA TODAS AS PROPRIEDADES DO DROPDOWN
console.log('\n🔍 PASSO 3: Analisando todas as propriedades...');
const dropdown = document.querySelector('.ui-dropdown');
if (dropdown) {
  console.log('   ✅ ui-dropdown encontrado:', dropdown);
  
  // Lista todas as propriedades personalizadas
  for (const key of Object.keys(dropdown)) {
    if (key.startsWith('ng') || key.startsWith('_') || key.includes('value') || key.includes('selected')) {
      console.log(`   📌 ${key}:`, dropdown[key]);
    }
  }
} else {
  console.log('   ❌ ui-dropdown não encontrado');
}

// 4. PROCURA INPUTS HIDDEN (podem conter o valor real)
console.log('\n🕵️ PASSO 4: Procurando inputs hidden...');
const allInputs = document.querySelectorAll('input[type="hidden"], input[type="text"]');
console.log(`   📊 Total de inputs: ${allInputs.length}`);

allInputs.forEach((input, index) => {
  if (input.value && input.value.toLowerCase().includes('invalid')) {
    console.log(`\n   ✅ INPUT ${index} CONTÉM "INVALID"!`);
    console.log('      Elemento:', input);
    console.log('      Value:', input.value);
    console.log('      Name:', input.name);
    console.log('      ID:', input.id);
    console.log('      Classes:', input.className);
  }
});

// 5. PROCURA SELECT NATIVO (caso o PrimeNG use um select por baixo)
console.log('\n📝 PASSO 5: Procurando select nativo...');
const selects = document.querySelectorAll('select');
console.log(`   📊 Total de selects: ${selects.length}`);

selects.forEach((select, index) => {
  if (select.offsetParent !== null || select.style.display !== 'none') {
    console.log(`\n   🔍 SELECT ${index}:`, select);
    console.log('      SelectedIndex:', select.selectedIndex);
    if (select.selectedIndex >= 0) {
      const option = select.options[select.selectedIndex];
      console.log('      Opção selecionada:', option.text);
      console.log('      Value da opção:', option.value);
    }
  }
});

// 6. PROCURA NG-MODEL ou NG-VALUE
console.log('\n🎯 PASSO 6: Procurando atributos Angular...');
const elementsWithNg = document.querySelectorAll('[ng-model], [ng-value], [ng-reflect-model], [ng-reflect-value]');
console.log(`   📊 Total de elementos com atributos Angular: ${elementsWithNg.length}`);

elementsWithNg.forEach((el, index) => {
  const ngModel = el.getAttribute('ng-model') || el.getAttribute('ng-reflect-model');
  const ngValue = el.getAttribute('ng-value') || el.getAttribute('ng-reflect-value');
  
  if (ngModel || ngValue) {
    console.log(`\n   🔍 ELEMENTO ${index}:`, el);
    if (ngModel) console.log('      ng-model:', ngModel);
    if (ngValue) console.log('      ng-value:', ngValue);
  }
});

// 7. MONITORA MUDANÇAS NO DROPDOWN
console.log('\n👁️ PASSO 7: Instalando monitor...');
console.log('   ℹ️  Agora selecione novamente a tratativa "Invalidar"');
console.log('   ℹ️  O console vai mostrar todos os eventos disparados');

let eventCount = 0;

// Monitora TODOS os eventos do dropdown
const allDropdowns = document.querySelectorAll('.ui-dropdown, p-dropdown');
allDropdowns.forEach(dropdown => {
  ['change', 'click', 'input', 'select'].forEach(eventType => {
    dropdown.addEventListener(eventType, (e) => {
      eventCount++;
      console.log('\n🎯 EVENTO DISPARADO!', {
        numero: eventCount,
        tipo: eventType,
        target: e.target,
        currentTarget: e.currentTarget,
        detail: e.detail
      });
      
      // Mostra o label após o evento
      setTimeout(() => {
        const labelAtual = document.querySelector('.ui-dropdown-label');
        if (labelAtual) {
          console.log('   📋 Label após evento:', labelAtual.textContent.trim());
        }
      }, 100);
    }, true);
  });
});

console.log('   ✅ Monitor instalado!');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('✅ DEBUG PRONTO!');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n📝 PRÓXIMOS PASSOS:');
console.log('1. Selecione a tratativa "Invalidar" no dropdown');
console.log('2. Observe os logs que aparecerem');
console.log('3. Copie TODOS os logs e me envie');
console.log('\n═══════════════════════════════════════════════════════════════\n');
