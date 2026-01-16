import Header from "../../components/Header/Header.js";
import { getProductDetail, order, getCart } from "../../utils/api.js";

new Header(document.querySelector("#header"));

// 데이터 로드 확인
const orderData = JSON.parse(localStorage.getItem("order_data"));
if (!orderData) {
    alert("잘못된 접근입니다. 주문할 상품이 없습니다.");
    history.back();
}

/**
 * 상태 관리
 */
const state = {
    orderType: orderData.order_kind, // 'direct_order' | 'cart_order'
    items: [], // Fetch된 상품 데이터 + 수량 정보 포함
    buyer: {
        name: "",
        phone1: "",
        phone2: "",
        phone3: "",
        email: "",
    },
    receiver: {
        name: "",
        phone1: "",
        phone2: "",
        phone3: "",
        address: "",
        detailAddress: "",
        message: "",
    },
    paymentMethod: "card", // card, deposit, phone, naverpay, kakaopay
};

/**
 * 유틸리티: 숫자 콤마 포맷팅
 */
const formatPrice = (price) => {
    return price.toLocaleString();
};

/**
 * 상품 정보 로드
 */
const loadProducts = async () => {
    try {
        let productsToFetch = [];
        console.log(state)
        if (state.orderType === "direct_order") {
            // 바로 구매: 단일 상품
            // orderData: { order_kind, product_id, quantity }
            console.log("direct_order", orderData)
            productsToFetch.push({ id: orderData.product_id, quantity: orderData.quantity });
        } else if (state.orderType === "cart_order") {
            // 장바구니 구매: 다수 상품 (ID 리스트 혹은 객체 리스트일 수 있음)
            // orderData: { order_kind, product_ids: [...] } or cart_items
            // 로컬스토리지 구조에 따라 다르겠지만, 여기서는 product_ids 배열로 가정
            // 만약 수량 정보도 필요하다면, Cart 페이지에서 { product_id, quantity } 배열을 넘겨줘야 함.
            // 일단 API 명세상 'quantity'는 cart_items 주문시 보내지 않는다고 했으므로
            // 상세 수량을 알기 위해서는 1) Cart API를 다시 조회하거나 2) 넘겨받은 데이터에 수량이 있다고 가정.
            // 일반적으로 주문서 생성 시점에는 수량이 확정되어 넘어옴.
            // 여기서는 localStorage에 [{ product_id, quantity }] 형태로 넘어왔거나, 
            // product_ids만 있다면 수량을 1로 가정하거나 Cart를 조회해야 함.
            // *가정*: 편의상 localStorage에 product_id 리스트만 있다면, 
            // Cart API를 조회해서 매칭해야 정확함. 
            // 하지만 구현 편의성을 위해 localStorage에 간단히 { productId, quantity } 리스트를 담았다고 가정하고 진행.
            // 만약 orderData.product_ids (Array of int)라면? -> Cart 정보를 가져와야 함.

            // 안전한 구현: Cart 목록을 가져와서 필터링
            console.log("orderdata", orderData)
            if (orderData.product_ids) {
                const cartData = await getCart();
                // cartData.results (Array of CartItem)
                // Filter items that are in orderData.product_ids
                // 주의: CartItem에는 product_id가 있음.

                // cartData 구조 확인 필요하지만, 보통 { product_id, quantity, ... }
                console.log("cart: ", cartData)
                const targetItems = cartData.results.filter(item =>
                    orderData.product_ids.includes(item.product.id)
                );

                productsToFetch = targetItems.map(item => ({
                    id: item.product.id,
                    quantity: item.quantity,
                    cart_item_id: item.cart_item_id // 필요하다면
                }));
            } else if (orderData.items) {
                // 만약 이전 페이지에서 상세 정보를 넘겨줬다면
                productsToFetch = orderData.items;
            }
        }

        // 상품 상세 정보 Fetch
        const fetchedItems = await Promise.all(
            productsToFetch.map(async (item) => {
                const productDetail = await getProductDetail(item.id);
                return {
                    ...productDetail,
                    quantity: item.quantity,
                };
            })
        );

        state.items = fetchedItems;
        renderProductList();
        updateTotalSummary();

    } catch (error) {
        console.error("Failed to load products", error);
        alert("상품 정보를 불러오는데 실패했습니다.");
    }
};

/**
 * 렌더링: 상품 리스트
 */
