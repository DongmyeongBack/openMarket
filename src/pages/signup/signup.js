// src/pages/signup/signup.js
import { checkId, join, checkBusinessNumber } from "../../utils/api.js";

// [추가] CSS 임포트
import "../../styles/reset.css";
import "../../styles/common.css";
import "./signup.css";

// DOM 요소 선택
const inputs = {
    username: document.getElementById("username"),
    checkIdBtn: document.getElementById("checkIdBtn"),
    password: document.getElementById("password"),
    passwordConfirm: document.getElementById("passwordConfirm"),
    name: document.getElementById("name"),
    phonePrefix: document.getElementById("phonePrefix"),
    phoneMiddle: document.getElementById("phoneMiddle"),
    phoneLast: document.getElementById("phoneLast"),
    // 판매자 전용
    businessNo: document.getElementById("businessNo"),
    checkBusinessBtn: document.getElementById("checkBusinessBtn"),
    storeName: document.getElementById("storeName"),
};

const agreeTerms = document.getElementById("agreeTerms");
const submitBtn = document.getElementById("submitBtn");
const sellerFields = document.getElementById("sellerFields");
const tabBtns = document.querySelectorAll(".tab-btn");

let currentType = "BUYER";

// 유효성 검사 상태 관리
const state = {
    username: false,
    usernameChecked: false,
    password: false,
    passwordConfirm: false,
    name: false,
    phone: false,
    // 판매자 전용 상태
    businessNo: false,
    businessChecked: false,
    storeName: false,
};

/* --- 탭 전환 로직 --- */
tabBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const type = e.target.dataset.type;
        switchTab(type);
    });
});

function switchTab(type) {
    currentType = type.toUpperCase();

    // 1. 탭 스타일 변경
    tabBtns.forEach((btn) => {
        if (btn.dataset.type === type) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // 2. 판매자 필드 토글
    if (currentType === "SELLER") {
        sellerFields.classList.remove("hidden");
    } else {
        sellerFields.classList.add("hidden");
        // 구매자로 돌아가면 판매자 에러 초기화
        clearError(inputs.businessNo);
        clearError(inputs.storeName);
    }

    // 3. 유효성 재검사
    checkAllValid();
}

/* --- 헬퍼 함수들 (에러 표시/숨김) --- */
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
    errorMsg.classList.remove("hidden", "success");
    errorMsg.classList.add("show");
}

function showSuccess(input, message) {
    const parent = input.closest(".input-group") || input.parentElement;
    let errorMsg = parent.querySelector(".error-msg");
    if (!errorMsg) {
        errorMsg = document.createElement("p");
        errorMsg.className = "error-msg";
        parent.appendChild(errorMsg);
    }
    input.classList.remove("error");
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("show", "success");
}

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

function toggleValidIcon(input, isValid) {
    const wrapper = input.closest(".input-wrapper");
    if (wrapper) {
        isValid ? wrapper.classList.add("valid") : wrapper.classList.remove("valid");
    }
}

/* --- 기본 필드 이벤트 리스너 --- */
// 1. 순차 입력 유도
const inputOrder = ["username", "password", "passwordConfirm", "name", "phoneMiddle"];
inputOrder.forEach((key, index) => {
    if (index === 0) return;
    inputs[key].addEventListener("focus", () => {
        const prevInput = inputs[inputOrder[index - 1]];
        if (!prevInput.value.trim()) {
            showError(prevInput, "필수 정보입니다.");
            prevInput.focus();
        }
    });
});

// 2. 아이디 검사
inputs.username.addEventListener("blur", validateUsernameFormat);
inputs.username.addEventListener("input", () => {
    state.usernameChecked = false;
    state.username = false;
    clearError(inputs.username);
    checkAllValid();
});

inputs.checkIdBtn.addEventListener("click", async () => {
    if (validateUsernameFormat()) await checkIdDuplicate();
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
        await checkId(username);
        showSuccess(inputs.username, "멋진 아이디네요 :)");
        state.username = true;
        state.usernameChecked = true;
    } catch (error) {
        let msg = "이미 사용 중인 아이디입니다.";
        if (error.data) {
            // API Spec: {"error": "message"} for 400
            msg = error.data.error || error.data.FAIL_Message || (error.data.username && error.data.username[0]) || msg;
        }
        showError(inputs.username, msg);
        state.username = false;
        state.usernameChecked = false;
    }
    checkAllValid();
}

// 3. 비밀번호 검사
inputs.password.addEventListener("input", validatePassword);
inputs.password.addEventListener("blur", validatePassword);

function validatePassword() {
    const value = inputs.password.value;
    if (!value) {
        showError(inputs.password, "필수 정보입니다.");
        toggleValidIcon(inputs.password, false);
        return;
    }
    if (value.length < 8) {
        showError(inputs.password, "비밀번호는 8자 이상이어야 합니다.");
        toggleValidIcon(inputs.password, false);
        state.password = false;
    } else if (!/[a-z]/.test(value)) {
        showError(inputs.password, "비밀번호는 한개 이상의 영소문자가 필수적으로 들어가야 합니다.");
        toggleValidIcon(inputs.password, false);
        state.password = false;
    } else if (!/[0-9]/.test(value)) {
        showError(inputs.password, "비밀번호는 한개 이상의 숫자가 필수적으로 들어가야 합니다.");
        toggleValidIcon(inputs.password, false);
        state.password = false;
    } else {
        clearError(inputs.password);
        toggleValidIcon(inputs.password, true);
        state.password = true;
    }
    if (inputs.passwordConfirm.value) validatePasswordConfirm();
    checkAllValid();
}

// 4. 비밀번호 확인
inputs.passwordConfirm.addEventListener("input", validatePasswordConfirm);
function validatePasswordConfirm() {
    if (inputs.password.value !== inputs.passwordConfirm.value) {
        showError(inputs.passwordConfirm, "비밀번호가 일치하지 않습니다.");
        toggleValidIcon(inputs.passwordConfirm, false);
        state.passwordConfirm = false;
    } else {
        clearError(inputs.passwordConfirm);
        toggleValidIcon(inputs.passwordConfirm, true);
        state.passwordConfirm = true;
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
    if (inputs.phoneMiddle.value.length >= 3 && inputs.phoneLast.value.length === 4) {
        clearError(inputs.phoneMiddle);
        state.phone = true;
    } else {
        state.phone = false;
    }
    checkAllValid();
}

// 7. 약관 동의
agreeTerms.addEventListener("change", checkAllValid);

/* --- 판매자 전용 이벤트 (수정됨) --- */

// 8. 사업자 등록번호 (숫자 입력 제한)
inputs.businessNo.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    state.businessChecked = false; // 수정 시 재인증 필요
    state.businessNo = false;

    clearError(inputs.businessNo);
    checkAllValid();
});

