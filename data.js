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
  // Real numbers below, synced from the PFS KPI Master Tracker.xlsx Revenue tab.
  // ytdSales/cumulative are through June (last closed month); lastWeekSales is
  // the most recent complete week (7/19-7/25) from the weekly tracker.
  revenue: {
    goalMeter: {
      ytdSales: 6352097.66,
      annualGoal: 11900000,
      lastWeekSales: 219612.07,
      weeklyTargetNeeded: 252177.38,
      weeksLeft: 22,
      yoyPercent: 29.3, // used by the "YTD Revenue" headline tile on the Overview tab
      // Update this before each week's meeting — whatever's worth calling out.
      // "visual" is optional — omit it (or the whole field) for a text-only fact.
      funFact: {
        text: "14,480 Coke bottles sold YTD",
        visual: {
          items: [
            { label: "Empire State Building", height: "1,454 ft", heightFt: 1454, icon: "building", color: "var(--text-muted)" },
            { label: "Coke bottles stacked", height: "10,257 ft", heightFt: 10257, icon: "bottles", color: "#D0242A" },
          ],
          caption: "Stacked bottles = 7x taller than the Empire State Building",
        },
      },
    },
    // Cumulative running-total tracker: goal pace (dashed) vs actual 2026 (stops at
    // the current month) vs full prior year 2025. Mirrors the "Sales Goal Tracker"
    // spreadsheet chart — update the actualCumulative values weekly/monthly, and
    // pad with null for months that haven't happened yet.
    cumulativeTracker: {
      labels: MONTHS_YTD,
      series: [
        { name: "Cumulative Goal", color: "var(--brand-700)", dashed: true,
          values: [991667, 1983333, 2975000, 3966667, 4958333, 5950000, 6941667, 7933333, 8925000, 9916667, 10908333, 11900000] },
        { name: "Actual Cumulative Total", color: "var(--cat-1)",
          values: [718373.51, 1564093.53, 2510617.76, 3428690.84, 4353630.53, 5354495.42, 6352097.66, null, null, null, null, null] },
        { name: "2025 Cumulative Total", color: "var(--cat-4)",
          values: [713050.18, 1392245.19, 2162894.10, 2943028.48, 3720990.33, 4495348.97, 5305122.37, 6089178.86, 6909086.01, 7770062.97, 8510491.25, 9368699.79] },
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
    // Real June (latest closed month) shrink $ per route, from PFS Analysis copy.xlsx / "2026 Shrink Charts".
    byRoute: {
      labels: ROUTE_NAMES,
      values: [1687.82, 997.32, 4440.69, 8188.42, 565.06, 1892.56, 2468.84],
    },
    // Shrink $ above, as a % of that route's June revenue.
    byRoutePct: {
      labels: ROUTE_NAMES,
      values: [1.55, 0.80, 2.98, 6.08, 0.47, 1.59, 2.20],
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
      { label: "Average Assets Serviced (All Routes)", value: 26, format: "number", delta: -1, deltaType: "count", deltaLabel: "vs last month" },
    ],
    weeklyAssetsByRoute: {
      labels: ROUTE_NAMES,
      values: [142, 128, 156, 119, 133, 147, 121],
    },
    // Real June (latest closed month) numbers below, from PFS Analysis copy.xlsx.
    spoilageByRoute: {
      labels: ROUTE_NAMES,
      values: [1498.44, 2785.83, 1564.67, 655.67, 1502.47, 767.76, 1675.36],
    },
    revenueByRoute: {
      labels: ROUTE_NAMES,
      values: [108574.45, 123920.31, 148899.70, 134606.34, 121454.81, 119268.06, 112049.46],
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
  // Real numbers below, from Item Category Margin Report copy.xlsx / "2026" tab.
  // Category stats are June (latest closed month); momChangePts is June vs May.
  products: {
    stats: [
      { label: "Total Food Spoiled %", value: 11.0, format: "percent", delta: 0.06, deltaLabel: "vs last month", inverse: true, decimals: 2 },
      { label: "Total % Spoiled Cost", value: 1.16, format: "percent", delta: 0.0, deltaLabel: "vs last month", inverse: true, decimals: 2 },
      { label: "Month Total Margin", value: 48.26, format: "percent", delta: 1.79, deltaLabel: "vs last month", decimals: 2 },
    ],
    marginByCategory: [
      { category: "BAG CANDY", marginPct: 46.56, momChangePts: 0.48 },
      { category: "CAN SODA", marginPct: 52.82, momChangePts: 2.34 },
      { category: "CANDY", marginPct: 41.27, momChangePts: 0.23 },
      { category: "CCN", marginPct: 67.91, momChangePts: 1.36 },
      { category: "CONDIMENTS", marginPct: 45.22, momChangePts: -1.25 },
      { category: "CORE BOTTLE SODA", marginPct: 45.63, momChangePts: -0.17 },
      { category: "ENERGY DRINKS", marginPct: 45.48, momChangePts: 2.75 },
      { category: "FOOD 2.25", marginPct: 48.4, momChangePts: 14.2 },
      { category: "FOOD 2.75", marginPct: 34.85, momChangePts: 8.35 },
      { category: "FOOD 3.25", marginPct: 33.44, momChangePts: 21.23 },
      { category: "FOOD 3.75", marginPct: 27.86, momChangePts: 3.77 },
      { category: "FOOD 4.75", marginPct: 27.97, momChangePts: 1.4 },
      { category: "FROZEN", marginPct: 43.72, momChangePts: -0.31 },
      { category: "GUM & MINTS", marginPct: 45.84, momChangePts: 0.06 },
      { category: "HEALTHY SNACKS", marginPct: 40.37, momChangePts: 0.13 },
      { category: "HOT BEVERAGE", marginPct: 45.34, momChangePts: -3.15 },
      { category: "JUICE 15.2oz BOTTLE", marginPct: 50.07, momChangePts: -0.26 },
      { category: "KS CANDY", marginPct: 32.4, momChangePts: 0.24 },
      { category: "LSS CHIPS", marginPct: 52.25, momChangePts: 0.24 },
      { category: "MEDICINE", marginPct: 39.45, momChangePts: 0.53 },
      { category: "NON CORE BOTTLE SODA", marginPct: 51.38, momChangePts: -0.14 },
      { category: "OCS", marginPct: 43.91, momChangePts: 0.49 },
      { category: "PASTRY", marginPct: 54.24, momChangePts: -1.8 },
      { category: "PREMIUM SNACKS", marginPct: 48.55, momChangePts: 0.39 },
      { category: "SMALL JUICE", marginPct: 41.88, momChangePts: 55.21 },
      { category: "SPORT DRINKS", marginPct: 52.72, momChangePts: 4.67 },
      { category: "WATER", marginPct: 56.27, momChangePts: 0.32 },
      { category: "Water Program", marginPct: 64.65, momChangePts: 5.3 },
      { category: "XVL CHIPS", marginPct: 43.95, momChangePts: 4.12 },
    ],
    marginTrend: {
      labels: ["Dec '25", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      series: [
        { name: "Total Margin %", color: "var(--cat-6)", values: [47.08, 47.06, 46.25, 46.01, 45.81, 46.47, 48.26] },
      ],
    },
  },

  // --------------------------------------------------------- OPERATIONS ---
  operations: {
    stats: [
      { label: "Picks per Hour", value: 142, format: "number", goalPct: 88 },
      { label: "Total Receives — Last Week", value: 36, format: "number", goalPct: 95 },
      { label: "Total Inventories Run", value: 21, format: "number", goalPct: 70 },
      { label: "Average Fill", value: 78.4, format: "percent", delta: 1.6, deltaLabel: "vs last month" },
      { label: "RPC Compatibility", value: 91.2, format: "percent", delta: 0.8, deltaLabel: "vs last month" },
    ],
  },

};
