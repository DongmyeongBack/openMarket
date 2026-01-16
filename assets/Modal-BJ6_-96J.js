function b(){document.body.insertAdjacentHTML("beforeend",`
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
    `);const o=document.getElementById("loginModal"),e=()=>{o&&o.remove()};document.getElementById("modalClose").addEventListener("click",e),document.getElementById("modalNo").addEventListener("click",e),o.addEventListener("click",n=>{n.target===o&&e()}),document.getElementById("modalYes").addEventListener("click",()=>{e(),window.location.href="/src/pages/login/index.html"})}function u(){return new Promise(l=>{document.body.insertAdjacentHTML("beforeend",`
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
        `);const e=document.getElementById("deleteModal"),n=document.getElementById("deleteModalClose"),c=document.getElementById("deleteCancel"),s=document.getElementById("deleteConfirm"),t=d=>{e&&e.remove(),l(d)};n.addEventListener("click",()=>t(!1)),c.addEventListener("click",()=>t(!1)),e.addEventListener("click",d=>{d.target===e&&t(!1)}),s.addEventListener("click",()=>t(!0))})}function v(l){const{message:o,confirmText:e="확인",cancelText:n="쇼핑 계속"}=l;return new Promise(c=>{const s=`
            <div class="modal-overlay" id="cartCommonModal">
                <div class="modal-box">
                    <button class="modal-close-btn" id="cartCommonClose">&times;</button>

                    <p class="modal-text">
                        ${o}
                    </p>

                    <div class="modal-actions">
                        <button class="modal-btn btn-no" id="cartCommonCancel">
                            ${n}
                        </button>
                        <button class="modal-btn btn-yes" id="cartCommonConfirm">
                            ${e}
                        </button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",s);const t=document.getElementById("cartCommonModal"),d=document.getElementById("cartCommonClose"),i=document.getElementById("cartCommonCancel"),r=document.getElementById("cartCommonConfirm"),a=m=>{t&&t.remove(),c(m)};d.onclick=()=>a(!1),i.onclick=()=>a(!1),r.onclick=()=>a(!0),t.onclick=m=>{m.target===t&&a(!1)}})}export{v as a,u as b,b as s};
