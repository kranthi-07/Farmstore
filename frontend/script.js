/* ==============================
   GLOBAL ELEMENTS & SWIPER
============================== */
const body = document.querySelector("body");
const menu = body.querySelector(".menu");
const sidebarEl = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");
const sidebarContent = document.getElementById("sidebarContent");
const sidebarItems = document.querySelectorAll(".sidebar-item");

const fruits = body.querySelector(".fruits");
const vegetables = body.querySelector(".vegetables");
const fruits_bar = body.querySelector(".fruits-bar");
const vegetables_bar = body.querySelector(".vegetables-bar");
const mainContent = body.querySelector(".main-content");
const mainItems = body.querySelector(".main-items");

let startX = 0;
let currentX = 0;
let touchingSidebar = false;

// Swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  loop: true,
  autoplay: { delay: 2200 },
});

/* ==============================
   UTILITIES (LOGIN + LOADER)
============================== */
const loader = document.getElementById("loader");

function showLoader() {
  if (loader) {
    loader.style.display = "flex";
    loader.style.opacity = "1";
  }
}
function hideLoader() {
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 300);
  }
}
function showLoaderAndGo(url) {
  showLoader();
  setTimeout(() => {
    window.location.href = url;
  }, 600);
}

// Canonical login check (use ONLY /getUser)
async function isUserLoggedIn() {
  try {
    const res = await fetch("/getUser", { credentials: "include" });
    const data = await res.json();
    return data?.loggedIn === true;
  } catch {
    return false;
  }
}



// TOP BAR SCOLL ANIMATION


const topBar = document.querySelector(".top-bar");
const topSection = document.querySelector(".top-section");
const bottomSection = document.querySelector(".bottom-section");
const cartIcon = document.querySelector(".cart i");

const hideDistance = 60;  // movement range

window.addEventListener("scroll", () => {
    let scrolled = Math.min(window.scrollY, hideDistance);
    let progress = scrolled / hideDistance; // 0 to 1

    // Move bar smoothly proportional to scroll
    topBar.style.transform = `translateY(-${progress * hideDistance}px)`;

    // Opacity fade out
    topSection.style.opacity = `${1 - progress}`;

    // After slight scroll add solid BG & blur
    if (progress > 0.05) {
        bottomSection.classList.add("scrolled");
        topBar.classList.add("scrolled-bg");
    } else {
        bottomSection.classList.remove("scrolled");
        topBar.classList.remove("scrolled-bg");
    }

    // Floating cart pop effect
    if (progress > 0.4) {
        cartIcon.classList.add("float");
    } else {
        cartIcon.classList.remove("float");
    }
});

// Elastic return animation when user scrolls up fast or reaches top
window.addEventListener("scrollend", () => {
    if (window.scrollY < 10) {
        topBar.classList.add("elastic");
        setTimeout(() => topBar.classList.remove("elastic"), 500);
    }
});




//* ================= TAB SWITCH ================= */
const fruitsTab = document.querySelector(".fruits");
const vegetablesTab = document.querySelector(".vegetables");

const fruitsBar = document.querySelector(".fruits-bar");
const vegetablesBar = document.querySelector(".vegetables-bar");

function setActiveTab(active, inactive, showBar, hideBar) {
    // Remove active first to avoid both highlighting
    fruitsTab.classList.remove("active-tab");
    vegetablesTab.classList.remove("active-tab");

    // Add active to selected tab instantly
    active.classList.add("active-tab");

    // Start animation
    hideBar.classList.remove("show");
    hideBar.classList.add("to-left");

    setTimeout(() => {
        hideBar.classList.remove("to-left");
        hideBar.classList.add("display");
        showBar.classList.remove("display");
        showBar.classList.add("show");
    }, 180);  // transition finish
}

fruitsTab.addEventListener("click", () => {
    setActiveTab(fruitsTab, vegetablesTab, fruitsBar, vegetablesBar);
});

vegetablesTab.addEventListener("click", () => {
    setActiveTab(vegetablesTab, fruitsTab, vegetablesBar, fruitsBar);
});




