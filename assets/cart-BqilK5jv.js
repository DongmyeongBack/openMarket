import{f as h,u as y,d as f}from"./api-BjdzUVpJ.js";import{H as k}from"./Header-0SbyIrEK.js";import{F as I}from"./Footer-DnPTH6_A.js";import{d as w,b as C}from"./Modal-paOObtiz.js";const b="data:image/svg+xml,%3csvg%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.14258%2018.2842L18.2847%204.14204'%20stroke='%23C4C4C4'%20stroke-width='2'/%3e%3cpath%20d='M18.1426%2018.1421L4.00044%203.99996'%20stroke='%23C4C4C4'%20stroke-width='2'/%3e%3c/svg%3e",E=document.getElementById("header");new k(E);const _=document.getElementById("footer");new I(_);let r=[];const s=document.getElementById("cart-list"),u=document.getElementById("empty-cart"),g=document.getElementById("cart-summary"),d=document.querySelector(".btn-order-all"),x=document.getElementById("total-price"),L=document.getElementById("shipping-fee"),$=document.getElementById("final-amount"),l=document.getElementById("selectAll");async function v(){if(!localStorage.getItem("token")){C(),window.location.href="/openMarket/src/pages/login/index.html";return}try{const n=await f();console.log("data: ",n),n.count===0||!n.results?r=[]:(r=n.results.map(e=>({cart_id:e.id,product_id:e.product.id,seller:e.product.seller.store_name,name:e.product.name,price:e.product.price,shipping:e.product.shipping_fee,image:e.product.image,quantity:e.quantity,isChecked:!0})),console.log(r)),i()}catch(n){console.error("장바구니 로딩 실패:",n),(n.status===401||n.status===403)&&(alert("로그인 정보가 만료되었거나 접근 권한이 없습니다."),window.location.href="/openMarket/src/pages/login/index.html")}}function i(){if(r.length===0){s.style.display="none",g.style.display="none",d.style.display="none",u.style.display="block";return}u.style.display="none",s.style.display="block",g.style.display="flex",d.style.display="block",s.innerHTML=r.map(t=>`
    <li class="cart-item" data-cart-id="${t.cart_id}" data-product-id="${t.product_id}">
        <input type="checkbox" class="checkbox" checked>
        
        <a href="/openMarket/src/pages/product-detail/index.html?productId=${t.product_id}" class="product-img-link">
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
            <img src="${b}" alt="삭제" />
        </button>
    </li>
`).join(""),p(),r.length>0?l.checked=r.every(t=>t.isChecked):l.checked=!1}function p(){const t=r.filter(a=>a.isChecked),n=t.reduce((a,o)=>a+o.price*o.quantity,0),e=t.reduce((a,o)=>a+o.shipping,0);console.log(n,e),x.textContent=n.toLocaleString(),L.textContent=e.toLocaleString();const c=n+e;$.textContent=c.toLocaleString()}async function m(t,n){try{return await y(t,n)}catch(e){return alert("수량 변경에 실패했습니다."),console.error(e),null}}s.addEventListener("click",async t=>{const n=t.target.closest(".cart-item");if(!n)return;const e=parseInt(n.dataset.cartId),c=r.find(a=>a.cart_id===e);if(c){if(t.target.classList.contains("plus")){const a=c.quantity+1,o=await m(e,a);o&&(c.quantity=o.quantity,i())}else if(t.target.classList.contains("minus"))if(c.quantity>1){const a=c.quantity-1,o=await m(e,a);o&&(c.quantity=o.quantity,i())}else alert("최소 수량은 1개입니다.");else if(t.target.closest(".btn-delete")){if(await w())try{await h(e),r=r.filter(o=>o.cart_id!==e),i()}catch(o){console.error("삭제 실패:",o),alert("상품 삭제 처리에 실패했습니다.")}}else if(t.target.classList.contains("btn-order-single")){const a={order_kind:"cart_order",product_ids:[c.product_id]};localStorage.setItem("order_data",JSON.stringify(a)),window.location.href="/openMarket/src/pages/payment/index.html"}}});s.addEventListener("change",t=>{if(t.target.classList.contains("checkbox")){const n=t.target.closest(".cart-item"),e=parseInt(n.dataset.cartId),c=r.find(a=>a.cart_id===e);if(c){c.isChecked=t.target.checked;const a=r.every(o=>o.isChecked);l.checked=a,p()}}});l.addEventListener("change",t=>{const n=t.target.checked;r.forEach(c=>{c.isChecked=n}),document.querySelectorAll(".cart-item .checkbox").forEach(c=>{c.checked=n}),p()});d.addEventListener("click",()=>{if(r.length===0){alert("장바구니에 담긴 상품이 없습니다.");return}const t=r.filter(e=>e.isChecked);if(t.length===0){alert("주문할 상품을 선택해주세요.");return}const n={order_kind:"cart_order",product_ids:t.map(e=>e.product_id)};localStorage.setItem("order_data",JSON.stringify(n)),window.location.href="/openMarket/src/pages/payment/index.html"});v();
