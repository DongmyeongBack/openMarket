// src/pages/seller/seller.js
import { request } from "../../utils/api.js";

const productListEl = document.getElementById("product-list");
const sellerNameTitle = document.getElementById("seller-name-title");
const productCountBadge = document.getElementById("product-count-badge");
const productCountTab = document.getElementById("product-count-tab");
const uploadBtn = document.getElementById("upload-btn");

// 숫자에 콤마 찍기 유틸
const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
};

// 상품 리스트 아이템 HTML 생성 함수
const createProductItem = (product) => {
    // 이미지가 없으면 기본 이미지 처리
    const imgSrc = product.image ? product.image : "../../assets/images/default-image.png";

    return `
        <li class="product-item" data-id="${product.product_id}">
            <div class="item-info">
                <img src="${imgSrc}" alt="${product.product_name}" class="item-img">
                <div class="item-details">
                    <span class="item-name">${product.product_name}</span>
                    <span class="item-stock">재고 : ${product.stock}개</span>
                </div>
            </div>
            <div class="item-price">${formatPrice(product.price)}원</div>
            <div class="item-edit">
                <button class="btn-small btn-update">수정</button>
            </div>
            <div class="item-delete">
                <button class="btn-small btn-delete">삭제</button>
            </div>
        </li>
    `;
};

// 판매자 상품 불러오기 메인 로직
const fetchSellerProducts = async () => {
    // 1. 로그인 확인 및 판매자 정보 가져오기
    // 보통 로그인 시 localStorage에 'account_name', 'token', 'user_type' 등을 저장합니다.
    const token = localStorage.getItem("token");
    const accountName = localStorage.getItem("name"); // 판매자 name이 필요함

    if (!token || !accountName) {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "/pages/login/index.html"; // 로그인 페이지로 리다이렉트
        return;
    }

    // 대시보드 타이틀에 이름 표시
    sellerNameTitle.textContent = accountName;

    try {
        // 2. API 호출
        // API Spec: GET /<str:seller_name>/products/
        const data = await request(`/${accountName}/products/`);
        console.log(data);
        // 3. 데이터 렌더링
        const products = data.results;
        const totalCount = data.count || products.length;

        // 카운트 업데이트
        productCountBadge.textContent = totalCount;
        productCountTab.textContent = totalCount;

        // 리스트 초기화
        productListEl.innerHTML = "";

        if (products.length === 0) {
            productListEl.innerHTML = '<li class="no-data">등록된 상품이 없습니다.</li>';
            return;
        }

        // 리스트 아이템 추가
        products.forEach((product) => {
            productListEl.innerHTML += createProductItem(product);
        });

        // 4. 이벤트 리스너 추가 (수정/삭제 버튼)
        // 동적으로 생성된 요소이므로 리스트 렌더링 후 혹은 이벤트 위임 사용
        attachEventListeners();
    } catch (error) {
        console.error("상품을 불러오는 데 실패했습니다.", error);
        productListEl.innerHTML = `<li class="no-data">데이터 로드 실패: ${error.message}</li>`;
    }
};

// 수정/삭제 버튼 이벤트 핸들러
const attachEventListeners = () => {
    // 삭제 버튼들
    const deleteBtns = document.querySelectorAll(".btn-delete");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const productItem = e.target.closest(".product-item");
            const productId = productItem.dataset.id;

            if (confirm("정말 이 상품을 삭제하시겠습니까?")) {
                // TODO: 삭제 API 호출 로직 추가 (DELETE /products/{product_id})
                alert(`상품 ID ${productId} 삭제 API를 호출해야 합니다.`);
                // 성공 시 UI 제거: productItem.remove();
            }
        });
    });

    // 수정 버튼들
    const updateBtns = document.querySelectorAll(".btn-update");
    updateBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const productItem = e.target.closest(".product-item");
            const productId = productItem.dataset.id;
            // 수정 페이지로 이동
            alert(`상품 ID ${productId} 수정 페이지로 이동합니다.`);
        });
    });
};

// 업로드 버튼 이벤트
uploadBtn.addEventListener("click", () => {
    // 상품 등록 페이지로 이동 (예: 모달 띄우기 or 페이지 이동)
    window.location.href = "./product-upload/index.html";
});

// 초기화
document.addEventListener("DOMContentLoaded", fetchSellerProducts);