/* ==============================
   AVATAR (TOPBAR + SIDEBAR HEADER)
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const topUserIcon = document.getElementById("topUserIcon"); // Top bar avatar container
  const sidebarAvatar = document.getElementById("sidebarAvatar"); // Sidebar avatar container
  const sidebarName = document.getElementById("sidebarName");
  const sidebarEmail = document.getElementById("sidebarEmail");

  // use your CSS .avatar
  function makeLetterAvatar(letter) {
    return `<div class="avatar">${letter}</div>`;
  }

  // Sidebar open/close — single source of truth
  function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const sidebarMenu = document.querySelector(".sidebar-menu");
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("side-show"); // ✅ use .side-show
    document.body.classList.add("sidebar-open");
    if (sidebarMenu) sidebarMenu.style.display = "block";
    populateSidebarHeader();
  }

  function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("side-show"); // ✅ use .side-show
    document.body.classList.remove("sidebar-open");
    restoreMenu();
  }

  window.openSidebar = openSidebar;  // expose for reuse
  window.closeSidebar = closeSidebar;

  // Close handlers
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  closeSidebarBtn.addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeSidebar());

  // MAIN: update UI based on login
  async function updateUserUI() {
    try {
      // avoid flicker: fade in after content set
      if (topUserIcon) {
        topUserIcon.style.opacity = "0";
        topUserIcon.style.transition = "opacity .3s ease";
      }

      const res = await fetch("/getUser", { credentials: "include" });
      const data = await res.json();
      const loggedIn = data?.loggedIn === true;

      if (!loggedIn) {
        // Not logged in → show user icon & redirect on click
        if (topUserIcon) {
          topUserIcon.innerHTML = `<i class='bx bx-user'></i>`;
          topUserIcon.style.cursor = "pointer";
          topUserIcon.onclick = () => window.location.assign("signin.html");
        }
        if (sidebarAvatar) {
          sidebarAvatar.innerHTML = `<i class='bx bx-user'></i>`;
          sidebarAvatar.style.cursor = "pointer";
          sidebarAvatar.onclick = () => window.location.assign("signin.html");
        }
        if (sidebarName) sidebarName.textContent = "Guest";
        if (sidebarEmail) sidebarEmail.textContent = "guest@farmstore.com";
      } else {
        // Logged in → show letter avatar & open sidebar on click
        const name = data.name || data.username || "User";
        const first = name.charAt(0).toUpperCase();

        if (topUserIcon) {
          topUserIcon.innerHTML = makeLetterAvatar(first);
          topUserIcon.style.cursor = "pointer";
          topUserIcon.onclick = (e) => {
            e.preventDefault();
            openSidebar();
          };
        }
        if (sidebarAvatar) {
          sidebarAvatar.innerHTML = makeLetterAvatar(first);
          sidebarAvatar.style.cursor = "pointer";
          sidebarAvatar.onclick = (e) => {
            e.preventDefault();
            openSidebar(); // no loader/profile load here
          };
        }
        if (sidebarName) sidebarName.textContent = name;
        if (sidebarEmail) {
          sidebarEmail.textContent =
            data.mobile ? `+91 ${data.mobile}` : data.email || "user@farmstore.com";
        }
      }

      // fade-in
      setTimeout(() => {
        if (topUserIcon) topUserIcon.style.opacity = "1";
      }, 100);
    } catch (err) {
      console.error("updateUserUI error:", err);
      if (topUserIcon) {
        topUserIcon.innerHTML = `<i class='bx bx-user'></i>`;
        topUserIcon.onclick = () => window.location.assign("signin.html");
        topUserIcon.style.opacity = "1";
      }
    }
  }

  window.updateUserUI = updateUserUI;
  updateUserUI();
});

/* ==============================
   SIDEBAR (MENU + PROFILE LOADER)
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#openSidebar") || document.querySelector(".menu");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const sidebarMenu = document.querySelector(".sidebar-menu");
  const sidebarMenuItems = document.querySelectorAll(".sidebar-menu-item");
  const sidebarContent = document.getElementById("sidebarContent");
  const sidebarAvatar = document.getElementById("sidebarAvatar");
  const sidebarName = document.getElementById("sidebarName");
  const sidebarEmail = document.getElementById("sidebarEmail");

  if (!sidebar || !sidebarOverlay || !menuBtn) return;

  // Populate header quickly when sidebar opens
  async function populateSidebarHeader() {
    try {
      const res = await fetch("/getUser", { credentials: "include" });
      const data = await res.json();
      if (data && data.loggedIn) {
        sidebarName.textContent = data.name || "User";
        sidebarEmail.textContent =
          data.mobile ? `+91 ${data.mobile}` : data.email || "user@farmstore.com";
      } else {
        sidebarName.textContent = "Guest";
        sidebarEmail.textContent = "guest@farmstore.com";
        // if you used <img>, keep default; using .avatar now
      }
    } catch (err) {
      console.error("Sidebar header load failed:", err);
      sidebarName.textContent = "Guest";
      sidebarEmail.textContent = "guest@farmstore.com";
    }
  }

  function showSidebarLoading() {
    sidebarContent.innerHTML = `
      <div class="loader-overlay">
        <div class="loader"></div>
      </div>`;
    sidebarContent.classList.add("side-show");
  }

  function restoreMenu() {
    sidebarContent.classList.remove("side-show");
    sidebarContent.style.opacity = "0";
    setTimeout(() => {
      sidebarContent.innerHTML = "";
      sidebarContent.scrollTop = 0;
      sidebarContent.style.opacity = "1";
      if (sidebarMenu) sidebarMenu.style.display = "block";
      sidebarMenuItems.forEach((i) => i.classList.remove("active"));
    }, 150);
  }
  window.restoreMenu = restoreMenu; // used by closeSidebar

  function showWithBack(innerHtml) {
    sidebarContent.innerHTML = `<div class="back-btn" id="sidebarBackBtn">← Back</div>` + innerHtml;
    sidebarContent.classList.add("side-show");
    const backBtn = document.getElementById("sidebarBackBtn");
    if (backBtn) backBtn.addEventListener("click", restoreMenu);
  }

  // Load profile (used only when menu → profile)
  async function loadProfile() {
    showSidebarLoading();
    try {
      const res = await fetch("https://farmstore-1.onrender.com/profile", {
        credentials: "include",
      });
      const data = await res.json();
      if (data && data.success) {
        sidebarName.textContent = data.user.name || "Guest";
        sidebarEmail.textContent =
          data.user.mobile ? `+91 ${data.user.mobile}` : data.user.email || "guest@farmstore.com";

        const profileHtml = `
          <div id="profileSection">
            <h3>Profile</h3>
            <p><strong>Name:</strong> ${data.user.name || "N/A"}</p>
            <p><strong>Mobile:</strong> ${data.user.mobile || "N/A"}</p>
            ${data.user.email ? `<p><strong>Email:</strong> ${data.user.email}</p>` : ""}
          </div>
        `;
        showWithBack(profileHtml);
      } else {
        showWithBack("<p>Not logged in</p>");
      }
    } catch (err) {
      console.error("Profile load error:", err);
      showWithBack("<p>Error loading profile</p>");
    }
  }

  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("side-show");
    sidebar.setAttribute("aria-hidden", "false");
    sidebarOverlay.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("sidebar-open");
    populateSidebarHeader();
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("side-show");
    sidebar.setAttribute("aria-hidden", "true");
    sidebarOverlay.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    document.body.classList.remove("sidebar-open");
    restoreMenu();
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openSidebar();
  });
  closeSidebarBtn && closeSidebarBtn.addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeSidebar);
  sidebar.addEventListener("click", (e) => e.stopPropagation());

  // Menu items
  sidebarMenuItems.forEach((item) => {
    item.addEventListener("click", async () => {
      const section = item.getAttribute("data-section");
      if (sidebarMenu) sidebarMenu.style.display = "none";
      sidebarMenuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      if (section === "profile") {
        openSidebar();
        showSidebarLoading();
        await loadProfile();
      } else if (section === "orders") {
        const os = document.getElementById("ordersSection");
        const contentHtml =
          os?.innerHTML ||
          `<h3 class="content-head">Orders</h3><p>No orders found.</p>`;
        showWithBack(contentHtml);
      } else if (section === "favorites") {
        showWithBack(`<h3 class="content-head">Favorites</h3><p>Coming soon.</p>`);
      } else if (section === "contact") {
        showWithBack(
          `<h3 class="content-head">Contact</h3><p>Email: support@farmstore.com<br>Phone: +91 98765 43210</p>`
        );
      } else if (section === "logout") {
        await logout();
      }
    });
  });

  // Avatar in sidebar: JUST open sidebar (no profile loader)
  if (sidebarAvatar) {
    sidebarAvatar.addEventListener("click", () => {
      openSidebar();
      // leave menu visible; profile loads only when menu→Profile is clicked
    });
  }

  // Drag to close
  (function enableDragToClose() {
    let startX = null;
    let touching = false;
    sidebar.addEventListener(
      "touchstart",
      (e) => {
        if (!sidebar.classList.contains("open")) return;
        touching = true;
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    sidebar.addEventListener(
      "touchmove",
      (e) => {
        if (!touching || startX === null) return;
        const delta = e.touches[0].clientX - startX;
        if (delta < -60) {
          touching = false;
          closeSidebar();
        }
      },
      { passive: true }
    );
    sidebar.addEventListener("touchend", () => {
      touching = false;
      startX = null;
    });
  })();
});

// Logout
async function logout() {
  try {
    const res = await fetch("https://farmstore-1.onrender.com/logout", {
      method: "POST",
      credentials: "include",
    });
    await res.json().catch(() => ({}));
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    window.location.href = "/signin.html";
  }
}

/* ==============================
   LOADER (PAGE LOAD)
============================== */
window.addEventListener("load", () => {
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 400);
  }
});
window.addEventListener("pageshow", (event) => {
  // hide loader if page returned from bfcache
  if (event.persisted) hideLoader();
});

