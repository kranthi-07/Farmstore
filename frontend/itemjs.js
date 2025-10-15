async function updateCartCount() {
    try {
        const res = await fetch("http://localhost:5000/cart", {
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
    Orange: { price: 25, desc: "Juicy Fruit", image: "Assets/orange.png" },
    Lemon: { price: 25, desc: "Juicy Fruit", image: "Assets/lemon.png" },
    Mosambi: { price: 25, desc: "Juicy Fruit", image: "Assets/mosambi.png" },
    Mango: { price: 25, desc: "Juicy Fruit", image: "Assets/mango.png" },
    Banana: { price: 25, desc: "Juicy Fruit", image: "Assets/banana.png" },
    Papaya: { price: 25, desc: "Juicy Fruit", image: "Assets/papaya.png" },
    Guava: { price: 25, desc: "Juicy Fruit", image: "Assets/guava.png" },
    Strawberry: { price: 25, desc: "Juicy Fruit", image: "Assets/strawberry.png" },
    Coconut: { price: 25, desc: "Juicy Fruit", image: "Assets/coconut.png" },
    Jackfruit: { price: 25, desc: "Juicy Fruit", image: "Assets/jackfruit.png" },
    Watermelon: { price: 25, desc: "Juicy Fruit", image: "Assets/watermelon.png" },
    Muskmelon: { price: 25, desc: "Juicy Fruit", image: "Assets/muskmelon.png" },

    Spinach: { price: 25, desc: "Leafy Vegetable", image: "Assets/spinach.png" },
    Coriander: { price: 25, desc: "Leafy Vegetable", image: "Assets/coriander.png" },
    Carrot: { price: 25, desc: "Vegetable", image: "Assets/carrot.png" },
    Beetroot: { price: 25, desc: "Vegetable", image: "Assets/beetroot.png" },
    Tomato: { price: 25, desc: "Vegetable", image: "Assets/tomato.png" },
    Brinjal: { price: 25, desc: "Vegetable", image: "Assets/brinjal.png" },
    Ladysfinger: { price: 25, desc: "Vegetable", image: "Assets/ladysfinger.jpeg" },
    Potato: { price: 25, desc: "Vegetable", image: "Assets/potato.png" },
    Onion: { price: 25, desc: "Vegetable", image: "Assets/onion.png" },
    Garlic: { price: 25, desc: "Vegetable", image: "Assets/garlic.png" },
    


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












// document.querySelectorAll(".add").forEach(btn => {
//     btn.addEventListener("click", async () => {
//         const itemName = btn.getAttribute("data-item");
//         const img = btn.getAttribute("data-img");

//         const selected = btn.parentElement.querySelector("input[type='radio']:checked");
//         if (!selected) {
//             alert("Please select a quantity before adding!");
//             return;
//         }

//         const price = parseInt(selected.value);
//         const quantity = 1;
//         const detail = selected.getAttribute("data-qty");

//         try {
//             const res = await fetch("http://localhost:5000/cart/add", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 credentials: "include",
//                 body: JSON.stringify({
//                     name: itemName + " (" + detail + ")",
//                     price,
//                     quantity,
//                     image: img
//                 })
//             });

//             const data = await res.json();
//             if (data.success) {
//                 alert(itemName + " added to cart ✅");
//                 updateCartCount();
//             } else {
//                 alert("❌ " + data.message);
//             }
//         } catch (err) {
//             console.error("Error adding to cart:", err);
//         }
//     });
// });

// document.getElementById("goCart").addEventListener("click", () => {
//     window.location.href = "cart.html";
// });

// // load count on page load
// updateCartCount();


function goHome() {
    window.location.replace('index.html');
}