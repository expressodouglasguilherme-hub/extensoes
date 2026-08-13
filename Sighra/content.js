// ============================================================
// Sighra - Colinha  |  por Douglas G.
// Copia as informacoes da infracao organizadas + barra de
// colar tratativas (conforme o Motivo selecionado).
// ============================================================

console.log('📋 Sighra - Colinha carregada!');

// ------------------------------------------------------------
// Campos da infracao (ordem + emoji para a copia organizada)
// ------------------------------------------------------------
const CAMPOS = [
  { label: 'Infração',            emoji: '🚨' },
  { label: 'Criticidade',         emoji: '⚠️' },
  { label: 'Veículo',             emoji: '🚚' },
  { label: 'Placa',               emoji: '🔖' },
  { label: 'Data de Geração',     emoji: '📅' },
  { label: 'Status',              emoji: '📊' },
  { label: 'Primeiro Evento',     emoji: '▶️' },
  { label: 'Último Evento',       emoji: '⏹️' },
  { label: 'Visualizado em',      emoji: '👁️' },
  { label: 'Visualizado por',     emoji: '🧑' },
  { label: 'Última Atualização',  emoji: '🔄' },
  { label: 'Operador',            emoji: '🧑‍💼' }
];

// ------------------------------------------------------------
// Tratativas por Motivo  (rotulo curto + texto completo)
// ------------------------------------------------------------
const MOTIVOS = {
  Atencao: [
    { rotulo: 'Desatenção',   texto: 'Reportado para a operação. Condutor demonstrando desatenção ao ambiente de condução, desviando o foco da direção. Reforçar orientação sobre direção defensiva e foco total na condução.' },
    { rotulo: 'Alimentação',  texto: 'Reportado para a operação. Condutor identificado realizando alimentação durante a condução, o que compromete a atenção e o controle do veículo. Reforçar as diretrizes de segurança operacional.' },
    { rotulo: 'Rádio',        texto: 'Reportado para a operação. Foi identificado que o motorista está utilizando o rádio durante a condução em rodovia, sem necessidade aparente, o que vai contra a recomendação de uso apenas em cenários oportunos, como em estradas de terra. Essa condição compromete a capacidade de reação e aumenta significativamente o risco de acidentes.' }
  ],
  Ausencia: [
    { rotulo: 'Câmera Deslocada', texto: 'Reportado para a operação. Câmera identificada em posição desajustada ou deslocada, prejudicando a visualização adequada do condutor. Necessário ajuste imediato do equipamento para restabelecer o correto enquadramento e garantir a eficácia do monitoramento.' },
    { rotulo: 'Escurecimento',    texto: 'Reportado para a operação. Imagem da câmera apresenta escurecimento excessivo, dificultando a visualização adequada do condutor.' },
    { rotulo: 'Falha/Defeito',    texto: 'Reportado para a operação. Câmera do veículo apresentando falha/defeito, comprometendo a qualidade das imagens captadas.' },
    { rotulo: 'Máscara/Balaclava', texto: 'Reportado para a operação. Condutor identificado utilizando máscara/balaclava cobrindo totalmente o rosto, impossibilitando a identificação facial e o monitoramento de fadiga.' }
  ],
  Bocejo: [
    { rotulo: 'Bocejo 1x',  texto: 'Bocejo - Monitorado 1x' },
    { rotulo: 'Bocejo 2x',  texto: 'Bocejo - Monitorado 2x' },
    { rotulo: 'Recorrente', texto: 'Reportado para a operação. Condutor identificado bocejando de forma recorrente durante a condução, caracterizando indícios de sonolência.' }
  ],
  Conduta: [
    { rotulo: 'Câmera Coberta',     texto: 'Reportado para a operação. Câmera coberta, sem visualização de imagens. A ação infringe as normas de segurança da empresa e deve ser avaliada conforme a política disciplinar vigente.' },
    { rotulo: 'Manipulando Câmera', texto: 'Reportado para a operação. Condutor identificado manipulando a câmera de monitoramento, comprometendo a captação adequada das imagens. A ação infringe as normas de segurança da empresa e deve ser avaliada conforme a política disciplinar vigente.' },
    { rotulo: 'Gestos Obscenos',    texto: 'Reportado para a operação. Foi identificado que o motorista ao conduzir o veículo realizou gestos obscenos durante a sua condução, agindo sem ética. Essa conduta compromete a segurança operacional e vai contra as diretrizes da gestão de consequência.' },
    { rotulo: 'Celular',            texto: 'Reportado para a operação. Condutor identificado utilizando aparelho celular durante a condução, desrespeitando as normas internas de segurança e infringindo as diretrizes da empresa quanto ao comportamento em operação.' },
    { rotulo: 'Cigarro',            texto: 'Reportado para a operação. Motorista fumando durante sua condução. Infringindo as normas da Empresa.' },
    { rotulo: 'Sem Cinto',          texto: 'Reportado para a operação. Condutor identificado sem o cinto de segurança ou utilizando-o de forma incorreta, infringindo normas de segurança e legislação vigente. Reforçar obrigatoriedade do uso adequado do cinto em todas as viagens.' },
    { rotulo: 'Caroneiro s/ Cinto', texto: 'Reportado para a operação. Caroneiro identificado sem o uso do cinto de segurança, colocando em risco sua integridade física e infringindo normas de segurança da empresa.' },
    { rotulo: 'Cinto em movimento', texto: 'Reportado para a operação, condutor colocou o cinto de segurança com a frota em movimento.' }
  ],
  N1: [
    { rotulo: 'N1 - Parada 30min', texto: 'Reportado para a operação. Foi identificada sonolência de N1 no condutor. Orienta-se a parada imediata por 30 minutos para descanso.' }
  ],
  N2: [
    { rotulo: 'N2 - Parada 60min', texto: 'Reportado para a operação. Foi identificada sonolência de N2 no condutor, com sinais moderados a intensos de fadiga. Orienta-se a parada imediata por 60 minutos para repouso, priorizando a segurança.' }
  ],
  Invalidar: [
    { rotulo: 'Teste/Manutenção', texto: 'Alerta gerado durante teste/manutenção do equipamento. Registro invalidado.' }
  ],
  Invalido: [
    { rotulo: 'Falso Positivo', texto: 'Alerta classificado como inválido - falso positivo.' }
  ]
};

