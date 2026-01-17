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
- **API 서버**: 위니브 오픈마켓 서비스 API

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Core** | <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"/> | 웹 표준 및 ES6+ 문법 활용 |
| **Build** | <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white"/> | 빠른 개발 서버 및 번들링 최적화 |
| **Deploy** | <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=github&logoColor=white"/> | 정적 웹 호스팅 |
| **API** | <img src="https://img.shields.io/badge/Fetch_API-000000?style=flat&logo=json&logoColor=white"/> | RESTful API 비동기 통신 |
| **Collaboration** | <img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/> | 형상 관리 및 협업 |

---
## 3. 주요 기능 (Key Features)

### 3-1. 회원가입 및 로그인 (Authentication)
- **탭(Tab) 기반 UI**: 구매자와 판매자 회원을 구분하여 탭 버튼으로 쉽게 전환하며 회원가입을 진행할 수 있습니다.
- **로그인 유효성 검사**: 
  - 아이디/비밀번호 미입력 시 해당 입력창으로 **자동 포커스(Focus)** 이동 및 경고 메시지를 노출합니다.
  - 로그인 성공 시, 사용자가 마지막으로 머물던 **이전 페이지로 리다이렉트**하여 사용자 경험을 최적화했습니다.
- **회원가입 검증**: 
  - 아이디 중복 확인, 비밀번호 확인, 이용약관 동의 등 모든 필드가 유효할 때만 가입 버튼이 활성화됩니다.
  - **판매자 인증**: 사업자 등록번호(10자리) 유효성 검사 로직을 포함하여 비정상적인 입력을 방지합니다.

### 3-2. 헤더 및 네비게이션 (Global Navigation Bar)
- **유저 타입별 맞춤 UI**:
  - **비회원/구매자**: 검색창(UI), 장바구니, 로그인 버튼이 노출됩니다.
  - **판매자**: 장바구니 대신 **판매자 센터** 버튼과 마이페이지가 노출됩니다.
- **마이페이지 드롭다운**: 
  - 마이페이지 아이콘 클릭 시 드롭다운 메뉴가 활성화되며, 아이콘 색상 변경(Active State)으로 현재 상태를 표시합니다.
  - **로그아웃** 기능을 제공하여 세션을 안전하게 종료합니다.
- **검색 기능**: 검색어를 입력하면 해당 키워드가 포함된 상품 목록 페이지로 이동하여 결과를 보여줍니다.

### 3-3. 메인 및 상품 목록 (Home & Product List)
- **인터랙티브 배너**: 슬라이드 형태의 배너를 구현하여 자동 롤링 및 좌우 버튼 컨트롤 기능을 제공합니다.
- **상품 카드**: 상품 이미지, 판매자명, 가격, 상품 이름을 직관적으로 배치하였으며 클릭 시 상세 페이지로 이동합니다.

### 3-4. 상품 상세 (Product Detail)
- **동적 수량 조절**: 
  - `+` / `-` 버튼을 통해서만 수량 변경이 가능하며, **재고 수량을 초과할 경우 버튼이 비활성화**됩니다.
  - 수량 변경에 따른 총 주문 금액을 실시간으로 계산하여 표시합니다.
- **접근 권한 제어**:
  - **비회원**: 장바구니 담기나 바로 구매 시 **로그인 유도 모달(Modal)**을 띄웁니다.
  - **판매자**: 본인의 상품을 구매할 수 없도록 장바구니 및 구매 버튼이 비활성화됩니다.

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

- **이름**: 백동명
- **역할**: Front-End Developer
- **GitHub**: https://github.com/backdongmyeong
- **Email**: backdongmyeong@gmail.com

- **이름**: 백동명
- **역할**: Front-End Developer
- **GitHub**: https://github.com/backdongmyeong
- **Email**: backdongmyeong@gmail.com

---

Copyright © 2026 ModuLab FE6 Team 5. All rights reserved.