
const body = document.querySelector('body');
const menu = body.querySelector('.menu');
const sidebar = document.querySelector(".sidebar"); // use id
const overlay = document.querySelector(".overlay");
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


//___________________________________________SWUPER___________________________________

var swiper = new Swiper('.mySwiper',{
  slidesPerView:1,
  loop:true,

  autoplay:{
    delay:2200,
  },
})


// _________________________________________AVATAR____________________________________

// ---------- Unified Avatar & Sidebar Header Logic ----------
document.addEventListener("DOMContentLoaded", () => {
  const topUserIcon = document.getElementById("topUserIcon");      // top bar
  const sidebarAvatar = document.getElementById("sidebarAvatar");  // sidebar avatar container
  const sidebarName = document.getElementById("sidebarName");
  const sidebarEmail = document.getElementById("sidebarEmail");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const sidebarMenu = document.querySelector('.sidebar-menu');

  // small helper to render a round avatar with a letter
  function makeLetterAvatar(letter, size = 32) {
    return `<div class="avatar" style="width:${size}px;height:${size}px">${letter}</div>`;
  }

  // open / close sidebar helpers
  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("open");
    if (sidebarOverlay) sidebarOverlay.classList.add("show");
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sidebar-open');
    // optionally ensure menu visible
    if (sidebarMenu) sidebarMenu.style.display = 'block';
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (sidebarOverlay) sidebarOverlay.classList.remove("show");
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sidebar-open');
  }

  // Click handlers to close
  closeSidebarBtn && closeSidebarBtn.addEventListener('click', closeSidebar);
  sidebarOverlay && sidebarOverlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

  // Main function to update top & sidebar UI based on login
  async function updateUserUI() {
    try {
      const res = await fetch("/getUser", { credentials: "include" });
      // if your endpoint returns non-json on 401, guard it
      const data = await res.json();

      if (!data || data.loggedIn !== true) {
        // Not logged in → show default icon & redirect on click
        if (topUserIcon) {
          topUserIcon.innerHTML = `<i class='bx bx-user'></i>`;
          topUserIcon.style.cursor = "pointer";
          topUserIcon.onclick = () => { window.location.href = "signin.html"; };
        }
        // Sidebar header defaults
        if (sidebarAvatar) sidebarAvatar.innerHTML = `<i class='bx bx-user'></i>`;
        if (sidebarName) sidebarName.textContent = "Guest";
        if (sidebarEmail) sidebarEmail.textContent = "guest@farmstore.com";
        return;
      }

      // Logged in — render initial avatar (first letter)
      const name = data.name || data.username || "User";
      const first = (typeof name === "string" && name.length > 0) ? name.charAt(0).toUpperCase() : "U";

      if (topUserIcon) {
        topUserIcon.innerHTML = makeLetterAvatar(first, 32);
        topUserIcon.style.cursor = "pointer";
        topUserIcon.onclick = (e) => {
          e.stopPropagation();
          openSidebar();
        };
      }

      if (sidebarAvatar) {
        sidebarAvatar.innerHTML = makeLetterAvatar(first, 40);
        sidebarAvatar.style.cursor = "pointer";
        // clicking sidebar avatar should also open full profile (menu hidden, loadProfile can be called elsewhere)
        sidebarAvatar.onclick = (e) => {
          e.stopPropagation();
          openSidebar();
          // optional: hide menu and show loader+profile if you have loadProfile defined
          if (typeof loadProfile === "function") {
            const sidebarMenuEl = document.querySelector('.sidebar-menu');
            if (sidebarMenuEl) sidebarMenuEl.style.display = 'none';
            // show a loader while loading
            const sidebarContent = document.getElementById('sidebarContent');
            if (sidebarContent) {
              sidebarContent.innerHTML = `<div class="loader-overlay"><div class="loader"></div></div>`;
            }
            // call your existing loadProfile func (it exists in your script earlier)
            loadProfile();
          }
        };
      }

      if (sidebarName) sidebarName.textContent = data.name || "User";
      if (sidebarEmail) sidebarEmail.textContent = data.mobile ? `+91 ${data.mobile}` : (data.email || "user@farmstore.com");

    } catch (err) {
      console.error("updateUserUI error:", err);
      // fallback to not-logged-in behavior
      if (topUserIcon) {
        topUserIcon.innerHTML = `<i class='bx bx-user'></i>`;
        topUserIcon.onclick = () => { window.location.href = "signin.html"; };
      }
    }
  }

  // run once on load
  updateUserUI();

  // Optional: If your app dynamically logs in/out without page reload,
  // you can expose updateUserUI to window to call after login/logout flows.
  window.updateUserUI = updateUserUI;
});

