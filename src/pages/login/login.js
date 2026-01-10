// DOM 요소 가져오기
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");
const tabs = document.querySelectorAll(".tab-btn");

// 현재 로그인 타입 (기본값: BUYER)
let loginType = "BUYER";

// [테스트용] 더미 데이터 (백엔드 API 연동 전 테스트용)
const DUMMY_USER = {
    username: "testUser",
    password: "password123",
};

// 1. 탭 전환 기능 (구매자 <-> 판매자)
tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        // 모든 탭 active 클래스 제거
        tabs.forEach((t) => t.classList.remove("active"));
        // 클릭된 탭 active 클래스 추가
        e.target.classList.add("active");

        // 로그인 타입 변경
        loginType = e.target.dataset.type;

        // 탭 전환 시 에러 메시지 및 입력 초기화 (선택사항)
        errorMessage.textContent = "";
        // console.log(`현재 로그인 모드: ${loginType}`);
    });
});

// 2. 로그인 폼 제출 이벤트 핸들러
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // 폼 기본 제출 방지 (새로고침 방지)

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // 에러 메시지 초기화
    errorMessage.textContent = "";

    // [요구사항] 입력 창에 입력이 안된 부분이 존재할 때
    if (!username) {
        errorMessage.textContent = "아이디를 입력해주세요.";
        usernameInput.focus(); // 입력되지 않은 창에 focus
        return;
    }

    if (!password) {
        errorMessage.textContent = "비밀번호를 입력해주세요.";
        passwordInput.focus(); // 입력되지 않은 창에 focus
        return;
    }

    // [요구사항] 아이디와 비밀번호가 일치하지 않을 때 (검증 로직)
    // 실제 프로젝트에서는 여기서 API 호출을 해야 합니다 (예: api.postLogin(...))
    if (username !== DUMMY_USER.username || password !== DUMMY_USER.password) {
        errorMessage.textContent = "아이디 또는 비밀번호가 일치하지 않습니다.";

        // [요구사항] 비밀번호 입력창은 빈칸이 되고 focus 이벤트 발생
        passwordInput.value = "";
        passwordInput.focus();
        return;
    }

    // [요구사항] 로그인 성공 시
    alert(`${loginType} 회원으로 로그인되었습니다.`);

    // 토큰 저장 등 로그인 처리 로직 (생략)
    // localStorage.setItem('token', 'dummy_token');

    // [요구사항] 로그인하기 이전 페이지로 이동
    // 이전 페이지 기록이 있으면 뒤로가기, 없으면 메인으로 이동
    if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
        history.back();
    } else {
        // 히스토리가 없거나 외부에서 들어온 경우 메인으로 이동
        window.location.href = "/";
    }
});

// [요구사항 보완] 입력 중에는 에러 메시지 숨기기 (UX 향상)
[usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
        if (errorMessage.textContent) errorMessage.textContent = "";
    });
});