const COR_BOTOES = [
  '#e74c3c', '#e67e22', '#f39c12', '#16a085',
  '#2980b9', '#8e44ad', '#c0392b', '#27ae60', '#2c3e50'
];

// Retorna as tratativas de acordo com o texto do Motivo selecionado
function getTratativas(motivo) {
  const m = (motivo || '').toLowerCase();
  if (!m || m.includes('selecione')) return [];
  if (m.includes('falso positivo') || m.includes('inválido') || m.includes('invalido')) return MOTIVOS.Invalido;
  if (m.includes('invalidar') || m.includes('manutenç') || m.includes('manutenc') || m.includes('teste')) return MOTIVOS.Invalidar;
  if (m.includes('n2') || m.includes('60 min')) return MOTIVOS.N2;
  if (m.includes('n1') || m.includes('30 min')) return MOTIVOS.N1;
  if (m.includes('bocejo')) return MOTIVOS.Bocejo;
  if (m.includes('atenç') || m.includes('atenc')) return MOTIVOS.Atencao;
  if (m.includes('ausência') || m.includes('ausencia') || m.includes('deslocada')) return MOTIVOS.Ausencia;
  if (m.includes('conduta') || m.includes('consequ')) return MOTIVOS.Conduta;
  return [];
}

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------

// Pega apenas o texto direto do elemento (ignora texto dos filhos)
function getOwnText(el) {
  let t = '';
  for (const n of el.childNodes) {
    if (n.nodeType === Node.TEXT_NODE) t += n.textContent;
  }
  return t.trim();
}

// Copia texto - com fallback para sites HTTP (contexto nao seguro)
function copiarTexto(texto) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(resolve).catch(() => fallback());
    } else {
      fallback();
    }
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.left = '-9999px';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      try {
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('execCommand falhou'));
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    }
  });
}

// Cola texto em um campo (input/textarea) de forma compativel com frameworks
function colarNoCampo(campo, texto) {
  const proto = campo.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(campo, texto);
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  campo.dispatchEvent(new Event('change', { bubbles: true }));
  campo.dispatchEvent(new Event('keyup', { bubbles: true }));
  campo.focus();
}

// Encontra o painel que contem as informacoes da infracao
function acharPainel() {
  const labelSet = new Set(CAMPOS.map(c => c.label));
  let best = null, bestCount = 0, bestSize = Infinity;

  document.querySelectorAll('body *').forEach(el => {
    const seen = new Set();
    el.querySelectorAll('*').forEach(d => {
      const t = getOwnText(d);
      if (labelSet.has(t)) seen.add(t);
    });
    const count = seen.size;
    if (count < 4) return;
    const size = el.querySelectorAll('*').length;
    if (count > bestCount || (count === bestCount && size < bestSize)) {
      bestCount = count;
      bestSize = size;
      best = el;
    }
  });

  return best;
}