// ________________________________________SWITCHING TABS________________________________________









// __________________________________________SIDEBAR______________________________________________



document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector('#openSidebar') || document.querySelector('.menu');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebarMenu = document.querySelector('.sidebar-menu');
  const sidebarMenuItems = document.querySelectorAll('.sidebar-menu-item');
  const sidebarContent = document.getElementById('sidebarContent');
  const sidebarAvatar = document.getElementById('sidebarAvatar');
  const sidebarName = document.getElementById('sidebarName');
  const sidebarEmail = document.getElementById('sidebarEmail');

  if (!sidebar || !sidebarOverlay || !menuBtn) return;

  // Populate header quickly when sidebar opens
  async function populateSidebarHeader() {
    try {
      // lightweight endpoint that only needs to confirm user & basic info.
      // Using /getUser (same as you used elsewhere) so it stays consistent with your backend.
      const res = await fetch('/getUser', { credentials: 'include' });
      const data = await res.json();
      if (data && data.loggedIn) {
        sidebarName.textContent = data.name || "User";
        sidebarEmail.textContent = data.mobile ? `+91 ${data.mobile}` : (data.email || "user@farmstore.com");
        // avatar: keep default unless backend has avatar URL in response
        // if (data.avatarUrl) sidebarAvatar.src = data.avatarUrl;
      } else {
        sidebarName.textContent = "Guest";
        sidebarEmail.textContent = "guest@farmstore.com";
        sidebarAvatar.src = "assets/default-avatar.png";
      }
    } catch (err) {
      console.error("Sidebar header load failed:", err);
      sidebarName.textContent = "Guest";
      sidebarEmail.textContent = "guest@farmstore.com";
      sidebarAvatar.src = "assets/default-avatar.png";
    }
  }

  function showSidebarLoading() {
    // lightweight inline loader / placeholder while profile content is fetched
    sidebarContent.innerHTML = `  <div class="loader-overlay" id="loader">
                                    <div class="loader"></div>
                                  </div>`;
    sidebarContent.classList.add('show');
  }

  // Restore the menu (used by Back button)
  function restoreMenu() {
    sidebarContent.classList.remove('show');
    sidebarContent.style.opacity = '0';

    setTimeout(() => {
      sidebarContent.innerHTML = '';
      sidebarContent.scrollTop = 0;
      sidebarContent.style.opacity = '1';

      if (sidebarMenu) sidebarMenu.style.display = 'block';
      sidebarMenuItems.forEach(i => i.classList.remove('active'));
    }, 150);
  }



  // Show content with a Back button (safe single place to render)
  function showWithBack(innerHtml) {
    sidebarContent.innerHTML = `<div class="back-btn" id="sidebarBackBtn">← Back</div>` + innerHtml;
    sidebarContent.classList.add('show');
    const backBtn = document.getElementById('sidebarBackBtn');
    if (backBtn) backBtn.addEventListener('click', restoreMenu);
  }





  // -------------------- Load Profile --------------------

  // Unified profile loader — only one definition (replaces duplicates)
  async function loadProfile() {
    showSidebarLoading();
    try {
      const res = await fetch("https://farmstore-1.onrender.com/profile", { credentials: 'include' });
      const data = await res.json();
      if (data && data.success) {
        // Immediately update header so top section is visible
        sidebarName.textContent = data.user.name || "Guest";
        sidebarEmail.textContent = data.user.mobile ? `+91 ${data.user.mobile}` : (data.user.email || "guest@farmstore.com");
        // Render profile area inside the sidebar content (single location)
        const profileHtml = `
          <div id="profileSection">
            <h3>Profile</h3>
            <p><strong>Name:</strong> ${data.user.name || "N/A"}</p>
            <p><strong>Mobile:</strong> ${data.user.mobile || "N/A"}</p>
            ${data.user.email ? `<p><strong>Email:</strong> ${data.user.email}</p>` : ''}
          </div>
        `;
        showWithBack(profileHtml);
      } else {
        showWithBack('<p>Not logged in</p>');
      }
    } catch (err) {
      console.error("Profile load error:", err);
      showWithBack('<p>Error loading profile</p>');
    }
  }

  // Sidebar open / close
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebarOverlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('sidebar-open');
    // fetch header info right away so top section isn't blank
    populateSidebarHeader();
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    sidebar.setAttribute('aria-hidden', 'true');
    sidebarOverlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.classList.remove('sidebar-open');
    restoreMenu();
  }

  menuBtn.addEventListener('click', (e) => { e.stopPropagation(); openSidebar(); });
  closeSidebarBtn && closeSidebarBtn.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });
  sidebar.addEventListener('click', (e) => e.stopPropagation());

  // Menu items click
  sidebarMenuItems.forEach(item => {
    item.addEventListener('click', async () => {
      const section = item.getAttribute('data-section');
      // Hide the menu and show loader area while we fetch
      if (sidebarMenu) sidebarMenu.style.display = 'none';
      sidebarMenuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (section === 'profile') {
        openSidebar();            // ensure sidebar is open
        // show placeholder immediately
        showSidebarLoading();
        await loadProfile();      // will replace content when done
      } else if (section === 'orders') {
        const os = document.getElementById('ordersSection');
        const contentHtml = os ? os.innerHTML : `<h3 class="content-head">Orders</h3><p>No orders found.</p>`;
        showWithBack(contentHtml);
      } else if (section === 'favorites') {
        showWithBack(`<h3 class="content-head">Favorites</h3><p>Coming soon.</p>`);
      } else if (section === 'contact') {
        showWithBack(`<h3 class="content-head">Contact</h3><p>Email: support@farmstore.com<br>Phone: +91 98765 43210</p>`);
      } else if (section === 'logout') {
        await logout();
        return;
      }
    });
  });

  // Avatar click loads profile (same unified flow)
  if (sidebarAvatar) {
    sidebarAvatar.addEventListener('click', async () => {
      openSidebar();
      if (sidebarMenu) sidebarMenu.style.display = 'none';
      showSidebarLoading();
      await loadProfile();
    });
  }

  // drag to close (keeps existing behavior)
  (function enableDragToClose() {
    let startX = null;
    let touching = false;
    sidebar.addEventListener('touchstart', e => {
      if (!sidebar.classList.contains('open')) return;
      touching = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    sidebar.addEventListener('touchmove', e => {
      if (!touching || startX === null) return;
      const delta = e.touches[0].clientX - startX;
      if (delta < -60) { touching = false; closeSidebar(); }
    }, { passive: true });

    sidebar.addEventListener('touchend', () => { touching = false; startX = null; });
  })();
});