/* ==============================
   TABS (FRUITS / VEGETABLES)
============================== */
function switchTab(section) {
  showLoader();
  setTimeout(() => {
    if (section === "fruits") {
      fruits_bar.style.display = "flex";
      vegetables_bar.style.display = "none";
      fruits.classList.add("active-tab");
      vegetables.classList.remove("active-tab");
    } else {
      vegetables_bar.style.display = "flex";
      fruits_bar.style.display = "none";
      vegetables.classList.add("active-tab");
      fruits.classList.remove("active-tab");
    }
    hideLoader();
  }, 1000);
}
fruits?.addEventListener("click", () => switchTab("fruits"));
vegetables?.addEventListener("click", () => switchTab("vegetables"));

// Tab animation (kept as your second logic, unified once)
document.addEventListener("DOMContentLoaded", () => {
  const fruitsTab = document.querySelector(".fruits");
  const vegetablesTab = document.querySelector(".vegetables");
  const fruitsContent = document.querySelector(".fruits-bar");
  const vegetablesContent = document.querySelector(".vegetables-bar");

  function runTabAnimation(tabName) {
    const showContent = tabName === "fruits" ? fruitsContent : vegetablesContent;
    const hideContent = tabName === "fruits" ? vegetablesContent : fruitsContent;
    if (showContent.classList.contains("show")) return;

    fruitsTab.classList.toggle("tab", tabName === "fruits");
    vegetablesTab.classList.toggle("tab", tabName === "vegetables");

    const isFruits = tabName === "fruits";
    hideContent.classList.remove("from-left", "from-right", "to-left", "to-right", "show");
    showContent.classList.remove("from-left", "from-right", "to-left", "to-right", "show");

    hideContent.classList.add(isFruits ? "to-right" : "to-left");
    showContent.classList.add(isFruits ? "from-left" : "from-right");

    void showContent.offsetWidth;
    showContent.classList.add("show");

    setTimeout(() => {
      hideContent.classList.remove("to-left", "to-right");
      showContent.classList.remove("from-left", "from-right");
    }, 500);
  }

  fruitsTab?.addEventListener("click", () => runTabAnimation("fruits"));
  vegetablesTab?.addEventListener("click", () => runTabAnimation("vegetables"));
});

