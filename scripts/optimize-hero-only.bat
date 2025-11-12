@echo off
REM hero.gif만 MP4로 변환하는 스크립트
REM 사용법: scripts\optimize-hero-only.bat

cd public\images

echo === hero.gif를 MP4로 변환 ===

REM FFmpeg 설치 확인
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [오류] FFmpeg가 설치되어 있지 않습니다.
    echo.
    echo FFmpeg 설치 방법:
    echo 1. https://ffmpeg.org/download.html 에서 다운로드
    echo 2. 또는 chocolatey 사용: choco install ffmpeg
    echo 3. 또는 winget 사용: winget install ffmpeg
    echo.
    echo 또는 온라인 도구 사용:
    echo - https://cloudconvert.com/gif-to-mp4
    echo - https://ezgif.com/gif-to-mp4
    echo.
    pause
    exit /b 1
)

REM hero.gif 파일 확인
if not exist hero.gif (
    echo [오류] hero.gif 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)

echo.
echo 변환 중: hero.gif -^> hero.mp4
echo 이 작업은 몇 분이 걸릴 수 있습니다...
echo.

ffmpeg -i hero.gif ^
    -vf "scale=1920:-2,fps=30" ^
    -c:v libx264 ^
    -preset slow ^
    -crf 22 ^
    -pix_fmt yuv420p ^
    -movflags +faststart ^
    -y hero.mp4

if %errorlevel% equ 0 (
    echo.
    echo ✓ 변환 완료!
    echo.
    echo 원본 크기 확인:
    for %%A in (hero.gif) do echo   hero.gif: %%~zA bytes
    echo.
    echo 변환된 크기 확인:
    for %%A in (hero.mp4) do echo   hero.mp4: %%~zA bytes
    echo.
    echo hero.mp4 파일이 생성되었습니다.
) else (
    echo.
    echo ✗ 변환 실패
    echo FFmpeg 오류가 발생했습니다.
)

echo.
pause