// Coleta TODOS os pedacos de texto (incluindo nós de texto puro) com
// suas posicoes na tela, usando Range para medir texto solto.
function coletarTextos(painel) {
  const itens = [];
  const walker = document.createTreeWalker(painel, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (p && (p.closest('.sighra-copiar-btn') || p.closest('.sighra-barra-tratativas') || p.closest('select'))) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let n;
  while ((n = walker.nextNode())) {
    const range = document.createRange();
    range.selectNodeContents(n);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    itens.push({ t: n.textContent.trim(), rect });
  }
  return itens;
}

// Extrai os pares label -> valor usando POSICAO na tela.
// Para cada rotulo, pega o texto que esta logo abaixo dele e
// alinhado a esquerda (como aparece visualmente). Funciona
// independente da ordem do HTML (grade de 2 colunas, etc).
function extrairDados(painel) {
  if (!painel) painel = acharPainel();
  if (!painel) return {};

  const labelSet = new Set(CAMPOS.map(c => c.label));
  const itens = coletarTextos(painel);
  const valores = {};

  CAMPOS.forEach(c => {
    const labelItem = itens.find(x => x.t === c.label);
    if (!labelItem) return;
    const lr = labelItem.rect;

    // procura o valor: texto NAO-rotulo, logo abaixo e alinhado a esquerda
    let melhor = null, melhorDist = Infinity;
    itens.forEach(x => {
      if (x === labelItem || labelSet.has(x.t)) return;
      const r = x.rect;
      const alinhado = Math.abs(r.left - lr.left) < 45;
      const abaixo = r.top >= lr.bottom - 6;
      if (alinhado && abaixo) {
        const dist = r.top - lr.bottom;
        if (dist < melhorDist && dist < 70) {
          melhorDist = dist;
          melhor = x;
        }
      }
    });

    if (melhor) valores[c.label] = melhor.t;
  });

  return valores;
}

// Monta o texto organizado (formato: emoji + rotulo numa linha,
// valor na linha de baixo, com espaco entre cada campo)
function montarTextoOrganizado(valores) {
  const linhas = [];
  CAMPOS.forEach(c => {
    if (valores[c.label]) {
      linhas.push(`${c.emoji} ${c.label}\n${valores[c.label]}`);
    }
  });
  return linhas.join('\n\n');
}

// ------------------------------------------------------------
// 1) Botao de COPIAR informacoes organizadas
// ------------------------------------------------------------
function adicionarBotaoCopiar() {
  if (document.querySelector('.sighra-copiar-btn')) return;

  const painel = acharPainel();
  if (!painel) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sighra-copiar-btn';
  btn.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M4 2h8a2 2 0 0 1 2 2v8M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M4 2v10a2 2 0 0 0 2 2h6"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Copiar</span>`;

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const painelAtual = acharPainel();
    if (!painelAtual) {
      alert('Não encontrei as informações da infração nesta tela.');
      return;
    }

    const valores = extrairDados(painelAtual);
    const texto = montarTextoOrganizado(valores);
    console.log('Dados extraídos:', valores);

    if (!texto) {
      alert('Não consegui extrair as informações.');
      return;
    }

    copiarTexto(texto).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Copiado!</span>';
      btn.classList.add('sighra-ok');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('sighra-ok');
      }, 2000);
      console.log('✓ Informações copiadas:\n', texto);
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      alert('Não foi possível copiar automaticamente. Copie manualmente:\n\n' + texto);
    });
  };

  if (window.getComputedStyle(painel).position === 'static') {
    painel.style.position = 'relative';
  }
  painel.appendChild(btn);
  console.log('✓ Botão Copiar adicionado.');
}

// ------------------------------------------------------------
// 2) Barra de COLAR TRATATIVAS (conforme o Motivo selecionado)
// ------------------------------------------------------------

// Acha o <select> do Motivo (pelas opcoes conhecidas)
function acharSelectMotivo() {
  const selects = Array.from(document.querySelectorAll('select'));
  for (const s of selects) {
    const texts = Array.from(s.options).map(o => (o.text || '').toLowerCase());
    if (texts.some(t => t.includes('orientar parada') || t === 'bocejo' || t.includes('falso positivo') || t.includes('consequência') || t.includes('consequencia'))) {
      return s;
    }
  }
  return null;
}

function acharTextareaObservacao() {
  const textareas = Array.from(document.querySelectorAll('textarea'));
  if (textareas.length === 0) return null;

  for (const ta of textareas) {
    const ph = (ta.placeholder || '').toLowerCase();
    if (ph.includes('observ')) return ta;
  }

  const labels = Array.from(document.querySelectorAll('label, span, div, td, th'));
  for (const lb of labels) {
    if (getOwnText(lb).toLowerCase().startsWith('observ')) {
      const container = lb.closest('div, td, tr, form, section') || lb.parentElement;
      if (container) {
        const ta = container.querySelector('textarea');
        if (ta) return ta;
      }
    }
  }

  return textareas.length === 1 ? textareas[0] : null;
}

