/* ============================================================================
   PLACEHOLDER DATA — Pyramid Food Service KPI Dashboard
   ----------------------------------------------------------------------------
   Everything in this file is FAKE data so the dashboard has something to show.
   When your team has real numbers, just change the values on the right side
   of each ":" — you don't need to touch any other file.

   Tip: numbers are plain (no $ or commas needed), the dashboard formats them.
   Route names are defined once below — rename them there and they update
   everywhere (stops chart, driver table, shrink-by-route, the 3 pie charts).
   ============================================================================ */

const ROUTE_NAMES = ["Bulls", "Celtics", "Kings", "Lakers", "Magic", "Suns", "Thunder"];

const MONTHS_YTD = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const KPI_DATA = {

  // ------------------------------------------------------------ REVENUE ---
  revenue: {
    goalMeter: {
      ytdSales: 5427039,
      annualGoal: 11900000,
      lastWeekSales: 216046,
      weeklyTargetNeeded: 248960,
      weeksLeft: 26,
      yoyPercent: 29.3, // used by the "YTD Revenue" headline tile on the Overview tab
      // Update this before each week's meeting — whatever's worth calling out.
      funFact: "June revenue is up 29.3% year-over-year (+$226,506)!",
    },
    monthlyTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "2026 Revenue", color: "var(--cat-1)", values: [712000, 768000, 799000, 845000, 861000, 905000, 537039] },
        { name: "2025 Revenue", color: "var(--cat-4)", values: [640000, 690000, 715000, 760000, 780000, 700000, 690000] },
      ],
    },
    byChannel: {
      labels: ["Vending", "Micro-Markets", "Delivery"],
      values: [2650000, 1200000, 1577039],
    },
  },

  // ------------------------------------------------------------- SHRINK ---
  shrink: {
    stats: [
      { label: "Shrink $ (MTD)", value: 8420, format: "currency", delta: -6.2, deltaLabel: "vs last month", inverse: true },
      { label: "Shrink % of Sales", value: 1.9, format: "percent", delta: -0.3, deltaLabel: "vs last month", inverse: true },
      { label: "Shrink Goal", value: 2.0, format: "percent", delta: null, deltaLabel: "target ceiling" },
      { label: "Locations Over Target", value: 7, format: "number", delta: 2, deltaType: "count", deltaLabel: "vs last month", inverse: true },
    ],
    trend: {
      labels: MONTHS_YTD,
      series: [
        { name: "Shrink %", color: "var(--cat-8)", values: [2.6, 2.5, 2.4, 2.2, 2.3, 2.0, 2.2, 1.9, 2.1, 2.0, 1.8, 1.9] },
      ],
    },
    byCategory: {
      labels: ["Snacks", "Beverages", "Fresh Food", "Water/OCS Supplies"],
      values: [3200, 2650, 1890, 680],
    },
    byRoute: {
      labels: ROUTE_NAMES,
      values: [1180, 940, 1420, 860, 1050, 730, 890],
    },
    topLocations: [
      { location: "Riverbend Office Park", shrinkPct: 4.8, shrinkDollars: 1120, status: "critical" },
      { location: "Union Station Depot", shrinkPct: 4.3, shrinkDollars: 990, status: "critical" },
      { location: "Lakeside Manufacturing", shrinkPct: 3.6, shrinkDollars: 940, status: "warning" },
      { location: "Northgate Distribution", shrinkPct: 3.4, shrinkDollars: 870, status: "warning" },
      { location: "Midtown Business Center", shrinkPct: 3.1, shrinkDollars: 810, status: "warning" },
      { location: "Ashford Medical Plaza", shrinkPct: 2.9, shrinkDollars: 745, status: "warning" },
      { location: "Harbor Logistics Hub", shrinkPct: 2.7, shrinkDollars: 605, status: "warning" },
      { location: "Southpark Corporate Center", shrinkPct: 2.2, shrinkDollars: 510, status: "warning" },
      { location: "Willow Creek Campus", shrinkPct: 1.8, shrinkDollars: 385, status: "warning" },
      { location: "Cedar Grove Campus", shrinkPct: 1.4, shrinkDollars: 260, status: "good" },
    ],
  },

  // -------------------------------------------------------- ROUTE/DRIVER --
  route: {
    stats: [
      { label: "Assets / Route / Day", value: 26, format: "number", delta: -1, deltaType: "count", deltaLabel: "vs last month" },
      { label: "Average Fill", value: 78.4, format: "percent", delta: 1.6, deltaLabel: "vs last month" },
      { label: "RPS %", value: 91.2, format: "percent", delta: 0.8, deltaLabel: "vs last month" },
    ],
    stopsByRoute: {
      labels: ROUTE_NAMES,
      values: [142, 128, 156, 119, 133, 147, 121],
    },
    spoilageByRoute: {
      labels: ROUTE_NAMES,
      values: [420, 380, 510, 290, 460, 340, 275],
    },
    productShortByRoute: {
      labels: ROUTE_NAMES,
      values: [310, 265, 480, 190, 355, 220, 175],
    },
    revenueByRoute: {
      labels: ROUTE_NAMES,
      values: [186000, 164000, 214000, 142000, 178000, 151000, 139000],
    },
  },

  // ----------------------------------------------------------- DELIVERY ---
  delivery: {
    stats: [
      { label: "YTD Pallet Water Deliveries", value: 486, format: "number", delta: 5.4, deltaLabel: "vs last year" },
      { label: "YTD 5-Gallon Deliveries", value: 12840, format: "number", delta: 3.1, deltaLabel: "vs last year" },
      { label: "Weekly $ per Delivery", value: 186, format: "currency", delta: 2.8, deltaLabel: "vs last month" },
    ],
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

  // ----------------------------------------------------------- PRODUCTS ---
  products: {
    stats: [
      { label: "Total Food Spoiled (% of Units)", value: 2.3, format: "percent", delta: -0.2, deltaLabel: "vs last month", inverse: true },
      { label: "Total Spoiled Cost (% of COGS)", value: 1.8, format: "percent", delta: -0.1, deltaLabel: "vs last month", inverse: true },
      { label: "Month Total Margin", value: 42.8, format: "percent", delta: -0.3, deltaLabel: "vs last month" },
    ],
    marginByCategory: [
      { category: "Snacks", marginPct: 46.2, momChangePts: 1.4 },
      { category: "Beverages", marginPct: 51.8, momChangePts: 0.6 },
      { category: "Fresh Food", marginPct: 34.1, momChangePts: -2.8 },
      { category: "Candy & Confections", marginPct: 49.5, momChangePts: 0.3 },
      { category: "Frozen / Ice Cream", marginPct: 38.7, momChangePts: -1.9 },
      { category: "Water / OCS Supplies", marginPct: 44.0, momChangePts: 2.1 },
      { category: "Health & Better-For-You", marginPct: 41.3, momChangePts: 3.2 },
    ],
    marginTrend: {
      labels: MONTHS_YTD,
      series: [
        { name: "Total Margin %", color: "var(--cat-6)", values: [40.8, 41.0, 41.5, 41.9, 42.1, 42.4, 42.6, 42.5, 42.8, 43.0, 43.1, 42.8] },
      ],
    },
  },

  // --------------------------------------------------------- OPERATIONS ---
  operations: {
    stats: [
      { label: "Picks per Hour", value: 142, format: "number", goalPct: 88 },
      { label: "Total Receives — Last Week", value: 36, format: "number", goalPct: 95 },
      { label: "Total Inventories Run", value: 21, format: "number", goalPct: 70 },
    ],
  },

};
