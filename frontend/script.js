
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

var swiper = new Swiper('.mySwiper', {
  slidesPerView: 1,
  loop: true,

  autoplay: {
    delay: 2200,
  },
})


// _________________________________________AVATAR____________________________________

// ---------- Unified Avatar & Sidebar Header Logic ----------
async function updateUserUI() {
  try {
    const res = await fetch("/getUser", { credentials: "include" });
    const data = await res.json();

    // 🟢 Logged in
    if (data && data.loggedIn === true) {
      const name = data.name || data.username || "User";
      const first = name.charAt(0).toUpperCase();

      // Top avatar → open sidebar
      if (topUserIcon) {
        topUserIcon.innerHTML = makeLetterAvatar(first, 32);
        topUserIcon.style.cursor = "pointer";
        topUserIcon.onclick = (e) => {
          e.stopPropagation();
          openSidebar();
        };
      }

      // Sidebar avatar
      if (sidebarAvatar) {
        sidebarAvatar.innerHTML = makeLetterAvatar(first, 40);
        sidebarAvatar.style.cursor = "pointer";
        sidebarAvatar.onclick = (e) => {
          e.stopPropagation();
          openSidebar();
        };
      }

      if (sidebarName) sidebarName.textContent = name;
      if (sidebarEmail)
        sidebarEmail.textContent =
          data.mobile
            ? `+91 ${data.mobile}`
            : data.email || "user@farmstore.com";
    }

    // 🔴 Not logged in
    else {
      if (topUserIcon) {
        topUserIcon.innerHTML = `<i class='bx bx-user'></i>`;
        topUserIcon.style.cursor = "pointer";
        topUserIcon.onclick = () => {
          window.location.href = "signin.html";
        };
      }

      if (sidebarAvatar)
        sidebarAvatar.innerHTML = `<i class='bx bx-user'></i>`;
      if (sidebarName) sidebarName.textContent = "Guest";
      if (sidebarEmail) sidebarEmail.textContent = "guest@farmstore.com";
    }
  } catch (err) {
    console.error("updateUserUI error:", err);
    if (topUserIcon) {
      topUserIcon.innerHTML = `<i class='bx bx-user'></i>`;
      topUserIcon.onclick = () => {
        window.location.href = "signin.html";
      };
    }
  }
}




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
    sidebarContent.classList.add('side-show');
  }

  // Restore the menu (used by Back button)
  function restoreMenu() {
    sidebarContent.classList.remove('side-show');
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
    sidebarContent.classList.add('side-show');
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
    sidebarOverlay.classList.add('side-show');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebarOverlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('sidebar-open');
    // fetch header info right away so top section isn't blank
    populateSidebarHeader();
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('side-show');
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


document.addEventListener("DOMContentLoaded", () => {
  const fruitsTab = document.querySelector(".fruits");
  const vegetablesTab = document.querySelector(".vegetables");
  const fruitsContent = document.querySelector(".fruits-bar");
  const vegetablesContent = document.querySelector(".vegetables-bar");

  function switchTab(tabName) {
    const showContent =
      tabName === "fruits" ? fruitsContent : vegetablesContent;
    const hideContent =
      tabName === "fruits" ? vegetablesContent : fruitsContent;

    // Skip if already active
    if (showContent.classList.contains("show")) return;

    // Update tab highlight
    fruitsTab.classList.toggle("tab", tabName === "fruits");
    vegetablesTab.classList.toggle("tab", tabName === "vegetables");

    // Determine directions
    const isFruits = tabName === "fruits";
    hideContent.classList.remove("from-left", "from-right", "to-left", "to-right", "show");
    showContent.classList.remove("from-left", "from-right", "to-left", "to-right", "show");

    // Assign correct animations
    hideContent.classList.add(isFruits ? "to-right" : "to-left");
    showContent.classList.add(isFruits ? "from-left" : "from-right");

    // Trigger reflow to reset animation
    void showContent.offsetWidth;

    // Show the new tab
    showContent.classList.add("show");

    // After animation cleanup
    setTimeout(() => {
      hideContent.classList.remove("to-left", "to-right");
      showContent.classList.remove("from-left", "from-right");
    }, 500);
  }

  fruitsTab.addEventListener("click", () => switchTab("fruits"));
  vegetablesTab.addEventListener("click", () => switchTab("vegetables"));
});




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
  overlayEl.classList.add("search-show");
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
      overlayEl.classList.remove("search-show");
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



//=-------------------------------- LOADER --------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const loginPopup = document.getElementById("loginPopup");
  const cancelPopup = document.getElementById("cancelPopup");
  const goToLogin = document.getElementById("goToLogin");

  let navigating = false; // Prevent loader from showing on browser back

  // Check login from backend
  async function isUserLoggedIn() {
    try {
      const response = await fetch("/api/check-session", { credentials: "include" });
      const data = await response.json();
      return data.loggedIn === true;
    } catch (err) {
      console.error("Session check failed:", err);
      return false;
    }
  }

  function showLoaderAndGo(url) {
    navigating = true;
    loader.style.display = "flex";
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  }

  function showLoginPopup() {
    loginPopup.style.display = "flex";
  }

  if (cancelPopup) {
    cancelPopup.addEventListener("click", () => {
      loginPopup.style.display = "none";
    });
  }

  if (goToLogin) {
    goToLogin.addEventListener("click", () => {
      loginPopup.style.display = "none";
      showLoaderAndGo("signin.html");
    });
  }

  // Cards
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", async e => {
      e.preventDefault();
      if (navigating) return; // prevent double click spam

      const link = card.getAttribute("data-link");
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        showLoaderAndGo(link);
      } else {
        showLoginPopup();
      }
    });
  });

  // Cart
  const cartIcon = document.querySelector(".cart i");
  if (cartIcon) {
    cartIcon.addEventListener("click", async e => {
      e.preventDefault();
      if (navigating) return;

      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        showLoaderAndGo("cart.html");
      } else {
        showLoginPopup();
      }
    });
  }




  // Signin / Profile icon logic
  const signinBtn = document.getElementById("topUserIcon");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (signinBtn) {
    signinBtn.addEventListener("click", async e => {
      e.preventDefault();
      if (navigating) return;

      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        // Logged in → open sidebar and focus on Profile
        sidebar.classList.add("active");
        sidebarOverlay.classList.add("active");

        // Optional: highlight profile section if you have one
        const profileSection = document.querySelector('[data-section="profile"]');
        if (profileSection) {
          profileSection.classList.add("active");
        }

        // Optional: hide other sections
        document.querySelectorAll(".sidebar-section").forEach(sec => {
          if (sec !== profileSection) sec.classList.remove("active");
        });
      } else {
        // Not logged in → go to signin
        showLoaderAndGo("signin.html");
      }
    });
  }


  // Prevent loader on back navigation
  window.addEventListener("pageshow", event => {
    if (event.persisted) {
      loader.style.display = "none";
      navigating = false;
    }
  });
});




