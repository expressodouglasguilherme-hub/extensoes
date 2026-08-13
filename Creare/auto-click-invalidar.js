// ============================================================
// AUTO-CLICK NO POPUP DE INVALIDAR
// Verifica periodicamente se o popup está visível e clica em OK
// ============================================================

// Intervalo que verifica a cada 200ms se o popup está visível
setInterval(() => {
  // Só executa se o auto-finalize estiver ativado
  const autoFinalizeEnabled = localStorage.getItem('auto_finalize_alerts_enabled');
  if (!autoFinalizeEnabled || autoFinalizeEnabled === 'false') {
    return;
  }
  
  // Procura pelo popup de invalidar (ajs-dialog visível)
  const popups = document.querySelectorAll('.ajs-dialog, .ajs-modal');
  
  for (const popup of popups) {
    // Verifica se está visível
    const isVisible = popup.offsetParent !== null &&
                      window.getComputedStyle(popup).display !== 'none' &&
                      window.getComputedStyle(popup).visibility !== 'hidden';
    
    if (!isVisible) continue;
    
    const text = popup.textContent || '';
    
    // Verifica se é popup de invalidar
    const hasInvalidar = text.includes('invalidar');
    const hasCerteza = text.includes('tem certeza');
    const hasAlerta = text.includes('alerta');
    
    if (hasInvalidar && hasCerteza && hasAlerta) {
      console.log('🎯 Auto-Invalidar: Popup de INVALIDAR detectado!');
      
      // Procura botão OK
      const buttons = popup.querySelectorAll('button, .btn, [role="button"]');
      let okButton = null;
      
      for (const btn of buttons) {
        const btnText = btn.textContent.trim().toUpperCase();
        if (btnText === 'OK') {
          okButton = btn;
          break;
        }
      }
      
      if (okButton && okButton.offsetParent !== null) {
        console.log('🖱️ Auto-Invalidar: Clicando no botão OK...');
        
        // Dispara múltiplos eventos de clique
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
          const evt = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1
          });
          okButton.dispatchEvent(evt);
        });
        
        okButton.click();
        
        // Esconde o popup após 100ms
        setTimeout(() => {
          popup.style.display = 'none';
          console.log('✅ Auto-Invalidar: Popup ocultado!');
          
          // Remove backdrops
          const backdrops = document.querySelectorAll('.ajs-dimmer, [class*="backdrop"]');
          backdrops.forEach(backdrop => {
            if (backdrop.offsetParent !== null) {
              backdrop.style.display = 'none';
            }
          });
        }, 100);
        
        break; // Processa apenas um popup por vez
      }
    }
  }
}, 200); // Verifica a cada 200ms

console.log('✅ Auto-Click Invalidar: Sistema ativo! (verifica a cada 200ms)');
