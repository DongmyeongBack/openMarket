// DOM 요소 가져오기
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");
const tabs = document.querySelectorAll(".tab-btn");

// API 기본 경로 (제시해주신 주소)
const API_URL = "https://api.wenivops.co.kr/services/open-market";

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
// [중요] 비동기 통신(await)을 위해 async 키워드 추가
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

    // 3. 실제 API 호출 로직
    try {
        const res = await fetch(`${API_URL}/accounts/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                login_type: loginType, // [참고] API 명세에는 없었으나, 보통 구매자/판매자 구분을 위해 필요할 수 있습니다. 필요 없다면 이 줄을 지우세요.
            }),
        });

        const data = await res.json();

        // [실패 처리] status가 200이 아니거나, 401 에러인 경우
        if (!res.ok) {
            // 에러 메시지 출력 (API에서 주는 메시지 or 기본 메시지)
            const msg = data.error || "아이디 또는 비밀번호가 일치하지 않습니다.";
            throw new Error(msg);
        }

        // [성공 처리]
        // (선택사항) 탭과 실제 반환된 유저 타입이 일치하는지 확인
        /* if (data.user.user_type !== loginType) {
             throw new Error("회원 유형이 일치하지 않습니다.");
        } 
        */

        // 1. 토큰 및 유저 정보 저장 (로컬 스토리지)
        sessionStorage.setItem("token", data.access);
        sessionStorage.setItem("userType", data.user.user_type);
        sessionStorage.setItem("username", data.user.username);

        // 2. 알림 및 페이지 이동
        alert(`${loginType} 회원으로 로그인되었습니다.`);

        // 이전 페이지 기록 확인 후 이동
        if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
            history.back();
        } else {
            window.location.href = "/";
        }
    } catch (error) {
        // [에러 발생 시 동작]
        console.error("로그인 에러:", error);

        // 에러 메시지 표시
        errorMessage.textContent = error.message;
        errorMessage.classList.add("show");

        // [요구사항] 비밀번호 입력창 비우고 포커스
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