const renderProductList = () => {
    const listContainer = document.querySelector("#product-list");

    // 배송비 계산 (단순 합산 or 조건부 무료배송 등 로직 필요)
    // 명세: "product배송비 ... 배송비는 한번만 부과됩니다." ???
    // 명세 재확인: "(product가격 * 주문수량) + product배송비" 
    // "배송비는 한번만 부과됩니다" -> This usually means per order or per seller. 
    // 간단히 하기 위해 각 상품별 배송비 표시하되, 합산 로직에서 고려.
    // 여기서는 UI에 각 상품의 배송비를 그대로 보여줌.

    listContainer.innerHTML = state.items.map(item => {
        const itemTotalPrice = (item.price * item.quantity);
        // 배송비 표시
        const shippingFee = item.shipping_fee === 0 ? "무료배송" : `${formatPrice(item.shipping_fee)}원`;
        console.log('item', item)
        return `
        <div class="product-item" data-id="${item.id}">
            <div class="product-info-cell">
                <img src="${item.image}" alt="${item.name}" class="product-img" />
                <div class="product-details">
                    <span class="shop-name">${item.seller.store_name}</span>
                    <span class="product-name">${item.name}</span>
                    <span class="product-qty">수량: ${item.quantity}개</span>
                </div>
            </div>
            <div class="discount-cell">-</div>
            <div class="shipping-cell">${shippingFee}</div>
            <div class="price-cell">${formatPrice(itemTotalPrice)}원</div>
        </div>
        `;
    }).join("");
};

/**
 * 합계 업데이트
 */
const updateTotalSummary = () => {
    // 상품 합계
    const totalProductPrice = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 배송비 합계
    // "배송비는 한번만 부과됩니다." -> This implies global shipping fee? 
    // Or max shipping fee? Or per-store?
    // Given the simple requirement, I'll assume standard aggregation or max.
    // API Spec says: item_total_price = product가격*수량+배송비
    // And total_price should be sum of these? Or is shipping fee applied once globally?
    // "총 금액 계산 방법: (product가격 * 주문수량) + product배송비. 배송비는 한번만 부과됩니다."
    // This sentence is contradictory in context of multiple items. 
    // Usually means: Sum(Product * Qty) + Max(ShippingFee) for the whole order?
    // Let's assume Max Shipping Fee for the entire order for now as a common interpretation of "Once".
    // Alternatively, it just means "Per product type, shipping is added once regardless of quantity".
    // Let's stick to: Sum(Product price * Qty) + Sum(Shipping fees) but since the note is tricky,
    // lets look at the "API Spec's item_total_price" definition again: "product의 가격*수량+배송비".
    // This implies each item line carries its own shipping fee.
    // "배송비는 한번만 부과됩니다" likely refers to "Shipping fee is added once PER PRODUCT (line item) regardless of quantity".
    // So if quantity is 10, shipping is still just X won, not 10*X.
    // My calculation logic:
    // Total = Sum ( Item.price * Item.qty + Item.shipping_fee )

    const totalShippingFee = state.items.reduce((acc, item) => acc + item.shipping_fee, 0);
    const totalPrice = totalProductPrice + totalShippingFee;

    document.querySelector("#total-order-price-top").textContent = formatPrice(totalPrice);

    document.querySelector("#final-product-price").textContent = formatPrice(totalProductPrice);
    document.querySelector("#final-shipping-fee").textContent = formatPrice(totalShippingFee);
    document.querySelector("#final-total-price").textContent = formatPrice(totalPrice);

    checkValidation();
};

/**
 * 주소 검색 (Daum Postcode)
 */
const openAddressSearch = () => {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
            // data.zonecode, data.address, data.buildingName

            state.receiver.address = data.address;

            document.querySelector("#postcode").value = data.zonecode;
            document.querySelector("#address").value = data.address;
            document.querySelector("#detail-address").focus();

            checkValidation();
        }
    }).open();
};

/**
 * 입력 핸들러 및 유효성 검사
 */
const handleInput = (e) => {
    const { id, value } = e.target;

    // Buyer
    if (id === "buyer-name") state.buyer.name = value;
    if (id === "buyer-phone-1") state.buyer.phone1 = value;
    if (id === "buyer-phone-2") state.buyer.phone2 = value;
    if (id === "buyer-phone-3") state.buyer.phone3 = value;
    if (id === "buyer-email") state.buyer.email = value;

    // Receiver
    if (id === "receiver-name") state.receiver.name = value;
    if (id === "receiver-phone-1") state.receiver.phone1 = value;
    if (id === "receiver-phone-2") state.receiver.phone2 = value;
    if (id === "receiver-phone-3") state.receiver.phone3 = value;
    if (id === "detail-address") state.receiver.detailAddress = value;
    if (id === "delivery-message") state.receiver.message = value;

    checkValidation();
};

const checkValidation = () => {
    const isBuyerValid = state.buyer.name && state.buyer.phone1 && state.buyer.phone2 && state.buyer.phone3 && state.buyer.email;
    const isReceiverValid = state.receiver.name && state.receiver.phone1 && state.receiver.phone2 && state.receiver.phone3 &&
        document.querySelector("#postcode").value && document.querySelector("#address").value && state.receiver.detailAddress;
    const isConsentChecked = document.querySelector("#consent-checkbox").checked;

    const paymentBtn = document.querySelector("#payment-btn");

    if (isBuyerValid && isReceiverValid && isConsentChecked) {
        paymentBtn.disabled = false;
    } else {
        paymentBtn.disabled = true;
    }
};

