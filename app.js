/* ============================================================================
   app.js — tab switching + renders each panel from KPI_DATA (data.js)
   using the component builders in charts.js.
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupSidebarToggle();
  setupHeaderToggle();
  renderOverview();
  renderRevenue();
  renderShrink();
  renderRoute();
  renderDelivery();
  renderFinance();
  renderProducts();
  renderOperations();
});

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function setupSidebarToggle() {
  const nav = document.querySelector(".side-nav");
  const btn = document.getElementById("sidebar-toggle");

  const applyState = (collapsed) => {
    nav.classList.toggle("collapsed", collapsed);
    btn.textContent = collapsed ? "›" : "‹";
    btn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  };

  applyState(localStorage.getItem("sidebarCollapsed") === "true");

  btn.addEventListener("click", () => {
    const collapsed = !nav.classList.contains("collapsed");
    applyState(collapsed);
    localStorage.setItem("sidebarCollapsed", collapsed);
  });
}

// Collapses the top bar to free up vertical room — handy when comparing two
// months of charts side by side. Remembered like the sidebar's collapse state.
function setupHeaderToggle() {
  const btn = document.getElementById("header-toggle");
  if (!btn) return;   // never let a missing control stop the panels rendering

  const applyState = (hidden) => {
    document.body.classList.toggle("header-hidden", hidden);
    btn.textContent = hidden ? "▾" : "▴";
    const label = hidden ? "Show top bar" : "Hide top bar";
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  };

  applyState(localStorage.getItem("headerHidden") === "true");

  btn.addEventListener("click", () => {
    const hidden = !document.body.classList.contains("header-hidden");
    applyState(hidden);
    localStorage.setItem("headerHidden", hidden);
  });
}

/* -------------------------------------------------------------- overview */

// Year-over-year is derived from the cumulative tracker rather than stored as a
// number, so it can't silently go stale the way a hardcoded figure does. It
// compares 2026 and 2025 at the last month 2026 actually has an actual for, so
// both sides always cover the same span of the year.
function computeYoY(cumulativeTracker) {
  const seriesBy = (name) => cumulativeTracker.series.find((s) => s.name === name);
  const actual = seriesBy("Actual Cumulative Total").values;
  const prior = seriesBy("2025 Cumulative Total").values;

  let last = -1;
  actual.forEach((v, i) => { if (v != null) last = i; });
  if (last < 0 || !prior[last]) return { percent: null, label: "vs last year" };

  return {
    percent: ((actual[last] - prior[last]) / prior[last]) * 100,
    label: `vs Jan–${cumulativeTracker.labels[last]} 2025`,
  };
}

function renderOverview() {
  const panel = document.getElementById("panel-overview");
  const rev = KPI_DATA.revenue;
  const shrink = KPI_DATA.shrink;
  const delivery = KPI_DATA.delivery;
  const finance = KPI_DATA.finance;
  // Looked up by label rather than position, so regrouping or reordering the
  // Operations metrics can't silently point this tile at the wrong number.
  const avgFill = operationsStats().find((s) => s.label === "Average Fill");
  const yoy = computeYoY(rev.cumulativeTracker);

  // These reuse the source stat objects wholesale rather than re-listing each
  // field, so formatting details (decimals, exact, inverse, history) can't drift
  // out of sync with how the same metric renders on its own tab.
  const headline = [
    { label: "YTD Revenue", value: rev.goalMeter.ytdSales, format: "currency", delta: yoy.percent, deltaLabel: yoy.label,
      history: rev.monthlyActual.labels.map((label, i) => ({ label, value: rev.monthlyActual.values[i] })) },
    { ...shrink.stats[1] },
    { ...delivery.stats[2] },
    { ...avgFill },
    { ...finance.stats[0] },
    { ...finance.stats[1] },
  ];

  const meterCard = createGoalMeter(rev.goalMeter, "2026 Sales Goal Tracker", { thermometer: true, hero: true });
  panel.appendChild(el("div", { class: "grid" }, [el("div", { class: "card-wide" }, meterCard)]));

  if (rev.goalMeter.funFact) {
    panel.appendChild(el("div", { class: "grid" }, [
      el("div", { class: "card-wide" }, createFunFactCard(rev.goalMeter.funFact)),
    ]));
  }

  panel.appendChild(el("div", { class: "section-label" }, "Headline KPIs"));
  renderStatGrid(panel, headline);
}

/* --------------------------------------------------------------- revenue */

