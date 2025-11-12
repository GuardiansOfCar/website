#!/usr/bin/env python3
"""
v2 GIF 파일을 MP4로 일괄 변환 스크립트 (Python + moviepy)
사용법: python scripts/optimize-gifs-python.py
"""

import os
import sys
from pathlib import Path

try:
    from moviepy.editor import VideoFileClip
except ImportError:
    print("오류: moviepy가 설치되어 있지 않습니다.")
    print("설치: pip install moviepy")
    sys.exit(1)

# 작업 디렉토리 설정
script_dir = Path(__file__).parent
project_root = script_dir.parent
images_dir = project_root / "public" / "images"

if not images_dir.exists():
    print(f"오류: {images_dir} 디렉토리를 찾을 수 없습니다.")
    sys.exit(1)

os.chdir(images_dir)

print("=== GIF를 MP4로 변환 시작 ===\n")

# 변환할 GIF 파일 목록 (hero.gif만)
gifs = ["hero.gif"]

for gif_name in gifs:
    gif_path = Path(gif_name)
    
    if not gif_path.exists():
        print(f"⚠ 경고: {gif_name} 파일을 찾을 수 없습니다.")
        continue
    
    mp4_name = gif_name.replace(".gif", ".mp4")
    mp4_path = Path(mp4_name)
    
    try:
        # 원본 파일 크기
        original_size = gif_path.stat().st_size / (1024 * 1024)  # MB
        
        print(f"변환 중: {gif_name} ({original_size:.2f} MB) -> {mp4_name}")
        
        # GIF를 MP4로 변환
        clip = VideoFileClip(str(gif_path))
        
        # 최적화 설정
        clip.write_videofile(
            str(mp4_path),
            fps=30,
            bitrate="2M",
            codec='libx264',
            preset='slow',
            ffmpeg_params=['-pix_fmt', 'yuv420p', '-movflags', '+faststart']
        )
        
        clip.close()
        
        # 변환된 파일 크기
        new_size = mp4_path.stat().st_size / (1024 * 1024)  # MB
        reduction = ((original_size - new_size) / original_size) * 100
        
        print(f"✓ 완료: {gif_name} ({original_size:.2f} MB) -> {mp4_name} ({new_size:.2f} MB)")
        print(f"  용량 절감: {reduction:.1f}%\n")
        
    except Exception as e:
        print(f"✗ 실패: {gif_name} 변환 실패 - {str(e)}\n")

print("=== 변환 완료 ===")
print("변환된 MP4 파일을 확인하고 브라우저에서 테스트하세요.")

