const SIDEBAR_STATE_KEY = "byscript.sidebarCollapsed";

const applySidebarState = (appRoot, toggle, isCollapsed) => {
  appRoot.classList.toggle("has-sidebar-collapsed", isCollapsed);
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(!isCollapsed));
  }
};

export const initSidebarToggle = () => {
  const appRoot = document.getElementById("app");
  if (!appRoot) {
    return;
  }

  const toggle = document.querySelector(".sidebar-toggle");
  const storedState = window.localStorage.getItem(SIDEBAR_STATE_KEY);
  const isCollapsed = storedState === "true";
  applySidebarState(appRoot, toggle, isCollapsed);

  if (!toggle || toggle.dataset.sidebarBound) {
    return;
  }

  toggle.dataset.sidebarBound = "true";
  toggle.addEventListener("click", () => {
    const nextState = appRoot.classList.toggle("has-sidebar-collapsed");
    window.localStorage.setItem(SIDEBAR_STATE_KEY, String(nextState));
    toggle.setAttribute("aria-expanded", String(!nextState));
  });
};
