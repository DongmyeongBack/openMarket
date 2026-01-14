import { request } from "/src/utils/api.js";

// 1. DOM 요소 선택
const productForm = document.getElementById("product-form");
const imgInput = document.getElementById("img-input");
const previewImg = document.getElementById("preview-img");
const uploadIcon = document.getElementById("upload-icon");
const shippingBtns = document.querySelectorAll(".shipping-btn");

// 2. 상태 관리 (기본값: 택배)
let selectedShippingMethod = "PARCEL";

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
    if (!imageFile) {
        return alert("상품 이미지를 등록해주세요!");
    }
    if (!name || !price || !shippingFee || !stock || !info) {
        return alert("모든 정보를 입력해주세요.");
    }

    // FormData 생성 (이미지 업로드를 위해 필수)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", parseInt(price)); // API 요구사항: Int
    formData.append("shipping_method", selectedShippingMethod);
    formData.append("shipping_fee", parseInt(shippingFee)); // API 요구사항: Int
    formData.append("stock", parseInt(stock)); // API 요구사항: Int
    formData.append("info", info);
    formData.append("image", imageFile);

    try {
        const res = await request("/products/", {
            method: "POST",
            body: formData, // JSON.stringify 하지 않음!
        });

        console.log("등록 성공:", res);
        alert("상품이 성공적으로 등록되었습니다.");

        // 성공 후 페이지 이동 (예: 상품 목록 페이지)
        window.location.href = "/";
    } catch (error) {
        // api.js에서 throw한 error.data 처리
        if (error.data) {
            // 예: error.data = { price: ["유효한 정수를 넣어주세요"], ... }
            const errorMessages = Object.entries(error.data)
                .map(([field, msg]) => `[${field}] ${msg}`)
                .join("\n");
            alert(`등록 실패:\n${errorMessages}`);
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
