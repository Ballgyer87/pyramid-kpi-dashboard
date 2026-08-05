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
    // Monthly actual revenue (not cumulative) — feeds the Overview "YTD Revenue" history dropdown.
    monthlyActual: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      values: [718373.51, 845720.02, 946524.23, 918073.08, 924939.69, 1000864.89, 997602.24],
    },
  },

  // ------------------------------------------------------------- SHRINK ---
  // Micro-Market Shrink $/% below are real, from Tim's Market Shrink Project
  // 2026.xlsx (company-wide monthly totals, Jan-Jun — July isn't closed yet).
  // This tab is exclusively micro-markets — vending route shrink is tracked
  // separately below (byRoute/byRoutePct, from PFS Analysis copy.xlsx).
  shrink: {
    stats: [
      { label: "Micro-Market Shrink $ (MTD)", value: 37949.84, format: "currency", delta: 78.8, deltaLabel: "vs last month", inverse: true,
        history: [
          { label: "Jan", value: 13952.53 }, { label: "Feb", value: 15595.69 }, { label: "Mar", value: 18133.83 },
          { label: "Apr", value: 17749.49 }, { label: "May", value: 21220.95 }, { label: "Jun", value: 37949.84 },
        ] },
      { label: "Micro-Market Shrink %", value: 7.06, format: "percent", delta: 2.77, deltaLabel: "vs last month", inverse: true,
        history: [
          { label: "Jan", value: 3.67 }, { label: "Feb", value: 3.45 }, { label: "Mar", value: 3.61 },
          { label: "Apr", value: 3.70 }, { label: "May", value: 4.29 }, { label: "Jun", value: 7.06 },
        ] },
      { label: "Shrink Goal", value: 2.0, format: "percent", delta: null, deltaLabel: "target ceiling" },
      { label: "Locations Over Target", value: 7, format: "number", delta: 2, deltaType: "count", deltaLabel: "vs last month", inverse: true },
    ],
    trend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      series: [
        { name: "Micro-Market Shrink %", color: "var(--cat-8)", values: [3.67, 3.45, 3.61, 3.70, 4.29, 7.06] },
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
    // Real June (last closed month) worst 10 micro-markets by shrink %, from
    // Tim's Market Shrink Project 2026.xlsx / "June" tab. Ranked worst-to-least-bad,
    // no status tiers — update this each month to the newest closed month.
    // Note: Tenaris Front's 58.51% is real, not a data error — a kiosk issue
    // that has since been fixed.
    topLocations: [
      { location: "Tenaris Front", shrinkPct: 58.51, shrinkDollars: 3677.21 },
      { location: "HealthLink", shrinkPct: 30.08, shrinkDollars: 774.84 },
      { location: "Nidec Motors", shrinkPct: 26.50, shrinkDollars: 1256.93 },
      { location: "Emerson", shrinkPct: 19.62, shrinkDollars: 519.44 },
      { location: "Cooper Lighting", shrinkPct: 18.00, shrinkDollars: 731.55 },
      { location: "AWG Market", shrinkPct: 14.79, shrinkDollars: 6016.81 },
      { location: "Bristol on Union", shrinkPct: 12.98, shrinkDollars: 188.06 },
      { location: "Southeastern Freight Main", shrinkPct: 11.97, shrinkDollars: 1422.53 },
      { location: "Jabil Front Market", shrinkPct: 10.92, shrinkDollars: 6776.09 },
      { location: "Skyline Steel", shrinkPct: 10.30, shrinkDollars: 486.75 },
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
  // Category stats are June (latest closed month); momChangePts is June vs May.
  products: {
    stats: [
      { label: "Total Food Spoiled %", value: 11.0, format: "percent", delta: 0.06, deltaLabel: "vs last month", inverse: true, decimals: 2,
        history: [
          { label: "Dec '25", value: 12.1 }, { label: "Jan", value: 11.88 }, { label: "Feb", value: 10 },
          { label: "Mar", value: 12.06 }, { label: "Apr", value: 14.06 }, { label: "May", value: 10.94 }, { label: "Jun", value: 11.0 },
        ] },
      { label: "Total % Spoiled Cost", value: 1.16, format: "percent", delta: 0.0, deltaLabel: "vs last month", inverse: true, decimals: 2,
        history: [
          { label: "Dec '25", value: 1.4 }, { label: "Jan", value: 1.49 }, { label: "Feb", value: 1.23 },
          { label: "Mar", value: 1.42 }, { label: "Apr", value: 1.56 }, { label: "May", value: 1.16 }, { label: "Jun", value: 1.16 },
        ] },
      { label: "Month Total Margin", value: 48.26, format: "percent", delta: 1.79, deltaLabel: "vs last month", decimals: 2,
        history: [
          { label: "Dec '25", value: 47.08 }, { label: "Jan", value: 47.06 }, { label: "Feb", value: 46.25 },
          { label: "Mar", value: 46.01 }, { label: "Apr", value: 45.81 }, { label: "May", value: 46.47 }, { label: "Jun", value: 48.26 },
        ] },
    ],
    marginByCategory: [
      { category: "BAG CANDY", marginPct: 46.56, momChangePts: 0.48,
        history: [{ label: "Dec '25", value: 46.33 }, { label: "Jan", value: 46.79 }, { label: "Feb", value: 47.18 }, { label: "Mar", value: 45.94 }, { label: "Apr", value: 45.48 }, { label: "May", value: 46.08 }, { label: "Jun", value: 46.56 }] },
      { category: "CAN SODA", marginPct: 52.82, momChangePts: 2.34,
        history: [{ label: "Dec '25", value: 51.78 }, { label: "Jan", value: 53.89 }, { label: "Feb", value: 53.48 }, { label: "Mar", value: 50.63 }, { label: "Apr", value: 50.15 }, { label: "May", value: 50.48 }, { label: "Jun", value: 52.82 }] },
      { category: "CANDY", marginPct: 41.27, momChangePts: 0.23,
        history: [{ label: "Dec '25", value: 39.77 }, { label: "Jan", value: 39.71 }, { label: "Feb", value: 39.42 }, { label: "Mar", value: 39.73 }, { label: "Apr", value: 39.91 }, { label: "May", value: 41.04 }, { label: "Jun", value: 41.27 }] },
      { category: "CCN", marginPct: 67.91, momChangePts: 1.36,
        history: [{ label: "Dec '25", value: 65.1 }, { label: "Jan", value: 65.66 }, { label: "Feb", value: 65.7 }, { label: "Mar", value: 65.84 }, { label: "Apr", value: 65.35 }, { label: "May", value: 66.55 }, { label: "Jun", value: 67.91 }] },
      { category: "CONDIMENTS", marginPct: 45.22, momChangePts: -1.25,
        history: [{ label: "Dec '25", value: 47.81 }, { label: "Jan", value: 57.66 }, { label: "Feb", value: 42.62 }, { label: "Mar", value: 42.65 }, { label: "Apr", value: 38.74 }, { label: "May", value: 46.47 }, { label: "Jun", value: 45.22 }] },
      { category: "CORE BOTTLE SODA", marginPct: 45.63, momChangePts: -0.17,
        history: [{ label: "Dec '25", value: 47.9 }, { label: "Jan", value: 47.38 }, { label: "Feb", value: 46 }, { label: "Mar", value: 45.99 }, { label: "Apr", value: 45.61 }, { label: "May", value: 45.8 }, { label: "Jun", value: 45.63 }] },
      { category: "ENERGY DRINKS", marginPct: 45.48, momChangePts: 2.75,
        history: [{ label: "Dec '25", value: 43.7 }, { label: "Jan", value: 43 }, { label: "Feb", value: 40.05 }, { label: "Mar", value: 40.43 }, { label: "Apr", value: 40.02 }, { label: "May", value: 42.73 }, { label: "Jun", value: 45.48 }] },
      { category: "FOOD 2.25", marginPct: 48.4, momChangePts: 14.2,
        history: [{ label: "Dec '25", value: 42.04 }, { label: "Jan", value: 44.37 }, { label: "Feb", value: 42.96 }, { label: "Mar", value: 42.57 }, { label: "Apr", value: 40.76 }, { label: "May", value: 34.2 }, { label: "Jun", value: 48.4 }] },
      { category: "FOOD 2.75", marginPct: 34.85, momChangePts: 8.35,
        history: [{ label: "Dec '25", value: 34.97 }, { label: "Jan", value: 35.3 }, { label: "Feb", value: 35.87 }, { label: "Mar", value: 33.58 }, { label: "Apr", value: 31.87 }, { label: "May", value: 26.5 }, { label: "Jun", value: 34.85 }] },
      { category: "FOOD 3.25", marginPct: 33.44, momChangePts: 21.23,
        history: [{ label: "Dec '25", value: 34.93 }, { label: "Jan", value: 32.53 }, { label: "Feb", value: 28 }, { label: "Mar", value: 28.11 }, { label: "Apr", value: 27.11 }, { label: "May", value: 12.21 }, { label: "Jun", value: 33.44 }] },
      { category: "FOOD 3.75", marginPct: 27.86, momChangePts: 3.77,
        history: [{ label: "Dec '25", value: 27.59 }, { label: "Jan", value: 27.76 }, { label: "Feb", value: 26.52 }, { label: "Mar", value: 28.03 }, { label: "Apr", value: 23.14 }, { label: "May", value: 24.09 }, { label: "Jun", value: 27.86 }] },
      { category: "FOOD 4.75", marginPct: 27.97, momChangePts: 1.4,
        history: [{ label: "Dec '25", value: 24.94 }, { label: "Jan", value: 24.95 }, { label: "Feb", value: 28.53 }, { label: "Mar", value: 27.36 }, { label: "Apr", value: 25.11 }, { label: "May", value: 26.57 }, { label: "Jun", value: 27.97 }] },
      { category: "FROZEN", marginPct: 43.72, momChangePts: -0.31,
        history: [{ label: "Dec '25", value: 41.11 }, { label: "Jan", value: 44.54 }, { label: "Feb", value: 44.75 }, { label: "Mar", value: 42.21 }, { label: "Apr", value: 45.52 }, { label: "May", value: 44.03 }, { label: "Jun", value: 43.72 }] },
      { category: "GUM & MINTS", marginPct: 45.84, momChangePts: 0.06,
        history: [{ label: "Dec '25", value: 47.24 }, { label: "Jan", value: 46.57 }, { label: "Feb", value: 45.23 }, { label: "Mar", value: 44.71 }, { label: "Apr", value: 44.69 }, { label: "May", value: 45.78 }, { label: "Jun", value: 45.84 }] },
      { category: "HEALTHY SNACKS", marginPct: 40.37, momChangePts: 0.13,
        history: [{ label: "Dec '25", value: 39.35 }, { label: "Jan", value: 39.71 }, { label: "Feb", value: 39.66 }, { label: "Mar", value: 39.1 }, { label: "Apr", value: 39.3 }, { label: "May", value: 40.24 }, { label: "Jun", value: 40.37 }] },
      { category: "HOT BEVERAGE", marginPct: 45.34, momChangePts: -3.15,
        history: [{ label: "Dec '25", value: 44.18 }, { label: "Jan", value: 47.37 }, { label: "Feb", value: 46.84 }, { label: "Mar", value: 45.1 }, { label: "Apr", value: 45.91 }, { label: "May", value: 48.49 }, { label: "Jun", value: 45.34 }] },
      { category: "JUICE 15.2oz BOTTLE", marginPct: 50.07, momChangePts: -0.26,
        history: [{ label: "Dec '25", value: 50.53 }, { label: "Jan", value: 50.68 }, { label: "Feb", value: 50.54 }, { label: "Mar", value: 50.03 }, { label: "Apr", value: 49.53 }, { label: "May", value: 50.33 }, { label: "Jun", value: 50.07 }] },
      { category: "KS CANDY", marginPct: 32.4, momChangePts: 0.24,
        history: [{ label: "Dec '25", value: 35.36 }, { label: "Jan", value: 33.12 }, { label: "Feb", value: 32.09 }, { label: "Mar", value: 31.99 }, { label: "Apr", value: 32.1 }, { label: "May", value: 32.16 }, { label: "Jun", value: 32.4 }] },
      { category: "LSS CHIPS", marginPct: 52.25, momChangePts: 0.24,
        history: [{ label: "Dec '25", value: 45.82 }, { label: "Jan", value: 45.32 }, { label: "Feb", value: 45.7 }, { label: "Mar", value: 45.75 }, { label: "Apr", value: 46.7 }, { label: "May", value: 52.01 }, { label: "Jun", value: 52.25 }] },
      { category: "MEDICINE", marginPct: 39.45, momChangePts: 0.53,
        history: [{ label: "Dec '25", value: 36.32 }, { label: "Jan", value: 36.96 }, { label: "Feb", value: 36.81 }, { label: "Mar", value: 37.06 }, { label: "Apr", value: 37.69 }, { label: "May", value: 38.92 }, { label: "Jun", value: 39.45 }] },
      { category: "NON CORE BOTTLE SODA", marginPct: 51.38, momChangePts: -0.14,
        history: [{ label: "Dec '25", value: 54.15 }, { label: "Jan", value: 53.13 }, { label: "Feb", value: 51.78 }, { label: "Mar", value: 52.05 }, { label: "Apr", value: 51.3 }, { label: "May", value: 51.52 }, { label: "Jun", value: 51.38 }] },
      { category: "OCS", marginPct: 43.91, momChangePts: 0.49,
        history: [{ label: "Dec '25", value: 46.19 }, { label: "Jan", value: 45.4 }, { label: "Feb", value: 47.06 }, { label: "Mar", value: 43.43 }, { label: "Apr", value: 43.37 }, { label: "May", value: 43.42 }, { label: "Jun", value: 43.91 }] },
      { category: "PASTRY", marginPct: 54.24, momChangePts: -1.8,
        history: [{ label: "Dec '25", value: 56.13 }, { label: "Jan", value: 56.09 }, { label: "Feb", value: 56.9 }, { label: "Mar", value: 57.46 }, { label: "Apr", value: 57.04 }, { label: "May", value: 56.04 }, { label: "Jun", value: 54.24 }] },
      { category: "PREMIUM SNACKS", marginPct: 48.55, momChangePts: 0.39,
        history: [{ label: "Dec '25", value: 47.15 }, { label: "Jan", value: 46.61 }, { label: "Feb", value: 46.27 }, { label: "Mar", value: 45.95 }, { label: "Apr", value: 46.15 }, { label: "May", value: 48.16 }, { label: "Jun", value: 48.55 }] },
      { category: "SMALL JUICE", marginPct: 41.88, momChangePts: 55.21,
        history: [{ label: "Dec '25", value: 36.88 }, { label: "Jan", value: 39.25 }, { label: "Feb", value: 33.06 }, { label: "Mar", value: 38.18 }, { label: "Apr", value: 41.16 }, { label: "May", value: -13.33 }, { label: "Jun", value: 41.88 }] },
      { category: "SPORT DRINKS", marginPct: 52.72, momChangePts: 4.67,
        history: [{ label: "Dec '25", value: 52.74 }, { label: "Jan", value: 52.61 }, { label: "Feb", value: 51.35 }, { label: "Mar", value: 51.61 }, { label: "Apr", value: 51.07 }, { label: "May", value: 48.05 }, { label: "Jun", value: 52.72 }] },
      { category: "WATER", marginPct: 56.27, momChangePts: 0.32,
        history: [{ label: "Dec '25", value: 54.76 }, { label: "Jan", value: 55.71 }, { label: "Feb", value: 56.08 }, { label: "Mar", value: 56.51 }, { label: "Apr", value: 55.85 }, { label: "May", value: 55.95 }, { label: "Jun", value: 56.27 }] },
      { category: "Water Program", marginPct: 64.65, momChangePts: 5.3,
        history: [{ label: "Dec '25", value: 80.36 }, { label: "Jan", value: 63.43 }, { label: "Feb", value: 55.61 }, { label: "Mar", value: 67.16 }, { label: "Apr", value: 54.88 }, { label: "May", value: 59.35 }, { label: "Jun", value: 64.65 }] },
      { category: "XVL CHIPS", marginPct: 43.95, momChangePts: 4.12,
        history: [{ label: "Dec '25", value: 35.07 }, { label: "Jan", value: 36.65 }, { label: "Feb", value: 37.05 }, { label: "Mar", value: 37.14 }, { label: "Apr", value: 37.06 }, { label: "May", value: 39.83 }, { label: "Jun", value: 43.95 }] },
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
