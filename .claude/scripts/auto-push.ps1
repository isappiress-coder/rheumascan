$projectPath = "c:\Users\isapi\OneDrive\Área de Trabalho\PROJETOS CLAUDE\rheumascan"
Set-Location $projectPath

$status = git status --porcelain 2>&1
if ($status) {
    git add .
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "auto: sync $date"
    git push origin main
    Write-Host "RheumaScan sincronizado com GitHub em $date"
} else {
    Write-Host "Nenhuma alteração para sincronizar."
}
