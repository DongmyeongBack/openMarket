function m({id:t,className:n="",content:d="",actions:c=[],onClose:o=null}){const s=document.getElementById(t);s&&s.remove();const b=c.map((e,i)=>`
        <button class="modal-btn ${e.class}" id="${t}-btn-${i}">
            ${e.text}
        </button>
    `).join(""),f=`
        <div class="modal-overlay" id="${t}">
            <div class="modal-box ${n}">
                <button class="modal-close-btn" id="${t}-close">&times;</button>
                
                ${d}

                <div class="modal-actions">
                    ${b}
                </div>
            </div>
        </div>
    `;document.body.insertAdjacentHTML("beforeend",f);const a=document.getElementById(t),r=document.getElementById(`${t}-close`),l=(e=!0)=>{a&&a.remove(),e&&o&&o()};return r&&r.addEventListener("click",()=>l(!0)),a.addEventListener("click",e=>{e.target===a&&l(!0)}),c.forEach((e,i)=>{const x=`${t}-btn-${i}`,u=document.getElementById(x);u&&u.addEventListener("click",()=>{e.onClick?e.onClick(l):l(!0)})}),l}function $(){m({id:"loginModal",content:`
            <p class="modal-text">
                로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
            </p>
        `,actions:[{text:"아니오",class:"btn-no",onClick:t=>t()},{text:"예",class:"btn-yes",onClick:t=>{t(),window.location.href="/openMarket/src/pages/login/index.html"}}]})}function M(){return new Promise(t=>{m({id:"deleteModal",className:"delete-modal-box",content:`
                <p class="modal-text">
                    상품을 삭제하시겠습니까?
                </p>
            `,actions:[{text:"취소",class:"btn-no",onClick:n=>{n(),t(!1)}},{text:"확인",class:"btn-yes",onClick:n=>{n(!1),t(!0)}}],onClose:()=>t(!1)})})}function k(t){const{message:n,confirmText:d="확인",cancelText:c="쇼핑 계속"}=t;return new Promise(o=>{m({id:"cartCommonModal",content:`
                <p class="modal-text">
                    ${n}
                </p>
            `,actions:[{text:c,class:"btn-no",onClick:s=>{s(),o(!1)}},{text:d,class:"btn-yes",onClick:s=>{s(!1),o(!0)}}],onClose:()=>o(!1)})})}export{k as a,M as b,$ as s};
