import { request } from '../../utils/api.js';

// 1. 초기 데이터 로드 및 렌더링
document.addEventListener('DOMContentLoaded', () => {
    const orderDataString = localStorage.getItem('order_data');
    
    // 데이터가 없으면 장바구니나 메인으로 튕겨냄
    if (!orderDataString) {
        alert("주문 정보가 없습니다. 다시 시도해주세요.");
        location.href = '/';
        return;
    }

    const orderData = JSON.parse(orderDataString);
    renderOrderItems(orderData.items);
    renderSummary(orderData.items);

    // 결제 버튼 이벤트 연결
    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        processPayment(orderData);
    });
});

// 화면에 상품 리스트 그리기
function renderOrderItems(items) {
    const container = document.getElementById('product-list');
    
    items.forEach(item => {
        // 배송비 표시 로직
        const shippingFee = item.shipping_fee > 0 ? `${item.shipping_fee.toLocaleString()}원` : '무료배송';
        
        const html = `
            <div class="product-item">
                <div class="p-info">
                    <img src="${item.image}" alt="${item.product_name}" class="p-img">
                    <div class="p-text">
                        <p class="brand">${item.store_name || 'HODU Mall'}</p>
                        <p class="name">${item.product_name}</p>
                        <p class="qty">수량 : ${item.quantity}개</p>
                    </div>
                </div>
                <div class="p-discount">-</div>
                <div class="p-shipping">${shippingFee}</div>
                <div class="p-price"><strong>${(item.price * item.quantity).toLocaleString()}</strong>원</div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// 최종 금액 계산 및 표시
function renderSummary(items) {
    let totalPrice = 0;
    let totalShipping = 0;

    items.forEach(item => {
        totalPrice += item.price * item.quantity;
        totalShipping += item.shipping_fee || 0;
    });

    const finalAmount = totalPrice + totalShipping;

    // 상단 총액
    document.getElementById('total-price-display').textContent = finalAmount.toLocaleString();
    
    // 우측 최종 결제 박스
    document.getElementById('final-product-price').textContent = totalPrice.toLocaleString();
    document.getElementById('final-shipping-fee').textContent = totalShipping.toLocaleString();
    document.getElementById('final-total-price').textContent = finalAmount.toLocaleString();
}

// 2. 결제 요청 로직
async function processPayment(orderData) {
    const agreement = document.getElementById('check-agreement').checked;
    if (!agreement) {
        alert("구매 조건 확인 및 결제 진행에 동의해주세요.");
        return;
    }

    // 입력값 가져오기
    const receiverName = document.getElementById('receiver-name').value;
    const phone = `${document.getElementById('receiver-phone1').value}-${document.getElementById('receiver-phone2').value}-${document.getElementById('receiver-phone3').value}`;
    const address1 = document.getElementById('address-main').value;
    const address2 = document.getElementById('address-detail').value || "";
    const fullAddress = `${address1} ${address2}`.trim();
    const message = document.getElementById('delivery-msg').value;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

    // 총 결제 금액 재계산 (보안상)
    const total_price = orderData.items.reduce((acc, cur) => acc + (cur.price * cur.quantity) + (cur.shipping_fee || 0), 0);

    // API 전송용 바디 생성
    const bodyData = {
        total_price: total_price,
        reciever: receiverName,         // [주의] API 명세서 오타 (reciever) 그대로 사용
        reciever_phone_number: phone,   // [주의] API 명세서 오타 (reciever)
        address: fullAddress,
        address_message: message,
        payment_method: paymentMethod
    };

    // 주문 타입에 따른 분기 처리
    if (orderData.type === 'direct_order') {
        const item = orderData.items[0];
        bodyData.order_kind = "direct_order";
        bodyData.product = item.product_id;
        bodyData.quantity = item.quantity;
    } else {
        bodyData.order_kind = "cart_order";
        // 카트 주문일 경우 cart_item_id 목록이 필요함 (order_data에 있다고 가정)
        bodyData.cart_items = orderData.items.map(item => item.cart_item_id); 
    }

    try {
        const result = await request('/order/', {
            method: 'POST',
            body: JSON.stringify(bodyData)
        });

        // 성공 시
        localStorage.removeItem('order_data'); // 장바구니/주문 데이터 클리어
        location.href = `/src/pages/payment/success.html?orderNo=${result.order_number}`;

    } catch (error) {
        // 실패 시 (api.js에서 throw error 되어서 넘어옴)
        console.error(error);
        let msg = "결제에 실패했습니다.";
        
        // 에러 데이터 파싱 시도
        if (error.data) {
            if (error.data.reciever) msg = error.data.reciever[0];
            else if (error.data.non_field_errors) msg = error.data.non_field_errors[0];
            else if (typeof error.data === 'string') msg = error.data;
        }
        alert(msg);
    }
}