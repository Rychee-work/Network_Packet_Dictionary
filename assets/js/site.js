(function () {
  // =========================
  // Ad gate: show .ad only when body[data-ads="on"]
  // =========================
  const adsOn = document.body && document.body.dataset.ads === "on";
  document.querySelectorAll(".ad").forEach((el) => {
    el.style.display = adsOn ? "block" : "none";
  });

  // =========================
  // Generic simple filter:
  // input[data-filter] filters [data-k] inside target container
  // =========================
  document.querySelectorAll("input[data-filter]").forEach((input) => {
    const targetSel = input.getAttribute("data-filter");
    const root = document.querySelector(targetSel);
    if (!root) return;
    const items = Array.from(root.querySelectorAll("[data-k]"));

    const norm = (s) => (s || "").toLowerCase().trim();
    const apply = () => {
      const q = norm(input.value);
      if (!q) {
        items.forEach((x) => (x.style.display = ""));
        return;
      }
      items.forEach((x) => {
        const k = norm(x.getAttribute("data-k"));
        const t = norm(x.textContent);
        x.style.display = k.includes(q) || t.includes(q) ? "" : "none";
      });
    };
    input.addEventListener("input", apply);
  });

  // =========================
  // Dictionary tabs + search (for /dictionary.html)
  // - Tabs: .tab-btn / .tab-panel
  // - Search: #layerSearch filters items in active panel only
  // =========================
  const tabs = Array.from(document.querySelectorAll(".tab-btn"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));
  const search = document.getElementById("layerSearch");

  // If the page doesn't have tabs, do nothing.
  if (!tabs.length || !panels.length) return;

  const norm = (s) => (s || "").toLowerCase().trim();

  function getActivePanel() {
    return document.querySelector(".tab-panel.active");
  }

  function filterActivePanel() {
    const active = getActivePanel();
    if (!active) return;
    const items = Array.from(active.querySelectorAll("[data-k]"));
    const q = norm(search ? search.value : "");
    if (!q) {
      items.forEach((x) => (x.style.display = ""));
      return;
    }
    items.forEach((x) => {
      const k = norm(x.getAttribute("data-k"));
      const t = norm(x.textContent);
      x.style.display = k.includes(q) || t.includes(q) ? "" : "none";
    });
  }

  function setActive(tabId) {
    tabs.forEach((btn) => {
      const on = btn.id === tabId;
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    panels.forEach((p) => p.classList.remove("active"));
    const activePanel = document.getElementById(
      "panel-" + tabId.split("-")[1]
    );
    if (activePanel) activePanel.classList.add("active");

    // reset search on layer switch (prevents "why empty?" confusion)
    if (search) search.value = "";
    filterActivePanel();
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => setActive(btn.id));
    btn.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(btn);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        tabs[(i + 1) % tabs.length].focus();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        tabs[(i - 1 + tabs.length) % tabs.length].focus();
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(btn.id);
      }
    });
  });

  if (search) {
    search.addEventListener("input", filterActivePanel);
  }

  // initial filtering state
  filterActivePanel();
})();
