import Header from "/src/components/Header/Header.js";
import Footer from "/src/components/Footer/Footer.js";
import { request } from "/src/utils/api.js"; // api.js 경로 확인 필요
import { showLoginModal, showDeleteModal } from "/src/components/Modal/Modal.js";

/* [공통 컴포넌트 초기화] */
const headerTarget = document.getElementById("header");
new Header(headerTarget);

const footerTarget = document.getElementById("footer");
new Footer(footerTarget);

// 상태 변수 (초기값은 빈 배열)
let cartItems = [];

// DOM 요소 선택
const cartListEl = document.getElementById("cart-list");
const emptyCartEl = document.getElementById("empty-cart");
const cartSummaryEl = document.getElementById("cart-summary");
const btnOrderAll = document.querySelector(".btn-order-all");
const totalPriceEl = document.getElementById("total-price");
const finalAmountEl = document.getElementById("final-amount");

/**
 * 장바구니 데이터 가져오기 (API 호출)
 */
async function getCartData() {
    // 1. 로그인 여부 확인 (토큰이 없으면 로그인 페이지로)
    const token = localStorage.getItem("token");
    if (!token) {
        showLoginModal();
        window.location.href = "/src/pages/login/index.html";
        return;
    }

    try {
        // 2. API 요청
        const data = await request("/cart/");

        // 3. 데이터가 비어있는 경우 처리
        console.log("data: ", data);
        if (data.count === 0 || !data.results) {
            cartItems = [];
        } else {
            // 4. API 데이터 구조를 화면 렌더링용 구조로 매핑(변환)
            // API의 results 배열 안에는 { id, product: { ... }, quantity } 구조로 들어옵니다.
            console.log(cartItems);
            cartItems = data.results.map((item) => ({
                cart_id: item.id, // 장바구니 항목 ID (삭제/수정 시 필요)
                product_id: item.product.product_id, // 상품 ID
                seller: item.product.seller.store_name, // 판매자명
                name: item.product.name, // 상품명
                price: item.product.price, // 가격
                shipping: item.product.shipping_fee, // 배송비
                image: item.product.image, // 이미지 URL
                quantity: item.quantity, // 수량
            }));
        }

        // 5. 화면 렌더링
        renderCart();
    } catch (error) {
        console.error("장바구니 로딩 실패:", error);
        // 401 Unauthorized 등의 에러 처리
        if (error.status === 401 || error.status === 403) {
            alert("로그인 정보가 만료되었거나 접근 권한이 없습니다.");
            window.location.href = "/src/pages/login/index.html";
        }
    }
}

/**
 * 렌더링 함수
 */
function renderCart() {
    // 장바구니가 비었을 때
    if (cartItems.length === 0) {
        cartListEl.style.display = "none";
        cartSummaryEl.style.display = "none";
        btnOrderAll.style.display = "none";
        emptyCartEl.style.display = "block";
        return;
    }

    // 장바구니가 비어있지 않을 때
    emptyCartEl.style.display = "none";
    cartListEl.style.display = "block";
    cartSummaryEl.style.display = "block";
    btnOrderAll.style.display = "block";

    cartListEl.innerHTML = cartItems
        .map(
            (item) => `
        <li class="cart-item" data-cart-id="${item.cart_id}" data-product-id="${item.product_id}">
            <input type="checkbox" class="checkbox" checked>
            <img src="${item.image}" alt="${item.name}" class="product-img">
            <div class="product-info">
                <p class="seller-name">${item.seller}</p>
                <p class="product-name">${item.name}</p>
                <p class="product-price">${item.price.toLocaleString()}원</p>
                <p class="shipping-info">
                    ${item.shipping > 0 ? `${item.shipping.toLocaleString()}원` : "무료배송"}
                </p>
            </div>
            <div class="quantity-ctrl">
                <button type="button" class="minus">-</button>
                <span>${item.quantity}</span>
                <button type="button" class="plus">+</button>
            </div>
            <div class="item-total">
                <p class="item-total-price">${(item.price * item.quantity).toLocaleString()}원</p>
                <button class="btn-order-single">주문하기</button>
            </div>
            <button class="btn-delete">×</button>
        </li>
    `
        )
        .join("");

    updateSummary();
}

/**
 * 합계 계산 함수
 */
function updateSummary() {
    const totalProductPrice = cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    const totalShipping = cartItems.reduce((acc, cur) => acc + cur.shipping, 0);

    // UI 업데이트 (배송비 포함 여부는 기획에 따라 조정, 여기선 상품 금액만 표시 예시)
    totalPriceEl.textContent = totalProductPrice.toLocaleString();

    // 최종 결제 금액 (상품금액 + 배송비)
    const finalAmount = totalProductPrice + totalShipping;
    finalAmountEl.textContent = finalAmount.toLocaleString();
}

// 이벤트 위임 (수량 조절 및 삭제)
// 주의: 현재는 화면상에서만 변경됩니다. 실제 서버 데이터를 변경하려면
// PUT /cart/{cart_item_id}/ (수량변경) 및 DELETE /cart/{cart_item_id}/ (삭제) API 호출이 추가로 필요합니다.
cartListEl.addEventListener("click", async (e) => {
    const cartItemEl = e.target.closest(".cart-item");
    if (!cartItemEl) return;

    const cartId = parseInt(cartItemEl.dataset.cartId); // API상의 장바구니 아이템 ID
    const item = cartItems.find((i) => i.cart_id === cartId);

    if (!item) return;

    if (e.target.classList.contains("plus")) {
        // TODO: 여기서 수량 증가 API 호출 (await request(..., 'PUT', ...))
        item.quantity++;
        renderCart();
    } else if (e.target.classList.contains("minus") && item.quantity > 1) {
        // TODO: 여기서 수량 감소 API 호출
        item.quantity--;
        renderCart();
    } else if (e.target.classList.contains("btn-delete")) {
        // TODO: 여기서 삭제 API 호출 (DELETE)
        const isConfirmed = await showDeleteModal();

        if (isConfirmed) {
            // 확인 버튼을 눌렀을 때만 실행
            try {
                /* 실제 삭제 API 예시 
                await request(`/cart/${cartId}/`, { method: "DELETE" });
                */
                cartItems = cartItems.filter((i) => i.cart_id !== cartId);
                renderCart();
            } catch (error) {
                console.error("삭제 실패:", error);
            }
        }
    }
});

// 초기 실행
getCartData();
