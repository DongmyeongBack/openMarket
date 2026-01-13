// src/pages/cart/cart.js

import { showLoginModal } from "../../components/Modal/Modal.js";

/**
 * [가정]
 * - 로그인 여부는 localStorage의 "accessToken" 존재 여부로 판단
 *   (프로젝트에서 사용하는 방식에 맞게 수정 가능)
 */
function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

/**
 * 장바구니 더미 데이터
 * (실제 구현 시 localStorage 또는 API 데이터로 대체)
 */
let cartItems = [
  {
    id: 1,
    name: "딥러닝 개발자 무릎 담요",
    price: 17500,
    quantity: 1,
    image: "/assets/images/product.png",
  },
];

const cartList = document.getElementById("cartList");
const totalPriceEl = document.getElementById("totalPrice");
const orderBtn = document.querySelector(".order-btn");

/**
 * 장바구니 렌더링
 */
function renderCart() {
  cartList.innerHTML = "";

  cartItems.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-quantity">수량: ${item.quantity}</p>
        </div>
      </div>
      <div class="cart-item-price">
        ${(item.price * item.quantity).toLocaleString()}원
      </div>
    `;

    cartList.appendChild(cartItem);
  });

  updateTotalPrice();
}

/**
 * 총 금액 계산
 */
function updateTotalPrice() {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  totalPriceEl.textContent = total.toLocaleString();
}

/**
 * 주문하기 버튼 클릭 이벤트
 */
orderBtn.addEventListener("click", () => {
  // 1️⃣ 로그인 여부 확인
  if (!isLoggedIn()) {
    // 로그인 안 되어 있으면 → 로그인 요청 모달 표시
    showLoginModal();
    return;
  }

  // 2️⃣ 로그인 되어 있으면 → 주문 처리 (임시 처리)
  alert("주문 페이지로 이동합니다.");
  // 예시:
  // window.location.href = "/src/pages/order/index.html";
});

/**
 * 초기 실행
 */
renderCart();
