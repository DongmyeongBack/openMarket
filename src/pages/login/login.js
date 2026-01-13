// [변경] 공용 API 함수 임포트
import { request } from "/src/utils/api.js";

// DOM 요소 가져오기
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");
const tabs = document.querySelectorAll(".tab-btn");

// [삭제] API_URL 상수는 api.js에서 관리하므로 제거

// 현재 로그인 타입 (기본값: BUYER)
let loginType = "BUYER";

// 1. 탭 전환 기능 (구매자 <-> 판매자)
tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        // 모든 탭 active 클래스 제거
        tabs.forEach((t) => t.classList.remove("active"));
        // 클릭된 탭 active 클래스 추가
        e.target.classList.add("active");

        // 로그인 타입 변경
        loginType = e.target.dataset.type;

        // 탭 전환 시 에러 메시지 및 입력 초기화
        errorMessage.textContent = "";
        errorMessage.classList.remove("show");
    });
});

// 2. 로그인 폼 제출 이벤트 핸들러
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 폼 기본 제출 방지

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // 에러 메시지 초기화
    errorMessage.textContent = "";
    errorMessage.classList.remove("show");

    // [유효성 검사] 아이디 미입력
    if (!username) {
        errorMessage.textContent = "아이디를 입력해주세요.";
        errorMessage.classList.add("show");
        usernameInput.focus();
        return;
    }

    // [유효성 검사] 비밀번호 미입력
    if (!password) {
        errorMessage.textContent = "비밀번호를 입력해주세요.";
        errorMessage.classList.add("show");
        passwordInput.focus();
        return;
    }

    // 3. 실제 API 호출 로직 (request 함수 사용)
    try {
        // [변경] fetch -> request 사용
        // request 함수 내부에서 BASE_URL과 Headers(Content-Type)를 처리해줍니다.
        const data = await request("/accounts/login/", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        // [성공 처리]
        // api.js에서 에러가 발생하면 throw 하므로, 여기까지 코드가 도달했다면 성공입니다.

        // 1. 토큰 및 유저 정보 저장 (session 스토리지)
        sessionStorage.setItem("token", data.token); // 응답 데이터 구조에 따라 data.access 또는 data.token 확인 필요
        sessionStorage.setItem("userType", data.user_type); // 응답 구조 확인 필요 (보통 data.user.user_type 등)
        /* 주의: 실제 API 응답 구조가 기존 코드와 같다면 아래와 같이 저장해야 합니다.
           sessionStorage.setItem("token", data.access);
           sessionStorage.setItem("userType", data.user.user_type);
           sessionStorage.setItem("username", data.user.username);
        */

        // 위 코드를 기존 로직(기존 코드의 data 구조)에 맞춰 복원하면 다음과 같습니다:
        sessionStorage.setItem("token", data.access);
        sessionStorage.setItem("userType", data.user.user_type);
        sessionStorage.setItem("username", data.user.username);

        // 2. 알림 및 페이지 이동
        alert(`${data.user.user_type} 회원으로 로그인되었습니다.`);

        // 이전 페이지 기록 확인 후 이동
        if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
            history.back();
        } else {
            window.location.href = "/";
        }
    } catch (error) {
        console.error("로그인 에러:", error);

        // 기본 에러 메시지 설정
        let displayMessage = "로그인 중 오류가 발생했습니다.";

        // 서버에서 전달한 상세 에러 데이터가 있는 경우 (error.data.error 확인)
        if (error.data && error.data.error) {
            displayMessage = error.data.error;
        } else if (error.message && error.message !== "API_ERROR") {
            // 통신 장애 등 다른 에러 메시지가 있는 경우
            displayMessage = error.message;
        }

        // 에러 메시지 표시
        errorMessage.textContent = displayMessage;
        errorMessage.classList.add("show");

        // 비밀번호 입력창 비우고 포커스
        passwordInput.value = "";
        passwordInput.focus();
    }
});

// [UX 향상] 입력 중에는 에러 메시지 숨기기
[usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
        if (errorMessage.classList.contains("show")) {
            errorMessage.textContent = "";
            errorMessage.classList.remove("show");
        }
    });
});
