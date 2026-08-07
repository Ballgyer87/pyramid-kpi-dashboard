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

// Latest closed month. Chart titles read from this, so bumping it here renames
// every "(month)" label on the site at once instead of one hardcoded string
// per chart. Also update route.previousMonth.label below when this changes.
const CURRENT_MONTH = "July";

const KPI_DATA = {

  // ------------------------------------------------------------ REVENUE ---
  // Real numbers below, synced from the PFS KPI Master Tracker.xlsx Revenue tab.
  // ytdSales/cumulative are through July (last closed month); lastWeekSales is
  // the most recent complete week (7/19-7/25) from the weekly tracker.
  revenue: {
    // ytdSales here is through the latest *week*, so it runs ahead of the
    // monthly figures below (which stop at July month-end).
    goalMeter: {
      ytdSales: 6560449,
      annualGoal: 11900000,
      lastWeekSales: 228937,
      weeklyTargetNeeded: 254264,
      weeksLeft: 21,
      // NOTE: year-over-year is not stored here — it's computed in app.js from
      // cumulativeTracker (2026 vs 2025 at the same month), so it can't go stale.
      // Update this before each week's meeting — whatever's worth calling out.
      // "sub" and "visual" are both optional — omit for a text-only fact.
      funFact: {
        text: "Energy Drinks up 24.8% YoY",
        sub: "+$106,467 vs Jan–Jul 2025",
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
    // Monthly actual revenue (not cumulative) — feeds the Overview "YTD Revenue" history dropdown.
    monthlyActual: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      values: [718373.51, 845720.02, 946524.23, 918073.08, 924939.69, 1000864.89, 997602.24],
    },
  },

  // ------------------------------------------------------------- SHRINK ---
  // Micro-Market Shrink $/% below are real, from Tim's Market Shrink Project
  // 2026.xlsx (company-wide monthly totals, Jan-Jul — August isn't closed yet).
  // This tab is exclusively micro-markets — vending route shrink is tracked
  // separately below (byRoute/byRoutePct, from PFS Analysis copy.xlsx).
  shrink: {
    stats: [
      { label: "Micro-Market Shrink $ (MTD)", value: 27398.52, format: "currency", delta: -27.8, deltaLabel: "vs last month", inverse: true, exact: true,
        history: [
          { label: "Jan", value: 13952.53 }, { label: "Feb", value: 15595.69 }, { label: "Mar", value: 18133.83 },
          { label: "Apr", value: 17749.49 }, { label: "May", value: 21220.95 }, { label: "Jun", value: 37949.84 },
          { label: "Jul", value: 27398.52 },
        ] },
      { label: "Micro-Market Shrink %", value: 4.97, format: "percent", delta: -2.09, deltaLabel: "vs last month", inverse: true, decimals: 2,
        history: [
          { label: "Jan", value: 3.67 }, { label: "Feb", value: 3.45 }, { label: "Mar", value: 3.61 },
          { label: "Apr", value: 3.70 }, { label: "May", value: 4.29 }, { label: "Jun", value: 7.06 },
          { label: "Jul", value: 4.97 },
        ] },
      { label: "Shrink Goal", value: 2.0, format: "percent", delta: null, deltaLabel: "target ceiling" },
      // Real count of active July micro-markets over the 2% goal (59 of 71), from
      // Tim's Market Shrink Project 2026.xlsx. Recount each month the same way:
      // active markets (nonzero sales) with Shrink % > 2%.
      { label: "Locations Over Target", value: 59, format: "number", delta: 3, deltaType: "count", deltaLabel: "vs last month", inverse: true,
        history: [
          { label: "Jan", value: 46 }, { label: "Feb", value: 42 }, { label: "Mar", value: 52 },
          { label: "Apr", value: 50 }, { label: "May", value: 48 }, { label: "Jun", value: 56 },
          { label: "Jul", value: 59 },
        ] },
    ],
    trend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "Micro-Market Shrink %", color: "var(--cat-8)", values: [3.67, 3.45, 3.61, 3.70, 4.29, 7.06, 4.97] },
      ],
    },
    // Real July (latest closed month) shrink $ per route, from PFS Analysis copy.xlsx / "2026 Shrink Charts".
    byRoute: {
      labels: ROUTE_NAMES,
      values: [1863.92, 991.46, 4230.68, 1558.76, 1333.27, 1543.62, 803.23],
    },
    // Shrink $ above, as a % of that route's July revenue.
    byRoutePct: {
      labels: ROUTE_NAMES,
      values: [1.61, 0.79, 2.58, 1.14, 1.07, 1.33, 0.65],
    },
    // Real July (last closed month) worst 10 by shrink %, from Tim's Market
    // Shrink Project 2026.xlsx / "July" tab. Ranked worst-to-least-bad, no
    // status tiers — update this each month to the newest closed month.
    // Names use the file's Customer column (A), except where that customer runs
    // more than one market — then the Location column (B) is used instead, since
    // "Jabil Circuit" or "Tenaris" alone wouldn't say which site. Eight customers
    // are multi-site in July: Blues City, Bryce, Ford, Hino, Jabil Circuit,
    // Owens Corning, Rockwool, Tenaris.
    topLocations: [
      { location: "Niagara Water", shrinkPct: 13.30, shrinkDollars: 403.58 },
      { location: "Fox 13", shrinkPct: 12.48, shrinkDollars: 315.78 },
      { location: "Nucor", shrinkPct: 12.14, shrinkDollars: 663.10 },
      { location: "WM Barr Distribution", shrinkPct: 10.48, shrinkDollars: 361.44 },
      { location: "Bryce-Hickory Hill", shrinkPct: 8.77, shrinkDollars: 136.80 },
      { location: "Jabil Front Market", shrinkPct: 8.65, shrinkDollars: 5823.14 },
      { location: "Tenaris Back", shrinkPct: 8.35, shrinkDollars: 707.23 },
      { location: "Tenaris Warehouse", shrinkPct: 8.09, shrinkDollars: 552.88 },
      { location: "Pyramid Foodservice Inc.", shrinkPct: 7.21, shrinkDollars: 75.66 },
      { location: "Golden Bolt- Panama", shrinkPct: 6.81, shrinkDollars: 1865.53 },
    ],
  },

  // -------------------------------------------------------- ROUTE/DRIVER --
  route: {
    stats: [
      // Real: 1,069 total assets / 7 routes / 6 days. Replaces the old
      // placeholder 26 now that the day-by-day counts below are real.
      { label: "Average Assets Serviced (All Routes)", value: 25.5, format: "number", decimals: 1, delta: null, deltaLabel: "per route, per day" },
    ],
    // Real day-by-day asset counts for the last completed week. `null` means the
    // route didn't run that day. avgPerDay follows the source sheet's convention
    // of dividing by 6 regardless of days actually run, so a route that worked
    // five days reads lower here than its true daily pace.
    // The by-route bar chart derives its totals from these rows — don't add a
    // second copy of the totals anywhere.
    weeklyAssets: {
      // Company-wide total for the week. Higher than the seven route totals
      // below because it also counts delivery assets that sit on other routes
      // and so never appear in this table. The gap is shown on the tile rather
      // than hidden, so the table and the headline number reconcile.
      companyTotal: 1130,
      days: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"],
      rows: [
        { route: "Bulls",   days: [27, 33, 25, 29, 29, 1],    total: 144, avgPerDay: 24.0 },
        { route: "Celtics", days: [30, 44, 26, 29, 26, null], total: 155, avgPerDay: 25.8 },
        { route: "Kings",   days: [29, 37, 29, 34, 29, null], total: 158, avgPerDay: 26.3 },
        { route: "Lakers",  days: [35, 30, 27, 31, 28, null], total: 151, avgPerDay: 25.2 },
        { route: "Magic",   days: [28, 34, 20, 35, 30, null], total: 147, avgPerDay: 24.5 },
        { route: "Suns",    days: [24, 36, 26, 32, 24, 33],   total: 175, avgPerDay: 29.2 },
        { route: "Thunder", days: [24, 30, 26, 24, 35, null], total: 139, avgPerDay: 23.2 },
      ],
    },
    // Real July (latest closed month) numbers below, from PFS Analysis copy.xlsx.
    spoilageByRoute: {
      labels: ROUTE_NAMES,
      values: [1956.67, 2091.67, 1221.52, 1248.13, 1420.29, 1352.41, 1481.04],
    },
    revenueByRoute: {
      labels: ROUTE_NAMES,
      values: [115478.25, 125898.55, 164113.76, 136889.52, 124596.75, 115912.58, 122710.27],
    },
    // Previous-month (June) comparison set for the "Compare to Previous Month"
    // toggle — same 3 metrics, same route order, from the same source files.
    previousMonth: {
      label: "June",
      revenueByRoute: {
        labels: ROUTE_NAMES,
        values: [108574.45, 123920.31, 148899.70, 134606.34, 121454.81, 119268.06, 112049.46],
      },
      spoilageByRoute: {
        labels: ROUTE_NAMES,
        values: [1498.44, 2785.83, 1564.67, 655.67, 1502.47, 767.76, 1675.36],
      },
      shrinkByRoute: {
        labels: ROUTE_NAMES,
        values: [1687.82, 997.32, 4440.69, 8188.42, 565.06, 1892.56, 2468.84],
      },
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
      { label: "Gross Margin", value: 42.8, format: "percent", delta: 1.3, deltaLabel: "vs last month",
        history: [
          { label: "Feb", value: 39.5 }, { label: "Mar", value: 40.1 }, { label: "Apr", value: 40.9 },
          { label: "May", value: 41.5 }, { label: "Jun", value: 41.8 }, { label: "Jul", value: 42.8 },
        ] },
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
  // Category stats are July (latest closed month); momChangePts is July vs June.
  products: {
    stats: [
      { label: "Month Total Margin", value: 49.14, format: "percent", delta: 0.88, deltaLabel: "vs last month", decimals: 2, highlight: true,
        history: [
          { label: "Dec '25", value: 47.08 }, { label: "Jan", value: 47.06 }, { label: "Feb", value: 46.25 },
          { label: "Mar", value: 46.01 }, { label: "Apr", value: 45.81 }, { label: "May", value: 46.47 },
          { label: "Jun", value: 48.26 }, { label: "Jul", value: 49.14 },
        ] },
      { label: "Total Food Spoiled %", value: 10.53, format: "percent", delta: -0.47, deltaLabel: "vs last month", inverse: true, decimals: 2,
        history: [
          { label: "Dec '25", value: 12.1 }, { label: "Jan", value: 11.88 }, { label: "Feb", value: 10 },
          { label: "Mar", value: 12.06 }, { label: "Apr", value: 14.06 }, { label: "May", value: 10.94 },
          { label: "Jun", value: 11.0 }, { label: "Jul", value: 10.53 },
        ] },
      { label: "Total % Spoiled Cost", value: 1.12, format: "percent", delta: -0.04, deltaLabel: "vs last month", inverse: true, decimals: 2,
        history: [
          { label: "Dec '25", value: 1.4 }, { label: "Jan", value: 1.49 }, { label: "Feb", value: 1.23 },
          { label: "Mar", value: 1.42 }, { label: "Apr", value: 1.56 }, { label: "May", value: 1.16 },
          { label: "Jun", value: 1.16 }, { label: "Jul", value: 1.12 },
        ] },
    ],
    marginByCategory: [
      { category: "BAG CANDY", marginPct: 47.17, momChangePts: 0.61,
        history: [{ label: "Dec '25", value: 46.33 }, { label: "Jan", value: 46.79 }, { label: "Feb", value: 47.18 }, { label: "Mar", value: 45.94 }, { label: "Apr", value: 45.48 }, { label: "May", value: 46.08 }, { label: "Jun", value: 46.56 }, { label: "Jul", value: 47.17 }] },
      { category: "CAN SODA", marginPct: 54.31, momChangePts: 1.49,
        history: [{ label: "Dec '25", value: 51.78 }, { label: "Jan", value: 53.89 }, { label: "Feb", value: 53.48 }, { label: "Mar", value: 50.63 }, { label: "Apr", value: 50.15 }, { label: "May", value: 50.48 }, { label: "Jun", value: 52.82 }, { label: "Jul", value: 54.31 }] },
      { category: "CANDY", marginPct: 43.69, momChangePts: 2.42,
        history: [{ label: "Dec '25", value: 39.77 }, { label: "Jan", value: 39.71 }, { label: "Feb", value: 39.42 }, { label: "Mar", value: 39.73 }, { label: "Apr", value: 39.91 }, { label: "May", value: 41.04 }, { label: "Jun", value: 41.27 }, { label: "Jul", value: 43.69 }] },
      { category: "CCN", marginPct: 67.8, momChangePts: -0.11,
        history: [{ label: "Dec '25", value: 65.1 }, { label: "Jan", value: 65.66 }, { label: "Feb", value: 65.7 }, { label: "Mar", value: 65.84 }, { label: "Apr", value: 65.35 }, { label: "May", value: 66.55 }, { label: "Jun", value: 67.91 }, { label: "Jul", value: 67.8 }] },
      { category: "CONDIMENTS", marginPct: 41.97, momChangePts: -3.25,
        history: [{ label: "Dec '25", value: 47.81 }, { label: "Jan", value: 57.66 }, { label: "Feb", value: 42.62 }, { label: "Mar", value: 42.65 }, { label: "Apr", value: 38.74 }, { label: "May", value: 46.47 }, { label: "Jun", value: 45.22 }, { label: "Jul", value: 41.97 }] },
      { category: "CORE BOTTLE SODA", marginPct: 47.35, momChangePts: 1.72,
        history: [{ label: "Dec '25", value: 47.9 }, { label: "Jan", value: 47.38 }, { label: "Feb", value: 46.0 }, { label: "Mar", value: 45.99 }, { label: "Apr", value: 45.61 }, { label: "May", value: 45.8 }, { label: "Jun", value: 45.63 }, { label: "Jul", value: 47.35 }] },
      { category: "ENERGY DRINKS", marginPct: 46.78, momChangePts: 1.3,
        history: [{ label: "Dec '25", value: 43.7 }, { label: "Jan", value: 43.0 }, { label: "Feb", value: 40.05 }, { label: "Mar", value: 40.43 }, { label: "Apr", value: 40.02 }, { label: "May", value: 42.73 }, { label: "Jun", value: 45.48 }, { label: "Jul", value: 46.78 }] },
      { category: "FOOD 2.25", marginPct: 46.82, momChangePts: -1.58,
        history: [{ label: "Dec '25", value: 42.04 }, { label: "Jan", value: 44.37 }, { label: "Feb", value: 42.96 }, { label: "Mar", value: 42.57 }, { label: "Apr", value: 40.76 }, { label: "May", value: 34.2 }, { label: "Jun", value: 48.4 }, { label: "Jul", value: 46.82 }] },
      { category: "FOOD 2.75", marginPct: 37.28, momChangePts: 2.43,
        history: [{ label: "Dec '25", value: 34.97 }, { label: "Jan", value: 35.3 }, { label: "Feb", value: 35.87 }, { label: "Mar", value: 33.58 }, { label: "Apr", value: 31.87 }, { label: "May", value: 26.5 }, { label: "Jun", value: 34.85 }, { label: "Jul", value: 37.28 }] },
      { category: "FOOD 3.25", marginPct: 35.61, momChangePts: 2.17,
        history: [{ label: "Dec '25", value: 34.93 }, { label: "Jan", value: 32.53 }, { label: "Feb", value: 28.0 }, { label: "Mar", value: 28.11 }, { label: "Apr", value: 27.11 }, { label: "May", value: 12.21 }, { label: "Jun", value: 33.44 }, { label: "Jul", value: 35.61 }] },
      { category: "FOOD 3.75", marginPct: 29.13, momChangePts: 1.27,
        history: [{ label: "Dec '25", value: 27.59 }, { label: "Jan", value: 27.76 }, { label: "Feb", value: 26.52 }, { label: "Mar", value: 28.03 }, { label: "Apr", value: 23.14 }, { label: "May", value: 24.09 }, { label: "Jun", value: 27.86 }, { label: "Jul", value: 29.13 }] },
      { category: "FOOD 4.75", marginPct: 27.37, momChangePts: -0.6,
        history: [{ label: "Dec '25", value: 24.94 }, { label: "Jan", value: 24.95 }, { label: "Feb", value: 28.53 }, { label: "Mar", value: 27.36 }, { label: "Apr", value: 25.11 }, { label: "May", value: 26.57 }, { label: "Jun", value: 27.97 }, { label: "Jul", value: 27.37 }] },
      { category: "FROZEN", marginPct: 41.87, momChangePts: -1.85,
        history: [{ label: "Dec '25", value: 41.11 }, { label: "Jan", value: 44.54 }, { label: "Feb", value: 44.75 }, { label: "Mar", value: 42.21 }, { label: "Apr", value: 45.52 }, { label: "May", value: 44.03 }, { label: "Jun", value: 43.72 }, { label: "Jul", value: 41.87 }] },
      { category: "GUM & MINTS", marginPct: 47.33, momChangePts: 1.49,
        history: [{ label: "Dec '25", value: 47.24 }, { label: "Jan", value: 46.57 }, { label: "Feb", value: 45.23 }, { label: "Mar", value: 44.71 }, { label: "Apr", value: 44.69 }, { label: "May", value: 45.78 }, { label: "Jun", value: 45.84 }, { label: "Jul", value: 47.33 }] },
      { category: "HEALTHY SNACKS", marginPct: 39.54, momChangePts: -0.83,
        history: [{ label: "Dec '25", value: 39.35 }, { label: "Jan", value: 39.71 }, { label: "Feb", value: 39.66 }, { label: "Mar", value: 39.1 }, { label: "Apr", value: 39.3 }, { label: "May", value: 40.24 }, { label: "Jun", value: 40.37 }, { label: "Jul", value: 39.54 }] },
      { category: "HOT BEVERAGE", marginPct: 45.67, momChangePts: 0.33,
        history: [{ label: "Dec '25", value: 44.18 }, { label: "Jan", value: 47.37 }, { label: "Feb", value: 46.84 }, { label: "Mar", value: 45.1 }, { label: "Apr", value: 45.91 }, { label: "May", value: 48.49 }, { label: "Jun", value: 45.34 }, { label: "Jul", value: 45.67 }] },
      { category: "JUICE 15.2oz BOTTLE", marginPct: 50.55, momChangePts: 0.48,
        history: [{ label: "Dec '25", value: 50.53 }, { label: "Jan", value: 50.68 }, { label: "Feb", value: 50.54 }, { label: "Mar", value: 50.03 }, { label: "Apr", value: 49.53 }, { label: "May", value: 50.33 }, { label: "Jun", value: 50.07 }, { label: "Jul", value: 50.55 }] },
      { category: "KS CANDY", marginPct: 32.46, momChangePts: 0.06,
        history: [{ label: "Dec '25", value: 35.36 }, { label: "Jan", value: 33.12 }, { label: "Feb", value: 32.09 }, { label: "Mar", value: 31.99 }, { label: "Apr", value: 32.1 }, { label: "May", value: 32.16 }, { label: "Jun", value: 32.4 }, { label: "Jul", value: 32.46 }] },
      { category: "LSS CHIPS", marginPct: 53.13, momChangePts: 0.88,
        history: [{ label: "Dec '25", value: 45.82 }, { label: "Jan", value: 45.32 }, { label: "Feb", value: 45.7 }, { label: "Mar", value: 45.75 }, { label: "Apr", value: 46.7 }, { label: "May", value: 52.01 }, { label: "Jun", value: 52.25 }, { label: "Jul", value: 53.13 }] },
      { category: "MEDICINE", marginPct: 40.55, momChangePts: 1.1,
        history: [{ label: "Dec '25", value: 36.32 }, { label: "Jan", value: 36.96 }, { label: "Feb", value: 36.81 }, { label: "Mar", value: 37.06 }, { label: "Apr", value: 37.69 }, { label: "May", value: 38.92 }, { label: "Jun", value: 39.45 }, { label: "Jul", value: 40.55 }] },
      { category: "NON CORE BOTTLE SODA", marginPct: 52.78, momChangePts: 1.4,
        history: [{ label: "Dec '25", value: 54.15 }, { label: "Jan", value: 53.13 }, { label: "Feb", value: 51.78 }, { label: "Mar", value: 52.05 }, { label: "Apr", value: 51.3 }, { label: "May", value: 51.52 }, { label: "Jun", value: 51.38 }, { label: "Jul", value: 52.78 }] },
      { category: "OCS", marginPct: 42.99, momChangePts: -0.92,
        history: [{ label: "Dec '25", value: 46.19 }, { label: "Jan", value: 45.4 }, { label: "Feb", value: 47.06 }, { label: "Mar", value: 43.43 }, { label: "Apr", value: 43.37 }, { label: "May", value: 43.42 }, { label: "Jun", value: 43.91 }, { label: "Jul", value: 42.99 }] },
      { category: "PASTRY", marginPct: 55.6, momChangePts: 1.36,
        history: [{ label: "Dec '25", value: 56.13 }, { label: "Jan", value: 56.09 }, { label: "Feb", value: 56.9 }, { label: "Mar", value: 57.46 }, { label: "Apr", value: 57.04 }, { label: "May", value: 56.04 }, { label: "Jun", value: 54.24 }, { label: "Jul", value: 55.6 }] },
      { category: "PREMIUM SNACKS", marginPct: 48.5, momChangePts: -0.05,
        history: [{ label: "Dec '25", value: 47.15 }, { label: "Jan", value: 46.61 }, { label: "Feb", value: 46.27 }, { label: "Mar", value: 45.95 }, { label: "Apr", value: 46.15 }, { label: "May", value: 48.16 }, { label: "Jun", value: 48.55 }, { label: "Jul", value: 48.5 }] },
      { category: "SMALL JUICE", marginPct: 44.97, momChangePts: 3.09,
        history: [{ label: "Dec '25", value: 36.88 }, { label: "Jan", value: 39.25 }, { label: "Feb", value: 33.06 }, { label: "Mar", value: 38.18 }, { label: "Apr", value: 41.16 }, { label: "May", value: -13.33 }, { label: "Jun", value: 41.88 }, { label: "Jul", value: 44.97 }] },
      { category: "SPORT DRINKS", marginPct: 54.29, momChangePts: 1.57,
        history: [{ label: "Dec '25", value: 52.74 }, { label: "Jan", value: 52.61 }, { label: "Feb", value: 51.35 }, { label: "Mar", value: 51.61 }, { label: "Apr", value: 51.07 }, { label: "May", value: 48.05 }, { label: "Jun", value: 52.72 }, { label: "Jul", value: 54.29 }] },
      { category: "WATER", marginPct: 56.43, momChangePts: 0.16,
        history: [{ label: "Dec '25", value: 54.76 }, { label: "Jan", value: 55.71 }, { label: "Feb", value: 56.08 }, { label: "Mar", value: 56.51 }, { label: "Apr", value: 55.85 }, { label: "May", value: 55.95 }, { label: "Jun", value: 56.27 }, { label: "Jul", value: 56.43 }] },
      { category: "Water Program", marginPct: 58.99, momChangePts: -5.66,
        history: [{ label: "Dec '25", value: 80.36 }, { label: "Jan", value: 63.43 }, { label: "Feb", value: 55.61 }, { label: "Mar", value: 67.16 }, { label: "Apr", value: 54.88 }, { label: "May", value: 59.35 }, { label: "Jun", value: 64.65 }, { label: "Jul", value: 58.99 }] },
      { category: "XVL CHIPS", marginPct: 42.89, momChangePts: -1.06,
        history: [{ label: "Dec '25", value: 35.07 }, { label: "Jan", value: 36.65 }, { label: "Feb", value: 37.05 }, { label: "Mar", value: 37.14 }, { label: "Apr", value: 37.06 }, { label: "May", value: 39.83 }, { label: "Jun", value: 43.95 }, { label: "Jul", value: 42.89 }] },
    ],
    marginTrend: {
      labels: ["Dec '25", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      series: [
        { name: "Total Margin %", color: "var(--cat-6)", values: [47.08, 47.06, 46.25, 46.01, 45.81, 46.47, 48.26, 49.14] },
      ],
    },
  },

  // --------------------------------------------------------- OPERATIONS ---
  // Grouped into the three areas this tab actually covers. Add a metric by
  // dropping it into the right group — the tab renders whatever is in each.
  // NOTE: every number here is still placeholder — no real Operations data yet.
  operations: {
    warehouse: [
      { label: "Picks per Hour", value: 142, format: "number", goalPct: 88 },
      { label: "Total Receives — Last Week", value: 36, format: "number", goalPct: 95 },
      { label: "Total Inventories Run", value: 21, format: "number", goalPct: 70 },
    ],
    scheduling: [
      { label: "Average Fill", value: 78.4, format: "percent", delta: 1.6, deltaLabel: "vs last month" },
    ],
    maintenance: [
      { label: "RPC Compatibility", value: 91.2, format: "percent", delta: 0.8, deltaLabel: "vs last month" },
    ],
  },

};
