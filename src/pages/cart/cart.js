import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import { getCart, updateCartItem, deleteCartItem } from "../../utils/api.js";
import { showLoginModal, showDeleteModal } from "../../components/Modal/Modal.js";

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
const shippingFeeEl = document.getElementById("shipping-fee");
const finalAmountEl = document.getElementById("final-amount");
const selectAllCheckbox = document.getElementById("selectAll"); // [추가] 전체 선택 체크박스

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
        const data = await getCart();

        // 3. 데이터가 비어있는 경우 처리
        console.log("data: ", data);
        if (data.count === 0 || !data.results) {
            cartItems = [];
        } else {
            // 4. API 데이터 구조를 화면 렌더링용 구조로 매핑(변환)
            // API의 results 배열 안에는 { id, product: { ... }, quantity } 구조로 들어옵니다.
            cartItems = data.results.map((item) => ({
                cart_id: item.id, // 장바구니 항목 ID (삭제/수정 시 필요)
                product_id: item.product.id, // 상품 ID
                seller: item.product.seller.store_name, // 판매자명
                name: item.product.name, // 상품명
                price: item.product.price, // 가격
                shipping: item.product.shipping_fee, // 배송비
                image: item.product.image, // 이미지 URL
                quantity: item.quantity, // 수량
                isChecked: true, // [추가] 체크 상태 관리 (기본값: true)
            }));
            console.log(cartItems);
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
    cartSummaryEl.style.display = "flex";
    btnOrderAll.style.display = "block";


    cartListEl.innerHTML = cartItems
        .map(
            (item) => `
    <li class="cart-item" data-cart-id="${item.cart_id}" data-product-id="${item.product_id}">
        <input type="checkbox" class="checkbox" checked>
        
        <a href="/src/pages/product-detail/index.html?productId=${item.product_id}" class="product-img-link">
            <img src="${item.image}" alt="${item.name}" class="product-img">
        </a>
        
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
        <button class="btn-delete">
            <img src="/src/assets/images/icon-delete.svg" alt="삭제" />
        </button>
    </li>
`
        )
        .join("");

    updateSummary();

    // [추가] 렌더링 시 전체 선택 체크박스 상태 동기화
    if (cartItems.length > 0) {
        selectAllCheckbox.checked = cartItems.every(item => item.isChecked);
    } else {
        selectAllCheckbox.checked = false;
    }
}

/**
 * 합계 계산 함수
 */
function updateSummary() {
    // [수정] 체크된 항목만 계산
    const selectedItems = cartItems.filter(item => item.isChecked);

    const totalProductPrice = selectedItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    const totalShipping = selectedItems.reduce((acc, cur) => acc + cur.shipping, 0);
    console.log(totalProductPrice, totalShipping);
    // UI 업데이트
    totalPriceEl.textContent = totalProductPrice.toLocaleString();
    shippingFeeEl.textContent = totalShipping.toLocaleString();

    // 최종 결제 금액 (상품금액 + 배송비)
    const finalAmount = totalProductPrice + totalShipping;
    finalAmountEl.textContent = finalAmount.toLocaleString();
}

