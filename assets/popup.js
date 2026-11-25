(function () {
  const overlay = document.getElementById("popupOverlay");
  const openBtn = document.getElementById("fab");
  const closeBtn = document.getElementById("popupClose");
  const dismissBtn = document.getElementById("popupDismiss");
  const cta = document.getElementById("popupCta");
  const storageKey = "calcompute-popup-dismissed";

  if (!overlay) return;

  let lastFocus = null;
  const params = new URLSearchParams(window.location.search);
  const embedMode = params.get("embed") === "1";

  if (embedMode) {
    document.body.classList.add("embed");
  }

  function openPopup() {
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.setTimeout(function () {
      cta.focus();
    }, 60);
  }

  function closePopup() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function dismissForever() {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch (e) {
      /* ignore */
    }
    closePopup();
  }

  openBtn && openBtn.addEventListener("click", openPopup);
  closeBtn && closeBtn.addEventListener("click", dismissForever);
  dismissBtn && dismissBtn.addEventListener("click", dismissForever);

  cta && cta.addEventListener("click", function () {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch (e) {
      /* ignore */
    }
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) dismissForever();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("open")) {
      dismissForever();
    }
  });

  let dismissed = false;
  try {
    dismissed = window.localStorage.getItem(storageKey) === "1";
  } catch (e) {
    dismissed = false;
  }

  if (embedMode) {
    window.setTimeout(openPopup, 450);
  } else if (!dismissed) {
    window.setTimeout(openPopup, 2600);
  }
})();
