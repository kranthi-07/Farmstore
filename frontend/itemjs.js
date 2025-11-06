/* ==============================
   ITEM PAGE (Apple-style UX)
============================== */

const BASE_URL = "https://farmstore-1.onrender.com";

/* ==============================
   QUANTITY SELECTOR
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const qty1kg = document.querySelector(".qty-1kg");
  const qty500g = document.querySelector(".qty-500g");

  if (qty1kg && qty500g) {
    qty1kg.addEventListener("click", () => {
      qty1kg.classList.add("click");
      qty500g.classList.remove("click");
    });

    qty500g.addEventListener("click", () => {
      qty500g.classList.add("click");
      qty1kg.classList.remove("click");
    });
  }

  // Initialize cart count
  updateCartCount();
  initAddToCartListeners();
});

/* ==============================
   TOAST (Apple-like)
============================== */
function showToast(message, type = "info") {
  // Remove existing toast if any
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();

  // Create toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 50);

  // Auto-hide after 2.5s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

/* ==============================
   CART COUNT
============================== */
async function updateCartCount() {
  try {
    const res = await fetch(`${BASE_URL}/cart`, { credentials: "include" });
    const data = await res.json();
    if (data.success) {
      document.querySelector(".total").textContent = data.cart.length;
    }
  } catch {
    console.warn("Cart count fetch failed");
  }
}

/* ==============================
   ITEM DATA
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
   ADD TO CART
============================== */
/* ==============================
   ADD TO CART (Fixed with Quantity)
============================== */
async function addToCart(itemName) {
  const loader = document.getElementById("loader");
  const item = itemData[itemName];
  if (!item) return showToast("Item not found ❌", "error");

  const qtySelected =
    document.querySelector(".qty-1kg.click") ||
    document.querySelector(".qty-500g.click");

  if (!qtySelected) {
    return showToast("Please select a quantity ⚠️", "warn");
  }

  // 👇 Quantity based on selection
  const quantity =
    qtySelected.classList.contains("qty-1kg") ? 1 : 0.5;

  if (loader) loader.style.display = "flex";

  try {
    // ✅ Check login session
    const sessionRes = await fetch(`${BASE_URL}/getUser`, {
      credentials: "include",
    });
    const session = await sessionRes.json();

    if (!session.loggedIn) {
      showToast("Please sign in to continue 🔒", "warn");
      setTimeout(() => (window.location.href = "signin.html"), 1800);
      return;
    }

    // ✅ Add to cart
    const res = await fetch(`${BASE_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: itemName,
        price: item.price,
        quantity,
        image: item.image,
      }),
    });

    const data = await res.json();
    if (data.success) {
      updateCartCount();
      showToast(`${itemName} (${quantity === 1 ? "1kg" : "500g"}) added 🛒`, "success");
    } else {
      showToast(data.message || "Failed to add ❌", "error");
    }
  } catch (err) {
    console.error("Add to cart error:", err);
    showToast("Something went wrong ❌", "error");
  } finally {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 300);
    }
  }
}

/* ==============================
   INIT ADD BUTTONS
============================== */
function initAddToCartListeners() {
  document.querySelectorAll(".add i").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = e.target.closest(".item");
      const name = parent?.querySelector("p")?.textContent.trim();
      if (name) addToCart(name);
    });
  });
}

/* ==============================
   PAGE LOADERS
============================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 400);
  }
});

/* ==============================
   GO TO ITEM DETAILS
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
   BACK BUTTON
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
