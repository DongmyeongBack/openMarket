// 기본 API URL 설정
const API_BASE_URL = "https://api.wenivops.co.kr/services/open-market";

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
};
const agreeTerms = document.getElementById("agreeTerms");
const submitBtn = document.getElementById("submitBtn");

// 유효성 검사 상태 관리 객체
const state = {
    username: false,
    usernameChecked: false, // 중복확인 버튼 클릭 여부
    password: false,
    passwordConfirm: false,
    name: false,
    phone: false,
};

// 헬퍼 함수: 에러 메시지 표시
function showError(input, message) {
    const parent = input.closest(".input-group") || input.parentElement;
    let errorMsg = parent.querySelector(".error-msg");

    // 에러 메시지 태그가 없으면 생성 (이름, 전화번호 등)
    if (!errorMsg) {
        errorMsg = document.createElement("p");
        errorMsg.className = "error-msg error-message"; // CSS 호환을 위해 클래스 추가
        parent.appendChild(errorMsg);
    }

    input.classList.add("error");
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("show");
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

// 1. 순차 입력 강제 (Focus 이벤트 리스너)
const inputOrder = ["username", "password", "passwordConfirm", "name", "phoneMiddle"];

inputOrder.forEach((key, index) => {
    if (index === 0) return; // 첫 번째(아이디)는 검사 제외

    const currentInput = inputs[key];
    currentInput.addEventListener("focus", () => {
        // 바로 이전 필드 검사
        const prevKey = inputOrder[index - 1];
        const prevInput = inputs[prevKey];

        // 이전 필드가 비어있다면
        if (!prevInput.value.trim()) {
            showError(prevInput, "필수 정보입니다.");
            prevInput.focus();
        }
    });
});

// 2. 아이디 유효성 검사 및 중복확인
// 포커스 잃을 때 형식 검사
inputs.username.addEventListener("blur", () => {
    validateUsernameFormat();
});

// 중복확인 버튼 클릭
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
    if (!regex.test(value)) {
        showError(inputs.username, "아이디는 영어 소문자, 대문자, 숫자만 가능합니다.");
        state.username = false;
        return false;
    }
    if (value.length > 20) {
        showError(inputs.username, "아이디는 20자 이하여야 합니다.");
        state.username = false;
        return false;
    }

    // 형식이 맞으면 에러 지우지만, 중복확인 전까지는 state false (버튼 눌러야 함)
    clearError(inputs.username);
    return true;
}

