# [Feature Name]: Homepage FAQ Section (홈페이지 자주 묻는 질문)

홈페이지 메인 컨테이너 하단에 위치하여 GOTCAR 프로젝트의 핵심 가치, AI 기술, 토큰 유틸리티, G2E 보상 체계, 파트너십 비전 등 방문자가 자주 묻는 질문과 답변을 아코디언 형식으로 제공하는 컴포넌트입니다.

## [Files]
- `src/app/[locale]/(home)/components/faq-section.tsx`
- `src/app/[locale]/(home)/components/home-container.tsx`
- `messages/en.json`
- `messages/ja.json`
- `messages/zh-CN.json`

## [Logic]
1. **FAQ 항목 렌더링**: 다국어 번역 키(`home.faq.q1` ~ `home.faq.q5`)를 기반으로 질문과 답변을 목록으로 매핑합니다.
   - q1: GOTCAR의 독창성 (Precision vehicle positioning)
   - q2: $GOTCAR 토큰 유틸리티 (모빌리티 결제, G2E 보상 등)
   - q3: GOTCAR AI 기술 활용 (실시간 위험 분석 및 내비게이션)
   - q4: Guardians-to-Earn (G2E 운전 데이터 기여 및 보상)
   - q5: 향후 파트너십 계획 (글로벌 완성차 및 플랫폼 연동)
   *(토큰 클레임 및 스테이킹 관련 질문은 비즈니스 요구사항에 따라 삭제됨)*
2. **아코디언 토글**: `openIndex` 상태 관리를 통해 클릭된 항목을 펼치고 닫을 수 있습니다.

## [Data Schema]
```typescript
interface FaqItemData {
  question: string;
  answer: string;
}
```
