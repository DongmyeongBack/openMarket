import { request } from "/src/utils/api.js";

// DOM 요소 선택 (상단에 몰아서 정의하여 관리 용이성 확보)
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
let productData = null; // 상품 전체 데이터 저장
let currentQuantity = 1;

// 1. 초기화 및 실행
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId"); // list.js의 링크 파라미터와 일치시킴

    if (!productId) {
        alert("잘못된 접근입니다.");
        history.back();
        return;
    }

    fetchProductDetail(productId);
});

// 2. 상품 상세 정보 가져오기
async function fetchProductDetail(id) {
    try {
        // api.js의 request 함수 사용 (Base URL 및 헤더 처리 포함)
        const data = await request(`/products/${id}/`, {
            method: "GET",
        });

        productData = data; // 데이터 저장
        renderProduct(data);
        initEventListeners(); // 데이터가 로드된 후 이벤트 연결
    } catch (error) {
        console.error("Error loading product:", error);
        alert("상품 정보를 불러오는 데 실패했습니다.");
        // 필요 시 에러 페이지로 이동하거나 에러 메시지 표시
    }
}

// 3. 화면 렌더링
function renderProduct(data) {
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
        updateTotalUI(); // 초기 가격 및 수량 렌더링
    }
}

// 4. 이벤트 리스너 설정
function initEventListeners() {
    if (!productData || productData.stock === 0) return;

    // 수량 감소
    minusBtn.addEventListener("click", () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            updateTotalUI();
        }
    });

    // 수량 증가
    plusBtn.addEventListener("click", () => {
        if (currentQuantity < productData.stock) {
            currentQuantity++;
            updateTotalUI();
        } else {
            // 재고 초과 시 (보조적인 알림, 버튼은 이미 비활성화되도록 로직 구성됨)
            alert("최대 구매 가능 수량입니다.");
        }
    });

    // 구매 버튼
    buyBtn.addEventListener("click", () => {
        const totalAmount = productData.price * currentQuantity;
        alert(
            `[주문 요청]\n상품명: ${productData.name}\n수량: ${currentQuantity}개\n총 금액: ${formatPrice(
                totalAmount
            )}원`
        );
        // 여기에 결제 페이지 이동 로직 추가
    });

    // 장바구니 버튼
    cartBtn.addEventListener("click", handleCartAction);

    // 탭 전환
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            tabs.forEach((t) => t.classList.remove("active"));
            e.target.classList.add("active");
        });
    });
}

// UI 업데이트 (수량 변경 시 호출)
function updateTotalUI() {
    const stock = productData.stock;

    // 1. 수량 표시 업데이트
    quantityDisplay.textContent = currentQuantity;
    totalQuantity.textContent = currentQuantity;

    // 2. 총 가격 계산 및 업데이트
    const totalAmount = productData.price * currentQuantity;
    totalPrice.textContent = formatPrice(totalAmount);

    // 3. 버튼 활성화/비활성화 상태 관리
    // 최소 수량(1개)일 때 - 버튼 비활성화
    minusBtn.disabled = currentQuantity <= 1;
    minusBtn.style.opacity = currentQuantity <= 1 ? "0.3" : "1";

    // 재고 수량 도달 시 + 버튼 비활성화 (요구사항)
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
    buyBtn.classList.add("disabled"); // CSS 스타일링을 위한 클래스

    cartBtn.disabled = true;
    minusBtn.disabled = true;
    plusBtn.disabled = true;
}

// 장바구니 로직
async function handleCartAction() {
    const confirmCart = confirm("장바구니에 담으시겠습니까?");
    if (confirmCart) {
        try {
            // API 호출 예시 (실제 구현 시 주석 해제)
            /*
      await request("/cart/", {
        method: "POST",
        body: JSON.stringify({
          product_id: productData.id,
          quantity: currentQuantity,
          check: false // 장바구니 활성 여부 등
        })
      });
      */
            alert("장바구니에 상품이 담겼습니다.");
        } catch (error) {
            console.error(error);
            alert("장바구니 담기에 실패했습니다.");
        }
    }
}

// 유틸리티: 가격 포맷팅 (콤마 추가)
function formatPrice(price) {
    return new Intl.NumberFormat("ko-KR").format(price);
}
