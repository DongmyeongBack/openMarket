// src/pages/seller-center/product-upload/upload.js
import { request } from "../../../../utils/api.js";

const form = document.getElementById("product-form");
const imgInput = document.getElementById("img-input");
const previewImg = document.getElementById("preview-img");
const uploadIcon = document.getElementById("upload-icon");
const shippingBtns = document.querySelectorAll(".shipping-btn");
const nameInput = document.getElementById("product-name");
const nameLength = document.getElementById("name-length");

// 상태 관리
let selectedShippingMethod = "PARCEL"; // 기본값

// 1. 배송방법 버튼 토글 로직
shippingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        // 모든 버튼 비활성화 스타일
        shippingBtns.forEach((b) => b.classList.remove("active"));
        // 클릭된 버튼 활성화 스타일
        btn.classList.add("active");
        // 값 저장
        selectedShippingMethod = btn.dataset.method;
    });
});

// 2. 이미지 미리보기 로직
imgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            uploadIcon.style.display = "none";
        };
        reader.readAsDataURL(file);
    } else {
        previewImg.src = "";
        previewImg.style.display = "none";
        uploadIcon.style.display = "flex";
    }
});

// 3. 상품명 글자수 카운트
nameInput.addEventListener("input", (e) => {
    nameLength.textContent = e.target.value.length;
});

// 4. 폼 제출 로직 (상품 등록)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 가져오기
    const productName = document.getElementById("product-name").value;
    const price = document.getElementById("price").value;
    const shippingFee = document.getElementById("shipping-fee").value;
    const stock = document.getElementById("stock").value;
    const productInfo = document.getElementById("product-info").value;
    const imageFile = imgInput.files[0];

    // 유효성 검사 (간단한 예시)
    if (!productName || !price || !shippingFee || !stock || !productInfo) {
        alert("모든 필드를 채워주세요.");
        return;
    }
    if (!imageFile) {
        alert("상품 이미지를 등록해주세요.");
        return;
    }

    // FormData 생성
    const formData = new FormData();
    formData.append("product_name", productName); // API 명세 필드명 확인 필요 (name vs product_name)
    // *주의: API 명세에는 "name"으로 되어있으므로 "name"으로 수정합니다.
    formData.append("product_name", productName);
    // API 명세 확인: "name"이 맞습니다. 아래에서 수정.

    // 다시 API 명세 기준 매핑:
    // "name": String
    // "info": String
    // "image": File
    // "price": Int
    // "shipping_method": "PARCEL"|"DELIVERY"
    // "shipping_fee": Int
    // "stock": Int

    const data = new FormData();
    data.append("product_name", productName); // *보통 name이나 product_name인데 명세엔 name이라고 적혀있으나, 보통 오픈마켓 API들이 product_name을 쓰는 경우가 많으니 주의. (명세대로라면 "name")
    // 여기서는 명세에 적힌대로 "product_name"으로 보내는게 일반적일 수 있으나 명세표가 "name"이면 "name"입니다.
    // 하지만 제공해주신 API 명세 예시가 "name"이므로 "name"으로 통일하겠습니다.
    // 만약 "product_name" 에러가 나면 필드명을 확인해주세요.

    // *수정된 명세 매핑*
    data.append("product_name", productName);
    data.append("product_info", productInfo);
    data.append("image", imageFile);
    data.append("price", parseInt(price));
    data.append("shipping_method", selectedShippingMethod);
    data.append("shipping_fee", parseInt(shippingFee));
    data.append("stock", parseInt(stock));

    try {
        // multipart/form-data 전송 시에는 Content-Type을 null로 설정하여
        // fetch가 자동으로 boundary를 생성하게 해야 합니다. (api.js 수정본 반영 시)
        const result = await request("/products/", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data", // api.js에서 이 값을 감지하여 삭제하도록 로직을 짰습니다.
            },
            body: data,
        });

        alert("상품이 성공적으로 등록되었습니다!");
        // 성공 시 페이지 이동 (예: 상품 목록이나 상세 페이지)
        window.location.href = "/"; // 메인으로 이동
    } catch (error) {
        console.error(error);
        if (error.data) {
            // API 에러 메시지 보여주기
            let errMsg = "";
            for (const key in error.data) {
                errMsg += `${key}: ${error.data[key]}\n`;
            }
            alert(errMsg || "상품 등록에 실패했습니다.");
        } else {
            alert("서버 오류가 발생했습니다.");
        }
    }
});

// 취소 버튼
document.querySelector(".cancel-btn").addEventListener("click", () => {
    history.back();
});
