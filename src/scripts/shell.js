const closePanels = ({ panels, toggles }) => {
  panels.forEach((panel) => {
    panel.hidden = true;
  });
  toggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", "false");
  });
};

const openPanel = ({ name, panels, toggles }) => {
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.shellPanel !== name;
  });
  toggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", String(toggle.dataset.shellToggle === name));
  });
};

const bindSidebarToggle = () => {
  const toggle = document.querySelector(".sidebar-toggle");
  if (!toggle || toggle.dataset.shellBound) {
    return;
  }

  toggle.dataset.shellBound = "true";
  toggle.addEventListener("click", () => {
    const appRoot = document.getElementById("app");
    if (!appRoot) {
      return;
    }
    const isCollapsed = appRoot.classList.toggle("has-sidebar-collapsed");
    toggle.setAttribute("aria-expanded", String(!isCollapsed));
  });
};

const bindHeaderToggles = () => {
  const toggles = Array.from(document.querySelectorAll("[data-shell-toggle]"));
  const panels = Array.from(document.querySelectorAll("[data-shell-panel]"));

  if (toggles.length === 0 && panels.length === 0) {
    return;
  }

  const state = { panels, toggles };

  toggles.forEach((toggle) => {
    if (toggle.dataset.shellBound) {
      return;
    }
    toggle.dataset.shellBound = "true";
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const name = toggle.dataset.shellToggle;
      const panel = panels.find((item) => item.dataset.shellPanel === name);
      if (!panel) {
        return;
      }
      if (!panel.hidden) {
        closePanels(state);
        return;
      }
      openPanel({ ...state, name });
    });
  });

  document.querySelectorAll("[data-shell-close]").forEach((button) => {
    if (button.dataset.shellBound) {
      return;
    }
    button.dataset.shellBound = "true";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closePanels(state);
    });
  });

  if (document.documentElement.dataset.shellPanelsBound) {
    return;
  }

  document.documentElement.dataset.shellPanelsBound = "true";
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (target.closest("[data-shell-panel]") || target.closest("[data-shell-toggle]")) {
      return;
    }
    closePanels(state);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanels(state);
    }
  });
};

export const initShell = () => {
  bindSidebarToggle();
  bindHeaderToggles();
};

initShell();
