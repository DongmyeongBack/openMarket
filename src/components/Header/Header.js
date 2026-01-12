// src/components/Header/Header.js
import "./Header.css";

export default class Header {
    constructor($target) {
        this.$target = $target;
        // 로컬 ?�토리�??�서 ?�큰�??��? ?�??가?�오�?(가??
        this.token = sessionStorage.getItem("token");
        this.userType = sessionStorage.getItem("user_type"); // 'BUYER' or 'SELLER'

        this.render();
        this.setEvent();
    }

    template() {
        // 1. 공통: 로고
        const logoHtml = `
            <h1 class="logo">
                <a href="/">
                    <img src="/src/assets/images/Logo-hodu.png" alt="HODU" class="logo-img">
                </a>
            </h1>
        `;

        // 2. 검?�창 (?�매?�는 ?�음)
        const searchHtml =
            this.userType === "SELLER"
                ? ""
                : `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="?�품??검?�해보세??">
                <button class="search-btn"></button>
            </div>
        `;

        // 3. ?�측 ?�비게이???�이??
        let navItemsHtml = "";

        if (!this.token) {
            // [비로그인 ?�태]
            navItemsHtml = `
                <button id="cart-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-shopping-cart.svg" alt="?�바구니">
                    <span>?�바구니</span>
                </button>
                <a href="/src/pages/login/index.html" class="nav-btn">
                    <img src="/src/assets/images/icon-user.svg" alt="로그??>
                    <span>로그??/span>
                </a>
            `;
        } else if (this.userType === "SELLER") {
            // [?�매??로그???�태]
            navItemsHtml = `
                <button id="my-page-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-user.svg" alt="마이?�이지">
                    <span>마이?�이지</span>
                </button>
                <a href="/src/pages/seller-center/index.html" class="btn-seller-center">
                    <img src="/src/assets/images/icon-shopping-bag.svg" alt="?�핑�?>
                    ?�매???�터
                </a>
                <div class="my-page-dropdown" id="dropdown-menu">
                    <button class="dropdown-item">마이?�이지</button>
                    <button class="dropdown-item" id="logout-btn">로그?�웃</button>
                </div>
            `;
        } else {
            // [구매??로그???�태]
            navItemsHtml = `
                <button id="cart-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-shopping-cart.svg" alt="?�바구니">
                    <span>?�바구니</span>
                </button>
                <button id="my-page-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-user.svg" alt="마이?�이지">
                    <span>마이?�이지</span>
                </button>
                <div class="my-page-dropdown" id="dropdown-menu">
                    <button class="dropdown-item">마이?�이지</button>
                    <button class="dropdown-item" id="logout-btn">로그?�웃</button>
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

        // 1. ?�바구니 버튼 로직
        if (cartBtn) {
            cartBtn.addEventListener("click", () => {
                if (this.token) {
                    // 로그???�태: ?�바구니 ?�이지 ?�동
                    window.location.href = "/src/pages/product-list/index.html"; // (주의: ?�바구니 ?�이지 경로�??�정 ?�요, ?? /pages/cart/index.html)
                } else {
                    // 비로그인 ?�태: 로그???�내 모달
                    // (Modal 컴포?�트가 ?�다�?new Modal().show() ?�을 ?�용)
                    const confirmLogin = confirm("로그?�이 ?�요???�비?�입?�다.\n로그???�시겠습?�까?");
                    if (confirmLogin) {
                        window.location.href = "/src/pages/login/index.html";
                    }
                }
            });
        }

        // 2. 마이?�이지 버튼 (?�롭?�운 ?��?)
        if (myPageBtn) {
            myPageBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // ?�벤??버블�?방�?
                dropdown.classList.toggle("active");
            });

            // ?�면 ?�른 �??�릭 ???�롭?�운 ?�기
            document.addEventListener("click", (e) => {
                if (!e.target.closest(".nav-items")) {
                    dropdown.classList.remove("active");
                }
            });
        }

        // 3. 로그?�웃 로직
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                sessionStorage.clear(); // ?�큰 �??��? ?�보 ??��
                alert("로그?�웃 ?�었?�니??");
                window.location.href = "/"; // 메인?�로 리다?�렉??
            });
        }
    }
}
