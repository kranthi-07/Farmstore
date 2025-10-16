
  const body = document.querySelector('body');
  const menu = body.querySelector('.menu');
  const sidebar = document.getElementById("sidebar"); // use id
  const overlay = document.getElementById("sidebarOverlay");
  const sidebarContent = document.getElementById("sidebarContent");
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  const fruits = body.querySelector('.fruits');
  const vegetables = body.querySelector('.vegetables');
  const fruits_bar = body.querySelector('.fruits-bar');
  const vegetables_bar = body.querySelector('.vegetables-bar');
  const mainContent = body.querySelector('.main-content');
  const mainItems = body.querySelector('.main-items');

  // Now you can safely use sidebar, overlay, fruits, vegetables, etc.


let startX = 0;
let currentX = 0;
let touchingSidebar = false;




// __________________________________________SIDEBAR______________________________________________



// Toggle sidebar
function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("on");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("on");
  sidebarContent.classList.remove("active");
}

// Close when clicking overlay
overlay.addEventListener("click", closeSidebar);


function addDragClose(el) {
  let startX = 0;
  el.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  el.addEventListener("touchmove", e => {
    let delta = e.touches[0].clientX - startX;
    if (delta < -70) closeAllViews();
  });
}

addDragClose(sidebar);


function closeAllViews() {
  sidebar.classList.remove("open");
  overlay.classList.remove("on");

}



//___________________________________________ SWIPER SLIDES _____________________________________



const swiper = new Swiper(".mySwiper", {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});





// ___________________________________________LOADER_______________________________________________

const loader = document.getElementById("loader");




// ✅ Loader functions
function showLoader() {
  loader.style.display = "flex";
}

function hideLoader() {
  loader.style.display = "none";
}

// ✅ Switch tab with loader
function switchTab(section) {
  showLoader();

  setTimeout(() => {
    if (section === "fruits") {
      fruits_bar.style.display = "flex";
      vegetables_bar.style.display = "none";
      fruits.classList.add("active");
      vegetables.classList.remove("active");
    } else {
      vegetables_bar.style.display = "flex";
      fruits_bar.style.display = "none";
      vegetables.classList.add("active");
      fruits.classList.remove("active");
    }
    hideLoader();
  }, 1000); // simulate loading delay
}

// ✅ Initial load
window.addEventListener("load", () => {
  setTimeout(() => {
    switchTab("fruits"); // default
    hideLoader();
  }, 800);
});

// ✅ Tab events (ONLY call switchTab, not old code)
fruits.addEventListener("click", () => switchTab("fruits"));
vegetables.addEventListener("click", () => switchTab("vegetables"));



// ______________________________________________MAIN________________________________________________




fruits.addEventListener("click", () => {
  fruits.classList.add('active');
  vegetables.classList.remove('active');
  if (mainContent.classList.contains('color')) {
    mainContent.classList.remove('color');
    mainItems.classList.remove('color');
  }
})

vegetables.addEventListener("click", () => {
  vegetables.classList.add('active');
  fruits.classList.remove('active');
  mainContent.classList.add('color');
  mainItems.classList.add('color');

})


fruits.addEventListener("click", () => {
  fruits_bar.classList.remove('display');
  vegetables_bar.classList.add('display');
});


vegetables.addEventListener("click", () => {
  fruits_bar.classList.add('display');
  vegetables_bar.classList.remove('display');
});



const fruitsTab = document.querySelector(".fruits");
const vegetablesTab = document.querySelector(".vegetables");
const fruitsBar = document.querySelector(".fruits-bar");
const vegetablesBar = document.querySelector(".vegetables-bar");

function setActiveSection(section) {
  if (section === "fruits") {
    fruitsBar.style.display = "flex";
    vegetablesBar.style.display = "none";
    fruitsTab.classList.add("active");
    vegetablesTab.classList.remove("active");

    mainContent.classList.remove('color');
    mainItems.classList.remove('color');

    // Save section + color state
    sessionStorage.setItem("activeSection", "fruits");
    sessionStorage.setItem("mainColor", "default"); // default = fruits
  } else {
    vegetablesBar.style.display = "flex";
    fruitsBar.style.display = "none";
    vegetablesTab.classList.add("active");
    fruitsTab.classList.remove("active");

    mainContent.classList.add('color');
    mainItems.classList.add('color');

    // Save section + color state
    sessionStorage.setItem("activeSection", "vegetables");
    sessionStorage.setItem("mainColor", "vegetables");
  }
}

// On page load → restore both section and color
document.addEventListener("DOMContentLoaded", () => {
  let lastSection = sessionStorage.getItem("activeSection");
  let lastColor = sessionStorage.getItem("mainColor");

  if (!lastSection) {
    setActiveSection("fruits");
  } else {
    setActiveSection(lastSection);

    // Restore color classes
    if (lastColor === "vegetables") {
      mainContent.classList.add('color');
      mainItems.classList.add('color');
    } else {
      mainContent.classList.remove('color');
      mainItems.classList.remove('color');
    }
  }
});




