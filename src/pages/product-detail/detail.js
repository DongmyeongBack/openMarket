
let product = null;
let quantity = 1;

/* DOM */
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

/* productId */
const params = new URLSearchParams(location.search);
const productId = params.get("productId");

/* 초기 실행 */
loadProduct();

/* API 호출 */
async function loadProduct() {
  try {
    product = await getProductDetail(productId);

    imageEl.src = product.image;
    sellerNameEl.textContent = product.seller.store_name;
    nameEl.textContent = product.name;
    priceEl.textContent = product.price.toLocaleString();

    shippingEl.textContent =
      product.shipping_fee === 0
        ? "무료배송"
        : `배송비 ${product.shipping_fee.toLocaleString()}원`;

    updatePrice();
    updateButtonState();
  } catch (e) {
    alert("상품 정보를 불러올 수 없습니다.");
  }
}

/* 수량 증가 */
plusBtn.addEventListener("click", () => {
  if (quantity < product.stock) {
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

function updateUI() {
  quantityEl.textContent = quantity;
  totalQuantityEl.textContent = quantity;
  updatePrice();
  updateButtonState();
}

function updatePrice() {
  const total = product.price * quantity;
  totalPriceEl.textContent = total.toLocaleString();
}

function updateButtonState() {
  plusBtn.disabled = quantity >= product.stock;
  minusBtn.disabled = quantity <= 1;
}
export async function getProductDetail(productId) {
  const res = await fetch(`/products/${productId}/`);

  if (!res.ok) {
    throw new Error("상품 조회 실패");
  }

  return await res.json();
}
const tabs = document.querySelectorAll(".detail-tab .tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});
