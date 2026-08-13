// ============================================================
// FUNÇÃO DE DEBUG - ENCONTRAR BOTÃO CONCLUIR
// Execute no console: debugConcluirButton()
// ============================================================
window.debugConcluirButton = function() {
  console.log('🔍 DEBUG: Procurando botão "Concluir"...');
  console.log('═══════════════════════════════════════════════════\n');
  
  const allButtons = document.querySelectorAll('button, .btn, [role="button"], input[type="button"], input[type="submit"]');
  let found = [];
  
  console.log(`📊 Total de botões na página: ${allButtons.length}\n`);
  
  for (const btn of allButtons) {
    const text = btn.textContent?.trim().toLowerCase() || '';
    const value = btn.value?.toLowerCase() || '';
    const title = btn.title?.toLowerCase() || '';
    
    if (text.includes('concluir') || value.includes('concluir') || title.includes('concluir')) {
      const rect = btn.getBoundingClientRect();
      const isVisible = btn.offsetParent !== null && rect.height > 0 && rect.width > 0;
      
      const info = {
        element: btn,
        text: btn.textContent?.trim() || btn.value || '(sem texto)',
        tag: btn.tagName,
        type: btn.type,
        classes: btn.className || '(sem classe)',
        id: btn.id || '(sem id)',
        visible: isVisible,
        position: {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          bottom: Math.round(rect.bottom),
          right: Math.round(rect.right)
        },
        styles: {
          display: window.getComputedStyle(btn).display,
          position: window.getComputedStyle(btn).position,
          visibility: window.getComputedStyle(btn).visibility,
          opacity: window.getComputedStyle(btn).opacity
        },
        parent: btn.parentElement?.tagName,
        parentClasses: btn.parentElement?.className || '(sem classe)'
      };
      
      found.push(info);
      
      console.log('═══════════════════════════════════════════════════');
      console.log(`✅ BOTÃO CONCLUIR ENCONTRADO #${found.length}`);
      console.log('═══════════════════════════════════════════════════');
      console.log('📝 Texto:', info.text);
      console.log('🏷️  Tag:', info.tag);
      console.log('🎯 Type:', info.type);
      console.log('🎨 Classes:', info.classes);
      console.log('🆔 ID:', info.id);
      console.log('👁️  Visível:', info.visible ? '✅ SIM' : '❌ NÃO');
      console.log('\n📍 POSIÇÃO NA TELA:');
      console.log('   Top:', info.position.top + 'px');
      console.log('   Left:', info.position.left + 'px');
      console.log('   Width:', info.position.width + 'px');
      console.log('   Height:', info.position.height + 'px');
      console.log('   Bottom:', info.position.bottom + 'px (distância do topo até o fim do botão)');
      console.log('   Right:', info.position.right + 'px');
      console.log('\n🎭 ESTILOS:');
      console.log('   Display:', info.styles.display);
      console.log('   Position:', info.styles.position);
      console.log('   Visibility:', info.styles.visibility);
      console.log('   Opacity:', info.styles.opacity);
      console.log('\n👨‍👩‍👧 PAI:');
      console.log('   Tag:', info.parent);
      console.log('   Classes:', info.parentClasses);
      console.log('\n🔧 ELEMENTO (clique para inspecionar):');
      console.log(btn);
      
      // Mostra hierarquia de pais
      console.log('\n📊 HIERARQUIA (até 5 níveis):');
      let parent = btn.parentElement;
      let level = 1;
      while (parent && level <= 5) {
        const parentRect = parent.getBoundingClientRect();
        console.log(`   ${level}. ${parent.tagName} ${parent.className ? '.' + parent.className.split(' ').join('.') : ''}`);
        console.log(`      Position: top=${Math.round(parentRect.top)}px, height=${Math.round(parentRect.height)}px`);
        parent = parent.parentElement;
        level++;
      }
      
      console.log('\n');
    }
  }
  
  console.log('═══════════════════════════════════════════════════');
  console.log(`\n✅ RESUMO: ${found.length} botão(ões) "Concluir" encontrado(s)\n`);
  
  if (found.length === 0) {
    console.log('❌ Nenhum botão "Concluir" encontrado!');
    console.log('💡 Dicas:');
    console.log('   1. Certifique-se de estar na página de tratativa');
    console.log('   2. O botão pode estar com outro nome (Finalizar, Salvar, etc)');
    console.log('   3. Tente rolar a página até ver o botão e execute novamente');
  } else {
    console.log('💡 INFORMAÇÕES ÚTEIS:');
    console.log('   - Se Bottom > altura da janela, o botão está FORA da tela (precisa scroll)');
    console.log('   - Altura da janela atual:', window.innerHeight + 'px');
    console.log('   - Altura do documento:', document.documentElement.scrollHeight + 'px');
    console.log('   - Scroll atual:', window.scrollY + 'px');
    
    found.forEach((info, index) => {
      const isAboveFold = info.position.bottom <= window.innerHeight;
      console.log(`\n   Botão #${index + 1}: ${isAboveFold ? '✅ VISÍVEL sem scroll' : '⚠️ PRECISA SCROLL (está ' + Math.round(info.position.bottom - window.innerHeight) + 'px abaixo)'}`);
    });
  }
  
  console.log('\n═══════════════════════════════════════════════════\n');
  
  return found;
};

console.log('💡 DEBUG: Para encontrar o botão Concluir, execute no console: debugConcluirButton()');

// Trava de segurança: só executa no site da Creare (goawakecloud.com.br)
if (!/(^|\.)goawakecloud\.com\.br$/i.test(window.location.hostname)) {
  console.log('⛔ Extensão Creare - Colinha desativada neste site.');
} else {

// Variável para controlar se já adicionou o botão
let buttonAdded = false;

// Observa mudanças na página
const observer = new MutationObserver(() => {
  // Se já adicionou, não faz nada
  if (buttonAdded) return;
  
  // Procura especificamente pela div.col-md-12 que contém as informações
  const containers = document.querySelectorAll('.col-md-12');
  
  for (const container of containers) {
    const text = container.textContent;
    
    // Verifica se tem os campos específicos
    const hasEmpresa = text.includes('Empresa');
    const hasFilial = text.includes('Filial');
    const hasMotorista = text.includes('Motorista');
    const hasObservacoes = text.includes('Observações');
    const hasInfosFinish = container.querySelector('.row.infos-finish');
    
    // Se encontrou todos os campos E tem a estrutura correta
    if (hasEmpresa && hasFilial && hasMotorista && hasObservacoes && hasInfosFinish) {
      console.log('✓ Área de alerta encontrada!');
      addCopyButton(container);
      buttonAdded = true;
      break;
    }
  }
});

// Inicia observação
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Reseta quando a página muda
setInterval(() => {
  if (buttonAdded && !document.querySelector('.copy-alert-btn')) {
    buttonAdded = false;
  }
}, 1000);

// Adiciona o botão
function addCopyButton(element) {
  // Não adiciona se já existe
  if (element.querySelector('.copy-alert-btn')) {
    return;
  }
  
  const button = document.createElement('button');
  button.className = 'copy-alert-btn';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2h8a2 2 0 0 1 2 2v8M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M4 2v10a2 2 0 0 0 2 2h6" 
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Copiar</span>
  `;
  
  button.onclick = (e) => {
    e.stopPropagation();
    
    // Extrai os dados APENAS das divs com classe "row infos-finish"
    const dados = [];
    const jaAdicionados = new Set(); // Para evitar duplicatas
    
    // Mapeamento de campos para emojis
    const emojis = {
      'Empresa': '🏢',
      'Filial': '🏭',
      'Placa / Prefixo': '🚗',
      'Motorista': '👤',
      'Tipo de Alerta': '⚠️',
      'Tipo de Alerta:': '⚠️',
      'Risco': '📊',
      'Data Alerta': '📅',
      'Data Alerta:': '📅',
      'Velocidade': '⚡',
      'Velocidade:': '⚡',
      'ID da Auditoria': '🔢',
      'ID da Auditoria:': '🔢',
      'Autor Tratativa': '✍️',
      'Autor Tratativa:': '✍️',
      'Tratativa': '📝',
      'Tratativa:': '📝',
      'Observações': '💬',
      'Observações:': '💬'
    };
    
    // Pega apenas as rows com classe "infos-finish"
    const rows = element.querySelectorAll('.row.infos-finish');
    
    let risco = '';
    
    rows.forEach(row => {
      // Pega as divs col-md-3 dentro de cada row
      const cols = row.querySelectorAll('.col-md-3');
      
      cols.forEach(col => {
        const label = col.querySelector('label');
        const p = col.querySelector('p');
        
        if (label && p) {
          const campo = label.textContent.trim();
          const valor = p.textContent.trim();
          
          // Cria uma chave única para evitar duplicatas
          const chave = `${campo}:${valor}`;
          
          if (campo && valor && !jaAdicionados.has(chave)) {
            // Pega o emoji correspondente
            const emoji = emojis[campo] || '📌';
            
            // Se for o campo Risco, guarda o valor
            if (campo === 'Risco') {
              risco = valor.toLowerCase();
            }
            
            dados.push(`${emoji} ${campo}\n${valor}`);
            jaAdicionados.add(chave);
          }
        }
      });
    });
    
    // Adiciona a bolinha colorida baseada no risco
    let resultado = dados.join('\n\n');
    
    if (risco.includes('baixo')) {
      resultado = resultado.replace(/📊 Risco\n.*[Bb]aixo.*[Rr]isco/g, '🔵 Risco\nBaixo Risco');
      resultado = resultado.replace(/📊 Risco\n.*[Bb]aixo/g, '🔵 Risco\nBaixo risco');
    } else if (risco.includes('médio') || risco.includes('medio')) {
      resultado = resultado.replace(/📊 Risco\n.*[Mm]édio.*[Rr]isco/g, '🟡 Risco\nMédio Risco');
      resultado = resultado.replace(/📊 Risco\n.*[Mm]edio.*[Rr]isco/g, '🟡 Risco\nMédio Risco');
    } else if (risco.includes('alto')) {
      resultado = resultado.replace(/📊 Risco\n.*[Aa]lto.*[Rr]isco/g, '🔴 Risco\nAlto risco');
      resultado = resultado.replace(/📊 Risco\n.*[Aa]lto/g, '🔴 Risco\nAlto risco');
    }
    
    // Copia para área de transferência
    navigator.clipboard.writeText(resultado).then(() => {
      const original = button.innerHTML;
      button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copiado!</span>';
      button.style.background = '#2196F3';
      
      setTimeout(() => {
        button.innerHTML = original;
        button.style.background = '#4CAF50';
      }, 2000);
      
      console.log('✓ Dados copiados:', resultado);
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      button.innerHTML = '✗ Erro';
      button.style.background = '#f44336';
    });
  };
  
  // Posiciona o botão perto da coluna "Motorista"
  let motoristaCol = null;
  element.querySelectorAll('.row.infos-finish .col-md-3').forEach(col => {
    const lb = col.querySelector('label');
    if (lb && lb.textContent.trim().toLowerCase().startsWith('motorista')) {
      motoristaCol = col;
    }
  });

  const host = motoristaCol || element;
  if (window.getComputedStyle(host).position === 'static') {
    host.style.position = 'relative';
  }

  host.appendChild(button);
  console.log('✓✓✓ Botão adicionado!', motoristaCol ? '(na coluna Motorista)' : '(no painel)');
  
  // Adiciona o botão Concluir clonado após adicionar o botão Copiar
  addConcluirButtonClone(element);
}

// ============================================================
// BOTÃO CONCLUIR CLONADO
// Clona o botão "Concluir" original e posiciona perto do botão "Copiar"
// para evitar que o operador precise rolar a página até o fim
// ============================================================
function addConcluirButtonClone(element) {
  // Evita duplicar
  if (element.querySelector('.concluir-clone-btn')) {
    return;
  }
  
  console.log('🔍 Procurando botão Concluir original...');
  
  // Procura o botão Concluir original na página
  const allButtons = document.querySelectorAll('button, .btn, [role="button"]');
  let concluirOriginal = null;
  
  for (const btn of allButtons) {
    const text = btn.textContent?.trim().toLowerCase() || '';
    
    // Verifica se é o botão "Concluir" (btn btn-primary)
    if (text === 'concluir' && btn.classList.contains('btn') && btn.classList.contains('btn-primary')) {
      concluirOriginal = btn;
      console.log('✅ Botão Concluir original encontrado!', btn);
      break;
    }
  }
  
  if (!concluirOriginal) {
    console.log('⚠️ Botão Concluir original não encontrado');
    return;
  }
  
  // Clona o botão
  const buttonClone = document.createElement('button');
  buttonClone.className = 'concluir-clone-btn';
  buttonClone.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Concluir</span>
  `;
  
  // Quando clicar no clone, dispara o clique no botão original
  buttonClone.onclick = (e) => {
    e.stopPropagation();
    console.log('🖱️ Botão Concluir clonado clicado! Disparando clique no original...');
    
    // Feedback visual imediato
    const originalContent = buttonClone.innerHTML;
    buttonClone.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Processando...</span>';
    buttonClone.style.background = '#FF9800';
    
    // Clica no botão original
    setTimeout(() => {
      try {
        concluirOriginal.click();
        console.log('✅ Clique disparado no botão original!');
        
        // Feedback de sucesso
        buttonClone.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Enviado!</span>';
        buttonClone.style.background = '#2196F3';
        
        // Volta ao estado normal após 3 segundos
        setTimeout(() => {
          buttonClone.innerHTML = originalContent;
          buttonClone.style.background = '#FF5722';
        }, 3000);
      } catch (error) {
        console.error('❌ Erro ao clicar no botão original:', error);
        buttonClone.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Erro</span>';
        buttonClone.style.background = '#f44336';
        
        setTimeout(() => {
          buttonClone.innerHTML = originalContent;
          buttonClone.style.background = '#FF5722';
        }, 2000);
      }
    }, 200);
  };
  
  // Procura especificamente pelo H2 "Mensagem de Voz" e pega o container col-md-6
  console.log('🔍 Procurando H2 "Mensagem de Voz"...');
  
  let mensagemVozContainer = null;
  const allH2 = document.querySelectorAll('h2');
  
  for (const h2 of allH2) {
    const text = h2.textContent?.trim() || '';
    if (text === 'Mensagem de Voz') {
      console.log('✅ H2 "Mensagem de Voz" encontrado!', h2);
      
      // Pega o container col-md-6 pai deste H2
      mensagemVozContainer = h2.closest('.col-md-6');
      
      if (mensagemVozContainer) {
        console.log('✅ Container col-md-6 encontrado!', mensagemVozContainer);
        break;
      }
    }
  }
  
  if (mensagemVozContainer) {
    // Adiciona o botão dentro do container col-md-6 da Mensagem de Voz
    if (window.getComputedStyle(mensagemVozContainer).position === 'static') {
      mensagemVozContainer.style.position = 'relative';
    }
    mensagemVozContainer.appendChild(buttonClone);
    console.log('✅ Botão Concluir clonado adicionado no container da "Mensagem de Voz"!');
    
    // ESCONDE APENAS O BOTÃO "CONCLUIR" ORIGINAL (não outros btn-primary)
    esconderBotaoConcluirOriginal();
    
  } else {
    // Fallback: procura pela row.ferramentas
    console.log('⚠️ Container col-md-6 não encontrado, procurando .row.ferramentas...');
    
    const ferramentasRow = document.querySelector('.row.ferramentas');
    if (ferramentasRow) {
      if (window.getComputedStyle(ferramentasRow).position === 'static') {
        ferramentasRow.style.position = 'relative';
      }
      ferramentasRow.appendChild(buttonClone);
      console.log('✅ Botão Concluir clonado adicionado na row.ferramentas!');
      esconderBotaoConcluirOriginal();
    } else {
      // Último fallback: adiciona no step__footer (ao lado do botão original)
      console.log('⚠️ row.ferramentas não encontrada, procurando step__footer...');
      
      const footer = document.querySelector('.step__footer');
      if (footer) {
        footer.style.position = 'relative';
        footer.appendChild(buttonClone);
        console.log('✅ Botão Concluir clonado adicionado no footer!');
        esconderBotaoConcluirOriginal();
      } else {
        console.log('⚠️ Nenhum container adequado encontrado, não vai adicionar o botão clonado');
      }
    }
  }
}

// Esconde APENAS o botão "Concluir" original (verifica o texto)
function esconderBotaoConcluirOriginal() {
  console.log('🔍 Procurando botão "Concluir" original para esconder...');
  
  const allButtons = document.querySelectorAll('button.btn.btn-primary');
  
  for (const btn of allButtons) {
    const text = btn.textContent?.trim().toLowerCase() || '';
    
    // Esconde APENAS se o texto for exatamente "concluir"
    if (text === 'concluir') {
      btn.style.display = 'none';
      console.log('✅ Botão "Concluir" original escondido!', btn);
      break; // Só esconde o primeiro encontrado
    }
  }
}

console.log('📋 Extensão Copiar Alerta carregada!');

// Adiciona botão de texto padrão no campo Observações
function addTextoPadraoButton() {
  // Procura pelo campo Observações (textarea)
  const textareas = document.querySelectorAll('textarea');
  
  textareas.forEach(textarea => {
    // Pula se for muito pequeno (provavelmente não é o campo certo)
    if (textarea.offsetHeight < 50) return;
    
    // Verifica se é o campo de Observações de várias formas
    const parent = textarea.closest('div');
    if (!parent) return;
    
    // Procura por label que contenha "observa"
    let isObservacoes = false;
    
    // Busca 1: Labels dentro do parent
    const labels = parent.querySelectorAll('label');
    labels.forEach(label => {
      if (label.textContent.toLowerCase().includes('observa')) {
        isObservacoes = true;
      }
    });
    
    // Busca 2: Labels próximos (irmãos)
    const allLabels = document.querySelectorAll('label');
    allLabels.forEach(label => {
      if (label.textContent.toLowerCase().includes('observa')) {
        // Verifica se o textarea está próximo deste label
        const labelParent = label.closest('div');
        const textareaParent = textarea.closest('div');
        if (labelParent && textareaParent && 
            (labelParent.contains(textarea) || textareaParent.contains(label))) {
          isObservacoes = true;
        }
      }
    });
    
    // Busca 3: Placeholder do textarea
    if (textarea.placeholder && textarea.placeholder.toLowerCase().includes('observa')) {
      isObservacoes = true;
    }
    
    // Busca 4: Se tem "Realizar Tratativa" ou "Tratativa de Ocorrência" na página
    const pageText = document.body.textContent;
    if ((pageText.includes('Realizar Tratativa') || pageText.includes('Tratativa de Ocorrência')) && 
        textareas.length <= 2) {
      isObservacoes = true;
    }
    
    if (!isObservacoes) return;
    
    // Verifica se já existe botão NESTE textarea específico
    const existingButton = textarea.parentElement?.querySelector('.texto-padrao-btn');
    if (existingButton) return;
    
    // Verifica se já existe botão global
    if (document.querySelector('.texto-padrao-btn')) return;
    
    console.log('✓ Campo Observações encontrado, adicionando botão...');
    
    // Cria o botão
    const button = document.createElement('button');
    button.className = 'texto-padrao-btn';
    button.type = 'button';
    button.innerHTML = '📝 Colar Texto Padrão';
    button.style.cssText = `
      background: #2196F3;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      margin-top: 8px;
      display: inline-block;
      transition: all 0.3s;
    `;
    
    button.onmouseover = () => {
      button.style.background = '#1976D2';
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.3)';
    };
    
    button.onmouseout = () => {
      button.style.background = '#2196F3';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'none';
    };
    
    button.onclick = () => {
      // Pega a tratativa selecionada no momento do clique
      const selects = document.querySelectorAll('select');
      let tipoAlerta = '';
      
      selects.forEach(select => {
        // Pega o texto visível da opção selecionada
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.text && selectedOption.text.trim() !== 'Selecione uma Tratativa') {
          tipoAlerta = selectedOption.text.trim();
        }
      });
      
      console.log('Tipo de alerta detectado:', tipoAlerta);
      mostrarMenuTextos(textarea, tipoAlerta, button);
    };
    
    // Adiciona depois do textarea
    textarea.parentElement.appendChild(button);
    
    // Função para verificar e atualizar botões de bocejo
    const checkAndUpdateBocejoButtons = () => {
      const selects = document.querySelectorAll('select');
      let isBocejo = false;
      
      console.log('🔍 Verificando selects...', selects.length);
      
      selects.forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.text) {
          const text = selectedOption.text.trim().toLowerCase();
          console.log('📋 Opção selecionada:', text);
          
          if (text === 'bocejo' || text === 'bocejo delay') {
            console.log('✅ É Bocejo! Vai adicionar botões');
            isBocejo = true;
          }
        }
      });
      
      // Remove botões existentes
      const existingBtns = textarea.parentElement.querySelectorAll('.bocejo-quick-btn-container');
      existingBtns.forEach(btn => btn.remove());
      
      // Adiciona novamente se for bocejo
      if (isBocejo) {
        console.log('🎯 Adicionando botões 1x/2x...');
        addBocejoButtons(textarea, button);
      } else {
        console.log('❌ Não é bocejo, não vai adicionar botões');
      }
    };
    
    // Verifica inicialmente
    checkAndUpdateBocejoButtons();
    
    // Adiciona listener nos selects para detectar mudanças
    const allSelects = document.querySelectorAll('select');
    allSelects.forEach(select => {
      select.addEventListener('change', () => {
        setTimeout(checkAndUpdateBocejoButtons, 100);
      });
    });
    
    console.log('✓ Botão de texto padrão adicionado!');
  });
}

