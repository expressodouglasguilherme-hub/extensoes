// Maxtrack WhatsApp Helper - Content Script
(function() {
  'use strict';

  // Variável global para controlar inicialização do date updater
  let dateUpdaterInitialized = false;

  // Configuração de seletores (ajustado para a estrutura real do Maxtrack)
  const SELECTORS = {
    tableRow: 'tr.selected, tr.active, tr[class*="selected"]',
    tableBody: '#event-process-table-ALL tbody tr',
    empresa: 'td:nth-child(3)',              // +1 por causa do botão
    cliente: 'td:nth-child(4)',              // +1
    identificador: 'td:nth-child(8)',        // +1
    informacoesAdicionais: 'td:nth-child(13)', // +1
    motoristaNome: 'td:nth-child(13) span.cursor-pointer', // +1
    localidade: 'td:nth-child(15)',          // +1
    nome: 'td:nth-child(12)',                // +1
    criticidade: 'td:nth-child(10)',         // +1
    data: 'td:nth-child(7)',                 // +1
    status: 'td:nth-child(17)',              // +1
    tipoClassificacao: 'td:nth-child(20)',   // +1
    operadorValidacao: 'td:nth-child(18)'    // CORRIGIDO: era 19, agora é 18
  };

  const CRITICIDADE_EMOJI = {
    'gravíssimo': '🔴',
    'gravissimo': '🔴',
    'grave': '🔴',
    'médio': '🟡',
    'medio': '🟡',
    'leve': '🟢',
    'baixo': '🟢',
    'baixa': '🟢'
  };

  function getCriticidadeEmoji(criticidade) {
    if (!criticidade) return '⚪';
    const text = criticidade.toLowerCase().trim();
    return CRITICIDADE_EMOJI[text] || '⚪';
  }

  function parseIdentificador(identificador) {
    if (!identificador) return { placa: 'Não informado', prefixo: '' };
    
    // Limpar o identificador removendo quebras de linha excessivas
    const identificadorLimpo = identificador
      .replace(/\n+/g, ' ')  // Substituir quebras de linha por espaços
      .replace(/\s+/g, ' ')  // Substituir múltiplos espaços por um único
      .trim();
    
    // Separar por espaços
    const partes = identificadorLimpo.split(' ').filter(p => p);
    
    if (partes.length === 0) {
      return { placa: 'Não informado', prefixo: '' };
    }
    
    // Primeira parte é a placa, o resto é o prefixo
    const placa = partes[0];
    const prefixo = partes.slice(1).join(' ');
    
    return { placa, prefixo };
  }

  // Pistas de texto (usadas só como fallback)
  const MOTIVOS_PISTAS = [
    'reportado', 'condutor', 'orienta', 'direç', 'direc', 'desaten', 'fadiga',
    'foco', 'reforç', 'reforc', 'operaç', 'operac', 'bocej', 'sonol', 'celular',
    'volante', 'validaç', 'chamado', 'positivo', 'objeto', 'beber', 'fumar'
  ];

  function pareceMotivo(txt) {
    if (!txt) return false;
    const t = txt.toLowerCase();
    return t.length > 15 && MOTIVOS_PISTAS.some((p) => t.includes(p));
  }

  function limparMotivo(txt) {
    return (txt || '')
      .replace(/^\s*motivos?:?\s*/i, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extrai o Motivos de um popover VISÍVEL na tela.
  // Estrutura real do Maxtrack:
  //   .popover-content > span.soft-bold "Motivos:" + div[foreach: reasons] > .badge
  function extrairMotivoDoPopover() {
    const popovers = document.querySelectorAll('.popover-content, .popover, [class*="popover"]');
    for (const pop of popovers) {
      const txt = (pop.textContent || '').toLowerCase();
      if (!txt.includes('motivo')) continue; // precisa ser o balão de "Motivos:"
      // Os motivos são os .badge (logo após o rótulo "Motivos:")
      const badges = pop.querySelectorAll('.badge, [class*="badge"]');
      const motivos = Array.from(badges)
        .map((b) => b.textContent.replace(/\s+/g, ' ').trim())
        .filter((t) => t.length > 3);
      if (motivos.length) return motivos.join(' | ');
      // Sem badges: usa o texto todo, tirando o rótulo "Motivos:"
      const limpo = limparMotivo(pop.textContent);
      if (limpo.length > 5) return limpo;
    }
    return '';
  }

  // Guarda o último Motivos visto num popover (pois o balão some ao tirar o mouse)
  let ultimoMotivoPopover = '';

  // Fica observando a página: quando um popover de "Motivos" aparece, memoriza o texto.
  function observarPopoverMotivos() {
    if (window.__obsMotivoAtivo) return;
    window.__obsMotivoAtivo = true;
    const memorizar = () => {
      const m = extrairMotivoDoPopover();
      if (m) { ultimoMotivoPopover = m; console.log('💾 Motivos memorizado:', m); }
    };
    const obs = new MutationObserver((muts) => {
      for (const mut of muts) {
        for (const no of mut.addedNodes) {
          if (no.nodeType !== 1) continue;
          const cls = (typeof no.className === 'string') ? no.className : '';
          if (cls.includes('popover') || (no.querySelector && no.querySelector('.popover-content'))) {
            memorizar();
            return;
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // Lê o Motivos do atributo injetado pelo page-reader (leitura direta do knockout).
  function motivoDoAtributoInjetado(row) {
    if (row) {
      // no próprio elemento da linha
      const own = (row.getAttribute && (row.getAttribute('data-motivos-text') || '')).trim();
      if (own.length > 3) return own;
      // em algum descendente da linha
      const el = row.querySelector('[data-motivos-text]');
      if (el) {
        const v = (el.getAttribute('data-motivos-text') || '').trim();
        if (v.length > 3) return v;
      }
    }
    // qualquer lugar do documento (detalhe aberto)
    const any = document.querySelector('[data-motivos-text]');
    if (any) {
      const v = (any.getAttribute('data-motivos-text') || '').trim();
      if (v.length > 3) return v;
    }
    return '';
  }

  // Procura o texto do "Motivos" da tratativa.
  function findMotivos(row) {
    // 0) Atributo injetado pelo page-reader (mais confiável, sem hover)
    const injetado = motivoDoAtributoInjetado(row);
    if (injetado) {
      ultimoMotivoPopover = injetado;
      console.log('📌 Motivos (knockout):', injetado);
      return injetado;
    }

    // 1) Popover VISÍVEL agora (mouse sobre o "Atenção (N)")
    const doPopover = extrairMotivoDoPopover();
    if (doPopover) {
      ultimoMotivoPopover = doPopover;
      console.log('📌 Motivos capturado do popover:', doPopover);
      return doPopover;
    }

    // 2) Fallback: atributos de tooltip (title/data-*) na linha ou no documento
    const ATTRS = ['title', 'aria-label', 'data-original-title', 'data-tooltip', 'data-title', 'data-content'];
    const escopos = [];
    if (row) escopos.push(row, ...row.querySelectorAll('*'));
    for (const el of escopos) {
      for (const attr of ATTRS) {
        const v = el.getAttribute && el.getAttribute(attr);
        if (v && pareceMotivo(v)) { console.log('📌 Motivos via [' + attr + '] na linha'); return limparMotivo(v); }
      }
    }
    for (const el of document.querySelectorAll('*')) {
      for (const attr of ATTRS) {
        const v = el.getAttribute && el.getAttribute(attr);
        if (v && pareceMotivo(v)) { console.log('📌 Motivos via [' + attr + '] no documento'); return limparMotivo(v); }
      }
    }

    // 3) Último Motivos memorizado (balão que apareceu antes e já fechou)
    if (ultimoMotivoPopover) {
      console.log('📌 Usando Motivos memorizado:', ultimoMotivoPopover);
      return ultimoMotivoPopover;
    }

    console.log('ℹ️ Motivos não encontrado. Passe o mouse no "Atenção (N)" para exibir o balão antes de copiar.');
    return '';
  }

  function getStatusBadge(statusElement) {
    if (!statusElement) return '';
    const badge = statusElement.querySelector('.badge, .label, span[class*="badge"], span[class*="status"]');
    if (badge) return badge.textContent.trim();
    return statusElement.textContent.trim();
  }

  let hoveredRow = null;

  function getSelectedRow() {
    if (hoveredRow) return hoveredRow;
    let selectedRow = document.querySelector(SELECTORS.tableRow);
    if (!selectedRow) selectedRow = document.querySelector('tr.last-clicked');
    if (!selectedRow) selectedRow = document.querySelector('tr[aria-selected="true"]');
    if (!selectedRow) selectedRow = document.querySelector('#event-process-table-ALL tbody tr');
    return selectedRow;
  }

  function getColumnIndexByHeader(headerText) {
    // Procurar pelo cabeçalho da tabela para identificar a coluna
    const headers = document.querySelectorAll('#event-process-table-ALL thead th');
    for (let i = 0; i < headers.length; i++) {
      const text = headers[i].textContent.trim().toLowerCase();
      if (text.includes(headerText.toLowerCase())) {
        return i + 1; // nth-child começa em 1
      }
    }
    return null;
  }

  function extractDataFromRow(row) {
    if (!row) return null;

    console.log('🔍 DEBUG - Extraindo dados da linha');

    const getData = (selector) => {
      const element = row.querySelector(selector);
      if (!element) return '';
      let text = element.textContent.trim();
      const iconTexts = ['sentiment_very_dissatisfied', 'sentiment_dissatisfied', 
        'sentiment_satisfied', 'sentiment_very_satisfied', 'switch_access_shortcut', 
        'account_circle', 'map', 'person', 'location_on', 'place', 'room',
        'assignment_late', 'assignment', 'timer', 'schedule', 'play_circle',
        'Evidências disponíveis'];
      iconTexts.forEach(icon => {
        text = text.replace(new RegExp(icon, 'gi'), '');
      });
      text = text.replace(/\d+\s*horas?/gi, '');
      text = text.replace(/\d+\s*dias?/gi, '');
      text = text.replace(/\d+\s*minutos?/gi, '');
      text = text.replace(/\d+\s*min/gi, '');
      text = text.replace(/\n+/g, ' ');
      text = text.replace(/\s+/g, ' ');
      return text.trim();
    };

    const cells = Array.from(row.querySelectorAll('td'));
    
    // Log de todas as células para debug
    console.log('📋 Todas as células:');
    cells.forEach((cell, i) => {
      const text = cell.textContent.trim().substring(0, 80);
      if (text) console.log(`  [${i}]: ${text}`);
    });

    // EMPRESA: Tem S/A ou LTDA, mais de 10 caracteres, não é data nem placa
    let empresa = '';
    for (let cell of cells) {
      const text = cell.textContent.trim();
      if (text.length > 10 && 
          (/\bS\/A\b/i.test(text) || /\bLTDA\b/i.test(text) || (/\bEXPRESSO\b/i.test(text) && text.length > 15)) &&
          !/^\d{2}\/\d{2}\/\d{4}/.test(text) && 
          !/^[A-Z]{3}\d/.test(text)) {
        empresa = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('🏢 Empresa encontrada:', empresa);
        break;
      }
    }

    // CLIENTE/FILIAL: Tem " - " e cidade, ou começa com EN/CENCI/etc
    let cliente = '';
    for (let cell of cells) {
      const text = cell.textContent.trim();
      
      // Verificar se tem hífen (formato: "EN CENIBRA - Belo Oriente")
      if (text.includes(' - ') && 
          text.length > 5 && 
          text.length < 100 &&
          !/^\d{2}\/\d{2}\/\d{4}/.test(text) && 
          text !== empresa &&
          !text.includes('S/A') &&
          !text.includes('LTDA') &&
          !text.includes('TERM') &&
          !text.includes('account_circle') &&
          !text.includes('assignment') &&
          !text.includes('timer')) {
        cliente = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('📍 Cliente encontrado (com hífen):', cliente);
        break;
      }
      
      // Verificar se é um nome de filial sem hífen (começa com EN, CENCI, etc)
      if (!cliente && 
          /^EN\s|^CENCI|^CENIBRA|^FILIAL/i.test(text) &&
          text.length > 5 &&
          text.length < 50 &&
          text !== empresa &&
          !text.includes('S/A') &&
          !text.includes('LTDA') &&
          !text.includes('TERM') &&
          !text.includes('account_circle')) {
        cliente = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('📍 Cliente encontrado (sem hífen):', cliente);
        break;
      }
    }

    // PLACA: Começa com formato ABC1234 ou ABC1D23
    let identificadorRaw = '';
    for (let cell of cells) {
      const text = cell.textContent.trim();
      if (/^[A-Z]{3}\d[A-Z0-9]\d{2}/i.test(text)) {
        identificadorRaw = text;
        console.log('🚛 Placa encontrada:', identificadorRaw);
        break;
      }
    }

    // LOCALIZAÇÃO: Tem múltiplas vírgulas e BR, tem cidade
    let localidade = '';
    for (let cell of cells) {
      const text = cell.textContent.trim();
      const cleanText = text.replace(/map/gi, '').trim();
      if ((cleanText.match(/,/g) || []).length >= 1 && 
          /\b(MG|SP|RJ|BR)\b/i.test(cleanText) &&
          cleanText.length > 10 &&
          !/^\d{2}\/\d{2}\/\d{4}/.test(cleanText)) {
        localidade = cleanText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('🗺️ Localidade encontrada:', localidade);
        break;
      }
    }

    // TIPO DE EVENTO: Começa com "Análise" ou contém palavras-chave específicas
    let nome = '';
    for (let cell of cells) {
      const text = cell.textContent.trim();
      if (/^(Análise|Detecção)/i.test(text) || 
          (text.toLowerCase().includes('desatenção') && text.toLowerCase().includes('fadiga'))) {
        nome = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('⚠️ Tipo de evento encontrado:', nome);
        break;
      }
    }

    // CRITICIDADE: Exatamente uma dessas palavras sozinha
    let criticidade = '';
    for (let cell of cells) {
      const text = cell.textContent.trim();
      if (/^(Gravíssimo|Grave|Médio|Medio|Leve|Baixo|Baixa)$/i.test(text)) {
        criticidade = text;
        console.log('🔴 Criticidade encontrada:', criticidade);
        break;
      }
    }
    
    // DATA: Formato DD/MM/YYYY HH:MM:SS sem DGR_
    let data = '';
    for (let cell of cells) {
      const text = cell.textContent.trim();
      const match = text.match(/(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/);
      if (match && !text.includes('DGR_') && !text.includes('hora') && !text.includes('dia')) {
        data = match[1];
        console.log('🕒 Data encontrada:', data);
        break;
      }
    }
    
    // Se não encontrou com hora completa, tentar só data e hora sem segundos
    if (!data) {
      for (let cell of cells) {
        const text = cell.textContent.trim();
        const match = text.match(/(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2})/);
        if (match && !text.includes('DGR_')) {
          data = match[1] + ':00'; // Adicionar :00 para os segundos
          console.log('🕒 Data encontrada (sem segundos):', data);
          break;
        }
      }
    }
    
    // STATUS e CLASSIFICAÇÃO - buscar pelo badge/texto
    let status = '';
    let tipoClassificacao = '';
    
    // Procurar por texto que parece status (depois da criticidade)
    let foundCriticidade = false;
    for (let cell of cells) {
      const text = cell.textContent
        .replace(/play_circle/gi, '')
        .replace(/Evidências disponíveis/gi, '')
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Pular a célula da criticidade
      if (criticidade && text.includes(criticidade)) {
        foundCriticidade = true;
        continue;
      }
      
      // Procurar status após a criticidade
      if (foundCriticidade && /^(Finalizado|Pendente|Em andamento|Aguardando)/i.test(text)) {
        const parts = text.split(/\s+/);
        status = parts[0]; // Primeiro palavra é o status
        // Resto pode ser a classificação
        if (parts.length > 1) {
          tipoClassificacao = parts.slice(1).join(' ');
        }
        break;
      }
      
      // Se não achou após criticidade, procurar em qualquer lugar
      if (!status && /^Finalizado/i.test(text)) {
        const parts = text.split(/\s+/);
        status = parts[0];
        if (parts.length > 1) {
          tipoClassificacao = parts.slice(1).join(' ');
        }
        break;
      }
    }
    
    // Se ainda não achou, procurar por badges
    if (!status) {
      const badges = row.querySelectorAll('.badge, .label, span[class*="badge"], span[class*="status"]');
      for (let badge of badges) {
        const text = badge.textContent.trim();
        if (text && text.length > 0 && !/^[a-f0-9]{24}$/i.test(text) && text !== criticidade) {
          if (!status) {
            status = text;
          } else {
            tipoClassificacao = text;
          }
        }
      }
    }
    
    console.log('📝 Status:', status, '| Classificação:', tipoClassificacao);

    // MOTORISTA - buscar por nome de pessoa (2+ palavras com maiúsculas)
    let motorista = 'Não informado';
    
    // Primeiro tentar pelo seletor antigo
    const motoristaElement = row.querySelector(SELECTORS.motoristaNome);
    if (motoristaElement) {
      const nome = motoristaElement.textContent.trim()
        .replace(/account_circle/gi, '')
        .replace(/assignment_late/gi, '')
        .replace(/timer/gi, '')
        .replace(/\d+\s*horas?/gi, '')
        .replace(/assignment/gi, '')
        .trim();
      if (nome.length > 3) motorista = nome;
    }
    
    // Se não encontrou, procurar por célula que tem "-TERM"
    if (motorista === 'Não informado' || motorista.length < 3) {
      for (let cell of cells) {
        const text = cell.textContent.trim();
        
        // Se tem "-TERM", o nome está nessa célula (acima do -TERM)
        if (text.includes('-TERM') || text.includes('- TERM')) {
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);
          // O nome geralmente é a primeira linha
          for (let line of lines) {
            const cleanLine = line
              .replace(/account_circle/gi, '')
              .replace(/assignment_late/gi, '')
              .replace(/timer/gi, '')
              .replace(/\d+\s*horas?/gi, '')
              .replace(/assignment/gi, '')
              .replace(/-TERM/gi, '')
              .replace(/- TERM/gi, '')
              .trim();
            
            const palavras = cleanLine.split(/\s+/);
            if (palavras.length >= 2 && 
                palavras.length <= 5 &&
                /^[A-Z][a-z]+/.test(palavras[0]) &&
                cleanLine.length > 5 &&
                cleanLine.length < 60) {
              motorista = cleanLine;
              console.log('👤 Motorista encontrado via -TERM:', motorista);
              break;
            }
          }
          if (motorista !== 'Não informado') break;
        }
      }
    }
    
    // Se ainda não encontrou, procurar por padrão de nome (Nome Sobrenome)
    if (motorista === 'Não informado' || motorista.length < 3) {
      for (let cell of cells) {
        const text = cell.textContent
          .replace(/account_circle/gi, '')
          .replace(/assignment_late/gi, '')
          .replace(/timer/gi, '')
          .replace(/\d+\s*horas?/gi, '')
          .replace(/assignment/gi, '')
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Nome deve ter pelo menos 2 palavras, começar com maiúscula
        const palavras = text.split(/\s+/);
        if (palavras.length >= 2 && 
            palavras.length <= 5 &&  // Máximo 5 palavras
            /^[A-Z][a-z]+/.test(palavras[0]) &&
            /^[A-Z][a-z]+/.test(palavras[1]) &&
            !text.includes('S/A') &&
            !text.includes('LTDA') &&
            !text.includes(' - ') &&
            !text.includes('BR') &&
            !/^\d/.test(text) &&
            text.length > 5 &&
            text.length < 60 &&
            text !== empresa &&
            text !== cliente &&
            text !== localidade &&
            text !== nome) {
          motorista = text;
          console.log('👤 Motorista encontrado por padrão:', motorista);
          break;
        }
      }
    }
    console.log('👤 Motorista final:', motorista);

    const { placa, prefixo } = parseIdentificador(identificadorRaw);
    const criticidadeEmoji = getCriticidadeEmoji(criticidade);
    
    // OPERADOR: Procurar DGR_ ou nome completo
    let operadorResponsavel = 'Douglas G.';
    
    // Primeiro, procurar por DGR_
    for (let cell of cells) {
      const text = cell.textContent.trim();
      const match = text.match(/DGR[_\s]+([\w\s]+)/i);
      if (match && match[1]) {
        const nomeCompleto = match[1].trim().split('\n')[0].trim();
        console.log('👨‍💼 Operador encontrado (bruto):', nomeCompleto);
        
        // Se tem "Douglas" E "Miranda", usar "Douglas G."
        if ((nomeCompleto.includes('Douglas') && nomeCompleto.includes('Miranda')) ||
            nomeCompleto === 'Douglas Guilherme de Miranda' ||
            nomeCompleto === 'Douglas G Miranda') {
          operadorResponsavel = 'Douglas G.';
          console.log('👨‍💼 Operador identificado como Douglas G.');
        } else {
          // Para outros operadores, pegar nome completo OU abreviar
          const nomeParts = nomeCompleto.split(/\s+/).filter(p => p.length > 1);
          if (nomeParts.length >= 2) {
            // Formato: "Nome SobrenomeInicial."
            operadorResponsavel = `${nomeParts[0]} ${nomeParts[nomeParts.length - 1].charAt(0)}.`;
          } else {
            operadorResponsavel = nomeCompleto;
          }
          console.log('👨‍💼 Operador identificado:', operadorResponsavel);
        }
        break;
      }
    }
    
    // Se não encontrou com DGR_, procurar por padrão de nome após outros campos conhecidos
    if (operadorResponsavel === 'Douglas G.' && cells.length > 15) {
      const cell18 = cells[17]; // Coluna 18 (índice 17)
      if (cell18) {
        const text = cell18.textContent
          .replace(/account_circle/gi, '')
          .replace(/DGR_/gi, '')
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Se tem nome válido (2+ palavras, começa com maiúscula)
        const palavras = text.split(/\s+/);
        if (palavras.length >= 2 && /^[A-Z]/.test(palavras[0])) {
          const nomeCompleto = palavras.join(' ');
          console.log('👨‍💼 Operador encontrado na coluna 18:', nomeCompleto);
          
          if ((nomeCompleto.includes('Douglas') && nomeCompleto.includes('Miranda')) ||
              nomeCompleto === 'Douglas Guilherme de Miranda') {
            operadorResponsavel = 'Douglas G.';
          } else {
            // Abreviar: "Nome SobrenomeInicial."
            operadorResponsavel = `${palavras[0]} ${palavras[palavras.length - 1].charAt(0)}.`;
          }
          console.log('👨‍💼 Operador final:', operadorResponsavel);
        }
      }
    }
    
    // ID DO EVENTO
    let eventoId = '';
    const rowId = row.id || row.getAttribute('id');
    if (rowId && rowId.startsWith('event-line-row-')) {
      eventoId = rowId.replace('event-line-row-', '');
    }
    if (!eventoId) {
      const match = rowId ? rowId.match(/([a-f0-9]{24,32})/i) : null;
      if (match) eventoId = match[1];
    }
    
    const linkEvidencias = eventoId 
      ? `https://go.maxtrack.com.br/#event/Event?id=${eventoId}`
      : window.location.href;

    // MOTIVOS (texto escondido da tratativa / tooltip do detalhe)
    const motivos = findMotivos(row);
    if (motivos) console.log('📝 Motivos:', motivos);

    console.log('✅ Dados extraídos com sucesso!');

    return {
      empresa, cliente, placa, prefixo, motorista, localidade, nome,
      criticidade, criticidadeEmoji, data, status, tipoClassificacao,
      operadorResponsavel, linkEvidencias, motivos
    };
  }

  function formatWhatsAppMessage(data) {
    let message = `🏢 *Empresa:* ${data.empresa}\n`;
    message += `📍 *Filial:* ${data.cliente}\n`;
    message += `🚛 *Placa / Prefixo:* ${data.placa}\n`;
    message += `👤 *Motorista:* ${data.motorista}\n`;
    message += `🗺️ *Localização:* ${data.localidade}\n\n`;
    message += `⚠️ *Classificação*\n`;
    message += `- *Tipo:* ${data.nome}\n`;
    message += `- *Nível de Risco:* ${data.criticidadeEmoji} ${data.criticidade}\n\n`;
    message += `🕒 *Data/Hora do Alerta:* ${data.data}\n\n`;
    message += `👨‍💼 *Operador Responsável:* ${data.operadorResponsavel}\n\n`;
    message += `📝 *Tratativa*\n`;
    message += `${data.status}${data.tipoClassificacao ? ' - ' + data.tipoClassificacao : ''}\n`;
    if (data.motivos) {
      message += `_${data.motivos}_\n`;
    }
    message += `\n`;
    message += `📷 *Evidências*\n`;
    message += `🔗 *Link das imagens:* ${data.linkEvidencias}`;
    return message;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackErr) {
        return false;
      }
    }
  }

  function showNotification(message, type = 'success', subtext = '') {
    const notification = document.createElement('div');
    notification.className = `maxtrack-whatsapp-notification ${type}`;

    const title = document.createElement('div');
    title.className = 'maxtrack-whatsapp-notification-title';
    title.textContent = message;
    notification.appendChild(title);

    if (subtext) {
      const sub = document.createElement('div');
      sub.className = 'maxtrack-whatsapp-notification-sub';
      sub.textContent = subtext;
      notification.appendChild(sub);
    }

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  function dispararMouse(el, tipo) {
    try {
      el.dispatchEvent(new MouseEvent(tipo, { view: window, bubbles: true, cancelable: true }));
    } catch (e) {}
  }

  // Aciona o gatilho do balão de Motivos da linha (sem o usuário passar o mouse),
  // lê o texto e esconde o balão. Retorna o Motivos capturado (ou '').
  function revelarMotivoDaLinha(row) {
    return new Promise((resolve) => {
      if (!row) return resolve('');

      // 1) Marca a linha e pede ao page-reader uma leitura imediata do knockout
      try {
        row.setAttribute('data-motivo-target', '1');
        document.dispatchEvent(new CustomEvent('MAXTRACK_MOTIVO_REFRESH'));
      } catch (e) {}
      const injetado = motivoDoAtributoInjetado(row);
      try { row.removeAttribute('data-motivo-target'); } catch (e) {}
      if (injetado) {
        ultimoMotivoPopover = injetado;
        console.log('🤖 Motivos lido do knockout:', injetado);
        return resolve(injetado);
      }

      // 2) Fallback: tenta acionar o balão via hover sintético
      const gatilho = row.querySelector('[data-bind*="popUpAnchor"]')
        || row.querySelector('.inline-block.cursor-pointer')
        || (row.querySelector('.badge-line.badge-mini') && row.querySelector('.badge-line.badge-mini').parentElement);
      if (!gatilho) {
        console.log('ℹ️ Gatilho de Motivos não encontrado nesta linha.');
        return resolve(ultimoMotivoPopover || '');
      }
      // Simula o "hover" pra abrir o balão
      ['mouseenter', 'mouseover', 'mousemove'].forEach((t) => dispararMouse(gatilho, t));
      // Espera o balão renderizar, lê e esconde
      setTimeout(() => {
        const motivo = extrairMotivoDoPopover();
        if (motivo) ultimoMotivoPopover = motivo;
        ['mouseout', 'mouseleave'].forEach((t) => dispararMouse(gatilho, t));
        console.log('🤖 Motivos revelado automaticamente:', motivo || '(nada)');
        resolve(motivo || ultimoMotivoPopover || '');
      }, 250);
    });
  }

  // Detecta a linha de RESUMO de um "sistema agrupado" (a de cima, com a seta).
  // Nesse modo, os dados completos ficam na linha de BAIXO, que só aparece ao
  // clicar na seta para expandir. Copiar a linha de cima traz dados incompletos.
  function isLinhaAgrupada(row, data) {
    if (!row) return false;

    // 1) Procura o controle de expandir/recolher (a "seta") dentro da linha.
    //    O Maxtrack usa Material Icons; a linha-resumo do grupo tem a setinha.
    const ARROW_ICONS = [
      'expand_more', 'expand_less', 'keyboard_arrow_down', 'keyboard_arrow_up',
      'keyboard_arrow_right', 'keyboard_arrow_left', 'chevron_right', 'chevron_left',
      'arrow_drop_down', 'arrow_right', 'arrow_drop_up', 'unfold_more', 'unfold_less'
    ];
    const iconEls = row.querySelectorAll(
      'i, .material-icons, [class*="material-icons"], [class*="chevron"], ' +
      '[class*="caret"], [class*="expand"], [class*="collapse"], [class*="toggle"]'
    );
    for (const el of iconEls) {
      // não confundir com o próprio botão do WhatsApp que injetamos
      if (el.closest && el.closest('.maxtrack-whatsapp-btn-inline')) continue;
      const txt = (el.textContent || '').toLowerCase().trim();
      if (ARROW_ICONS.includes(txt)) {
        console.log('🔽 Linha agrupada detectada pela seta:', txt);
        return true;
      }
    }

    // 2) Indícios no data-bind do knockout (agrupamento / expandir)
    const bindEls = row.querySelectorAll('[data-bind]');
    for (const el of bindEls) {
      const bind = (el.getAttribute('data-bind') || '').toLowerCase();
      if (/expand|collaps|toggle.*group|group.*toggle|isopen|expanded/.test(bind)) {
        console.log('🔽 Linha agrupada detectada pelo data-bind:', bind.slice(0, 60));
        return true;
      }
    }

    // 3) Heurística por dados: a linha-resumo não tem os detalhes preenchidos.
    //    Uma tratativa real de baixo tem empresa, localidade e motorista.
    if (data) {
      const semEmpresa = !data.empresa || data.empresa.length < 3;
      const semLocalidade = !data.localidade || data.localidade.length < 3;
      const semMotorista = !data.motorista || data.motorista === 'Não informado';
      if (semEmpresa && semLocalidade && semMotorista) {
        console.log('🔽 Linha agrupada detectada pela ausência de dados (empresa/localidade/motorista).');
        return true;
      }
    }

    return false;
  }

  async function handleButtonClick() {
    const selectedRow = getSelectedRow();
    if (!selectedRow) {
      showNotification('⚠️ Nenhuma linha encontrada!', 'error');
      return;
    }

    // Revela o Motivos automaticamente (sem precisar passar o mouse)
    await revelarMotivoDaLinha(selectedRow);

    const data = extractDataFromRow(selectedRow);
    if (!data) {
      showNotification('❌ Erro ao extrair dados.', 'error');
      return;
    }

    // 🔽 VALIDAÇÃO: Bloqueia a cópia da linha-resumo do "sistema agrupado".
    // O operador precisa clicar na seta para expandir e copiar a linha de baixo.
    if (isLinhaAgrupada(selectedRow, data)) {
      console.log('❌ Linha agrupada (resumo) — cópia bloqueada.');
      showNotification(
        '⚠️ Não copie a linha agrupada!',
        'warning',
        'Clique na seta (▼) para expandir e copie as informações da linha de baixo.'
      );
      return; // NÃO permite copiar a linha de cima
    }

    // ✅ VALIDAÇÃO: Verifica se a tratativa foi finalizada
    console.log('🔍 VALIDAÇÃO - Status:', data.status);
    console.log('🔍 VALIDAÇÃO - Classificação:', data.tipoClassificacao);
    
    // Se contém "play_circle" ou "Evidências disponíveis" ou "Novo", não está finalizada
    const statusCompleto = `${data.status} ${data.tipoClassificacao}`.toLowerCase();
    
    if (statusCompleto.includes('play_circle') || 
        statusCompleto.includes('evidências disponíveis') ||
        statusCompleto.includes('evidencias disponíveis') ||
        statusCompleto.includes('novo') ||
        data.status.toLowerCase().includes('novo')) {
      console.log('❌ TRATATIVA NÃO FINALIZADA!');
      showNotification('⚠️ Finalize a tratativa antes de copiar!', 'warning', 'Cole o link novamente no navegador caso não atualize automaticamente.');
      return; // NÃO permite copiar
    }
    
    console.log('✅ TRATATIVA FINALIZADA - Permitindo cópia');
    
    const message = formatWhatsAppMessage(data);
    const success = await copyToClipboard(message);
    if (success) {
      showNotification('✅ Mensagem copiada!', 'success');
      console.log('Mensagem:', message);
    } else {
      showNotification('❌ Erro ao copiar.', 'error');
    }
  }

  function createButton() {
    const oldButton = document.getElementById('maxtrack-whatsapp-btn');
    if (oldButton) oldButton.remove();

    // Tentar primeiro o seletor específico, depois o genérico
    let rows = document.querySelectorAll('#event-process-table-ALL tbody tr');
    if (rows.length === 0) {
      rows = document.querySelectorAll('table tbody tr');
    }
    
    console.log(`🔍 Encontradas ${rows.length} linhas para adicionar botões`);
    
    rows.forEach((row, index) => {
      if (row.querySelector('.maxtrack-whatsapp-btn-inline')) return;

      const newCell = document.createElement('td');
      newCell.style.width = '40px';
      newCell.style.textAlign = 'center';
      newCell.style.padding = '4px';
      
      const button = document.createElement('button');
      button.className = 'maxtrack-whatsapp-btn-inline';
      button.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
      button.title = 'Copiar para WhatsApp';
      
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        hoveredRow = row;
        handleButtonClick();
      });

      newCell.appendChild(button);
      if (row.firstChild) {
        row.insertBefore(newCell, row.firstChild);
        console.log(`✅ Botão adicionado linha ${index + 1}`);
      }
    });
  }

  function observeTableChanges() {
    // Tentar primeiro o seletor específico
    let tableBody = document.querySelector('#event-process-table-ALL tbody');
    
    // Se não encontrou, tentar o genérico
    if (!tableBody) {
      const allTbodies = document.querySelectorAll('table tbody');
      for (const tbody of allTbodies) {
        if (tbody.querySelectorAll('tr').length > 0) {
          tableBody = tbody;
          break;
        }
      }
    }
    
    if (!tableBody) return;
    
    const observer = new MutationObserver(() => createButton());
    observer.observe(tableBody, { childList: true, subtree: true });
  }
  
  function observeUrlChanges() {
    // Observar mudanças na URL (para SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        console.log('🔄 URL mudou para:', url);
        
        // Resetar flag do observador ao mudar de página
        observadorAtivo = false;
        
        // Aguardar um pouco para a nova página carregar
        setTimeout(() => {
          init(); // Observador de finalizações
          initWhatsAppButtons(); // Botões do WhatsApp
          
          // Se mudou para página de eventos, tentar criar botão de data
          if (url.includes('#event/Event')) {
            console.log('📅 Navegou para página de eventos, inicializando botão de data...');
            setTimeout(() => {
              initDateUpdater();
            }, 2000);
          }
        }, 1500);
      }
    }).observe(document, { subtree: true, childList: true });
    
    // Também observar eventos de navegação do histórico
    const pushState = history.pushState;
    history.pushState = function() {
      pushState.apply(history, arguments);
      console.log('🔄 Navegação detectada (pushState)');
      observadorAtivo = false; // Reset
      setTimeout(() => {
        init();
        initWhatsAppButtons();
        if (location.href.includes('#event/Event')) {
          console.log('📅 Página de eventos detectada, inicializando botão...');
          setTimeout(() => {
            initDateUpdater();
          }, 2000);
        }
      }, 1500);
    };
    
    window.addEventListener('popstate', () => {
      console.log('🔄 Voltar/Avançar detectado');
      observadorAtivo = false; // Reset
      setTimeout(() => {
        init();
        initWhatsAppButtons();
        if (location.href.includes('#event/Event')) {
          console.log('📅 Página de eventos detectada, inicializando botão...');
          setTimeout(() => {
            initDateUpdater();
          }, 2000);
        }
      }, 1500);
    });
    
    // Observar mudanças no hash (âncora da URL)
    window.addEventListener('hashchange', () => {
      console.log('🔄 Hash mudou:', location.hash);
      observadorAtivo = false; // Reset
      setTimeout(() => {
        init();
        initWhatsAppButtons();
        if (location.href.includes('#event/Event')) {
          console.log('📅 Página de eventos detectada via hashchange');
          setTimeout(() => {
            initDateUpdater();
          }, 2000);
        }
      }, 1500);
    });
  }

  function addRowClickListeners() {
    // Tentar primeiro o seletor específico
    let eventTable = document.querySelector('#event-process-table-ALL tbody');
    
    // Se não encontrou, tentar o genérico
    if (!eventTable) {
      const allTbodies = document.querySelectorAll('table tbody');
      for (const tbody of allTbodies) {
        if (tbody.querySelectorAll('tr').length > 0) {
          eventTable = tbody;
          break;
        }
      }
    }
    
    if (eventTable) {
      eventTable.addEventListener('mouseover', (e) => {
        const row = e.target.closest('tr');
        if (row && row.parentElement.tagName === 'TBODY') {
          hoveredRow = row;
        }
      });
    }
  }

  function initWhatsAppButtons() {
    // Esta função inicializa os botões do WhatsApp na página de detalhes
    // (onde já funcionava antes - não na lista de eventos)
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initWhatsAppButtons);
      return;
    }
    
    // Verificar se NÃO está na lista de eventos
    const isListaEventos = window.location.href.includes('#event/Event') && 
                           !window.location.href.includes('?id=');
    
    if (isListaEventos) {
      console.log('ℹ️ Está na lista de eventos - botões do WhatsApp não serão criados aqui');
      return;
    }
    
    // Tentar múltiplas vezes até encontrar a tabela
    let tentativas = 0;
    const maxTentativas = 10;
    
    const tentar = () => {
      tentativas++;
      console.log(`🔍 [WhatsApp] Tentativa ${tentativas}/${maxTentativas}...`);
      
      const rows = document.querySelectorAll('#event-process-table-ALL tbody tr');
      
      if (rows.length > 0) {
        console.log(`✅ [WhatsApp] Encontradas ${rows.length} linhas!`);
        createButton();
        addRowClickListeners();
        observeTableChanges();
        console.log('✅ Botões do WhatsApp carregados com sucesso!');
      } else if (tentativas < maxTentativas) {
        console.log(`⏳ [WhatsApp] Tabela ainda não carregou, tentando novamente em 1s...`);
        setTimeout(tentar, 1000);
      } else {
        console.log('ℹ️ [WhatsApp] Tabela não encontrada (normal se não estiver na página de detalhes)');
      }
    };
    
    setTimeout(tentar, 2000);
  }
  
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Verificar se está na página de eventos (Central de Eventos)
    // A URL pode ser #event/Event (lista) ou outras variações
    const isListaEventos = window.location.href.includes('#event/Event');
    const temEventoId = window.location.href.includes('?id=');
    
    // Se tem ID na URL, é um evento individual, não a lista
    if (temEventoId) {
      console.log('ℹ️ Está visualizando um evento individual');
      return;
    }
    
    if (!isListaEventos) {
      console.log('ℹ️ Não está na página de eventos');
      return;
    }
    
    // Na página de lista, APENAS observar finalizações (sem criar botões)
    console.log('📋 Página de lista de eventos detectada');
    
    // Tentar múltiplas vezes até encontrar a tabela
    let tentativas = 0;
    const maxTentativas = 10;
    
    const tentar = () => {
      tentativas++;
      console.log(`🔍 Tentativa ${tentativas}/${maxTentativas} de encontrar tabela de eventos...`);
      
      // Tentar diferentes seletores para a tabela
      let rows = document.querySelectorAll('#event-process-table-ALL tbody tr');
      
      if (rows.length === 0) {
        // Tentar outros seletores possíveis
        rows = document.querySelectorAll('table tbody tr');
        console.log(`🔍 Tentando seletor genérico... encontradas ${rows.length} linhas`);
      }
      
      if (rows.length > 0) {
        console.log(`✅ Encontradas ${rows.length} linhas na tabela!`);
        // NÃO criar botões nesta página (lista de eventos)
        // createButton();
        // addRowClickListeners();
        // observeTableChanges();
        
        // APENAS iniciar o observador de finalizações
        observarFinalizacaoDeTratativas();
        console.log('✅ Observador de finalizações ativado!');
      } else if (tentativas < maxTentativas) {
        console.log(`⏳ Tabela ainda não carregou, tentando novamente em 1s...`);
        setTimeout(tentar, 1000);
      } else {
        console.log('⚠️ Tabela não encontrada após 10 tentativas');
      }
    };
    
    setTimeout(tentar, 2000);
  }

  // Injeta o leitor que roda no contexto da página (acessa o knockout `ko`)
  function injetarLeitorDePagina() {
    try {
      const s = document.createElement('script');
      s.src = chrome.runtime.getURL('page-reader.js');
      s.onload = function () { this.remove(); };
      (document.head || document.documentElement).appendChild(s);
      console.log('📥 Leitor de página (page-reader.js) injetado.');
    } catch (e) {
      console.log('⚠️ Não foi possível injetar o leitor de página:', e);
    }
  }

  // ========== ABRIR LINK AUTOMATICAMENTE APÓS FINALIZAR ==========
  
  // Armazena informações das linhas visíveis para detectar quando desaparecem
  let linhasVisiveis = new Map(); // Map<id, {row, link, timestamp, abaAtual}>
  
  // Armazena a última classificação selecionada no modal
  let ultimaClassificacao = '';
  
  // Flag para detectar mudança de filtro (quando múltiplas linhas desaparecem de uma vez)
  let filtroMudouRecentemente = false;
  let timeoutFiltro = null;
  
  // Detecta qual aba está ativa no momento
  function getAbaAtiva() {
    // 1. Tentar pelo seletor de abas do Bootstrap/Maxtrack
    const abaAtiva = document.querySelector('.nav-tabs .active, .nav-tabs li.active a, [role="tab"][aria-selected="true"]');
    if (abaAtiva) {
      // Limpar o texto removendo ícones, números, quebras de linha e espaços extras
      let texto = abaAtiva.textContent
        .replace(/event_available/gi, '')  // Remover ícone Material
        .replace(/detalhes/gi, '')         // Remover texto "detalhes"
        .replace(/\d+/g, '')               // Remover números (contadores)
        .replace(/\n+/g, ' ')              // Remover quebras de linha
        .replace(/\s+/g, ' ')              // Remover múltiplos espaços
        .trim()
        .toLowerCase();
      
      // Normalizar nomes conhecidos
      if (texto.includes('aberto')) return 'abertos';
      if (texto.includes('tratativa') || texto.includes('processando')) return 'em tratativa';
      if (texto.includes('finalizado') || texto.includes('concluído')) return 'finalizados';
      if (texto.includes('todos')) return 'todos';
      
      if (texto.length > 0 && texto.length < 30) return texto;
    }
    
    // 2. Fallback: verificar pela URL
    const url = window.location.href.toLowerCase();
    if (url.includes('status=open') || url.includes('abertos')) return 'abertos';
    if (url.includes('status=processing') || url.includes('tratativa')) return 'em tratativa';
    if (url.includes('status=closed') || url.includes('finalizados')) return 'finalizados';
    
    // 3. Verificar badges/filtros ativos que indiquem o status
    const badgeAtivo = document.querySelector('.badge.active, .filter-badge.active, [class*="badge"][class*="active"]');
    if (badgeAtivo) {
      const text = badgeAtivo.textContent.trim().toLowerCase();
      if (text.includes('aberto')) return 'abertos';
      if (text.includes('tratativa') || text.includes('processando')) return 'em tratativa';
      if (text.includes('finalizado')) return 'finalizados';
    }
    
    // Não precisa mais logar warning - a aba não é mais crítica para a lógica
    return 'desconhecida';
  }
  
  function extrairIdDoEvento(row) {
    if (!row) return null;
    const rowId = row.id || row.getAttribute('id');
    if (rowId && rowId.startsWith('event-line-row-')) {
      return rowId.replace('event-line-row-', '');
    }
    const match = rowId ? rowId.match(/([a-f0-9]{24,32})/i) : null;
    return match ? match[1] : null;
  }
  
  function extrairLinkDaLinha(row) {
    const id = extrairIdDoEvento(row);
    if (id) {
      return `https://go.maxtrack.com.br/#event/Event?id=${id}`;
    }
    return null;
  }
  
  function linhaTemTratativa(row) {
    if (!row) return false;
    
    // Procurar pelo ícone de "play_circle" ou texto "Evidências disponíveis"
    const text = row.textContent.toLowerCase();
    
    // Se tem esses indicadores, significa que tem uma tratativa em andamento
    return text.includes('play_circle') || 
           text.includes('evidências disponíveis') ||
           text.includes('evidencias disponíveis');
  }
  
  function ehClassificacaoFalsoPositivo(classificacao) {
    if (!classificacao) return false;
    
    const text = classificacao.toLowerCase();
    
    return text.includes('falso positivo') ||
           text.includes('falso-positivo') ||
           text.includes('false positive') ||
           text.includes('alerta falso positivo') ||
           text.includes('alerta inválido') ||
           text.includes('alerta invalido') ||
           text.includes('inválido') ||
           text.includes('invalido') ||
           text.includes('desconsiderado') ||
           text.includes('invalidado') ||
           text.includes('não procedente') ||
           text.includes('nao procedente');
  }
  
  // Detecta cliques nos filtros (badges roxos no topo)
  function observarMudancasDeFiltro() {
    document.addEventListener('click', (e) => {
      // Verificar se clicou em um filtro (badge de criticidade, status, etc)
      const target = e.target;
      const isBadge = target.classList.contains('badge') || 
                      target.classList.contains('company-background-color') ||
                      target.closest('.badge') ||
                      target.closest('[class*="badge"]');
      
      if (isBadge) {
        console.log('🔄 Filtro clicado - ignorando desaparecimentos temporários');
        filtroMudouRecentemente = true;
        
        // Limpar timeout anterior se existir
        if (timeoutFiltro) clearTimeout(timeoutFiltro);
        
        // Após 2 segundos, voltar ao normal
        timeoutFiltro = setTimeout(() => {
          filtroMudouRecentemente = false;
          console.log('✅ Filtro estabilizado - voltando ao normal');
        }, 2000);
      }
    }, true);
  }
  
  // Observa o modal de classificação para capturar a seleção
  function observarModalClassificacao() {
    const observer = new MutationObserver(() => {
      // Procurar pelo modal de classificação
      const modal = document.querySelector('[data-bind*="classification"]') ||
                    document.querySelector('.modal:not([style*="display: none"])') ||
                    document.querySelector('[role="dialog"]');
      
      if (modal) {
        // Procurar pelo select ou texto de classificação
        const selects = modal.querySelectorAll('select, input, [class*="select"]');
        const labels = modal.querySelectorAll('label, span, div');
        
        // Verificar o valor selecionado
        for (const select of selects) {
          if (select.value && select.value.length > 3) {
            ultimaClassificacao = select.value;
            console.log('📋 Classificação detectada:', ultimaClassificacao);
          }
        }
        
        // Verificar texto visível no modal
        for (const label of labels) {
          const text = label.textContent.trim();
          if (text.toLowerCase().includes('classificação:') || 
              text.toLowerCase().includes('alerta falso positivo')) {
            // Pegar o próximo elemento ou o texto seguinte
            const nextText = label.nextElementSibling?.textContent || text;
            if (nextText.length > 5) {
              ultimaClassificacao = nextText;
              console.log('� Classificação detectada no modal:', ultimaClassificacao);
            }
          }
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  let observadorAtivo = false;
  
  function observarFinalizacaoDeTratativas() {
    // Verificar se já está ativo
    if (observadorAtivo) {
      console.log('ℹ️ Observador de finalizações já está ativo');
      return;
    }
    
    // Verificar se está na página de eventos
    if (!window.location.href.includes('#event/Event')) {
      console.log('ℹ️ Não está na página de eventos, observador não será ativado');
      return;
    }
    
    // Se está numa página de evento individual (com ?id=), não ativar
    if (window.location.href.includes('?id=')) {
      console.log('ℹ️ Está visualizando um evento individual, observador não necessário aqui');
      return;
    }
    
    console.log('🔍 Iniciando observador de finalizações de tratativas...');
    
    // Tentar encontrar a tabela - primeiro pelo ID específico, depois genérico
    let tableBody = document.querySelector('#event-process-table-ALL tbody');
    
    if (!tableBody) {
      // Tentar encontrar qualquer tbody de tabela na página
      const allTbodies = document.querySelectorAll('table tbody');
      console.log(`🔍 Procurando tbody... encontrados ${allTbodies.length} elementos`);
      
      // Pegar o primeiro tbody que tenha linhas
      for (const tbody of allTbodies) {
        if (tbody.querySelectorAll('tr').length > 0) {
          tableBody = tbody;
          console.log('✅ Tbody encontrado com', tbody.querySelectorAll('tr').length, 'linhas');
          break;
        }
      }
    }
    
    if (!tableBody) {
      console.log('⚠️ Tbody da tabela não encontrado ainda (pode estar carregando)');
      return; // Não tentar novamente - o init() já faz isso
    }
    
    observadorAtivo = true;
    console.log('✅ Observador configurado na tabela');
    
    // Usar MutationObserver para detectar quando linhas são removidas
    const observer = new MutationObserver((mutations) => {
      // Contar quantas linhas foram removidas nesta mutação
      const linhasRemovidasAgora = [];
      
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === 'TR') {
              const id = extrairIdDoEvento(node);
              if (id && linhasVisiveis.has(id)) {
                const info = linhasVisiveis.get(id);
                if (info.tinhaTratativa) {
                  linhasRemovidasAgora.push({ id, info, node });
                }
              }
            }
          });
        }
      });
      
      if (linhasRemovidasAgora.length === 0) {
        // Se não há linhas removidas, apenas atualizar a lista
        if (mutations.some(m => m.addedNodes.length > 0 || m.type === 'childList')) {
          setTimeout(atualizarLinhasVisiveis, 100);
        }
        return;
      }
      
      // Aguardar um pouco para confirmar que a linha realmente foi removida
      setTimeout(() => {
        // Revalidar quais linhas ainda não existem no DOM
        const linhasRealmenteRemovidas = linhasRemovidasAgora.filter(({ id }) => {
          const linhaAindaExiste = document.getElementById(`event-line-row-${id}`) ||
                                   document.querySelector(`tr[id*="${id}"]`);
          return !linhaAindaExiste; // Retornar true se a linha NÃO existe mais
        });
        
        if (linhasRealmenteRemovidas.length === 0) {
          console.log('ℹ️ Falso alarme - linhas não foram realmente removidas');
          return;
        }
        
        // Se mais de 1 linha com tratativa foi removida ao mesmo tempo, é mudança de filtro
        if (linhasRealmenteRemovidas.length > 1) {
          console.log(`⚠️ ${linhasRealmenteRemovidas.length} linhas removidas ao mesmo tempo (MutationObserver) - mudança de filtro detectada. Ignorando.`);
          
          // Remover todas da lista mas não abrir links
          linhasRealmenteRemovidas.forEach(({ id }) => {
            linhasVisiveis.delete(id);
          });
          
          // Atualizar lista de linhas visíveis
          setTimeout(atualizarLinhasVisiveis, 100);
          return;
        }
        
        // Se apenas 1 linha foi removida, verificar o contexto antes de abrir
        if (linhasRealmenteRemovidas.length === 1) {
          const { id, info } = linhasRealmenteRemovidas[0];
          const abaAtual = getAbaAtiva();
          
          console.log('🗑️ Linha removida (confirmado):', id);
          console.log('   - Aba quando foi detectada:', info.abaAtual);
          console.log('   - Aba atual:', abaAtual);
          console.log('   - Última classificação:', ultimaClassificacao || '(nenhuma capturada)');
          
          // 🔍 REGRA: Se tem classificação capturada, usar ela como critério
          // Se não tem classificação, assumir que é mudança de filtro (foi pra "Em tratativa")
          if (ultimaClassificacao && ultimaClassificacao.length > 5) {
            // Tem classificação - é uma finalização real
            const ehFalsoPositivo = ehClassificacaoFalsoPositivo(ultimaClassificacao);
            
            if (ehFalsoPositivo) {
              console.log('❌ Link NÃO será aberto (Falso Positivo)');
              ultimaClassificacao = '';
            } else {
              console.log('✅ Link SERÁ aberto (Positiva - finalização com classificação)');
              
              showNotification('✅ Tratativa finalizada!', 'success', 'Abrindo evidências automaticamente...');
              
              // Aguardar 2.5 segundos para garantir que o alerta já desapareceu
              setTimeout(() => {
                console.log('🔗 Abrindo link automaticamente:', info.link);
                window.open(info.link, '_blank');
              }, 2500);
              
              ultimaClassificacao = '';
            }
          } else {
            // Não tem classificação - provavelmente foi para "Em tratativa"
            console.log('❌ Sem classificação detectada - provavelmente mudança de filtro. NÃO abrindo link.');
          }
          
          linhasVisiveis.delete(id);
        }
        
        // Atualizar lista de linhas visíveis
        setTimeout(atualizarLinhasVisiveis, 100);
      }, 300); // Aguardar 300ms para confirmar
    });
    
    // Observar mudanças no tbody (linhas adicionadas/removidas)
    observer.observe(tableBody, {
      childList: true,
      subtree: false
    });
    
    // Também observar mudanças nos atributos e conteúdo das linhas
    const observerAtributos = new MutationObserver(() => {
      // Atualizar informações das linhas quando o conteúdo mudar
      // Isso captura quando a classificação é alterada
      atualizarLinhasVisiveis();
    });
    
    observerAtributos.observe(tableBody, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: false
    });
    
    // Atualizar lista inicial
    atualizarLinhasVisiveis();
    
    // Backup: verificar periodicamente também (caso o MutationObserver falhe)
    // E também para atualizar a classificação das linhas
    setInterval(() => {
      atualizarLinhasVisiveis(); // Atualizar primeiro
      verificarLinhasDesaparecidas(); // Depois verificar
    }, 1000);
  }
  
  function atualizarLinhasVisiveis() {
    // Tentar primeiro o seletor específico, depois o genérico
    let rows = document.querySelectorAll('#event-process-table-ALL tbody tr');
    if (rows.length === 0) {
      rows = document.querySelectorAll('table tbody tr');
    }
    
    const idsAtuais = new Set();
    const abaAtual = getAbaAtiva();
    
    rows.forEach(row => {
      const id = extrairIdDoEvento(row);
      if (!id) return;
      
      idsAtuais.add(id);
      
      const tinhaTratativa = linhaTemTratativa(row);
      const link = extrairLinkDaLinha(row);
      
      if (!linhasVisiveis.has(id)) {
        // Nova linha detectada
        linhasVisiveis.set(id, {
          row: row,
          link: link,
          tinhaTratativa: tinhaTratativa,
          timestamp: Date.now(),
          abaAtual: abaAtual
        });
        
        if (tinhaTratativa) {
          console.log('📝 Nova linha com tratativa detectada:', id, 'na aba:', abaAtual);
        }
      } else {
        // Atualizar informação da linha existente
        const info = linhasVisiveis.get(id);
        info.tinhaTratativa = tinhaTratativa;
        info.row = row;
        info.abaAtual = abaAtual; // Atualizar a aba atual
      }
    });
  }
  
  function verificarLinhasDesaparecidas() {
    // Tentar primeiro o seletor específico, depois o genérico
    let rows = document.querySelectorAll('#event-process-table-ALL tbody tr');
    if (rows.length === 0) {
      rows = document.querySelectorAll('table tbody tr');
    }
    
    const idsAtuais = new Set();
    
    rows.forEach(row => {
      const id = extrairIdDoEvento(row);
      if (id) idsAtuais.add(id);
    });
    
    // Contar quantas linhas desapareceram nesta verificação
    const linhasDesaparecidas = [];
    linhasVisiveis.forEach((info, id) => {
      if (!idsAtuais.has(id) && info.tinhaTratativa) {
        // Verificar se a linha REALMENTE não existe mais no DOM
        const linhaAindaExiste = document.getElementById(`event-line-row-${id}`) ||
                                 document.querySelector(`tr[id*="${id}"]`);
        
        if (!linhaAindaExiste) {
          linhasDesaparecidas.push({ id, info });
        }
      }
    });
    
    // Se mais de 1 linha desapareceu ao mesmo tempo, provavelmente é mudança de filtro
    if (linhasDesaparecidas.length > 1) {
      console.log(`⚠️ ${linhasDesaparecidas.length} linhas desapareceram ao mesmo tempo - provavelmente mudança de filtro. Ignorando.`);
      
      // Remover todas as linhas que desapareceram
      linhasDesaparecidas.forEach(({ id }) => {
        linhasVisiveis.delete(id);
      });
      
      return; // Não abrir links
    }
    
    // Se apenas 1 linha desapareceu, verificar o contexto
    if (linhasDesaparecidas.length === 1) {
      const { id, info } = linhasDesaparecidas[0];
      const abaAtual = getAbaAtiva();
      
      console.log('🗑️ Linha desapareceu (confirmado - não existe no DOM):', id);
      console.log('   - Aba quando foi detectada:', info.abaAtual);
      console.log('   - Aba atual:', abaAtual);
      console.log('   - Última classificação:', ultimaClassificacao || '(nenhuma capturada)');
      
      // 🔍 REGRA: Se tem classificação capturada, usar ela como critério
      // Se não tem classificação, assumir que é mudança de filtro (foi pra "Em tratativa")
      if (ultimaClassificacao && ultimaClassificacao.length > 5) {
        // Tem classificação - é uma finalização real
        const ehFalsoPositivo = ehClassificacaoFalsoPositivo(ultimaClassificacao);
        
        if (ehFalsoPositivo) {
          console.log('❌ Link NÃO será aberto (Falso Positivo)');
          ultimaClassificacao = '';
        } else {
          console.log('✅ Link SERÁ aberto (Positiva - finalização com classificação)');
          
          showNotification('✅ Tratativa finalizada!', 'success', 'Abrindo evidências automaticamente...');
          
          // Aguardar 2.5 segundos para garantir que o alerta já desapareceu
          setTimeout(() => {
            console.log('🔗 Abrindo link automaticamente:', info.link);
            window.open(info.link, '_blank');
          }, 2500);
          
          ultimaClassificacao = '';
        }
      } else {
        // Não tem classificação - provavelmente foi para "Em tratativa"
        console.log('❌ Sem classificação detectada - provavelmente mudança de filtro. NÃO abrindo link.');
      }
      
      linhasVisiveis.delete(id);
    }
    
    // Limpar linhas que não estão mais visíveis mas não tinham tratativa
    linhasVisiveis.forEach((info, id) => {
      if (!idsAtuais.has(id)) {
        linhasVisiveis.delete(id);
      }
    });
  }

  // ========== FUNCIONALIDADE DE ATUALIZAÇÃO AUTOMÁTICA DE DATAS ==========
  function initDateUpdater() {
    // Verificar se estamos na página de eventos
    if (!window.location.href.includes('#event/Event')) {
      console.log('ℹ️ Não está na página de eventos, atualização de datas não será ativada');
      return;
    }
    
    // Evitar inicializar múltiplas vezes
    if (dateUpdaterInitialized) {
      console.log('ℹ️ Inicializador de datas já está ativo');
      return;
    }
    
    dateUpdaterInitialized = true;
    console.log('📅 Inicializando atualização automática de datas...');
    
    // Tentar criar o botão várias vezes com intervalos maiores
    let tentativas = 0;
    const maxTentativas = 20;
    
    const tentarCriar = () => {
      tentativas++;
      console.log(`📅 Tentativa ${tentativas}/${maxTentativas} de criar botão de data`);
      
      if (document.getElementById('maxtrack-date-updater-btn')) {
        console.log('✅ Botão já existe');
        return true;
      }
      
      createDateUpdateButton();
      
      if (document.getElementById('maxtrack-date-updater-btn')) {
        console.log('✅ Botão criado com sucesso!');
        return true;
      } else if (tentativas < maxTentativas) {
        setTimeout(tentarCriar, 500);
      } else {
        console.log('⚠️ Não foi possível criar o botão após várias tentativas');
        dateUpdaterInitialized = false; // Permitir tentar novamente
      }
      return false;
    };
    
    // Primeira tentativa imediata
    setTimeout(tentarCriar, 100);
    
    // Adicionar listener de clique na barra roxa de filtros
    setTimeout(() => {
      const badges = document.querySelectorAll('.badge.company-background-color');
      badges.forEach(badge => {
        badge.addEventListener('click', () => {
          console.log('📅 Clique na barra de filtros detectado, tentando criar botão...');
          setTimeout(() => {
            if (!document.getElementById('maxtrack-date-updater-btn')) {
              createDateUpdateButton();
            }
          }, 100);
        });
      });
      if (badges.length > 0) {
        console.log(`✅ Listeners adicionados a ${badges.length} badges`);
      }
    }, 500);
    
    // Observar mudanças no DOM
    let ultimaMutacao = Date.now();
    const observer = new MutationObserver(() => {
      // Evitar verificações muito frequentes
      const agora = Date.now();
      if (agora - ultimaMutacao < 500) return;
      ultimaMutacao = agora;
      
      if (!document.getElementById('maxtrack-date-updater-btn')) {
        // Verificar se há campos de data visíveis agora
        const camposData = document.querySelectorAll('input[type="text"]');
        let temCampoData = false;
        
        camposData.forEach(input => {
          if (!input.offsetParent) return; // Ignorar campos invisíveis
          const valor = input.value || '';
          if (valor.match(/\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}/)) {
            temCampoData = true;
          }
        });
        
        if (temCampoData) {
          console.log('📅 Campos de data detectados, criando botão...');
          createDateUpdateButton();
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Tentar criar o botão a cada 3 segundos (fallback)
    const intervalId = setInterval(() => {
      if (!document.getElementById('maxtrack-date-updater-btn')) {
        createDateUpdateButton();
      }
    }, 3000);
    
    // Limpar quando sair da página de eventos
    const clearOnNavigate = () => {
      if (!window.location.href.includes('#event/Event')) {
        clearInterval(intervalId);
        dateUpdaterInitialized = false;
        console.log('📅 Saiu da página de eventos, limpando inicializador');
      }
    };
    
    window.addEventListener('hashchange', clearOnNavigate);
  }

  function createDateUpdateButton() {
    // Verificar se o botão já existe
    if (document.getElementById('maxtrack-date-updater-btn')) {
      return;
    }
    
    // Procurar pelo container que tem os campos de data editáveis (Período: 27/07/2026 00:00:00)
    // Esses campos estão em inputs, não em badges
    const todosInputs = document.querySelectorAll('input[type="text"]');
    let camposPeriodo = [];
    
    todosInputs.forEach(input => {
      const valor = input.value || '';
      // Procurar inputs com data no formato DD/MM/YYYY HH:MM:SS
      if (valor.match(/\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}/)) {
        camposPeriodo.push(input);
      }
    });
    
    if (camposPeriodo.length < 2) {
      console.log('⚠️ Campos de período não encontrados (painel pode estar fechado)');
      return;
    }
    
    console.log(`✅ Encontrados ${camposPeriodo.length} campos de data`);
    
    // Pegar o primeiro campo (Período início)
    const primeiroCampo = camposPeriodo[0];
    
    // Encontrar o container pai que contém os dois campos
    let containerRegistro = primeiroCampo;
    for (let i = 0; i < 10; i++) {
      containerRegistro = containerRegistro.parentElement;
      if (!containerRegistro) break;
      
      // Procurar um container que tenha largura suficiente e contenha ambos campos
      const contemAmbos = containerRegistro.contains(camposPeriodo[0]) && 
                          containerRegistro.contains(camposPeriodo[1]);
      const larguraOk = containerRegistro.getBoundingClientRect().width > 300;
      
      if (contemAmbos && larguraOk) {
        console.log('✅ Container do registro encontrado:', containerRegistro);
        break;
      }
    }
    
    // Criar o botão
    const button = document.createElement('button');
    button.id = 'maxtrack-date-updater-btn';
    button.className = 'btn btn-primary';
    button.innerHTML = `
      <i class="ma-icon-outlined" style="margin-right: 4px;">event</i>
      Atualizar Turno
    `;
    button.title = 'Configura período padrão do turno: ontem até depois de amanhã';
    button.type = 'button';
    button.style.marginLeft = '10px';
    button.style.marginTop = '5px';
    
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('📅 Botão clicado');
      await updateDateFilters();
    });
    
    // Procurar onde inserir o botão - próximo ao label "Período" ou após os campos
    const labels = containerRegistro.querySelectorAll('label, span, div');
    let labelPeriodo = null;
    
    for (const label of labels) {
      if (label.textContent.trim().toLowerCase() === 'período') {
        labelPeriodo = label;
        break;
      }
    }
    
    if (labelPeriodo && labelPeriodo.parentElement) {
      // Inserir após o label "Período"
      const wrapper = document.createElement('div');
      wrapper.style.display = 'inline-block';
      wrapper.style.marginLeft = '10px';
      wrapper.appendChild(button);
      
      labelPeriodo.parentElement.appendChild(wrapper);
      console.log('✅ Botão inserido após o label Período');
    } else {
      // Fallback: inserir antes do primeiro campo
      const wrapper = document.createElement('div');
      wrapper.style.marginBottom = '10px';
      wrapper.appendChild(button);
      
      primeiroCampo.parentElement.insertBefore(wrapper, primeiroCampo);
      console.log('✅ Botão inserido antes do primeiro campo');
    }
  }

  async function updateDateFilters() {
    console.log('📅 Atualizando filtros de data...');
    
    try {
      // Calcular as datas
      const hoje = new Date();
      const ontem = new Date(hoje);
      ontem.setDate(hoje.getDate() - 1);
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 2);
      
      // Formatar datas (DD/MM/YYYY HH:MM:SS para o Maxtrack)
      const formatarData = (data) => {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano} 00:00:00`;
      };
      
      const dataInicio = formatarData(ontem);
      const dataFim = formatarData(amanha);
      
      console.log(`📅 Período: ${dataInicio} até ${dataFim}`);
      
      // Procurar todos os inputs de texto (Maxtrack usa inputs de texto, não date)
      const todosInputs = document.querySelectorAll('input[type="text"], input:not([type])');
      console.log(`🔍 Total de inputs encontrados: ${todosInputs.length}`);
      
      let campoInicio = null;
      let campoFim = null;
      
      // Procurar pelos campos analisando data-bind, id, name, placeholder e labels próximos
      todosInputs.forEach((campo, index) => {
        const dataBind = campo.getAttribute('data-bind') || '';
        const name = campo.name || '';
        const placeholder = campo.placeholder || '';
        const id = campo.id || '';
        const valor = campo.value || '';
        
        // Procurar label associado
        let label = '';
        const labelElement = campo.closest('label');
        if (labelElement) {
          label = labelElement.textContent || '';
        } else {
          // Procurar label anterior
          const prevElement = campo.previousElementSibling;
          if (prevElement && prevElement.tagName === 'LABEL') {
            label = prevElement.textContent || '';
          }
        }
        
        // Log para debug
        if (dataBind || valor.includes('/') || label.toLowerCase().includes('per') || label.toLowerCase().includes('data')) {
          console.log(`  Input ${index}:`, {
            dataBind: dataBind.substring(0, 50),
            name,
            id,
            placeholder,
            label: label.substring(0, 30),
            valor: valor.substring(0, 20)
          });
        }
        
        // Verificar se é um campo de data (tem data-bind com date ou dateTime)
        const isDateField = dataBind.includes('date') || dataBind.includes('Date') || 
                           valor.match(/\d{2}\/\d{2}\/\d{4}/) ||
                           placeholder.toLowerCase().includes('data');
        
        if (!isDateField) return;
        
        // Identificar campo de INÍCIO
        if (!campoInicio && (
          dataBind.toLowerCase().includes('startdate') ||
          dataBind.toLowerCase().includes('inicio') ||
          dataBind.toLowerCase().includes('begin') ||
          dataBind.toLowerCase().includes('from') ||
          label.toLowerCase().includes('início') ||
          label.toLowerCase().includes('inicio') ||
          label.toLowerCase().includes('de ') ||
          label.toLowerCase().includes('período') && index < todosInputs.length / 2
        )) {
          campoInicio = campo;
          console.log(`✅ Campo de INÍCIO identificado:`, campo);
        }
        
        // Identificar campo de FIM
        if (!campoFim && (
          dataBind.toLowerCase().includes('enddate') ||
          dataBind.toLowerCase().includes('fim') ||
          dataBind.toLowerCase().includes('end') ||
          dataBind.toLowerCase().includes('to') ||
          dataBind.toLowerCase().includes('ate') ||
          label.toLowerCase().includes('fim') ||
          label.toLowerCase().includes('até') ||
          label.toLowerCase().includes('ate')
        )) {
          campoFim = campo;
          console.log(`✅ Campo de FIM identificado:`, campo);
        }
      });
      
      // Se não encontrou, tentar pelos dois primeiros campos que têm data no formato DD/MM/YYYY
      if (!campoInicio || !campoFim) {
        console.log('⚠️ Não identificou pelos nomes, procurando por campos com datas...');
        const camposComData = Array.from(todosInputs).filter(campo => {
          return campo.value.match(/\d{2}\/\d{2}\/\d{4}/);
        });
        
        console.log(`📅 Campos com formato de data: ${camposComData.length}`);
        
        if (camposComData.length >= 2) {
          campoInicio = camposComData[0];
          campoFim = camposComData[1];
          console.log('✅ Usando os dois primeiros campos com data');
        }
      }
      
      if (!campoInicio || !campoFim) {
        showNotification('⚠️ Campos de data não encontrados!', 'warning', 'Clique na barra roxa de filtros para expandir primeiro');
        console.error('❌ Campos de data não encontrados. Clique na barra roxa de filtros para expandir.');
        return;
      }
      
      console.log('📝 Campos identificados:', {
        inicio: campoInicio.getAttribute('data-bind')?.substring(0, 50),
        fim: campoFim.getAttribute('data-bind')?.substring(0, 50)
      });
      
      // Atualizar os campos usando knockout se disponível
      const atualizarCampo = (campo, valor) => {
        try {
          // Se usar knockout (data-bind presente)
          if (typeof ko !== 'undefined' && campo.getAttribute('data-bind')) {
            const context = ko.contextFor(campo);
            if (context) {
              const binding = campo.getAttribute('data-bind');
              // Procurar pelo observable no data-bind
              const match = binding.match(/value:\s*([^,\s\}]+)/);
              if (match) {
                const observableName = match[1].trim();
                // Navegar pelo context para encontrar o observable
                const parts = observableName.split('.');
                let observable = context.$data;
                for (const part of parts) {
                  if (observable && observable[part]) {
                    observable = observable[part];
                  }
                }
                // Se encontrou e é uma função (observable), atualizar
                if (observable && typeof observable === 'function') {
                  observable(valor);
                  console.log(`✅ Campo atualizado via Knockout: ${valor}`);
                  return;
                }
              }
            }
          }
        } catch (e) {
          console.log('⚠️ Erro ao atualizar via knockout:', e);
        }
        
        // Fallback: atualizar diretamente o valor
        campo.value = valor;
        campo.dispatchEvent(new Event('input', { bubbles: true }));
        campo.dispatchEvent(new Event('change', { bubbles: true }));
        campo.dispatchEvent(new Event('blur', { bubbles: true }));
        console.log(`✅ Campo atualizado diretamente: ${valor}`);
      };
      
      atualizarCampo(campoInicio, dataInicio);
      atualizarCampo(campoFim, dataFim);
      
      console.log(`✅ Campos atualizados: Início=${dataInicio}, Fim=${dataFim}`);
      
      showNotification('✅ Período atualizado!', 'success', `${dataInicio.split(' ')[0]} até ${dataFim.split(' ')[0]}`);
      
      // Tentar clicar no botão "Atualizar Período" do Maxtrack após 500ms
      setTimeout(() => {
        const botaoAtualizar = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Atualizar Período') || btn.textContent.includes('Atualizar')
        );
        
        if (botaoAtualizar && botaoAtualizar.id !== 'maxtrack-date-updater-btn') {
          console.log('🔄 Clicando no botão "Atualizar Período" do Maxtrack...');
          botaoAtualizar.click();
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar datas:', error);
      showNotification('❌ Erro ao atualizar datas', 'error', error.message);
    }
  }

})();


  // ========== MELHORIAS NO PLAYER DE VÍDEO ==========
  
  // Abre o vídeo em tela cheia
  function abrirVideoTelaCheia(video) {
    // Marcar como já aberto para evitar duplicação
    if (video.dataset.fullscreenOpened) return;
    video.dataset.fullscreenOpened = 'true';
    
    // Criar overlay de tela cheia
    const overlay = document.createElement('div');
    overlay.className = 'maxtrack-video-fullscreen';
    
    // Clonar o vídeo
    const videoClone = video.cloneNode(true);
    videoClone.controls = true;
    videoClone.autoplay = true;
    videoClone.currentTime = video.currentTime; // Manter posição atual
    
    // Criar botão fechar
    const btnClose = document.createElement('button');
    btnClose.className = 'maxtrack-close-fullscreen';
    btnClose.innerHTML = '✕';
    btnClose.title = 'Fechar (ESC)';
    
    // Evento de fechar
    const fecharTelaCheia = () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
        // Permitir reabrir se necessário
        video.dataset.fullscreenOpened = 'false';
      }
    };
    
    btnClose.addEventListener('click', fecharTelaCheia);
    
    // Fechar com ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        fecharTelaCheia();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    // Montar overlay
    overlay.appendChild(videoClone);
    overlay.appendChild(btnClose);
    document.body.appendChild(overlay);
    
    // Focar no vídeo
    videoClone.focus();
    
    console.log('🎬 Vídeo aberto em tela cheia automaticamente');
    showNotification('🎬 Vídeo em tela cheia', 'success', 'Pressione ESC para fechar');
  }
  
  // Aumenta automaticamente os vídeos quando detectados
  function melhorarVideos() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
      // Se o vídeo ainda não foi processado
      if (!video.dataset.autoFullscreenProcessed) {
        video.dataset.autoFullscreenProcessed = 'true';
        
        // Aguardar o vídeo carregar para abrir em tela cheia
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA ou melhor
          abrirVideoTelaCheia(video);
        } else {
          // Aguardar o vídeo carregar
          video.addEventListener('loadeddata', () => {
            abrirVideoTelaCheia(video);
          }, { once: true });
          
          // Fallback: se demorar muito, abrir mesmo assim após 1 segundo
          setTimeout(() => {
            if (!video.dataset.fullscreenOpened) {
              abrirVideoTelaCheia(video);
            }
          }, 1000);
        }
        
        console.log('🎬 Vídeo detectado - abrindo em tela cheia automaticamente');
      }
    });
  }
  
  // Observador para detectar novos vídeos
  function observarVideos() {
    // Executar uma vez ao carregar
    melhorarVideos();
    
    // Observar mudanças no DOM para detectar novos vídeos
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) { // Element node
            // Verificar se é um vídeo ou contém vídeos
            if (node.tagName === 'VIDEO') {
              setTimeout(() => {
                if (!node.dataset.autoFullscreenProcessed) {
                  node.dataset.autoFullscreenProcessed = 'true';
                  
                  // Aguardar carregar e abrir em tela cheia
                  if (node.readyState >= 2) {
                    abrirVideoTelaCheia(node);
                  } else {
                    node.addEventListener('loadeddata', () => {
                      abrirVideoTelaCheia(node);
                    }, { once: true });
                    
                    setTimeout(() => {
                      if (!node.dataset.fullscreenOpened || node.dataset.fullscreenOpened === 'false') {
                        abrirVideoTelaCheia(node);
                      }
                    }, 1000);
                  }
                }
              }, 300);
            } else if (node.querySelector) {
              const videos = node.querySelectorAll('video');
              videos.forEach(video => {
                setTimeout(() => {
                  if (!video.dataset.autoFullscreenProcessed) {
                    video.dataset.autoFullscreenProcessed = 'true';
                    
                    if (video.readyState >= 2) {
                      abrirVideoTelaCheia(video);
                    } else {
                      video.addEventListener('loadeddata', () => {
                        abrirVideoTelaCheia(video);
                      }, { once: true });
                      
                      setTimeout(() => {
                        if (!video.dataset.fullscreenOpened || video.dataset.fullscreenOpened === 'false') {
                          abrirVideoTelaCheia(video);
                        }
                      }, 1000);
                    }
                  }
                }, 300);
              });
            }
          }
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Verificar periodicamente também (backup)
    setInterval(melhorarVideos, 3000);
    
    console.log('👁️ Observador de vídeos ativado - modo tela cheia automático');
  }
  
  // ========== INICIALIZAÇÃO ==========
  
  // Carrega o script ao iniciar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('🚀 Maxtrack WhatsApp Helper carregado!');
      injetarLeitorDePagina();
      observarPopoverMotivos();
      observarUrlChanges();
      observarMudancasDeFiltro();
      observarModalClassificacao();
      observarVideos(); // Ativar observador de vídeos
      init();
      initWhatsAppButtons();
      
      // Se já está na página de eventos, tentar inicializar botão de data
      if (window.location.href.includes('#event/Event')) {
        setTimeout(() => {
          initDateUpdater();
        }, 2000);
      }
    });
  } else {
    console.log('🚀 Maxtrack WhatsApp Helper carregado!');
    injetarLeitorDePagina();
    observarPopoverMotivos();
    observarUrlChanges();
    observarMudancasDeFiltro();
    observarModalClassificacao();
    observarVideos(); // Ativar observador de vídeos
    init();
    initWhatsAppButtons();
    
    // Se já está na página de eventos, tentar inicializar botão de data
    if (window.location.href.includes('#event/Event')) {
      setTimeout(() => {
        initDateUpdater();
      }, 2000);
    }
  }

})();
