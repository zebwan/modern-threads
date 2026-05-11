/* ===== Products ===== */
const products = [
  { name: "Men’s Black Slim-Fit Blazer", price: "RM399", img: "images/mens_black_slimfit_blazer.png" },
  { name: "Men’s White Oxford Shirt", price: "RM149", img: "images/mens_white_oxford_shirt.png" },
  { name: "Men’s Grey Wool Trousers", price: "RM229", img: "images/mens_grey_wool_trousers.png" },
  { name: "Men’s Navy Crewneck", price: "RM109", img: "images/mens_navy_crewneck.png" },
  { name: "Men’s Black Bomber Jacket", price: "RM259", img: "images/mens_black_bomber.png" },
  { name: "Women’s Black Tailored Blazer", price: "RM389", img: "images/womens_black_tailored_blazer.png" },
  { name: "Women’s White Silk Blouse", price: "RM199", img: "images/womens_white_silk_blouse.png" },
  { name: "Women’s Beige Wide-Leg Pants", price: "RM229", img: "images/womens_beige_wideleg_pants.png" },
  { name: "Women’s Black Midi Dress", price: "RM279", img: "images/womens_black_midi_dress.png" },
  { name: "Women’s Grey Wool Skirt", price: "RM199", img: "images/womens_grey_wool_skirt.png" },
  { name: "Men’s Beige Trench Coat", price: "RM349", img: "images/mens_beige_trenchcoat.png" },
  { name: "Men’s Black Leather Jacket", price: "RM499", img: "images/mens_black_leather_jacket.png" },
  { name: "Women’s Navy Wrap Dress", price: "RM289", img: "images/womens_navy_wrap_dress.png" },
  { name: "Women’s Black Turtleneck", price: "RM129", img: "images/womens_black_turtleneck.png" },
  { name: "Women’s Beige Long Coat", price: "RM359", img: "images/womens_beige_longcoat.png" },
];

let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem("cart");
    const parsed = raw ? JSON.parse(raw) : [];
    updateCartBadge(parsed);
    return parsed;
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

const money = (str) => Number(String(str).replace(/[^0-9.]/g, "")) || 0;
const fmt = (n) => `RM ${n.toFixed(2)}`;

function updateCartBadge(current = cart) {
  const count = current.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = String(count);
}

function addToCart(name) {
  const product = products.find((p) => p.name === name);
  if (!product) return;

  const existing = cart.find((c) => c.name === name);
  if (existing) existing.qty += 1;
  else cart.push({ name, price: product.price, qty: 1 });

  saveCart();
  updateCartBadge();
}

function changeQty(name, delta) {
  const item = cart.find((c) => c.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((c) => c.name !== name);
  saveCart();
  renderCart();
  updateCartBadge();
}

function removeItem(name) {
  cart = cart.filter((c) => c.name !== name);
  saveCart();
  renderCart();
  updateCartBadge();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!list || !totalEl) return;

  list.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    const empty = document.createElement("li");
    empty.textContent = "Your cart is empty.";
    list.appendChild(empty);
    totalEl.textContent = "";
    return;
  }

  cart.forEach((item) => {
    const matched = products.find((p) => p.name === item.name) || {};
    const unit = money(matched.price ?? item.price);
    total += unit * item.qty;

    const li = document.createElement("li");
    li.className = "cart-row";
    li.innerHTML = `
      <img class="thumb" src="${matched.img || ""}" alt="${item.name}">
      <div class="cart-info">
        <div class="cart-name">${item.name}</div>
        <div class="cart-qty">
          <button class="qty-btn" data-action="dec" data-name="${item.name}" aria-label="Decrease">−</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-name="${item.name}" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-right">
        <span class="cart-price">${fmt(unit)}</span>
        <button class="remove-btn" data-action="remove" data-name="${item.name}" aria-label="Remove">✕</button>
      </div>
    `;
    list.appendChild(li);
  });

  totalEl.textContent = `Total: ${fmt(total)}`;
}

function showCart() {
  renderCart();
  document.getElementById("cart-modal")?.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeIfBackdrop(e) {
  if (e.target.id === "cart-modal") closeModal();
}

function closeModal() {
  document.getElementById("cart-modal")?.classList.add("hidden");
  document.body.style.overflow = "";
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCart();
  closeModal();
}

function goToCheckout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }
  alert("Order placed");
  clearCart();
}

function openSignup() {
  const m = document.getElementById("signup-modal");
  if (!m) return;
  m.classList.remove("hidden");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeSignup() {
  const m = document.getElementById("signup-modal");
  if (!m) return;
  m.classList.add("hidden");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.addEventListener("click", (e) => {
    if (!e.target.closest("a")) return;
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });
}

document.addEventListener("click", (e) => {
  const cartButton = e.target.closest(".qty-btn, .remove-btn");
  if (cartButton) {
    const action = cartButton.dataset.action;
    const name = cartButton.dataset.name;
    if (action === "inc") changeQty(name, +1);
    if (action === "dec") changeQty(name, -1);
    if (action === "remove") removeItem(name);
    return;
  }

  const signup = document.getElementById("signup-modal");
  if (signup && !signup.classList.contains("hidden") && e.target === signup) {
    closeSignup();
    return;
  }

  const card = e.target.closest(".card[data-name]");
  if (card) addToCart(card.dataset.name);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!document.getElementById("cart-modal")?.classList.contains("hidden")) closeModal();
  if (!document.getElementById("signup-modal")?.classList.contains("hidden")) closeSignup();
  document.body.classList.remove("nav-open");
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  setupMobileNav();
  openSignup();
});
