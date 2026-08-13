# ============================================================
# SCRIPT DE CONFIGURAÇÃO AUTOMÁTICA - CREARE AUTO-UPDATE
# ============================================================

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║   🚀 CONFIGURADOR AUTOMÁTICO - CREARE AUTO-UPDATE            ║" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Pede o username do GitHub
Write-Host "📝 Digite seu USERNAME do GitHub:" -ForegroundColor Yellow
Write-Host "   (exemplo: douglasg, joaosilva, maria123)" -ForegroundColor Gray
Write-Host ""
$username = Read-Host "   Username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host ""
    Write-Host "❌ Username não pode ser vazio!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione ENTER para sair"
    exit
}

Write-Host ""
Write-Host "📝 Digite o NOME do repositório:" -ForegroundColor Yellow
Write-Host "   (deixe em branco para usar: creare-extension)" -ForegroundColor Gray
Write-Host ""
$repo = Read-Host "   Nome do repositório"

if ([string]::IsNullOrWhiteSpace($repo)) {
    $repo = "creare-extension"
}

Write-Host ""
Write-Host "📝 Digite o BRANCH:" -ForegroundColor Yellow
Write-Host "   (deixe em branco para usar: main)" -ForegroundColor Gray
Write-Host ""
$branch = Read-Host "   Branch"

if ([string]::IsNullOrWhiteSpace($branch)) {
    $branch = "main"
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Configurações:" -ForegroundColor Green
Write-Host "   Username: $username" -ForegroundColor White
Write-Host "   Repositório: $repo" -ForegroundColor White
Write-Host "   Branch: $branch" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Confirma? (S/N)"

if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host ""
    Write-Host "❌ Operação cancelada!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione ENTER para sair"
    exit
}

Write-Host ""
Write-Host "🔧 Configurando arquivos..." -ForegroundColor Yellow
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Atualiza background.js
$backgroundPath = Join-Path $scriptDir "background.js"
if (Test-Path $backgroundPath) {
    $content = Get-Content $backgroundPath -Raw
    $content = $content -replace "owner: 'SEU-USUARIO-GITHUB'", "owner: '$username'"
    $content = $content -replace "repo: 'creare-extension'", "repo: '$repo'"
    $content = $content -replace "branch: 'main'", "branch: '$branch'"
    Set-Content $backgroundPath -Value $content -NoNewline
    Write-Host "   ✅ background.js configurado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  background.js não encontrado" -ForegroundColor Yellow
}

# Atualiza updater.js
$updaterPath = Join-Path $scriptDir "updater.js"
if (Test-Path $updaterPath) {
    $content = Get-Content $updaterPath -Raw
    $content = $content -replace "owner: 'SEU-USUARIO-GITHUB'", "owner: '$username'"
    $content = $content -replace "repo: 'creare-extension'", "repo: '$repo'"
    $content = $content -replace "branch: 'main'", "branch: '$branch'"
    Set-Content $updaterPath -Value $content -NoNewline
    Write-Host "   ✅ updater.js configurado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  updater.js não encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse: https://github.com/$username/$repo" -ForegroundColor White
Write-Host ""
Write-Host "2. Clique em: 'Add file' → 'Upload files'" -ForegroundColor White
Write-Host ""
Write-Host "3. Arraste TODOS os arquivos desta pasta" -ForegroundColor White
Write-Host ""
Write-Host "4. Clique em 'Commit changes'" -ForegroundColor White
Write-Host ""
Write-Host "5. Pronto! Em 15 minutos todos receberão atualizações! ✅" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Para testar, abra o console do Creare e execute:" -ForegroundColor Cyan
Write-Host "   checkUpdates()" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Abre o navegador na página de criação de repositório
$createRepoUrl = "https://github.com/new"
Write-Host "🌐 Abrindo GitHub para criar repositório..." -ForegroundColor Yellow
Start-Process $createRepoUrl

Write-Host ""
Read-Host "Pressione ENTER para sair"