// Adiciona botões rápidos 1x e 2x para Bocejo
function addBocejoButtons(textarea, mainButton) {
  console.log('🚀 addBocejoButtons chamada');
  console.log('📍 textarea.parentElement:', textarea.parentElement);
  
  // Verifica se já existe
  if (textarea.parentElement.querySelector('.bocejo-quick-btn-container')) {
    console.log('⚠️ Container já existe, não vai adicionar');
    return;
  }
  
  console.log('✨ Criando container de botões...');
  
  const container = document.createElement('div');
  container.className = 'bocejo-quick-btn-container';
  container.style.cssText = `
    display: flex !important;
    gap: 10px;
    margin-top: 10px;
    width: 100%;
  `;
  
  // Botão 1x
  const btn1x = document.createElement('button');
  btn1x.className = 'bocejo-quick-btn';
  btn1x.type = 'button';
  btn1x.innerHTML = '1️⃣ 1x';
  btn1x.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    flex: 1;
    transition: all 0.3s;
  `;
  
  btn1x.onmouseover = () => {
    btn1x.style.transform = 'translateY(-2px)';
    btn1x.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.4)';
  };
  
  btn1x.onmouseout = () => {
    btn1x.style.transform = 'translateY(0)';
    btn1x.style.boxShadow = 'none';
  };
  
  btn1x.onclick = () => {
    textarea.value = 'Bocejo - Monitorado 1x';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    textarea.focus();
    
    // Feedback visual
    btn1x.innerHTML = '✅ Colado!';
    setTimeout(() => {
      btn1x.innerHTML = '1️⃣ 1x';
    }, 1500);
  };
  
  // Botão 2x
  const btn2x = document.createElement('button');
  btn2x.className = 'bocejo-quick-btn';
  btn2x.type = 'button';
  btn2x.innerHTML = '2️⃣ 2x';
  btn2x.style.cssText = `
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    flex: 1;
    transition: all 0.3s;
  `;
  
  btn2x.onmouseover = () => {
    btn2x.style.transform = 'translateY(-2px)';
    btn2x.style.boxShadow = '0 4px 8px rgba(245, 87, 108, 0.4)';
  };
  
  btn2x.onmouseout = () => {
    btn2x.style.transform = 'translateY(0)';
    btn2x.style.boxShadow = 'none';
  };
  
  btn2x.onclick = () => {
    textarea.value = 'Bocejo - Monitorado 2x';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    textarea.focus();
    
    // Feedback visual
    btn2x.innerHTML = '✅ Colado!';
    setTimeout(() => {
      btn2x.innerHTML = '2️⃣ 2x';
    }, 1500);
  };
  
  container.appendChild(btn1x);
  container.appendChild(btn2x);
  
  // Adiciona depois do botão principal
  if (mainButton.nextSibling) {
    mainButton.parentElement.insertBefore(container, mainButton.nextSibling);
  } else {
    mainButton.parentElement.appendChild(container);
  }
  
  console.log('✅ Botões 1x e 2x adicionados com sucesso!');
  console.log('📍 Container adicionado em:', container.parentElement);
}

// Mostra menu com opções de texto
function mostrarMenuTextos(textarea, tipoAlerta, button) {
  // Remove menu existente
  const menuExistente = document.querySelector('.menu-textos-padrao');
  if (menuExistente) {
    menuExistente.remove();
    return;
  }
  
  console.log('Buscando textos para:', tipoAlerta);
  const textos = getTextosPadrao(tipoAlerta);
  console.log('Textos encontrados:', textos.length);
  
  if (textos.length === 0) {
    alert(`Nenhum texto padrão cadastrado para: "${tipoAlerta}"\n\nVerifique se o nome da tratativa está correto.`);
    return;
  }
  
  // Cria o menu
  const menu = document.createElement('div');
  menu.className = 'menu-textos-padrao';
  menu.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    padding: 0;
    z-index: 99999;
    max-width: 650px;
    max-height: 85vh;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  `;
  
  // Cabeçalho
  const header = document.createElement('div');
  header.style.cssText = `
    background: rgba(255,255,255,0.95);
    padding: 20px 24px;
    border-radius: 16px 16px 0 0;
    border-bottom: 3px solid #667eea;
  `;
  
  const titulo = document.createElement('div');
  titulo.style.cssText = `
    font-weight: 700;
    font-size: 18px;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  titulo.innerHTML = `<span style="font-size: 24px;">📝</span> Textos para: <span style="color: #667eea;">${tipoAlerta}</span>`;
  header.appendChild(titulo);
  menu.appendChild(header);
  
  // Container de opções com scroll
  const container = document.createElement('div');
  container.style.cssText = `
    max-height: calc(85vh - 160px);
    overflow-y: auto;
    padding: 20px;
    background: rgba(255,255,255,0.98);
  `;
  
  // Estilo customizado da scrollbar
  const style = document.createElement('style');
  style.textContent = `
    .menu-textos-padrao::-webkit-scrollbar {
      width: 8px;
    }
    .menu-textos-padrao::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .menu-textos-padrao::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 10px;
    }
    .menu-textos-padrao::-webkit-scrollbar-thumb:hover {
      background: #764ba2;
    }
  `;
  document.head.appendChild(style);
  
  // Opções
  textos.forEach((texto, index) => {
    const opcao = document.createElement('button');
    opcao.type = 'button';
    opcao.className = 'opcao-texto-padrao';
    opcao.style.cssText = `
      display: block;
      width: 100%;
      text-align: left;
      padding: 16px 18px;
      margin: 10px 0;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      line-height: 1.6;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      color: #333;
    `;
    
    // Mostra preview do texto
    const preview = texto.length > 120 ? texto.substring(0, 120) + '...' : texto;
    opcao.innerHTML = `
      <div style="display: flex; align-items: start; gap: 12px;">
        <span class="numero-opcao" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: bold;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 8px;
          min-width: 28px;
          text-align: center;
          flex-shrink: 0;
        ">${index + 1}</span>
        <span class="texto-opcao" style="flex: 1; color: #444;">${preview}</span>
      </div>
    `;
    
    // Função para resetar todos os botões
    const resetarTodos = () => {
      const todasOpcoes = container.querySelectorAll('.opcao-texto-padrao');
      todasOpcoes.forEach(opt => {
        if (opt !== opcao) {
          opt.style.background = 'white';
          opt.style.borderColor = '#e0e0e0';
          opt.style.transform = 'translateY(0) scale(1)';
          opt.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          
          const numeroSpan = opt.querySelector('.numero-opcao');
          const textoSpan = opt.querySelector('.texto-opcao');
          if (numeroSpan) {
            numeroSpan.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            numeroSpan.style.color = 'white';
          }
          if (textoSpan) {
            textoSpan.style.color = '#444';
          }
        }
      });
    };
    
    opcao.addEventListener('mouseenter', () => {
      resetarTodos();
      opcao.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      opcao.style.borderColor = '#667eea';
      opcao.style.transform = 'translateY(-2px) scale(1.01)';
      opcao.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
      
      const numeroSpan = opcao.querySelector('.numero-opcao');
      const textoSpan = opcao.querySelector('.texto-opcao');
      if (numeroSpan) numeroSpan.style.color = 'white';
      if (textoSpan) textoSpan.style.color = 'white';
    });
    
    opcao.addEventListener('mouseleave', () => {
      opcao.style.background = 'white';
      opcao.style.borderColor = '#e0e0e0';
      opcao.style.transform = 'translateY(0) scale(1)';
      opcao.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      
      const numeroSpan = opcao.querySelector('.numero-opcao');
      const textoSpan = opcao.querySelector('.texto-opcao');
      if (numeroSpan) {
        numeroSpan.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        numeroSpan.style.color = 'white';
      }
      if (textoSpan) {
        textoSpan.style.color = '#444';
      }
    });
    
    opcao.onclick = () => {
      textarea.value = texto;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.focus();
      
      // Remove menu imediatamente
      menu.remove();
      
      // Feedback visual no botão
      button.innerHTML = '✅ Texto Colado!';
      button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      setTimeout(() => {
        button.innerHTML = '📝 Colar Texto Padrão';
        button.style.background = '#2196F3';
      }, 2500);
    };
    
    container.appendChild(opcao);
  });
  
  menu.appendChild(container);
  
  // Rodapé com botão fechar
  const footer = document.createElement('div');
  footer.style.cssText = `
    padding: 16px 20px;
    background: rgba(255,255,255,0.95);
    border-top: 2px solid #f0f0f0;
    border-radius: 0 0 16px 16px;
  `;
  
  const btnFechar = document.createElement('button');
  btnFechar.type = 'button';
  btnFechar.innerHTML = '✕ Fechar';
  btnFechar.style.cssText = `
    display: block;
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
  `;
  
  btnFechar.onmouseover = () => {
    btnFechar.style.transform = 'translateY(-2px)';
    btnFechar.style.boxShadow = '0 6px 20px rgba(245, 87, 108, 0.4)';
  };
  
  btnFechar.onmouseout = () => {
    btnFechar.style.transform = 'translateY(0)';
    btnFechar.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.3)';
  };
  
  btnFechar.onclick = () => menu.remove();
  footer.appendChild(btnFechar);
  menu.appendChild(footer);
  
  // Adiciona APENAS o menu (sem overlay escuro)
  document.body.appendChild(menu);
  
  // Fecha ao clicar fora
  setTimeout(() => {
    const clickOutside = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', clickOutside);
      }
    };
    document.addEventListener('click', clickOutside);
  }, 100);
}

// Observer para detectar quando a página de tratativa é aberta
const observerTratativa = new MutationObserver(() => {
  // Verifica se está na página de tratativa
  if (document.querySelector('textarea')) {
    setTimeout(() => {
      addTextoPadraoButton();
      autoSelecionarTratativa();
    }, 500);
  }
});

observerTratativa.observe(document.body, {
  childList: true,
  subtree: true
});

// ============================================================
// AUTO-SELEÇÃO DA TRATATIVA
// Lê o "Tipo de Alerta" que já aparece na tela de tratativa e
// seleciona automaticamente a Tratativa correspondente, evitando
// que o operador precise escolher duas vezes.
// ============================================================

// Tipos de alerta conhecidos (usado como reforço na detecção)
const TIPOS_ALERTA_CONHECIDOS = [
  'atenção', 'atencao', 'distração', 'distracao', 'ausência', 'ausencia', 'bocejo', 'bocejo delay',
  'câmera coberta', 'camera coberta', 'celular', 'cigarro', 'detecção de carona',
  'deteccao de carona', 'risco de colisão', 'risco de colisao', 'sem cinto',
  'sonolência n1', 'sonolencia n1', 'sonolência n2', 'sonolencia n2',
  'sonolência delay', 'alerta invalidado', 'gestos obscenos', 'rádio', 'radio'
];

// Acha um <select> a partir do texto de um <label> próximo
function acharSelectPorLabel(labelText) {
  const alvo = labelText.toLowerCase();
  const labels = document.querySelectorAll('label');

  for (const label of labels) {
    if (!label.textContent.toLowerCase().includes(alvo)) continue;

    // 1) select dentro do mesmo container (subindo até 3 níveis)
    let container = label.parentElement;
    for (let i = 0; i < 3 && container; i++) {
      const sel = container.querySelector('select');
      if (sel) return sel;
      container = container.parentElement;
    }

    // 2) select como irmão seguinte do label
    let el = label.nextElementSibling;
    while (el) {
      if (el.tagName === 'SELECT') return el;
      const inner = el.querySelector && el.querySelector('select');
      if (inner) return inner;
      el = el.nextElementSibling;
    }
  }
  return null;
}

// Mapeia o Tipo de Alerta para o TEXTO EXATO da Tratativa que deve ser selecionada.
// (nomes conforme aparecem no dropdown "Selecione uma Tratativa")
function getTratativaAlvo(tipoAlerta) {
  const t = tipoAlerta.toLowerCase();

  // Sonolência / Fadiga
  if (t.includes('n1')) return 'N1 - Orientar Parada 30 min';
  if (t.includes('n2')) return 'N2 - Orientar parada 60 min';

  // Atenção (inclui também "Distração")
  if (t.includes('atenç') || t.includes('atenc') || t.includes('distraç') || t.includes('distrac')) return 'Atenção';

  // Bocejo (o alerta "Bocejo" -> tratativa "Bocejo")
  if (t.includes('bocejo')) return 'Bocejo';

  // Ausência (falha/ajuste de equipamento)
  if (t.includes('ausência') || t.includes('ausencia')) {
    return 'Ausência - Solicitar ajuste - Gestão de Equipamentos CCI';
  }

  // Alerta invalidado
  if (t.includes('invalid')) return 'Invalidar - Teste - Manutenção';

  // Condutas (câmera coberta, celular, cigarro, gestos, sem cinto) -> Política de Consequência
  if (t.includes('câmera') || t.includes('camera') || t.includes('celular') ||
      t.includes('cigarro') || t.includes('gesto') || t.includes('obsceno') ||
      t.includes('cinto') || t.includes('fumo')) {
    return 'Conduta - Política de Consequência + Pontos no D-OLHO';
  }

  // Detecção de Carona, Risco de colisão, Rádio: sem mapeamento definido
  return null;
}

// Detecta o Tipo de Alerta exibido na tela de tratativa
// (funciona tanto com <select> nativo quanto com componente customizado)
function detectarTipoAlerta() {
  // 1) selects nativos cujo valor selecionado seja um tipo de alerta conhecido
  const selects = document.querySelectorAll('select');
  for (const s of selects) {
    if (s.selectedIndex < 0) continue;
    const txt = (s.options[s.selectedIndex].text || '').trim();
    if (txt && TIPOS_ALERTA_CONHECIDOS.includes(txt.toLowerCase())) return txt;
  }

  // 2) valor exibido perto do rótulo "Tipo de Alerta" (componente customizado)
  const rotulos = document.querySelectorAll('label, span, div, p');
  for (const rot of rotulos) {
    if (rot.children.length > 0) continue;
    if (rot.textContent.trim().toLowerCase() !== 'tipo de alerta') continue;

    let c = rot.parentElement;
    for (let i = 0; i < 4 && c; i++) {
      const cand = [...c.querySelectorAll('div, span, input, button, p')].find(e => {
        if (e.offsetParent === null) return false;
        const t = (e.tagName === 'INPUT'
          ? (e.value || e.placeholder)
          : (e.children.length === 0 ? e.textContent : '')).trim().toLowerCase();
        return TIPOS_ALERTA_CONHECIDOS.includes(t);
      });
      if (cand) {
        return (cand.tagName === 'INPUT' ? (cand.value || cand.placeholder) : cand.textContent).trim();
      }
      c = c.parentElement;
    }
  }

  return '';
}

// Dispara uma sequência de eventos que simula um clique real do usuário
function dispararClique(el) {
  const opts = { bubbles: true, cancelable: true, view: window };
  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(tipo => {
    try { el.dispatchEvent(new MouseEvent(tipo, opts)); } catch (e) {}
  });
}

// Preenche um input (campo de busca do dropdown) de forma compatível com Angular
function preencherInput(input, valor) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, valor);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

// Encontra o container PrimeNG (.ui-dropdown) da Tratativa que ainda está
// no placeholder ("Selecione uma Tratativa").
function acharDropdownTratativa() {
  const dropdowns = document.querySelectorAll('p-dropdown, .ui-dropdown');
  for (const d of dropdowns) {
    if (d.offsetParent === null) continue; // precisa estar visível
    const label = d.querySelector('.ui-dropdown-label');
    const txt = label ? label.textContent.trim() : '';
    if (txt === 'Selecione uma Tratativa') {
      // devolve o próprio .ui-dropdown (não o p-dropdown)
      return d.classList.contains('ui-dropdown') ? d : d.querySelector('.ui-dropdown') || d;
    }
  }
  return null;
}

// Procura o item do dropdown PrimeNG cujo texto é exatamente o alvo
function acharDropdownItem(alvoLower) {
  const items = document.querySelectorAll('.ui-dropdown-item, li[role="option"]');
  for (const it of items) {
    if (it.offsetParent === null) continue;
    if (it.textContent.trim().toLowerCase() === alvoLower) return it;
  }
  return null;
}

// Preenche o campo de filtro do PrimeNG e dispara os eventos que ele escuta
function preencherFiltroPrime(input, valor) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, valor);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

// Termo curto para filtrar (parte antes do primeiro " - ")
function termoFiltro(alvo) {
  return alvo.split(/\s[-–]\s/)[0].trim();
}

// Estado para não ficar reabrindo o dropdown repetidamente
const estadoAuto = { status: 'idle', alerta: null, container: null };
// status: idle | trabalhando | sucesso | falha

// Seleciona a tratativa SEM abrir o dropdown visualmente
function processarAutoTratativa(alvo, tipoAlerta, container) {
  // Tenta primeiro selecionar diretamente via Angular/PrimeNG
  const tentarSelecaoDireta = () => {
    // Procura o componente Angular
    const pDropdown = container.closest('p-dropdown');
    if (pDropdown && pDropdown.__ngContext__) {
      try {
        // Tenta acessar o componente Angular diretamente
        const component = pDropdown.__ngContext__[8];
        if (component && component.options) {
          const opcao = component.options.find(opt => 
            opt.label?.toLowerCase() === alvo.toLowerCase()
          );
          if (opcao) {
            component.writeValue(opcao.value);
            component.onChange.emit({ value: opcao.value });
            estadoAuto.status = 'sucesso';
            console.log(`✅ Tratativa auto-selecionada (direto): "${alvo}"`);
            return true;
          }
        }
      } catch (e) {
        console.log('⚠️ Seleção direta falhou, usando método alternativo');
      }
    }
    return false;
  };

  // Se seleção direta funcionar, não precisa abrir o dropdown
  if (tentarSelecaoDireta()) {
    return;
  }

  // Fallback: abre o dropdown mas esconde visualmente
  const gatilho = container.querySelector('.ui-dropdown-label')
               || container.querySelector('.ui-dropdown-trigger')
               || container;
  
  // ESCONDE o dropdown antes de abrir
  const originalDisplay = container.style.display;
  const originalVisibility = container.style.visibility;
  const originalOpacity = container.style.opacity;
  
  container.style.visibility = 'hidden';
  container.style.opacity = '0';
  
  dispararClique(gatilho); // abre o dropdown (invisível)

  const alvoLower = alvo.toLowerCase();
  const termo = termoFiltro(alvo);
  let tentativas = 0;
  const MAX = 20;
  let filtrou = false;

  const tick = () => {
    tentativas++;

    // Esconde também o painel do dropdown
    const panel = document.querySelector('.ui-dropdown-panel');
    if (panel) {
      panel.style.visibility = 'hidden';
      panel.style.opacity = '0';
    }

    // A partir da 2ª tentativa, usa o campo de busca para filtrar
    if (!filtrou && tentativas >= 2) {
      const filtro = document.querySelector('.ui-dropdown-filter');
      if (filtro) {
        preencherFiltroPrime(filtro, termo);
        filtrou = true;
      }
    }

    const item = acharDropdownItem(alvoLower);
    if (item) {
      dispararClique(item);
      
      // Restaura visibilidade após selecionar
      setTimeout(() => {
        container.style.display = originalDisplay;
        container.style.visibility = originalVisibility;
        container.style.opacity = originalOpacity;
        
        const panel = document.querySelector('.ui-dropdown-panel');
        if (panel) panel.remove();
      }, 100);
      
      estadoAuto.status = 'sucesso';
      console.log(`✅ Tratativa auto-selecionada: "${alvo}" (alerta: "${tipoAlerta}")`);
      return;
    }

    if (tentativas < MAX) {
      setTimeout(tick, 150);
    } else {
      // Restaura visibilidade mesmo se falhar
      container.style.display = originalDisplay;
      container.style.visibility = originalVisibility;
      container.style.opacity = originalOpacity;
      
      estadoAuto.status = 'falha';
      console.log(`⚠️ Não consegui achar a opção de tratativa "${alvo}" para o alerta "${tipoAlerta}".`);
    }
  };

  setTimeout(tick, 150);
}

// Lógica principal de auto-seleção
function autoSelecionarTratativa() {
  const container = acharDropdownTratativa();

  // Sem o campo "Selecione uma Tratativa" visível: ou não estamos na tela,
  // ou a tratativa já foi selecionada. Nada a fazer.
  if (!container) return;

  if (estadoAuto.status === 'trabalhando') return;

  const tipoAlerta = detectarTipoAlerta();
  if (!tipoAlerta) return;

  // Se já resolvemos (ou desistimos) para este mesmo dropdown e mesmo alerta, não repete.
  // Se o dropdown for outro (novo alerta) ou o tipo mudar, reprocessa.
  if (estadoAuto.container === container && estadoAuto.alerta === tipoAlerta &&
      (estadoAuto.status === 'sucesso' || estadoAuto.status === 'falha')) {
    return;
  }

  const alvo = getTratativaAlvo(tipoAlerta);
  estadoAuto.alerta = tipoAlerta;
  estadoAuto.container = container;

  if (!alvo) {
    estadoAuto.status = 'falha';
    console.log('ℹ️ Sem tratativa mapeada para o alerta:', tipoAlerta);
    return;
  }

  // Marca como trabalhando SEM mostrar nada visualmente - só processa em background
  estadoAuto.status = 'trabalhando';
  processarAutoTratativa(alvo, tipoAlerta, container);
}

// As opções da tratativa podem carregar de forma assíncrona,
// então verificamos periodicamente (de forma leve).
setInterval(autoSelecionarTratativa, 800);

// Variável global para guardar a tratativa selecionada
let tratativaSelecionadaGlobal = '';

// Monitora mudanças na tratativa e salva globalmente
const monitorarTratativa = () => {
  const dropdowns = document.querySelectorAll('.ui-dropdown-label');
  if (dropdowns.length >= 3) {
    // Pega o ÚLTIMO dropdown (sempre é a tratativa)
    const ultimoDropdown = dropdowns[dropdowns.length - 1];
    const novaTratativa = ultimoDropdown.textContent.trim();
    
    // Só salva se for uma tratativa válida (não "Selecione uma Tratativa")
    if (novaTratativa && 
        !novaTratativa.toLowerCase().includes('selecione') && 
        novaTratativa.length > 15 && // Tratativas são longas
        novaTratativa !== tratativaSelecionadaGlobal) {
      tratativaSelecionadaGlobal = novaTratativa;
      console.log('💾 Tratativa salva globalmente:', tratativaSelecionadaGlobal);
    }
  }
};

// Verifica a cada 500ms
setInterval(monitorarTratativa, 500);

// Grupos de emails por cliente
const GRUPOS_EMAILS = {
  'Alto Taquari': [
    'vaniaaparecida@expressonepomuceno.com.br',
    'wiltonoliveira@expressonepomuceno.com.br',
    'cristianofedrigo@expressonepomuceno.com.br',
    'paulohenrique@expressonepomuceno.com.br',
    'log.sucro.taquari@expressonepomucenobr.onmicrosoft.com',
    'givaldoreis@expressonepomuceno.com.br',
    'julionascimento@expressonepomuceno.com.br',
    'luanasilva@expressonepomuceno.com.br',
    'paulianesilva@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br'
  ],
  'Aracruz': [
    'andrebrito@expressonepomuceno.com.br',
    'carinasouza@expressonepomuceno.com.br',
    'antoniomezarde@expressonepomuceno.com.br',
    'cpmaracruz@expressonepomuceno.com.br',
    'gestaofadigaaracruz@expressonepomuceno.com.br',
    'joaopaulo@expressonepomuceno.com.br',
    'wesleygregorio@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'kaironcoelho@expressonepomuceno.com.br',
    'danieldelcarro@expressonepomuceno.com.br',
    'mamedesjunior@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br'
  ],
  'Bracell': [
    'joaopaulo@expressonepomuceno.com.br',
    'pauloroberto@expressonepomuceno.com.br',
    'gridbracell@expressonepomuceno.com.br',
    'lorranisouza@expressonepomuceno.com.br',
    'evertonhenrique@expressonepomuceno.com.br',
    'matheuscezarini@expressonepomuceno.com.br',
    'vitormacedo@expressonepomuceno.com.br',
    'joassilva@expressonepomuceno.com.br',
    'fabianomoreira@expressonepomuceno.com.br',
    'pedrobispo@expressonepomuceno.com.br',
    'odairjose@expressonepomuceno.com.br',
    'brunosilveira@expressonepomuceno.com.br',
    'layralelis@expressonepomuceno.com.br',
    'laionoliveira@expressonepomuceno.com.br',
    'suellencavalca@expressonepomuceno.com.br'
  ],
  'CMOC - Catalão': [
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'kellyfernandes@expressonepomuceno.com.br',
    'uirlanlima@expressonepomuceno.com.br',
    'nataliamainardi@expressonepomuceno.com.br'
  ],
  'Rodoviário': [
    'gustavobarbosa@expressonepomuceno.com.br',
    'rogeriosilva@expressonepomuceno.com.br',
    'camillaabijaude@expressonepomuceno.com.br',
    'luanacorrea@expressonepomuceno.com.br',
    'bernardo@expressonepomuceno.com.br',
    'rilenovalentim@expressonepomuceno.com.br',
    'giovaneguimaraes@expressonepomuceno.com.br',
    'liviasouza@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br',
    'luciojunior@expressonepomuceno.com.br'
  ],
  'Cenibra': [
    'alberonerodrigues@expressonepomuceno.com.br',
    'anaclaudia@expressonepomuceno.com.br',
    'joaopaulo@expressonepomuceno.com.br',
    'kaironcoelho@expressonepomuceno.com.br',
    'rafaelcosta@expressonepomuceno.com.br',
    'anamagalhaes@expressonepomuceno.com.br',
    'leilapereira@expressonepomuceno.com.br',
    'wesleyamorim@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'luizbarboza@expressonepomuceno.com.br',
    'grazielamelo@expressonepomuceno.com.br',
    'catianecosta@expressonepomuceno.com.br',
    'moisestomaz@expressonepomuceno.com.br',
    'deborasouza@expressonepomuceno.com.br',
    'feliperibeiro@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br',
    'thaisassis@expressonepomuceno.com.br'
  ],
  'Cerrado': [
    'wellingtonguzzi@expressonepomuceno.com.br',
    'controlecpg2@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'luizbarboza@expressonepomuceno.com.br',
    'grazielamelo@expressonepomuceno.com.br',
    'controlecpg1@expressonepomuceno.com.br',
    'matheusrezende@expressonepomuceno.com.br',
    'wellersoncarvalho@expressonepomuceno.com.br',
    'guilhermeferracini@expressonepomuceno.com.br',
    'marcelosouza@expressonepomuceno.com.br',
    'fabiozacariaz@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br'
  ],
  'Costa Rica': [
    'cesareler@expressonepomuceno.com.br',
    'pauloroberto@expressonepomuceno.com.br',
    'ccocostarica@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'luizbarboza@expressonepomuceno.com.br',
    'grazielamelo@expressonepomuceno.com.br',
    'marcioluiz@expressonepomuceno.com.br',
    'julianacabral@expressonepomuceno.com.br',
    'ccojornadacostarica@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br',
    'guilhermeferracini@expressonepomuceno.com.br',
    'ligiasilva@expressonepomuceno.com.br',
    'andersonsilva@expressonepomuceno.com.br',
    'paulohenrique@expressonepomuceno.com.br',
    'julionascimento@expressonepomuceno.com.br'
  ],
  'Distribuição': [
    'wesllenbarros@expressonepomuceno.com.br',
    'weslleyvilela@expressonepomuceno.com.br',
    'joaoribeiro@expressonepomuceno.com.br',
    'silveriojunior@expressonepomuceno.com.br',
    'rilenovalentim@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br'
  ],
  'Jataí': [
    'trafegojatai@expressonepomuceno.com.br',
    'karolineperes@expressonepomuceno.com.br',
    'odairjose@expressonepomuceno.com.br',
    'andersonsilva@expressonepomuceno.com.br',
    'murillolemes@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'luizbarboza@expressonepomuceno.com.br',
    'grazielamelo@expressonepomuceno.com.br',
    'saulorezende@expressonepomuceno.com.br',
    'pedromartins@expressonepomuceno.com.br',
    'cassiofarias@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br'
  ],
  'MMI': [
    'anaavelino@expressonepomuceno.com.br',
    'bernardo@expressonepomuceno.com.br',
    'thamiresmendes@expressonepomuceno.com.br',
    'rilenovalentim@expressonepomuceno.com.br',
    'andrerezende@expressonepomuceno.com.br',
    'ccommi@expressonepomuceno.com.br',
    'fadiga@expressonepomuceno.com.br',
    'luizbarboza@expressonepomuceno.com.br',
    'grazielamelo@expressonepomuceno.com.br',
    'lorranisouza@expressonepomuceno.com.br',
    'giselecordeiro@expressonepomuceno.com.br',
    'keniacristina@expressonepomuceno.com.br',
    'douglassantos@expressonepomuceno.com.br',
    'brunorichard@expressonepomuceno.com.br'
  ]
};

// Observer para detectar modal de email
const observerEmail = new MutationObserver(() => {
  // Se o painel já existe, verifica se o modal ainda está aberto
  const painelExistente = document.querySelector('.grupos-emails-panel');
  
  // Procura pelo input de email do modal (placeholder tipo "ex@gmail.com")
  const emailInput = Array.from(document.querySelectorAll('input')).find(input => {
    const ph = (input.placeholder || '').toLowerCase();
    return ph.includes('gmail.com') || ph.includes('ex@');
  });
  
  // Se o modal fechou, remove o painel
  if (!emailInput || emailInput.offsetParent === null) {
    if (painelExistente) painelExistente.remove();
    return;
  }
  
  // Se o modal está aberto e não tem painel, cria
  if (emailInput && !painelExistente) {
    console.log('✓ Modal de email detectado!');
    addGruposEmailButtons(emailInput);
  }
});

observerEmail.observe(document.body, {
  childList: true,
  subtree: true
});

// Verificação periódica como reforço - detecta o modal mais rápido e de forma confiável
setInterval(() => {
  const painelExistente = document.querySelector('.grupos-emails-panel');
  const emailInput = Array.from(document.querySelectorAll('input')).find(input => {
    const ph = (input.placeholder || '').toLowerCase();
    return ph.includes('gmail.com') || ph.includes('ex@');
  });
  
  if ((!emailInput || emailInput.offsetParent === null) && painelExistente) {
    painelExistente.remove();
  } else if (emailInput && emailInput.offsetParent !== null && !painelExistente) {
    console.log('✓ Modal de email detectado (polling)!');
    addGruposEmailButtons(emailInput);
  }
}, 250);

// Função para colar emails no input de forma compatível com Angular
function colarEmailsNoInput(emailInput, emailsStr) {
  // Usa o setter nativo do input - forma correta para Angular/React detectarem
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeSetter.call(emailInput, emailsStr);
  
  // Dispara os eventos que o Angular escuta
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  emailInput.dispatchEvent(new Event('change', { bubbles: true }));
  emailInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  emailInput.dispatchEvent(new Event('blur', { bubbles: true }));
  
  console.log('✅ Input atualizado:', emailInput.value);
}

// Detecta se deve adicionar o email gte@ automaticamente baseado no texto de observações
// Adiciona painel flutuante com botões de grupos de emails
function addGruposEmailButtons(emailInput) {
  // Evita duplicar
  if (document.querySelector('.grupos-emails-panel')) {
    return;
  }
  
  console.log('✓ Criando painel de grupos de emails...');
  
  // Painel flutuante - fixed, anexado ao body (não interfere no layout do Angular)
  const panel = document.createElement('div');
  panel.className = 'grupos-emails-panel';
  panel.style.cssText = `
    position: fixed;
    z-index: 2147483647;
    background: #1e1e2e;
    border: 2px solid #667eea;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    padding: 14px;
    width: 240px;
    max-height: 80vh;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  // Título
  const titulo = document.createElement('div');
  titulo.style.cssText = `
    font-weight: 700;
    font-size: 13px;
    color: #fff;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  `;
  titulo.innerHTML = '📧 Colar emails por grupo';
  panel.appendChild(titulo);
  
  // Cores gradientes para os botões
  const gradientes = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #ee5a6f 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #f5576c 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #4facfe 100%)',
    'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
    'linear-gradient(135deg, #764ba2 0%, #4facfe 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)'
  ];
  
  let colorIndex = 0;
  
  Object.keys(GRUPOS_EMAILS).sort().forEach(grupo => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = grupo;
    btn.style.cssText = `
      display: block;
      width: 100%;
      padding: 9px 12px;
      margin-bottom: 6px;
      background: ${gradientes[colorIndex % gradientes.length]};
      color: white;
      border: none;
      border-radius: 7px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    `;
    
    colorIndex++;
    
    btn.onmouseover = () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    };
    
    btn.onmouseout = () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
    };
    
    // Usa mousedown em vez de click para não perder o foco do input de forma problemática
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🔘 Botão clicado:', grupo);
      
      // Pega os emails do grupo
      let emails = [...GRUPOS_EMAILS[grupo]];
      
      // Usa a tratativa salva globalmente
      let tratativaSelecionada = tratativaSelecionadaGlobal;
      let tratativaVioDasObservacoes = false;
      
      console.log('📋 Tratativa selecionada (da variável global):', tratativaSelecionada);
      
      // Se não tiver tratativa (página de revisão), tenta ler das Observações
      if (!tratativaSelecionada || tratativaSelecionada.length < 10) {
        console.log('⚠️ Tratativa não encontrada na variável global, tentando ler das Observações...');
        
        // Procura o parágrafo <p> dentro de div.col-md-3 que contém "Observações"
        const divs = document.querySelectorAll('.col-md-3');
        for (const div of divs) {
          const label = div.querySelector('label');
          if (label && label.textContent.toLowerCase().includes('observa')) {
            const p = div.querySelector('p');
            if (p && p.textContent.trim().length > 10) {
              tratativaSelecionada = p.textContent.trim();
              tratativaVioDasObservacoes = true;
              console.log('✅ Tratativa encontrada nas Observações:', tratativaSelecionada);
              break;
            }
          }
        }
      }
      
      // Se a tratativa for "Ausência - Solicitar ajuste - Gestão de Equipamentos CCI", adiciona os emails
      const emailsGTE = ['luizbarboza@expressonepomuceno.com.br', 'grazielamelo@expressonepomuceno.com.br'];
      
      let isAusenciaEquipamentos = false;
      
      // Se veio das Observações, verifica apenas "Ausência"
      if (tratativaVioDasObservacoes) {
        // Nas Observações, verifica se o tipo de alerta foi "Ausência" (procura em outra parte da página)
        const allLabels = document.querySelectorAll('label');
        for (const label of allLabels) {
          if (label.textContent.trim() === 'Tipo de Alerta:') {
            const parent = label.parentElement;
            const p = parent?.querySelector('p');
            if (p && p.textContent.toLowerCase().includes('ausência')) {
              isAusenciaEquipamentos = true;
              console.log('🎯 Tipo de Alerta "Ausência" detectado na página de revisão!');
              break;
            }
          }
        }
      } else {
        // Se veio do select, verifica os 3 termos
        isAusenciaEquipamentos = tratativaSelecionada.includes('Ausência') && 
                                  tratativaSelecionada.includes('Solicitar ajuste') &&
                                  tratativaSelecionada.includes('Gestão de Equipamentos');
      }
      
      if (isAusenciaEquipamentos) {
        emailsGTE.forEach(email => {
          if (!emails.includes(email)) {
            emails.push(email);
          }
        });
        console.log('🎯 Tratativa "Ausência - Gestão de Equipamentos" detectada! Adicionando emails GTE automaticamente...');
      }
      
      const emailsStr = emails.join('; ');
      colarEmailsNoInput(emailInput, emailsStr);
      
      // Feedback visual
      const originalText = btn.textContent;
      const originalBg = btn.style.background;
      btn.textContent = '✅ Colado!';
      btn.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = originalBg;
      }, 1500);
    });
    
    panel.appendChild(btn);
  });
  
  document.body.appendChild(panel);
  
  // Posiciona o painel ao lado do input (ou abaixo se não couber)
  const reposicionar = () => {
    if (!emailInput.offsetParent) return;
    const rect = emailInput.getBoundingClientRect();
    const panelWidth = 240;
    const espacoDireita = window.innerWidth - rect.right;
    
    let left;
    if (espacoDireita > panelWidth + 20) {
      // Cabe à direita do modal
      left = rect.right + 15;
    } else if (rect.left > panelWidth + 20) {
      // Coloca à esquerda
      left = rect.left - panelWidth - 15;
    } else {
      // Alinha abaixo do input
      left = rect.left;
    }
    
    panel.style.left = left + 'px';
    // Sobe o painel para alinhar com o topo do modal (título "Envio de PDF por Email")
    panel.style.top = Math.max(10, rect.top - 110) + 'px';
  };
  
  reposicionar();
  
  // Reposiciona em scroll/resize
  window.addEventListener('scroll', reposicionar, true);
  window.addEventListener('resize', reposicionar);
  
  console.log('✅ Painel de grupos de emails criado!');
}

