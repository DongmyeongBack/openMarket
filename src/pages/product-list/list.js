// 설정: API 주소 (실제 백엔드 주소로 변경 필요)
const API_URL = "https://api.wenivops.co.kr/services/open-market"; // 예시 URL

const productGrid = document.getElementById("product-grid");
const bannerSlide = document.querySelector(".banner-slide");

// 슬라이드 관련 변수
let currentSlide = 0;
const SLIDE_COUNT = 5; // 배너에 띄울 상품 개수 (인디케이터 개수와 맞춤)

// 1. 상품 목록 가져오기 함수
async function fetchProducts() {
    const token = sessionStorage.getItem("token"); // 로그인 시 저장된 토큰이 있다고 가정

    try {
        const res = await fetch(`${API_URL}/products/`, {
            method: "GET",
            headers: {
                // 토큰이 있으면 넣고, 없으면 헤더에서 제외하거나 빈 값 (API 명세에 따라 조정)
                ...(token && { Authorization: `Bearer ${token}` }),
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("상품 데이터를 불러오는데 실패했습니다.");
        }

        const data = await res.json();

        // API 명세에 따르면 data.results 배열에 상품 정보가 들어있음
        renderProducts(data.results);
        setupBanner(data.results);
    } catch (error) {
        console.error("Error:", error);
        productGrid.innerHTML = `<p class="error-message show">상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>`;
    }
}

// 2. 화면 렌더링 함수
function renderProducts(products) {
    // 상품이 없을 경우
    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">등록된 상품이 없습니다.</p>';
        return;
    }

    // HTML 조각 생성
    const productItems = products
        .map((product) => {
            // 가격 콤마 찍기 (예: 29000 -> 29,000)
            const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);

            // 상세 페이지로 이동할 때 ID를 쿼리 스트링으로 전달 (예: ?id=1)
            return `
      <li class="product-card">
        <a href="/src/pages/product-detail/index.html?productId=${product.id}">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="product-img"
          />
          <span class="seller-name">${product.seller.store_name || product.seller.username}</span>
          <h3 class="product-name">${product.name}</h3>
          <strong class="product-price">${formattedPrice}<span>원</span></strong>
        </a>
      </li>
    `;
        })
        .join("");

    // DOM에 주입
    productGrid.innerHTML = productItems;
}

function setupBanner(products) {
    if (!products || products.length === 0) return;

    // 앞에서부터 5개만 자르기 (인디케이터가 5개이므로)
    const bannerProducts = products.slice(0, SLIDE_COUNT);

    // 3-1. 배너 이미지 HTML 생성 및 주입
    const bannerHTML = bannerProducts
        .map((product) => {
            return `<img src="${product.image}" alt="${product.name}" class="banner-img" />`;
        })
        .join("");

    bannerSlide.innerHTML = bannerHTML;

    // 3-2. 슬라이드 이벤트 연결
    initBannerEvents();
}

// [추가] 4. 배너 슬라이드 동작 함수
function initBannerEvents() {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dots = document.querySelectorAll(".dot");

    // 슬라이드 이동 함수
    function moveSlide(index) {
        // 인덱스 범위 체크 (순환)
        if (index < 0) {
            currentSlide = SLIDE_COUNT - 1;
        } else if (index >= SLIDE_COUNT) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        // 1. 이미지 이동 (translateX 사용)
        bannerSlide.style.transform = `translateX(-${currentSlide * 100}%)`;

        // 2. 인디케이터(점) 업데이트
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[currentSlide].classList.add("active");
    }

    // 버튼 클릭 이벤트
    prevBtn.addEventListener("click", () => moveSlide(currentSlide - 1));
    nextBtn.addEventListener("click", () => moveSlide(currentSlide + 1));

    // 인디케이터 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => moveSlide(index));
    });

    // (선택 사항) 3초마다 자동 슬라이드
    setInterval(() => {
        moveSlide(currentSlide + 1);
    }, 5000);
}
fetchProducts();
