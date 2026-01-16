import{e as y,u as h,b as f}from"./api-DOepU4-1.js";import{H as k}from"./Header-j7jg3zTl.js";import{F as b}from"./Footer-DnPTH6_A.js";import{b as I,s as C}from"./Modal-C9nBlRzj.js";const E=document.getElementById("header");new k(E);const w=document.getElementById("footer");new b(w);let r=[];const o=document.getElementById("cart-list"),p=document.getElementById("empty-cart"),g=document.getElementById("cart-summary"),d=document.querySelector(".btn-order-all"),_=document.getElementById("total-price"),L=document.getElementById("shipping-fee"),S=document.getElementById("final-amount"),l=document.getElementById("selectAll");async function q(){if(!localStorage.getItem("token")){C(),window.location.href="/src/pages/login/index.html";return}try{const n=await f();console.log("data: ",n),n.count===0||!n.results?r=[]:(r=n.results.map(e=>({cart_id:e.id,product_id:e.product.id,seller:e.product.seller.store_name,name:e.product.name,price:e.product.price,shipping:e.product.shipping_fee,image:e.product.image,quantity:e.quantity,isChecked:!0})),console.log(r)),i()}catch(n){console.error("장바구니 로딩 실패:",n),(n.status===401||n.status===403)&&(alert("로그인 정보가 만료되었거나 접근 권한이 없습니다."),window.location.href="/src/pages/login/index.html")}}function i(){if(r.length===0){o.style.display="none",g.style.display="none",d.style.display="none",p.style.display="block";return}p.style.display="none",o.style.display="block",g.style.display="flex",d.style.display="block",o.innerHTML=r.map(t=>`
        <li class="cart-item" data-cart-id="${t.cart_id}" data-product-id="${t.product_id}">
            <input type="checkbox" class="checkbox" ${t.isChecked?"checked":""}>
            <img src="${t.image}" alt="${t.name}" class="product-img">
            <div class="product-info">
                <p class="seller-name">${t.seller}</p>
                <p class="product-name">${t.name}</p>
                <p class="product-price">${t.price.toLocaleString()}원</p>
                <p class="shipping-info">
                    ${t.shipping>0?`${t.shipping.toLocaleString()}원`:"무료배송"}
                </p>
            </div>
            <div class="quantity-ctrl">
                <button type="button" class="minus">-</button>
                <span>${t.quantity}</span>
                <button type="button" class="plus">+</button>
            </div>
            <div class="item-total">
                <p class="item-total-price">${(t.price*t.quantity).toLocaleString()}원</p>
                <button class="btn-order-single">주문하기</button>
            </div>
            <button class="btn-delete">
                <img src="/src/assets/images/icon-delete.svg" alt="삭제" />
            </button>
        </li>
    `).join(""),u(),r.length>0?l.checked=r.every(t=>t.isChecked):l.checked=!1}function u(){const t=r.filter(c=>c.isChecked),n=t.reduce((c,s)=>c+s.price*s.quantity,0),e=t.reduce((c,s)=>c+s.shipping,0);console.log(n,e),_.textContent=n.toLocaleString(),L.textContent=e.toLocaleString();const a=n+e;S.textContent=a.toLocaleString()}async function m(t,n){try{return await h(t,n)}catch(e){return alert("수량 변경에 실패했습니다."),console.error(e),null}}o.addEventListener("click",async t=>{const n=t.target.closest(".cart-item");if(!n)return;const e=parseInt(n.dataset.cartId),a=r.find(c=>c.cart_id===e);if(a){if(t.target.classList.contains("plus")){const c=a.quantity+1,s=await m(e,c);s&&(a.quantity=s.quantity,i())}else if(t.target.classList.contains("minus"))if(a.quantity>1){const c=a.quantity-1,s=await m(e,c);s&&(a.quantity=s.quantity,i())}else alert("최소 수량은 1개입니다.");else if(t.target.closest(".btn-delete")){if(await I())try{await y(e),r=r.filter(s=>s.cart_id!==e),i()}catch(s){console.error("삭제 실패:",s),alert("상품 삭제 처리에 실패했습니다.")}}else if(t.target.classList.contains("btn-order-single")){const c={order_kind:"cart_order",product_ids:[a.product_id]};localStorage.setItem("order_data",JSON.stringify(c)),window.location.href="/src/pages/payment/index.html"}}});o.addEventListener("change",t=>{if(t.target.classList.contains("checkbox")){const n=t.target.closest(".cart-item"),e=parseInt(n.dataset.cartId),a=r.find(c=>c.cart_id===e);if(a){a.isChecked=t.target.checked;const c=r.every(s=>s.isChecked);l.checked=c,u()}}});l.addEventListener("change",t=>{const n=t.target.checked;r.forEach(a=>{a.isChecked=n}),document.querySelectorAll(".cart-item .checkbox").forEach(a=>{a.checked=n}),u()});d.addEventListener("click",()=>{if(r.length===0){alert("장바구니에 담긴 상품이 없습니다.");return}const t=r.filter(e=>e.isChecked);if(t.length===0){alert("주문할 상품을 선택해주세요.");return}const n={order_kind:"cart_order",product_ids:t.map(e=>e.product_id)};localStorage.setItem("order_data",JSON.stringify(n)),window.location.href="/src/pages/payment/index.html"});q();
