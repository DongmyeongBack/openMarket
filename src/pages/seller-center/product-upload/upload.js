import { request } from "/src/utils/api.js";
import Footer from "/src/components/Footer/Footer.js"; // Footer 임포트

// 1. DOM 요소 선택
const productForm = document.getElementById("product-form");
const imgInput = document.getElementById("img-input");
const previewImg = document.getElementById("preview-img");
const uploadIcon = document.getElementById("upload-icon");
const shippingBtns = document.querySelectorAll(".shipping-btn");

// Footer 초기화
const footerTarget = document.getElementById("footer");
new Footer(footerTarget);

// 2. 상태 관리 (기본값: 택배)
let selectedShippingMethod = "PARCEL";
let isEditMode = false;
let productId = null;

// [추가] 2.1 URL 파라미터 확인 및 수정 모드 설정
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get("id");

    if (productId) {
        isEditMode = true;
        document.title = "상품 수정 | HODU Seller";
        document.querySelector(".page-title").textContent = "상품 수정"; // .upload-title -> .page-title 변경
        document.querySelector(".save-btn").textContent = "수정하기";

        await fetchProductDetail(productId);
    }
});

async function fetchProductDetail(id) {
    try {
        const data = await request(`/products/${id}/`);
        // 폼 채우기
        const productName = data.product_name || data.name;
        const productInfo = data.product_info || data.products_info || data.info; // API 필드명 호환성 고려

        document.getElementById("product-name").value = productName;
        document.getElementById("price").value = data.price;
        document.getElementById("shipping-fee").value = data.shipping_fee;
        document.getElementById("stock").value = data.stock;
        document.getElementById("product-info").value = productInfo;

        // 배송 방법 설정 (shipping_method가 'PARCEL' 또는 'DELIVERY')
        selectedShippingMethod = data.shipping_method;
        shippingBtns.forEach(btn => {
            if (btn.dataset.method === selectedShippingMethod) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // 이미지 미리보기
        if (data.image) {
            previewImg.src = data.image;
            previewImg.style.display = "block";
            uploadIcon.style.display = "none";
            document.querySelector(".img-placeholder").style.backgroundColor = "transparent";
        }
    } catch (error) {
        console.error("상품 정보 로드 실패", error);
        alert("상품 정보를 불러오는 데 실패했습니다.");
        window.history.back();
    }
}

// 3. 이미지 미리보기 기능
imgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        // 파일을 다 읽으면 실행되는 함수
        reader.onload = (event) => {
            previewImg.src = event.target.result;
            previewImg.style.display = "block"; // 이미지 보이기
            uploadIcon.style.display = "none"; // 아이콘 숨기기

            // 이미지 영역 배경색 투명하게 변경 (선택 사항)
            document.querySelector(".img-placeholder").style.backgroundColor = "transparent";
        };
        reader.readAsDataURL(file);
    }
});

// 4. 배송 방법 선택 (버튼 토글 UI)
shippingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        // 모든 버튼에서 active 제거
        shippingBtns.forEach((b) => b.classList.remove("active"));
        // 클릭한 버튼에 active 추가
        btn.classList.add("active");

        // 데이터셋 값 저장 ("PARCEL" or "DELIVERY")
        selectedShippingMethod = btn.dataset.method;
    });
});

// 5. 폼 제출 및 API 통신
productForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 기본 제출 동작 막기

    // 입력값 가져오기
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("price").value;
    const shippingFee = document.getElementById("shipping-fee").value;
    const stock = document.getElementById("stock").value;
    const info = document.getElementById("product-info").value;
    const imageFile = imgInput.files[0];

    // 간단한 유효성 검사
    if (!isEditMode && !imageFile) {
        return alert("상품 이미지를 등록해주세요!");
    }
    if (!name || !price || !shippingFee || !stock || !info) {
        return alert("모든 정보를 입력해주세요.");
    }

    // FormData 생성 (이미지 업로드를 위해 필수)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", parseInt(price));
    formData.append("shipping_method", selectedShippingMethod);
    formData.append("shipping_fee", parseInt(shippingFee));
    formData.append("stock", parseInt(stock));
    formData.append("info", info);

    // 수정 모드일 때 이미지를 새로 선택하지 않으면 append 하지 않음 (기존 유지)
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        let res;
        if (isEditMode) {
            // PUT 요청
            res = await request(`/products/${productId}/`, {
                method: "PUT",
                body: formData,
            });
            alert("상품이 성공적으로 수정되었습니다.");
        }

        console.log("처리 성공:", res);

        // 성공 후 페이지 이동
        window.location.href = "../index.html";
    } catch (error) {
        // api.js에서 throw한 error.data 처리
        console.error(error);
        if (error.data) {
            const errorMessages = Object.entries(error.data)
                .map(([field, msg]) => `[${field}] ${msg}`)
                .join("\n");
            alert(`처리 실패:\n${errorMessages}`);
        } else if (error.detail) {
            alert(error.detail);
        } else {
            alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
        }
    }
});

// 6. 취소 버튼
document.querySelector(".cancel-btn").addEventListener("click", () => {
    if (confirm("작성 중인 내용이 사라집니다. 취소하시겠습니까?")) {
        window.history.back();
    }
});
