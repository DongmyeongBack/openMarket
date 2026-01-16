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

// [UI 수정] 스토어명/판매자명 분리 표시를 위한 요소
const storeTitleEl = document.getElementById("store-title");
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

    return `
        <li class="product-item" data-id="${product.product_id || product.id}">
            <div class="item-info">
                <img 
                    src="${imgSrc}" 
                    alt="${product.product_name}" 
                    class="item-img" 
                    onclick="location.href='/src/pages/product-detail/index.html?productId=${product.product_id || product.id
        }'"
                    style="cursor: pointer;" 
                >
                <div class="item-details">
                    <span class="item-name">${product.product_name || product.name
        }</span>
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
    const storeName = localStorage.getItem("store_name") || "내 스토어";
    const sellerName = localStorage.getItem("name") || "판매자";

    if (storeTitleEl) storeTitleEl.textContent = storeName;

    // "님"자를 붙여서 출력 (만약 이름에 이미 "님"이 있다면 제거하고 다시 붙임)
    if (sellerTitleEl) {
        const cleanName = sellerName.replace(/님$/, ""); // 끝에 '님'이 있으면 제거
        sellerTitleEl.textContent = `${cleanName}님`;
    }
};

// [핵심] 상품 목록 불러오기 (원본 로직 복구)
const fetchSellerProducts = async () => {
    const token = localStorage.getItem("token");

    if (!token || !accountName) {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "/src/pages/login/index.html";
        return;
    }

    updateDashboardHeader();

    try {
        // [중요] 원본 코드 그대로 'name' 키값 사용
        // 만약 여기서 에러가 나면 localStorage에 'name'이 없는 상태입니다.
        const accountName = localStorage.getItem("name");

        // API 호출 (원본 방식)
        const data = await getSellerProducts(accountName);

        // 데이터 처리
        const products = data.results || [];
        const totalCount = data.count || products.length;

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
        btn.addEventListener("click", async (e) => {
            if (!confirm("상품을 복사하시겠습니까?")) return;

            const productItem = e.target.closest(".product-item");
            const productId = productItem.dataset.id;

            try {
                // 기존 정보 가져오기
                const originalProduct = await getProductDetail(productId);

                // API 전송을 위한 FormData 생성 (api.js가 formData를 원함)
                const formData = new FormData();

                // 필수 데이터 채우기
                formData.append(
                    "product_name",
                    `[복사] ${originalProduct.product_name}`
                );
                formData.append("price", originalProduct.price);
                formData.append("shipping_method", originalProduct.shipping_method); // 배송방법(PARCEL 등)
                formData.append("shipping_fee", originalProduct.shipping_fee);
                formData.append("stock", 0); // 재고는 0으로 초기화
                formData.append("product_info", originalProduct.product_info);

                // [주의] 이미지 URL은 복사가 안 될 수 있으므로, 이미지가 없어도 등록되게 시도하거나
                // 텍스트만 복사한다고 가정합니다.

                await createProduct(formData);

                alert("상품이 복사되었습니다. (이미지는 수정에서 다시 등록해주세요)");
                window.location.reload();
            } catch (error) {
                console.error("복사 실패", error);
                alert("복사 중 오류가 발생했습니다.");
            }
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
