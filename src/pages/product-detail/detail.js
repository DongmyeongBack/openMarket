import { request } from "/src/utils/api.js";
import { showLoginModal, showCartMoveModal } from "/src/components/Modal/Modal.js";

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

    const footerTarget = document.querySelector("#footer");
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

    // [추가됨] 판매자 권한 확인 및 UI 비활성화 처리
    checkSellerMode();
}

// [새로 추가된 함수] 판매자 모드 확인
function checkSellerMode() {
    // 로그인 시 localStorage에 저장된 user_type을 가져옵니다.
    // (로그인 로직에서 setItem("user_type", "SELLER")가 되어 있다고 가정)
    const userType = localStorage.getItem("userType");

    if (userType === "SELLER") {
        // 1. 버튼 비활성화
        buyBtn.disabled = true;
        cartBtn.disabled = true;
        minusBtn.disabled = true;
        plusBtn.disabled = true;

        // 2. 스타일 변경 (선택 사항: 시각적으로 비활성화 느낌 주기)
        buyBtn.style.backgroundColor = "#ccc";
        buyBtn.textContent = "판매자 구매 불가"; // 텍스트 변경
        buyBtn.style.cursor = "not-allowed";

        cartBtn.style.backgroundColor = "#eee";
        cartBtn.style.cursor = "not-allowed";

        // 수량 버튼도 흐릿하게 처리
        minusBtn.style.opacity = "0.3";
        plusBtn.style.opacity = "0.3";
    }
}

// 4. 이벤트 리스너 설정
function initEventListeners() {
    // 판매자라면 이벤트 리스너 자체를 등록하지 않거나, 등록해도 버튼이 disabled 되어 동작하지 않음
    // 안전을 위해 상단에서 return 처리 가능하지만, 이미 버튼을 disable 했으므로 그대로 둬도 무방합니다.

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
        if (!checkLogin()) return;

        const orderData = {
            type: "direct_order",
            items: [
                {
                    product_id: productData.id,
                    product_name: productData.name,
                    quantity: currentQuantity,
                    price: productData.price,
                    shipping_fee: productData.shipping_fee,
                    image: productData.image,
                    store_name: productData.seller.store_name,
                },
            ],
        };

        localStorage.setItem("order_data", JSON.stringify(orderData));
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
    const token = localStorage.getItem("token");

    if (!token) {
        showLoginModal();
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

    // [보완] 만약 판매자라면 updateTotalUI가 호출되더라도 버튼은 계속 disable 상태여야 함
    // 하지만 renderProduct에서 이미 버튼 자체를 disable 시켰고,
    // click 이벤트가 발생하지 않으므로 여기서는 추가 처리가 필수는 아닙니다.
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

// 장바구니 로직
async function handleCartAction() {
    if (!checkLogin()) return;

    try {
        await request("/cart/", {
            method: "POST",
            body: JSON.stringify({
                product_id: productData.id,
                quantity: currentQuantity,
                check: true,
            }),
        });

        // 성공 시 (새로 추가된 경우) 기존 confirm 창 유지
        const moveToCart = confirm("장바구니에 상품을 담았습니다.\n장바구니 페이지로 이동하시겠습니까?");
        if (moveToCart) {
            window.location.href = "/src/pages/cart/index.html";
        }
    } catch (error) {
        // 실패 시 (이미 장바구니에 있는 경우 등)
        console.error("장바구니 추가 실패:", error);

        // [수정됨] 단순 alert 대신 모달 호출
        // API 에러 메시지가 명확하다면 if (error.message.includes("exist")) 등으로 분기 처리를 권장합니다.
        // 현재는 에러 발생 시(중복) 모달을 띄우도록 처리했습니다.
        showCartMoveModal();
    }
}

// 유틸리티: 가격 포맷팅
function formatPrice(price) {
    return new Intl.NumberFormat("ko-KR").format(price);
}