// (Re)constroi os botoes da barra conforme o Motivo atual
function atualizarBotoesBarra(grupo, motivoSelect, textarea, forcar) {
  const motivo = motivoSelect && motivoSelect.selectedIndex >= 0
    ? motivoSelect.options[motivoSelect.selectedIndex].text
    : '';

  // Evita reconstruir se o motivo nao mudou (impede flicker e preserva feedback)
  if (!forcar && grupo.dataset.motivoAtual === motivo) return;
  grupo.dataset.motivoAtual = motivo;

  const tratativas = getTratativas(motivo);

  grupo.innerHTML = '';

  if (tratativas.length === 0) {
    const hint = document.createElement('span');
    hint.className = 'sighra-barra-hint';
    hint.textContent = 'Selecione o Motivo para ver as tratativas.';
    grupo.appendChild(hint);
    return;
  }

  tratativas.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sighra-trat-btn';
    btn.textContent = item.rotulo;
    btn.style.setProperty('--cor', COR_BOTOES[i % COR_BOTOES.length]);

    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      colarNoCampo(textarea, item.texto);

      const original = btn.textContent;
      btn.textContent = '✅ Colado!';
      btn.classList.add('sighra-ok');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('sighra-ok');
      }, 1400);
    });

    grupo.appendChild(btn);
  });
}

function adicionarBarraTratativas() {
  const textarea = acharTextareaObservacao();
  if (!textarea) return;

  const motivoSelect = acharSelectMotivo();

  let barra = document.querySelector('.sighra-barra-tratativas');

  // Cria a barra uma vez
  if (!barra) {
    barra = document.createElement('div');
    barra.className = 'sighra-barra-tratativas';

    const titulo = document.createElement('div');
    titulo.className = 'sighra-barra-titulo';
    titulo.textContent = '📋 Colar tratativa:';
    barra.appendChild(titulo);

    const grupo = document.createElement('div');
    grupo.className = 'sighra-barra-botoes';
    barra.appendChild(grupo);

    textarea.parentElement.insertBefore(barra, textarea);
    console.log('✓ Barra de tratativas adicionada.');

    // Atualiza quando o Motivo mudar
    if (motivoSelect && !motivoSelect.dataset.sighraLigado) {
      motivoSelect.dataset.sighraLigado = '1';
      motivoSelect.addEventListener('change', () => {
        atualizarBotoesBarra(grupo, motivoSelect, textarea, true);
      });
    }
  }

  // Sempre garante que os botoes reflitam o Motivo atual
  const grupo = barra.querySelector('.sighra-barra-botoes');
  atualizarBotoesBarra(grupo, motivoSelect, textarea);
}

// ------------------------------------------------------------
// 3) Seletor rápido de GRUPO (próximo a "Última Atualização")
// ------------------------------------------------------------

// Lista de grupos disponíveis com seus IDs
const GRUPOS = [
  { id: '1', nome: 'MMI' },
  { id: '6', nome: 'TRANSPORTE LAVRAS' },
  { id: '7', nome: 'CBMM (QUÍMICO 3)' }
];

// Encontra o header "Última Atualização" na tabela de alertas
function acharHeaderUltimaAtualizacao() {
  const headers = Array.from(document.querySelectorAll('th, td, div, span'));
  for (const h of headers) {
    const text = getOwnText(h).toLowerCase();
    if (text.includes('última') && text.includes('atualização') || 
        text.includes('ultima') && text.includes('atualizacao')) {
      return h;
    }
  }
  return null;
}

// Extrai o ViewState do formulário (necessário para JSF)
function getViewState() {
  const input = document.querySelector('input[name="javax.faces.ViewState"]');
  return input ? input.value : '';
}

// Pega os valores atuais do filtro
function getValoresFiltroAtual() {
  const form = document.querySelector('form[id*="Filtro"], form[id*="filtro"]');
  if (!form) return {};
  
  const valores = {};
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const name = input.name;
    const value = input.value;
    
    if (name && value && !name.includes('ViewState')) {
      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.checked) {
          if (!valores[name]) valores[name] = [];
          valores[name].push(value);
        }
      } else if (input.tagName === 'SELECT' && input.multiple) {
        const selected = Array.from(input.selectedOptions).map(opt => opt.value);
        valores[name] = selected;
      } else {
        valores[name] = value;
      }
    }
  });
  
  return valores;
}