// [추가됨] 수량 변경 API 요청 함수
async function updateCartQuantity(cartId, newQuantity) {
    try {
        // API 명세: PUT /cart/<cart_item_id>/, body: { quantity: Int }
        // API 명세: PUT /cart/<cart_item_id>/, body: { quantity: Int }
        const result = await updateCartItem(cartId, newQuantity);
        return result; // 수정된 장바구니 아이템 객체 반환
    } catch (error) {
        alert("수량 변경에 실패했습니다.");
        console.error(error);
        return null;
    }
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
        const newQty = item.quantity + 1;

        // API 호출
        const updatedItem = await updateCartQuantity(cartId, newQty);

        if (updatedItem) {
            // 성공 시 로컬 데이터 업데이트 및 렌더링
            item.quantity = updatedItem.quantity;
            renderCart();
        }
    }
    // 2. 수량 감소 (-)
    else if (e.target.classList.contains("minus")) {
        if (item.quantity > 1) {
            const newQty = item.quantity - 1;

            // API 호출
            const updatedItem = await updateCartQuantity(cartId, newQty);

            if (updatedItem) {
                // 성공 시 로컬 데이터 업데이트 및 렌더링
                item.quantity = updatedItem.quantity;
                renderCart();
            }
        } else {
            alert("최소 수량은 1개입니다.");
        }
    } else if (e.target.closest(".btn-delete")) {
        // 1. 삭제 모달 띄우기 (결과를 기다림)
        const isConfirmed = await showDeleteModal();
        if (isConfirmed) {
            try {
                // 2. API 삭제 요청 (DELETE 메서드 사용)
                // 명세: DELETE /cart/<int:cart_item_id>/
                // 2. API 삭제 요청 (DELETE 메서드 사용)
                await deleteCartItem(cartId);

                // 3. 성공 시: 로컬 데이터 배열(cartItems)에서 삭제된 아이템 제거
                cartItems = cartItems.filter((i) => i.cart_id !== cartId);

                // 4. 화면 다시 그리기 (삭제된 항목 제거 및 총 금액 재계산)
                renderCart();
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("상품 삭제 처리에 실패했습니다.");
            }
        }
    }
    // [수정] 개별 상품 주문 버튼: localStorage에 데이터 저장 후 이동
    else if (e.target.classList.contains("btn-order-single")) {
        const orderData = {
            order_kind: "cart_order",
            // 단일 상품 주문이지만 카트에서 주문하므로 cart_order로 처리
            // API 명세 5.1.2에 따라 cart_order는 리스트 형태의 items를 보냄
            product_ids: [item.product_id]
        };
        localStorage.setItem("order_data", JSON.stringify(orderData));
        window.location.href = "/src/pages/payment/index.html";
    }
});

// [추가] 체크박스 상태 변경 이벤트 (이벤트 위임 - change 사용)
cartListEl.addEventListener("change", (e) => {
    if (e.target.classList.contains("checkbox")) {
        const cartItemEl = e.target.closest(".cart-item");
        const cartId = parseInt(cartItemEl.dataset.cartId);
        const item = cartItems.find((i) => i.cart_id === cartId);

        if (item) {
            item.isChecked = e.target.checked;

            // [추가] 개별 선택 시 '전체 선택' 체크박스 상태 동기화
            const isAllChecked = cartItems.every(i => i.isChecked);
            selectAllCheckbox.checked = isAllChecked;

            updateSummary(); // 합계 재계산
        }
    }
});

// [추가] 전체 선택 체크박스 이벤트
selectAllCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;

    // 1. 상태 업데이트
    cartItems.forEach(item => {
        item.isChecked = isChecked;
    });

    // 2. DOM 업데이트 (개별 체크박스들)
    const checkboxes = document.querySelectorAll(".cart-item .checkbox");
    checkboxes.forEach(cb => {
        cb.checked = isChecked;
    });

    // 3. 합계 재계산
    updateSummary();
});

// [수정] 전체 주문하기 버튼 클릭 이벤트: localStorage에 데이터 저장 후 이동
btnOrderAll.addEventListener("click", () => {
    if (cartItems.length === 0) {
        alert("장바구니에 담긴 상품이 없습니다.");
        return;
    }

    // [수정] 체크된 상품만 필터링
    const selectedItems = cartItems.filter(item => item.isChecked);

    if (selectedItems.length === 0) {
        alert("주문할 상품을 선택해주세요.");
        return;
    }

    const orderData = {
        order_kind: "cart_order",
        product_ids: selectedItems.map(item => item.product_id)
    };
    localStorage.setItem("order_data", JSON.stringify(orderData));

    window.location.href = "/src/pages/payment/index.html";
});

// 초기 실행
getCartData();