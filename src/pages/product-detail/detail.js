/* 1. api.js에서 request 함수 불러오기 */
import { request } from "/src/utils/api.js";
import { showLoginModal } from "/src/components/Modal/Modal.js";

import Header from "/src/components/Header/Header.js";
import Footer from "/src/components/Footer/Footer.js";

/* [추가] 공통 컴포넌트 초기화 */
const headerTarget = document.getElementById("header");
new Header(headerTarget);

const footerTarget = document.getElementById("footer");
new Footer(footerTarget);

let product = null;
let quantity = 1;

/* DOM 요소 선택 */
const imageEl = document.getElementById("productImage");
const sellerNameEl = document.getElementById("sellerName");
const nameEl = document.getElementById("productName");
const priceEl = document.getElementById("productPrice");
const shippingEl = document.getElementById("shippingInfo");

const quantityEl = document.getElementById("quantity");
const totalQuantityEl = document.getElementById("totalQuantity");
const totalPriceEl = document.getElementById("totalPrice");

const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");

const buyBtn = document.querySelector(".buy"); // '바로 구매' 버튼
const cartBtn = document.querySelector(".cart"); // '장바구니' 버튼

/* URL에서 productId 가져오기 */
const params = new URLSearchParams(location.search);
const productId = params.get("productId");

/* 초기 실행 */
if (productId) {
    loadProduct();
} else {
    alert("유효하지 않은 상품입니다.");
    location.href = "/"; // 메인으로 돌려보내기 (선택사항)
}

/* API 호출 및 화면 렌더링 */
async function loadProduct() {
    try {
        // 2. 수정된 부분: getProductDetail 함수 호출
        product = await getProductDetail(productId);

        // 데이터 확인용 (개발 중에만 사용하고 나중에 지우세요)
        console.log("불러온 상품 데이터:", product);

        /* 화면에 데이터 채우기 */
        imageEl.src = product.image;
        sellerNameEl.textContent = product.seller.store_name;
        nameEl.textContent = product.name;
        priceEl.textContent = product.price.toLocaleString();

        shippingEl.textContent =
            product.shipping_fee === 0 ? "무료배송" : `배송비 ${product.shipping_fee.toLocaleString()}원`;

        /* 초기 가격 및 버튼 상태 업데이트 */
        updatePrice();
        updateButtonState();
    } catch (e) {
        console.error("에러 발생:", e);
        alert("상품 정보를 불러올 수 없습니다.");
    }
}

/* --- 이벤트 리스너 --- */

/* 수량 증가 */
plusBtn.addEventListener("click", () => {
    if (product && quantity < product.stock) {
        quantity++;
        updateUI();
    }
});

/* 수량 감소 */
minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
        quantity--;
        updateUI();
    }
});

buyBtn.addEventListener("click", () => {
    // 1. 로그인 상태 확인 (localStorage에 토큰이 있는지 확인)
    const token = sessionStorage.getItem("token");

    if (!token) {
        // 2. 로그인이 안 되어 있으면 모달 띄우기
        showLoginModal();
    } else {
        // 3. 로그인 되어 있으면 구매 로직 실행 (예: 결제 페이지 이동 등)
        console.log("구매 프로세스 진행");
        // window.location.href = "/src/pages/order/index.html";
    }
});

// (참고) '장바구니' 버튼도 동일한 로직이 필요할 수 있습니다.
cartBtn.addEventListener("click", () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        showLoginModal();
    } else {
        console.log("장바구니 담기 API 호출");
        // addCart(productId, quantity);
    }
});

/* UI 업데이트 헬퍼 함수들 */
function updateUI() {
    quantityEl.textContent = quantity;
    totalQuantityEl.textContent = quantity;
    updatePrice();
    updateButtonState();
}

function updatePrice() {
    if (!product) return;
    const total = product.price * quantity;
    totalPriceEl.textContent = total.toLocaleString();
}

function updateButtonState() {
    if (!product) return;
    plusBtn.disabled = quantity >= product.stock;
    minusBtn.disabled = quantity <= 1;
}

/* 3. 수정된 API 함수: fetch 대신 request 사용 */
/* 이 함수는 api.js의 request를 통해 데이터를 가져옵니다. */
export async function getProductDetail(productId) {
    // api.js의 BASE_URL이 자동으로 붙으므로 경로만 적어주면 됩니다.
    // fetch와 달리 res.json() 처리를 request 내부에서 하므로 바로 리턴하면 됩니다.
    return await request(`/products/${productId}/`);
}

/* 탭 버튼 기능 */
const tabs = document.querySelectorAll(".detail-tab .tab");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
    });
});
