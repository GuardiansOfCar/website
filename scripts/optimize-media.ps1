# 미디어 파일 최적화 스크립트
# 사용법: .\scripts\optimize-media.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== v2 미디어 파일 크기 확인 ===" -ForegroundColor Cyan

# GIF 파일 크기 확인
Write-Host "`n[GIF 파일들]" -ForegroundColor Yellow
Get-ChildItem -Path "public\images\*.gif" | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "  $($_.Name): $sizeMB MB"
}

# 큰 PNG 파일 확인 (500KB 이상)
Write-Host "`n[큰 PNG 파일들 (500KB 이상)]" -ForegroundColor Yellow
Get-ChildItem -Path "public\images\*.png" | Where-Object { $_.Length -gt 500KB } | 
    Sort-Object Length -Descending | 
    Select-Object -First 20 | 
    ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.Name): $sizeMB MB"
    }

# MP4 파일 확인
Write-Host "`n[MP4 파일들]" -ForegroundColor Yellow
if (Test-Path "public\videos\*.mp4") {
    Get-ChildItem -Path "public\videos\*.mp4" | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.Name): $sizeMB MB"
    }
}

Write-Host "`n=== 확인 완료 ===" -ForegroundColor Green

