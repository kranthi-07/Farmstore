/* ==============================
   ITEM PAGE (Apple-style UX + Cart)
============================== */

const BASE_URL = "https://farmstore-1.onrender.com";

/* ==============================
   QUANTITY SELECTOR
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const qty1kg = document.querySelector(".qty-1kg");
  const qty500g = document.querySelector(".qty-500g");

  if (qty1kg && qty500g) {
    qty1kg.addEventListener("click", (e) => {
      e.stopPropagation();
      qty1kg.classList.add("click");
      qty500g.classList.remove("click");
    });

    qty500g.addEventListener("click", (e) => {
      e.stopPropagation();
      qty500g.classList.add("click");
      qty1kg.classList.remove("click");
    });
  }

  // init
  updateCartCount();
  initAddToCartListeners();
  initCartIconNavigation();
});

/* ==============================
   TOAST (Apple-like)
============================== */
function showToast(message, type = "info") {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50); // slide up

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

/* ==============================
   CART COUNT (header .total)
============================== */
async function updateCartCount() {
  try {
    const res = await fetch(`${BASE_URL}/cart`, { credentials: "include" });
    const data = await res.json();
    if (data.success) {
      const totalEl = document.querySelector(".total");
      if (totalEl) totalEl.textContent = data.cart.length;
    }
  } catch {
    // silent fail
  }
}

/* ==============================
   ITEM DATA (used for /cart/add)
============================== */
const itemData = {
  Orange: { price: 25, desc: "Juicy Fruit", image: "assets/orange.png" },
  Lemon: { price: 25, desc: "Juicy Fruit", image: "assets/lemon.png" },
  Mosambi: { price: 25, desc: "Juicy Fruit", image: "assets/mosambi.png" },
  Mango: { price: 25, desc: "Juicy Fruit", image: "assets/mango.png" },
  Banana: { price: 25, desc: "Juicy Fruit", image: "assets/banana.png" },
  Papaya: { price: 25, desc: "Juicy Fruit", image: "assets/papaya.png" },
  Guava: { price: 25, desc: "Juicy Fruit", image: "assets/guava.png" },
  Strawberry: { price: 25, desc: "Juicy Fruit", image: "assets/strawberry.png" },
  Coconut: { price: 25, desc: "Juicy Fruit", image: "assets/coconut.png" },
  Jackfruit: { price: 25, desc: "Juicy Fruit", image: "assets/jackfruit.png" },
  Watermelon: { price: 25, desc: "Juicy Fruit", image: "assets/watermelon.png" },
  Muskmelon: { price: 25, desc: "Juicy Fruit", image: "assets/muskmelon.png" },
  Spinach: { price: 25, desc: "Leafy Vegetable", image: "assets/spinach.png" },
  Coriander: { price: 25, desc: "Leafy Vegetable", image: "assets/coriander.png" },
  Carrot: { price: 25, desc: "Vegetable", image: "assets/carrot.png" },
  Beetroot: { price: 25, desc: "Vegetable", image: "assets/beetroot.png" },
  Tomato: { price: 25, desc: "Vegetable", image: "assets/tomato.png" },
  Brinjal: { price: 25, desc: "Vegetable", image: "assets/brinjal.png" },
  Ladysfinger: { price: 25, desc: "Vegetable", image: "assets/ladysfinger.jpeg" },
  Potato: { price: 25, desc: "Vegetable", image: "assets/potato.png" },
  Onion: { price: 25, desc: "Vegetable", image: "assets/onion.png" },
  Garlic: { price: 25, desc: "Vegetable", image: "assets/garlic.png" },
};

