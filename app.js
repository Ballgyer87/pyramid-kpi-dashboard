/* ============================================================================
   app.js — tab switching + renders each panel from KPI_DATA (data.js)
   using the component builders in charts.js.
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupSidebarToggle();
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

/* -------------------------------------------------------------- overview */

function renderOverview() {
  const panel = document.getElementById("panel-overview");
  const rev = KPI_DATA.revenue;
  const shrink = KPI_DATA.shrink;
  const delivery = KPI_DATA.delivery;
  const finance = KPI_DATA.finance;
  const operations = KPI_DATA.operations;

  const headline = [
    { label: "YTD Revenue", value: rev.goalMeter.ytdSales, format: "currency", delta: rev.goalMeter.yoyPercent, deltaLabel: "YoY",
      history: rev.monthlyActual.labels.map((label, i) => ({ label, value: rev.monthlyActual.values[i] })) },
    { label: "Micro-Market Shrink %", value: shrink.stats[1].value, format: "percent", delta: shrink.stats[1].delta, deltaLabel: "vs last month", inverse: true, history: shrink.stats[1].history },
    { label: "Weekly $ per Delivery", value: delivery.stats[2].value, format: "currency", delta: delivery.stats[2].delta, deltaLabel: "vs last month" },
    { label: "Average Fill", value: operations.stats[3].value, format: "percent", delta: operations.stats[3].delta, deltaLabel: "vs last month" },
    { label: "Gross Margin", value: finance.stats[0].value, format: "percent", delta: finance.stats[0].delta, deltaLabel: "vs last month", history: finance.stats[0].history },
    { label: "Net Income (MTD)", value: finance.stats[1].value, format: "currency", delta: finance.stats[1].delta, deltaLabel: "vs last month" },
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
      createLineChart({ labels: data.trend.labels, series: data.trend.series, format: "percent" }),
      () => createLineChart({ labels: data.trend.labels, series: data.trend.series, format: "percent", height: 420, expanded: true }),
      "card-wide"
    ),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "Shrink $ by Category (MTD)",
      createBarChart({ labels: data.byCategory.labels, values: data.byCategory.values, colorVar: "var(--cat-8)", format: "currency" }),
      () => createBarChart({ labels: data.byCategory.labels, values: data.byCategory.values, colorVar: "var(--cat-8)", format: "currency", height: 380 })
    ),
    chartCard(
      "% Shrink by Route (June)",
      createBarChart({ labels: data.byRoutePct.labels, values: data.byRoutePct.values, colors: ROUTE_COLORS, format: "percent" }),
      () => createBarChart({ labels: data.byRoutePct.labels, values: data.byRoutePct.values, colors: ROUTE_COLORS, format: "percent", height: 380 })
    ),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Top 10 Worst Micro-Markets by Shrink % (June)"),
      createTable(
        [
          { key: "location", label: "Location" },
          { key: "shrinkPct", label: "Shrink %", numeric: true, render: (v) => `${v.toFixed(2)}%` },
          { key: "shrinkDollars", label: "Shrink $", numeric: true, render: (v) => formatFull(v, "currency") },
        ],
        data.topLocations
      ),
    ]),
  ]));
}

/* ------------------------------------------------------------------ route */

function renderRoute() {
  const panel = document.getElementById("panel-route");
  const data = KPI_DATA.route;

  renderStatGrid(panel, data.stats);

  panel.appendChild(el("div", { class: "section-label" }, "By Route"));
  panel.appendChild(el("div", { class: "grid" }, [
    chartCard(
      "$ Spoilage per Route (June)",
      createPieChart({ labels: data.spoilageByRoute.labels, values: data.spoilageByRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: data.spoilageByRoute.labels, values: data.spoilageByRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
    chartCard(
      "$ Shrink per Route (June)",
      createPieChart({ labels: KPI_DATA.shrink.byRoute.labels, values: KPI_DATA.shrink.byRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: KPI_DATA.shrink.byRoute.labels, values: KPI_DATA.shrink.byRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
    ),
    chartCard(
      "$ Revenue per Route (June)",
      createPieChart({ labels: data.revenueByRoute.labels, values: data.revenueByRoute.values, format: "currency", colors: ROUTE_COLORS }),
      () => createPieChart({ labels: data.revenueByRoute.labels, values: data.revenueByRoute.values, format: "currency", colors: ROUTE_COLORS, size: 380, expanded: true })
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
          { key: "marginPct", label: "Net Margin %", numeric: true, history: true, render: (v) => `${v.toFixed(2)}%` },
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
          { key: "marginPct", label: "Net Margin %", numeric: true, history: true, render: (v) => `${v.toFixed(2)}%` },
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

function renderOperations() {
  const panel = document.getElementById("panel-operations");
  const data = KPI_DATA.operations;

  renderStatGrid(panel, data.stats);
}