// window.onload = async function () {
//   const mobile = localStorage.getItem("loggedInUser");

//   if (!mobile) {
//     alert("Please login first ❌");
//     window.location.href = "signin.html"; // redirect back if not logged in
//     return;
//   }

//   // ✅ Fetch user cart
//   const response = await fetch(`http://localhost:5000/cart/${mobile}`);
//   const result = await response.json();

//   if (result.cart) {
//     console.log("User Cart:", result.cart);
//     // TODO: render cart items on page
//   }
// }


document.addEventListener("DOMContentLoaded", () => {
  const loginPopup = document.getElementById("loginPopup");
  const closePopup = document.getElementById("closePopup");
  const cancelPopup = document.getElementById("cancelPopup");
  const goToLogin = document.getElementById("goToLogin");

  // 🔹 Show popup
  function showLoginPopup(redirectPage) {
    loginPopup.style.display = "flex";
    loginPopup.setAttribute("data-redirect", redirectPage || "");
  }

  // 🔹 Close popup
  closePopup.onclick = cancelPopup.onclick = () => {
    loginPopup.style.display = "none";
  };

  // 🔹 Go to login
  goToLogin.onclick = () => {
    const redirect = loginPopup.getAttribute("data-redirect");
    window.location.href = redirect
      ? `signin.html?redirect=${redirect}`
      : "signin.html";
  };

  // 🔹 Helper: check login status
  async function isLoggedIn() {
    try {
      const res = await fetch("/getUser", { credentials: "include" });
      const data = await res.json();
      return data.loggedIn === true;
    } catch {
      return false;
    }
  }

  // =====================================================
  // ✅ PRODUCT / CATEGORY CARDS
  // =====================================================
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", async (e) => {
      e.preventDefault();
      const targetPage = card.getAttribute("data-link");
      if (!(await isLoggedIn())) {
        showLoginPopup(targetPage);
      } else {
        window.location.href = targetPage;
      }
    });
  });

  // =====================================================
  // ✅ CART BUTTON
  // =====================================================
  const cartBtn = document.querySelector(".cart");
  if (cartBtn) {
    cartBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!(await isLoggedIn())) {
        showLoginPopup("cart.html");
      } else {
        window.location.href = "cart.html";
      }
    });
  }

  // =====================================================
  // ✅ SEARCH BUTTON
  // =====================================================
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.querySelector(".search-bar input");

  if (searchBtn) {
    searchBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!(await isLoggedIn())) {
        showLoginPopup();
      } else {
        searchInput.focus();
      }
    });
  }

  // =====================================================
  // ✅ SEARCH SUGGESTIONS CLICK
  // =====================================================
  const searchSuggestions = document.getElementById("searchSuggestions");

  if (searchSuggestions) {
    searchSuggestions.addEventListener("click", async (e) => {
      // check for data-link OR href
      const target = e.target.closest("[data-link], a");
      if (target) {
        e.preventDefault();

        // get destination
        const targetPage =
          target.getAttribute("data-link") || target.getAttribute("href");

        if (!(await isLoggedIn())) {
          showLoginPopup(targetPage);
        } else {
          window.location.href = targetPage;
        }
      }
    });
  }


  // =====================================================
  // ✅ CLOSE POPUP ON OUTSIDE CLICK
  // =====================================================
  window.addEventListener("click", (e) => {
    if (e.target === loginPopup) loginPopup.style.display = "none";
  });

  // =====================================================
  // ✅ FORCE PAGE REFRESH ON BACK BUTTON (logout safety)
  // =====================================================
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });
});









async function loadProfile() {
  try {
    const res = await fetch("https://farmstore-1.onrender.com/profile", {
      credentials: "include"
    });
    const data = await res.json();

    if (data.success) {
      const user = data.user;
      document.getElementById("profileSection").innerHTML = `
        <div class="profile-section">
          <button class="back-btn" onclick="goBackToSidebar()">⬅</button>
          <h2>Profile</h2>
          <p><strong>Username:</strong> ${user.name || "N/A"}</p>
          <p><strong>Mobile:</strong> ${user.mobile}</p>
          ${user.email ? `<p><strong>Email:</strong> ${user.email}</p>` : ""}
          
        </div>
      `;
    } else {
      document.getElementById("profileSection").innerHTML = "<div class='not-login'><p class='please-login'>Please log in</p><br><button class='login-btn-profile'>Login</button></div>";
    }
  } catch (err) {
    console.error("❌ Failed to load profile:", err);
  }
}


function goBackToSidebar() {
  document.getElementById("profileSection").innerHTML = `
    <h3 onclick="loadProfile()">Profile</h3>`;
}


// 🔹 Logout function
async function logout() {
  await fetch("https://farmstore-1.onrender.com/logout", {
    method: "POST",
    credentials: "include"
  });

  // Force signin page to reload fresh (not from cache)
  window.location.href = "signin.html?ts=" + new Date().getTime();
}