/* ==============================
   ADD TO CART (qty-aware)
============================== */
/* ==============================
   ADD TO CART (qty-aware + better errors)
============================== */
async function addToCart(itemName) {
  const loader = document.getElementById("loader");

  // 1) Validate item exists in your map
  const item = itemData[itemName];
  if (!item) {
    showToast(`Item not found: ${itemName} ❌`, "error");
    return;
  }

  // 2) Validate quantity selection
  const qtySelected =
    document.querySelector(".qty-1kg.click") ||
    document.querySelector(".qty-500g.click");

  if (!qtySelected) {
    showToast("Please select a quantity ⚠️", "warn");
    return;
  }

  const quantity = qtySelected.classList.contains("qty-1kg") ? 1 : 0.5;

  if (loader) loader.style.display = "flex";

  try {
    // 3) Must be logged in
    const sessionRes = await fetch(`${BASE_URL}/getUser`, { credentials: "include" });
    const session = await sessionRes.json();

    if (!session.loggedIn) {
      showToast("Please sign in to continue 🔒", "warn");
      setTimeout(() => (window.location.href = "signin.html"), 1200);
      return;
    }

    // 4) Send add-to-cart
    const res = await fetch(`${BASE_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: itemName,
        price: Number(item.price),
        quantity: Number(quantity),
        image: item.image,
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: "Non-JSON response" };
    }

    if (!res.ok || !data.success) {
      console.error("Add to cart failed:", { status: res.status, data });
      showToast(data.message || `Add failed (${res.status}) ❌`, "error");
      return;
    }

    // 5) Success
    updateCartCount();
    showToast(`${itemName} (${quantity === 1 ? "1kg" : "500g"}) added 🛒`, "success");
  } catch (err) {
    console.error("Add to cart error:", err);
    showToast("Network/server error ❌", "error");
  } finally {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 300);
    }
  }
}

/* ==============================
   BIND “+” ICONS (name-safe)
============================== */
function initAddToCartListeners() {
  // Bind to both the .add div and its inner <i>
  const addButtons = document.querySelectorAll(".add, .add i");
  addButtons.forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();

      // Find the *card root* (supports your Orange wrapper + simple .item cards)
      const cardRoot = e.target.closest(".orange, .item, .lemon, .mosambi");
      if (!cardRoot) {
        showToast("Could not locate item card ❌", "error");
        return;
      }

      // Always get the title from the **.item p** (not price/desc)
      // 1) Prefer `.item p` inside the card
      let nameEl = cardRoot.querySelector(".item p");
      // 2) Fallbacks if structure differs
      if (!nameEl) nameEl = cardRoot.querySelector("p.item-name, .name, .item-title");
      if (!nameEl) {
        // as last resort, pick the <p> inside `.item`, else first <p> that contains only letters
        const candidates = [...cardRoot.querySelectorAll("p")];
        nameEl = candidates.find(p => /^[A-Za-z][A-Za-z\s\(\)\.-]*$/.test(p.textContent.trim())) || candidates[0];
      }

      const rawName = nameEl?.textContent || "";
      const itemName = rawName.split("\n")[0].trim();

      if (!itemName) {
        showToast("Item name missing ❌", "error");
        return;
      }

      addToCart(itemName);
    });
  });
}
/* ==============================
   CART ICON → cart.html
============================== */
function initCartIconNavigation() {
  const cart = document.querySelector(".cart");
  if (!cart) return;
  cart.addEventListener("click", (e) => {
    e.preventDefault();
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
    setTimeout(() => (window.location.href = "cart.html"), 400);
  });
}

/* ==============================
   PAGE LOADER (on load)
============================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 400);
  }
});

/* ==============================
   GO TO ITEM DETAILS (keeps your behavior)
============================== */
function goToItem(name) {
  const data = itemData[name];
  if (!data) return showToast("Item details not found ❌", "error");

  const params = new URLSearchParams({
    name,
    price: `₹${data.price}`,
    desc: data.desc,
    image: data.image,
  });

  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "flex";
    loader.style.opacity = "1";
  }

  setTimeout(() => {
    window.location.assign(`item.html?${params.toString()}`);
  }, 400);
}

/* ==============================
   BACK BUTTON (if present)
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const loader = document.getElementById("loader");
      if (loader) loader.style.display = "flex";
      setTimeout(() => {
        window.location.assign("index.html");
      }, 400);
    });
  }
});

/* ==============================
   CACHE FIX
============================== */
window.addEventListener("pageshow", (event) => {
  const loader = document.getElementById("loader");
  if (event.persisted && loader) loader.style.display = "none";
});
 



function goHome() {
  window.location.href = "index.html";
}
