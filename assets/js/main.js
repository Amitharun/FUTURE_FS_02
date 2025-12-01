// ===== PRODUCTS DATA =====
const PRODUCTS = [
  { id: 'p1', title: 'Classic Sneakers', price: 1999, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
  { id: 'p2', title: 'Casual T-Shirt', price: 499, img: './assets/img/new7.jfif' },
  { id: 'p3', title: 'Leather Wallet', price: 799, img: './assets/img/new5.png' },
  { id: 'p4', title: 'Sport Watch', price: 2999, img: './assets/img/new4.png' },
  { id: 'p5', title: 'Denim Jacket', price: 2599, img: './assets/img/download.jfif' },
  { id: 'p6', title: 'Sunglasses', price: 699, img: './assets/img/new3.png' },
];

let filteredProducts = [...PRODUCTS];  // Copy of all products

function applyFilters() {
  const searchValue = document.getElementById("search-input").value.toLowerCase();
  const priceValue = document.getElementById("price-filter").value;

  filteredProducts = PRODUCTS.filter((p) => {
    // search filter
    const matchesSearch = p.title.toLowerCase().includes(searchValue);

    // price filter
    let matchesPrice = true;

    if (priceValue === "0-1000") matchesPrice = p.price < 1000;
    else if (priceValue === "1000-2000") matchesPrice = p.price >= 1000 && p.price < 2000;
    else if (priceValue === "2000-3000") matchesPrice = p.price >= 2000 && p.price < 3000;
    else if (priceValue === "3000+") matchesPrice = p.price >= 3000;

    return matchesSearch && matchesPrice;
  });

  renderProducts(); // update display
}


// ===== GET ELEMENTS =====
const el = (id) => document.getElementById(id);
const productsEl = el("products");
const cartBtn = el("cart-button");
const cartCountEl = el("cart-count");
const cartSidebar = el("cart");
const overlay = el("overlay");
const cartItemsEl = el("cart-items");
const cartTotalEl = el("cart-total");
const closeCartBtn = el("close-cart");
const clearCartBtn = el("clear-cart");
const checkoutBtn = el("checkout");

// ===== CART STORAGE =====
let cart = JSON.parse(localStorage.getItem("mini_cart_v1") || "[]");

// ===== PRICE FORMAT =====
function formatPrice(n) {
  return "₹" + n;
}

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem("mini_cart_v1", JSON.stringify(cart));
  renderCart();
}
document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("price-filter").addEventListener("change", applyFilters);


// ===== RENDER PRODUCTS =====
function renderProducts() {
  productsEl.innerHTML = "";
  for (const p of filteredProducts) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${p.title}"></div>
      <h4>${p.title}</h4>
      <p>${formatPrice(p.price)}</p>
      <div class="actions">
        <button class="btn ghost view-btn" data-id="${p.id}">View</button>
        <button class="btn primary" data-add="${p.id}">Add</button>
      </div>
    `;
    productsEl.appendChild(card);
  }
}

// ===== RENDER CART =====
function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;
  let qty = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p style="color:#666">Cart is empty.</p>';
  } else {
    for (const item of cart) {
      total += item.price * item.qty;
      qty += item.qty;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="item-info">
          <strong>${item.title}</strong>
          <div style="color:var(--muted);margin-top:6px">${formatPrice(item.price)}</div>

          <div class="qty-controls">
            <button class="dec" data-id="${item.id}">−</button>
            <span style="min-width:28px;text-align:center">${item.qty}</span>
            <button class="inc" data-id="${item.id}">+</button>
            <button class="remove" data-id="${item.id}" style="margin-left:8px;color:#b00;background:transparent;border:0;cursor:pointer">Remove</button>
          </div>
        </div>
      `;

      cartItemsEl.appendChild(div);
    }
  }

  cartTotalEl.textContent = formatPrice(total);
  cartCountEl.textContent = qty;
}

// ===== ADD TO CART =====
function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;

  const existing = cart.find((x) => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 });

  saveCart();
  openCart();
}

// ===== PRODUCT BUTTONS =====
productsEl.addEventListener("click", (e) => {
  // ADD BUTTON
  const add = e.target.closest("[data-add]");
  if (add) {
    addToCart(add.getAttribute("data-add"));
  }

  // VIEW BUTTON
  const view = e.target.closest(".view-btn");
  if (view) {
    const id = view.getAttribute("data-id");
    const product = PRODUCTS.find((p) => p.id === id);

    modalImg.src = product.img;
    imageModal.style.display = "block";
  }
});

// ===== CART BUTTONS =====
cartItemsEl.addEventListener("click", (e) => {
  const inc = e.target.closest(".inc");
  const dec = e.target.closest(".dec");
  const rem = e.target.closest(".remove");

  if (inc) {
    const id = inc.getAttribute("data-id");
    const it = cart.find((x) => x.id === id);
    if (it) {
      it.qty++;
      saveCart();
    }
  } else if (dec) {
    const id = dec.getAttribute("data-id");
    const it = cart.find((x) => x.id === id);
    if (it) {
      it.qty = Math.max(1, it.qty - 1);
      saveCart();
    }
  } else if (rem) {
    const id = rem.getAttribute("data-id");
    cart = cart.filter((x) => x.id !== id);
    saveCart();
  }
});

// ===== OPEN & CLOSE CART =====
cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  closeCart();
});

function openCart() {
  cartSidebar.classList.add("open");
  overlay.classList.add("show");
  renderCart();
}

function closeCart() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("show");
}

checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Cart empty! Add products first.");
    return;
  }

  // Ask the user for their name
  let userName = prompt("Please enter your name:");

  // If no name entered
  if (!userName || userName.trim() === "") {
    alert("Name is required to place the order.");
    return;
  }

  userName = userName.trim();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    const res = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: userName,
        items: cart,
        total: totalAmount
      })
    });

    if (!res.ok) {
      alert("Server error: Cannot place order. Please try again.");
      return;
    }

    const data = await res.json();
    const d = data.order.deliveryDays;

    alert(`Thanks for shopping, ${userName}!
Your order is confirmed.
It will be delivered in ${d} days.
Please pay in CASH when you receive your order.`);

    cart = [];
    saveCart();
    closeCart();

  } catch (error) {
    alert("Checkout failed: Is backend running?");
    console.error(error);
  }
});

// ===== INITIAL LOAD =====
renderProducts();
renderCart();
