// src/pages/signup/signup.js
import { request } from "/src/utils/api.js";

// DOM 요소 선택
const form = document.getElementById("signupForm");
const inputs = {
    username: document.getElementById("username"),
    checkIdBtn: document.getElementById("checkIdBtn"),
    password: document.getElementById("password"),
    passwordConfirm: document.getElementById("passwordConfirm"),
    name: document.getElementById("name"),
    phonePrefix: document.getElementById("phonePrefix"),
    phoneMiddle: document.getElementById("phoneMiddle"),
    phoneLast: document.getElementById("phoneLast"),
    businessNo: document.getElementById("businessNo"),
    checkBusinessBtn: document.getElementById("checkBusinessBtn"),
    storeName: document.getElementById("storeName"),
};
const agreeTerms = document.getElementById("agreeTerms");
const submitBtn = document.getElementById("submitBtn");
const sellerFields = document.getElementById("sellerFields");
const tabBtns = document.querySelectorAll(".tab-btn");

let currentType = "BUYER";

// 유효성 검사 상태 관리 객체
const state = {
    username: false,
    usernameChecked: false, // 중복확인 버튼 클릭 여부
    password: false,
    passwordConfirm: false,
    name: false,
    phone: false,
    // [추가] 판매자 전용 상태
    businessNo: false, // 사업자번호 유효성 (숫자만 등)
    businessChecked: false, // 사업자번호 인증 버튼 클릭 여부
    storeName: false,
};

/* --- [추가] 탭 전환 로직 --- */
tabBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const type = e.target.dataset.type; // 'buyer' or 'seller'
        switchTab(type);
    });
});

