/* ============================================================================
   app.js — tab switching + renders each panel from KPI_DATA (data.js)
   using the component builders in charts.js.
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  renderOverview();
  renderRevenue();
  renderShrink();
  renderRoute();
  renderDelivery();
  renderFinance();
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

/* -------------------------------------------------------------- overview */

function renderOverview() {
  const panel = document.getElementById("panel-overview");
  const rev = KPI_DATA.revenue;
  const shrink = KPI_DATA.shrink;
  const route = KPI_DATA.route;
  const delivery = KPI_DATA.delivery;
  const finance = KPI_DATA.finance;

  const headline = [
    { label: "YTD Revenue", value: rev.goalMeter.ytdSales, format: "currency", delta: rev.goalMeter.yoyPercent, deltaLabel: "YoY" },
    { label: "Shrink % of Sales", value: shrink.stats[1].value, format: "percent", delta: shrink.stats[1].delta, deltaLabel: "vs last month", inverse: true },
    { label: "On-Time Delivery", value: delivery.stats[0].value, format: "percent", delta: delivery.stats[0].delta, deltaLabel: "vs last month" },
    { label: "Active Routes", value: route.stats[0].value, format: "number", delta: route.stats[0].delta, deltaType: route.stats[0].deltaType, deltaLabel: "vs last month" },
    { label: "Gross Margin", value: finance.stats[0].value, format: "percent", delta: finance.stats[0].delta, deltaLabel: "vs last month" },
    { label: "Net Income (MTD)", value: finance.stats[1].value, format: "currency", delta: finance.stats[1].delta, deltaLabel: "vs last month" },
  ];

  const meterCard = createGoalMeter(rev.goalMeter, "2026 Sales Goal Tracker");
  panel.appendChild(el("div", { class: "grid" }, [el("div", { class: "card-wide" }, meterCard)]));

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
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Monthly Revenue — This Year vs Last Year"),
      createLineChart({ labels: data.monthlyTrend.labels, series: data.monthlyTrend.series, format: "currency" }),
    ]),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Revenue by Channel (YTD)"),
      createBarChart({ labels: data.byChannel.labels, values: data.byChannel.values, colorVar: "var(--brand-400)", format: "currency" }),
    ]),
  ]));
}

/* ---------------------------------------------------------------- shrink */

function renderShrink() {
  const panel = document.getElementById("panel-shrink");
  const data = KPI_DATA.shrink;

  renderStatGrid(panel, data.stats);

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Shrink % Trend"),
      createLineChart({ labels: data.trend.labels, series: data.trend.series, format: "percent" }),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Shrink $ by Category (MTD)"),
      createBarChart({ labels: data.byCategory.labels, values: data.byCategory.values, colorVar: "var(--cat-8)", format: "currency" }),
    ]),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Locations to Watch"),
      createTable(
        [
          { key: "location", label: "Location" },
          { key: "shrinkPct", label: "Shrink %", numeric: true, render: (v) => `${v.toFixed(1)}%` },
          { key: "shrinkDollars", label: "Shrink $", numeric: true, render: (v) => formatFull(v, "currency") },
          { key: "status", label: "Status", render: (v) => statusPill(v, v === "good" ? "On target" : v === "warning" ? "Watch" : "Over target") },
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

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Stops per Route (Today)"),
      createBarChart({ labels: data.stopsByRoute.labels, values: data.stopsByRoute.values, colorVar: "var(--cat-1)", format: "number" }),
    ]),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Driver Performance"),
      createTable(
        [
          { key: "name", label: "Driver" },
          { key: "route", label: "Route" },
          { key: "onTimePct", label: "On-Time %", numeric: true, render: (v) => `${v.toFixed(1)}%` },
          { key: "stops", label: "Stops", numeric: true },
          { key: "incidents", label: "Incidents", numeric: true },
          { key: "status", label: "Status", render: (v) => statusPill(v, v === "good" ? "On target" : v === "warning" ? "Watch" : "Needs coaching") },
        ],
        data.drivers
      ),
    ]),
  ]));
}

/* --------------------------------------------------------------- delivery */

function renderDelivery() {
  const panel = document.getElementById("panel-delivery");
  const data = KPI_DATA.delivery;

  renderStatGrid(panel, data.stats);

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "On-Time Delivery Trend"),
      createLineChart({ labels: data.onTimeTrend.labels, series: data.onTimeTrend.series, format: "percent" }),
    ]),
    el("div", { class: "card" }, [
      el("div", { class: "card-title" }, "Delivery Volume by Type (MTD)"),
      createBarChart({ labels: data.volumeByType.labels, values: data.volumeByType.values, colorVar: "var(--cat-3)", format: "number" }),
    ]),
  ]));
}

/* ---------------------------------------------------------------- finance */

function renderFinance() {
  const panel = document.getElementById("panel-finance");
  const data = KPI_DATA.finance;

  renderStatGrid(panel, data.stats);

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Revenue vs Expenses"),
      createLineChart({ labels: data.revenueVsExpenses.labels, series: data.revenueVsExpenses.series, format: "currency" }),
    ]),
  ]));

  panel.appendChild(el("div", { class: "grid" }, [
    el("div", { class: "card card-wide" }, [
      el("div", { class: "card-title" }, "Gross Margin Trend"),
      createLineChart({ labels: data.marginTrend.labels, series: data.marginTrend.series, format: "percent" }),
    ]),
  ]));
}