// -------------------- Logout Function --------------------
async function logout() {
  try {
    // Request backend to destroy the MongoDB session
    const res = await fetch("https://farmstore-1.onrender.com/logout", {
      method: "POST",
      credentials: "include", // send cookies
    });

    // Parse JSON safely (some backends send plain text)
    const data = await res.json().catch(() => ({}));

    if (res.ok && (data.success || data.message || data.status === "logged_out")) {
      console.log("Logout successful");
    } else {
      console.warn("Unexpected logout response:", data);
    }

    // Redirect user to signin page after logout
    window.location.href = "/signin.html";
  } catch (err) {
    console.error("Logout failed:", err);

    // Still redirect (session likely invalid already)
    window.location.href = "/signin.html";
  }
}

// ___________________________________________LOADER_______________________________________________

const loader = document.getElementById("loader");

// ===== Loader Control =====
window.addEventListener("load", () => {

  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 400); // smooth fade
  }
});



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


// ✅ Tab events (ONLY call switchTab, not old code)
fruits.addEventListener("click", () => switchTab("fruits"));
vegetables.addEventListener("click", () => switchTab("vegetables"));



// ______________________________________________MAIN________________________________________________




fruits.addEventListener("click", () => {
  fruits.classList.add('active');
  vegetables.classList.remove('active');

  fruits_bar.classList.remove('display');
  vegetables_bar.classList.add('display');

  if (mainContent.classList.contains('color')) {
    mainContent.classList.remove('color');
    mainItems.classList.remove('color');
  }
})

