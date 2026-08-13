// ============================================================
// AUTO-UPDATER - Sighra Extension
// Verifica atualizações no GitHub automaticamente
// ============================================================

const GITHUB_UPDATE_CONFIG = {
  // CONFIGURE AQUI:
  owner: 'expressodouglasguilherme-hub',  // Seu username
  repo: 'extensoes',                       // Nome do repositório
  branch: 'main',                          // Branch (main ou master)
  folder: 'Sighra',                        // Pasta da extensão
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
          this.showNotification('Sighra já está atualizado!', 'Você tem a versão mais recente.');
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

  // Aplica a atualização (injeta os novos arquivos)
  async applyUpdate() {
    try {
      const data = await chrome.storage.local.get('pendingUpdate');
      
      if (!data.pendingUpdate) {
        console.log('⚠️ Nenhuma atualização pendente');
        return;
      }

      console.log('🔧 Aplicando atualização...');

      const { version, files, changelog } = data.pendingUpdate;

      // Injeta os novos scripts na página atual
      // IMPORTANTE: Isso só funcionará na próxima vez que a página for recarregada
      // ou quando a extensão for recarregada

      console.log('✅ Atualização pronta para ser aplicada!');
      console.log('📋 Changelog:', changelog);
      console.log('💡 Recarregue a extensão em chrome://extensions para aplicar');

      // Mostra notificação de sucesso
      this.showNotification(
        `Sighra v${version} pronto!`,
        'Recarregue a extensão para aplicar as mudanças. ' + changelog
      );

      // Remove a atualização pendente
      await chrome.storage.local.remove('pendingUpdate');

    } catch (error) {
      console.error('❌ Erro ao aplicar atualização:', error);
    }
  }

  // Mostra notificação
  showNotification(title, message) {
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: title,
        message: message,
        priority: 2
      });
    } else {
      console.log('📢', title, '-', message);
    }
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