function renderRevenue() {
  const panel = document.getElementById("panel-revenue");
  const data = KPI_DATA.revenue;

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card-wide" }, createGoalMeter(data.goalMeter, "2026 Sales Goal Tracker")),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Sales Goal Tracker — Cumulative Goal vs Actual vs Last Year",
      createLineChart({ labels: data.cumulativeTracker.labels, series: data.cumulativeTracker.series, format: "currency", yMax: 12000000 }),
      () => createLineChart({ labels: data.cumulativeTracker.labels, series: data.cumulativeTracker.series, format: "currency", yMax: 12000000, height: 420, expanded: true }),
      "card-wide"
    ),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Revenue by Channel (YTD)",
      createBarChart({ labels: data.byChannel.labels, values: data.byChannel.values, colorVar: "var(--brand-400)", format: "currency" }),
      () => createBarChart({ labels: data.byChannel.labels, values: data.byChannel.values, colorVar: "var(--brand-400)", format: "currency", height: 380 })
    ),
  ]));
}

/* ---------------------------------------------------------------- shrink */

function renderShrink() {
  const panel = document.getElementById("panel-shrink");
  const data = KPI_DATA.shrink;

  renderStatGrid(panel, data.stats);

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Micro-Market Shrink % — Month by Month",
      createLineChart({ labels: data.trend.labels, series: data.trend.series, format: "percent", decimals: 2 }),
      () => createLineChart({ labels: data.trend.labels, series: data.trend.series, format: "percent", decimals: 2, height: 420, expanded: true }),
      "card-wide"
    ),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, `Top 10 Worst Micro-Markets by Shrink % (${CURRENT_MONTH})`),
      createTable(
        [
          { key: "location", label: "Customer" },
          { key: "shrinkPct", label: "Shrink %", numeric: true, render: (v) => `${v.toFixed(2)}%` },
          { key: "shrinkDollars", label: "Shrink $", numeric: true, render: (v) => formatFull(v, "currency") },
        ],
        data.topLocations
      ),
    ]),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      `% Shrink by Route (${CURRENT_MONTH})`,
      createBarChart({ labels: data.byRoutePct.labels, values: data.byRoutePct.values, colors: ROUTE_COLORS, format: "percent" }),
      () => createBarChart({ labels: data.byRoutePct.labels, values: data.byRoutePct.values, colors: ROUTE_COLORS, format: "percent", height: 380 })
    ),
  ]));
}

/* ------------------------------------------------------------------ route */

