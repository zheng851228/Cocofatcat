/* =========================================
   COCOFATCAT | 全站共用功能庫 (main.js)
   包含：UI 模組、購物車、AI助理、深色模式、Firebase 雲端引擎
   ========================================= */

const IMG_CONFIG = {
    logo: "https://i.postimg.cc/rpWnBvdd/IMG-9051.png",
    heroBanner: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=80"
};

// 🌗 初始化深色模式
function initTheme() {
    const savedTheme = localStorage.getItem('ccfc_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme;
}

document.addEventListener("DOMContentLoaded", () => {
    const currentTheme = initTheme();
    const isCheckout = window.location.pathname.includes('checkout.html');

    // =========================================
    // 1. 動態注入全站共用 UI (導覽列、購物車、頁腳、AI)
    // =========================================
    const headerHTML = `
        <div class="announcement-bar"><div class="announcement-text">COCO好可愛 🐾 COCO好可愛 🐾 COCO好可愛 🐾 COCO好可愛 🐾</div></div>
        <header>
            <div class="nav-left"><div class="dropdown"><button class="dropbtn">選單</button><div class="dropdown-content"><a href="index.html">首頁</a><a href="pet.html">寵物專區</a><a href="about.html">品牌故事</a><a href="tools.html">使用工具</a></div></div></div>
            <div class="nav-center"><div class="logo" onclick="window.location.href='index.html'"><img id="site-logo" src="${IMG_CONFIG.logo}"></div></div>
            <div class="nav-right">
                <div onclick="toggleTheme()" id="theme-icon" style="cursor:pointer; font-size:16px; margin-right:20px;" title="切換深色/淺色模式">${currentTheme === 'dark' ? '☀️' : '🌙'}</div>
                ${isCheckout ? `<div style="font-weight:bold; font-size:12px; letter-spacing:1px; color:#888;">安全結帳</div>` : `<div onclick="openCartSidebar()" style="cursor:pointer; font-weight:bold; font-size:12px; letter-spacing:1px;">購物車 (<span id="cart-count">0</span>)</div>`}
            </div>
        </header>
    `;

    const cartHTML = isCheckout ? '' : `
        <div class="cart-overlay" id="cartOverlay" onclick="closeCartSidebar()"></div>
        <div class="cart-sidebar" id="cartSidebar">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 30px; border-bottom: 2px solid var(--accent-color); padding-bottom: 15px;">
                <h2 style="font-size:16px; font-weight:bold; letter-spacing:4px; margin:0;">您的購物車</h2>
                <span style="cursor:pointer; font-size:24px;" onclick="closeCartSidebar()">&times;</span>
            </div>
            <div id="cartItemsContainer" style="flex:1; overflow-y:auto; overflow-x:hidden;"></div>
            <div style="border-top:1px solid #eee; padding-top:20px;"><div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:20px;"><span>總計</span><span id="cart-total-price">NT$ 0</span></div><button class="btn btn-primary" onclick="window.location.href='checkout.html'">前往結帳</button></div>
        </div>
    `;

    const footerHTML = `
        <footer>
            <div class="footer-links" style="align-items: center;">
                <a href="https://www.instagram.com/ccfc0101?igsh=MXI2eWp4c2NuczI4cA==" target="_blank" class="social-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="contact.html">CONTACT US</a>
                <a href="about.html">ABOUT COCO</a>
            </div>
            <div class="copyright">&copy; 2026 COCOFATCAT. ALL RIGHTS RESERVED.</div>
        </footer>
    `;

    const lightboxHTML = `<div class="lightbox" id="siteLightbox" onclick="closeLightbox()"><span class="lightbox-close">&times;</span><img id="lightboxImg" src=""></div>`;

    const aiHTML = `
        <div class="ai-chat-btn" onclick="toggleAIChat()"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.8 1.5 5.28 3.8 6.84l-1.3 3.9a.75.75 0 0 0 .94.94l4.18-1.39A11.3 11.3 0 0 0 12 19.5c5.52 0 10-3.92 10-8.75S17.52 2 12 2zm0 16c-1.33 0-2.6-.22-3.77-.61a.75.75 0 0 0-.64.08l-2.43.81.75-2.26a.75.75 0 0 0-.17-.74C3.89 14.07 3.5 12.47 3.5 10.75 3.5 6.75 7.31 3.5 12 3.5s8.5 3.25 8.5 7.25-3.81 7.25-8.5 7.25zm-2.5-5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg></div>
        <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header"><span>COCO 智能助理 🐾</span><span class="ai-chat-close" onclick="toggleAIChat()">&times;</span></div>
            <div class="ai-chat-body" id="aiChatBody"><div class="ai-msg bot">您好！我是 COCO 智能助理。想挑選適合的尺寸或有其他問題嗎？隨時問我！</div></div>
            <div class="ai-chat-input-area"><input type="text" id="aiChatInput" placeholder="輸入問題，例如：尺寸..." onkeypress="handleAIKeyPress(event)"><button class="ai-chat-send" onclick="sendAIMessage()">傳送</button></div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML); 
    document.body.insertAdjacentHTML('beforeend', cartHTML);    
    document.body.insertAdjacentHTML('beforeend', footerHTML);  
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    document.body.insertAdjacentHTML('beforeend', aiHTML);

    updateCartUI();

    // =========================================
    // 2. FIREBASE 雲端資料庫連線與動態渲染
    // =========================================
    if (typeof firebase !== 'undefined') {
        const firebaseConfig = {
            apiKey: "AIzaSyBE1UOaHrC6_QxMQF5k5Z23wrkaLfYE-bc",
            authDomain: "cocofatcat.firebaseapp.com",
            projectId: "cocofatcat",
            storageBucket: "cocofatcat.firebasestorage.app",
            messagingSenderId: "774419273473",
            appId: "1:774419273473:web:161ff8302b82d974de2d00"
        };
        
        if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
        const db = firebase.firestore();

        // 🏠 首頁列表渲染
        const productList = document.getElementById('cloud-product-list');
        if (productList) {
            db.collection("products").get().then((querySnapshot) => {
                let html = '';
                querySnapshot.forEach((doc) => {
                    const p = doc.data();
                    html += `
                        <a href="product.html?id=${doc.id}" style="text-decoration:none; color:inherit;">
                            <div class="product-image-wrapper" style="overflow:hidden; background:#f9f9f9; aspect-ratio:1/1;">
                                <img src="${p.image}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
                            </div>
                            <p style="font-weight:bold; margin:20px 0 5px 0;">${p.name}</p>
                            <p style="color:var(--text-muted);">NT$ ${p.price}</p>
                        </a>
                    `;
                });
                productList.innerHTML = html !== '' ? html : '<p style="text-align:center; width:100%;">老闆還在努力上架中喔！🐾</p>';
            }).catch(err => console.error("雲端讀取失敗:", err));
        }

        // 🛍️ 商品內頁渲染 (整合顏色與縮圖)
        const isProductPage = document.getElementById('cloud-product-name');
        if (isProductPage) {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');

            if (productId) {
                db.collection("products").doc(productId).get().then((doc) => {
                    if (doc.exists) {
                        const p = doc.data();
                        
                        document.getElementById('cloud-product-name').innerText = p.name;
                        document.getElementById('cloud-product-price').innerText = `NT$ ${p.price}`;
                        document.getElementById('main-image').src = p.image;

                        // ✨ 動態顏色渲染
                        const colorGroup = document.getElementById('color-group');
                        const colorLabel = document.getElementById('dynamic-color-label');
                        const colorInput = document.getElementById('c1');
                        
                        if (p.colors) {
                            colorLabel.innerText = p.colors;
                            colorInput.value = p.colors;
                            colorGroup.style.display = 'block';
                        } else {
                            colorGroup.style.display = 'none'; // 無顏色則隱藏
                        }
                        
                        // ✨ 動態縮圖渲染
                        const thumbContainer = document.getElementById('thumb-container');
                        if (thumbContainer && p.thumbnails && Array.isArray(p.thumbnails)) {
                            thumbContainer.innerHTML = ''; 
                            p.thumbnails.forEach(url => {
                                const img = document.createElement('img');
                                img.src = url;
                                img.loading = "lazy";
                                img.onclick = () => document.getElementById('main-image').src = url; 
                                thumbContainer.appendChild(img);
                            });
                        }

                        // 加入購物車 (✨ 抓取正確的顏色與 ID)
                        const addBtn = document.getElementById('add-to-cart-btn');
                        if (addBtn) {
                            addBtn.onclick = (e) => {
                                const versionInput = document.querySelector('input[name="version"]:checked');
                                const sizeInput = document.querySelector('input[name="size"]:checked');
                                const colorInputChecked = document.querySelector('input[name="color"]:checked');
                                
                                const version = versionInput ? versionInput.value : '常規版';
                                const size = sizeInput ? sizeInput.value : '單一尺寸';
                                const color = colorInputChecked ? colorInputChecked.value : (p.colors || '單一顏色');
                                
                                // 將 ID 一併存入，方便結帳頁判斷
                                addToCart(p.name, version, color, size, p.price);
                                createPawPrint(e);
                            };
                        }
                    } else {
                        isProductPage.innerText = "找不到這件商品喔 🐾";
                    }
                }).catch(err => console.error("商品讀取失敗:", err));
            } else {
                isProductPage.innerText = "請從首頁選擇商品 🐾";
            }
        }
    }
});

// =========================================
// 功能函數區
// =========================================

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ccfc_theme', newTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.innerText = newTheme === 'dark' ? '☀️' : '🌙';
    showToast(`✨ 已切換至${newTheme === 'dark' ? '深色' : '淺色'}模式`);
}

function toggleAIChat() { document.getElementById('aiChatWindow').classList.toggle('show'); }
function handleAIKeyPress(e) { if (e.key === 'Enter') sendAIMessage(); }
function sendAIMessage() {
    const inputField = document.getElementById('aiChatInput');
    const message = inputField.value.trim();
    if (!message) return;
    const chatBody = document.getElementById('aiChatBody');
    chatBody.innerHTML += `<div class="ai-msg user">${message}</div>`;
    inputField.value = ''; chatBody.scrollTop = chatBody.scrollHeight;
    setTimeout(() => {
        let aiResponse = "好問題！我還在學習中，您可以填寫「聯絡我們」表單，薯條弟會親自為您解答！🐾";
        if (message.includes("尺寸") || message.includes("多大") || message.includes("穿")) {
            aiResponse = "您可以點擊商品頁的「不知道穿什麼尺寸？」，輸入身高體重，我馬上幫您精準推薦！";
        } else if (message.includes("運費")) {
            aiResponse = "目前全館歡慶上線，全面免運費喔！";
        } else if (message.includes("coco") || message.includes("貓")) {
            aiResponse = "COCO 是一隻超療癒的胖貓！她一拐一拐的步伐，是我們最完美的品牌靈感。🙂‍↕️";
        }
        chatBody.innerHTML += `<div class="ai-msg bot">${aiResponse}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
}

function showToast(message) { let toast = document.getElementById('toast-msg'); if (!toast) { toast = document.createElement('div'); toast.id = 'toast-msg'; toast.className = 'toast'; document.body.appendChild(toast); } toast.innerText = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
function openLightbox(src) { document.getElementById('lightboxImg').src = src; document.getElementById('siteLightbox').classList.add('show'); }
function closeLightbox() { document.getElementById('siteLightbox').classList.remove('show'); }

let cart = JSON.parse(localStorage.getItem('ccfc_cart')) || [];
let touchStartX = 0; 
function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count'); if(badge) badge.innerText = count;
    const container = document.getElementById('cartItemsContainer'); if(!container) return;
    if (cart.length === 0) { container.innerHTML = '<p style="color:var(--text-muted); text-align:center; margin-top:50px;">購物車是空的 🐾</p>';
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item-wrapper"><div class="cart-item-delete-bg" onclick="removeFromCart(${index})">刪除</div><div class="cart-item-content" ontouchstart="handleTouchStart(event)" ontouchend="handleTouchEnd(event, this)">
            <div style="padding-left:10px;"><b style="font-size:13px;">${item.name}</b><br><span style="font-size:11px; color:var(--text-muted);">${item.version} / ${item.color} / ${item.size}</span></div>
            <div style="padding-right:10px; text-align:right;"><span style="font-size:13px; font-weight:bold;">NT$ ${item.price}</span><div style="font-size:10px; color:var(--text-muted); margin-top:5px;">x ${item.quantity}</div></div></div></div>
        `).join('');
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDisplay = document.getElementById('cart-total-price'); if(totalDisplay) totalDisplay.innerText = `NT$ ${total}`;
}
function handleTouchStart(e) { touchStartX = e.touches[0].clientX; }
function handleTouchEnd(e, element) { let touchEndX = e.changedTouches[0].clientX; let diff = touchStartX - touchEndX; if (diff > 50) element.classList.add('swiped'); else if (diff < -30) element.classList.remove('swiped'); }
function removeFromCart(index) { cart.splice(index, 1); localStorage.setItem('ccfc_cart', JSON.stringify(cart)); updateCartUI(); }
function addToCart(name, version, color, size, price) { cart.push({ name, version, color, size, price, quantity: 1 }); localStorage.setItem('ccfc_cart', JSON.stringify(cart)); updateCartUI(); showToast("✨ 已成功加入購物車"); openCartSidebar(); }
function openCartSidebar() { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('cartOverlay').style.display='block'; }
function closeCartSidebar() { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('cartOverlay').style.display='none'; }
function createPawPrint(e) { const paw = document.createElement('div'); paw.className = 'paw-print'; paw.innerHTML = '🐾'; paw.style.left = e.clientX + 'px'; paw.style.top = e.clientY + 'px'; document.body.appendChild(paw); setTimeout(() => paw.remove(), 1000); }
function toggleAccordion(el) { el.classList.toggle('active'); }
