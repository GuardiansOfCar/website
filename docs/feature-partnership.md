# [Feature Name]: Featured Partnership (파트너십 섹션)

메인 페이지 하단에 협력 파트너사 목록을 슬라이드 형태로 무한 롤링하여 노출하고 각 파트너사 웹사이트로 이동할 수 있는 링크를 제공하는 기능입니다.

## [Files]
- `src/app/[locale]/(home)/components/partnership-section.tsx`
- `public/images/synergy-ib-investment-logo.png`
- `public/images/upgradepart2-logo.png`
- `public/images/CENTROID-logo.png`
- `public/images/tanes-logo.png`
- `public/images/quantora-logo.png`
- `public/images/aivent-logo.png`
- `public/images/abobe-logo.png`
- `public/images/zerra-logo.png`

## [Logic]
1. `validFeatures` 배열에 파트너사 목록(외부 URL, 이미지 경로, 이미지 표시 여부)을 정의합니다.
2. 무한 스크롤 애니메이션(`animate-partnership-scroll`)을 위해 `validFeatures` 데이터를 반복 복제하여 화면을 채웁니다.
3. 각 파트너사 로고를 클릭하면 새 탭(`target="_blank"`, `rel="noopener noreferrer"`)으로 해당 파트너사 공식 웹사이트로 이동합니다.
4. 반응형 처리를 통해 모바일/데스크톱 화면 크기에 따라 로고 크기 및 마진을 동적으로 조절합니다.

## [Data Schema]
```typescript
interface PartnershipItem {
  url: string;        // 파트너사 공식 웹사이트 URL
  imagePath: string;  // public 디렉토리 내 로고 이미지 경로
  isImage: boolean;   // 이미지 사용 여부 플래그
}
```