// ============================================================
// AUTO-FINALIZAÇÃO DE ALERTAS
// Quando ativado, detecta o popup de confirmação "Você tem certeza
// que deseja finalizar o(s) alerta(s)?" e:
// 1. OCULTA o popup imediatamente (operador não vê nada)
// 2. Clica automaticamente no botão "FINALIZAR"
// 3. Remove overlays/backdrops do modal
// Resultado: O operador só clica em "Finalizar" e o alerta é
// finalizado instantaneamente, sem popup de confirmação.
//
// ⚠️ IMPORTANTE: NÃO bloqueia os seguintes popups:
// - Popup de confirmação de MOTORISTA
// - Popup de confirmação de INVALIDAR alerta
// Esses popups continuam aparecendo normalmente para o usuário.
// ============================================================

// Estado da funcionalidade (carregado do localStorage)
let autoFinalizeEnabled = false;
let alwaysOnlineEnabled = false;
let autoSortEnabled = false;

// Carrega estado salvo
function loadAutoFinalizeState() {
  try {
    const saved = localStorage.getItem('auto_finalize_alerts_enabled');
    autoFinalizeEnabled = saved ? JSON.parse(saved) : false;
    console.log('Auto-Finalize: Estado carregado:', autoFinalizeEnabled);
  } catch (error) {
    console.warn('Auto-Finalize: Erro ao carregar estado do localStorage', error);
    autoFinalizeEnabled = false;
  }
}

