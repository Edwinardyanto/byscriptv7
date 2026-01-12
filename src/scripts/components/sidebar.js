const sidebarConfig = {
  brand: {
    label: "ByScript",
    shortLabel: "B",
    href: "index.html",
  },
  primary: [
    {
      label: "Dashboard",
      path: "index.html",
      matches: ["index.html", "/"],
    },
    {
      label: "Autotraders",
      path: "pages/autotraders.html",
      matches: ["autotraders"],
    },
    {
      label: "Trading Plans",
      path: "pages/backtest.html",
      matches: ["backtest"],
    },
    {
      label: "Trade History",
      path: "pages/trade-history.html",
      matches: ["trade-history"],
    },
    {
      label: "Activity",
      path: "pages/activity.html",
      matches: ["activity"],
    },
  ],
  utility: [
    {
      label: "Exchanges",
      path: "pages/exchanges.html",
      matches: ["exchanges"],
    },
    {
      label: "Affiliate",
      path: "pages/affiliate.html",
      matches: ["affiliate"],
    },
  ],
  account: [
    {
      label: "Settings",
      action: "settings",
    },
    {
      label: "Logout",
      action: "logout",
    },
  ],
};

const getBasePrefix = () => {
  const pathname = window.location.pathname;
  if (pathname.includes("/pages/autotraders/")) {
    return "../../";
  }
  if (pathname.includes("/pages/")) {
    return "../";
  }
  return "";
};

const getHref = (path, basePrefix) => {
  const normalized = path.replace(/^\//, "");
  return `${basePrefix}${normalized}`;
};

const isActiveRoute = (matches, pathname) => {
  if (matches.some((match) => match === "/") && pathname === "/") {
    return true;
  }
  return matches.some((match) => pathname.includes(match));
};

const createNavItem = ({ label, href, isActive }) => {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.className = "sidebar-item";
  link.href = href;

  if (isActive) {
    link.classList.add("sidebar-item--active");
    link.setAttribute("aria-current", "page");
  }

  const icon = document.createElement("span");
  icon.className = "sidebar-icon";
  const text = document.createElement("span");
  text.className = "sidebar-label";
  text.textContent = label;

  link.append(icon, text);
  li.appendChild(link);
  return li;
};

const createActionItem = ({ label, action }) => {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.className = "sidebar-item";
  link.href = "#";
  link.dataset.action = action;

  const icon = document.createElement("span");
  icon.className = "sidebar-icon";
  const text = document.createElement("span");
  text.className = "sidebar-label";
  text.textContent = label;

  link.append(icon, text);
  li.appendChild(link);
  return li;
};

const buildNavList = (items, { basePrefix, pathname, allowActive = true }) => {
  const list = document.createElement("ul");
  items.forEach((item) => {
    if (item.path) {
      const href = getHref(item.path, basePrefix);
      const isActive = allowActive && isActiveRoute(item.matches ?? [], pathname);
      list.appendChild(createNavItem({ label: item.label, href, isActive }));
    } else {
      list.appendChild(createActionItem(item));
    }
  });
  return list;
};

const getSidebarContext = () => {
  const title = document.body?.dataset.sidebarContextTitle;
  const itemsRaw = document.body?.dataset.sidebarContextItems;
  if (!title || !itemsRaw) {
    return null;
  }

  let items = [];
  try {
    const parsed = JSON.parse(itemsRaw);
    if (Array.isArray(parsed)) {
      items = parsed;
    }
  } catch (error) {
    return null;
  }

  if (!items.length) {
    return null;
  }

  return { title, items };
};

const createBrandSection = ({ href, label, shortLabel }) => {
  const header = document.createElement("div");
  header.className = "sidebar-header";
  header.setAttribute("role", "link");
  header.setAttribute("tabindex", "0");
  header.dataset.sidebarBrand = "true";

  const logo = document.createElement("div");
  logo.className = "sidebar-logo";
  logo.setAttribute("aria-hidden", "true");
  logo.textContent = shortLabel;

  const text = document.createElement("span");
  text.className = "sidebar-logo-text";
  text.textContent = label;

  header.append(logo, text);

  const navigate = () => {
    window.location.href = href;
  };

  header.addEventListener("click", navigate);
  header.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate();
    }
  });

  return header;
};

export const renderSidebar = () => {
  const nav = document.querySelector("[data-sidebar]");
  if (!nav) {
    return;
  }

  nav.innerHTML = "";

  const pathname = window.location.pathname;
  const basePrefix = getBasePrefix();

  nav.appendChild(
    createBrandSection({
      ...sidebarConfig.brand,
      href: getHref(sidebarConfig.brand.href, basePrefix),
    })
  );

  const scrollable = document.createElement("div");
  scrollable.className = "scrollable";

  scrollable.appendChild(
    buildNavList(sidebarConfig.primary, {
      basePrefix,
      pathname,
    })
  );

  const context = getSidebarContext();
  if (context) {
    const title = document.createElement("div");
    title.className = "section-subtitle";
    title.textContent = context.title;
    scrollable.appendChild(title);
    scrollable.appendChild(
      buildNavList(context.items, {
        basePrefix,
        pathname,
        allowActive: false,
      })
    );
  }

  scrollable.appendChild(
    buildNavList(sidebarConfig.utility, {
      basePrefix,
      pathname,
    })
  );

  nav.appendChild(scrollable);

  const footer = document.createElement("div");
  footer.className = "sidebar-footer";
  footer.appendChild(
    buildNavList(sidebarConfig.account, {
      basePrefix,
      pathname,
      allowActive: false,
    })
  );
  nav.appendChild(footer);
};

const bindSidebarToggle = () => {
  const appRoot = document.getElementById("app");
  const toggle = document.querySelector(".sidebar-toggle");
  if (!toggle) {
    return;
  }
  toggle.addEventListener("click", () => {
    const isCollapsed = appRoot?.classList.toggle("has-sidebar-collapsed");
    toggle.setAttribute("aria-expanded", String(!isCollapsed));
  });
};

export const initSidebar = () => {
  renderSidebar();
  bindSidebarToggle();
};
