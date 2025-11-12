@echo off
REM v2 GIF 파일을 MP4로 일괄 변환 스크립트 (Windows)
REM 사용법: scripts\optimize-all-gifs.bat

cd public\images

echo === GIF를 MP4로 변환 시작 ===

REM FFmpeg 설치 확인
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo 오류: FFmpeg가 설치되어 있지 않습니다.
    echo FFmpeg 설치: https://ffmpeg.org/download.html
    pause
    exit /b 1
)

REM hero.gif 변환
if exist hero.gif (
    echo 변환 중: hero.gif -^> hero.mp4
    ffmpeg -i hero.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -y hero.mp4
    if %errorlevel% equ 0 (
        echo ✓ 완료: hero.gif -^> hero.mp4
    ) else (
        echo ✗ 실패: hero.gif 변환 실패
    )
)

REM chapter1.gif 변환
if exist chapter1.gif (
    echo 변환 중: chapter1.gif -^> chapter1.mp4
    ffmpeg -i chapter1.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -y chapter1.mp4
    if %errorlevel% equ 0 (
        echo ✓ 완료: chapter1.gif -^> chapter1.mp4
    ) else (
        echo ✗ 실패: chapter1.gif 변환 실패
    )
)

REM chapter2.gif 변환
if exist chapter2.gif (
    echo 변환 중: chapter2.gif -^> chapter2.mp4
    ffmpeg -i chapter2.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -y chapter2.mp4
    if %errorlevel% equ 0 (
        echo ✓ 완료: chapter2.gif -^> chapter2.mp4
    ) else (
        echo ✗ 실패: chapter2.gif 변환 실패
    )
)

REM chapter3.gif 변환
if exist chapter3.gif (
    echo 변환 중: chapter3.gif -^> chapter3.mp4
    ffmpeg -i chapter3.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -y chapter3.mp4
    if %errorlevel% equ 0 (
        echo ✓ 완료: chapter3.gif -^> chapter3.mp4
    ) else (
        echo ✗ 실패: chapter3.gif 변환 실패
    )
)

REM chapter4.gif 변환
if exist chapter4.gif (
    echo 변환 중: chapter4.gif -^> chapter4.mp4
    ffmpeg -i chapter4.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -y chapter4.mp4
    if %errorlevel% equ 0 (
        echo ✓ 완료: chapter4.gif -^> chapter4.mp4
    ) else (
        echo ✗ 실패: chapter4.gif 변환 실패
    )
)

echo.
echo === 변환 완료 ===
echo 변환된 MP4 파일을 확인하고 브라우저에서 테스트하세요.
pause

