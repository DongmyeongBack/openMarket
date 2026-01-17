# HODU Open Market (호두 오픈마켓)

> **ModuLab FE6 Team 5 - Open Market Project**
>
> 바닐라 자바스크립트(Vanilla JS)와 Vite를 활용하여 구축한 **오픈마켓 플랫폼 HODU**입니다.
> 판매자는 상품을 등록하여 판매할 수 있고, 구매자는 상품을 검색하고 장바구니에 담아 결제하는 E-Commerce의 핵심 기능을 완벽하게 구현했습니다.

---

## 1. 프로젝트 개요

- **프로젝트명**: HODU (호두 오픈마켓)
- **개발 기간**: 2026.01 ~ (진행 중)
- **개발 인원**: Front-End 1명 (Team Project)
- **배포 주소**: https://modulab-fe6-team5.github.io/openMarket/
- **Test Account**
  ```text
  [구매자]
  ID : buyer1
  PW : weniv1

  [판매자]
  ID : seller1
  PW : weniv1

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Core** | <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"/> | 웹 표준 및 ES6+ 문법 활용 |
| **Build** | <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white"/> | 빠른 개발 서버 및 번들링 최적화 |
| **Deploy** | <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=github&logoColor=white"/> | 정적 웹 호스팅 |
| **API** | <img src="https://img.shields.io/badge/Fetch_API-000000?style=flat&logo=json&logoColor=white"/> | RESTful API 비동기 통신 |
| **Collaboration** | <img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/> | 형상 관리 및 협업 |

## 2.3 페이지 구조 (Page Structure)

이 프로젝트는 **Vite**를 기반으로 한 **MPA(Multi Page Application)** 구조로 설계되었습니다. 
각 페이지는 독립된 `html` 진입점을 가지며, 디렉토리 기반의 경로로 이동합니다.

| 페이지 | 파일 경로 (URL Path) | 설명 | 접근 권한 |
| :--- | :--- | :--- | :--- |
| **메인** | `/` | 상품 목록 및 배너 | All |
| **로그인** | `/src/pages/login/` | 구매자/판매자 로그인 | Guest |
| **회원가입** | `/src/pages/signup/` | 회원가입 폼 | Guest |
| **상품 상세** | `/src/pages/product-detail/` | 상품 상세 정보 및 장바구니 담기 | All |
| **장바구니** | `/src/pages/cart/` | 장바구니 목록 및 수정 | Buyer |
| **주문/결제** | `/src/pages/payment/` | 주문서 작성 및 결제 | Buyer |
| **판매자 센터** | `/src/pages/seller-center/` | 판매 상품 대시보드 | Seller |
| **상품 등록** | `/src/pages/seller-center/product-upload/` | 상품 등록 및 수정 | Seller |

---
## 3. 주요 기능 (Key Features)

### 3-1. 회원가입 및 로그인 (Authentication)
- **탭(Tab) 기반 UI**: 구매자와 판매자 회원을 탭으로 구분하여, 로그인 타입을 명확히 선택하고 전환할 수 있습니다. 판매자 탭 선택 시 사업자 전용 필드(등록번호, 스토어명)가 동적으로 노출됩니다. 
- **로그인 유효성 검사 및 UX**: 
  - **에러 핸들링**: 로그인 실패 시(비밀번호 불일치 등) 비밀번호 입력란을 **초기화하고 다시 포커스**를 주어 재입력을 유도합니다.
- **회원가입 검증 프로세스**: 
  - **순차 입력 유도**: 사용자가 순서를 건너뛰어 입력하려 할 경우, 이전 필수 항목(아이디, 비밀번호 등)의 입력을 감지하여 경고를 띄우고 해당 위치로 포커스를 되돌립니다.
  - **API 기반 데이터 검증**: 
    - **아이디 중복 확인**: API 통신을 통해 중복확인 클릭시 아이디 중복 여부를 확인하고 사용 가능 여부를 피드백합니다.
    - **사업자 인증**: 판매자 가입 시 사업자 등록번호 API 검증을 통해 유효하지 않은 사업자 번호의 입력을 원천 차단합니다.
  <!-- - **실시간 데이터 정제**: 휴대폰 번호나 사업자 번호 입력 시, 숫자 이외의 문자는 자동으로 제거(Replacement)하여 데이터 무결성을 유지합니다. -->
- **제출 및 에러 처리**:
  - **동적 버튼 제어**: 아이디/비밀번호 정규식 검사, 약관 동의 등 모든 필수 조건(`State`)이 충족될 때만 가입 버튼이 활성화(`Active`)됩니다.
  - **서버 에러 매핑**: 회원가입 요청 실패 시, 서버에서 반환된 에러 필드(예: `user_name`, `phone_number`)를 분석하여 해당 입력창 하단에 정확한 에러 메시지를 노출합니다.
  - **가입 성공 피드백**: 회원가입 성공 시 **안내 모달**을 띄워 사용자에게 명확한 피드백을 제공한 후 로그인 페이지로 이동합니다.

### 3-2. 헤더 및 네비게이션 (Global Navigation Bar)

**유저 타입별 맞춤 UI**
`localStorage`의 토큰 및 유저 타입(`userType`)에 따라 네비게이션 메뉴를 다르게 렌더링합니다.

* **비회원**
  * **장바구니**: 클릭 시 로그인 모달(`showLoginModal`)이 호출됩니다.
  * **로그인**: 로그인 페이지로 이동하는 버튼이 노출됩니다.

* **회원 (구매자)**
  * **장바구니**: 클릭 시 장바구니 페이지로 이동하며, 현재 페이지가 장바구니일 경우 아이콘이 활성화(Active State) 됩니다.
  * **마이페이지**: 드롭다운 메뉴를 포함한 버튼이 노출됩니다.

* **판매자 (SELLER)**
  * **판매자 센터**: 장바구니 대신 판매자 센터 페이지로 이동하는 버튼이 노출됩니다.
  * **마이페이지**: 구매자와 동일하게 드롭다운 메뉴가 노출됩니다.

**검색 기능 (Search Implementation)**
사용자 경험 최적화를 위해 실시간 검색 제안 및 디바운싱 기술을 적용했습니다.

* **실시간 검색 제안 (Auto-complete)**
  * 검색어 입력 시 `searchProducts` API를 호출하여 최대 **10개**의 추천 상품 리스트를 드롭다운으로 보여줍니다.
  * 추천 상품 클릭 시 해당 상품의 상세 페이지(`product-detail`)로 즉시 이동합니다.

* **성능 최적화 (Debouncing)**
  * 잦은 API 호출을 방지하기 위해 **300ms**의 디바운스(Debounce) 타이머를 적용했습니다.
  * 마지막 요청 키워드 추적(`lastFetchedKeyword`)을 통해 중복 호출 및 불필요한 네트워크 트래픽을 차단합니다.

* **검색 실행**
  * 엔터 키 입력 또는 검색 버튼 클릭 시, 검색어가 포함된 상품 목록 페이지(`index.html?search=...`)로 이동합니다.

* **UX 디테일**
  * 입력창 포커스 아웃(Blur) 시 추천 목록이 닫히지만, 목록 클릭 시에는 이벤트가 유지되도록(`mousedown` 처리) 하여 사용성을 높였습니다.

**인터랙션 및 상태 관리**

* **마이페이지 드롭다운**: 아이콘 클릭 시 토글(Toggle) 방식으로 메뉴가 활성화되며, 외부 영역 클릭 시 자동으로 닫힙니다.
* **로그아웃**: 클릭 시 로컬 스토리지 정보를 삭제하고 로그아웃 모달을 띄운 뒤 메인으로 리다이렉트합니다.
* **로고**: 클릭 시 메인 페이지로 이동합니다.

### 3-3. 메인 및 상품 목록 (Home & Product List)
- **인터랙티브 배너**: 슬라이드 형태의 배너를 구현하여 자동 롤링 및 좌우 버튼 컨트롤 기능을 제공합니다.
- **상품 카드**: 상품 이미지, 판매자명, 가격, 상품 이름을 직관적으로 배치하였으며 클릭 시 상세 페이지로 이동합니다.


### 3-4. 상품 상세 (Product Detail)

**동적 상태 관리 및 렌더링**
* **상품 정보 렌더링**: API를 통해 받아온 이미지, 가격, 배송 정보(택배/직접배송, 무료/유료)를 렌더링합니다.
* **품절 처리 (Sold Out)**: 재고(`stock`)가 0인 경우, 모든 구매 관련 버튼을 비활성화하고 '품절' 상태를 표시합니다.
* **실시간 수량 및 가격 계산**
  * `+` / `-` 버튼으로 수량을 조절하며, **최소 1개 ~ 최대 재고량** 사이에서만 동작하도록 제한합니다.
  * 수량 변경 시 총 주문 금액이 실시간으로 재계산되어 표시됩니다.

**고도화된 장바구니 로직 (Smart Cart Logic)**
상품을 장바구니에 담을 때 중복 여부를 체크하여 사용자 경험을 최적화했습니다.

* **중복 상품 감지**: `getCart` API를 먼저 호출하여 현재 보고 있는 상품이 이미 장바구니에 있는지 확인합니다.
  * **중복 시**: "이미 장바구니에 있는 상품입니다"라는 **모달(Modal)**을 띄워 장바구니 이동 여부를 묻습니다.
  * **신규 추가 시**: `addToCart` API 호출 후, 시스템 Confirm 창을 통해 장바구니 이동 여부를 확인합니다.

**유저 타입별 권한 제어 (Access Control)**
로그인 여부 및 유저 타입(`userType`)에 따라 UI 상호작용을 제한합니다.

* **비회원**: 구매 또는 장바구니 버튼 클릭 시 **로그인 유도 모달**(`showLoginModal`)이 호출됩니다.
* **판매자 (SELLER)**
  * 본인의 상품 구매를 방지하기 위해 구매하기, 장바구니, 수량 조절 버튼이 모두 **비활성화(Disabled)** 됩니다.
  * 버튼 스타일이 변경(Cursor Not Allowed, 회색 처리)되어 시각적으로 클릭 불가능함을 안내합니다.

**주문 연동**

* **바로 구매**: 로그인 체크 후, 주문 정보(`order_kind`, `product_id`, `quantity`)를 `localStorage`에 저장하고 결제 페이지로 즉시 이동합니다.

### 3-5. 장바구니 및 결제 (Cart & Payment)
- **장바구니 로직**:
  - 이미 담긴 상품을 중복 추가하지 않도록 처리하며, 개별 삭제 및 전체 삭제 기능을 지원합니다.
  - 선택된 상품의 합계 금액(배송비 포함)을 실시간으로 확인 가능합니다.
- **주소 및 결제**:
  - **Daum 우편번호 API**를 연동하여 정확한 배송지 검색 및 입력을 지원합니다.
  - 최종 주문 상품 정보와 할인 내역을 확인하고 결제 프로세스를 완료합니다.

### 3-6. 판매자 센터 (Seller Center)
- **상품 대시보드**: 판매자가 등록한 상품 리스트를 테이블 형태로 한눈에 관리할 수 있습니다.
- **상품 관리 (CRUD)**:
  - **등록/수정**: 이미지 미리보기 및 상품 상세 정보를 입력/수정할 수 있습니다.
  - **복사 기능**: 기존 등록된 상품 정보를 그대로 불러와 빠르게 신규 상품으로 등록하는 편의 기능을 제공합니다.
---

## 4. 폴더 구조 (Directory Structure)

```bash
openmarket
├── public/              # 정적 리소스
├── src/
│   ├── assets/          # 이미지, 아이콘 등 에셋
│   ├── components/      # 재사용 가능한 컴포넌트 (Header, Footer, Modal 등)
│   ├── pages/           # 페이지별 로직 및 스타일
│   │   ├── cart/        # 장바구니
│   │   ├── login/       # 로그인
│   │   ├── payment/     # 결제
│   │   ├── product-detail/ # 상품 상세
│   │   ├── seller-center/  # 판매자 센터 (대시보드, 상품 업로드)
│   │   └── signup/      # 회원가입
│   ├── styles/          # 공통 스타일 (reset, common)
│   └── utils/           # 유틸리티 함수 (API 호출 등)
├── index.html           # 메인 페이지 진입점
├── main.js              # 메인 스크립트
├── main.css             # 메인 스타일
├── vite.config.js       # Vite 설정 파일
└── package.json         # 프로젝트 의존성 관리