// Salva estado
function saveAutoFinalizeState(enabled) {
  try {
    localStorage.setItem('auto_finalize_alerts_enabled', JSON.stringify(enabled));
    console.log('Auto-Finalize: Estado salvo:', enabled);
    return true;
  } catch (error) {
    console.warn('Auto-Finalize: Erro ao salvar estado no localStorage', error);
    return false;
  }
}

// Carrega estado do Sempre Online
function loadAlwaysOnlineState() {
  try {
    const saved = localStorage.getItem('always_online_enabled');
    alwaysOnlineEnabled = saved ? JSON.parse(saved) : false;
    console.log('Always-Online: Estado carregado:', alwaysOnlineEnabled);
  } catch (error) {
    console.warn('Always-Online: Erro ao carregar estado do localStorage', error);
    alwaysOnlineEnabled = false;
  }
}

// Salva estado do Sempre Online
function saveAlwaysOnlineState(enabled) {
  try {
    localStorage.setItem('always_online_enabled', JSON.stringify(enabled));
    console.log('Always-Online: Estado salvo:', enabled);
    return true;
  } catch (error) {
    console.warn('Always-Online: Erro ao salvar estado no localStorage', error);
    return false;
  }
}

// Carrega estado da Ordenação Automática
function loadAutoSortState() {
  try {
    const saved = localStorage.getItem('auto_sort_disponivel_enabled');
    autoSortEnabled = saved ? JSON.parse(saved) : false;
    console.log('Auto-Sort: Estado carregado:', autoSortEnabled);
  } catch (error) {
    console.warn('Auto-Sort: Erro ao carregar estado do localStorage', error);
    autoSortEnabled = false;
  }
}

// Salva estado da Ordenação Automática
function saveAutoSortState(enabled) {
  try {
    localStorage.setItem('auto_sort_disponivel_enabled', JSON.stringify(enabled));
    console.log('Auto-Sort: Estado salvo:', enabled);
    return true;
  } catch (error) {
    console.warn('Auto-Sort: Erro ao salvar estado no localStorage', error);
    return false;
  }
}

// Cria e adiciona o toggle no menu lateral
function addAutoFinalizeToggle() {
  // Evita duplicar
  if (document.querySelector('.auto-finalize-toggle') || document.querySelector('.auto-finalize-nb-action')) {
    return;
  }
  
  // Verifica se está na página do menu/dashboard de várias formas
  const url = window.location.href;
  const hasAlertCards = document.body.textContent.includes('ALTO RISCO') || 
                        document.body.textContent.includes('MÉDIO RISCO') ||
                        document.body.textContent.includes('Últimos Alertas');
  
  const isMenuPage = url.includes('/ui/alarms') || url.includes('/fatigue') || hasAlertCards;
  
  if (!isMenuPage) {
    console.log('Auto-Finalize: Não está na tela do menu (URL:', url, ')');
    return;
  }
  
  console.log('Auto-Finalize: Procurando "Eventos"...');
  
  // Procura pelo elemento "Eventos" (nb-action)
  const eventos = Array.from(document.querySelectorAll('nb-action, *')).find(el => {
    const text = el.textContent?.trim() || '';
    return text.match(/^Eventos\s*\d*$/i) && el.offsetParent !== null && el.children.length < 5;
  });
  
  let targetContainer = null;
  
  if (eventos && eventos.parentElement) {
    targetContainer = eventos.parentElement;
    console.log('Auto-Finalize: Container "nb-actions" encontrado!', targetContainer);
  } else {
    console.log('Auto-Finalize: "Eventos" não encontrado');
  }
  
  if (!targetContainer) {
    console.log('Auto-Finalize: Não vai adicionar toggle (só adiciona se encontrar o container)');
    return; // NÃO adiciona se não encontrar o container
  }
  
  // ===== BOTÃO DE CONFIGURAÇÕES =====
  const configButton = document.createElement('button');
  configButton.className = 'creare-config-button';
  configButton.type = 'button';
  configButton.innerHTML = `
    <span style="font-size: 16px;">⚙️</span>
    <span style="font-size: 13px; font-weight: 500;">Configurações</span>
  `;
  configButton.style.cssText = `
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    padding: 8px 14px !important;
    margin: 0 !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
    vertical-align: middle !important;
    height: 100% !important;
  `;
  
  configButton.onmouseover = () => {
    configButton.style.transform = 'translateY(-2px)';
    configButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
  };
  
  configButton.onmouseout = () => {
    configButton.style.transform = 'translateY(0)';
    configButton.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
  };
  
  configButton.onclick = () => {
    createConfigPanel();
  };
  
  const nbActionConfig = document.createElement('nb-action');
  nbActionConfig.className = 'creare-config-nb-action';
  nbActionConfig.appendChild(configButton);
  targetContainer.appendChild(nbActionConfig);
  
  console.log('✅ Botão de Configurações adicionado ao header!');
}

