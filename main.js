import Header from "./src/components/Header/Header.js";
import Footer from "./src/components/Footer/Footer.js";
import { getProducts } from "./src/utils/api.js"; // api.js에서 함수 임포트

// --- State Variables ---
let currentSlide = 0;
const SLIDE_COUNT = 5;

// --- DOM Elements (Selected in init) ---
let productGrid;
let bannerSlide;

/**
 * 상품 데이터를 가져와서 화면에 렌더링하는 함수
 * (api.js의 getProducts 사용)
 */
async function fetchProducts() {
    try {
        // 1. API 호출 (Token, Header, URL 처리는 api.js가 담당)
        const data = await getProducts();

        // 2. 데이터 렌더링
        renderProducts(data.results);
        setupBanner(data.results);

    } catch (error) {
        console.error("Error loading products:", error);

        // 3. 에러 발생 시 UI 처리
        if (productGrid) {
            productGrid.innerHTML = `
                <p class="error-message show">
                    상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
                </p>`;
        }
    }
}

/**
 * 상품 목록(Grid) 렌더링
 */
function renderProducts(products) {
    if (!productGrid) return;

    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">등록된 상품이 없습니다.</p>';
        return;
    }

    const productItems = products.map((product) => {
        const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);
        // store_name이 없으면 username(판매자 ID) 사용
        const sellerName = product.seller.store_name || product.seller.username;
        console.log(product);
        return `
            <li class="product-card">
                <a href="${import.meta.env.BASE_URL}src/pages/product-detail/index.html?productId=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-img" />
                    <span class="seller-name">${sellerName}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <strong class="product-price">${formattedPrice}<span>원</span></strong>
                </a>
            </li>
        `;
    }).join("");

    productGrid.innerHTML = productItems;
}

/**
 * 배너(Carousel) 초기 설정
 */
function setupBanner(products) {
    if (!products || products.length === 0 || !bannerSlide) return;

    // 앞에서부터 5개만 슬라이드로 사용
    const bannerProducts = products.slice(0, SLIDE_COUNT);

    const bannerHTML = bannerProducts.map((product) => {
        return `<img src="${product.image}" alt="${product.name}" class="banner-img" />`;
    }).join("");

    bannerSlide.innerHTML = bannerHTML;

    // 배너 이벤트(클릭, 자동넘김 등) 연결
    initBannerEvents();
}

/**
 * 배너 이벤트 핸들러 (이전/다음 버튼, 도트, 자동재생)
 */
function initBannerEvents() {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dots = document.querySelectorAll(".dot");

    // 버튼이 없으면(HTML 구조 문제 등) 실행 중단
    if (!prevBtn || !nextBtn) return;

    function moveSlide(index) {
        if (index < 0) currentSlide = SLIDE_COUNT - 1;
        else if (index >= SLIDE_COUNT) currentSlide = 0;
        else currentSlide = index;

        if (bannerSlide) {
            bannerSlide.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        dots.forEach((dot) => dot.classList.remove("active"));
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add("active");
        }
    }

    // 이벤트 리스너 등록
    prevBtn.addEventListener("click", () => moveSlide(currentSlide - 1));
    nextBtn.addEventListener("click", () => moveSlide(currentSlide + 1));

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => moveSlide(index));
    });

    // 5초마다 자동 슬라이드
    setInterval(() => {
        moveSlide(currentSlide + 1);
    }, 5000);
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. 공통 컴포넌트 렌더링
    const headerTarget = document.querySelector("#header");
    if (headerTarget) new Header(headerTarget);

    const footerTarget = document.querySelector("#footer");
    if (footerTarget) new Footer(footerTarget);

    // 2. 요소 선택
    productGrid = document.getElementById("product-grid");
    bannerSlide = document.querySelector(".banner-slide");

    // 3. 상품 목록 페이지라면 데이터 로드 시작
    if (productGrid) {
        fetchProducts();
    }
});