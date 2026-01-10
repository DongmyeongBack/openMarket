// DOM 요소 선택
const idInput = document.querySelector("#username");
const checkIdBtn = document.querySelector("#checkIdBtn");
const idError = document.querySelector("#idError");

const pwInput = document.querySelector("#password");
const pwConfirmInput = document.querySelector("#passwordConfirm");
const pwError = document.querySelector("#pwError");

const nameInput = document.querySelector("#name");
const phoneMiddle = document.querySelector("#phoneMiddle");
const phoneLast = document.querySelector("#phoneLast");
const agreeTerms = document.querySelector("#agreeTerms");

const submitBtn = document.querySelector("#submitBtn");
const signupForm = document.querySelector("#signupForm");

// 상태 변수 (아이디 중복 확인을 통과했는지 여부)
let isIdChecked = false;

// 1. 아이디 중복 확인 기능
checkIdBtn.addEventListener("click", () => {
    const userId = idInput.value;

    if (!userId) {
        alert("아이디를 입력해주세요.");
        return;
    }

    // 예시: 'dupe'라는 아이디는 중복이라고 가정
    if (userId === "dupe") {
        idError.classList.remove("hidden"); // 경고 문구 보이기
        idInput.style.border = "1px solid #EB5757"; // 빨간 테두리
        isIdChecked = false;
    } else {
        idError.classList.add("hidden"); // 경고 문구 숨기기
        idInput.style.border = "1px solid #21BF48"; // 초록 테두리 (성공)
        alert("사용 가능한 아이디입니다.");
        isIdChecked = true;
    }

    checkFormValidity(); // 버튼 상태 업데이트
});

// 아이디 입력값이 바뀌면 중복확인 다시 해야 함
idInput.addEventListener("input", () => {
    isIdChecked = false;
    idInput.style.border = "1px solid #c4c4c4";
    idError.classList.add("hidden");
    checkFormValidity();
});

// 2. 폼 유효성 검사 함수 (모든 조건 만족 시 버튼 활성화)
function checkFormValidity() {
    const isIdValid = idInput.value.length > 0 && isIdChecked;
    const isPwValid = pwInput.value.length > 0;
    const isPwMatch = pwInput.value === pwConfirmInput.value;
    const isNameValid = nameInput.value.length > 0;
    const isPhoneValid = phoneMiddle.value.length >= 3 && phoneLast.value.length === 4;
    const isTermsChecked = agreeTerms.checked;

    // 비밀번호 불일치 메시지 처리
    if (pwConfirmInput.value.length > 0 && !isPwMatch) {
        pwError.classList.remove("hidden");
        pwConfirmInput.style.border = "1px solid #EB5757";
    } else {
        pwError.classList.add("hidden");
        pwConfirmInput.style.border = "1px solid #c4c4c4";
    }

    // 모든 조건이 true일 때만 버튼 활성화 (disabled 속성 제거)
    if (isIdValid && isPwValid && isPwMatch && isNameValid && isPhoneValid && isTermsChecked) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// 3. 각 입력창에 이벤트 리스너 연결 (입력할 때마다 검사)
// 'input' 이벤트는 키보드 입력, 붙여넣기 등 값이 변할 때 발생합니다.
pwInput.addEventListener("input", checkFormValidity);
pwConfirmInput.addEventListener("input", checkFormValidity);
nameInput.addEventListener("input", checkFormValidity);
phoneMiddle.addEventListener("input", checkFormValidity);
phoneLast.addEventListener("input", checkFormValidity);
agreeTerms.addEventListener("change", checkFormValidity); // 체크박스는 'change' 이벤트

// 4. 가입하기 버튼 클릭 (폼 제출) 처리
signupForm.addEventListener("submit", (e) => {
    e.preventDefault(); // 폼의 기본 새로고침 동작 막기

    // 실제로는 여기서 서버로 데이터를 보내야 합니다 (fetch 등 사용)
    // 지금은 요구사항대로 로그인 페이지로 이동합니다.
    alert("회원가입이 완료되었습니다!");

    // 상대 경로를 이용하여 로그인 페이지로 이동
    window.location.href = "../login/index.html";
});

// [추가] 탭 버튼 기능 구현
const tabButtons = document.querySelectorAll(".tab-btn"); // 모든 탭 버튼 선택

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // 1. 모든 버튼에서 'active' 클래스 제거 (초기화)
        tabButtons.forEach((btn) => btn.classList.remove("active"));

        // 2. 현재 클릭한 버튼에만 'active' 클래스 추가
        button.classList.add("active");

        // (선택사항) 만약 탭에 따라 '구매회원/판매회원' 정보를 구분해야 한다면
        // 여기서 button.dataset.type 값을 확인해서 처리를 추가할 수 있습니다.
        // console.log("선택된 탭:", button.dataset.type);
    });
});