/* ==============================
   LOGIN POPUP + CARDS + CART
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const loginPopup = document.getElementById("loginPopup");
  const closePopup = document.getElementById("closePopup");
  const cancelPopup = document.getElementById("cancelPopup");
  const goToLogin = document.getElementById("goToLogin");

  function showLoginPopup(redirectPage) {
    loginPopup.style.display = "flex";
    loginPopup.setAttribute("data-redirect", redirectPage || "");
  }
  closePopup && (closePopup.onclick = () => (loginPopup.style.display = "none"));
  cancelPopup && (cancelPopup.onclick = () => (loginPopup.style.display = "none"));

  goToLogin &&
    (goToLogin.onclick = () => {
      const redirect = loginPopup.getAttribute("data-redirect");
      window.location.href = redirect ? `signin.html?redirect=${redirect}` : "signin.html";
    });

  // Product / Category cards
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", async (e) => {
      e.preventDefault();
      const targetPage = card.getAttribute("data-link");
      if (!targetPage) return;

      if (!(await isUserLoggedIn())) {
        showLoginPopup(targetPage);
      } else {
        showLoaderAndGo(targetPage);
      }
    });
  });

  // Cart button
  const cartBtn = document.querySelector(".cart");
  if (cartBtn) {
    cartBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!(await isUserLoggedIn())) {
        showLoginPopup("cart.html");
      } else {
        showLoaderAndGo("cart.html");
      }
    });
  }

  // Close popup on outside click
  window.addEventListener("click", (e) => {
    if (e.target === loginPopup) loginPopup.style.display = "none";
  });
});

/* ==============================
   SEARCH BAR + SUGGESTIONS
============================== */
const searchInput = document.querySelector(".search-bar input");
const suggestionsBox = document.getElementById("searchSuggestions");
const overlayEl = document.querySelector(".search-overlay");
const searchBar = document.querySelector(".search-bar");

