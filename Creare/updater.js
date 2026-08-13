// ============================================================
// AUTO-UPDATER - Creare Extension
// Verifica atualizações no GitHub automaticamente
// ============================================================

const GITHUB_UPDATE_CONFIG = {
  // CONFIGURE AQUI:
  owner: 'expressodouglasguilherme-hub',  // Seu username
  repo: 'extensoes',                       // Nome do repositório
  branch: 'main',                          // Branch (main ou master)
  folder: 'Creare',                        // Pasta da extensão
  checkInterval: 15 * 60 * 1000,          // Verifica a cada 15 minutos
  
  // URLs (não precisa mexer)
  get versionUrl() {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.folder}/version.json`;
  },
  get filesBaseUrl() {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.folder}/`;
  }
};

class ExtensionUpdater {
  constructor() {
    this.currentVersion = chrome.runtime.getManifest().version;
    this.checking = false;
  }

  // Verifica se há atualização disponível
  async checkForUpdates(manual = false) {
    if (this.checking) {
      console.log('🔄 Já está verificando atualizações...');
      return;
    }

    this.checking = true;
    
    try {
      if (manual) {
        console.log('🔍 Verificando atualizações manualmente...');
      } else {
        console.log('🔍 Verificação automática de atualizações...');
      }

      const response = await fetch(GITHUB_UPDATE_CONFIG.versionUrl + '?t=' + Date.now(), {
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const versionData = await response.json();
      
      console.log('📊 Versão atual:', this.currentVersion);
      console.log('📊 Versão no GitHub:', versionData.version);

      if (this.isNewerVersion(versionData.version, this.currentVersion)) {
        console.log('🎉 Nova versão disponível!');
        await this.downloadAndUpdate(versionData);
      } else {
        console.log('✅ Extensão está atualizada!');
        if (manual) {
          this.showNotification('Creare já está atualizado!', 'Você tem a versão mais recente.');
        }
      }

      // Salva horário da última verificação
      await chrome.storage.local.set({
        lastUpdateCheck: Date.now()
      });

    } catch (error) {
      console.error('❌ Erro ao verificar atualizações:', error);
      if (manual) {
        this.showNotification('Erro ao verificar atualizações', error.message);
      }
    } finally {
      this.checking = false;
    }
  }

  // Compara versões (formato: X.Y.Z)
  isNewerVersion(remoteVersion, currentVersion) {
    const remote = remoteVersion.split('.').map(Number);
    const current = currentVersion.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (remote[i] > current[i]) return true;
      if (remote[i] < current[i]) return false;
    }
    return false;
  }

  // Baixa e aplica a atualização
  async downloadAndUpdate(versionData) {
    try {
      console.log('📥 Baixando atualização...');
      
      const filesToUpdate = versionData.files || [
        'content.js',
        'textos-padrao.js',
        'auto-click-invalidar.js',
        'styles.css',
        'manifest.json'
      ];

      const downloadedFiles = {};

      // Baixa todos os arquivos
      for (const file of filesToUpdate) {
        console.log(`📥 Baixando ${file}...`);
        const url = GITHUB_UPDATE_CONFIG.filesBaseUrl + file;
        const response = await fetch(url + '?t=' + Date.now(), { cache: 'no-cache' });
        
        if (!response.ok) {
          throw new Error(`Erro ao baixar ${file}: ${response.status}`);
        }

        downloadedFiles[file] = await response.text();
        console.log(`✅ ${file} baixado (${(downloadedFiles[file].length / 1024).toFixed(2)} KB)`);
      }

      // Salva os arquivos no storage
      await chrome.storage.local.set({
        pendingUpdate: {
          version: versionData.version,
          files: downloadedFiles,
          changelog: versionData.changelog || 'Melhorias e correções',
          downloadedAt: Date.now()
        }
      });

      console.log('✅ Atualização baixada com sucesso!');
      
      // Mostra notificação
      this.showNotification(
        `Nova versão ${versionData.version} disponível!`,
        'A atualização será aplicada quando você recarregar a extensão. ' + 
        (versionData.changelog || 'Clique para ver detalhes.')
      );

      // Aplica a atualização
      await this.applyUpdate();

    } catch (error) {
      console.error('❌ Erro ao baixar atualização:', error);
      this.showNotification('Erro na atualização', error.message);
    }
  }

  // Aplica a atualização (injeta os novos arquivos DINAMICAMENTE)
  async applyUpdate() {
    try {
      const data = await chrome.storage.local.get('pendingUpdate');
      
      if (!data.pendingUpdate) {
        console.log('⚠️ Nenhuma atualização pendente');
        return;
      }

      console.log('🔧 Aplicando atualização DINAMICAMENTE...');

      const { version, files, changelog } = data.pendingUpdate;

      // ========================================
      // PASSO 1: Aplicar CSS instantaneamente
      // ========================================
      if (files['styles.css']) {
        console.log('🎨 Atualizando estilos CSS...');
        
        // Remove estilos antigos da extensão
        const oldStyles = document.querySelectorAll('style[data-creare-extension]');
        oldStyles.forEach(style => style.remove());

        // Injeta novos estilos
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-creare-extension', 'true');
        styleElement.textContent = files['styles.css'];
        document.head.appendChild(styleElement);
        
        console.log('✅ CSS atualizado!');
      }

      // ========================================
      // PASSO 2: Salvar arquivos JS para próxima execução
      // ========================================
      const jsFiles = [
        'textos-padrao.js',
        'content.js',
        'auto-click-invalidar.js'
      ];

      // Conta arquivos JS atualizados
      let jsFilesUpdated = 0;
      for (const jsFile of jsFiles) {
        if (files[jsFile]) {
          jsFilesUpdated++;
          console.log(`💾 ${jsFile} salvo para próxima execução`);
        }
      }

      // Salva os arquivos JS atualizados no chrome.storage
      if (jsFilesUpdated > 0) {
        await chrome.storage.local.set({
          updatedScripts: {
            version: version,
            files: Object.fromEntries(
              jsFiles.filter(f => files[f]).map(f => [f, files[f]])
            ),
            timestamp: Date.now()
          }
        });
        console.log(`✅ ${jsFilesUpdated} arquivos JS salvos no storage`);
      }

      // ========================================
      // PASSO 3: Atualizar manifest (precisa reload)
      // ========================================
      const needsReload = files['manifest.json'] || files['background.js'];

      console.log('✅ Atualização aplicada com sucesso!');
      console.log('📋 Changelog:', changelog);

      // CSS foi aplicado instantaneamente
      // JS será aplicado no próximo reload da PÁGINA (não da extensão)
      const cssUpdated = files['styles.css'] ? true : false;
      const jsUpdated = files['content.js'] || files['textos-padrao.js'] || files['auto-click-invalidar.js'];
      const needsReload = files['manifest.json'] || files['background.js'];

      if (needsReload) {
        console.log('⚠️ Arquivos de sistema foram atualizados');
        console.log('💡 Recarregue a extensão em chrome://extensions para aplicar completamente');
        
        this.showNotification(
          `Creare v${version} - Quase pronto!`,
          'Scripts atualizados! Para aplicar mudanças no sistema, recarregue a extensão. ' + changelog
        );
      } else if (cssUpdated && !jsUpdated) {
        // Só CSS mudou - aplicado instantaneamente
        this.showNotification(
          `🎉 Creare v${version} atualizado!`,
          'Estilos atualizados instantaneamente! ' + changelog
        );
      } else if (jsUpdated) {
        // JS mudou - precisa reload da PÁGINA
        this.showNotification(
          `🔄 Creare v${version} - Recarregue a página!`,
          'Atualizações baixadas! Recarregue esta página (F5) para aplicar. ' + changelog
        );
      } else {
        this.showNotification(
          `🎉 Creare v${version} atualizado!`,
          'Atualização aplicada! ' + changelog
        );
      }

      // Salva informação de atualização aplicada
      await chrome.storage.local.set({
        lastAppliedUpdate: {
          version: version,
          appliedAt: Date.now(),
          changelog: changelog
        }
      });

      // Remove a atualização pendente
      await chrome.storage.local.remove('pendingUpdate');

    } catch (error) {
      console.error('❌ Erro ao aplicar atualização:', error);
      this.showNotification(
        'Erro ao aplicar atualização',
        'Recarregue a página ou a extensão manualmente. ' + error.message
      );
    }
  }

  // Mostra notificação como popup na página
  showNotification(title, message) {
    // Remove popup anterior se existir
    const oldPopup = document.getElementById('creare-update-popup');
    if (oldPopup) oldPopup.remove();

    // Detecta se precisa de reload manual (baseado no título)
    const needsManualReload = title.includes('Quase pronto');
    const needsPageReload = title.includes('Recarregue a página');
    const isSuccess = title.includes('atualizado!');

    // Cria popup
    const popup = document.createElement('div');
    popup.id = 'creare-update-popup';
    
    // HTML diferente dependendo se é sucesso automático ou precisa reload
    const popupContent = isSuccess ? `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        max-width: 420px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideIn 0.4s ease-out;
      ">
        <!-- Header -->
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 40px; margin-right: 12px;">✅</span>
          <div style="flex: 1;">
            <strong style="font-size: 20px; display: block; margin-bottom: 4px;">${title}</strong>
            <span style="font-size: 12px; opacity: 0.9;">Aplicado automaticamente</span>
          </div>
          <button id="creare-popup-close" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            transition: all 0.2s;
          ">×</button>
        </div>

        <!-- Mensagem -->
        <div style="
          background: rgba(255,255,255,0.15);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        ">
          <p style="margin: 0; font-size: 14px; line-height: 1.6;">
            ${message}
          </p>
        </div>

        <!-- Botão OK -->
        <button id="creare-popup-ok" style="
          background: white;
          color: #059669;
          border: none;
          padding: 14px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 15px;
          width: 100%;
          transition: all 0.2s;
        ">
          Entendi! 🎉
        </button>
      </div>
    ` : needsPageReload ? `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        max-width: 420px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideIn 0.4s ease-out;
      ">
        <!-- Header -->
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 40px; margin-right: 12px;">🔄</span>
          <div style="flex: 1;">
            <strong style="font-size: 20px; display: block; margin-bottom: 4px;">${title}</strong>
            <span style="font-size: 12px; opacity: 0.9;">Última etapa</span>
          </div>
          <button id="creare-popup-close" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            transition: all 0.2s;
          ">×</button>
        </div>

        <!-- Mensagem -->
        <div style="
          background: rgba(255,255,255,0.15);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        ">
          <p style="margin: 0; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
            ${message}
          </p>
          <p style="margin: 0; font-size: 13px; opacity: 0.9;">
            💡 Aperte <strong>F5</strong> ou <strong>Ctrl+R</strong> para recarregar
          </p>
        </div>

        <!-- Botão Recarregar -->
        <button id="creare-popup-reload" style="
          background: white;
          color: #1d4ed8;
          border: none;
          padding: 14px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 15px;
          width: 100%;
          transition: all 0.2s;
          margin-bottom: 8px;
        ">
          🔄 Recarregar agora
        </button>
        
        <button id="creare-popup-later" style="
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          width: 100%;
          transition: all 0.2s;
        ">
          Recarregar depois
        </button>
      </div>
    ` : `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        max-width: 420px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideIn 0.4s ease-out;
      ">
        <!-- Header -->
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 32px; margin-right: 12px;">${needsManualReload ? '⚡' : '🎉'}</span>
          <div style="flex: 1;">
            <strong style="font-size: 20px; display: block; margin-bottom: 4px;">${title}</strong>
            <span style="font-size: 12px; opacity: 0.9;">${needsManualReload ? 'Último passo necessário' : 'Atualização disponível'}</span>
          </div>
          <button id="creare-popup-close" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            transition: all 0.2s;
          ">×</button>
        </div>

        ${needsManualReload ? `
        <!-- Instruções para reload manual -->
        <div style="
          background: rgba(255,255,255,0.15);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        ">
          <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">
            📋 Scripts já atualizados! Último passo:
          </p>
          <ol style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
            <li>Abra uma nova aba</li>
            <li>Cole: <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px; font-size: 12px;">chrome://extensions</code></li>
            <li>Clique em <strong>🔄 Recarregar</strong> na extensão Creare</li>
          </ol>
        </div>

        <!-- Botões -->
        <button id="creare-popup-copy" style="
          background: white;
          color: #667eea;
          border: none;
          padding: 14px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 15px;
          width: 100%;
          transition: all 0.2s;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <span>📋</span>
          <span>Copiar link e ver instruções</span>
        </button>
        ` : `
        <!-- Mensagem normal -->
        <div style="
          background: rgba(255,255,255,0.15);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        ">
          <p style="margin: 0; font-size: 14px; line-height: 1.6;">
            ${message}
          </p>
        </div>
        `}
        
        <button id="creare-popup-later" style="
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          width: 100%;
          transition: all 0.2s;
        ">
          ${needsManualReload ? 'Atualizar depois' : needsPageReload ? 'Recarregar depois' : 'Fechar'}
        </button>
      </div>
    `;
    
    popup.innerHTML = popupContent;

    // Adiciona estilos de animação
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(450px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      #creare-popup-close:hover {
        background: rgba(255,255,255,0.3) !important;
        transform: scale(1.1) rotate(90deg);
      }
      #creare-popup-copy:hover {
        background: #f8f9ff !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
      #creare-popup-ok:hover {
        background: #f0fdf4 !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
      #creare-popup-reload:hover {
        background: #dbeafe !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
      #creare-popup-later:hover {
        background: rgba(255,255,255,0.1) !important;
        border-color: rgba(255,255,255,0.5);
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(popup);

    // Botão fechar
    const closeBtn = document.getElementById('creare-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        popup.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => popup.remove(), 300);
      });
    }

