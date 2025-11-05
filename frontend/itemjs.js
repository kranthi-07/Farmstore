const quantity = document.querySelector('.qty');
const quantity_1kg = document.querySelector('.1kg');
const quantity_500g = document.querySelector('.500g');




quantity_1kg.addEventListener("click",()=>{
  quantity_1kg.classList.add('click');
  quantity_500g.classList.remove('click');
});


quantity_1kg.addEventListener("click",()=>{
  quantity_1kg.classList.remove('click');
  quantity_500g.classList.add('click');
});

// --- CART COUNT FUNCTION ---
async function updateCartCount() {
  try {
    const res = await fetch("https://farmstore-1.onrender.com/cart", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      document.querySelector(".count").textContent = data.cart.length;
    }
  } catch (err) {
    console.error("Cart count fetch failed:", err);
  }
}







// --- ITEM DATA ---
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

// --- FULL SCREEN LOADER CONTROL ---
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 500);
  }
});

// --- CARD CLICK NAVIGATION ---
function goToItem(name) {
  const data = itemData[name];
  if (!data) return alert("Item details not found!");

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

  // Delay for smooth loader display
  setTimeout(() => {
    window.location.assign(`item.html?${params.toString()}`);
  }, 400);
}

// --- HANDLE BACK BUTTON ---
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

// --- FIX PAGE NAVIGATION ISSUES ---
window.addEventListener("pageshow", (event) => {
  const loader = document.getElementById("loader");

  // If coming back from cache, hide loader instantly
  if (event.persisted && loader) loader.style.display = "none";

  const navType = performance.getEntriesByType("navigation")[0]?.type;
  if (navType === "back_forward" && loader) loader.style.display = "none";
});
