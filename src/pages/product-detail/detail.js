/* ... 상단 import 문은 동일 ... */

let product = null;
let quantity = 1;

// [추가] 로그인한 사용자의 타입 확인 (로그인 시 저장했다는 가정)
const userType = sessionStorage.getItem("user_type"); 

/* DOM 요소 선택 */
// ... 기존 선택자 동일 ...
const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const buyBtn = document.querySelector(".buy");
const cartBtn = document.querySelector(".cart");

/* 초기 실행 및 API 호출 */
async function loadProduct() {
    try {
        product = await getProductDetail(productId);
        
        imageEl.src = product.image;
        sellerNameEl.textContent = product.seller.store_name;
        nameEl.textContent = product.name;
        priceEl.textContent = product.price.toLocaleString();
        shippingEl.textContent = product.shipping_fee === 0 ? "무료배송" : `배송비 ${product.shipping_fee.toLocaleString()}원`;

        updateUI(); // 가격 및 버튼 상태 통합 업데이트
    } catch (e) {
        console.error("에러 발생:", e);
        alert("상품 정보를 불러올 수 없습니다.");
    }
}

/* --- 이벤트 리스너 --- */

plusBtn.addEventListener("click", () => {
    // [수정] 판매자가 아닐 때만 작동하도록 조건 추가 가능 (버튼이 비활성화되므로 필수항목은 아님)
    if (userType !== "SELLER" && product && quantity < product.stock) {
        quantity++;
        updateUI();
    }
});

minusBtn.addEventListener("click", () => {
    if (userType !== "SELLER" && quantity > 1) {
        quantity--;
        updateUI();
    }
});

/* 구매 및 장바구니 버튼 클릭 이벤트 */
const handlePurchaseClick = (type) => {
    if (userType === "SELLER") {
        alert("판매자는 상품을 구매하거나 장바구니에 담을 수 없습니다.");
        return;
    }
    
    const token = sessionStorage.getItem("token");
    if (!token) {
        showLoginModal();
    } else {
        console.log(`${type} 프로세스 진행`);
    }
};

buyBtn.addEventListener("click", () => handlePurchaseClick("구매"));
cartBtn.addEventListener("click", () => handlePurchaseClick("장바구니"));

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

// [핵심 수정] 버튼 상태 및 스타일 업데이트
function updateButtonState() {
    if (!product) return;

    // 1. 판매자인 경우: 모든 버튼 비활성화 및 색상 변경
    if (userType === "SELLER") {
        const disabledColor = "var(--border-color)";
        
        // 수량 버튼
        plusBtn.disabled = true;
        minusBtn.disabled = true;
        
        // 구매/장바구니 버튼 비활성화 및 배경색 변경
        buyBtn.disabled = true;
        cartBtn.disabled = true;
        
        buyBtn.style.backgroundColor = disabledColor;
        cartBtn.style.backgroundColor = disabledColor;
        buyBtn.style.cursor = "not-allowed";
        cartBtn.style.cursor = "not-allowed";
        
        return; // 판매자라면 여기서 로직 종료
    }

    // 2. 일반 유저인 경우: 재고 상태에 따라 활성화/비활성화
    plusBtn.disabled = quantity >= product.stock;
    minusBtn.disabled = quantity <= 1;
}

/* ... 하단 탭 버튼 및 API 함수는 동일 ... */