// Muda o grupo via requisição POST JSF e recarrega
async function mudarGrupo(grupoId) {
  try {
    // Pega o ViewState atual (obrigatório para JSF)
    const viewState = getViewState();
    if (!viewState) {
      throw new Error('ViewState não encontrado');
    }
    
    // Pega os valores atuais do filtro
    const valoresFiltro = getValoresFiltroAtual();
    
    // Constrói o corpo da requisição
    const params = new URLSearchParams();
    
    // Parâmetros JSF obrigatórios
    params.append('javax.faces.partial.ajax', 'true');
    params.append('javax.faces.source', 'formFiltro:j_idt453');
    params.append('javax.faces.partial.execute', '@all');
    params.append('javax.faces.partial.render', 'mainForm:panelListagem mainForm:panelResumo formFiltro mainForm:panelAtualizacao panelActions');
    params.append('formFiltro:j_idt453', 'formFiltro:j_idt453');
    params.append('formFiltro', 'formFiltro');
    
    // Adiciona os valores do filtro existentes
    for (const [key, value] of Object.entries(valoresFiltro)) {
      if (key.includes('grupo')) continue; // Pula o grupo, vamos adicionar o novo
      
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
    
    // Adiciona o NOVO grupo selecionado
    params.append('formFiltro:grupo', grupoId);
    
    // ViewState (obrigatório)
    params.append('javax.faces.ViewState', viewState);
    
    console.log('📤 Enviando requisição com grupo:', grupoId);
    
    // Envia a requisição
    const response = await fetch('/gestor/restrito/listaAlerta.xhtml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Faces-Request': 'partial/ajax',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    await response.text();
    console.log('✅ Filtro aplicado com sucesso!');
    
    // Recarrega a página de forma suave
    location.reload();
    
    return true;
  } catch (err) {
    console.error('❌ Erro ao mudar grupo:', err);
    throw err;
  }
}

// Detecta o grupo atual selecionado no filtro
function getGrupoAtual() {
  const grupoSelect = document.querySelector('select[id*="grupo"]');
  if (grupoSelect && grupoSelect.value) {
    const grupoId = grupoSelect.value;
    const grupo = GRUPOS.find(g => g.id === grupoId);
    return grupo ? grupo.nome : null;
  }
  return null;
}

// Adiciona o seletor rápido de grupo
function adicionarSeletorGrupo() {
  // Verifica se já existe
  if (document.querySelector('.sighra-grupo-selector')) return;
  
  const header = acharHeaderUltimaAtualizacao();
  if (!header) return;
  
  const grupoAtual = getGrupoAtual();
  
  const container = document.createElement('div');
  container.className = 'sighra-grupo-selector';
  // Aplica estilos inline para garantir
  container.style.cssText = `
    display: inline-flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 14px;
    margin-left: 15px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
    transition: all 0.3s ease;
  `;
  
  const label = document.createElement('div');
  label.className = 'sighra-grupo-label';
  label.textContent = '🔄 Mudar Grupo';
  label.style.cssText = `
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
  `;
  container.appendChild(label);
  
  const botoesContainer = document.createElement('div');
  botoesContainer.className = 'sighra-grupo-botoes';
  botoesContainer.style.cssText = `
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
  `;
  
  // Cria um botão para cada grupo
  GRUPOS.forEach(grupo => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sighra-grupo-btn';
    btn.dataset.grupoId = grupo.id;
    
    // Estilos base
    const isAtual = grupo.nome === grupoAtual;
    
    // Define o texto (sem duplicar o checkmark)
    btn.textContent = grupo.nome + (isAtual ? ' ✓' : '');
    
    btn.style.cssText = `
      padding: 11px 20px;
      background: ${isAtual ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'};
      color: ${isAtual ? '#ffffff' : '#e2e8f0'};
      border: 2px solid ${isAtual ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
      border-radius: 10px;
      cursor: ${isAtual ? 'default' : 'pointer'};
      font-size: 13px;
      font-weight: ${isAtual ? '700' : '600'};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      white-space: nowrap;
      box-shadow: ${isAtual ? '0 4px 16px rgba(16, 185, 129, 0.5)' : '0 3px 12px rgba(0, 0, 0, 0.3)'};
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      min-width: 140px;
      text-align: center;
    `;
    
    if (isAtual) {
      btn.disabled = true;
      btn.classList.add('sighra-grupo-atual');
    }
    
    // Eventos de hover
    if (!isAtual) {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)';
        btn.style.transform = 'translateY(-2px) scale(1.03)';
        btn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        btn.style.borderColor = 'rgba(102, 126, 234, 0.5)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)';
        btn.style.transform = 'none';
        btn.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.3)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
    }
    
    // Evento de clique
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const grupoId = btn.dataset.grupoId;
      
      // Desabilita todos os botões durante o processo
      botoesContainer.querySelectorAll('.sighra-grupo-btn').forEach(b => b.disabled = true);
      
      // Feedback visual
      const originalText = btn.textContent;
      const originalStyle = btn.style.cssText;
      btn.textContent = '⏳ Alterando...';
      btn.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
      btn.style.color = '#ffffff';
      btn.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.2)';
      
      try {
        await mudarGrupo(grupoId);
        btn.textContent = '✅ Sucesso!';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
        
        setTimeout(() => {
          location.reload();
        }, 800);
      } catch (err) {
        btn.textContent = '❌ Erro';
        btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.cssText = originalStyle;
          botoesContainer.querySelectorAll('.sighra-grupo-btn').forEach(b => {
            if (!b.classList.contains('sighra-grupo-atual')) {
              b.disabled = false;
            }
          });
        }, 3000);
        
        console.error('Erro ao mudar grupo:', err);
      }
    });
    
    botoesContainer.appendChild(btn);
  });
  
  container.appendChild(botoesContainer);
  
  // Adiciona hover para o container inteiro
  container.addEventListener('mouseenter', () => {
    container.style.transform = 'translateY(-3px)';
    container.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.6)';
  });
  
  container.addEventListener('mouseleave', () => {
    container.style.transform = 'none';
    container.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)';
  });
  
  // Insere após o header "Última Atualização"
  const headerParent = header.parentElement;
  if (headerParent.tagName === 'TH' || headerParent.tagName === 'TD') {
    // Se estiver em uma célula de tabela
    const row = headerParent.parentElement;
    const newCell = document.createElement('th');
    newCell.appendChild(container);
    
    // Insere após a célula atual
    if (headerParent.nextSibling) {
      row.insertBefore(newCell, headerParent.nextSibling);
    } else {
      row.appendChild(newCell);
    }
  } else {
    // Se não estiver em tabela, insere logo após o header
    header.parentElement.insertBefore(container, header.nextSibling);
  }
  
  console.log('✓ Seletor rápido de grupo adicionado.');
}

