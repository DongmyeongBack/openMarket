import Header from "./src/components/Header/Header.js";
import Footer from "./src/components/Footer/Footer.js";

// --- From list.js ---
const API_URL = "https://api.wenivops.co.kr/services/open-market";

let currentSlide = 0;
const SLIDE_COUNT = 5;

// Elements (will be selected in init/fetch)
let productGrid;
let bannerSlide;

async function fetchProducts() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/products/`, {
            method: "GET",
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) throw new Error("상품 데이터를 불러오는데 실패했습니다.");
        const data = await res.json();
        renderProducts(data.results);
        setupBanner(data.results);
    } catch (error) {
        console.error("Error:", error);
        if (productGrid) productGrid.innerHTML = `<p class="error-message show">상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>`;
    }
}

function renderProducts(products) {
    if (!productGrid) return;
    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">등록된 상품이 없습니다.</p>';
        return;
    }
    const productItems = products.map((product) => {
        const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);
        return `
      <li class="product-card">
        <a href="${new URL('./src/pages/product-detail/index.html', import.meta.url).href}?productId=${product.id}">
          <img src="${product.image}" alt="${product.name}" class="product-img" />
          <span class="seller-name">${product.seller.store_name || product.seller.username}</span>
          <h3 class="product-name">${product.name}</h3>
          <strong class="product-price">${formattedPrice}<span>원</span></strong>
        </a>
      </li>
    `;
    }).join("");
    productGrid.innerHTML = productItems;
}

function setupBanner(products) {
    if (!products || products.length === 0 || !bannerSlide) return;
    const bannerProducts = products.slice(0, SLIDE_COUNT);
    const bannerHTML = bannerProducts.map((product) => {
        return `<img src="${product.image}" alt="${product.name}" class="banner-img" />`;
    }).join("");
    bannerSlide.innerHTML = bannerHTML;
    initBannerEvents();
}

function initBannerEvents() {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dots = document.querySelectorAll(".dot");
    if (!prevBtn || !nextBtn) return;

    function moveSlide(index) {
        if (index < 0) currentSlide = SLIDE_COUNT - 1;
        else if (index >= SLIDE_COUNT) currentSlide = 0;
        else currentSlide = index;
        if (bannerSlide) bannerSlide.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot) => dot.classList.remove("active"));
        if (dots[currentSlide]) dots[currentSlide].classList.add("active");
    }

    prevBtn.addEventListener("click", () => moveSlide(currentSlide - 1));
    nextBtn.addEventListener("click", () => moveSlide(currentSlide + 1));
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => moveSlide(index));
    });

    setInterval(() => {
        moveSlide(currentSlide + 1);
    }, 5000);
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    // Header
    const headerTarget = document.querySelector("#header");
    if (headerTarget) new Header(headerTarget);

    // Footer
    const footerTarget = document.querySelector("#footer");
    if (footerTarget) new Footer(footerTarget);

    // List Page Logic
    productGrid = document.getElementById("product-grid");
    bannerSlide = document.querySelector(".banner-slide");

    // Only run fetchProducts if we are on the list page (marked by product-grid existence)
    if (productGrid) {
        fetchProducts();
    }
});
