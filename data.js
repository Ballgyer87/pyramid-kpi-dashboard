/* ============================================================================
   PLACEHOLDER DATA — Pyramid Food Service KPI Dashboard
   ----------------------------------------------------------------------------
   Everything in this file is FAKE data so the dashboard has something to show.
   When your team has real numbers, just change the values on the right side
   of each ":" — you don't need to touch any other file.

   Tip: numbers are plain (no $ or commas needed), the dashboard formats them.
   ============================================================================ */

const KPI_DATA = {

  // ------------------------------------------------------------ REVENUE ---
  revenue: {
    goalMeter: {
      ytdSales: 5427039,
      annualGoal: 11900000,
      lastWeekSales: 216046,
      weeklyTargetNeeded: 248960,
      weeksLeft: 26,
      yoyLabel: "June YoY Growth",
      yoyValue: 226506,
      yoyPercent: 29.3,
    },
    monthlyTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "2026 Revenue", color: "var(--cat-1)", values: [712000, 768000, 799000, 845000, 861000, 905000, 537039] },
        { name: "2025 Revenue", color: "var(--cat-4)", values: [640000, 690000, 715000, 760000, 780000, 700000, 690000] },
      ],
    },
    byChannel: {
      labels: ["Vending", "Micro-Markets / OCS", "Water Delivery"],
      values: [2650000, 1980000, 797039],
    },
  },

  // ------------------------------------------------------------- SHRINK ---
  shrink: {
    stats: [
      { label: "Shrink $ (MTD)", value: 8420, format: "currency", delta: -6.2, deltaLabel: "vs last month", inverse: true },
      { label: "Shrink % of Sales", value: 1.9, format: "percent", delta: -0.3, deltaLabel: "vs last month", inverse: true },
      { label: "Target Shrink %", value: 1.5, format: "percent", delta: null, deltaLabel: "goal" },
      { label: "Locations Over Target", value: 7, format: "number", delta: 2, deltaType: "count", deltaLabel: "vs last month", inverse: true },
    ],
    trend: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "Shrink %", color: "var(--cat-8)", values: [2.4, 2.2, 2.3, 2.0, 2.2, 1.9] },
      ],
    },
    byCategory: {
      labels: ["Snacks", "Beverages", "Fresh Food", "Water/OCS Supplies"],
      values: [3200, 2650, 1890, 680],
    },
    topLocations: [
      { location: "Riverbend Office Park", shrinkPct: 4.8, shrinkDollars: 1120, status: "critical" },
      { location: "Lakeside Manufacturing", shrinkPct: 3.6, shrinkDollars: 940, status: "warning" },
      { location: "Midtown Business Center", shrinkPct: 3.1, shrinkDollars: 810, status: "warning" },
      { location: "Harbor Logistics Hub", shrinkPct: 2.7, shrinkDollars: 605, status: "warning" },
      { location: "Cedar Grove Campus", shrinkPct: 1.4, shrinkDollars: 260, status: "good" },
    ],
  },

  // -------------------------------------------------------- ROUTE/DRIVER --
  route: {
    stats: [
      { label: "Active Routes", value: 18, format: "number", delta: 1, deltaType: "count", deltaLabel: "vs last month" },
      { label: "On-Time Route Completion", value: 94.2, format: "percent", delta: 1.1, deltaLabel: "vs last month" },
      { label: "Avg Stops / Route / Day", value: 26, format: "number", delta: -1, deltaType: "count", deltaLabel: "vs last month", inverse: true },
      { label: "Avg Service Time / Stop", value: 11.5, format: "minutes", delta: -0.4, deltaLabel: "vs last month", inverse: true },
    ],
    stopsByRoute: {
      labels: ["Route 1", "Route 2", "Route 3", "Route 4", "Route 5", "Route 6"],
      values: [142, 128, 156, 119, 133, 147],
    },
    drivers: [
      { name: "M. Alvarez", route: "Route 3", onTimePct: 98.1, stops: 156, incidents: 0, status: "good" },
      { name: "T. Brooks", route: "Route 1", onTimePct: 96.4, stops: 142, incidents: 0, status: "good" },
      { name: "J. Nguyen", route: "Route 6", onTimePct: 93.8, stops: 147, incidents: 1, status: "good" },
      { name: "R. Palmer", route: "Route 2", onTimePct: 91.0, stops: 128, incidents: 1, status: "warning" },
      { name: "S. Okafor", route: "Route 5", onTimePct: 89.5, stops: 133, incidents: 2, status: "warning" },
      { name: "D. Whitfield", route: "Route 4", onTimePct: 84.7, stops: 119, incidents: 3, status: "critical" },
    ],
  },

  // ----------------------------------------------------------- DELIVERY ---
  delivery: {
    stats: [
      { label: "On-Time Delivery Rate", value: 95.6, format: "percent", delta: 0.8, deltaLabel: "vs last month" },
      { label: "Deliveries Completed (MTD)", value: 3184, format: "number", delta: 4.5, deltaLabel: "vs last month" },
      { label: "Missed / Rescheduled", value: 22, format: "number", delta: -5, deltaType: "count", deltaLabel: "vs last month", inverse: true },
      { label: "Avg Delivery Window Accuracy", value: 12, format: "minutes", delta: -1.2, deltaLabel: "vs last month", inverse: true },
    ],
    onTimeTrend: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "On-Time %", color: "var(--cat-3)", values: [92.1, 93.4, 94.0, 94.8, 95.1, 95.6] },
      ],
    },
    volumeByType: {
      labels: ["Vending Restock", "Micro-Market", "Water/OCS"],
      values: [1520, 980, 684],
    },
  },

  // ------------------------------------------------------------ FINANCE ---
  finance: {
    stats: [
      { label: "Gross Margin", value: 42.8, format: "percent", delta: 1.3, deltaLabel: "vs last month" },
      { label: "Net Income (MTD)", value: 184200, format: "currency", delta: 6.1, deltaLabel: "vs last month" },
      { label: "Operating Expenses (MTD)", value: 322500, format: "currency", delta: 2.4, deltaLabel: "vs last month", inverse: true },
      { label: "AR Over 60 Days", value: 41800, format: "currency", delta: -9.8, deltaLabel: "vs last month", inverse: true },
    ],
    revenueVsExpenses: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "Revenue", color: "var(--cat-1)", values: [768000, 799000, 845000, 861000, 905000, 537039] },
        { name: "Expenses", color: "var(--cat-8)", values: [612000, 628000, 651000, 664000, 690000, 415000] },
      ],
    },
    marginTrend: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "Gross Margin %", color: "var(--cat-6)", values: [39.5, 40.1, 40.9, 41.5, 41.8, 42.8] },
      ],
    },
  },

};