## 5. 개발 주안점 및 트러블 슈팅

### 5-1. API 비동기 처리 및 에러 핸들링
- `fetch` API를 래핑한 `request` 유틸리티 함수를 만들어 API 호출 코드를 모듈화했습니다.
- Access Token 만료 시 Refresh Token을 사용해 토큰을 자동 갱신하는 로직을 구현하여 끊김 없는 사용자 경험을 제공합니다.

### 5-2. 판매자 센터 상품 복사 기능 구현
- **문제**: 상품 등록 시 매번 동일한 정보를 입력해야 하는 번거로움 발생.
- **해결**: URL 파라미터(`?mode=copy`)를 활용하여 기존 상품 데이터를 불러와 폼에 채워넣고, 이미지를 `Blob` 형태로 변환하여 재전송하는 로직을 추가하여 상품 등록 효율성을 높였습니다.

### 5-3. 컴포넌트 기반 설계
- 바닐라 자바스크립트를 사용하지만 `Header`, `Footer`, `Modal` 등을 Class 기반의 컴포넌트 형태로 추상화하여 유지보수성과 재사용성을 높였습니다.

---

## 6. 팀원 정보

- **이름**: 백동명
- **역할**: Front-End Developer
- **GitHub**: https://github.com/backdongmyeong
- **Email**: backdongmyeong@gmail.com

- **이름**: 박외숙
- **역할**: Front-End Developer
- **GitHub**: https://github.com/pahkys-prog
- **Email**: pahkys@gmail.com

- **이름**: 이원희
- **역할**: Front-End Developer
- **GitHub**: https://github.com/212jeju
# - **Email**: backdongmyeong@gmail.com

---

Copyright © 2026 ModuLab FE6 Team 5. All rights reserved.