function renderRoute() {
  const panel = document.getElementById("panel-route");
  const data = KPI_DATA.route;

  renderStatGrid(panel, data.stats);

  const { row: byRouteRow, panel: comparePanel } = sectionLabelWithToggle("By Route", "Compare to Previous Month");
  panel.appendChild(byRouteRow);

  const prev = data.previousMonth;
  comparePanel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      `$ Revenue per Route (${prev.label})`,
      createPieChart({ labels: prev.revenueByRoute.labels, values: prev.revenueByRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: prev.revenueByRoute.labels, values: prev.revenueByRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
    chartCard(
      `$ Spoilage per Route (${prev.label})`,
      createPieChart({ labels: prev.spoilageByRoute.labels, values: prev.spoilageByRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: prev.spoilageByRoute.labels, values: prev.spoilageByRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
    chartCard(
      `$ Shrink per Route (${prev.label})`,
      createPieChart({ labels: prev.shrinkByRoute.labels, values: prev.shrinkByRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: prev.shrinkByRoute.labels, values: prev.shrinkByRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
  ]));
  // Comparison panel (previous month) is inserted before the current-month
  // grid below, so expanding it reads chronologically: before, then after.
  panel.appendChild(comparePanel);

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      `$ Revenue per Route (${CURRENT_MONTH})`,
      createPieChart({ labels: data.revenueByRoute.labels, values: data.revenueByRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: data.revenueByRoute.labels, values: data.revenueByRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
    chartCard(
      `$ Spoilage per Route (${CURRENT_MONTH})`,
      createPieChart({ labels: data.spoilageByRoute.labels, values: data.spoilageByRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: data.spoilageByRoute.labels, values: data.spoilageByRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
    chartCard(
      `$ Shrink per Route (${CURRENT_MONTH})`,
      createPieChart({ labels: KPI_DATA.shrink.byRoute.labels, values: KPI_DATA.shrink.byRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: KPI_DATA.shrink.byRoute.labels, values: KPI_DATA.shrink.byRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Total Assets Serviced This Week (by Route)",
      createBarChart({ labels: data.weeklyAssetsByRoute.labels, values: data.weeklyAssetsByRoute.values, colors: ROUTE_COLORS, format: "number" }),
      () => createBarChart({ labels: data.weeklyAssetsByRoute.labels, values: data.weeklyAssetsByRoute.values, colors: ROUTE_COLORS, format: "number", height: 380 }),
      "card-wide"
    ),
  ]));
}

/* --------------------------------------------------------------- delivery */

function renderDelivery() {
  const panel = document.getElementById("panel-delivery");
  const data = KPI_DATA.delivery;

  renderStatGrid(panel, data.stats);
}

/* ---------------------------------------------------------------- finance */

function renderFinance() {
  const panel = document.getElementById("panel-finance");
  const data = KPI_DATA.finance;

  renderStatGrid(panel, data.stats);

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Revenue vs Expenses",
      createLineChart({ labels: data.revenueVsExpenses.labels, series: data.revenueVsExpenses.series, format: "currency" }),
      () => createLineChart({ labels: data.revenueVsExpenses.labels, series: data.revenueVsExpenses.series, format: "currency", height: 420, expanded: true }),
      "card-wide"
    ),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Gross Margin Trend",
      createLineChart({ labels: data.marginTrend.labels, series: data.marginTrend.series, format: "percent" }),
      () => createLineChart({ labels: data.marginTrend.labels, series: data.marginTrend.series, format: "percent", height: 420, expanded: true }),
      "card-wide"
    ),
  ]));
}

/* --------------------------------------------------------------- products */

function momChangeCell(pts) {
  const dir = pts === 0 ? "flat" : pts > 0 ? "up" : "down";
  const arrow = pts === 0 ? "→" : pts > 0 ? "↑" : "↓";
  const sign = pts > 0 ? "+" : "";
  return el("span", { class: `delta ${dir}` }, `${arrow} ${sign}${pts.toFixed(2)} pts`);
}

function renderProducts() {
  const panel = document.getElementById("panel-products");
  const data = KPI_DATA.products;

  renderStatGrid(panel, data.stats);

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Net Margin % by Product Category"),
      el("div", { class: "table-scroll" }, createTable(
        [
          { key: "category", label: "Category" },
          { key: "marginPct", label: "Net Margin %", numeric: true, history: true, format: "percent", decimals: 2, render: (v) => `${v.toFixed(2)}%` },
          { key: "momChangePts", label: "Change vs Last Month", numeric: true, render: momChangeCell },
        ],
        data.marginByCategory
      )),
    ]),
  ]));

  const topVariance = [...data.marginByCategory]
    .sort((a, b) => Math.abs(b.momChangePts) - Math.abs(a.momChangePts))
    .slice(0, 5);

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Top 5 Category Movers (Month over Month)"),
      createTable(
        [
          { key: "category", label: "Category" },
          { key: "marginPct", label: "Net Margin %", numeric: true, history: true, format: "percent", decimals: 2, render: (v) => `${v.toFixed(2)}%` },
          { key: "momChangePts", label: "Change vs Last Month", numeric: true, render: momChangeCell },
        ],
        topVariance
      ),
    ]),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Total Margin % — Month by Month",
      createLineChart({ labels: data.marginTrend.labels, series: data.marginTrend.series, format: "percent", decimals: 2 }),
      () => createLineChart({ labels: data.marginTrend.labels, series: data.marginTrend.series, format: "percent", decimals: 2, height: 420, expanded: true }),
      "card-wide"
    ),
  ]));
}

/* ------------------------------------------------------------- operations */

// [display heading, key in KPI_DATA.operations] — drives both the tab's
// section order and the flattened lookup used by the Overview tile.
const OPERATIONS_GROUPS = [
  ["Warehouse", "warehouse"],
  ["Scheduling", "scheduling"],
  ["Maintenance", "maintenance"],
];

function operationsStats() {
  return OPERATIONS_GROUPS.flatMap(([, key]) => KPI_DATA.operations[key] || []);
}

function renderOperations() {
  const panel = document.getElementById("panel-operations");
  const data = KPI_DATA.operations;

  OPERATIONS_GROUPS.forEach(([heading, key]) => {
    const stats = data[key] || [];
    panel.appendChild(el("div", { class: "section-label" }, heading));
    if (stats.length) {
      renderStatGrid(panel, stats);
    } else {
      panel.appendChild(el("div", { class: "grid" }, [
        el("div", { class: "card card-wide empty-note" }, "Nothing tracked here yet"),
      ]));
    }
  });
}