const items = [
  { name: "Oranges", emoji: "🍊", link: "citrusfruits.html" },
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
let cachedLoginState = null;

searchBar?.addEventListener("click", () => {
  searchBar.classList.add("scale");
  searchInput?.focus();
});
document.addEventListener("click", (event) => {
  if (searchBar && !searchBar.contains(event.target)) {
    searchBar.classList.remove("scale");
  }
});

async function checkLogin() {
  if (cachedLoginState !== null) return cachedLoginState;
  try {
    const res = await fetch("/getUser", { credentials: "include" });
    const data = await res.json();
    cachedLoginState = data.loggedIn === true;
  } catch {
    cachedLoginState = false;
  }
  return cachedLoginState;
}

const loginPopup = document.getElementById("loginPopup");
const goToLogin = document.getElementById("goToLogin");
const closePopup = document.getElementById("closePopup");

function showLoginPopup(redirectPage) {
  loginPopup.style.display = "flex";
  loginPopup.setAttribute("data-redirect", redirectPage || "");
}
closePopup && (closePopup.onclick = () => (loginPopup.style.display = "none"));
goToLogin &&
  (goToLogin.onclick = () => {
    const redirect = loginPopup.getAttribute("data-redirect");
    window.location.href = redirect ? `signin.html?redirect=${redirect}` : "signin.html";
  });

function renderSuggestions(filtered) {
  suggestionsBox.innerHTML = filtered
    .map((item, i) => {
      const q = (searchInput?.value || "").toLowerCase();
      const highlighted = item.name.replace(new RegExp(q, "gi"), (m) => `<mark>${m}</mark>`);
      return `<div class="suggestion-item" data-link="${item.link}" data-index="${i}">${item.emoji} ${highlighted}</div>`;
    })
    .join("");
  suggestionsBox.classList.add("s-show");
  overlayEl.classList.add("search-show");
}

let debounceTimer;
searchInput?.addEventListener("input", () => {
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

    const filtered = items.filter((item) => item.name.toLowerCase().includes(query));
    if (!filtered.length) {
      suggestionsBox.innerHTML = `<p class="no-result">No Items Found ❌</p>`;
      suggestionsBox.classList.add("s-show");
      overlayEl.classList.add("search-show");
      return;
    }
    renderSuggestions(filtered);
  }, 120);
});

