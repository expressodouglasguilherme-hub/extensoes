/**
 * page-reader.js — roda NO CONTEXTO DA PÁGINA (tem acesso ao knockout)
 *
 * Lê SOMENTE o caminho conhecido do motivo selecionado da tratativa:
 *   dataFor(linha).event.processing.classification.reasons
 * (fallback: último item de event.processing.history -> data.classification.reasons)
 *
 * SEGURANÇA: este script percorre APENAS propriedades de dados nomeadas nesse
 * caminho específico. Ele NÃO enumera objetos nem chama funções arbitrárias
 * (para não disparar ações do sistema, como aconteceu na versão anterior).
 */
(function () {
  'use strict';

  var KO = null;
  function obterKo() {
    if (KO && typeof KO.dataFor === 'function') return KO;
    try { if (window.ko && typeof window.ko.dataFor === 'function') { KO = window.ko; return KO; } } catch (e) {}
    var reqs = [];
    try { if (typeof window.require === 'function') reqs.push(window.require); } catch (e) {}
    try { if (typeof window.requirejs === 'function') reqs.push(window.requirejs); } catch (e) {}
    var nomes = ['knockout', 'ko', 'knockoutjs'];
    for (var i = 0; i < reqs.length; i++) {
      for (var j = 0; j < nomes.length; j++) {
        try { var m = reqs[i](nomes[j]); if (m && typeof m.dataFor === 'function') { KO = m; return KO; } } catch (e) {}
      }
    }
    return null;
  }

  // Resolve um valor: se for observable do knockout (função SEM argumentos),
  // chama para ler. Como só usamos isso em propriedades de DADO conhecidas
  // (event, processing, classification, reasons, history, data), é seguro.
  function ler(v) {
    if (typeof v === 'function') {
      try { return v(); } catch (e) { return null; }
    }
    return v;
  }

  // Segue um caminho de propriedades nomeadas, resolvendo observables no meio.
  function seguir(obj, nomes) {
    var atual = ler(obj);
    for (var i = 0; i < nomes.length; i++) {
      if (atual == null || typeof atual !== 'object') return null;
      atual = ler(atual[nomes[i]]);
    }
    return atual;
  }

  function normalizarReasons(r) {
    r = ler(r);
    if (r == null) return '';
    if (Array.isArray(r)) {
      var arr = [];
      for (var i = 0; i < r.length; i++) {
        var x = ler(r[i]);
        if (x == null) continue;
        arr.push(String(x).replace(/\s+/g, ' ').trim());
      }
      return arr.filter(function (t) { return t.length > 0; }).join(' | ');
    }
    return String(r).replace(/\s+/g, ' ').trim();
  }

  function lerMotivoSelecionado(el) {
    var k = obterKo();
    if (!k) return '';
    var d;
    try { d = k.dataFor(el); } catch (e) { return ''; }
    if (!d) return '';

    // Caminho principal: event.processing.classification.reasons
    var r = seguir(d, ['event', 'processing', 'classification', 'reasons']);
    var t = normalizarReasons(r);
    if (t && t.length > 3) return t;

    // Fallback: último item do histórico -> data.classification.reasons
    try {
      var hist = seguir(d, ['event', 'processing', 'history']);
      hist = ler(hist);
      if (Array.isArray(hist)) {
        for (var i = hist.length - 1; i >= 0; i--) {
          var item = ler(hist[i]);
          if (!item) continue;
          var rr = seguir(item, ['data', 'classification', 'reasons']);
          var tt = normalizarReasons(rr);
          if (tt && tt.length > 3) return tt;
        }
      }
    } catch (e) {}

    return '';
  }

  // Atende ao pedido do content script (síncrono) e grava o resultado na linha.
  document.addEventListener('MAXTRACK_MOTIVO_REFRESH', function () {
    try {
      var alvo = document.querySelector('[data-motivo-target]');
      if (!alvo) { console.log('🔎 page-reader: nenhuma linha marcada.'); return; }
      var motivo = lerMotivoSelecionado(alvo);
      if (motivo) {
        alvo.setAttribute('data-motivos-text', motivo);
        console.log('🔎 page-reader: motivo lido = "' + motivo.slice(0, 80) + '..."');
      } else {
        alvo.removeAttribute('data-motivos-text');
        console.log('🔎 page-reader: motivo não encontrado no dado da linha.');
      }
    } catch (e) {
      console.log('🔎 page-reader erro:', e && e.message);
    }
  });

  console.log('✅ page-reader pronto (modo seguro, só leitura do caminho conhecido).');
})();