// Cria o painel de configurações com todos os toggles
function createConfigPanel() {
  // Remove painel existente se houver
  const existing = document.querySelector('.creare-config-panel');
  if (existing) {
    existing.remove();
    return;
  }
  
  // Overlay escuro de fundo
  const overlay = document.createElement('div');
  overlay.className = 'creare-config-overlay';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0, 0, 0, 0.6) !important;
    z-index: 999998 !important;
    backdrop-filter: blur(4px) !important;
    opacity: 0 !important;
    transition: opacity 0.3s ease !important;
  `;
  
  // Painel de configurações
  const panel = document.createElement('div');
  panel.className = 'creare-config-panel';
  panel.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) scale(0.9) !important;
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%) !important;
    border: 2px solid #667eea !important;
    border-radius: 16px !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
    padding: 0 !important;
    z-index: 999999 !important;
    width: 480px !important;
    max-width: 90vw !important;
    max-height: 85vh !important;
    overflow: hidden !important;
    opacity: 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  `;
  
  // Header do painel
  const header = document.createElement('div');
  header.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    padding: 20px 24px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  `;
  
  const headerTitle = document.createElement('div');
  headerTitle.style.cssText = `
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
  `;
  headerTitle.innerHTML = `
    <span style="font-size: 24px;">⚙️</span>
    <div>
      <div style="font-size: 18px; font-weight: 700; color: white;">Configurações</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 2px;">Extensão Creare</div>
    </div>
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    background: rgba(255,255,255,0.2) !important;
    border: none !important;
    color: white !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 8px !important;
    font-size: 18px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  `;
  closeBtn.onmouseover = () => {
    closeBtn.style.background = 'rgba(255,255,255,0.3)';
    closeBtn.style.transform = 'scale(1.1)';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.background = 'rgba(255,255,255,0.2)';
    closeBtn.style.transform = 'scale(1)';
  };
  closeBtn.onclick = () => {
    panel.style.opacity = '0';
    panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
    overlay.style.opacity = '0';
    setTimeout(() => {
      panel.remove();
      overlay.remove();
    }, 300);
  };
  
  headerTitle.appendChild(closeBtn);
  header.appendChild(headerTitle);
  panel.appendChild(header);
  
  // Corpo do painel com os toggles
  const body = document.createElement('div');
  body.style.cssText = `
    padding: 24px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
  `;
  
  // Função para criar um toggle no painel
  const createPanelToggle = (id, label, description, state, callback) => {
    const container = document.createElement('div');
    container.style.cssText = `
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 12px !important;
      padding: 16px !important;
      transition: all 0.2s ease !important;
    `;
    
    const topRow = document.createElement('div');
    topRow.style.cssText = `
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      margin-bottom: 8px !important;
    `;
    
    const labelEl = document.createElement('div');
    labelEl.style.cssText = `
      font-size: 15px !important;
      font-weight: 600 !important;
      color: white !important;
    `;
    labelEl.textContent = label;
    
    // Switch
    const switchContainer = document.createElement('label');
    switchContainer.style.cssText = `
      position: relative !important;
      display: inline-block !important;
      width: 48px !important;
      height: 26px !important;
      cursor: pointer !important;
    `;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state;
    checkbox.style.cssText = 'display: none !important;';
    
    const slider = document.createElement('span');
    slider.style.cssText = `
      position: absolute !important;
      cursor: pointer !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: ${state ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : '#555'} !important;
      transition: 0.3s !important;
      border-radius: 13px !important;
    `;
    
    const sliderBall = document.createElement('span');
    sliderBall.style.cssText = `
      position: absolute !important;
      content: "" !important;
      height: 20px !important;
      width: 20px !important;
      left: ${state ? '25px' : '3px'} !important;
      bottom: 3px !important;
      background-color: white !important;
      transition: 0.3s !important;
      border-radius: 50% !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
    `;
    
    slider.appendChild(sliderBall);
    switchContainer.appendChild(checkbox);
    switchContainer.appendChild(slider);
    
    checkbox.onchange = () => {
      const isChecked = checkbox.checked;
      slider.style.background = isChecked ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : '#555';
      sliderBall.style.left = isChecked ? '25px' : '3px';
      callback(isChecked);
    };
    
    topRow.appendChild(labelEl);
    topRow.appendChild(switchContainer);
    
    const desc = document.createElement('div');
    desc.style.cssText = `
      font-size: 13px !important;
      color: rgba(255,255,255,0.7) !important;
      line-height: 1.5 !important;
    `;
    desc.textContent = description;
    
    container.appendChild(topRow);
    container.appendChild(desc);
    
    container.onmouseenter = () => {
      container.style.background = 'rgba(255,255,255,0.08)';
      container.style.borderColor = 'rgba(255,255,255,0.2)';
    };
    
    container.onmouseleave = () => {
      container.style.background = 'rgba(255,255,255,0.05)';
      container.style.borderColor = 'rgba(255,255,255,0.1)';
    };
    
    return container;
  };
  
  // Toggle 1: Auto-finalizar
  body.appendChild(createPanelToggle(
    'auto-finalize',
    '🔴 Auto-finalizar',
    'Remove o popup "Tem certeza?" ao finalizar alertas. Você ainda precisa clicar em Finalizar, mas a confirmação é automática.',
    autoFinalizeEnabled,
    (enabled) => {
      autoFinalizeEnabled = enabled;
      saveAutoFinalizeState(enabled);
    }
  ));
  
  // Toggle 2: Sempre Online
  body.appendChild(createPanelToggle(
    'always-online',
    '🟢 Sempre Online',
    'Mantém o status sempre como "Online" automaticamente, sem precisar ativar manualmente toda vez.',
    alwaysOnlineEnabled,
    (enabled) => {
      alwaysOnlineEnabled = enabled;
      saveAlwaysOnlineState(enabled);
      if (enabled) {
        console.log('Always-Online: Ativado! Tentando mudar status para Online...');
        setStatusToOnline();
      }
    }
  ));
  
  // Toggle 3: Ordenar Alertas
  body.appendChild(createPanelToggle(
    'auto-sort',
    '🟡 Ordenar Alertas',
    'Ordena automaticamente os alertas do mais antigo para o mais recente (coluna "Disponível em").',
    autoSortEnabled,
    (enabled) => {
      autoSortEnabled = enabled;
      saveAutoSortState(enabled);
      if (enabled) {
        console.log('Auto-Sort: Ativado! Tentando ordenar alertas...');
        colunaJaProcessada = false;
        disponivelEmExpandido = false;
        expandirDisponivelEm();
      }
    }
  ));
  
  panel.appendChild(body);
  
  // Footer com assinatura
  const footer = document.createElement('div');
  footer.style.cssText = `
    background: rgba(0,0,0,0.2) !important;
    padding: 16px 24px !important;
    border-top: 1px solid rgba(255,255,255,0.1) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
  `;
  footer.innerHTML = `
    <span style="font-size: 14px;">⚡</span>
    <span style="font-size: 13px; color: rgba(255,255,255,0.7);">Criado por <strong style="color: white;">Douglas G.</strong></span>
  `;
  
  panel.appendChild(footer);
  
  // Adiciona ao DOM
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  
  // Animação de entrada
  setTimeout(() => {
    overlay.style.opacity = '1';
    panel.style.opacity = '1';
    panel.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
  
  // Fecha ao clicar no overlay
  overlay.onclick = () => {
    closeBtn.click();
  };
}

// Função genérica para criar um toggle
function createToggle(id, initialState, labelText, tooltipText, onChangeCallback) {
  let isEnabled = initialState;
  
  // Cria o container do toggle - SEMPRE integrado (sem posição fixa)
  const toggleContainer = document.createElement('div');
  toggleContainer.className = `${id}-toggle`;
  toggleContainer.style.cssText = `
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 8px 12px !important;
    margin: 0 !important;
    cursor: pointer !important;
    border-radius: 6px !important;
    transition: all 0.2s ease !important;
    user-select: none !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    vertical-align: middle !important;
    height: 100% !important;
  `;
  
  // Switch visual - menor e mais discreto
  const switchEl = document.createElement('div');
  switchEl.className = `${id}-switch`;
  switchEl.style.cssText = `
    position: relative !important;
    width: 36px !important;
    height: 20px !important;
    border-radius: 10px !important;
    transition: background 0.2s ease !important;
    flex-shrink: 0 !important;
  `;
  
  // Bolinha do switch
  const switchBall = document.createElement('div');
  switchBall.style.cssText = `
    position: absolute !important;
    top: 2px !important;
    width: 16px !important;
    height: 16px !important;
    background: white !important;
    border-radius: 50% !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
  `;
  switchEl.appendChild(switchBall);
  
  // Texto
  const label = document.createElement('span');
  label.style.cssText = `
    font-size: 13px !important;
    font-weight: 500 !important;
    white-space: nowrap !important;
  `;
  
  toggleContainer.appendChild(switchEl);
  toggleContainer.appendChild(label);
  
  // ===== TOOLTIP CUSTOMIZADO BONITO =====
  const tooltip = document.createElement('div');
  tooltip.className = `${id}-tooltip-custom`;
  tooltip.style.cssText = `
    position: fixed !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
    max-width: 280px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) !important;
    z-index: 999999 !important;
    pointer-events: none !important;
    opacity: 0 !important;
    transform: translateY(-5px) !important;
    transition: opacity 0.3s ease, transform 0.3s ease !important;
    font-weight: 500 !important;
    backdrop-filter: blur(10px) !important;
  `;
  tooltip.innerHTML = `
    <div style="display: flex; align-items: start; gap: 8px;">
      <span style="font-size: 16px; flex-shrink: 0;">💡</span>
      <span style="flex: 1;">${tooltipText}</span>
    </div>
    <div style="
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.2);
      font-size: 11px;
      opacity: 0.85;
      display: flex;
      align-items: center;
      gap: 4px;
    ">
      <span style="font-size: 12px;">⚡</span>
      <span>Extensão Creare - Criada por Douglas G.</span>
    </div>
  `;
  document.body.appendChild(tooltip);
  
  // Função para posicionar tooltip
  const positionTooltip = (e) => {
    const rect = toggleContainer.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Posiciona abaixo do toggle, centralizado
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.bottom + 8;
    
    // Ajusta se sair da tela
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    
    // Se não couber embaixo, coloca em cima
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = rect.top - tooltipRect.height - 8;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  };
  
  // Mostra tooltip no hover
  toggleContainer.addEventListener('mouseenter', (e) => {
    positionTooltip(e);
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
  });
  
  // Esconde tooltip
  toggleContainer.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(-5px)';
  });
  
  // Atualiza posição se a janela redimensionar
  window.addEventListener('resize', () => {
    if (tooltip.style.opacity === '1') {
      positionTooltip();
    }
  });
  
  // Função para atualizar visual
  function updateVisual() {
    if (isEnabled) {
      switchEl.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      switchBall.style.left = '18px';
      label.textContent = `${labelText}: ON`;
      label.style.color = '#11998e';
      toggleContainer.style.background = 'rgba(17, 153, 142, 0.1)';
    } else {
      switchEl.style.background = 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)';
      switchBall.style.left = '2px';
      label.textContent = `${labelText}: OFF`;
      label.style.color = '#999';
      toggleContainer.style.background = 'rgba(158, 158, 158, 0.08)';
    }
  }
  
  // Hover effect
  toggleContainer.onmouseenter = () => {
    toggleContainer.style.background = isEnabled 
      ? 'rgba(17, 153, 142, 0.2)' 
      : 'rgba(158, 158, 158, 0.15)';
  };
  
  toggleContainer.onmouseleave = () => {
    updateVisual();
  };
  
  // Click handler
  toggleContainer.onclick = () => {
    isEnabled = !isEnabled;
    onChangeCallback(isEnabled);
    updateVisual();
    console.log(`${id}: Estado alterado para`, isEnabled);
  };
  
  // Estado inicial
  updateVisual();
  
  return toggleContainer;
}

// Verifica se a tratativa selecionada é "Alerta invalidado"
function isTratativaInvalidada() {
  try {
    console.log('Auto-Finalize: 🔍 Verificando se tratativa é "Alerta invalidado"...');
    
    // Procura pelo select/dropdown de "Tipo de Alerta"
    const selects = document.querySelectorAll('select');
    console.log(`Auto-Finalize: Encontrou ${selects.length} select(s) na página`);
    
    for (const select of selects) {
      const selectedOption = select.options[select.selectedIndex];
      if (selectedOption && selectedOption.text) {
        const tratativa = selectedOption.text.trim();
        console.log(`Auto-Finalize: Select encontrado com valor: "${tratativa}"`);
        
        // Se a tratativa selecionada for "Alerta invalidado"
        if (tratativa === 'Alerta invalidado') {
          console.log('Auto-Finalize: ✅ Tratativa selecionada é "Alerta invalidado"!');
          return true;
        }
      }
    }
    
    console.log('Auto-Finalize: ⚠️ Nenhuma tratativa "Alerta invalidado" encontrada');
    return false;
  } catch (error) {
    console.warn('Auto-Finalize: ❌ Erro ao verificar tratativa', error);
    return false;
  }
}

// Detecta se é popup de INVALIDAR (quando seleciona "Alerta invalidado")
function isInvalidateConfirmPopup(element) {
  const text = element.textContent || '';
  
  // ⚠️ REGRA #1: NÃO DEVE detectar o popup de confirmação de motorista!
  const isMotoristaPopup = text.includes('Motorista') || 
                           text.includes('motorista') ||
                           text.includes('deseja informar o(a)');
  
  if (isMotoristaPopup) {
    console.log('Auto-Finalize: ⚠️ É popup de MOTORISTA, não vai processar!');
    return false;
  }
  
  // Popup de invalidar tem: "tem certeza" + "invalidar" + "alerta"
  const hasConfirmText = text.includes('tem certeza') || text.includes('certeza');
  const hasInvalidateWord = text.includes('invalidar');
  const hasAlertWord = text.includes('alerta');
  
  // Verifica se tem botão OK ou Ok
  const buttons = Array.from(element.querySelectorAll('button'));
  const hasOkButton = buttons.some(btn => {
    const btnText = btn.textContent.trim();
    return btnText === 'OK' || btnText === 'Ok' || btnText === 'CONFIRMAR' || btnText === 'Confirmar';
  });
  
  if (hasConfirmText && hasInvalidateWord && hasAlertWord && hasOkButton) {
    console.log('Auto-Finalize: ✅ Popup de INVALIDAR encontrado!');
    return true;
  }
  
  return false;
}

// Detecta se é o PRIMEIRO popup de FINALIZAR (com botão OK)
function isFirstFinalizationPopup(element) {
  const text = element.textContent || '';
  
  // ⚠️ REGRA #1: NÃO DEVE detectar o popup de confirmação de motorista!
  const isMotoristaPopup = text.includes('Motorista') || 
                           text.includes('motorista') ||
                           text.includes('deseja informar o(a)');
  
  if (isMotoristaPopup) {
    console.log('Auto-Finalize: ⚠️ É popup de MOTORISTA, não vai processar!');
    return false;
  }
  
  // ⚠️ Se tem "invalidar", não é popup de finalizar!
  if (text.includes('invalidar')) {
    return false;
  }
  
  // Primeiro popup tem: "tem certeza" + "finalizar" + botão "OK"
  const hasConfirmText = text.includes('tem certeza');
  const hasFinalizeWord = text.includes('finalizar');
  const hasAlertWord = text.includes('alerta');
  
  // Verifica se tem botão OK (primeiro popup)
  const buttons = Array.from(element.querySelectorAll('button, .btn'));
  const hasOkButton = buttons.some(btn => {
    const btnText = btn.textContent.trim().toUpperCase();
    // Aceita "OK" ou "Ok" (case insensitive)
    return btnText === 'OK';
  });
  
  // Também verifica se NÃO tem botão FINALIZAR
  const hasFinalizeButton = buttons.some(btn => {
    const btnText = btn.textContent.trim().toUpperCase();
    return btnText === 'FINALIZAR';
  });
  
  if (hasConfirmText && hasFinalizeWord && hasAlertWord && hasOkButton && !hasFinalizeButton) {
    console.log('Auto-Finalize: ✅ PRIMEIRO popup de FINALIZAR (OK) encontrado!');
    return true;
  }
  
  return false;
}

// Detecta se é o SEGUNDO popup de FINALIZAR (com botão FINALIZAR)
function isSecondFinalizationPopup(element) {
  const text = element.textContent || '';
  
  // ⚠️ REGRA #1: NÃO DEVE detectar o popup de confirmação de motorista!
  const isMotoristaPopup = text.includes('Motorista') || 
                           text.includes('motorista') ||
                           text.includes('deseja informar o(a)');
  
  if (isMotoristaPopup) {
    console.log('Auto-Finalize: ⚠️ É popup de MOTORISTA, não vai processar!');
    return false;
  }
  
  // ⚠️ Se tem "invalidar", não é popup de finalizar!
  if (text.includes('invalidar')) {
    return false;
  }
  
  // Segundo popup tem: "tem certeza" + "finalizar" + botão "FINALIZAR"
  const hasConfirmText = text.includes('tem certeza');
  const hasFinalizeWord = text.includes('finalizar');
  const hasAlertWord = text.includes('alerta');
  
  // ⚠️ IMPORTANTE: Verifica PRIMEIRO se tem botão OK
  // Se tiver OK, NÃO é o segundo popup!
  const buttons = Array.from(element.querySelectorAll('button, .btn'));
  const hasOkButton = buttons.some(btn => {
    const btnText = btn.textContent.trim().toUpperCase();
    return btnText === 'OK';
  });
  
  // Se tem botão OK, é o PRIMEIRO popup, não o segundo!
  if (hasOkButton) {
    console.log('Auto-Finalize: ⚠️ Tem botão OK, não é o SEGUNDO popup!');
    return false;
  }
  
  // Verifica se tem botão FINALIZAR (segundo popup)
  const hasFinalizeButton = buttons.some(btn => {
    const btnText = btn.textContent.trim().toUpperCase();
    return btnText === 'FINALIZAR' || btnText.includes('FINALIZAR');
  });
  
  if (hasConfirmText && hasFinalizeWord && hasAlertWord && hasFinalizeButton) {
    console.log('Auto-Finalize: ✅ SEGUNDO popup de FINALIZAR encontrado!');
    return true;
  }
  
  return false;
}

// Detecta se é um popup de confirmação de finalização (qualquer um dos três tipos)
function isFinalizationPopup(element) {
  return isInvalidateConfirmPopup(element) || isFirstFinalizationPopup(element) || isSecondFinalizationPopup(element);
}

// Detecta se é um popup de confirmação de motorista (ou outros diálogos de confirmação)
// ⚠️ ATENÇÃO: Este popup NÃO deve ser auto-clicado! Ele deve aparecer para o usuário.
// Esta função é mantida apenas para evitar que o Auto-Finalize o detecte erroneamente.
function isConfirmationPopup(element) {
  const text = element.textContent || '';
  
  // Otimização: Se não tem texto de confirmação, retorna false imediatamente
  const hasConfirmText = text.includes('tem certeza') || text.includes('deseja informar');
  if (!hasConfirmText) {
    return false;
  }
  
  // Detecta diálogos de confirmação específicos:
  // "Você tem certeza que deseja informar o(a) [NOME] como o(a) Motorista dos Alertas?"
  const hasMotoristaWord = text.includes('motorista') || text.includes('Motorista');
  
  // ⚠️ NUNCA detectar como popup de confirmação automática!
  // O popup de motorista DEVE aparecer para o usuário
  if (hasMotoristaWord) {
    console.log('Auto-Confirm: ⚠️ É popup de MOTORISTA, não vai processar automaticamente!');
    return false; // NÃO auto-clica!
  }
  
  const hasAsMotorista = text.includes('como o(a) Motorista dos Alertas') || 
                          text.includes('como o motorista') ||
                          text.includes('como a motorista');
  
  // Verifica se tem os botões OK e CANCEL
  const buttons = Array.from(element.querySelectorAll('button'));
  const hasOkButton = buttons.some(btn => btn.textContent.trim().toUpperCase() === 'OK');
  const hasCancelButton = buttons.some(btn => btn.textContent.trim().toUpperCase() === 'CANCEL');
  
  // DESABILITADO: Não auto-clica mais em popups de motorista
  // O usuário deve ver e confirmar manualmente
  return false;
}

// Clica automaticamente no botão OK (primeiro popup)
function autoClickOkButton(popup) {
  if (!autoFinalizeEnabled) {
    console.log('Auto-Finalize: Funcionalidade desativada, não vai clicar');
    return;
  }
  
  console.log('Auto-Finalize: ✅ Procurando botão OK...');
  
  // Função para disparar cliques múltiplos com eventos completos
  function triggerMultipleClicks(button) {
    console.log('Auto-Finalize: 🎯 Disparando cliques múltiplos no botão OK...');
    
    // Estratégia 1: MouseEvent completo
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      const evt = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      });
      button.dispatchEvent(evt);
    });
    
    // Estratégia 2: .click() nativo
    button.click();
    
    // Estratégia 3: PointerEvent (para frameworks modernos)
    ['pointerdown', 'pointerup'].forEach(eventType => {
      const evt = new PointerEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        isPrimary: true
      });
      button.dispatchEvent(evt);
    });
    
    // Estratégia 4: Foca e pressiona Enter
    button.focus();
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    button.dispatchEvent(enterEvent);
    
    console.log('Auto-Finalize: ✅ Cliques múltiplos executados!');
  }
  
  // Tenta imediatamente (50ms)
  setTimeout(() => {
    const buttons = popup.querySelectorAll('button, .btn, [role="button"], input[type="button"]');
    let okButton = null;
    
    console.log(`Auto-Finalize: Encontrei ${buttons.length} botões no popup`);
    
    for (const btn of buttons) {
      const text = btn.textContent.trim().toUpperCase();
      const value = btn.value?.toUpperCase() || '';
      
      console.log('Auto-Finalize: Botão:', btn.textContent.trim() || value);
      
      // Aceita OK, Ok, CONFIRMAR
      if (text === 'OK' || value === 'OK' || text === 'CONFIRMAR' || value === 'CONFIRMAR') {
        okButton = btn;
        console.log('Auto-Finalize: 🎯 BOTÃO OK ENCONTRADO!', btn);
        break;
      }
    }
    
    if (okButton) {
      try {
        console.log('Auto-Finalize: 🖱️ CLICANDO NO BOTÃO OK...');
        triggerMultipleClicks(okButton);
        console.log('Auto-Finalize: ✅ Primeiro clique executado!');
        
        // Cliques de segurança adicionais
        setTimeout(() => {
          try {
            triggerMultipleClicks(okButton);
            console.log('Auto-Finalize: 🔄 Clique de segurança 1 executado (150ms)');
          } catch (e) {
            console.warn('Auto-Finalize: Erro no clique de segurança 1', e);
          }
        }, 150);
        
        setTimeout(() => {
          try {
            triggerMultipleClicks(okButton);
            console.log('Auto-Finalize: 🔄 Clique de segurança 2 executado (300ms)');
          } catch (e) {
            console.warn('Auto-Finalize: Erro no clique de segurança 2', e);
          }
        }, 300);
        
        setTimeout(() => {
          try {
            triggerMultipleClicks(okButton);
            console.log('Auto-Finalize: 🔄 Clique de segurança 3 executado (500ms)');
          } catch (e) {
            console.warn('Auto-Finalize: Erro no clique de segurança 3', e);
          }
        }, 500);
        
      } catch (error) {
        console.error('Auto-Finalize: ❌ Erro ao clicar no botão OK', error);
      }
    } else {
      console.log('Auto-Finalize: ⚠️ Botão OK não encontrado no primeiro popup');
      
      // Fallback: busca em todo o documento
      console.log('Auto-Finalize: 🔍 Buscando botão OK em todo o documento...');
      const allButtons = document.querySelectorAll('button, .btn, [role="button"], input[type="button"]');
      
      for (const btn of allButtons) {
        const text = btn.textContent.trim().toUpperCase();
        const value = btn.value?.toUpperCase() || '';
        
        if ((text === 'OK' || value === 'OK') && btn.offsetParent !== null) {
          console.log('Auto-Finalize: 🎯 BOTÃO OK ENCONTRADO NO DOCUMENTO!', btn);
          triggerMultipleClicks(btn);
          break;
        }
      }
    }
  }, 50);
}

// Clica automaticamente no botão FINALIZAR (segundo popup)
function autoClickFinalizeButton(popup) {
  if (!autoFinalizeEnabled) {
    console.log('Auto-Finalize: Funcionalidade desativada, não vai clicar');
    return;
  }
  
  console.log('Auto-Finalize: ✅ Procurando botão FINALIZAR...');
  
  // Função para disparar cliques múltiplos com eventos completos
  function triggerMultipleClicks(button) {
    console.log('Auto-Finalize: 🎯 Disparando cliques múltiplos no botão FINALIZAR...');
    
    // Estratégia 1: MouseEvent completo
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      const evt = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      });
      button.dispatchEvent(evt);
    });
    
    // Estratégia 2: .click() nativo
    button.click();
    
    // Estratégia 3: PointerEvent (para frameworks modernos)
    ['pointerdown', 'pointerup'].forEach(eventType => {
      const evt = new PointerEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        isPrimary: true
      });
      button.dispatchEvent(evt);
    });
    
    // Estratégia 4: Foca e pressiona Enter
    button.focus();
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    button.dispatchEvent(enterEvent);
    
    console.log('Auto-Finalize: ✅ Cliques múltiplos executados!');
  }
  
  // Tenta imediatamente (50ms)
  setTimeout(() => {
    const buttons = popup.querySelectorAll('button, .btn, [role="button"], input[type="button"]');
    let finalizeButton = null;
    
    console.log(`Auto-Finalize: Encontrei ${buttons.length} botões no popup`);
    
    for (const btn of buttons) {
      const text = btn.textContent.trim().toUpperCase();
      const value = btn.value?.toUpperCase() || '';
      
      console.log('Auto-Finalize: Botão:', text || value);
      
      if (text === 'FINALIZAR' || text.includes('FINALIZAR') || value === 'FINALIZAR' || value.includes('FINALIZAR')) {
        finalizeButton = btn;
        console.log('Auto-Finalize: 🎯 BOTÃO FINALIZAR ENCONTRADO!', btn);
        break;
      }
    }
    
    if (finalizeButton) {
      try {
        console.log('Auto-Finalize: 🖱️ CLICANDO NO BOTÃO FINALIZAR...');
        triggerMultipleClicks(finalizeButton);
        console.log('Auto-Finalize: ✅ Primeiro clique executado!');
        
        // Cliques de segurança adicionais
        setTimeout(() => {
          try {
            triggerMultipleClicks(finalizeButton);
            console.log('Auto-Finalize: 🔄 Clique de segurança 1 executado (150ms)');
          } catch (e) {
            console.warn('Auto-Finalize: Erro no clique de segurança 1', e);
          }
        }, 150);
        
        setTimeout(() => {
          try {
            triggerMultipleClicks(finalizeButton);
            console.log('Auto-Finalize: 🔄 Clique de segurança 2 executado (300ms)');
          } catch (e) {
            console.warn('Auto-Finalize: Erro no clique de segurança 2', e);
          }
        }, 300);
        
        setTimeout(() => {
          try {
            triggerMultipleClicks(finalizeButton);
            console.log('Auto-Finalize: 🔄 Clique de segurança 3 executado (500ms)');
          } catch (e) {
            console.warn('Auto-Finalize: Erro no clique de segurança 3', e);
          }
        }, 500);
        
      } catch (error) {
        console.error('Auto-Finalize: ❌ Erro ao clicar no botão FINALIZAR', error);
      }
    } else {
      console.log('Auto-Finalize: ⚠️ Botão FINALIZAR não encontrado no popup');
      
      // Fallback: busca em todo o documento
      console.log('Auto-Finalize: 🔍 Buscando botão FINALIZAR em todo o documento...');
      const allButtons = document.querySelectorAll('button, .btn, [role="button"], input[type="button"]');
      
      for (const btn of allButtons) {
        const text = btn.textContent.trim().toUpperCase();
        const value = btn.value?.toUpperCase() || '';
        
        if ((text === 'FINALIZAR' || text.includes('FINALIZAR') || value === 'FINALIZAR') && btn.offsetParent !== null) {
          console.log('Auto-Finalize: 🎯 BOTÃO FINALIZAR ENCONTRADO NO DOCUMENTO!', btn);
          triggerMultipleClicks(btn);
          break;
        }
      }
    }
  }, 50);
}

// Clica automaticamente no botão OK de diálogos de confirmação
function autoClickConfirmButton(popup) {
  if (!autoFinalizeEnabled) {
    console.log('Auto-Confirm: Funcionalidade desativada, não vai clicar');
    return;
  }
  
  console.log('Auto-Confirm: ✅ Procurando botão OK/CONFIRMAR...');
  
  // Aguarda um pouco para o popup renderizar completamente
  setTimeout(() => {
    // Procura o botão OK ou CONFIRMAR
    const buttons = popup.querySelectorAll('button, .btn, [role="button"]');
    let confirmButton = null;
    
    console.log(`Auto-Confirm: Encontrei ${buttons.length} botões no popup`);
    
    for (const btn of buttons) {
      const text = btn.textContent.trim().toUpperCase();
      console.log('Auto-Confirm: Botão:', text);
      
      // Prioriza OK, depois CONFIRMAR, SIM, etc
      if (text === 'OK') {
        confirmButton = btn;
        console.log('Auto-Confirm: 🎯 BOTÃO OK ENCONTRADO!', btn);
        break;
      } else if (text === 'CONFIRMAR' || text === 'SIM' || text.includes('CONFIRMAR')) {
        confirmButton = btn;
        console.log('Auto-Confirm: 🎯 BOTÃO CONFIRMAR ENCONTRADO!', btn);
      }
    }
    
    if (confirmButton) {
      try {
        console.log('Auto-Confirm: 🖱️ CLICANDO NO BOTÃO (popup oculto)...');
        confirmButton.click();
        console.log('Auto-Confirm: ✅ Confirmação clicada automaticamente!');
        
        // Clique de segurança após 100ms
        setTimeout(() => {
          try {
            confirmButton.click();
            console.log('Auto-Confirm: 🔄 Clique de segurança executado');
          } catch (e) {
            // Ignora erros (popup pode já ter sido removido)
          }
        }, 100);
        
      } catch (error) {
        console.error('Auto-Confirm: ❌ Erro ao clicar no botão', error);
      }
    } else {
      console.log('Auto-Confirm: ⚠️ Botão OK/CONFIRMAR não encontrado');
    }
  }, 200); // Aguarda 200ms para garantir que o popup renderizou
}

// Observer para detectar popups de confirmação (tanto finalização quanto outros diálogos)
const autoFinalizeObserver = new MutationObserver((mutations) => {
  if (!autoFinalizeEnabled) {
    return;
  }
  
  // ⚠️ DESABILITA PARCIALMENTE se estiver na tela de APLICAR GESTÃO
  // Permite popups de MOTORISTA e INVALIDAR, mas bloqueia popup de FINALIZAÇÃO
  const bodyText = document.body.textContent || '';
  const hasAplicarGestao = bodyText.includes('APLICAR GESTÃO') || bodyText.includes('APLICAR GESTAO');
  const hasQualMotorista = bodyText.includes('Qual motorista está nos alertas ao lado');
  const hasCasoConheca = bodyText.includes('Caso o conheça') || bodyText.includes('Caso o motorista informado');
  
  const isOnAplicarGestaoScreen = hasAplicarGestao || hasQualMotorista || hasCasoConheca;
  
  if (isOnAplicarGestaoScreen) {
    // Log detalhado de modais que aparecem durante APLICAR GESTÃO
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && (node.offsetHeight > 50 || node.textContent?.includes('certeza'))) {
          const nodeText = node.textContent || '';
          
          // ✅ PERMITE popups de MOTORISTA e INVALIDAR aparecerem
          if (nodeText.includes('Motorista') || nodeText.includes('motorista') || 
              nodeText.includes('invalidar')) {
            console.log('🔍 APLICAR GESTÃO: Popup de MOTORISTA/INVALIDAR detectado, permitindo...');
            console.log('   - Texto:', nodeText.substring(0, 150));
            // NÃO faz return, deixa o popup aparecer normalmente
          } else {
            console.log('🔍 APLICAR GESTÃO: Modal detectado mas observer está DESABILITADO');
            console.log('   - Classes:', node.className);
            console.log('   - Texto:', nodeText.substring(0, 150));
            console.log('   - Display:', window.getComputedStyle(node).display);
            console.log('   - Visibility:', window.getComputedStyle(node).visibility);
          }
        }
      }
    }
    
    // ⚠️ IMPORTANTE: Mesmo na tela de gestão, processa popups de MOTORISTA e INVALIDAR
    // Mas bloqueia popups de FINALIZAÇÃO
    // Continua processando abaixo...
  }
  
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Só verifica se tem tamanho razoável de popup (performance)
        if (node.offsetHeight < 50 || node.offsetWidth < 200) {
          continue;
        }
        
        // ⚠️ IGNORA BACKDROPS VAZIOS (fundo cinza dos modais)
        // Backdrops têm classe "backdrop" mas não têm conteúdo relevante
        const className = typeof node.className === 'string' ? node.className : (node.className?.baseVal || '');
        const isBackdrop = className && (
          className.includes('backdrop') ||
          className.includes('modal-backdrop')
        );
        
        if (isBackdrop && node.textContent.trim().length < 10) {
          console.log('Auto-Finalize: ⚠️ É um backdrop vazio, ignorando...');
          continue; // Não processa backdrops
        }
        
        // Só verifica elementos que parecem ser modais/dialogs
        const tagName = node.tagName?.toLowerCase();
        const hasDialogRole = node.getAttribute('role') === 'dialog' || node.getAttribute('role') === 'alertdialog';
        const hasModalClass = className && (
          className.includes('modal') || 
          className.includes('dialog') || 
          className.includes('popup') ||
          className.includes('swal') ||
          className.includes('alertify') ||
          className.includes('ajs-modal') ||
          className.includes('ajs-dialog')
        );
        
        const isPossibleModal = hasDialogRole || hasModalClass || tagName === 'dialog';
        
        if (!isPossibleModal) {
          continue; // Ignora elementos que não são modais
        }
        
        console.log('Auto-Finalize: Possível modal detectado!', node);
        console.log('Auto-Finalize: Classes:', node.className);
        console.log('Auto-Finalize: Role:', node.getAttribute('role'));
        console.log('Auto-Finalize: Texto (100 chars):', node.textContent?.substring(0, 100));
        
        // ⚠️ PROTEÇÃO ADICIONAL: NUNCA processar popups de motorista!
        const nodeText = node.textContent || '';
        if (nodeText.includes('Motorista') || nodeText.includes('motorista')) {
          console.log('Auto-Finalize Observer: ⚠️ Detectou popup de MOTORISTA, não vai processar!');
          continue; // PULA este elemento completamente
        }
        
        // ⚠️ IMPORTANTE: Detecta se é popup de INVALIDAR, PRIMEIRO popup (OK) ou SEGUNDO popup (FINALIZAR)
        const isInvalidatePopup = isInvalidateConfirmPopup(node);
        const isFirstPopup = isFirstFinalizationPopup(node);
        const isSecondPopup = isSecondFinalizationPopup(node);
        
        if (isInvalidatePopup) {
          console.log('Auto-Finalize: 🎯 É O POPUP DE INVALIDAR!');
          
          // ⚠️ PRIMEIRO CLICA, DEPOIS ESCONDE
          // Clica automaticamente no botão OK
          autoClickOkButton(node);
          
          // ESCONDE O POPUP após um pequeno delay
          setTimeout(() => {
            node.style.display = 'none';
            console.log('Auto-Finalize: 🚫 Popup ocultado!');
            
            // Procura e remove overlays/backdrops associados
            const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
            overlays.forEach(overlay => {
              if (overlay.offsetParent !== null) {
                overlay.style.display = 'none';
                console.log('Auto-Finalize: 🚫 Overlay removido!');
              }
            });
          }, 100);
          
          return;
        }
        
        if (isFirstPopup) {
          console.log('Auto-Finalize: 🎯 É O PRIMEIRO POPUP DE FINALIZAR (OK)!');
          
          // ⚠️ PRIMEIRO CLICA, DEPOIS ESCONDE
          // Clica automaticamente no botão OK
          autoClickOkButton(node);
          
          // ESCONDE O POPUP após um pequeno delay
          setTimeout(() => {
            node.style.display = 'none';
            console.log('Auto-Finalize: 🚫 Popup ocultado!');
            
            // Procura e remove overlays/backdrops associados
            const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
            overlays.forEach(overlay => {
              if (overlay.offsetParent !== null) {
                overlay.style.display = 'none';
                console.log('Auto-Finalize: 🚫 Overlay removido!');
              }
            });
          }, 100);
          
          return;
        }
        
        if (isSecondPopup) {
          console.log('Auto-Finalize: 🎯 É O SEGUNDO POPUP DE FINALIZAR!');
          
          // ⚠️ PRIMEIRO CLICA, DEPOIS ESCONDE
          // Clica automaticamente no botão FINALIZAR
          autoClickFinalizeButton(node);
          
          // ESCONDE O POPUP após um pequeno delay
          setTimeout(() => {
            node.style.display = 'none';
            console.log('Auto-Finalize: 🚫 Popup ocultado!');
            
            // Procura e remove overlays/backdrops associados
            const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
            overlays.forEach(overlay => {
              if (overlay.offsetParent !== null) {
                overlay.style.display = 'none';
                console.log('Auto-Finalize: 🚫 Overlay removido!');
              }
            });
          }, 100);
          
          return;
        }
        
        // Se não é popup de finalização, verifica se é popup de confirmação
        if (isConfirmationPopup(node)) {
          console.log('Auto-Confirm: 🎯 É UM POPUP DE CONFIRMAÇÃO!');
          
          // ESCONDE O POPUP IMEDIATAMENTE
          node.style.display = 'none';
          console.log('Auto-Confirm: 🚫 Popup ocultado!');
          
          // Procura e remove overlays/backdrops associados
          const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
          overlays.forEach(overlay => {
            if (overlay.offsetParent !== null) {
              overlay.style.display = 'none';
              console.log('Auto-Confirm: 🚫 Overlay removido!');
            }
          });
          
          // Clica automaticamente no botão OK
          autoClickConfirmButton(node);
          return;
        }
        
        // Verifica descendentes (modais dentro de divs) - IMPORTANTE para popup de confirmação!
        const modals = node.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, .dialog, .modal-content, .swal2-popup, [class*="popup"], [class*="swal"]');
        console.log('Auto-Finalize: Verificando', modals.length, 'descendentes...');
        
        for (const modal of modals) {
          console.log('Auto-Finalize: Descendente encontrado, verificando...');
          console.log('Auto-Finalize: Descendente texto:', modal.textContent?.substring(0, 100));
          
          const isInvalidatePopup = isInvalidateConfirmPopup(modal);
          const isFirstPopup = isFirstFinalizationPopup(modal);
          const isSecondPopup = isSecondFinalizationPopup(modal);
          
          if (isInvalidatePopup) {
            console.log('Auto-Finalize: 🎯 Popup de INVALIDAR encontrado em descendente!');
            
            // ESCONDE O POPUP IMEDIATAMENTE
            node.style.display = 'none'; // esconde o container pai
            modal.style.display = 'none'; // esconde o modal
            console.log('Auto-Finalize: 🚫 Popup ocultado!');
            
            // Procura e remove overlays/backdrops associados
            const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
            overlays.forEach(overlay => {
              if (overlay.offsetParent !== null) {
                overlay.style.display = 'none';
                console.log('Auto-Finalize: 🚫 Overlay removido!');
              }
            });
            
            // Clica automaticamente no botão OK
            autoClickOkButton(modal);
            return;
          }
          
          if (isFirstPopup) {
            console.log('Auto-Finalize: 🎯 PRIMEIRO popup de FINALIZAR (OK) encontrado em descendente!');
            
            // ESCONDE O POPUP IMEDIATAMENTE
            node.style.display = 'none'; // esconde o container pai
            modal.style.display = 'none'; // esconde o modal
            console.log('Auto-Finalize: 🚫 Popup ocultado!');
            
            // Procura e remove overlays/backdrops associados
            const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
            overlays.forEach(overlay => {
              if (overlay.offsetParent !== null) {
                overlay.style.display = 'none';
                console.log('Auto-Finalize: 🚫 Overlay removido!');
              }
            });
            
            // Clica automaticamente no botão OK
            autoClickOkButton(modal);
            return;
          }
          
          if (isSecondPopup) {
            console.log('Auto-Finalize: 🎯 SEGUNDO popup de FINALIZAR encontrado em descendente!');
            
            // ESCONDE O POPUP IMEDIATAMENTE
            node.style.display = 'none'; // esconde o container pai
            modal.style.display = 'none'; // esconde o modal
            console.log('Auto-Finalize: 🚫 Popup ocultado!');
            
            // Procura e remove overlays/backdrops associados
            const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
            overlays.forEach(overlay => {
              if (overlay.offsetParent !== null) {
                overlay.style.display = 'none';
                console.log('Auto-Finalize: 🚫 Overlay removido!');
              }
            });
            
            // Clica automaticamente no botão FINALIZAR
            autoClickFinalizeButton(modal);
            return;
          }
          
          if (isConfirmationPopup(modal)) {
            console.log('Auto-Confirm: 🎯 Popup de confirmação encontrado em descendente!');
            
            // ESCONDE O POPUP IMEDIATAMENTE
            node.style.display = 'none'; // esconde o container pai
            modal.style.display = 'none'; // esconde o modal
            console.log('Auto-Confirm: 🚫 Popup ocultado!');
            
            // Procura e remove overlays/backdrops associados
            const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
            overlays.forEach(overlay => {
              if (overlay.offsetParent !== null) {
                overlay.style.display = 'none';
                console.log('Auto-Confirm: 🚫 Overlay removido!');
              }
            });
            
            // Clica automaticamente no botão OK
            autoClickConfirmButton(modal);
            return;
          }
        }
      }
    }
  }
});

// Verificação periódica (fallback) - detecta popups que o observer possa ter perdido
// Marca elementos verificados para evitar spam de logs
let checkedModals = new WeakSet();
let fallbackIterations = 0;

setInterval(() => {
  if (!autoFinalizeEnabled) return;
  
  // ⚠️ DESABILITA PARCIALMENTE se estiver na tela de APLICAR GESTÃO
  // Permite popups de MOTORISTA e INVALIDAR, mas bloqueia popup de FINALIZAÇÃO
  const bodyText = document.body.textContent || '';
  const hasAplicarGestao = bodyText.includes('APLICAR GESTÃO') || bodyText.includes('APLICAR GESTAO');
  const hasQualMotorista = bodyText.includes('Qual motorista está nos alertas ao lado');
  const hasCasoConheca = bodyText.includes('Caso o conheça') || bodyText.includes('Caso o motorista informado');
  
  const isOnAplicarGestaoScreen = hasAplicarGestao || hasQualMotorista || hasCasoConheca;
  
  if (isOnAplicarGestaoScreen) {
    fallbackIterations++;
    if (fallbackIterations % 10 === 0) { // Log a cada 10 iterações (2 segundos) para não spammar
      console.log('Auto-Finalize Fallback: 🛑 Tela de APLICAR GESTÃO detectada, permitindo apenas MOTORISTA/INVALIDAR');
    }
    // ⚠️ IMPORTANTE: Mesmo na tela de gestão, processa popups de MOTORISTA e INVALIDAR
    // Mas bloqueia popups de FINALIZAÇÃO
    // Continua processando abaixo...
  }
  
  fallbackIterations++;
  
  // Busca por todos os modais visíveis na página (incluindo descendentes)
  const allModals = document.querySelectorAll('[role="dialog"]:not([style*="display: none"]), [role="alertdialog"]:not([style*="display: none"]), .modal:not([style*="display: none"]), .modal-content:not([style*="display: none"]), .swal2-popup:not([style*="display: none"]), [class*="swal"]:not([style*="display: none"])');
  
  for (const modal of allModals) {
    // ⚠️ PROTEÇÃO: NUNCA processar popups de motorista!
    const modalText = modal.textContent || '';
    if (modalText.includes('Motorista') || modalText.includes('motorista')) {
      // console.log('Auto-Finalize Fallback: ⚠️ Detectou popup de MOTORISTA, não vai processar!');
      continue; // PULA este modal completamente
    }
    
    // Pula se já verificou este elemento
    if (checkedModals.has(modal)) {
      continue;
    }
    
    // Marca como verificado
    checkedModals.add(modal);
    
    // Verifica se é popup de confirmação PRIMEIRO (prioridade)
    if (isConfirmationPopup(modal)) {
      console.log('Auto-Confirm: 🔄 Popup de confirmação detectado (fallback)!');
      
      // Esconde o modal e o container pai
      modal.style.display = 'none';
      if (modal.parentElement && modal.parentElement.classList.contains('modal')) {
        modal.parentElement.style.display = 'none';
      }
      
      // Remove overlays
      const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
      overlays.forEach(overlay => {
        if (overlay.offsetParent !== null && !overlay.textContent.includes('APLICAR GESTÃO')) {
          overlay.style.display = 'none';
        }
      });
      
      autoClickConfirmButton(modal);
      break; // Processa apenas um por vez
    }
    
    // Verifica se é popup de finalização
    if (isFinalizationPopup(modal)) {
      console.log('Auto-Finalize: 🔄 Popup de finalização detectado (fallback)!');
      
      modal.style.display = 'none';
      if (modal.parentElement && modal.parentElement.classList.contains('modal')) {
        modal.parentElement.style.display = 'none';
      }
      
      // Remove overlays
      const overlays = document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop, [class*="backdrop"]');
      overlays.forEach(overlay => {
        if (overlay.offsetParent !== null) {
          overlay.style.display = 'none';
        }
      });
      
      autoClickFinalizeButton(modal);
      break; // Processa apenas um por vez
    }
  }
  
  // Limpa o WeakSet periodicamente (a cada 50 verificações)
  // Isso evita acúmulo de memória mas mantém o cache por tempo suficiente
  if (fallbackIterations >= 50) {
    checkedModals = new WeakSet();
    fallbackIterations = 0;
  }
}, 200); // Verifica a cada 200ms (mais rápido)

// Inicializa a funcionalidade
loadAutoFinalizeState();
loadAlwaysOnlineState();
loadAutoSortState();

// Inicia observação para popups
autoFinalizeObserver.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true, // ⚠️ IMPORTANTE: Observa mudanças de atributos (como style, class)
  attributeFilter: ['style', 'class'], // Só observa mudanças de style e class
  attributeOldValue: false
});

// ADICIONA O TOGGLE quando a página estiver pronta
// Usa um MutationObserver para detectar quando o header carregar
let toggleAdded = false;
const headerObserver = new MutationObserver(() => {
  if (toggleAdded) return;
  
  // Procura pelo elemento "Eventos"
  const eventos = Array.from(document.querySelectorAll('nb-action, *')).find(el => {
    const text = el.textContent?.trim() || '';
    return text.match(/^Eventos\s*\d*$/i) && el.offsetParent !== null && el.children.length < 5;
  });
  
  if (eventos && eventos.parentElement) {
    console.log('Auto-Finalize: Header carregado! Adicionando toggle integrado...');
    addAutoFinalizeToggle();
    toggleAdded = true;
    headerObserver.disconnect();
  }
});

headerObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Tenta também após delays (fallback)
setTimeout(() => {
  if (!toggleAdded) addAutoFinalizeToggle();
}, 1000);

setTimeout(() => {
  if (!toggleAdded) addAutoFinalizeToggle();
}, 3000);

// Inicializa o observer
autoFinalizeObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// 🔒 PROTEÇÃO EXTRA: Intercepta QUALQUER tentativa de esconder o popup de motorista
// Este código garante que o popup SEMPRE apareça, mesmo se outro código tentar escondê-lo
const motoristaPopupProtector = new MutationObserver((mutations) => {
  const bodyText = document.body.textContent || '';
  const isOnAplicarGestaoScreen = 
    bodyText.includes('APLICAR GESTÃO') || 
    bodyText.includes('APLICAR GESTAO') ||
    bodyText.includes('Qual motorista está nos alertas ao lado') ||
    bodyText.includes('Caso o conheça') ||
    bodyText.includes('Caso o motorista informado');
  
  if (!isOnAplicarGestaoScreen) return;
  
  // Procura por popups de motorista
  const allModals = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, .swal2-popup, [class*="swal"]');
  
  for (const modal of allModals) {
    const modalText = modal.textContent || '';
    const isMotoristaPopup = 
      (modalText.includes('Motorista') || modalText.includes('motorista')) &&
      (modalText.includes('tem certeza') || modalText.includes('deseja informar'));
    
    if (isMotoristaPopup) {
      const computedStyle = window.getComputedStyle(modal);
      const isHidden = 
        modal.style.display === 'none' ||
        computedStyle.display === 'none' ||
        computedStyle.visibility === 'hidden' ||
        computedStyle.opacity === '0';
      
      if (isHidden) {
        console.log('🚨 PROTEÇÃO: Popup de motorista estava ESCONDIDO! Forçando visibilidade...');
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.setProperty('display', 'block', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('opacity', '1', 'important');
        console.log('✅ Popup de motorista está VISÍVEL agora!');
      }
    }
  }
});

motoristaPopupProtector.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'class']
});

console.log('📋 Auto-Finalize: Sistema carregado!');

// ============================================================
// SEMPRE ONLINE
// Detecta quando o status está "Offline" e clica automaticamente
// no botão para mudar para "Online"
// ============================================================

// Encontra e clica no botão Offline para mudar para Online
function setStatusToOnline() {
  if (!alwaysOnlineEnabled) {
    console.log('Always-Online: Funcionalidade desativada');
    return;
  }
  
  console.log('Always-Online: 🔍 Procurando toggle Offline/Online...');
  
  // Procura especificamente pelo label.theme-switch
  const themeSwitches = document.querySelectorAll('label.theme-switch, label[class*="theme-switch"]');
  
  for (const label of themeSwitches) {
    if (!label.offsetParent) continue;
    
    const text = label.textContent?.trim().toLowerCase() || '';
    
    // Verifica se é o switch de status (contém "online" ou "offline")
    if (text.includes('online') || text.includes('offline')) {
      console.log('Always-Online: 🎯 Toggle theme-switch encontrado!', label);
      console.log('Always-Online: Texto atual:', label.textContent.trim());
      
      // Verifica se está "Offline"
      if (text.includes('offline')) {
        console.log('Always-Online: ⚠️ Status está Offline! Clicando no toggle...');
        
        // Procura o checkbox dentro do label
        const checkbox = label.querySelector('input[type="checkbox"]');
        
        if (checkbox) {
          console.log('Always-Online: 🎯 Checkbox encontrado dentro do label!');
          try {
            checkbox.click();
            console.log('Always-Online: ✅ Clicou no checkbox');
            setTimeout(() => verifyOnlineStatus(), 800);
            return true;
          } catch (error) {
            console.log('Always-Online: ⚠️ Erro ao clicar no checkbox, tentando o label...');
          }
        }
        
        // Se não encontrou checkbox ou falhou, clica no próprio label
        try {
          label.click();
          console.log('Always-Online: ✅ Clicou no label');
          setTimeout(() => verifyOnlineStatus(), 800);
          return true;
        } catch (error) {
          console.log('Always-Online: ⚠️ Erro ao clicar no label');
        }
      } else if (text.includes('online')) {
        console.log('Always-Online: ✅ Status já está Online!');
        lastKnownStatus = 'online';
        return true;
      }
    }
  }
  
  console.log('Always-Online: ⚠️ Toggle theme-switch não encontrado');
  return false;
}

// Verifica se o status é Online após clicar
function verifyOnlineStatus() {
  const themeSwitches = document.querySelectorAll('label.theme-switch, label[class*="theme-switch"]');
  
  for (const label of themeSwitches) {
    if (!label.offsetParent) continue;
    
    const text = label.textContent?.trim().toLowerCase() || '';
    
    if (text.includes('online') || text.includes('offline')) {
      if (text.includes('offline')) {
        console.log('Always-Online: ⚠️ Status ainda está Offline após clicar');
        lastKnownStatus = 'offline';
      } else {
        console.log('Always-Online: ✅ Status confirmado como Online!');
        lastKnownStatus = 'online';
      }
      return;
    }
  }
  
  console.log('Always-Online: ⚠️ Não conseguiu verificar o status');
}

// Variável para controlar último estado conhecido
let lastKnownStatus = null;
let isChangingStatus = false;

// Observer para detectar mudanças no status (se mudar para Offline, volta para Online)
const statusObserver = new MutationObserver(() => {
  if (!alwaysOnlineEnabled || isChangingStatus) return;
  
  // Procura especificamente pelo label.theme-switch
  const themeSwitches = document.querySelectorAll('label.theme-switch, label[class*="theme-switch"]');
  
  for (const label of themeSwitches) {
    if (!label.offsetParent) continue;
    
    const text = label.textContent?.trim().toLowerCase() || '';
    
    if (text.includes('offline')) {
      console.log('Always-Online: ⚠️ Status está Offline! Tentando mudar...');
      lastKnownStatus = 'attempting';
      isChangingStatus = true;
      
      setTimeout(() => {
        setStatusToOnline();
        setTimeout(() => {
          isChangingStatus = false;
          lastKnownStatus = null;
        }, 1000);
      }, 300);
      
      break; // Encontrou, para de procurar
    }
  }
});

// Inicia observação de mudanças no status
statusObserver.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// Verifica periodicamente se está Offline (backup) - mais espaçado
setInterval(() => {
  if (!alwaysOnlineEnabled || isChangingStatus) return;
  
  const themeSwitches = document.querySelectorAll('label.theme-switch, label[class*="theme-switch"]');
  
  for (const label of themeSwitches) {
    if (!label.offsetParent) continue;
    
    const text = label.textContent?.trim().toLowerCase() || '';
    
    if (text.includes('offline')) {
      console.log('Always-Online: ⏰ Verificação periódica: Offline detectado! Tentando mudar...');
      isChangingStatus = true;
      setStatusToOnline();
      setTimeout(() => {
        isChangingStatus = false;
      }, 2000);
      break;
    }
  }
}, 10000); // Verifica a cada 10 segundos (menos agressivo)

// Observer dedicado para detectar quando o toggle aparece na página
const toggleLoadObserver = new MutationObserver(() => {
  if (!alwaysOnlineEnabled || isChangingStatus) return;
  
  // Procura o toggle assim que ele aparecer
  const themeSwitches = document.querySelectorAll('label.theme-switch, label[class*="theme-switch"]');
  
  for (const label of themeSwitches) {
    if (!label.offsetParent) continue;
    
    const text = label.textContent?.trim().toLowerCase() || '';
    
    if (text.includes('offline') || text.includes('online')) {
      console.log('Always-Online: 🎯 Toggle carregado! Verificando status...');
      
      if (text.includes('offline')) {
        console.log('Always-Online: ⚠️ Status Offline detectado! Ativando Online IMEDIATAMENTE...');
        isChangingStatus = true;
        setStatusToOnline();
        setTimeout(() => {
          isChangingStatus = false;
        }, 1000);
      } else {
        console.log('Always-Online: ✅ Status já está Online');
      }
      
      // Para de observar após encontrar (não precisa mais)
      toggleLoadObserver.disconnect();
      break;
    }
  }
});

// Inicia observação para detectar quando o toggle carregar
toggleLoadObserver.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// Verificações periódicas rápidas nos primeiros segundos (backup)
const quickChecks = [300, 800, 1500, 2500, 4000];
quickChecks.forEach(delay => {
  setTimeout(() => {
    if (alwaysOnlineEnabled && !isChangingStatus) {
      const themeSwitches = document.querySelectorAll('label.theme-switch, label[class*="theme-switch"]');
      
      for (const label of themeSwitches) {
        if (!label.offsetParent) continue;
        
        const text = label.textContent?.trim().toLowerCase() || '';
        
        if (text.includes('offline')) {
          console.log(`Always-Online: ⏰ Verificação rápida (${delay}ms): Offline detectado!`);
          isChangingStatus = true;
          setStatusToOnline();
          setTimeout(() => {
            isChangingStatus = false;
          }, 1000);
          break;
        }
      }
    }
  }, delay);
});

console.log('📋 Always-Online: Sistema carregado!');

// ============================================================
// AUTO-EXPANDIR "DISPONÍVEL EM"
// Detecta a seta ao lado de "Disponível em" e clica automaticamente
// para manter sempre expandida (seta pra cima)
// ============================================================

// Estado para controlar se já expandiu
let disponivelEmExpandido = false;
let ultimoClique = 0;
let colunaJaProcessada = false;

function expandirDisponivelEm() {
  // Se a funcionalidade está desativada, não faz nada
  if (!autoSortEnabled) {
    console.log('Auto-Sort: Funcionalidade desativada');
    return false;
  }
  
  // Se já processou com sucesso, não faz nada
  if (colunaJaProcessada) {
    return true;
  }
  
  // Evita clicar múltiplas vezes em sequência (cooldown de 3 segundos)
  const agora = Date.now();
  if (agora - ultimoClique < 3000) {
    console.log('Auto-Expand: ⏸️ Cooldown ativo, aguardando...');
    return false;
  }
  
  console.log('Auto-Expand: 🔍 Procurando coluna "Disponível em"...');
  
  // Procura pelo header da coluna "Disponível em"
  const headers = document.querySelectorAll('th, .header, [role="columnheader"]');
  
  for (const header of headers) {
    const text = header.textContent?.trim().toLowerCase() || '';
    
    if (text.includes('disponível em') || text.includes('disponivel em')) {
      console.log('Auto-Expand: 🎯 Coluna "Disponível em" encontrada!', header);
      
      // Verifica TODAS as formas possíveis de indicar ordenação ascendente
      const headerHTML = header.innerHTML.toLowerCase();
      const headerClasses = (header.className || '').toLowerCase();
      
      // Procura por indicadores de ascendente em qualquer filho
      const icons = header.querySelectorAll('i, svg, span, [class*="sort"], [class*="arrow"]');
      let isAscending = false;
      let isDescending = false;
      
      for (const icon of icons) {
        const iconClass = (icon.className || '').toLowerCase();
        const iconHTML = (icon.outerHTML || '').toLowerCase();
        
        // Verifica se tem indicadores de DESCENDENTE (seta pra baixo)
        if (iconClass.includes('sort-down') || 
            iconClass.includes('sort-desc') ||
            iconClass.includes('pi-sort-down') ||
            iconClass.includes('desc')) {
          isDescending = true;
          console.log('Auto-Expand: ⬇️ Detectou ordenação DESCENDENTE (seta pra baixo) no ícone!', icon);
          break;
        }
        
        // Verifica se tem indicadores de ascendente (seta pra cima)
        if (iconClass.includes('sort-up') || 
            iconClass.includes('sort-asc') ||
            iconClass.includes('pi-sort-up') ||
            iconClass.includes('asc') ||
            iconClass.includes('ascending')) {
          isAscending = true;
          console.log('Auto-Expand: ✅ Detectou ordenação ASCENDENTE (seta pra cima) no ícone!', icon);
          break;
        }
      }
      
      if (isAscending && !isDescending) {
        console.log('Auto-Expand: ✅ Coluna já está ordenada ASCENDENTE (seta pra cima)! NÃO vai clicar.');
        colunaJaProcessada = true;
        disponivelEmExpandido = true;
        return true;
      }
      
      if (isDescending) {
        console.log('Auto-Expand: ⬇️ Coluna está DESCENDENTE (seta pra baixo). Vai clicar!');
      }
      
      // Se não está ascendente, clica UMA VEZ
      console.log('Auto-Expand: 🎯 Coluna NÃO está ascendente. Clicando para ordenar...');
      
      try {
        ultimoClique = agora;
        header.click();
        
        // Aguarda 1 segundo e verifica se ficou ascendente
        setTimeout(() => {
          const iconsApos = header.querySelectorAll('i, svg, span, [class*="sort"], [class*="arrow"]');
          let ficouAscendente = false;
          
          for (const icon of iconsApos) {
            const iconClass = (icon.className || '').toLowerCase();
            // Verifica se tem sort-up ou sort-asc (indicadores específicos do PrimeNG)
            if (iconClass.includes('sort-up') || 
                iconClass.includes('sort-asc') ||
                iconClass.includes('pi-sort-up') ||
                (iconClass.includes('asc') && !iconClass.includes('desc'))) {
              ficouAscendente = true;
              break;
            }
          }
          
          if (ficouAscendente) {
            console.log('Auto-Expand: ✅ SUCESSO! Coluna agora está ASCENDENTE. Marcando como processada.');
            colunaJaProcessada = true;
            disponivelEmExpandido = true;
          } else {
            console.log('Auto-Expand: ⚠️ Após clicar, ainda não está ascendente. Pode precisar de outro clique.');
            // Permite tentar novamente após o cooldown
          }
        }, 1000);
        
        console.log('Auto-Expand: ✅ Clicou no header!');
        return true;
      } catch (error) {
        console.log('Auto-Expand: ⚠️ Erro ao clicar no header:', error);
      }
      
      break; // Encontrou a coluna, para de procurar
    }
  }
  
  console.log('Auto-Expand: ⚠️ Coluna "Disponível em" não encontrada');
  return false;
}

// Observer para detectar quando a tabela carregar
let tableObserverTriggered = false;
const tableObserver = new MutationObserver(() => {
  // Só funciona se a opção estiver ativada
  if (!autoSortEnabled) return;
  
  // Só dispara uma vez quando a tabela carregar
  if (tableObserverTriggered || colunaJaProcessada) return;
  
  // Procura pela tabela de alertas
  const hasTable = document.querySelector('table, thead, th, [role="table"]');
  
  if (hasTable) {
    console.log('Auto-Expand: 📊 Tabela detectada! Tentando expandir...');
    tableObserverTriggered = true;
    setTimeout(() => {
      expandirDisponivelEm();
    }, 800);
    
    // Reseta após 10 segundos (caso a página mude completamente)
    setTimeout(() => {
      if (!colunaJaProcessada) {
        tableObserverTriggered = false;
      }
    }, 10000);
  }
});

tableObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Observer para detectar mudanças de URL (Single Page Application)
let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    console.log('Auto-Expand: 🔄 URL mudou! Resetando estado...');
    lastUrl = location.href;
    
    // Reseta os estados para permitir reordenar na nova página
    colunaJaProcessada = false;
    tableObserverTriggered = false;
    disponivelEmExpandido = false;
    
    // Tenta ordenar na nova página após um delay
    setTimeout(() => {
      if (autoSortEnabled) {
        expandirDisponivelEm();
      }
    }, 1500);
  }
});

urlObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Escuta eventos de navegação (popstate, pushState, replaceState)
window.addEventListener('popstate', () => {
  console.log('Auto-Expand: 🔄 Navegação detectada (popstate)! Resetando...');
  colunaJaProcessada = false;
  tableObserverTriggered = false;
  disponivelEmExpandido = false;
  
  setTimeout(() => {
    if (autoSortEnabled) expandirDisponivelEm();
  }, 1500);
});

// Intercepta pushState e replaceState do Angular/React
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
  originalPushState.apply(this, arguments);
  console.log('Auto-Expand: 🔄 pushState detectado! Resetando...');
  colunaJaProcessada = false;
  tableObserverTriggered = false;
  disponivelEmExpandido = false;
  
  setTimeout(() => {
    if (autoSortEnabled) expandirDisponivelEm();
  }, 1500);
};

history.replaceState = function() {
  originalReplaceState.apply(this, arguments);
  console.log('Auto-Expand: 🔄 replaceState detectado! Resetando...');
  colunaJaProcessada = false;
  tableObserverTriggered = false;
  disponivelEmExpandido = false;
  
  setTimeout(() => {
    if (autoSortEnabled) expandirDisponivelEm();
  }, 1500);
};

// Verificação periódica MUITO LEVE - só se ainda não processou com sucesso e a opção está ativa
setInterval(() => {
  if (autoSortEnabled && !colunaJaProcessada && !tableObserverTriggered) {
    expandirDisponivelEm();
  }
}, 20000); // Verifica a cada 20 segundos (bem espaçado)

// Tentativas iniciais ao carregar a página - apenas 2 tentativas (só se a opção estiver ativa)
setTimeout(() => {
  if (autoSortEnabled && !colunaJaProcessada) expandirDisponivelEm();
}, 1500);

setTimeout(() => {
  if (autoSortEnabled && !colunaJaProcessada) expandirDisponivelEm();
}, 3500);

console.log('📋 Auto-Expand: Sistema carregado!');

// ============================================================
// FUNÇÃO DE DEBUG - Execute no console: debugOfflineButton()
// ============================================================
window.debugOfflineButton = function() {
  console.log('🔍 DEBUG: Procurando todos os elementos que contêm "Offline"...');
  
  const allElements = document.querySelectorAll('*');
  let found = [];
  
  for (const el of allElements) {
    if (!el.offsetParent) continue; // ignora invisíveis
    
    const text = el.textContent?.trim().toLowerCase() || '';
    if (text.includes('offline')) {
      const info = {
        element: el,
        tag: el.tagName,
        classes: el.className,
        id: el.id,
        text: el.textContent?.trim().substring(0, 50),
        clickable: el.tagName === 'BUTTON' || el.onclick !== null || el.style.cursor === 'pointer',
        parent: el.parentElement?.tagName,
        parentClasses: el.parentElement?.className
      };
      found.push(info);
      console.log('📍 Elemento encontrado:', info);
      
      // Mostra também os pais até 3 níveis acima
      let parent = el.parentElement;
      let level = 1;
      while (parent && level <= 3) {
        console.log(`  ↳ Pai nível ${level}:`, parent.tagName, parent.className || '(sem classe)');
        parent = parent.parentElement;
        level++;
      }
    }
  }
  
  console.log(`\n✅ Total encontrado: ${found.length} elementos`);
  console.log('\n💡 Dica: Inspecione os elementos acima para identificar qual é o botão/toggle');
  console.log('\n🔧 Procure por:');
  console.log('   - <label> ou <button> nos pais');
  console.log('   - Elementos com classe "toggle", "switch", "btn"');
  console.log('   - Elementos com role="switch" ou role="button"');
  
  return found;
};

console.log('💡 Para debug, execute no console: debugOfflineButton()');

// ============================================================
// REMOVEDOR DE MODALS/DIMERS INDESEJADOS
// Remove automaticamente elementos div.ajs-dimmer e div.ajs-modal
// que aparecem como popups/overlays indesejados
// ============================================================

function removerElementosIndesejados() {
  // ⚠️ NÃO remove elementos se estiver na tela de APLICAR GESTÃO
  const isAplicarGestaoScreen = document.body.textContent.includes('APLICAR GESTÃO') || 
                                 document.body.textContent.includes('APLICAR GESTAO') ||
                                 document.body.textContent.includes('Caso o motorista informado');
  
  if (isAplicarGestaoScreen) {
    // console.log('🛡️ Removedor: Tela de APLICAR GESTÃO detectada, não vai remover nada');
    return 0;
  }
  
  // Lista de seletores para remover
  const seletoresParaRemover = [
    'div.ajs-dimmer',
    'div.ajs-modal',
    '.ajs-dimmer',
    '.ajs-modal',
    '[class*="ajs-dimmer"]',
    '[class*="ajs-modal"]'
  ];
  
  let removidos = 0;
  
  seletoresParaRemover.forEach(seletor => {
    const elementos = document.querySelectorAll(seletor);
    elementos.forEach(el => {
      if (el && el.parentNode) {
        // ⚠️ PROTEÇÃO: NUNCA remover popups de motorista ou invalidar!
        const elText = el.textContent || '';
        const isMotoristaPopup = 
          (elText.includes('Motorista') || elText.includes('motorista')) &&
          (elText.includes('tem certeza') || elText.includes('deseja informar'));
        
        const isInvalidarPopup = elText.includes('invalidar');
        
        if (isMotoristaPopup) {
          console.log('🛡️ Removedor: Popup de MOTORISTA detectado, NÃO VAI REMOVER!');
          return; // PULA este elemento
        }
        
        if (isInvalidarPopup) {
          console.log('🛡️ Removedor: Popup de INVALIDAR detectado, NÃO VAI REMOVER!');
          return; // PULA este elemento
        }
        
        console.log(`🗑️ Removedor: Elemento "${seletor}" removido!`, el);
        el.remove();
        removidos++;
      }
    });
  });
  
  if (removidos > 0) {
    console.log(`✅ Removedor: Total de ${removidos} elemento(s) removido(s)`);
  }
  
  return removidos;
}

// Observer para detectar e remover elementos assim que aparecerem
const removerObserver = new MutationObserver((mutations) => {
  // ⚠️ NÃO remove elementos se estiver na tela de APLICAR GESTÃO
  const isAplicarGestaoScreen = document.body.textContent.includes('APLICAR GESTÃO') || 
                                 document.body.textContent.includes('APLICAR GESTAO') ||
                                 document.body.textContent.includes('Caso o motorista informado');
  
  if (isAplicarGestaoScreen) {
    return; // Não faz nada
  }
  
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // ⚠️ PROTEÇÃO: NUNCA remover popups de motorista ou invalidar!
        const nodeText = node.textContent || '';
        const isMotoristaPopup = 
          (nodeText.includes('Motorista') || nodeText.includes('motorista')) &&
          (nodeText.includes('tem certeza') || nodeText.includes('deseja informar'));
        
        const isInvalidarPopup = nodeText.includes('invalidar');
        
        if (isMotoristaPopup) {
          console.log('🛡️ Removedor: Popup de MOTORISTA detectado, NÃO VAI REMOVER!');
          continue; // PULA este elemento
        }
        
        if (isInvalidarPopup) {
          console.log('🛡️ Removedor: Popup de INVALIDAR detectado, NÃO VAI REMOVER!');
          continue; // PULA este elemento
        }
        
        // Verifica se o próprio elemento é um dimmer ou modal
        const classes = node.className || '';
        if (typeof classes === 'string' && 
            (classes.includes('ajs-dimmer') || classes.includes('ajs-modal'))) {
          console.log('🗑️ Removedor: Elemento indesejado detectado imediatamente!', node);
          node.remove();
          continue;
        }
        
        // Verifica se contém elementos dimmer/modal dentro
        const dimmers = node.querySelectorAll ? node.querySelectorAll('.ajs-dimmer, .ajs-modal, [class*="ajs-dimmer"], [class*="ajs-modal"]') : [];
        if (dimmers.length > 0) {
          // Verifica cada dimmer individualmente para não remover popups de motorista
          let removidos = 0;
          dimmers.forEach(dimmer => {
            const dimmerText = dimmer.textContent || '';
            const isDimmerMotorista = 
              (dimmerText.includes('Motorista') || dimmerText.includes('motorista')) &&
              (dimmerText.includes('tem certeza') || dimmerText.includes('deseja informar'));
            
            if (!isDimmerMotorista) {
              dimmer.remove();
              removidos++;
            } else {
              console.log('🛡️ Removedor: Dimmer de MOTORISTA detectado, NÃO VAI REMOVER!');
            }
          });
          
          if (removidos > 0) {
            console.log(`🗑️ Removedor: ${removidos} elemento(s) indesejado(s) removido(s) (ignorou motorista)`);
          }
        }
      }
    }
  }
});

// Inicia observação
removerObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Remove elementos existentes ao carregar
setTimeout(() => {
  console.log('🔍 Removedor: Verificando elementos indesejados na página...');
  removerElementosIndesejados();
}, 1000);

// Verificação periódica (a cada 3 segundos)
setInterval(() => {
  removerElementosIndesejados();
}, 3000);

console.log('📋 Removedor: Sistema de remoção automática ativado!');

// ============================================================
// AUTO-APLICAR GESTÃO
// Detecta o botão "APLICAR GESTÃO" e força o clique se necessário
// ============================================================

// Observer para detectar quando o botão "APLICAR GESTÃO" aparece
const aplicarGestaoObserver = new MutationObserver(() => {
  // Procura pelo botão "APLICAR GESTÃO"
  const buttons = document.querySelectorAll('button, .btn, [role="button"]');
  
  for (const btn of buttons) {
    const text = btn.textContent?.trim().toLowerCase() || '';
    
    if (text.includes('aplicar gestão') || text.includes('aplicar gestao')) {
      // Se o botão existe mas ainda não foi "instrumentado"
      if (!btn.dataset.gestaoInstrumentado) {
        console.log('🎯 Auto-Gestão: Botão "APLICAR GESTÃO" encontrado!', btn);
        
        // Marca como instrumentado para não processar novamente
        btn.dataset.gestaoInstrumentado = 'true';
        
        // Adiciona um listener de clique para debug
        btn.addEventListener('click', (e) => {
          console.log('🖱️ Auto-Gestão: Botão "APLICAR GESTÃO" clicado!');
          console.log('🖱️ Auto-Gestão: Event:', e);
          console.log('🖱️ Auto-Gestão: Botão disabled?', btn.disabled);
          console.log('🖱️ Auto-Gestão: Botão classes:', btn.className);
          
          // Se o botão estiver desabilitado, força habilitar e clica novamente
          if (btn.disabled) {
            console.log('⚠️ Auto-Gestão: Botão estava desabilitado! Habilitando...');
            btn.disabled = false;
            
            setTimeout(() => {
              console.log('🔄 Auto-Gestão: Clicando novamente após habilitar...');
              btn.click();
            }, 100);
          }
        });
        
        // Verifica periodicamente se o botão ficou desabilitado e força habilitar
        const checkInterval = setInterval(() => {
          if (btn.offsetParent === null) {
            // Botão foi removido da página, para de verificar
            clearInterval(checkInterval);
            return;
          }
          
          // Se o botão estiver desabilitado sem motivo aparente
          if (btn.disabled) {
            const motoristaNome = document.querySelector('input[placeholder*="motorista"], input[placeholder*="Motorista"]');
            
            // Se tem um nome de motorista preenchido, habilita o botão
            if (motoristaNome && motoristaNome.value && motoristaNome.value.trim().length > 3) {
              console.log('⚡ Auto-Gestão: Botão desabilitado mas motorista preenchido! Habilitando...');
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.style.cursor = 'pointer';
            }
          }
        }, 500);
      }
    }
  }
});

aplicarGestaoObserver.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('📋 Auto-Gestão: Sistema de auto-aplicação ativado!');

// ============================================================
// DEBUG - APLICAR GESTÃO
// Função para debugar problemas com o botão "APLICAR GESTÃO"
// Execute no console: debugAplicarGestao()
// ============================================================
window.debugAplicarGestao = function() {
  console.log('🔍 DEBUG: Procurando botão "APLICAR GESTÃO"...');
  console.log('═══════════════════════════════════════════════════\n');
  
  const allButtons = document.querySelectorAll('button, .btn, [role="button"]');
  let found = [];
  
  console.log(`📊 Total de botões na página: ${allButtons.length}\n`);
  
  for (const btn of allButtons) {
    const text = btn.textContent?.trim().toLowerCase() || '';
    
    if (text.includes('aplicar') || text.includes('gestão') || text.includes('gestao')) {
      const rect = btn.getBoundingClientRect();
      const isVisible = btn.offsetParent !== null && rect.height > 0 && rect.width > 0;
      
      const info = {
        element: btn,
        text: btn.textContent?.trim() || '(sem texto)',
        tag: btn.tagName,
        type: btn.type,
        classes: btn.className || '(sem classe)',
        id: btn.id || '(sem id)',
        disabled: btn.disabled,
        visible: isVisible,
        onclick: btn.onclick !== null,
        position: {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        styles: {
          display: window.getComputedStyle(btn).display,
          opacity: window.getComputedStyle(btn).opacity,
          cursor: window.getComputedStyle(btn).cursor,
          pointerEvents: window.getComputedStyle(btn).pointerEvents
        }
      };
      
      found.push(info);
      
      console.log('═══════════════════════════════════════════════════');
      console.log(`✅ BOTÃO ENCONTRADO #${found.length}`);
      console.log('═══════════════════════════════════════════════════');
      console.log('📝 Texto:', info.text);
      console.log('🏷️  Tag:', info.tag);
      console.log('🎨 Classes:', info.classes);
      console.log('🆔 ID:', info.id);
      console.log('🚫 Disabled:', info.disabled ? '❌ SIM' : '✅ NÃO');
      console.log('👁️  Visível:', info.visible ? '✅ SIM' : '❌ NÃO');
      console.log('🖱️  OnClick:', info.onclick ? '✅ SIM' : '❌ NÃO');
      console.log('\n📍 POSIÇÃO:');
      console.log('   Top:', info.position.top + 'px');
      console.log('   Left:', info.position.left + 'px');
      console.log('   Width:', info.position.width + 'px');
      console.log('   Height:', info.position.height + 'px');
      console.log('\n🎭 ESTILOS:');
      console.log('   Display:', info.styles.display);
      console.log('   Opacity:', info.styles.opacity);
      console.log('   Cursor:', info.styles.cursor);
      console.log('   Pointer Events:', info.styles.pointerEvents);
      console.log('\n🔧 ELEMENTO:');
      console.log(btn);
      console.log('\n');
    }
  }
  
  console.log('═══════════════════════════════════════════════════');
  console.log(`\n✅ RESUMO: ${found.length} botão(ões) encontrado(s)\n`);
  
  if (found.length === 0) {
    console.log('❌ Nenhum botão "APLICAR GESTÃO" encontrado!');
  } else {
    console.log('💡 TESTE DE CLIQUE:');
    found.forEach((info, index) => {
      console.log(`\n   Para testar o botão #${index + 1}, execute:`);
      console.log(`   document.querySelectorAll('button')[${Array.from(document.querySelectorAll('button')).indexOf(info.element)}].click()`);
    });
  }
  
  console.log('\n═══════════════════════════════════════════════════\n');
  
  return found;
};

