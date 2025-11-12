# v2 미디어 파일 최적화 스크립트
# 사용법: .\scripts\optimize-v2-media.ps1

Write-Host "=== v2 미디어 파일 크기 확인 ===" -ForegroundColor Cyan

# GIF 파일 크기 확인
Write-Host "`n[GIF 파일]" -ForegroundColor Yellow
Get-ChildItem "public\images\*.gif" | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "$($_.Name): $sizeMB MB"
}

# MP4 파일 크기 확인
Write-Host "`n[MP4 파일]" -ForegroundColor Yellow
Get-ChildItem "public\videos\*.mp4" | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "$($_.Name): $sizeMB MB"
}

# 큰 PNG 파일 확인 (1MB 이상)
Write-Host "`n[큰 PNG 파일 (1MB 이상)]" -ForegroundColor Yellow
Get-ChildItem "public\images\*.png" | Where-Object { $_.Length -gt 1MB } | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "$($_.Name): $sizeMB MB"
} | Sort-Object { $_.Length } -Descending

Write-Host "`n=== 최적화 가이드 ===" -ForegroundColor Cyan
Write-Host "1. GIF -> MP4 변환: ffmpeg 사용" -ForegroundColor Green
Write-Host "2. PNG -> WebP 변환: cwebp 또는 온라인 도구 사용" -ForegroundColor Green
Write-Host "3. MP4 최적화: ffmpeg로 재인코딩" -ForegroundColor Green

