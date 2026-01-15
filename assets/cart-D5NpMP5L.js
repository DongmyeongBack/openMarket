import"./common-D2-4OkSc.js";import{H as m,F as g,b as f,s as h}from"./Footer-DoNwG6sW.js";import{r as d}from"./api-DvCEykNh.js";const b=document.getElementById("header");new m(b);const w=document.getElementById("footer");new g(w);let o=[];const c=document.getElementById("cart-list"),u=document.getElementById("empty-cart"),p=document.getElementById("cart-summary"),l=document.querySelector(".btn-order-all"),E=document.getElementById("total-price"),q=document.getElementById("final-amount");async function _(){if(!localStorage.getItem("token")){h(),window.location.href="/src/pages/login/index.html";return}try{const n=await d("/cart/");console.log("data: ",n),n.count===0||!n.results?o=[]:(console.log(o),o=n.results.map(e=>({cart_id:e.id,product_id:e.product.product_id,seller:e.product.seller.store_name,name:e.product.name,price:e.product.price,shipping:e.product.shipping_fee,image:e.product.image,quantity:e.quantity}))),i()}catch(n){console.error("장바구니 로딩 실패:",n),(n.status===401||n.status===403)&&(alert("로그인 정보가 만료되었거나 접근 권한이 없습니다."),window.location.href="/src/pages/login/index.html")}}function i(){if(o.length===0){c.style.display="none",p.style.display="none",l.style.display="none",u.style.display="block";return}u.style.display="none",c.style.display="block",p.style.display="block",l.style.display="block",c.innerHTML=o.map(t=>`
        <li class="cart-item" data-cart-id="${t.cart_id}" data-product-id="${t.product_id}">
            <input type="checkbox" class="checkbox" checked>
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
            <button class="btn-delete">x</button>
        </li>
    `).join(""),I()}function I(){const t=o.reduce((a,r)=>a+r.price*r.quantity,0),n=o.reduce((a,r)=>a+r.shipping,0);E.textContent=t.toLocaleString();const e=t+n;q.textContent=e.toLocaleString()}async function y(t,n){try{return await d(`/cart/${t}/`,{method:"PUT",body:JSON.stringify({quantity:n})})}catch(e){return alert("수량 변경에 실패했습니다."),console.error(e),null}}c.addEventListener("click",async t=>{const n=t.target.closest(".cart-item");if(!n)return;const e=parseInt(n.dataset.cartId),a=o.find(r=>r.cart_id===e);if(a)if(t.target.classList.contains("plus")){const r=a.quantity+1,s=await y(e,r);s&&(a.quantity=s.quantity,i())}else if(t.target.classList.contains("minus"))if(a.quantity>1){const r=a.quantity-1,s=await y(e,r);s&&(a.quantity=s.quantity,i())}else alert("최소 수량은 1개입니다.");else if(t.target.classList.contains("btn-delete")){if(await f())try{await d(`/cart/${e}/`,{method:"DELETE"}),o=o.filter(s=>s.cart_id!==e),i()}catch(s){console.error("삭제 실패:",s),alert("상품 삭제 처리에 실패했습니다.")}}else t.target.classList.contains("btn-order-single")&&(window.location.href=`/src/pages/payment/index.html?order_kind=cart_one_order&cart_id=${a.cart_id}`)});l.addEventListener("click",()=>{if(o.length===0){alert("장바구니에 담긴 상품이 없습니다.");return}window.location.href="/src/pages/payment/index.html?order_kind=cart_order"});_();
