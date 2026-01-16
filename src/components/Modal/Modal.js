import "./Modal.css";

/**
 * 공통 모달 생성 함수 (내부 사용)
 * @param {Object} options
 * @param {string} options.id - 모달 고유 ID
 * @param {string} options.className - 추가 CSS 클래스 (예: 'delete-modal-box', 'image-modal-box')
 * @param {string} options.content - 본문 HTML (텍스트, 이미지 등)
 * @param {Array<{text: string, class: string, onClick: Function}>} options.actions - 버튼 목록
 * @param {Function} [options.onClose] - 닫기 시 실행할 콜백 (X 버튼, 배경 클릭, 취소 버튼 등)
 */
function createCommonModal({
    id,
    className = "",
    content = "",
    actions = [],
    onClose = null,
}) {
    // 1. 기존 동일 ID 모달 제거 (중복 방지)
    const existingModal = document.getElementById(id);
    if (existingModal) existingModal.remove();

    // 2. 버튼 HTML 생성
    const buttonsHTML = actions
        .map(
            (btn, index) => `
        <button class="modal-btn ${btn.class}" id="${id}-btn-${index}">
            ${btn.text}
        </button>
    `
        )
        .join("");

    // 3. 전체 모달 HTML 구조
    const modalHTML = `
        <div class="modal-overlay" id="${id}">
            <div class="modal-box ${className}">
                <button class="modal-close-btn" id="${id}-close">&times;</button>
                
                ${content}

                <div class="modal-actions">
                    ${buttonsHTML}
                </div>
            </div>
        </div>
    `;

    // 4. DOM에 추가
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 5. 요소 선택
    const modal = document.getElementById(id);
    const closeBtn = document.getElementById(`${id}-close`);

    // 7. 이벤트 연결

    // X 버튼
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(true));

    // 배경 클릭
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(true);
    });

    // 엔터키 처리
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // '예' 또는 '확인' 버튼 (.btn-yes) 우선 찾기
            let targetBtn = modal.querySelector(".btn-yes");

            // 없으면 마지막 버튼 (보통 확인/닫기 버튼이 마지막에 위치함)
            if (!targetBtn && actions.length > 0) {
                targetBtn = document.getElementById(`${id}-btn-${actions.length - 1}`);
            }

            if (targetBtn) targetBtn.click();
        }
    };
    document.addEventListener("keydown", handleEnter);

    // 닫기 함수 (이벤트 리스너 제거 추가)
    const closeModal = (triggerOnClose = true) => {
        document.removeEventListener("keydown", handleEnter); // 리스너 제거
        if (modal) modal.remove();
        if (triggerOnClose && onClose) onClose();
    };

    // 기존 closeModal을 위에서 재정의했으므로 덮어쓰기 위해 순서 조정이 필요함.
    // 하지만 const로 정의하면 에러가 남.
    // 따라서 구조를 조금 수정해야 함.

    // 아래와 같이 구조를 변경하여 한 번에 처리

    // 하단 액션 버튼들
    actions.forEach((btn, index) => {
        const btnId = `${id}-btn-${index}`;
        const btnEl = document.getElementById(btnId);
        if (btnEl) {
            btnEl.addEventListener("click", () => {
                if (btn.onClick) {
                    btn.onClick(closeModal);
                } else {
                    closeModal(true);
                }
            });
        }
    });

    return closeModal;
}

/**
 * 로그인 요청 모달 (단순 알림 및 이동용)
 */
export function showLoginModal() {
    createCommonModal({
        id: "loginModal",
        content: `
            <p class="modal-text">
                로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
            </p>
        `,
        actions: [
            {
                text: "아니오",
                class: "btn-no",
                onClick: (close) => close(),
            },
            {
                text: "예",
                class: "btn-yes",
                onClick: (close) => {
                    close();
                    window.location.href = `${import.meta.env.BASE_URL
                        }src/pages/login/index.html`;
                },
            },
        ],
    });
}

/**
 * 삭제 확인 모달
 * @returns {Promise<boolean>} 확인 버튼 클릭 시 true, 취소/닫기 시 false 반환
 */
