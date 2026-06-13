# RheumaScan - Inicializador
$projectPath = "C:\Users\isapi\OneDrive\Área de Trabalho\PROJETOS CLAUDE\rheumascan"

# Verifica se o servidor já está rodando na porta 5173
$running = Test-NetConnection -ComputerName localhost -Port 5173 -InformationLevel Quiet -WarningAction SilentlyContinue 2>$null

if (-not $running) {
    # Inicia o servidor em segundo plano
    Start-Process powershell -ArgumentList "-NoProfile -WindowStyle Minimized -Command `"cd '$projectPath'; npm run dev`"" -WindowStyle Minimized
    # Aguarda o servidor iniciar
    Start-Sleep -Seconds 4
}

# Abre o navegador
Start-Process "http://localhost:5173"
