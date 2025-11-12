# Hero GIF 최적화 가이드

## 현재 상황
- `hero.gif` 파일 크기: 약 **47MB** (매우 큼)
- 목표: MP4로 변환하여 **1-5MB**로 최적화

## 변환 방법

### 방법 1: FFmpeg 사용 (권장)

FFmpeg가 설치되어 있다면 다음 명령어를 실행하세요:

```bash
cd public/images
ffmpeg -i hero.gif -vf "scale=1920:-1,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart hero.mp4
```

**설정 설명:**
- `scale=1920:-1`: 너비를 1920px로 제한 (비율 유지)
- `fps=30`: 프레임레이트 30fps
- `crf=22`: 품질 설정 (18-28 권장, 낮을수록 고품질)
- `movflags +faststart`: 웹 스트리밍 최적화

### 방법 2: 온라인 도구 사용

1. **CloudConvert** (https://cloudconvert.com/gif-to-mp4)
   - hero.gif 업로드
   - MP4 형식 선택
   - 품질: High (또는 Medium)
   - 변환 후 다운로드

2. **EZGIF** (https://ezgif.com/gif-to-mp4)
   - GIF 업로드
   - "Convert to MP4" 클릭
   - 다운로드

### 방법 3: Python 스크립트 (moviepy 사용)

```python
from moviepy.editor import VideoFileClip

clip = VideoFileClip("hero.gif")
clip.write_videofile("hero.mp4", fps=30, bitrate="2M", codec='libx264')
```

## 최적화 팁

1. **해상도 조정**: 원본이 너무 크다면 1920px 너비로 제한
2. **프레임레이트**: 30fps면 충분 (원본이 더 높다면)
3. **비트레이트**: 2-5Mbps 권장
4. **CRF 값**: 20-24 권장 (낮을수록 고품질, 파일 크기 증가)

## 변환 후

1. `public/images/hero.mp4` 파일 생성 확인
2. 파일 크기 확인 (1-5MB 목표)
3. 브라우저에서 테스트

## 참고

- MP4는 GIF보다 **10-20배 작은 용량**을 가집니다
- 모든 모던 브라우저에서 지원됩니다
- 자동 재생, 루프, 음소거가 가능합니다

