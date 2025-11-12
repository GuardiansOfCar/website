# v2 미디어 파일 최적화 가이드

## 현재 파일 크기

### GIF 파일 (MP4로 변환 필요)
- **hero.gif**: 47.09 MB → MP4로 변환 (약 1-5MB 예상)
- **chapter4.gif**: 16.57 MB → MP4로 변환 (약 0.5-2MB 예상)
- **chapter3.gif**: 14.92 MB → MP4로 변환 (약 0.5-2MB 예상)
- **chapter2.gif**: 7.66 MB → MP4로 변환 (약 0.3-1MB 예상)
- **chapter1.gif**: 3.46 MB → MP4로 변환 (약 0.2-0.5MB 예상)

### PNG 파일 (WebP로 변환 권장)
- **hero.png**: 1.29 MB
- **audit.png**: 1.01 MB

### MP4 파일 (최적화 필요)
- **g2e.mp4**: 0.22 MB (이미 작음, 추가 최적화 가능)

## 최적화 명령어

### 1. GIF를 MP4로 변환 (FFmpeg 사용)

```bash
cd public/images

# hero.gif → hero.mp4
ffmpeg -i hero.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart hero.mp4

# chapter1.gif → chapter1.mp4
ffmpeg -i chapter1.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart chapter1.mp4

# chapter2.gif → chapter2.mp4
ffmpeg -i chapter2.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart chapter2.mp4

# chapter3.gif → chapter3.mp4
ffmpeg -i chapter3.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart chapter3.mp4

# chapter4.gif → chapter4.mp4
ffmpeg -i chapter4.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart chapter4.mp4
```

### 2. PNG를 WebP로 변환 (cwebp 사용)

```bash
# cwebp 설치 필요 (https://developers.google.com/speed/webp/download)

cd public/images

# hero.png → hero.webp
cwebp -q 80 hero.png -o hero.webp

# audit.png → audit.webp
cwebp -q 80 audit.png -o audit.webp
```

### 3. MP4 최적화 (g2e.mp4)

```bash
cd public/videos

# g2e.mp4 재인코딩 (이미 작지만 추가 최적화)
ffmpeg -i g2e.mp4 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart g2e-optimized.mp4
```

## 예상 용량 절감

- **hero.gif**: 47MB → 1-5MB (약 90% 절감)
- **chapter4.gif**: 16.57MB → 0.5-2MB (약 88% 절감)
- **chapter3.gif**: 14.92MB → 0.5-2MB (약 87% 절감)
- **chapter2.gif**: 7.66MB → 0.3-1MB (약 87% 절감)
- **chapter1.gif**: 3.46MB → 0.2-0.5MB (약 85% 절감)

**총 예상 절감량**: 약 90MB → 5-10MB (약 85-90% 절감)

## 변환 후 작업

1. 변환된 MP4 파일 확인
2. 코드가 자동으로 MP4를 사용하도록 이미 업데이트됨
3. 브라우저에서 테스트
4. 필요시 CRF 값 조정 (낮을수록 고품질, 파일 크기 증가)