// ------------------------------------------------------------
// 4) Botão de BACKUP/RESTAURAÇÃO de Filtros
// ------------------------------------------------------------

// Filtros fixos oficiais
const FILTROS_FIXOS = {
  criticidades: ['Informacional', 'Baixa', 'Média', 'Alta', 'Crítica'],
  status: ['Pendente', 'Em Atendimento'],
  tiposInfracao: [
    'Sinais de distração detectados',
    'Condutor em fadiga',
    'Sem Condutor',
    'Condutor ao Celular',
    'Condutor Fumando',
    'Condutor Bocejando',
    'Sem Cinto de Segurança'
  ]
};

// Tipos que NUNCA devem ser marcados (lista de exclusão)
const TIPOS_EXCLUIDOS = [
  'Alarme Tensão Baixa DVR',
  'Alarme de Tensão Baixa DVR',
  'Tensão Baixa DVR',
  'Alarme Tensao Baixa DVR'
];

// Restaura os filtros para os valores fixos oficiais
async function restaurarFiltros() {
  try {
    const form = document.querySelector('form[id*="Filtro"], form[id*="filtro"]');
    
    if (!form) {
      throw new Error('Formulário de filtro não encontrado');
    }
    
    console.log('🔄 Restaurando filtros fixos oficiais...');
    console.log('📋 Formulário encontrado:', form.id);
    
    // 1. LIMPA TODOS OS FILTROS PRIMEIRO
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    
    form.querySelectorAll('input[type="text"]').forEach(input => {
      if (input.name && !input.name.includes('ViewState')) {
        input.value = '';
      }
    });
    
    form.querySelectorAll('select:not([multiple])').forEach(select => {
      if (select.selectedIndex > 0) {
        select.selectedIndex = 0;
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 2. MAPEIA TODOS OS CHECKBOXES COM SEUS TEXTOS
    const todosCheckboxes = [];
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      let texto = '';
      
      // Tenta pegar o texto de várias formas
      const label = cb.closest('label');
      if (label) {
        texto = label.textContent.trim();
      } else {
        const nextElement = cb.nextElementSibling;
        const parent = cb.parentElement;
        if (nextElement && nextElement.textContent) {
          texto = nextElement.textContent.trim();
        } else if (parent) {
          texto = parent.textContent.trim();
        }
      }
      
      if (texto) {
        // Verifica se está na lista de exclusão
        const textoNorm = texto.toLowerCase().trim();
        const estaExcluido = TIPOS_EXCLUIDOS.some(excluido => 
          textoNorm === excluido.toLowerCase().trim() || 
          textoNorm.includes(excluido.toLowerCase().trim())
        );
        
        todosCheckboxes.push({
          checkbox: cb,
          texto: texto,
          id: cb.id,
          name: cb.name,
          excluido: estaExcluido
        });
      }
    });
    
    console.log('📋 Total de checkboxes encontrados:', todosCheckboxes.length);
    console.log('📋 Primeiros 10 checkboxes:', todosCheckboxes.slice(0, 10).map(c => c.texto));
    
    // 3. APLICA OS FILTROS
    let aplicados = {
      criticidades: 0,
      status: 0,
      tiposInfracao: 0
    };
    
    // Aplica Criticidades
    console.log('\n📋 Aplicando Criticidades...');
    FILTROS_FIXOS.criticidades.forEach(valor => {
      const items = todosCheckboxes.filter(item => {
        const textoNorm = item.texto.toLowerCase().trim();
        const valorNorm = valor.toLowerCase().trim();
        return textoNorm === valorNorm || textoNorm.includes(valorNorm);
      });
      
      items.forEach(item => {
        if (!item.checkbox.checked) {
          item.checkbox.checked = true;
          aplicados.criticidades++;
          console.log('  ✓ Marcado:', valor, '(id:', item.id, ')');
        }
      });
      
      if (items.length === 0) {
        console.warn('  ⚠ Não encontrado:', valor);
      }
    });
    
    // Aplica Status
    console.log('\n📋 Aplicando Status...');
    FILTROS_FIXOS.status.forEach(valor => {
      const items = todosCheckboxes.filter(item => {
        const textoNorm = item.texto.toLowerCase().trim();
        const valorNorm = valor.toLowerCase().trim();
        return textoNorm === valorNorm || textoNorm.includes(valorNorm);
      });
      
      items.forEach(item => {
        if (!item.checkbox.checked) {
          item.checkbox.checked = true;
          aplicados.status++;
          console.log('  ✓ Marcado:', valor, '(id:', item.id, ')');
        }
      });
      
      if (items.length === 0) {
        console.warn('  ⚠ Não encontrado:', valor);
      }
    });
    
    // Aplica Tipos de Infração
    console.log('\n📋 Aplicando Tipos de Infração...');
    FILTROS_FIXOS.tiposInfracao.forEach(valor => {
      const items = todosCheckboxes.filter(item => {
        // Ignora itens da lista de exclusão
        if (item.excluido) return false;
        
        const textoNorm = item.texto.toLowerCase().trim();
        const valorNorm = valor.toLowerCase().trim();
        // Usa match EXATO para evitar marcar tipos errados
        return textoNorm === valorNorm;
      });
      
      items.forEach(item => {
        if (!item.checkbox.checked) {
          item.checkbox.checked = true;
          aplicados.tiposInfracao++;
          console.log('  ✓ Marcado:', valor, '(id:', item.id, ')');
        }
      });
      
      if (items.length === 0) {
        console.warn('  ⚠ Não encontrado:', valor);
      }
    });
    
    // Garante que nenhum tipo excluído foi marcado
    todosCheckboxes.forEach(item => {
      if (item.excluido && item.checkbox.checked) {
        item.checkbox.checked = false;
        console.log('  🚫 Desmarcado (excluído):', item.texto);
      }
    });
    
    console.log('\n✅ Total aplicados:', aplicados);
    
    // Dispara eventos change
    await new Promise(resolve => setTimeout(resolve, 100));
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      cb.dispatchEvent(new Event('change', { bubbles: true }));
      cb.dispatchEvent(new Event('click', { bubbles: true }));
    });
    
    // Fecha overlays
    const overlays = document.querySelectorAll('.ui-widget-overlay, .ui-datepicker, [class*="calendar"], [class*="picker"], .modal-backdrop');
    overlays.forEach(overlay => {
      try {
        overlay.style.display = 'none';
        overlay.remove();
      } catch (e) {}
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clica no botão Enviar
    const botaoEnviar = Array.from(form.querySelectorAll('button, input[type="submit"]')).find(btn => {
      const text = (btn.textContent || btn.value || '').toLowerCase();
      return text.includes('enviar') || text.includes('filtrar') || text.includes('aplicar') || text.includes('pesquisar');
    });
    
    if (botaoEnviar) {
      console.log('✓ Clicando no botão Enviar...');
      botaoEnviar.click();
      return true;
    } else {
      console.warn('⚠ Botão Enviar não encontrado');
      return true;
    }
  } catch (err) {
    console.error('❌ Erro ao restaurar filtros:', err);
    throw err;
  }
}

// Adiciona o botão de restauração de filtros fixos
function adicionarBotaoBackupFiltros() {
  // Verifica se já existe
  if (document.querySelector('.sighra-backup-btn')) return;
  
  // Verifica se estamos na página correta (Alertas - Vídeos)
  const tituloAlerta = document.querySelector('h1, h2, h3, .page-title, [class*="titulo"]');
  if (!tituloAlerta || !tituloAlerta.textContent.toLowerCase().includes('alerta')) {
    return; // Não adiciona o botão se não estiver na página de alertas
  }
  
  // Verifica se o formulário de filtro existe
  const formFiltro = document.querySelector('form[id*="Filtro"], form[id*="filtro"]');
  if (!formFiltro) {
    console.log('⚠ Formulário de filtro não encontrado, aguardando...');
    return;
  }
  
  // Procura onde adicionar o botão (próximo ao seletor de grupo ou à última atualização)
  const seletorGrupo = document.querySelector('.sighra-grupo-selector');
  let container = null;
  
  if (seletorGrupo && seletorGrupo.parentElement) {
    // Adiciona depois do seletor de grupo
    container = seletorGrupo.parentElement;
  } else {
    // Tenta encontrar o header de Última Atualização
    const header = acharHeaderUltimaAtualizacao();
    if (header && header.parentElement) {
      container = header.parentElement;
    }
  }
  
  if (!container) {
    console.log('⚠ Container para botão de backup não encontrado');
    return;
  }
  
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sighra-backup-btn';
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
    <span>Restaurar Filtros</span>
  `;
  
  btn.title = 'Restaura os filtros para o padrão oficial (Criticidades + Status + Tipos de Infração)';
  
  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    
    try {
      btn.innerHTML = '<span>⏳ Restaurando...</span>';
      
      await restaurarFiltros();
      
      btn.innerHTML = '<span>✅ Restaurado! Recarregando...</span>';
      btn.classList.add('sighra-ok');
      
      // Força o reload após um breve delay
      setTimeout(() => {
        location.reload();
      }, 800);
      
    } catch (err) {
      btn.innerHTML = '<span>❌ ' + err.message + '</span>';
      btn.classList.add('sighra-error');
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('sighra-error');
        btn.disabled = false;
      }, 4000);
      
      console.error('Erro completo:', err);
    }
  };
  
  // Insere o botão
  try {
    if (container.tagName === 'TH' || container.tagName === 'TD') {
      // Se estiver em uma célula de tabela
      const row = container.parentElement;
      if (row) {
        const newCell = document.createElement('th');
        newCell.appendChild(btn);
        row.appendChild(newCell);
      }
    } else {
      container.appendChild(btn);
    }
    
    console.log('✓ Botão de restauração de filtros fixos adicionado.');
  } catch (err) {
    console.error('Erro ao inserir botão de backup:', err);
  }
}

// ============================================================
// FUNCIONALIDADE DE CAPTURA DE PRINTS E DOWNLOAD DE VÍDEO
// Adaptado do Creare para funcionar com os vídeos do Sigrha
// Criado por Douglas G.
// ============================================================

// Verifica se a funcionalidade de vídeo já foi inicializada
let videoFunctionalityInitialized = false;

// Observador de vídeos para detectar players
function observarVideos() {
  if (videoFunctionalityInitialized) return;
  videoFunctionalityInitialized = true;
  
  console.log('🎥 Iniciando observador de vídeos do Sigrha...');
  
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
    if (!video.dataset.sighraVideoProcessed) {
      melhorarVideo(video);
    }
  });
}

// Adiciona controles personalizados e botão de print ao vídeo
function melhorarVideo(video) {
  if (!video || video.dataset.sighraVideoProcessed) return;
  
  video.dataset.sighraVideoProcessed = 'true';
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
  printButton.className = 'sighra-video-print-btn';
  printButton.innerHTML = '📷 Print';
  printButton.title = 'Capturar frame do vídeo (P)';
  printButton.type = 'button';
  
  printButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 120px;
    z-index: 1000;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 4px;
  `;
  
  // Cria botão de download do vídeo
  const downloadButton = document.createElement('button');
  downloadButton.className = 'sighra-video-download-btn';
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
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 4px;
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
        a.download = `sighra-video-${timestamp}-${videoTime}s.png`;
        
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
        const fileName = `sighra-video-${timestamp}.mp4`;
        
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

console.log('✅ Funcionalidade de captura de vídeos carregada no Sigrha!');

// ============================================================
// FIM DA FUNCIONALIDADE DE VÍDEO
// ============================================================

// ------------------------------------------------------------
// Observadores: mantem os elementos presentes conforme a tela muda
// ------------------------------------------------------------
function tick() {
  try {
    adicionarBotaoCopiar();
    adicionarBarraTratativas();
    adicionarSeletorGrupo();
    adicionarBotaoBackupFiltros();
  } catch (err) {
    console.error('Sighra - Colinha erro:', err);
  }
}

const observer = new MutationObserver(() => tick());
observer.observe(document.body, { childList: true, subtree: true });

setInterval(tick, 800);
setTimeout(tick, 500);
