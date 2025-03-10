import csv
import json
import sys
import os
from collections import defaultdict

def set_nested_value(data, keys, value):
    """
    주어진 키들을 기반으로 중첩된 딕셔너리 구조에 값을 설정합니다.

    :param data: 중첩 딕셔너리
    :param keys: 키 리스트
    :param value: 설정할 값
    """
    for key in keys[:-1]:  # 마지막 키를 제외한 모든 키로 하위 딕셔너리 생성
        if key not in data:
            data[key] = {}  # 키가 없으면 딕셔너리 생성
        data = data[key]
    data[keys[-1]] = value  # 마지막 키에 값 할당

def main(input_file, output_folder):
    # 각 언어의 데이터를 담을 defaultdict 설정
    language_data = defaultdict(lambda: defaultdict(dict))

    # CSV 파일 읽기
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)  # 첫 번째 줄은 헤더로 처리 (key 제외한 언어들)
        languages = header[1:]  # 첫 번째 컬럼을 제외한 나머지 컬럼들 (언어 목록)

        for row in reader:
            if len(row) != len(header):
                continue  # 잘못된 형식의 행은 무시
            key = row[0]
            for i, lang in enumerate(languages):
                lang_value = row[i+1].strip()  # 언어 값 (빈 값은 그대로)
                keys = key.split('.')  # 키를 '.' 기준으로 나누어 중첩 구조 생성
                set_nested_value(language_data[lang], keys, lang_value)

    # 각 언어별로 JSON 파일로 저장
    for lang, data in language_data.items():
        output_file = os.path.join(output_folder, f"{lang}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Saved {lang}.json")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_csv_to_json.py input_file output_folder")
        sys.exit(1)

    input_file = sys.argv[1]
    output_folder = sys.argv[2]

    # 출력 폴더가 없다면 생성
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    main(input_file, output_folder)