document.addEventListener("DOMContentLoaded", async () => {
  const userIcon = document.getElementById("userIcon");

  try {
    const res = await fetch("/getUser", { credentials: "include" });
    const data = await res.json();

    if (!data.loggedIn) {
      // User not logged in → redirect on click
      userIcon.onclick = () => (window.location.href = "signin.html");
      return;
    }

    // User logged in → show avatar
    userIcon.innerHTML = `<div class="avatar">${data.name.charAt(0).toUpperCase()}</div>`;
    const avatar = userIcon.querySelector(".avatar");

    // Remove any previous onclick on userIcon
    userIcon.onclick = null;

    // Avatar click → open sidebar and load profile
    avatar.addEventListener("click", async (e) => {
      e.stopPropagation(); // Prevent triggering any parent click
      sidebar.classList.add("open");
      overlay.classList.add("on");
      await loadProfile();
    });

    // Hide downbar if you have it
    const downbar = document.querySelector(".downbar");
    if (downbar) downbar.classList.remove("side");

  } catch (err) {
    console.error("Error fetching user:", err);
    userIcon.onclick = () => (window.location.href = "signin.html");
  }
});


// _______________________________________SEARCH BAR________________________________________________
const searchBox = document.querySelector(".search-bar input");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.getElementById("searchSuggestions");
const overlayEl = document.querySelector(".overlay");

const items = {
  "Citrus Fruits": "citrusfruits.html",
  "Oranges": "citrusfruits.html",
  "Lemons": "citrusfruits.html",
  "Mosambi": "citrusfruits.html",

  "Tropical Fruits": "tropical.html",
  "Mango": "tropical.html",
  "Banana": "tropical.html",
  "Papaya": "tropical.html",
  "Guava": "tropical.html",

  "Berries": "berries.html",
  "Strawberries": "berries.html",

  "Stone Fruits": "stone.html",
  "Coconut": "stone.html",
  "Jackfruit": "stone.html",

  "Melons": "melon.html",
  "Watermelon": "melon.html",
  "Muskmelon": "melon.html",

  "Leafy Vegetables": "leafy.html",
  "Spinach": "leafy.html",
  "Coriander": "leafy.html",

  "Root Vegetables": "root.html",
  "Carrot": "root.html",
  "Beetroot": "root.html",
  "Radish": "root.html",

  "Fruiting Vegetables": "fruiting.html",
  "Tomato": "fruiting.html",
  "Brinjal": "fruiting.html",
  "Ladysfinger": "fruiting.html",

  "Bulb & Tuber Vegetables": "tuber.html",
  "Potato": "tuber.html",
  "Garlic": "tuber.html",
  "Onion": "tuber.html",
};

// Show overlay when focusing, but hide suggestions until typing
searchBox.addEventListener("focus", () => {
  overlayEl.classList.add("on-search");
  suggestionsBox.style.display = "none";
});

// Hide overlay + suggestions when overlay clicked
overlayEl.addEventListener("click", () => {
  overlayEl.classList.remove("on-search");
  suggestionsBox.style.display = "none";
});

// Render suggestions dynamically
function renderSuggestions(query) {
  let q = query.trim().toLowerCase();
  if (!q) {
    suggestionsBox.style.display = "none";
    return;
  }

  let html = "";
  Object.keys(items).forEach(label => {
    if (label.toLowerCase().includes(q)) {
      // ✅ No inline onclick, use data-link instead
      html += `<div class="suggestion" data-link="${items[label]}">${label}</div>`;
    }
  });

  suggestionsBox.innerHTML = html || "<div>No results found ❌</div>";
  suggestionsBox.style.display = "block";
}

// Typing → show suggestions
searchBox.addEventListener("input", (e) => {
  renderSuggestions(e.target.value);
});

// =====================================================
// ✅ Suggestion Click with Login Check
// =====================================================
if (suggestionsBox) {
  suggestionsBox.addEventListener("click", async (e) => {
    const target = e.target.closest(".suggestion");
    if (target) {
      e.preventDefault();
      const targetPage = target.getAttribute("data-link");

      if (!(await isLoggedIn())) {
        showLoginPopup(targetPage);
      } else {
        window.location.href = targetPage;
      }
    }
  });
}

// =====================================================
// ✅ Enter Key Search with Login Check
// =====================================================
async function doSearch() {
  let query = searchBox.value.trim().toLowerCase();
  if (!query) return;

  let found = Object.keys(items).find(label =>
    label.toLowerCase().includes(query)
  );

  if (found) {
    const targetPage = items[found];
    if (!(await isLoggedIn())) {
      showLoginPopup(targetPage);
    } else {
      window.location.href = targetPage;
    }
  } else {
    suggestionsBox.innerHTML = "<div>No results found ❌</div>";
    suggestionsBox.style.display = "block";
  }
}

// Press Enter → search
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    doSearch();
  }
});

// Click search icon → search
searchBtn.addEventListener("click", () => {
  doSearch();
});

// Press ESC → close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    overlayEl.classList.remove("on-search");
    suggestionsBox.style.display = "none";
    searchBox.blur();
  }
});




// Force refresh when navigating back
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});
