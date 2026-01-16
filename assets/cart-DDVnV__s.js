import{e as y,u as h,b as f}from"./api-DOepU4-1.js";import{H as k}from"./Header-j7jg3zTl.js";import{F as b}from"./Footer-DnPTH6_A.js";import{b as I,s as E}from"./Modal-C9nBlRzj.js";const C=document.getElementById("header");new k(C);const w=document.getElementById("footer");new b(w);let s=[];const o=document.getElementById("cart-list"),p=document.getElementById("empty-cart"),g=document.getElementById("cart-summary"),d=document.querySelector(".btn-order-all"),_=document.getElementById("total-price"),L=document.getElementById("shipping-fee"),x=document.getElementById("final-amount"),l=document.getElementById("selectAll");async function S(){if(!localStorage.getItem("token")){E(),window.location.href="/src/pages/login/index.html";return}try{const c=await f();console.log("data: ",c),c.count===0||!c.results?s=[]:(s=c.results.map(e=>({cart_id:e.id,product_id:e.product.id,seller:e.product.seller.store_name,name:e.product.name,price:e.product.price,shipping:e.product.shipping_fee,image:e.product.image,quantity:e.quantity,isChecked:!0})),console.log(s)),i()}catch(c){console.error("장바구니 로딩 실패:",c),(c.status===401||c.status===403)&&(alert("로그인 정보가 만료되었거나 접근 권한이 없습니다."),window.location.href="/src/pages/login/index.html")}}function i(){if(s.length===0){o.style.display="none",g.style.display="none",d.style.display="none",p.style.display="block";return}p.style.display="none",o.style.display="block",g.style.display="flex",d.style.display="block",o.innerHTML=s.map(t=>`
    <li class="cart-item" data-cart-id="${t.cart_id}" data-product-id="${t.product_id}">
        <input type="checkbox" class="checkbox" checked>
        
        <a href="/src/pages/product-detail/index.html?productId=${t.product_id}" class="product-img-link">
            <img src="${t.image}" alt="${t.name}" class="product-img">
        </a>
        
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
`).join(""),u(),s.length>0?l.checked=s.every(t=>t.isChecked):l.checked=!1}function u(){const t=s.filter(n=>n.isChecked),c=t.reduce((n,r)=>n+r.price*r.quantity,0),e=t.reduce((n,r)=>n+r.shipping,0);console.log(c,e),_.textContent=c.toLocaleString(),L.textContent=e.toLocaleString();const a=c+e;x.textContent=a.toLocaleString()}async function m(t,c){try{return await h(t,c)}catch(e){return alert("수량 변경에 실패했습니다."),console.error(e),null}}o.addEventListener("click",async t=>{const c=t.target.closest(".cart-item");if(!c)return;const e=parseInt(c.dataset.cartId),a=s.find(n=>n.cart_id===e);if(a){if(t.target.classList.contains("plus")){const n=a.quantity+1,r=await m(e,n);r&&(a.quantity=r.quantity,i())}else if(t.target.classList.contains("minus"))if(a.quantity>1){const n=a.quantity-1,r=await m(e,n);r&&(a.quantity=r.quantity,i())}else alert("최소 수량은 1개입니다.");else if(t.target.closest(".btn-delete")){if(await I())try{await y(e),s=s.filter(r=>r.cart_id!==e),i()}catch(r){console.error("삭제 실패:",r),alert("상품 삭제 처리에 실패했습니다.")}}else if(t.target.classList.contains("btn-order-single")){const n={order_kind:"cart_order",product_ids:[a.product_id]};localStorage.setItem("order_data",JSON.stringify(n)),window.location.href="/src/pages/payment/index.html"}}});o.addEventListener("change",t=>{if(t.target.classList.contains("checkbox")){const c=t.target.closest(".cart-item"),e=parseInt(c.dataset.cartId),a=s.find(n=>n.cart_id===e);if(a){a.isChecked=t.target.checked;const n=s.every(r=>r.isChecked);l.checked=n,u()}}});l.addEventListener("change",t=>{const c=t.target.checked;s.forEach(a=>{a.isChecked=c}),document.querySelectorAll(".cart-item .checkbox").forEach(a=>{a.checked=c}),u()});d.addEventListener("click",()=>{if(s.length===0){alert("장바구니에 담긴 상품이 없습니다.");return}const t=s.filter(e=>e.isChecked);if(t.length===0){alert("주문할 상품을 선택해주세요.");return}const c={order_kind:"cart_order",product_ids:t.map(e=>e.product_id)};localStorage.setItem("order_data",JSON.stringify(c)),window.location.href="/src/pages/payment/index.html"});S();
