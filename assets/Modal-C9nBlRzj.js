function c(){document.body.insertAdjacentHTML("beforeend",`
        <div class="modal-overlay" id="loginModal">
            <div class="modal-box">
                <button class="modal-close-btn" id="modalClose">&times;</button>
                <p class="modal-text">
                    로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
                </p>
                <div class="modal-actions">
                    <button class="modal-btn btn-no" id="modalNo">아니오</button>
                    <button class="modal-btn btn-yes" id="modalYes">예</button>
                </div>
            </div>
        </div>
    `);const d=document.getElementById("loginModal"),e=()=>{d&&d.remove()};document.getElementById("modalClose").addEventListener("click",e),document.getElementById("modalNo").addEventListener("click",e),d.addEventListener("click",l=>{l.target===d&&e()}),document.getElementById("modalYes").addEventListener("click",()=>{e(),window.location.href="/src/pages/login/index.html"})}function i(){return new Promise(n=>{document.body.insertAdjacentHTML("beforeend",`
            <div class="modal-overlay" id="deleteModal">
                <div class="modal-box delete-modal-box">
                    <button class="modal-close-btn" id="deleteModalClose">&times;</button>
                    <p class="modal-text">
                        상품을 삭제하시겠습니까?
                    </p>
                    <div class="modal-actions">
                        <button class="modal-btn btn-no" id="deleteCancel">취소</button>
                        <button class="modal-btn btn-yes" id="deleteConfirm">확인</button>
                    </div>
                </div>
            </div>
        `);const e=document.getElementById("deleteModal"),l=document.getElementById("deleteModalClose"),a=document.getElementById("deleteCancel"),s=document.getElementById("deleteConfirm"),t=o=>{e&&e.remove(),n(o)};l.addEventListener("click",()=>t(!1)),a.addEventListener("click",()=>t(!1)),e.addEventListener("click",o=>{o.target===e&&t(!1)}),s.addEventListener("click",()=>t(!0))})}function m(){return new Promise(n=>{document.body.insertAdjacentHTML("beforeend",`
            <div class="modal-overlay" id="cartMoveModal">
                <div class="modal-box">
                    <button class="modal-close-btn" id="cartModalClose">&times;</button>

                    <p class="modal-text">
                        이미 장바구니에 있는 상품입니다.<br> 장바구니로 이동하시겠습니까?
                    </p>

                    <div class="modal-actions">
                        <button class="modal-btn btn-no" id="cartModalNo">아니오</button>
                        <button class="modal-btn btn-yes" id="cartModalYes">예</button>
                    </div>
                </div>
            </div>
        `);const e=document.getElementById("cartMoveModal"),l=document.getElementById("cartModalClose"),a=document.getElementById("cartModalNo"),s=document.getElementById("cartModalYes"),t=o=>{e&&e.remove(),n(o)};l.onclick=()=>t(!1),a.onclick=()=>t(!1),s.onclick=()=>t(!0),e.onclick=o=>{o.target===e&&t(!1)}})}export{m as a,i as b,c as s};
