import Header from "/src/components/Header/Header.js";
import Footer from "/src/components/Footer/Footer.js";

/* [추가] 공통 컴포넌트 초기화 */
const headerTarget = document.getElementById("header");
new Header(headerTarget);

const footerTarget = document.getElementById("footer");
new Footer(footerTarget);

// 가상의 데이터 (이후 API fetch로 대체 가능)
let cartItems = [
    {
        id: 1,
        seller: "백엔드글로벌",
        name: "딥러닝 개발자 무릎 담요",
        price: 17500,
        shipping: 0,
        image: "../../assets/images/blanket.png",
        quantity: 1,
    },
    {
        id: 2,
        seller: "우당탕탕 라이캣의 실험실",
        name: "Hack Your Life 개발자 노트북 파우치",
        price: 29000,
        shipping: 0,
        image: "../../assets/images/pouch.png",
        quantity: 1,
    },
];

const cartListEl = document.getElementById("cart-list");
const emptyCartEl = document.getElementById("empty-cart");
const cartSummaryEl = document.getElementById("cart-summary");
const btnOrderAll = document.querySelector(".btn-order-all");

// 렌더링 함수
function renderCart() {
    if (cartItems.length === 0) {
        cartListEl.style.display = "none";
        cartSummaryEl.style.display = "none";
        btnOrderAll.style.display = "none";
        emptyCartEl.style.display = "block";
        return;
    }

    cartListEl.innerHTML = cartItems
        .map(
            (item) => `
        <li class="cart-item" data-id="${item.id}">
            <input type="checkbox" class="checkbox" checked>
            <img src="${item.image}" alt="${item.name}" class="product-img">
            <div class="product-info">
                <p class="seller-name">${item.seller}</p>
                <p class="product-name">${item.name}</p>
                <p class="product-price">${item.price.toLocaleString()}원</p>
                <p class="shipping-info">택배배송 / 무료배송</p>
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

// 합계 계산 함수
function updateSummary() {
    const total = cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    document.getElementById("total-price").textContent = total.toLocaleString();
    document.getElementById("final-amount").textContent = total.toLocaleString();
}

// 이벤트 위임 (수량 조절 및 삭제)
cartListEl.addEventListener("click", (e) => {
    const id = parseInt(e.target.closest(".cart-item")?.dataset.id);
    const item = cartItems.find((i) => i.id === id);

    if (e.target.classList.contains("plus")) {
        item.quantity++;
        renderCart();
    } else if (e.target.classList.contains("minus") && item.quantity > 1) {
        item.quantity--;
        renderCart();
    } else if (e.target.classList.contains("btn-delete")) {
        cartItems = cartItems.filter((i) => i.id !== id);
        renderCart();
    }
});

// 초기 실행
renderCart();
