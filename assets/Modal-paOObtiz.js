function a({id:t,content:e="",actions:i=[],onClose:n=null}){const s=document.getElementById(t);s&&s.remove();const l=(o=!0)=>{document.removeEventListener("keydown",u);const c=document.getElementById(t);c&&c.remove(),o&&n&&n()},u=o=>{o.key==="Escape"&&l(!0)},b=i.map((o,c)=>`
            <button class="modal-btn ${o.class||""}" id="${t}-btn-${c}">
                ${o.text}
            </button>
        `).join(""),x=`
        <div class="modal-overlay" id="${t}" role="dialog" aria-modal="true" aria-labelledby="${t}-content">
            <div class="modal-box" tabindex="-1">
                <button class="modal-close-btn" id="${t}-close" aria-label="닫기">&times;</button>
                <div class="modal-content" id="${t}-content">${e}</div>
                <div class="modal-actions">${b}</div>
            </div>
        </div>
    `;document.body.insertAdjacentHTML("beforeend",x);const d=document.getElementById(t),r=document.getElementById(`${t}-close`);d.addEventListener("click",o=>{o.target===d&&l(!0)}),r&&r.addEventListener("click",()=>l(!0)),document.addEventListener("keydown",u),i.forEach((o,c)=>{const f=document.getElementById(`${t}-btn-${c}`);f&&f.addEventListener("click",()=>{o.onClick?o.onClick(l):l(!0)})});const m=d.querySelector(".btn-yes")||d.querySelector(".modal-actions button:last-child")||r;return m&&m.focus(),l}function y(){a({id:"loginModal",content:`
            <p class="modal-text">
                로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
            </p>
        `,actions:[{text:"아니오",class:"btn-no",onClick:t=>t()},{text:"예",class:"btn-yes",onClick:t=>{t();const e="/openMarket/src/pages/login/index.html";window.location.href=e}}]})}function g(){return new Promise(t=>{a({id:"deleteModal",content:`
                <p class="modal-text">상품을 삭제하시겠습니까?</p>
            `,actions:[{text:"취소",class:"btn-no",onClick:e=>{e(),t(!1)}},{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!1)})})}function p({message:t,confirmText:e="확인",cancelText:i="쇼핑 계속"}){return new Promise(n=>{a({id:"cartCommonModal",content:`<p class="modal-text">${t}</p>`,actions:[{text:i,class:"btn-no",onClick:s=>{s(),n(!1)}},{text:e,class:"btn-yes",onClick:s=>{s(!1),n(!0)}}],onClose:()=>n(!1)})})}function M(){return new Promise(t=>{a({id:"loginSuccessModal",content:'<p class="modal-text">로그인 되었습니다.</p>',actions:[{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!0)})})}function k(){return new Promise(t=>{a({id:"logoutModal",content:'<p class="modal-text">로그아웃 되었습니다.</p>',actions:[{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!0)})})}function C(){return new Promise(t=>{a({id:"signupSuccessModal",content:'<p class="modal-text">회원 가입이 완료되었습니다.</p>',actions:[{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t()}}],onClose:()=>t()})})}export{C as a,y as b,p as c,g as d,k as e,M as s};
