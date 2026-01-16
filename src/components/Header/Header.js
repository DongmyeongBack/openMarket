// src/components/Header/Header.js
import "./Header.css";
import { showLoginModal, showLogoutModal } from "../Modal/Modal.js";
import { searchProducts } from "../../utils/api.js";

// 이미지 임포트
import logoImg from "../../assets/images/Logo-hodu.png";
import iconShoppingCart from "../../assets/images/icon-shopping-cart.svg";
import iconUser from "../../assets/images/icon-user.svg";
import iconShoppingBag from "../../assets/images/icon-shopping-bag.svg";

export default class Header {
    constructor($target) {
        this.$target = $target;
        this.token = localStorage.getItem("token");
        this.userType = localStorage.getItem("userType");
        this.render();
        this.setEvent();
    }

    template() {
        const logoHtml = `
            <div class="logo">
                <a href="${import.meta.env.BASE_URL}/index.html" class="logo">
                    <img src="${logoImg}" alt="HODU" class="logo-img">
                </a>
            </div>
        `;

        const searchHtml = `
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
                    <img src="${iconShoppingCart}" alt="장바구니">
                    <span>장바구니</span>
                </button>
                <a href="${import.meta.env.BASE_URL}src/pages/login/index.html" class="nav-btn">
                    <img src="${iconUser}" alt="로그인">
                    <span>로그인</span>
                </a>
            `;
        } else if (this.userType === "SELLER") {
            navItemsHtml = `
                <div class="my-page-wrapper">
                    <button id="my-page-btn" class="nav-btn">
                        <img src="${iconUser}" alt="마이페이지">
                        <span>마이페이지</span>
                    </button>
                    <div class="my-page-dropdown" id="dropdown-menu">
                        <button class="dropdown-item">마이페이지</button>
                        <button class="dropdown-item" id="logout-btn">로그아웃</button>
                    </div>
                </div>
                <a href="${import.meta.env.BASE_URL}src/pages/seller-center/index.html" class="btn-seller-center">
                    <img src="${iconShoppingBag}" alt="쇼핑백">
                    판매자 센터
                </a>
            `;
        } else {
            navItemsHtml = `
                <button id="cart-btn" class="nav-btn">
                    <img src="${iconShoppingCart}" alt="장바구니">
                    <span>장바구니</span>
                </button>
                <div class="my-page-wrapper">
                    <button id="my-page-btn" class="nav-btn">
                        <img src="${iconUser}" alt="마이페이지">
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
            console.log(`검색어: ${keyword}`);
            const data = await searchProducts(keyword);
            return data.results || [];
        } catch (error) {
            console.error("네트워크 에러:", error);
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

            // 디바운스 타이머 변수
            let debounceTimer;
            // 마지막 요청 키워드 추적 (Race Condition 방지)
            let lastKeyword = "";
            // [추가] 실제 API 호출된 마지막 키워드 (중복 호출 방지)
            let lastFetchedKeyword = "";
            // [추가] 선택 중인지 확인하는 플래그 (네비게이션 중 추가 검색 차단)
            let isSelecting = false;

            // 입력 이벤트 (Debounce 적용)
            searchInput.addEventListener("input", (e) => {
                // 선택 중이라면 입력 이벤트 무시
                if (isSelecting) return;

                const keyword = e.target.value.trim();
                lastKeyword = keyword;

                // 기존 타이머 취소
                clearTimeout(debounceTimer);

                if (keyword === "") {
                    searchResults.style.display = "none";
                    lastFetchedKeyword = "";
                    return;
                }

                // 300ms 딜레이 후 API 요청
                debounceTimer = setTimeout(async () => {
                    // 요청 시점의 키워드가 현재 키워드와 다르면 무시
                    if (keyword !== lastKeyword) return;
                    // [추가] 이미 조회한 키워드와 같으면 요청 생략 (IME 중복 방지)
                    if (keyword === lastFetchedKeyword) return;

                    lastFetchedKeyword = keyword; // [변경] 요청 시작 전 즉시 업데이트하여 중복 차단

                    const products = await this.fetchProducts(keyword);

                    // 응답 시점에도 키워드가 최신인지 다시 확인
                    if (keyword !== lastKeyword) return;

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
                }, 300);
            });

            // 클릭 이벤트 (mousedown으로 변경하여 blur 이벤트보다 먼저 실행되도록 함)
            searchResults.addEventListener("mousedown", (e) => {
                e.preventDefault(); // [중요] input 포커스 유지 (블러 방지)
                clearTimeout(debounceTimer); // [추가] 선택 시 진행 중인 검색 요청 취소
                isSelecting = true; // [추가] 선택 상태 잠금

                const item = e.target.closest(".search-item");
                if (item) {
                    const detailUrl = `${import.meta.env.BASE_URL}src/pages/product-detail/index.html`;
                    window.location.href = `${detailUrl}?productId=${item.dataset.id}`;
                }
            });

            // 검색 실행 (엔터/버튼)
            const handleSearch = () => {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    const listUrl = `${import.meta.env.BASE_URL}index.html`;
                    // Assuming product-list is index.html or handled there?
                    // Original was: ../../pages/product-list/index.html
                    // Wait, vite.config.js checks:
                    // main: resolve(__dirname, "index.html"),
                    // There is no explicit product-list page in vite.config.js input, likely index.html is the list?
                    // Previous file view of index.html title is "쇼핑몰 (상품 목록)". Yes.

                    window.location.href = `${listUrl}?search=${encodeURIComponent(keyword)}`;
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
                const cartUrl = `${import.meta.env.BASE_URL}src/pages/cart/index.html`;
                this.token ? (window.location.href = cartUrl) : showLoginModal();
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
            logoutBtn.addEventListener("click", async () => {
                localStorage.clear();
                await showLogoutModal();
                window.location.href = `${import.meta.env.BASE_URL}index.html`;
            });
        }

        // [추가] 현재 페이지가 장바구니라면 장바구니 버튼 활성화
        if (cartBtn && window.location.pathname.includes("/cart")) {
            cartBtn.classList.add("active");
        }
    }
}