    // Botão OK (para sucesso automático)
    const okBtn = document.getElementById('creare-popup-ok');
    if (okBtn) {
      okBtn.addEventListener('click', () => {
        popup.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => popup.remove(), 300);
      });
    }

    // Botão Recarregar (para reload de página)
    const reloadBtn = document.getElementById('creare-popup-reload');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        location.reload();
      });
    }

    // Botão copiar (para reload manual)
    const copyBtn = document.getElementById('creare-popup-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const link = 'chrome://extensions';
        
        // Tenta copiar para clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(link).then(() => {
            // Muda visual do botão para feedback
            copyBtn.innerHTML = '<span>✅</span><span>Link copiado!</span>';
            copyBtn.style.background = '#4ade80';
            copyBtn.style.color = 'white';
            
            setTimeout(() => {
              alert('✅ LINK COPIADO!\n\n📋 PRÓXIMOS PASSOS:\n\n1️⃣ Abra uma NOVA ABA (Ctrl+T)\n\n2️⃣ COLE o link (Ctrl+V) e aperte ENTER\n\n3️⃣ Encontre "Creare - Colinha"\n\n4️⃣ Clique no botão 🔄 RECARREGAR\n\n✅ PRONTO! Extensão completamente atualizada!');
              popup.remove();
            }, 800);
          }).catch(() => {
            alert('📋 INSTRUÇÕES:\n\n1️⃣ Abra uma nova aba\n\n2️⃣ Digite: chrome://extensions\n\n3️⃣ Encontre "Creare - Colinha"\n\n4️⃣ Clique em 🔄 Recarregar\n\n✅ Pronto!');
            popup.remove();
          });
        } else {
          alert('📋 INSTRUÇÕES:\n\n1️⃣ Abra uma nova aba\n\n2️⃣ Digite: chrome://extensions\n\n3️⃣ Encontre "Creare - Colinha"\n\n4️⃣ Clique em 🔄 Recarregar\n\n✅ Pronto!');
          popup.remove();
        }
      });
    }

    // Botão "depois" ou "Fechar"
    const laterBtn = document.getElementById('creare-popup-later');
    if (laterBtn) {
      laterBtn.addEventListener('click', () => {
        popup.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => popup.remove(), 300);
      });
    }

    // Auto-fechar após 30 segundos
    setTimeout(() => {
      if (document.getElementById('creare-update-popup')) {
        popup.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => popup.remove(), 300);
      }
    }, 30000);

    console.log('📢', title, '-', message);
  }

  // Agenda verificações periódicas
  scheduleChecks() {
    // Verifica apenas ao carregar a página
    setTimeout(() => this.checkForUpdates(), 3000);

    console.log('⏰ Verificação automática ao recarregar o site');
    console.log('📋 Primeira verificação em 3 segundos...');
  }
}

// Inicializa o updater
const updater = new ExtensionUpdater();
updater.scheduleChecks();

// Expõe globalmente para verificação manual
window.checkUpdates = () => updater.checkForUpdates(true);

console.log('🔄 Auto-Updater carregado! Execute checkUpdates() no console para verificar manualmente.');