document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const loginPopup = document.getElementById("loginPopup");
  const cancelPopup = document.getElementById("cancelPopup");
  const goToLogin = document.getElementById("goToLogin");

  // ✅ Show Loader
  function showLoader() {
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }
  }

  // ✅ Hide Loader
  function hideLoader() {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 300);
    }
  }

  // ✅ Check Login (MongoDB session)
  async function isUserLoggedIn() {
    try {
      const res = await fetch("/api/check-session", { credentials: "include" });
      const data = await res.json();
      return data.loggedIn === true;
    } catch (err) {
      console.error("Session check failed:", err);
      return false;
    }
  }

  // ✅ Navigate with Loader
  function showLoaderAndGo(url) {
    showLoader();
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  }

  // ✅ Popup Controls
  if (cancelPopup) {
    cancelPopup.addEventListener("click", () => {
      loginPopup.style.display = "none";
    });
  }

  if (goToLogin) {
    goToLogin.addEventListener("click", () => {
      loginPopup.style.display = "none";
      showLoaderAndGo("signin.html");
    });
  }

  // ✅ Handle Card Clicks
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", async () => {
      const link = card.getAttribute("data-link");
      if (!link) return;

      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        showLoaderAndGo(link);
      } else {
        loginPopup.style.display = "flex";
      }
    });
  });

  // ✅ Handle Cart Click
  const cartIcon = document.querySelector(".cart i");
  if (cartIcon) {
    cartIcon.addEventListener("click", async () => {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        showLoaderAndGo("cart.html");
      } else {
        loginPopup.style.display = "flex";
      }
    });
  }

  // ✅ Handle Signin Icon
  const signinBtn = document.getElementById("topUserIcon");
  if (signinBtn) {
    signinBtn.addEventListener("click", () => {
      showLoaderAndGo("signin.html");
    });
  }

  // ✅ Hide Loader when page is restored or loaded
  window.addEventListener("pageshow", () => hideLoader());
  window.addEventListener("load", () => hideLoader());
});




// ================== CARD CLICK WITH LOADER FIX ==================
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const loginPopup = document.getElementById("loginPopup"); // adjust ID if different
  const loginBtn = document.getElementById("loginBtn");
  const productCards = document.querySelectorAll(".product-card");

  // 1️⃣ Show loader immediately while DOM is loading
  loader.style.display = "flex";

  // 2️⃣ When all resources (images, scripts, etc.) are fully loaded, hide loader
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden"); // fade out smoothly
    }, 500); // small delay for smoothness
  });

  // 3️⃣ When login popup appears — hide loader
  function showLoginPopup() {
    loader.classList.add("hidden");
    if (loginPopup) loginPopup.style.display = "block";
  }

  // 4️⃣ When user logs in — show loader briefly
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      loader.classList.remove("hidden");
      loader.style.display = "flex";

      // simulate load delay (replace with your real login logic)
      setTimeout(() => {
        loader.classList.add("hidden");
        if (loginPopup) loginPopup.style.display = "none";
        console.log("Login successful, loader hidden");
      }, 1200);
    });
  }

  // 5️⃣ When clicking a product card — show loader
  productCards.forEach(card => {
    card.addEventListener("click", () => {
      loader.classList.remove("hidden");
      loader.style.display = "flex";

      setTimeout(() => loader.classList.add("hidden"), 1000);
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const productCards = document.querySelectorAll(".product-card");

  // show loader on card click
  productCards.forEach(card => {
    card.addEventListener("click", e => {
      // prevent duplicate triggers
      if (!loader) return;

      // show loader immediately
      loader.classList.remove("hidden");
      loader.style.display = "flex";

      // optional: simulate delay if navigation is instant
      // remove this block if your navigation already takes time
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 1200);
    });
  });
});