function switchTab(type) {
    currentType = type.toUpperCase(); // "BUYER" or "SELLER"

    // 1. 탭 버튼 스타일 변경
    tabBtns.forEach((btn) => {
        if (btn.dataset.type === type) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // 2. 판매자 필드 표시/숨김
    if (currentType === "SELLER") {
        sellerFields.classList.remove("hidden");
    } else {
        sellerFields.classList.add("hidden");
        // 구매자로 돌아가면 판매자 필드 에러 초기화
        clearError(inputs.businessNo);
        clearError(inputs.storeName);
    }

    // 3. 유효성 재검사 (버튼 활성화를 위해)
    checkAllValid();
}

// 헬퍼 함수: 에러 메시지 표시
function showError(input, message) {
    const parent = input.closest(".input-group") || input.parentElement;
    let errorMsg = parent.querySelector(".error-msg");

    if (!errorMsg) {
        errorMsg = document.createElement("p");
        errorMsg.className = "error-msg";
        parent.appendChild(errorMsg);
    }

    input.classList.add("error");
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("show");
    errorMsg.classList.remove("success");
}

function showSuccess(input, message) {
    const parent = input.closest(".input-group") || input.parentElement;
    let errorMsg = parent.querySelector(".error-msg");

    if (!errorMsg) {
        errorMsg = document.createElement("p");
        errorMsg.className = "error-msg error-message";
        parent.appendChild(errorMsg);
    }

    input.classList.remove("error");
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("show");
    errorMsg.classList.add("show", "success");
}

// 헬퍼 함수: 에러 메시지 숨김
function clearError(input) {
    const parent = input.closest(".input-group") || input.parentElement;
    const errorMsg = parent.querySelector(".error-msg");

    input.classList.remove("error");
    if (errorMsg) {
        errorMsg.classList.add("hidden");
        errorMsg.classList.remove("show");
        errorMsg.textContent = "";
    }
}

// 헬퍼 함수: 클래스 토글 (CSS 배경이미지 교체용)
function toggleValidIcon(input, isValid) {
    const wrapper = input.closest(".input-wrapper");
    if (wrapper) {
        if (isValid) {
            wrapper.classList.add("valid"); // -> icon-check-on.svg 보임
        } else {
            wrapper.classList.remove("valid"); // -> icon-check-off.svg 보임
        }
    }
}

// 1. 순차 입력 강제 (Focus 이벤트 리스너)
const inputOrder = ["username", "password", "passwordConfirm", "name", "phoneMiddle"];

inputOrder.forEach((key, index) => {
    if (index === 0) return;

    const currentInput = inputs[key];
    currentInput.addEventListener("focus", () => {
        const prevKey = inputOrder[index - 1];
        const prevInput = inputs[prevKey];

        if (!prevInput.value.trim()) {
            showError(prevInput, "필수 정보입니다.");
            prevInput.focus();
        }
    });
});

// 2. 아이디 유효성 검사 및 중복확인
inputs.username.addEventListener("blur", () => {
    validateUsernameFormat();
});

inputs.checkIdBtn.addEventListener("click", async () => {
    if (validateUsernameFormat()) {
        await checkIdDuplicate();
    }
});

function validateUsernameFormat() {
    const value = inputs.username.value.trim();
    const regex = /^[A-Za-z0-9]+$/;

    if (!value) {
        showError(inputs.username, "필수 정보입니다.");
        state.username = false;
        return false;
    }
    if (!regex.test(value) || value.length > 20) {
        showError(inputs.username, "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.");
        state.username = false;
        return false;
    }

    clearError(inputs.username);
    return true;
}

async function checkIdDuplicate() {
    const username = inputs.username.value.trim();

    try {
        const result = await request("/accounts/validate-username/", {
            method: "POST",
            body: JSON.stringify({ username }),
        });

        showSuccess(inputs.username, "멋진 아이디네요 :)");

        state.username = true;
        state.usernameChecked = true;
    } catch (error) {
        console.error("ID Check Error:", error);

        // 1. 서버가 보내준 상세 에러 메시지 추출
        let errorMessage = "아이디 확인 중 오류가 발생했습니다.";

        if (error.data) {
            // 서버 응답 구조에 따라 메시지 추출 (FAIL_Message 또는 필드 에러)
            errorMessage =
                error.data.FAIL_Message ||
                (error.data.username && error.data.username[0]) ||
                "이미 사용 중인 아이디입니다.";
        }

        // 2. 화면에 에러 표시
        showError(inputs.username, errorMessage);

        state.username = false;
        state.usernameChecked = false;
        inputs.username.focus();
    }

    checkAllValid();
}

inputs.username.addEventListener("input", () => {
    state.usernameChecked = false;
    state.username = false;
    clearError(inputs.username);
    checkAllValid();
});

// 3. 비밀번호 유효성 검사
inputs.password.addEventListener("input", validatePassword);
inputs.password.addEventListener("blur", validatePassword);

function validatePassword() {
    const value = inputs.password.value;
    const hasLetter = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (!value) {
        showError(inputs.password, "필수 정보입니다.");
        toggleValidIcon(inputs.password, false);
        return;
    }

    if (value.length < 8) {
        toggleValidIcon(inputs.password, false);
        showError(inputs.password, "비밀번호는 8자 이상이어야 합니다.");
        state.password = false;
    } else if (!hasLetter) {
        toggleValidIcon(inputs.password, false);
        showError(inputs.password, "비밀번호는 한개 이상의 영소문자가 필수적으로 들어가야 합니다.");
        state.password = false;
    } else if (!hasNumber) {
        toggleValidIcon(inputs.password, false);
        showError(inputs.password, "비밀번호는 한개 이상의 숫자가 필수적으로 들어가야 합니다.");
        state.password = false;
    } else {
        toggleValidIcon(inputs.password, true);
        clearError(inputs.password);
        state.password = true;
    }

    if (inputs.passwordConfirm.value) validatePasswordConfirm();
    checkAllValid();
}

// 4. 비밀번호 재확인
inputs.passwordConfirm.addEventListener("input", validatePasswordConfirm);

function validatePasswordConfirm() {
    const pw = inputs.password.value;
    const pwConfirm = inputs.passwordConfirm.value;

    if (pw !== pwConfirm) {
        showError(inputs.passwordConfirm, "비밀번호가 일치하지 않습니다.");
        state.passwordConfirm = false;
    } else {
        clearError(inputs.passwordConfirm);
        state.passwordConfirm = true;
        toggleValidIcon(inputs.passwordConfirm, true);
    }
    checkAllValid();
}

// 5. 이름 검사
inputs.name.addEventListener("blur", () => {
    if (!inputs.name.value.trim()) {
        showError(inputs.name, "필수 정보입니다.");
        state.name = false;
    } else {
        clearError(inputs.name);
        state.name = true;
    }
    checkAllValid();
});
inputs.name.addEventListener("input", () => {
    if (inputs.name.value.trim()) state.name = true;
    checkAllValid();
});

// 6. 휴대폰 번호 검사
[inputs.phoneMiddle, inputs.phoneLast].forEach((input) => {
    input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        validatePhone();
    });
});