async function checkIdDuplicate() {
    const username = inputs.username.value.trim();

    try {
        const response = await fetch(`${API_BASE_URL}/accounts/validate-username/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        const result = await response.json();

        if (response.ok) {
            // status: 200 -> 사용 가능한 아이디
            // 응답 예시: { "message": "사용 가능한 아이디입니다." }
            alert(result.message);

            state.username = true;
            state.usernameChecked = true; // 중복확인 완료 체크

            // 성공 시 에러 메시지 확실히 제거
            clearError(inputs.username);

            // (선택) 성공 시 인풋 테두리를 초록색으로 바꾸고 싶다면 CSS 클래스 추가 가능
            // inputs.username.classList.add("valid");
        } else {
            // status: 400 -> 중복되거나 잘못된 요청
            // 응답 예시: { "error": "이미 사용 중인 아이디입니다." }
            showError(inputs.username, result.error);
            state.username = false;
            state.usernameChecked = false;
            inputs.username.focus();
        }
    } catch (error) {
        console.error("ID Check Error:", error);
        alert("중복 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }

    // 전체 유효성 검사 갱신 (가입하기 버튼 활성화 여부 판단)
    checkAllValid();
}

// 아이디 값이 변하면 중복확인 상태 초기화 (다시 확인 받아야 함)
inputs.username.addEventListener("input", () => {
    state.usernameChecked = false;
    state.username = false;

    // 입력 중에는 에러 메시지를 바로 띄우지 않거나,
    // 혹은 형식이 틀렸을 때만 실시간으로 알려줄 수 있습니다.
    // 여기서는 버튼 비활성화를 위해 checkAllValid만 호출합니다.
    checkAllValid();
});

// 3. 비밀번호 유효성 검사
inputs.password.addEventListener("input", validatePassword);
inputs.password.addEventListener("blur", validatePassword);

function validatePassword() {
    const value = inputs.password.value;
    const hasLetter = /[a-z]/.test(value); // 영소문자
    const hasNumber = /[0-9]/.test(value);

    if (!value) {
        // blur일 때만 에러 표시, 입력 중에는 너무 잦은 에러 방지 (선택 사항)
        return;
    }

    if (value.length < 8) {
        showError(inputs.password, "비밀번호는 8자 이상이어야 합니다.");
        state.password = false;
    } else if (!hasLetter) {
        showError(inputs.password, "비밀번호는 한개 이상의 영소문자가 필수적으로 들어가야 합니다.");
        state.password = false;
    } else if (!hasNumber) {
        showError(inputs.password, "비밀번호는 한개 이상의 숫자가 필수적으로 들어가야 합니다.");
        state.password = false;
    } else {
        clearError(inputs.password);
        state.password = true;
    }

    // 비밀번호가 바뀌면 재확인 필드도 다시 검사
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
    }
    checkAllValid();
}

// 5. 이름 검사 (단순 비어있는지 여부)
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
// 숫자만 입력되도록 처리
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
    const fullPhone = `${p1}${p2}${p3}`;
    const parentBox = inputs.phoneMiddle.closest(".input-group"); // 에러 표시 위치 잡기 위해

    // 간단한 길이 검사
    if (p2.length >= 3 && p3.length === 4) {
        // 에러 제거 (showError 함수가 input 기준이라 phoneMiddle 기준으로 처리)
        clearError(inputs.phoneMiddle);
        state.phone = true;
    } else {
        state.phone = false;
    }
    checkAllValid();
}

// 7. 약관 동의 체크
agreeTerms.addEventListener("change", checkAllValid);

// 8. 전체 유효성 검사 및 버튼 활성화
function checkAllValid() {
    const isAllValid =
        state.username &&
        state.usernameChecked &&
        state.password &&
        state.passwordConfirm &&
        state.name &&
        state.phone &&
        agreeTerms.checked;

    if (isAllValid) {
        submitBtn.disabled = false;
        submitBtn.classList.add("active"); // 스타일용 클래스
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove("active");
    }
}

// 9. 회원가입 제출 (Submit)
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // 데이터 구성
    const formData = {
        username: inputs.username.value,
        password: inputs.password.value,
        name: inputs.name.value,
        phone_number: `${inputs.phonePrefix.value}${inputs.phoneMiddle.value}${inputs.phoneLast.value}`,
        user_type: document.querySelector(".tab-btn.active").dataset.type.toUpperCase(), // BUYER or SELLER
    };

    try {
        const response = await fetch(`${API_BASE_URL}/accounts/buyer/signup/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            // 성공
            alert("회원가입이 완료되었습니다!");
            window.location.href = "/login.html"; // 로그인 페이지로 이동
        } else {
            // 실패 (400 에러 처리)
            handleApiErrors(result);
        }
    } catch (error) {
        console.error("Signup Error:", error);
        alert("회원가입 요청 중 문제가 발생했습니다.");
    }
});

// API 에러 메시지 매핑 처리
function handleApiErrors(errors) {
    // errors 객체 예: { username: ["이미 존재하는 아이디입니다."], password: [...] }

    for (const key in errors) {
        const message = errors[key][0]; // 첫 번째 에러 메시지

        if (key === "username") {
            showError(inputs.username, message);
            state.username = false; // 상태 초기화
        } else if (key === "password") {
            showError(inputs.password, message);
            state.password = false;
        } else if (key === "name") {
            showError(inputs.name, message);
        } else if (key === "phone_number") {
            showError(inputs.phoneMiddle, message); // 폰 번호 에러는 중간 번호 칸 아래에 표시
        }
    }
    // 버튼 다시 비활성화
    submitBtn.disabled = true;
}