/**
 * 결제 요청
 */
const handlePayment = async () => {
    const totalProductPrice = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalShippingFee = state.items.reduce((acc, item) => acc + item.shipping_fee, 0);
    const totalPrice = totalProductPrice + totalShippingFee;

    const receiverPhone = `${state.receiver.phone1}${state.receiver.phone2}${state.receiver.phone3}`;
    const address = `${document.querySelector("#address").value} ${state.receiver.detailAddress} (${document.querySelector("#postcode").value})`;

    // Payload 구성
    const payload = {
        receiver: state.receiver.name,
        receiver_phone_number: receiverPhone,
        address: address,
        address_message: state.receiver.message || "배송 메시지 없음", // 명세: address_message (String | null)
        payment_method: state.paymentMethod,
        total_price: totalPrice
    };

    if (state.orderType === "direct_order") {
        payload.order_kind = "direct_order";
        payload.order_type = "direct_order";
        payload.product = state.items[0].id; // [수정] API 요구사항: product (not product_id)
        payload.quantity = state.items[0].quantity;
    } else {
        payload.order_kind = "cart_order"; // 명세엔 order_type: "cart_order"로 되어있으나 req body 예시엔 order_kind 없이 order_type만 있거나 혼용됨.
        // API Req 5.1.2: 
        // {
        //    "order_type":"cart_order",
        //    "cart_items": List,
        //    ...
        // }
        // API Req 5.1.1:
        // {
        //    "order_kind" : "direct_order",
        //    ...
        // }
        // Note: The prompt uses "order_type" in description but "order_kind" in 5.1.1 JSON.
        // And "order_type" in 5.1.2 JSON.
        // It's safer to include 'order_type' if following 5.1.2 literal JSON.
        // Let's stick to the JSON keys provided in the PROMPT.

        // Ref:
        // 5.1.1: "order_kind": "direct_order"
        // 5.1.2: "order_type": "cart_order"

        // Wait, for 5.1.1:
        payload.order_kind = "direct_order"; // Assuming consistency, but 5.1.1 JSON says order_kind.
        // But 5.0 section says "order_type을 서버에 보내주셔야 합니다."
        // I will send both to be safe or strictly follow the JSON snippet.
        // 5.1.1 JSON snippet: keys include "order_kind".
        // 5.1.2 JSON snippet: keys include "order_type".

        // Wait, looking closely at 5.0: "order_type을 서버에 보내주셔야 합니다." 
        // 1. direct_order
        // 2. cart_order

        // I will use `order_type` as the key for general consistency if not rejected.
        // BUT the JSON examples are specific.
        // 5.1.1 (Direct): "order_kind": "direct_order"
        // 5.1.2 (Cart): "order_type": "cart_order"
        // This is messy API design but I must follow it. 

        if (state.orderType === "direct_order") {
            delete payload.order_kind; // Reset
            payload.order_kind = "direct_order";
            // Check 5.1.1 again. Yes "order_kind". 
        } else {
            delete payload.order_kind; // Reset
            payload.order_type = "cart_order";
            // "cart_items": cartitem에 담긴 product의 id를 리스트 형태
            payload.cart_items = state.items.map(item => item.id);
        }
    }

    // Correction for Direct Order:
    if (state.orderType === "direct_order") {
        // 5.1.1 Req keys: order_kind, product, quantity, total_price, ...
        // My payload already has common fields. remove order_type if added.
    }

    try {
        await order(payload);

        alert("주문이 완료되었습니다."); // Success
        location.href = "/index.html"; // 메인으로 이동

    } catch (error) {
        console.error("Order Failed", error);

        let errorMessage = "주문에 실패했습니다.";

        if (error.data) {
            // API Spec: Field errors or "non_field_errors"
            const messages = [];
            for (const [key, value] of Object.entries(error.data)) {
                const msgText = Array.isArray(value) ? value.join(", ") : value;
                if (key === "non_field_errors") {
                    messages.push(msgText);
                } else {
                    messages.push(`[${key}] ${msgText}`);
                }
            }
            if (messages.length > 0) {
                errorMessage = messages.join("\n");
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        alert(errorMessage);
    }
};


// 초기화
const init = () => {
    loadProducts();

    // Event Listeners
    document.querySelector("#search-address-btn").addEventListener("click", openAddressSearch);

    // Inputs
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("input", handleInput);
    });

    // Checkbox
    document.querySelector("#consent-checkbox").addEventListener("change", checkValidation);

    // Payment Method
    const methods = document.querySelectorAll("input[name='payment-method']");
    methods.forEach(radio => {
        radio.addEventListener("change", (e) => {
            state.paymentMethod = e.target.value;
        });
    });

    // Submit
    document.querySelector("#payment-btn").addEventListener("click", handlePayment);
};

init();
