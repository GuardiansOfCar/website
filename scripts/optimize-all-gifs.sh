#!/bin/bash
# v2 GIF 파일을 MP4로 일괄 변환 스크립트
# 사용법: bash scripts/optimize-all-gifs.sh

cd public/images

echo "=== GIF를 MP4로 변환 시작 ==="

# FFmpeg 설치 확인
if ! command -v ffmpeg &> /dev/null; then
    echo "오류: FFmpeg가 설치되어 있지 않습니다."
    echo "FFmpeg 설치: https://ffmpeg.org/download.html"
    exit 1
fi

# 변환할 GIF 파일 목록
gifs=("hero.gif" "chapter1.gif" "chapter2.gif" "chapter3.gif" "chapter4.gif")

for gif in "${gifs[@]}"; do
    if [ -f "$gif" ]; then
        mp4="${gif%.gif}.mp4"
        echo "변환 중: $gif -> $mp4"
        
        ffmpeg -i "$gif" \
            -vf "scale=1920:-1,fps=30" \
            -c:v libx264 \
            -preset slow \
            -crf 22 \
            -pix_fmt yuv420p \
            -movflags +faststart \
            -y "$mp4"
        
        if [ $? -eq 0 ]; then
            original_size=$(du -h "$gif" | cut -f1)
            new_size=$(du -h "$mp4" | cut -f1)
            echo "✓ 완료: $gif ($original_size) -> $mp4 ($new_size)"
        else
            echo "✗ 실패: $gif 변환 실패"
        fi
    else
        echo "⚠ 경고: $gif 파일을 찾을 수 없습니다."
    fi
done

echo ""
echo "=== 변환 완료 ==="
echo "변환된 MP4 파일을 확인하고 브라우저에서 테스트하세요."

