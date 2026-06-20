# VibeTeam 디자인 아이디어

## 세 가지 방향성 후보

### 1. Soft Academic
대학 캠퍼스의 따뜻함과 스터디 카페의 집중감을 담은 크림-세이지 파스텔 팔레트. Notion과 Trello를 오마주한 카드 기반 레이아웃.
- **확률:** 0.07

### 2. Neo-Minimal Tech
차가운 흰 배경에 인디고-민트 포인트 컬러, 날카로운 타이포그래피. 데이터 시각화에 집중한 대시보드 중심 구조.
- **확률:** 0.04

### 3. Warm Pastel Studio (선택)
크림 화이트 + 라벤더 + 피치 코럴의 따뜻한 파스텔 팔레트. 손으로 그린 듯한 부드러운 곡선과 카드 컴포넌트, 대학생 감성의 친근하고 세련된 UX.
- **확률:** 0.09

---

## 선택된 방향: Warm Pastel Studio

### Design Movement
Soft Productivity — 일본 문구 브랜드(Hobonichi, Midori)와 현대 SaaS(Linear, Notion)의 교차점. 기능적이되 감성적인 인터페이스.

### Core Principles
1. **Warmth over Coldness** — 차가운 파란색 대신 라벤더·피치·세이지 계열로 따뜻한 집중 환경 조성
2. **Card-First Architecture** — 모든 정보는 카드 단위로 분리, 그림자와 둥근 모서리로 깊이감 표현
3. **Purposeful Density** — 대시보드는 정보 밀도를 높이되, 여백으로 호흡 공간 확보
4. **Delight in Details** — 호버 효과, 진행 애니메이션, 색상 전환으로 인터랙션에 생동감 부여

### Color Philosophy
- **Primary:** 라벤더 퍼플 `oklch(0.72 0.12 290)` — 창의성과 집중력의 상징
- **Accent:** 피치 코럴 `oklch(0.78 0.10 30)` — 마감일, 알림, CTA에 활용
- **Success:** 세이지 그린 `oklch(0.72 0.12 150)` — 완료 상태, 공강 히트맵
- **Background:** 크림 화이트 `oklch(0.98 0.01 90)` — 눈의 피로를 줄이는 따뜻한 흰색
- **Surface:** 연한 라벤더 `oklch(0.96 0.02 290)` — 카드 배경, 사이드바

### Layout Paradigm
- 좌측 고정 사이드바(240px) + 우측 메인 콘텐츠 영역의 비대칭 레이아웃
- 대시보드는 3컬럼 그리드 카드 배치 (프로젝트 룸 목록)
- 프로젝트 룸 내부는 탭 기반 멀티뷰 (시간표 | 칸반 | WBS)

### Signature Elements
1. **Gradient Cards** — 카드 상단에 라벤더→피치 그라디언트 스트라이프 (3px)
2. **Heatmap Timetable** — 세이지 그린 opacity 단계별 공강 시각화
3. **Floating Progress Ring** — 우측 하단 고정 진행률 링 위젯

### Interaction Philosophy
- 모든 카드는 hover 시 translateY(-2px) + shadow 강화
- 모달은 scale(0.95)→scale(1) + opacity 0→1 (200ms ease-out)
- 칸반 드래그 시 카드 회전(rotate 2deg) + shadow 강화
- 버튼 클릭 시 scale(0.97) (160ms)

### Animation
- 페이지 전환: fade + slide-up (250ms cubic-bezier(0.23, 1, 0.32, 1))
- 카드 등장: stagger 40ms per card, translateY(8px)→0 + opacity
- 프로그레스 바: width transition 600ms ease-out
- 히트맵 슬롯: opacity transition 300ms on data change

### Typography System
- **Display:** `Pretendard` (한글) + `Plus Jakarta Sans` (영문) — Bold 700/800
- **Body:** `Pretendard` Regular 400/500
- **Mono:** `JetBrains Mono` — 초대 코드, 시간 표시

### Brand Essence
대학생의 조별 과제 스트레스를 감성적이고 스마트하게 해결하는 팀 협업 도구.
- **Adjectives:** Friendly, Focused, Delightful

### Brand Voice
- Headlines: "우리 팀의 공강, 한눈에 확인하세요" / "과제도, 일정도, 함께라면 쉬워요"
- CTAs: "새 과제 방 만들기" / "시간표 등록하기"
- Ban: "Welcome to VibeTeam" / "Get Started Today"

### Wordmark & Logo
V자를 캘린더 체크마크와 결합한 그래픽 심볼. 라벤더-피치 그라디언트 적용.

### Signature Brand Color
라벤더 퍼플 `oklch(0.72 0.12 290)` — VibeTeam의 고유 컬러
