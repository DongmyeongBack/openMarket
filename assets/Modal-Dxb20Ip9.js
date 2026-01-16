function i({id:t,className:e="",content:d="",actions:l=[],onClose:o=null}){const s=document.getElementById(t);s&&s.remove();const f=l.map((n,m)=>`
        <button class="modal-btn ${n.class}" id="${t}-btn-${m}">
            ${n.text}
        </button>
    `).join(""),b=`
        <div class="modal-overlay" id="${t}">
            <div class="modal-box ${e}">
                <button class="modal-close-btn" id="${t}-close">&times;</button>
                
                ${d}

                <div class="modal-actions">
                    ${f}
                </div>
            </div>
        </div>
    `;document.body.insertAdjacentHTML("beforeend",b);const a=document.getElementById(t),r=document.getElementById(`${t}-close`),c=(n=!0)=>{a&&a.remove(),n&&o&&o()};return r&&r.addEventListener("click",()=>c(!0)),a.addEventListener("click",n=>{n.target===a&&c(!0)}),l.forEach((n,m)=>{const x=`${t}-btn-${m}`,u=document.getElementById(x);u&&u.addEventListener("click",()=>{n.onClick?n.onClick(c):c(!0)})}),c}function M(){i({id:"loginModal",content:`
            <p class="modal-text">
                로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
            </p>
        `,actions:[{text:"아니오",class:"btn-no",onClick:t=>t()},{text:"예",class:"btn-yes",onClick:t=>{t(),window.location.href="/openMarket/src/pages/login/index.html"}}]})}function C(){return new Promise(t=>{i({id:"deleteModal",className:"",content:`
                <p class="modal-text">
                    상품을 삭제하시겠습니까?
                </p>
            `,actions:[{text:"취소",class:"btn-no",onClick:e=>{e(),t(!1)}},{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!1)})})}function $(t){const{message:e,confirmText:d="확인",cancelText:l="쇼핑 계속"}=t;return new Promise(o=>{i({id:"cartCommonModal",content:`
                <p class="modal-text">
                    ${e}
                </p>
            `,actions:[{text:l,class:"btn-no",onClick:s=>{s(),o(!1)}},{text:d,class:"btn-yes",onClick:s=>{s(!1),o(!0)}}],onClose:()=>o(!1)})})}function g(){return new Promise(t=>{i({id:"loginSuccessModal",className:"",content:`
            <p class="modal-text">
                로그인 되었습니다.
            </p>
        `,actions:[{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!0)})})}export{M as a,$ as b,C as c,g as s};
