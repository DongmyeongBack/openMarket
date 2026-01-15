// src/components/Header/Header.js
import "./Header.css";
import { showLoginModal } from "../Modal/Modal.js";

export default class Header {
    constructor($target) {
        this.$target = $target;
        this.token = localStorage.getItem("token");
        this.userType = localStorage.getItem("userType");

        // [디버깅] 현재 상태 확인
        console.log("👤 유저 상태:", this.token ? "회원(토큰 있음)" : "비회원(토큰 없음)");

        this.render();
        this.setEvent();
    }

    template() {
        const logoHtml = `
            <div class="logo">
                <a href="/">
                    <img src="/src/assets/images/Logo-hodu.png" alt="HODU" class="logo-img">
                </a>
            </div>
        `;

        const searchHtml =
            this.userType === "SELLER"
                ? ""
                : `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="상품을 검색해보세요!">
                <button class="search-btn"></button>
                <ul id="search-results" class="search-results"></ul>
            </div>
        `;

        let navItemsHtml = "";

        if (!this.token) {
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
            navItemsHtml = `
                <div class="my-page-wrapper">
                    <button id="my-page-btn" class="nav-btn">
                        <img src="/src/assets/images/icon-user.svg" alt="마이페이지">
                        <span>마이페이지</span>
                    </button>
                    <div class="my-page-dropdown" id="dropdown-menu">
                        <button class="dropdown-item">마이페이지</button>
                        <button class="dropdown-item" id="logout-btn">로그아웃</button>
                    </div>
                </div>
                <a href="/src/pages/seller-center/index.html" class="btn-seller-center">
                    <img src="/src/assets/images/icon-shopping-bag.svg" alt="쇼핑백">
                    판매자 센터
                </a>
            `;
        } else {
            navItemsHtml = `
                <button id="cart-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-shopping-cart.svg" alt="장바구니">
                    <span>장바구니</span>
                </button>
                <div class="my-page-wrapper">
                    <button id="my-page-btn" class="nav-btn">
                        <img src="/src/assets/images/icon-user.svg" alt="마이페이지">
                        <span>마이페이지</span>
                    </button>
                    <div class="my-page-dropdown" id="dropdown-menu">
                        <button class="dropdown-item">마이페이지</button>
                        <button class="dropdown-item" id="logout-btn">로그아웃</button>
                    </div>
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

    async fetchProducts(keyword) {
        try {
            const url = new URL("https://api.wenivops.co.kr/services/open-market/products/");
            url.searchParams.append("search", keyword);

            console.log(`📡 요청 URL: ${url.toString()}`);

            // 헤더 설정 (기본적으로 JSON 타입만 설정)
            const headers = {
                "Content-Type": "application/json",
            };

            // [핵심] 토큰이 있을 때만 Authorization 헤더 추가
            // 토큰이 없으면 헤더 없이 요청 (비회원 검색)
            if (this.token) {
                headers["Authorization"] = `Bearer ${this.token}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                console.error(`❌ API 오류: ${response.status}`);
                return [];
            }

            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error("❌ 네트워크 에러:", error);
            return [];
        }
    }

    setEvent() {
        const cartBtn = this.$target.querySelector("#cart-btn");
        const myPageBtn = this.$target.querySelector("#my-page-btn");
        const logoutBtn = this.$target.querySelector("#logout-btn");
        const dropdown = this.$target.querySelector("#dropdown-menu");

        const searchInput = this.$target.querySelector(".search-input");
        const searchBtn = this.$target.querySelector(".search-btn");
        let searchResults = this.$target.querySelector("#search-results");

        if (searchInput) {
            if (!searchResults) {
                searchResults = document.createElement("ul");
                searchResults.id = "search-results";
                searchResults.className = "search-results";
                searchInput.parentElement.appendChild(searchResults);
            }

            // 입력 이벤트
            searchInput.addEventListener("input", async (e) => {
                const keyword = e.target.value.trim();

                if (keyword === "") {
                    searchResults.style.display = "none";
                    return;
                }

                // [수정] 비회원 차단 코드 삭제함 -> 누구나 검색 가능

                const products = await this.fetchProducts(keyword);

                if (products.length > 0) {
                    searchResults.innerHTML = products
                        .slice(0, 10)
                        .map(
                            (product) => `
                        <li class="search-item" data-id="${product.id}">
                            ${product.name}
                        </li>
                    `
                        )
                        .join("");
                    searchResults.style.display = "block";
                } else {
                    searchResults.style.display = "none";
                }
            });

            // 클릭 이벤트 (mousedown으로 변경하여 blur 이벤트보다 먼저 실행되도록 함)
            searchResults.addEventListener("mousedown", (e) => {
                const item = e.target.closest(".search-item");
                if (item) {
                    window.location.href = `/src/pages/product-detail/index.html?productId=${item.dataset.id}`;
                }
            });

            // 검색 실행 (엔터/버튼)
            const handleSearch = () => {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    window.location.href = `/src/pages/product-list/index.html?search=${encodeURIComponent(keyword)}`;
                }
            };

            if (searchBtn) searchBtn.addEventListener("click", handleSearch);
            searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") handleSearch();
            });

            document.addEventListener("click", (e) => {
                if (!e.target.closest(".search-container")) {
                    searchResults.style.display = "none";
                }
            });
        }

        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                this.token ? (window.location.href = "/src/pages/cart/index.html") : showLoginModal();
            });
        }
        if (myPageBtn && dropdown) {
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
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.clear();
                alert("로그아웃 되었습니다.");
                window.location.href = "/";
            });
        }
    }
}