console.log('💡 DEBUG: Para debugar "APLICAR GESTÃO", execute: debugAplicarGestao()');

// ============================================================
// FUNCIONALIDADE DE CAPTURA DE PRINTS E DOWNLOAD DE VÍDEO
// Adaptado para funcionar com os vídeos do Creare
// Criado por Douglas G.
// ============================================================

// Verifica se a funcionalidade de vídeo já foi inicializada
let videoFunctionalityInitialized = false;

// Observador de vídeos para detectar players
function observarVideos() {
  if (videoFunctionalityInitialized) return;
  videoFunctionalityInitialized = true;
  
  console.log('🎥 Iniciando observador de vídeos do Creare...');
  
  // Detecta vídeos já presentes
  detectarEMelhorarVideos();
  
  // Observa novos vídeos adicionados
  const observerVideo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === 'VIDEO') {
            setTimeout(() => melhorarVideo(node), 300);
          } else if (node.querySelector) {
            const videos = node.querySelectorAll('video');
            videos.forEach(video => {
              setTimeout(() => melhorarVideo(video), 300);
            });
          }
        }
      }
    }
  });
  
  observerVideo.observe(document.body, { childList: true, subtree: true });
  
  // Verificação periódica para garantir que não perca nenhum vídeo
  // OTIMIZADO: Limitar tentativas para evitar acúmulo de recursos
  let tentativasVideos = 0;
  const maxTentativasVideos = 30; // 90 segundos total (30 x 3s)
  const intervalVideos = setInterval(() => {
    detectarEMelhorarVideos();
    tentativasVideos++;
    if (tentativasVideos >= maxTentativasVideos) {
      clearInterval(intervalVideos);
      console.log('✅ Verificação periódica de vídeos finalizada após', maxTentativasVideos, 'tentativas');
    }
  }, 3000);
}

