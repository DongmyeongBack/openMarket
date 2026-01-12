// src/components/Header/Header.js
import "./Header.css";

export default class Header {
    constructor($target) {
        this.$target = $target;
        // [수정] 생성자에서 sessionStorage를 읽으므로, 로그아웃도 sessionStorage를 사용해야 함
        this.token = sessionStorage.getItem("token");
        this.userType = sessionStorage.getItem("user_type"); // 'BUYER' or 'SELLER'

        this.render();
        this.setEvent();
    }

    template() {
        // 1. 공통: 로고
        const logoHtml = `
            <div class="logo">
                <a href="/">
                    <img src="/src/assets/images/Logo-hodu.png" alt="HODU" class="logo-img">
                </a>
            </div>
        `;

        // 2. 검색창 (판매자는 없음)
        const searchHtml =
            this.userType === "SELLER"
                ? ""
                : `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="상품을 검색해보세요!">
                <button class="search-btn"></button>
            </div>
        `;

        // 3. 우측 네비게이션 아이템
        let navItemsHtml = "";

        if (!this.token) {
            // [비로그인 상태]
            navItemsHtml = `
                <button id="cart-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-shopping-cart.svg" alt="장바구니">
                    <span>장바구니</span>
                </button>
                <a href="/src/pages/login/index.html" class="nav-btn">
                    <img src="/src/assets/images/icon-user.svg" alt="로그인">
                    <span>로그인</span>
                </a>
            `;
        } else if (this.userType === "SELLER") {
            // [판매자 로그인 상태]
            navItemsHtml = `
                <button id="my-page-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-user.svg" alt="마이페이지">
                    <span>마이페이지</span>
                </button>
                <a href="/src/pages/seller-center/index.html" class="btn-seller-center">
                    <img src="/src/assets/images/icon-shopping-bag.svg" alt="쇼핑백">
                    판매자 센터
                </a>
                <div class="my-page-dropdown" id="dropdown-menu">
                    <button class="dropdown-item">마이페이지</button>
                    <button class="dropdown-item" id="logout-btn">로그아웃</button>
                </div>
            `;
        } else {
            // [구매자 로그인 상태]
            navItemsHtml = `
                <button id="cart-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-shopping-cart.svg" alt="장바구니">
                    <span>장바구니</span>
                </button>
                <button id="my-page-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-user.svg" alt="마이페이지">
                    <span>마이페이지</span>
                </button>
                <div class="my-page-dropdown" id="dropdown-menu">
                    <button class="dropdown-item">마이페이지</button>
                    <button class="dropdown-item" id="logout-btn">로그아웃</button>
                </div>
            `;
        }

        return `
            <div class="header-container">
                ${logoHtml}
                ${searchHtml}
                <div class="nav-items">
                    ${navItemsHtml}
                </div>
            </div>
        `;
    }

    render() {
        this.$target.innerHTML = this.template();
    }

    setEvent() {
        const cartBtn = this.$target.querySelector("#cart-btn");
        const myPageBtn = this.$target.querySelector("#my-page-btn");
        const logoutBtn = this.$target.querySelector("#logout-btn");
        const dropdown = this.$target.querySelector("#dropdown-menu");

        // 1. 장바구니 버튼 로직
        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                if (this.token) {
                    window.location.href = "/src/pages/cart/index.html"; // 경로 수정 제안
                } else {
                    const confirmLogin = confirm("로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?");
                    if (confirmLogin) {
                        window.location.href = "/src/pages/login/index.html";
                    }
                }
            });
        }

        // 2. 마이페이지 버튼 (드롭다운 토글)
        if (myPageBtn) {
            myPageBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("active");
                myPageBtn.classList.toggle("active");
            });

            document.addEventListener("click", (e) => {
                if (!e.target.closest(".nav-items")) {
                    dropdown.classList.remove("active");
                    myPageBtn.classList.remove("active");
                }
            });
        }

        // 3. 로그아웃 로직
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                sessionStorage.clear();
                alert("로그아웃 되었습니다.");
                window.location.href = "/";
            });
        }
    }
}
