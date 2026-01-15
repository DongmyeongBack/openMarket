import { request } from "/src/utils/api.js";
import { showLoginModal } from "/src/components/Modal/Modal.js";

import Header from "/src/components/Header/Header.js";
import Footer from "/src/components/Footer/Footer.js";

// DOM 요소 선택
const productImg = document.getElementById("productImage");
const sellerName = document.getElementById("sellerName");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const shippingInfo = document.getElementById("shippingInfo");

// 수량 및 가격 관련 요소
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const quantityDisplay = document.getElementById("quantity");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");

// 액션 버튼
const buyBtn = document.querySelector(".buy");
const cartBtn = document.querySelector(".cart");
const tabs = document.querySelectorAll(".tab");

// 상태 관리 변수
let productData = null;
let currentQuantity = 1;

// 1. 초기화 및 실행
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    if (!productId) {
        alert("잘못된 접근입니다.");
        history.back();
        return;
    }

    const headerTarget = document.querySelector("#header");
    if (headerTarget) {
        new Header(headerTarget);
    }

    // [2] Footer 렌더링
    const footerTarget = document.querySelector("#footer"); // HTML에 id="footer"가 있어야 함
    if (footerTarget) {
        new Footer(footerTarget);
    }

    fetchProductDetail(productId);
});

// 2. 상품 상세 정보 가져오기
async function fetchProductDetail(id) {
    try {
        const data = await request(`/products/${id}/`, {
            method: "GET",
        });

        productData = data;
        renderProduct(data);
        initEventListeners();
    } catch (error) {
        console.error("Error loading product:", error);
        alert("상품 정보를 불러오는 데 실패했습니다.");
    }
}

// 3. 화면 렌더링
function renderProduct(data) {
    console.log(data);
    const { image, name, price, seller, shipping_method, shipping_fee, stock } = data;

    // 이미지 및 기본 정보
    productImg.src = image;
    productImg.alt = name;
    sellerName.textContent = seller.store_name || seller.name;
    productName.textContent = name;
    productPrice.textContent = formatPrice(price);

    // 배송 정보
    const methodText = shipping_method === "PARCEL" ? "택배배송" : "직접배송";
    const feeText = shipping_fee === 0 ? "무료배송" : `${formatPrice(shipping_fee)}원`;
    shippingInfo.textContent = `${methodText} / ${feeText}`;

    // 재고 상태에 따른 초기화
    if (stock === 0) {
        setSoldOutState();
    } else {
        updateTotalUI();
    }
}

// 4. 이벤트 리스너 설정
function initEventListeners() {
    if (!productData || productData.stock === 0) return;

    // (-) 버튼
    minusBtn.addEventListener("click", () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            updateTotalUI();
        }
    });

    // (+) 버튼
    plusBtn.addEventListener("click", () => {
        if (currentQuantity < productData.stock) {
            currentQuantity++;
            updateTotalUI();
        } else {
            alert("최대 구매 가능 수량입니다.");
        }
    });

    // [구매 버튼]
    buyBtn.addEventListener("click", () => {
        // 1. 로그인 체크
        if (!checkLogin()) return;

        // 2. 구매 로직 진행
        const totalAmount = productData.price * currentQuantity;
        alert(
            `[주문 요청]\n상품명: ${productData.name}\n수량: ${currentQuantity}개\n총 금액: ${formatPrice(
                totalAmount
            )}원`
        );
        window.location.href = "/src/pages/payment/index.html";
    });

    // [장바구니 버튼]
    cartBtn.addEventListener("click", handleCartAction);

    // 탭 전환
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            tabs.forEach((t) => t.classList.remove("active"));
            e.target.classList.add("active");
        });
    });
}

/**
 * 로그인 상태 확인 및 모달 호출 함수
 */
function checkLogin() {
    // api.js에서 사용하는 스토리지 키(token) 확인
    const token = localStorage.getItem("token");

    if (!token) {
        showLoginModal(); // 비로그인 시 모달 띄우기
        return false;
    }
    return true;
}

// UI 업데이트
function updateTotalUI() {
    const stock = productData.stock;

    quantityDisplay.textContent = currentQuantity;
    totalQuantity.textContent = currentQuantity;

    const totalAmount = productData.price * currentQuantity;
    totalPrice.textContent = formatPrice(totalAmount);

    minusBtn.disabled = currentQuantity <= 1;
    minusBtn.style.opacity = currentQuantity <= 1 ? "0.3" : "1";

    const isMaxStock = currentQuantity >= stock;
    plusBtn.disabled = isMaxStock;
    plusBtn.style.opacity = isMaxStock ? "0.3" : "1";
}

// 품절 상태 처리
function setSoldOutState() {
    currentQuantity = 0;
    quantityDisplay.textContent = "0";
    totalQuantity.textContent = "0";
    totalPrice.textContent = "0";

    buyBtn.textContent = "품절";
    buyBtn.disabled = true;
    cartBtn.disabled = true;
    minusBtn.disabled = true;
    plusBtn.disabled = true;
}

// 장바구니 로직 (수정됨)
async function handleCartAction() {
    // 1. 로그인 체크
    if (!checkLogin()) return;

    // 2. 서버에 장바구니 추가 요청
    try {
        await request("/cart/", {
            method: "POST",
            body: JSON.stringify({
                product_id: productData.id,
                quantity: currentQuantity,
                check: true, // 장바구니에서 기본적으로 선택된 상태
            }),
        });

        // 3. 장바구니 이동 여부 확인
        const moveToCart = confirm("장바구니에 상품을 담았습니다.\n장바구니 페이지로 이동하시겠습니까?");

        if (moveToCart) {
            window.location.href = "/src/pages/cart/index.html"; // 장바구니 페이지 경로
        }
    } catch (error) {
        console.error("장바구니 추가 실패:", error);
        // 이미 장바구니에 있는 경우 등 에러 처리
        alert("이미 장바구니에 담긴 상품이거나 통신 오류가 발생했습니다.");
    }
}

// 유틸리티: 가격 포맷팅
function formatPrice(price) {
    return new Intl.NumberFormat("ko-KR").format(price);
}
