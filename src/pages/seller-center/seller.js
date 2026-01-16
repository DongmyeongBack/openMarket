// [원본 유지] API 함수 가져오기
import {
    getSellerProducts,
    deleteProduct,
    createProduct,
    getProductDetail,
} from "../../utils/api.js";
import { showDeleteModal } from "/src/components/Modal/Modal.js";
import Footer from "/src/components/Footer/Footer.js";

const productListEl = document.getElementById("product-list");

const sellerTitleEl = document.getElementById("seller-title");

const productCountBadge = document.getElementById("product-count-badge");
const productCountTab = document.getElementById("product-count-tab");
const uploadBtn = document.getElementById("upload-btn");

// Footer 초기화
const footerTarget = document.getElementById("footer");
if (footerTarget) new Footer(footerTarget);

// 숫자에 콤마 찍기
const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
};

// [UI 수정] 상품 아이템 생성 (수정/복사 버튼 추가됨)
const createProductItem = (product) => {
    const imgSrc = product.image
        ? product.image
        : "../../assets/images/default-image.png";
    console.log("product: ", product);
    return `
        <li class="product-item" data-id="${product.id}">
            <div class="item-info">
                <img 
                    src="${imgSrc}" 
                    alt="${product.name}" 
                    class="item-img" 
                    onclick="location.href='${import.meta.env.BASE_URL}src/pages/product-detail/index.html?productId=${product.id}'"
                    style="cursor: pointer;" 
                >
                <div class="item-details">
                    <span class="item-name">${product.name}</span>
                    <span class="item-stock">재고 : ${product.stock}개</span>
                </div>
            </div>
            <div class="item-price">${formatPrice(product.price)}원</div>
            
            <div class="item-edit">
                <button class="btn-small btn-update">수정</button>
                <button class="btn-small btn-copy">복사</button>
            </div>
            
            <div class="item-delete">
                <button class="btn-small btn-delete">삭제</button>
            </div>
        </li>
    `;
};

// [UI 수정] 상단 문구 업데이트 (안녕하세요. 스토어명, 판매자님)
const updateDashboardHeader = () => {
    const sellerName = localStorage.getItem("name");

    // "님"자를 붙여서 출력 (만약 이름에 이미 "님"이 있다면 제거하고 다시 붙임)
    if (sellerTitleEl) {
        const cleanName = sellerName.replace(/ 님$/, ""); // 끝에 '님'이 있으면 제거
        sellerTitleEl.textContent = `${cleanName}님`;
        console.log(sellerTitleEl.textContent);
    }
};

// [핵심] 상품 목록 불러오기 (원본 로직 복구)
const fetchSellerProducts = async () => {
    const token = localStorage.getItem("token");
    const accountName = localStorage.getItem("name");

    if (!token || !accountName) {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "./src/pages/login/index.html";
        return;
    }

    updateDashboardHeader();

    try {
        // [중요] 원본 코드 그대로 'name' 키값 사용
        // 만약 여기서 에러가 나면 localStorage에 'name'이 없는 상태입니다.

        // API 호출 (원본 방식)
        const data = await getSellerProducts(accountName);
        // 데이터 처리
        const products = data.results || [];
        const totalCount = data.count

        productCountBadge.textContent = totalCount;
        productCountTab.textContent = totalCount;

        productListEl.innerHTML = "";

        if (products.length === 0) {
            productListEl.innerHTML =
                '<li class="no-data">등록된 상품이 없습니다.</li>';
            return;
        }

        products.forEach((product) => {
            productListEl.innerHTML += createProductItem(product);
        });

        attachEventListeners(); // 이벤트 연결
    } catch (error) {
        console.error("상품을 불러오는 데 실패했습니다.", error);
        // 에러 발생 시에도 너무 무서운 화면 대신 간단한 메시지 표시
        productListEl.innerHTML = `<li class="no-data">데이터를 불러오지 못했습니다.<br>(${error.message})</li>`;
    }
};

// 이벤트 핸들러 (복사 기능만 추가되고 나머지는 원본 동일)
const attachEventListeners = () => {
    // 1. 삭제
    const deleteBtns = document.querySelectorAll(".btn-delete");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const productItem = e.target.closest(".product-item");
            const productId = productItem.dataset.id;
            const isConfirmed = await showDeleteModal();

            if (isConfirmed) {
                try {
                    await deleteProduct(productId);
                    alert("상품이 삭제되었습니다.");
                    window.location.reload();
                } catch (error) {
                    console.error("삭제 실패", error);
                    alert("삭제 실패");
                }
            }
        });
    });

    // 2. 수정
    const updateBtns = document.querySelectorAll(".btn-update");
    updateBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const productItem = e.target.closest(".product-item");
            const productId = productItem.dataset.id;
            window.location.href = `./product-upload/index.html?id=${productId}`;
        });
    });

    // 3. [신규 기능] 복사
    const copyBtns = document.querySelectorAll(".btn-copy");
    copyBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            if (!confirm("이 상품의 정보로 새로운 상품을 등록하시겠습니까? (상품 등록 페이지로 이동합니다)")) return;

            const productItem = e.target.closest(".product-item");
            const productId = productItem.dataset.id;

            // 페이지 이동 (id와 mode=copy 전달)
            window.location.href = `./product-upload/index.html?id=${productId}&mode=copy`;
        });
    });
};

// 업로드 버튼
if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
        window.location.href = "./product-upload/index.html";
    });
}

// 초기화
document.addEventListener("DOMContentLoaded", fetchSellerProducts);
