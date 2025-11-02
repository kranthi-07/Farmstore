async function updateCartCount() {
    try {
        const res = await fetch("https://farmstore-1.onrender.com/cart", {
            method: "GET",
            credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
            document.querySelector(".count").textContent = data.cart.length;
        }
    } catch (err) {
        console.error("Cart count fetch failed:", err);
    }
}




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
const items = Object.keys(itemData);


function goToItem(name) {
    const data = itemData[name];
    if (!data) return alert("Item details not found!");
    const params = new URLSearchParams({
        name,
        price: `₹${data.price}`,
        desc: data.desc,
        image: data.image
    });
    window.location.href = `item.html?${params.toString()}`;
}




// Prevent navigation duplication on item pages
window.addEventListener("pageshow", (event) => {
  // If page is loaded from bfcache (Back-Forward Cache)
  if (event.persisted) {
    // Optional: hide loader if visible
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  }

  // Prevent re-navigation loop
  if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
    history.replaceState(null, null, window.location.href);
  }
});





function goHome() {
    window.location.replace('index.html');
}


document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");


  // ✅ Handle Back Button — go back to index.html cleanly
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();


      setTimeout(() => {
        // Use assign() so it goes back in history, not reload
        window.location.assign("index.html");
      }, 400);
    });
  }

  


});