// Detecta todos os vídeos na página e adiciona funcionalidade
function detectarEMelhorarVideos() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (!video.dataset.creareVideoProcessed) {
      melhorarVideo(video);
    }
  });
}

// Adiciona controles personalizados e botão de print ao vídeo
function melhorarVideo(video) {
  if (!video || video.dataset.creareVideoProcessed) return;
  
  video.dataset.creareVideoProcessed = 'true';
  console.log('🎥 Melhorando vídeo:', video.src || video.currentSrc);
  
  // Configurar CORS ANTES do vídeo carregar (crítico!)
  // Isso permite que o canvas leia os pixels do vídeo
  if (!video.hasAttribute('crossorigin')) {
    const currentSrc = video.currentSrc || video.src;
    video.setAttribute('crossorigin', 'anonymous');
    // Se já tem src, precisa recarregar para aplicar crossorigin
    if (currentSrc) {
      video.load();
    }
  }
  
  // Procura pelo container do vídeo
  let container = video.parentElement;
  while (container && !container.classList.contains('video-container') && container !== document.body) {
    container = container.parentElement;
  }
  
  if (!container || container === document.body) {
    container = video.parentElement;
  }
  
  // Cria botão de print (capturar frame)
  const printButton = document.createElement('button');
  printButton.className = 'creare-video-print-btn';
  printButton.innerHTML = '📷 Print';
  printButton.title = 'Capturar frame do vídeo (P)';
  printButton.type = 'button';
  
  printButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 145px;
    z-index: 1000;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 9px 14px;
    border-radius: 7px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
  `;
  
  // Cria botão de download do vídeo
  const downloadButton = document.createElement('button');
  downloadButton.className = 'creare-video-download-btn';
  downloadButton.innerHTML = '⬇️ Baixar Vídeo';
  downloadButton.title = 'Baixar vídeo completo';
  downloadButton.type = 'button';
  
  downloadButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    border: none;
    padding: 9px 14px;
    border-radius: 7px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
  `;
  
  printButton.addEventListener('mouseenter', () => {
    printButton.style.transform = 'translateY(-2px) scale(1.05)';
    printButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
  });
  
  printButton.addEventListener('mouseleave', () => {
    printButton.style.transform = 'translateY(0) scale(1)';
    printButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  });
  
  downloadButton.addEventListener('mouseenter', () => {
    downloadButton.style.transform = 'translateY(-2px) scale(1.05)';
    downloadButton.style.boxShadow = '0 6px 20px rgba(17, 153, 142, 0.5)';
  });
  
  downloadButton.addEventListener('mouseleave', () => {
    downloadButton.style.transform = 'translateY(0) scale(1)';
    downloadButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  });
  
  // Função para capturar frame desenhando vídeo direto no canvas
  printButton.addEventListener('click', async () => {
    try {
      console.log('📸 Iniciando captura de frame do vídeo...');
      
      // Verifica se o vídeo está pronto
      if (video.readyState < 2) {
        throw new Error('Vídeo ainda não carregou. Aguarde.');
      }
      
      // Pausar o vídeo para captura
      const wasPlaying = !video.paused;
      if (wasPlaying) {
        video.pause();
      }
      
      // Feedback visual
      const originalContent = printButton.innerHTML;
      printButton.innerHTML = '⏳ Capturando...';
      printButton.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
      
      // Aguardar um frame
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('📸 Desenhando vídeo no canvas...');
      
      // Obter dimensões nativas do vídeo
      const videoWidth = video.videoWidth || 1280;
      const videoHeight = video.videoHeight || 720;
      
      console.log('📸 Dimensões do vídeo:', { videoWidth, videoHeight });
      
      // Criar canvas com dimensões nativas
      const canvas = document.createElement('canvas');
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      
      // Desenhar o vídeo diretamente no canvas
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      console.log('📸 Frame capturado, gerando blob...');
      
      // Converter para blob e fazer download E copiar
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('❌ Blob não gerado - possível problema de CORS');
          
          printButton.innerHTML = '❌ Erro CORS';
          printButton.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
          
          setTimeout(() => {
            printButton.innerHTML = originalContent;
            printButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          }, 3000);
          return;
        }
        
        console.log('📸 Blob gerado, tamanho:', (blob.size / 1024).toFixed(2), 'KB');
        
        // ✅ COPIAR para área de transferência
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          console.log('📋 Imagem copiada para área de transferência!');
        } catch (errClipboard) {
          console.warn('⚠️ Não foi possível copiar para área de transferência:', errClipboard);
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Nome do arquivo com timestamp e tempo do vídeo
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const videoTime = Math.floor(video.currentTime);
        a.href = url;
        a.download = `creare-video-${timestamp}-${videoTime}s.png`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Feedback de sucesso
        printButton.innerHTML = '✅ Capturado!';
        printButton.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        
        setTimeout(() => {
          printButton.innerHTML = originalContent;
          printButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 2000);
        
        console.log('✅ Frame capturado, salvo e copiado! Arquivo:', a.download);
        
        // Retomar reprodução
        if (wasPlaying) {
          setTimeout(() => video.play(), 300);
        }
      }, 'image/png', 0.95);
      
    } catch (erro) {
      console.error('❌ Erro ao capturar frame:', erro);
      
      const errorMsg = erro.message || 'Erro desconhecido';
      printButton.innerHTML = '❌ ' + (errorMsg.length > 20 ? 'Erro' : errorMsg);
      printButton.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
      
      setTimeout(() => {
        printButton.innerHTML = '📷 Print';
        printButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }, 3000);
    }
  });
  
  // Função para baixar o vídeo
  downloadButton.addEventListener('click', async () => {
    try {
      const originalContent = downloadButton.innerHTML;
      downloadButton.innerHTML = '🔍 Procurando...';
      downloadButton.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
      
      console.log('⬇️ Procurando botão de download nativo...');
      
      let nativeDownloadButton = null;
      
      // Procura por app-download-button próximo ao vídeo
      const videoContainer = video.closest('div');
      
      if (videoContainer) {
        const appDownloadComponent = videoContainer.querySelector('app-download-button');
        
        if (appDownloadComponent) {
          console.log('✅ Componente app-download-button encontrado');
          
          const internalButton = appDownloadComponent.querySelector('button, a, span[role="button"], [role="button"]');
          
          if (internalButton) {
            nativeDownloadButton = internalButton;
          } else {
            nativeDownloadButton = appDownloadComponent;
          }
        }
      }
      
      // Procura em containers pais
      if (!nativeDownloadButton) {
        let currentElement = video;
        let depth = 0;
        
        while (currentElement && depth < 5) {
          currentElement = currentElement.parentElement;
          depth++;
          
          if (currentElement) {
            const appDownloadComponent = currentElement.querySelector('app-download-button');
            
            if (appDownloadComponent) {
              const internalButton = appDownloadComponent.querySelector('button, a, span[role="button"], [role="button"]');
              
              if (internalButton) {
                nativeDownloadButton = internalButton;
              } else {
                nativeDownloadButton = appDownloadComponent;
              }
              break;
            }
          }
        }
      }
      
      if (nativeDownloadButton) {
        console.log('🎯 Clicando no botão nativo...');
        
        downloadButton.innerHTML = '⬇️ Baixando...';
        
        // Dispara eventos de clique
        nativeDownloadButton.click();
        
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        
        nativeDownloadButton.dispatchEvent(mouseDownEvent);
        nativeDownloadButton.dispatchEvent(mouseUpEvent);
        nativeDownloadButton.dispatchEvent(clickEvent);
        
        downloadButton.innerHTML = '✅ Download iniciado!';
        downloadButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        setTimeout(() => {
          downloadButton.innerHTML = originalContent;
          downloadButton.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        }, 2000);
        
        console.log('✅ Download do vídeo iniciado');
        
      } else {
        // Fallback: download direto
        console.warn('⚠️ Botão nativo não encontrado, usando download direto...');
        downloadButton.innerHTML = '⚠️ Baixando direto...';
        
        const videoUrl = video.src || video.currentSrc;
        
        if (!videoUrl) {
          throw new Error('URL do vídeo não encontrada');
        }
        
        const response = await fetch(videoUrl);
        if (!response.ok) {
          throw new Error('Erro ao baixar vídeo: ' + response.status);
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `creare-video-${timestamp}.mp4`;
        
        a.href = url;
        a.download = fileName;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        downloadButton.innerHTML = '✅ Baixado!';
        downloadButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        setTimeout(() => {
          downloadButton.innerHTML = originalContent;
          downloadButton.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        }, 2000);
        
        console.log('⚠️ Vídeo baixado direto');
      }
      
    } catch (erro) {
      console.error('❌ Erro ao baixar vídeo:', erro);
      
      downloadButton.innerHTML = '❌ Erro';
      downloadButton.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
      
      setTimeout(() => {
        downloadButton.innerHTML = '⬇️ Baixar Vídeo';
        downloadButton.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      }, 3000);
    }
  });
  
  // Garante que o container tenha position relative
  if (container && window.getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }
  
  // Adiciona os botões ao container
  if (container) {
    container.appendChild(printButton);
    container.appendChild(downloadButton);
    console.log('✅ Botões de captura e download adicionados ao vídeo');
  }
  
  // Atalho de teclado "P" para capturar
  video.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      printButton.click();
    }
  });
}

// Inicializa o observador de vídeos quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observarVideos);
} else {
  observarVideos();
}

console.log('✅ Funcionalidade de captura de vídeos carregada no Creare!');

// ============================================================
// FIM DA FUNCIONALIDADE DE VÍDEO
// ============================================================

} // Fim da trava de segurança (site da Creare)