export function showDeleteModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "deleteModal",
            className: "",
            content: `
                <p class="modal-text">
                    상품을 삭제하시겠습니까?
                </p>
            `,
            actions: [
                {
                    text: "취소",
                    class: "btn-no",
                    onClick: (close) => {
                        close();
                        resolve(false);
                    },
                },
                {
                    text: "확인",
                    class: "btn-yes",
                    onClick: (close) => {
                        // [중요] onClose가 호출되지 않도록 false 전달 (Promise 중복 resolve 방지)
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(false), // X 버튼이나 배경 클릭 시 false
        });
    });
}

/**
 * 재고 초과 알림 (UI는 로그인 모달과 유사)
 */
export function showStockLimitModal() {
    createCommonModal({
        id: "stockLimitModal",
        content: `
            <p class="modal-text">
                재고 수량이 초과되었습니다.
            </p>
        `,
        actions: [
            {
                text: "아니오",
                class: "btn-no",
                onClick: (close) => close(),
            },
            {
                text: "예",
                class: "btn-yes",
                onClick: (close) => {
                    console.log("재고 초과 상태에서 계속 진행");
                    close();
                },
            },
        ],
    });
}

/**
 * 공용 장바구니 모달
 * @param {Object} options
 * @param {string} options.message - 안내 문구 (HTML 가능)
 * @param {string} options.confirmText - 확인 버튼 문구
 * @param {string} options.cancelText - 취소 버튼 문구
 * @returns {Promise<boolean>} true: 확인 / false: 취소
 */
export function showCartModal(options) {
    const { message, confirmText = "확인", cancelText = "쇼핑 계속" } = options;

    return new Promise((resolve) => {
        createCommonModal({
            id: "cartCommonModal",
            content: `
                <p class="modal-text">
                    ${message}
                </p>
            `,
            actions: [
                {
                    text: cancelText,
                    class: "btn-no",
                    onClick: (close) => {
                        close();
                        resolve(false);
                    },
                },
                {
                    text: confirmText,
                    class: "btn-yes",
                    onClick: (close) => {
                        // [중요] onClose가 호출되지 않도록 false 전달
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(false),
        });
    });
}

/**
 * 결제 오류 모달
 */
export function showPaymentErrorModal() {
    createCommonModal({
        id: "paymentErrorModal",
        className: "",
        content: `
            <p class="modal-text">
                결재를 진행할 수 없습니다.<br>
                <span class="error-code">[Error Code: API_CONNECTION_ERROR]</span>
            </p>
        `,
        actions: [
            {
                text: "확인",
                class: "btn-yes",
                onClick: (close) => close(),
            },
        ],
    });
}

/**
 * 로그인 성공 모달
 */
export function showLoginSuccessModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "loginSuccessModal",
            className: "",
            content: `
            <p class="modal-text">
                로그인 되었습니다.
            </p>
        `,
            actions: [
                {
                    text: "확인",
                    class: "btn-yes",
                    onClick: (close) => {
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(true), // 닫기만 해도 성공으로 간주하고 이동
        });
    });
}

/**
 * 로그아웃 안내 모달
 */
export function showLogoutModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "logoutModal",
            className: "",
            content: `
            <p class="modal-text">
                로그아웃 되었습니다.
            </p>
        `,
            actions: [
                {
                    text: "확인",
                    class: "btn-yes",
                    onClick: (close) => {
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(true), // 닫기만 해도 resolve하여 후속 작업 진행
        });
    });
}

/**
 * 회원 가입 완료 안내 모달
 */
/**
 * 회원가입 성공 모달 표시
 * @returns {Promise<void>} 사용자가 확인 버튼을 누르면 resolve 되는 Promise
 */
export function showSignupSuccessModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "signupSuccessModal",
            className: "",
            content: `
                <p class="modal-text">
                    회원 가입이 완료되었습니다.
                </p>
            `,
            actions: [
                {
                    text: "확인",
                    class: "btn-yes",
                    // click 이벤트 핸들러
                    onClick: (close) => {
                        close();   // 1. 모달 닫기 (UI 제거)
                        resolve(); // 2. Promise 완료 신호 보내기 (await 해제)
                    },
                },
            ],
        });
    });
}


