function a({id:t,className:e="",content:r="",actions:s=[],onClose:c=null}){const l=document.getElementById(t);l&&l.remove();const b=s.map((n,o)=>`
        <button class="modal-btn ${n.class}" id="${t}-btn-${o}">
            ${n.text}
        </button>
    `).join(""),x=`
        <div class="modal-overlay" id="${t}">
            <div class="modal-box ${e}">
                <button class="modal-close-btn" id="${t}-close">&times;</button>
                
                ${r}

                <div class="modal-actions">
                    ${b}
                </div>
            </div>
        </div>
    `;document.body.insertAdjacentHTML("beforeend",x);const i=document.getElementById(t),m=document.getElementById(`${t}-close`);m&&m.addEventListener("click",()=>d(!0)),i.addEventListener("click",n=>{n.target===i&&d(!0)});const u=n=>{if(n.key==="Enter"){n.preventDefault();let o=i.querySelector(".btn-yes");!o&&s.length>0&&(o=document.getElementById(`${t}-btn-${s.length-1}`)),o&&o.click()}};document.addEventListener("keydown",u);const d=(n=!0)=>{document.removeEventListener("keydown",u),i&&i.remove(),n&&c&&c()};return s.forEach((n,o)=>{const g=`${t}-btn-${o}`,f=document.getElementById(g);f&&f.addEventListener("click",()=>{n.onClick?n.onClick(d):d(!0)})}),d}function k(){a({id:"loginModal",content:`
            <p class="modal-text">
                로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
            </p>
        `,actions:[{text:"아니오",class:"btn-no",onClick:t=>t()},{text:"예",class:"btn-yes",onClick:t=>{t(),window.location.href="/openMarket/src/pages/login/index.html"}}]})}function p(){return new Promise(t=>{a({id:"deleteModal",className:"",content:`
                <p class="modal-text">
                    상품을 삭제하시겠습니까?
                </p>
            `,actions:[{text:"취소",class:"btn-no",onClick:e=>{e(),t(!1)}},{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!1)})})}function M(t){const{message:e,confirmText:r="확인",cancelText:s="쇼핑 계속"}=t;return new Promise(c=>{a({id:"cartCommonModal",content:`
                <p class="modal-text">
                    ${e}
                </p>
            `,actions:[{text:s,class:"btn-no",onClick:l=>{l(),c(!1)}},{text:r,class:"btn-yes",onClick:l=>{l(!1),c(!0)}}],onClose:()=>c(!1)})})}function y(){return new Promise(t=>{a({id:"loginSuccessModal",className:"",content:`
            <p class="modal-text">
                로그인 되었습니다.
            </p>
        `,actions:[{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!0)})})}function C(){return new Promise(t=>{a({id:"logoutModal",className:"",content:`
            <p class="modal-text">
                로그아웃 되었습니다.
            </p>
        `,actions:[{text:"확인",class:"btn-yes",onClick:e=>{e(!1),t(!0)}}],onClose:()=>t(!0)})})}function $(){return new Promise(t=>{a({id:"signupSuccessModal",className:"",content:`
                <p class="modal-text">
                    회원 가입이 완료되었습니다.
                </p>
            `,actions:[{text:"확인",class:"btn-yes",onClick:e=>{e(),t()}}]})})}export{$ as a,k as b,M as c,p as d,C as e,y as s};
