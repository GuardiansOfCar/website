# [Feature Name]: Global Navigation Bar (상단 내비게이션 바)

웹사이트 전역 상단에 고정되어 로고, 메인 페이지 이동, 언어 선택(다국어 전환), 문서 링크(GitBook), 소셜 미디어(X, Telegram) 링크 및 지갑 연결 기능을 제공하는 내비게이션 컴포넌트입니다.

## [Files]
- `src/components/nav.tsx`
- `src/app/components/nav.tsx`
- `messages/en.json`
- `messages/ja.json`
- `messages/zh-CN.json`
- `messages/zh-TW.json`

## [Logic]
1. **메뉴 구성**: 기본 홈 링크(`home.nav1`)를 노출하며, Staking 및 Referral 메뉴는 제거되어 단일 진입점으로 정리되었습니다.
2. **다국어 전환 (`renderLanguage`)**: 지원 언어(EN, JA, ZH-CN, ZH-TW) 드롭다운을 통해 URL locale 경로(`/[locale]/...`)를 전환합니다.
3. **외부 링크 연동**:
   - DOCS: 공식 GitBook 문서(`https://gotcar.gitbook.io/gotcar-docs`)로 이동
   - Social: 공식 X 및 Telegram 커뮤니티로 연결
4. **지갑 연결 (`useWallet`, `useWalletConnectorStore`)**: 지갑 상태에 따라 지갑 연결 팝업 또는 연결 해제를 처리합니다.
5. **반응형 지원**: 모바일 화면에서는 햄버거 버튼 토글을 통해 슬라이드 다운 형태의 모바일 전용 메뉴를 제공합니다.

## [Data Schema]
```typescript
interface NavItem {
  label: string;
  href: `/${string}`;
  isHome?: boolean;
}
```