suggestionsBox?.addEventListener("click", async (e) => {
  const item = e.target.closest(".suggestion-item");
  if (!item) return;
  const link = item.getAttribute("data-link");
  const loggedIn = await checkLogin();
  if (!loggedIn) showLoginPopup(link);
  else showLoaderAndGo(link);

  suggestionsBox.classList.remove("s-show");
  overlayEl.classList.remove("search-show");
  searchBar.classList.remove("scale");
});

overlayEl?.addEventListener("click", () => {
  suggestionsBox.classList.remove("s-show");
  overlayEl.classList.remove("search-show");
  searchBar.classList.remove("scale");
});





/* ==============================
   GO TO ITEM DETAILS
============================== */

const itemData = {
  Orange: { price: 25, desc: "Juicy Fruit", image: "assets/orange.png", prices: { "1kg": 43, "500g": 25 } },
  Lemon: { price: 25, desc: "Juicy Fruit", image: "assets/lemon.png", prices: { "1kg": 45, "500g": 25 } },
  Mosambi: { price: 25, desc: "Juicy Fruit", image: "assets/mosambi.png", prices: { "1kg": 53, "500g": 25 } },
  Mango: { price: 25, desc: "Juicy Fruit", image: "assets/mango.png", prices: { "1kg": 97, "500g": 56 } },
  Banana: { price: 25, desc: "Juicy Fruit", image: "assets/banana.png", prices: { "1kg": 22, "500g": 34 } },
  Papaya: { price: 25, desc: "Juicy Fruit", image: "assets/papaya.png", prices: { "1kg": 43, "500g": 12 } },
  Guava: { price: 25, desc: "Juicy Fruit", image: "assets/guava.png", prices: { "1kg": 50, "500g": 25 } },
  Strawberry: { price: 25, desc: "Juicy Fruit", image: "assets/strawberry.png", prices: { "1kg": 100, "500g": 57 } },
  Coconut: { price: 25, desc: "Juicy Fruit", image: "assets/coconut.png", prices: { "1kg": 80, "500g": 40 } },
  Jackfruit: { price: 25, desc: "Juicy Fruit", image: "assets/jackfruit.png", prices: { "1kg": 43, "500g": 25 } },
  Watermelon: { price: 25, desc: "Juicy Fruit", image: "assets/watermelon.png", prices: { "1kg": 43, "500g": 25 } },
  Muskmelon: { price: 25, desc: "Juicy Fruit", image: "assets/muskmelon.png", prices: { "1kg": 43, "500g": 25 } },
  Spinach: { price: 25, desc: "Leafy Vegetable", image: "assets/spinach.png", prices: { "1kg": 43, "500g": 25 } },
  Coriander: { price: 25, desc: "Leafy Vegetable", image: "assets/coriander.png", prices: { "1kg": 43, "500g": 25 } },
  Carrot: { price: 25, desc: "Vegetable", image: "assets/carrot.png", prices: { "1kg": 43, "500g": 25 } },
  Beetroot: { price: 25, desc: "Vegetable", image: "assets/beetroot.png", prices: { "1kg": 43, "500g": 25 } },
  Tomato: { price: 25, desc: "Vegetable", image: "assets/tomato.png", prices: { "1kg": 43, "500g": 25 } },
  Brinjal: { price: 25, desc: "Vegetable", image: "assets/brinjal.png", prices: { "1kg": 43, "500g": 25 } },
  Ladysfinger: { price: 25, desc: "Vegetable", image: "assets/ladysfinger.jpeg", prices: { "1kg": 43, "500g": 25 } },
  Potato: { price: 25, desc: "Vegetable", image: "assets/potato.png", prices: { "1kg": 43, "500g": 25 } },
  Onion: { price: 25, desc: "Vegetable", image: "assets/onion.png", prices: { "1kg": 43, "500g": 25 } },
  Garlic: { price: 25, desc: "Vegetable", image: "assets/garlic.png", prices: { "1kg": 43, "500g": 25 } },
};







function goToItem(name) {
  const data = itemData[name];
  if (!data) return alert("Item details not found!");

  // Construct full data into URL parameters
  const params = new URLSearchParams({
    name: data.name || name,
    desc: data.desc || "Fresh item",
    image: data.image,
    price1kg: data.prices?.["1kg"] || data.price || 0,
    price500g: data.prices?.["500g"] || 0
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