vegetables.addEventListener("click", () => {
  vegetables.classList.add('active');
  fruits.classList.remove('active');

  fruits_bar.classList.add('display');
  vegetables_bar.classList.remove('display');

  mainContent.classList.add('color');
  mainItems.classList.add('color');

})




const fruitsTab = document.querySelector(".fruits");
const vegetablesTab = document.querySelector(".vegetables");
const fruitsBar = document.querySelector(".fruits-bar");
const vegetablesBar = document.querySelector(".vegetables-bar");

function setActiveSection(section) {
  if (section === "fruits") {
    fruitsBar.style.display = "flex";
    vegetablesBar.style.display = "none";
    fruitsTab.classList.add("active-tab");
    vegetablesTab.classList.remove("active-tab");

    mainContent.classList.remove('color');
    mainItems.classList.remove('color');

    // Save section + color state
    sessionStorage.setItem("activeSection", "fruits");
    sessionStorage.setItem("mainColor", "default"); // default = fruits
  } else {
    vegetablesBar.style.display = "flex";
    fruitsBar.style.display = "none";
    vegetablesTab.classList.add("active-tab");
    fruitsTab.classList.remove("active-tab");

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




// _______________________________________SEARCH BAR________________________________________________
// ===== SEARCH BAR & SUGGESTIONS =====
// --- Search & Suggestions ---
const searchInput = document.querySelector(".search-bar input");
const suggestionsBox = document.getElementById("searchSuggestions");
const overlayEl = document.querySelector(".search-overlay");
const searchBar = document.querySelector(".search-bar");

// Sample items
const items =
  [{ name: "Oranges", emoji: "🍊", link: "citrusfruits.html" },
  { name: "Lemons", emoji: "🍋", link: "citrusfruits.html" },
  { name: "Mosambi", emoji: "🍊", link: "citrusfruits.html" },
  { name: "Mango", emoji: "🥭", link: "tropical.html" },
  { name: "Banana", emoji: "🍌", link: "tropical.html" },
  { name: "Papaya", emoji: "🟠", link: "tropical.html" },
  { name: "Guava", emoji: "🟢", link: "tropical.html" },
  { name: "Strawberries", emoji: "🍓", link: "berries.html" },
  { name: "Coconut", emoji: "🥥", link: "stone.html" },
  { name: "Jackfruit", emoji: "🟡", link: "stone.html" },
  { name: "Watermelon", emoji: "🍉", link: "melon.html" },
  { name: "Muskmelon", emoji: "🍈", link: "melon.html" },
  { name: "Spinach", emoji: "🥬", link: "leafy.html" },
  { name: "Coriander", emoji: "🌿", link: "leafy.html" },
  { name: "Carrot", emoji: "🥕", link: "root.html" },
  { name: "Beetroot", emoji: "🟣", link: "root.html" },
  { name: "Radish", emoji: "🟥", link: "root.html" },
  { name: "Tomato", emoji: "🍅", link: "fruiting.html" },
  { name: "Brinjal", emoji: "🍆", link: "fruiting.html" },
  { name: "Lady's Finger", emoji: "🫛", link: "fruiting.html" },
  { name: "Potato", emoji: "🥔", link: "tuber.html" },
  { name: "Garlic", emoji: "🧄", link: "tuber.html" },
  { name: "Onion", emoji: "🧅", link: "tuber.html" },
  ];

let selectedIndex = -1;
let isUserLoggedIn = null;


searchBar.addEventListener("click", () => {
  searchBar.classList.add("scale");
  searchInput.focus();
});


document.addEventListener('click', (event) => {
    if (!searchBar.contains(event.target)) {
        searchBar.classList.remove('scale');
    }
});

// ✅ Check login
async function checkLogin() {
  if (isUserLoggedIn !== null) return isUserLoggedIn;
  try {
    const res = await fetch("/getUser", { credentials: "include" });
    const data = await res.json();
    isUserLoggedIn = data.loggedIn === true;
  } catch {
    isUserLoggedIn = false;
  }
  return isUserLoggedIn;
}

// ✅ Login popup logic
const loginPopup = document.getElementById("loginPopup");
const goToLogin = document.getElementById("goToLogin");
const closePopup = document.getElementById("closePopup");

function showLoginPopup(redirectPage) {
  loginPopup.style.display = "flex";
  loginPopup.setAttribute("data-redirect", redirectPage || "");
}

closePopup.onclick = () => loginPopup.style.display = "none";
goToLogin.onclick = () => {
  const redirect = loginPopup.getAttribute("data-redirect");
  window.location.href = redirect
    ? `signin.html?redirect=${redirect}`
    : "signin.html";
};

// ✅ Render suggestions
function renderSuggestions(filtered) {
  suggestionsBox.innerHTML = filtered.map((item, i) => {
    const q = searchInput.value.toLowerCase();
    const highlighted = item.name.replace(new RegExp(q, "gi"), m => `<mark>${m}</mark>`);
    return `<div class="suggestion-item" data-link="${item.link}" data-index="${i}">${item.emoji} ${highlighted}</div>`;
  }).join("");

  suggestionsBox.classList.add("s-show");
  overlayEl.classList.add("show");
}

// ✅ Input behavior
let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const query = searchInput.value.trim().toLowerCase();
    if (query !== "") searchBar.classList.add("scale");
    else searchBar.classList.remove("scale");

    if (!query) {
      suggestionsBox.classList.remove("s-show");
      overlayEl.classList.remove("show");
      return;
    }

    const filtered = items.filter(item => item.name.toLowerCase().includes(query));
    if (!filtered.length) {
      suggestionsBox.innerHTML = `<p class="no-result">No Items Found ❌</p>`;
      suggestionsBox.classList.add("s-show");
      overlayEl.classList.add("show");
      return;
    }
    renderSuggestions(filtered);
  }, 120);
});

// ✅ Click suggestion
suggestionsBox.addEventListener("click", async (e) => {
  const item = e.target.closest(".suggestion-item");
  if (!item) return;

  const link = item.getAttribute("data-link");
  const loggedIn = await checkLogin();

  if (!loggedIn) showLoginPopup(link);
  else window.location.href = link;

  // Close suggestions
  suggestionsBox.classList.remove("s-show");
  overlayEl.classList.remove("show");
  searchBar.classList.remove("scale");
});

// ✅ Overlay click closes suggestions
overlayEl.addEventListener("click", () => {
  suggestionsBox.classList.remove("s-show");
  overlayEl.classList.remove("show");
  searchBar.classList.remove("scale");
});