// 9. 사업자 번호 인증 버튼 (API 연동 추가)
inputs.checkBusinessBtn.addEventListener("click", async () => {
    const businessNo = inputs.businessNo.value.trim();

    // 1차 클라이언트 체크 (입력 여부만)
    if (!businessNo) {
        showError(inputs.businessNo, "사업자 등록번호를 입력해주세요.");
        state.businessNo = false;
        state.businessChecked = false;
        checkAllValid();
        return;
    }

    try {
        const result = await checkBusinessNumber(businessNo);

        // 성공 (200)
        showSuccess(inputs.businessNo, result.message || "사용 가능한 사업자등록번호입니다.");
        state.businessNo = true;
        state.businessChecked = true;
    } catch (error) {
        console.error("Business No Check Error:", error);

        // 에러 메시지 추출
        // API가 { "error": "메시지" } 형태로 반환함
        let errorMsg = "사업자 번호 확인 중 오류가 발생했습니다.";

        if (error.data && error.data.error) {
            errorMsg = error.data.error;
        } else if (error.message) {
            errorMsg = error.message;
        }

        showError(inputs.businessNo, errorMsg);
        state.businessNo = false;
        state.businessChecked = false;
    }

    checkAllValid();
});

// 10. 스토어 이름
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

/* --- 전체 유효성 검사 --- */
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

/* --- 회원가입 제출 (API 연동) --- */
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // 1. 공통 데이터 구성
    const formData = {
        username: inputs.username.value,
        password: inputs.password.value,
        name: inputs.name.value,
        phone_number: `${inputs.phonePrefix.value}${inputs.phoneMiddle.value}${inputs.phoneLast.value}`,
    };

    // 2. 판매자일 경우 데이터 추가
    if (currentType === "SELLER") {
        formData.company_registration_number = inputs.businessNo.value;
        formData.store_name = inputs.storeName.value;
    }

    try {
        await join(formData, currentType);

        alert("회원가입이 완료되었습니다!");
        window.location.href = "/src/pages/login/index.html";
    } catch (error) {
        console.error("Signup Error:", error);

        if (error.data) {
            const errorData = error.data;
            for (const key in errorData) {
                const message = errorData[key][0];

                if (key === "company_registration_number") {
                    showError(inputs.businessNo, message);
                    state.businessChecked = false;
                } else if (key === "store_name") {
                    showError(inputs.storeName, message);
                } else if (key === "phone_number") {
                    showError(inputs.phoneMiddle, message);
                } else if (inputs[key]) {
                    showError(inputs[key], message);
                } else {
                    alert(message);
                }
            }
            checkAllValid();
        } else {
            alert(error.message || "회원가입 중 오류가 발생했습니다.");
        }
    }
});