function validatePhone() {
    const p1 = inputs.phonePrefix.value;
    const p2 = inputs.phoneMiddle.value;
    const p3 = inputs.phoneLast.value;

    if (p2.length >= 3 && p3.length === 4) {
        clearError(inputs.phoneMiddle);
        state.phone = true;
    } else {
        state.phone = false;
    }
    checkAllValid();
}

// 7. 약관 동의 체크
agreeTerms.addEventListener("change", checkAllValid);

// 1. 사업자 등록번호 (숫자만 입력)
inputs.businessNo.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만
    state.businessChecked = false; // 수정하면 인증 다시 받아야 함
    state.businessNo = false;
    checkAllValid();
});

// 2. 사업자 번호 인증 버튼 (로직은 아이디 중복확인과 비슷하게 구현)
inputs.checkBusinessBtn.addEventListener("click", async () => {
    const businessNo = inputs.businessNo.value.trim();

    if (!businessNo || businessNo.length !== 10) {
        // 보통 사업자번호는 10자리
        showError(inputs.businessNo, "유효한 사업자 등록번호를 입력해주세요 (10자리).");
        return;
    }

    try {
        // [API] 실제 사업자 인증 API가 있다면 여기서 호출
        // const result = await request("/accounts/validate-company-registration-number/", ...);

        // 데모용 성공 처리
        showSuccess(inputs.businessNo, "인증되었습니다.");
        state.businessNo = true;
        state.businessChecked = true;
    } catch (error) {
        showError(inputs.businessNo, "이미 가입된 사업자 번호이거나 유효하지 않습니다.");
        state.businessNo = false;
        state.businessChecked = false;
    }
    checkAllValid();
});

// 3. 스토어 이름
inputs.storeName.addEventListener("blur", () => {
    if (!inputs.storeName.value.trim()) {
        showError(inputs.storeName, "필수 정보입니다.");
        state.storeName = false;
    } else {
        clearError(inputs.storeName);
        state.storeName = true;
    }
    checkAllValid();
});
inputs.storeName.addEventListener("input", () => {
    if (inputs.storeName.value.trim()) state.storeName = true;
    checkAllValid();
});

// 8. 전체 유효성 검사 및 버튼 활성화
function checkAllValid() {
    let isAllValid =
        state.username &&
        state.usernameChecked &&
        state.password &&
        state.passwordConfirm &&
        state.name &&
        state.phone &&
        agreeTerms.checked;
    if (currentType === "SELLER") {
        isAllValid = isAllValid && state.businessChecked && state.storeName;
    }
    if (isAllValid) {
        submitBtn.disabled = false;
        submitBtn.classList.add("active");
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove("active");
    }
}

// 9. 회원가입 제출 (Submit) 부분 수정
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = {
        username: inputs.username.value,
        password: inputs.password.value,
        name: inputs.name.value,
        phone_number: `${inputs.phonePrefix.value}${inputs.phoneMiddle.value}${inputs.phoneLast.value}`,
        user_type: document.querySelector(".tab-btn.active").dataset.type.toUpperCase(),
    };
    let apiUrl = "/accounts/buyer/signup/"; // 기본 API 주소

    // 판매자일 경우 데이터 및 URL 변경
    if (currentType === "SELLER") {
        formData.company_registration_number = inputs.businessNo.value;
        formData.store_name = inputs.storeName.value;
        apiUrl = "/accounts/seller/signup/"; // 판매자용 엔드포인트
    }
    try {
        await request(apiUrl, {
            method: "POST",
            body: JSON.stringify(formData),
        });

        alert("회원가입이 완료되었습니다!");
        window.location.href = "/login.html";
    } catch (error) {
        console.error("Signup Error:", error);

        // 서버에서 상세 에러 데이터(error.data)가 넘어온 경우
        if (error.data) {
            const errorData = error.data;

            // 각 필드별로 에러 메시지 표시
            for (const key in errorData) {
                const message = errorData[key][0]; // 첫 번째 에러 메시지 추출

                if (key === "company_registration_number") {
                    showError(inputs.businessNo, message);
                } else if (key === "store_name") {
                    showError(inputs.storeName, message);
                } else if (inputs[key]) {
                    showError(inputs[key], message);
                } else if (key === "phone_number") {
                    showError(inputs.phoneMiddle, message);
                } else {
                    alert(message);
                }
            }
        } else {
            // 통신 장애 등 일반 에러
            alert(error.message || "회원가입 중 오류가 발생했습니다.");
        }
    }
});
