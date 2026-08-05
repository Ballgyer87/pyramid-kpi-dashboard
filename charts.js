/* ============================================================================
   charts.js — small dependency-free SVG chart + component builders.
   Everything returns a DOM node you can append. No build step, no libraries.
   ============================================================================ */

const SVG_NS = "http://www.w3.org/2000/svg";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v; // only used with trusted, static strings
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

/* ---------------------------------------------------------------- format */

function formatValue(value, format, decimals = 1) {
  if (value == null) return "—";
  switch (format) {
    case "currency":
      return formatCompactCurrency(value);
    case "percent":
      return `${value.toFixed(decimals)}%`;
    case "minutes":
      return `${value.toFixed(1)} min`;
    default:
      return Math.round(value).toLocaleString("en-US");
  }
}

function formatFull(value, format, decimals = 1) {
  if (value == null) return "—";
  switch (format) {
    case "currency":
      return `$${Math.round(value).toLocaleString("en-US")}`;
    case "percent":
      return `${value.toFixed(decimals)}%`;
    case "minutes":
      return `${value.toFixed(1)} min`;
    default:
      return Math.round(value).toLocaleString("en-US");
  }
}

function formatCompactCurrency(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

/* ------------------------------------------------------------- stat tile */

function createStatTile(stat) {
  const decimals = stat.decimals != null ? stat.decimals : 1;
  const value = formatValue(stat.value, stat.format, decimals);
  const tile = el("div", { class: `card stat-tile${stat.highlight ? " highlight" : ""}` }, [
    el("div", { class: "label" }, stat.label),
    el("div", { class: "value" }, value),
  ]);

  if (stat.delta != null) {
    const goodDirection = stat.inverse ? stat.delta < 0 : stat.delta > 0;
    const dir = stat.delta === 0 ? "flat" : goodDirection ? "up" : "down";
    const arrow = stat.delta === 0 ? "→" : stat.delta > 0 ? "↑" : "↓";
    const sign = stat.delta > 0 ? "+" : "";
    let deltaText;
    if (stat.format === "percent") {
      deltaText = `${arrow} ${sign}${stat.delta.toFixed(decimals)} pts`;
    } else if (stat.deltaType === "count") {
      deltaText = `${arrow} ${sign}${stat.delta}`;
    } else {
      deltaText = `${arrow} ${sign}${stat.delta.toFixed(decimals)}%`;
    }
    tile.appendChild(el("div", { class: `delta ${dir}` }, `${deltaText} ${stat.deltaLabel || ""}`));
  } else if (stat.deltaLabel) {
    tile.appendChild(el("div", { class: "delta flat" }, stat.deltaLabel));
  }

  if (stat.goalPct != null) {
    tile.appendChild(el("div", { class: "goal-note" }, `${stat.goalPct}% of goal`));
  }

  const toggle = el("button", { class: "history-toggle", type: "button", "aria-label": "Show history" }, [
    el("span", { class: "chevron" }, "▾"),
  ]);
  const panel = el("div", { class: "history-panel" });
  if (stat.history && stat.history.length) {
    [...stat.history].reverse().forEach((h) => {
      panel.appendChild(el("div", { class: "history-row" }, [
        el("span", { class: "period" }, h.label),
        el("span", { class: "val" }, formatValue(h.value, stat.format, decimals)),
      ]));
    });
  } else {
    panel.appendChild(el("div", { class: "history-empty" }, "No history logged yet"));
  }
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.classList.toggle("open", open);
  });
  tile.appendChild(toggle);
  tile.appendChild(panel);

  return tile;
}

function renderStatGrid(container, stats) {
  const grid = el("div", { class: "grid stat-grid" });
  stats.forEach((s) => grid.appendChild(createStatTile(s)));
  container.appendChild(grid);
}

// A section-label heading with a toggle button beside it that opens/closes
// a panel below (e.g. "Compare to Previous Month"). Caller appends content
// to the returned panel node.
function sectionLabelWithToggle(labelText, toggleText) {
  const label = el("div", { class: "section-label" }, labelText);
  const toggle = el("button", { class: "compare-toggle", type: "button" }, [
    el("span", {}, toggleText),
    el("span", { class: "chevron" }, "▾"),
  ]);
  const row = el("div", { class: "section-label-row" }, [label, toggle]);
  const panel = el("div", { class: "compare-panel" });
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.classList.toggle("open", open);
  });
  return { row, panel };
}

/* -------------------------------------------------------------- tooltip */

function makeTooltip(wrap) {
  const tip = el("div", { class: "tooltip" });
  wrap.appendChild(tip);
  return {
    show(x, y, html) {
      tip.innerHTML = "";
      tip.appendChild(html);
      tip.style.left = `${x + 12}px`;
      tip.style.top = `${y - 8}px`;
      tip.classList.add("visible");
    },
    hide() { tip.classList.remove("visible"); },
  };
}

function tooltipRow(label, value, colorVar) {
  const row = el("div", { class: "tooltip-row" });
  if (colorVar) {
    const key = el("span", { style: `display:inline-block;width:9px;height:9px;border-radius:2px;background:${colorVar};margin-right:5px;` });
    row.appendChild(key);
  }
  row.appendChild(el("span", {}, `${label}: `));
  const strong = document.createElement("strong");
  strong.className = "t-value";
  strong.textContent = value;
  row.appendChild(strong);
  return row;
}

/* --------------------------------------------------------------- scales */

function niceMax(max) {
  if (max <= 0) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / pow;
  let step;
  if (n <= 1) step = 1;
  else if (n <= 2) step = 2;
  else if (n <= 5) step = 5;
  else step = 10;
  return step * pow;
}

function niceRange(dataMin, dataMax, cap100) {
  if (dataMin === dataMax) { dataMin -= 1; dataMax += 1; }
  const pad = (dataMax - dataMin) * 0.15;
  let lo = dataMin - pad;
  let hi = dataMax + pad;
  const rawStep = (hi - lo) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  let step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  step *= mag;
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  if (lo < 0 && dataMin >= 0) lo = 0;
  if (cap100 && hi > 100) hi = 100;
  return { min: lo, max: hi };
}

/* ------------------------------------------------------------ pie chart */

const CAT_SLOTS = ["var(--cat-1)", "var(--cat-2)", "var(--cat-3)", "var(--cat-4)", "var(--cat-5)", "var(--cat-6)", "var(--cat-7)", "var(--cat-8)"];
const CAT_HEX = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];

// Same per-route colors as the Excel charts everyone already reads (Bulls, Celtics,
// Kings, Lakers, Magic, Suns, Thunder, in that order) — keep any new route chart on
// this exact palette so the colors stay consistent with what people are used to.
const ROUTE_COLORS = ["#156082", "#E97132", "#196B24", "#0F9ED5", "#A02B93", "#4EA72E", "#0D3A4E"];

function relativeLuminance(hex) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function polarPoint(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function createPieChart({ labels, values, format = "currency", size = 240, colors = null, sliceLabel = "percent", expanded = false }) {
  const total = values.reduce((a, b) => a + b, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;

  const svg = svgEl("svg", { class: "chart-svg pie-svg", viewBox: `0 0 ${size} ${size}`, role: "img", style: `max-width:${size}px` });
  const wrap = el("div", { class: "chart-wrap pie-wrap" });
  const tooltip = makeTooltip(wrap);

  let cumulative = 0;
  values.forEach((v, i) => {
    const fraction = total > 0 ? v / total : 0;
    const startAngle = (cumulative / total) * 360;
    cumulative += v;
    const endAngle = (cumulative / total) * 360;
    const large = endAngle - startAngle > 180 ? 1 : 0;
    const p1 = polarPoint(cx, cy, r, startAngle);
    const p2 = polarPoint(cx, cy, r, endAngle);
    const colorHex = colors ? colors[i % colors.length] : CAT_HEX[i % CAT_HEX.length];
    const colorVar = colors ? colorHex : CAT_SLOTS[i % CAT_SLOTS.length];

    const path = svgEl("path", {
      d: `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`,
      fill: colorVar,
      stroke: "var(--surface-1)",
      "stroke-width": 2,
    });

    path.addEventListener("pointermove", (e) => {
      const b = wrap.getBoundingClientRect();
      const box = el("div", {});
      box.appendChild(el("div", { style: "font-weight:600;margin-bottom:4px;" }, labels[i]));
      box.appendChild(tooltipRow(`${(fraction * 100).toFixed(1)}%`, formatFull(v, format)));
      tooltip.show(e.clientX - b.left, e.clientY - b.top, box);
      path.style.opacity = 0.85;
    });
    path.addEventListener("pointerleave", () => { tooltip.hide(); path.style.opacity = 1; });

    svg.appendChild(path);

    if (fraction >= (expanded ? 0.02 : 0.09)) {
      const midAngle = (startAngle + endAngle) / 2;
      const labelPoint = polarPoint(cx, cy, r * 0.68, midAngle);
      const text = sliceLabel === "value" ? formatValue(v, format) : `${Math.round(fraction * 100)}%`;
      const scale = size / 240;
      const fontSize = (sliceLabel === "value" ? 10.5 : 11.5) * scale;
      const chipW = text.length * (fontSize * 0.62) + 10;
      const chipH = fontSize + 8;

      svg.appendChild(svgEl("rect", {
        x: labelPoint.x - chipW / 2, y: labelPoint.y - chipH / 2 - 1, width: chipW, height: chipH,
        rx: chipH / 2, ry: chipH / 2, fill: "#ffffff", "fill-opacity": 0.92,
      }));
      const lbl = svgEl("text", {
        x: labelPoint.x, y: labelPoint.y, "text-anchor": "middle", "dominant-baseline": "central", "font-size": fontSize, "font-weight": 700,
        fill: "#0b0b0b",
      });
      lbl.textContent = text;
      svg.appendChild(lbl);
    }
  });

  wrap.appendChild(svg);

  const legend = el("div", { class: "legend" });
  labels.forEach((lab, i) => {
    const swatchColor = colors ? colors[i % colors.length] : CAT_SLOTS[i % CAT_SLOTS.length];
    legend.appendChild(el("span", { class: "legend-item" }, [
      el("span", { class: "legend-swatch", style: `background:${swatchColor}` }),
      `${lab} — ${formatFull(values[i], format)}`,
    ]));
  });
  wrap.appendChild(legend);

  return wrap;
}

/* ----------------------------------------------------------- bar chart */

function createBarChart({ labels, values, colorVar = "var(--cat-1)", colors = null, format = "number", height = 220, valueLabels = true }) {
  const W = 600, H = height;
  const padL = 56, padR = 12, padT = 16, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const maxVal = niceMax(Math.max(...values) * 1.15);
  const yTicks = 4;

  const svg = svgEl("svg", { class: "chart-svg", viewBox: `0 0 ${W} ${H}`, role: "img" });

  for (let i = 0; i <= yTicks; i++) {
    const v = (maxVal / yTicks) * i;
    const y = padT + plotH - (v / maxVal) * plotH;
    svg.appendChild(svgEl("line", { class: "gridline", x1: padL, x2: W - padR, y1: y, y2: y }));
    const t = svgEl("text", { x: padL - 8, y: y + 4, "text-anchor": "end", "font-size": 10 });
    t.textContent = formatValue(v, format);
    svg.appendChild(t);
  }
  svg.appendChild(svgEl("line", { class: "axis-line", x1: padL, x2: W - padR, y1: padT + plotH, y2: padT + plotH }));

  const n = values.length;
  const slot = plotW / n;
  const barW = Math.min(40, slot * 0.5);

  const wrap = el("div", { class: "chart-wrap" });
  const tooltip = makeTooltip(wrap);

  values.forEach((v, i) => {
    const cx = padL + slot * i + slot / 2;
    const barH = (v / maxVal) * plotH;
    const y = padT + plotH - barH;
    const barColor = colors ? colors[i % colors.length] : colorVar;

    const hit = svgEl("rect", {
      x: cx - slot / 2, y: padT, width: slot, height: plotH, fill: "transparent",
    });

    const rect = svgEl("rect", {
      x: cx - barW / 2, y, width: barW, height: Math.max(barH, 1), rx: 4, ry: 4, fill: barColor,
    });

    hit.addEventListener("pointermove", (e) => {
      const r = wrap.getBoundingClientRect();
      tooltip.show(e.clientX - r.left, e.clientY - r.top, tooltipRow(labels[i], formatFull(v, format), barColor));
      rect.style.opacity = 0.85;
    });
    hit.addEventListener("pointerleave", () => { tooltip.hide(); rect.style.opacity = 1; });

    svg.appendChild(rect);

    if (valueLabels && barH > 14) {
      const lbl = svgEl("text", { class: "value-label", x: cx, y: y - 6, "text-anchor": "middle", "font-size": 11 });
      lbl.textContent = formatValue(v, format);
      svg.appendChild(lbl);
    }

    svg.appendChild(hit);

    const xl = svgEl("text", { x: cx, y: H - padB + 16, "text-anchor": "middle", "font-size": 10.5 });
    xl.textContent = labels[i];
    svg.appendChild(xl);
  });

  wrap.appendChild(svg);
  return wrap;
}

/* ---------------------------------------------------------- line chart */

function createLineChart({ labels, series, format = "number", height = 240, decimals = 1, yMax = null, expanded = false }) {
  const W = 600, H = height;
  const padL = 56, padR = 16, padT = 16, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const allValues = series.flatMap((s) => s.values).filter((v) => v != null);
  const { min: minVal, max: autoMax } = niceRange(Math.min(...allValues), Math.max(...allValues), format === "percent");
  const maxVal = yMax != null ? yMax : autoMax;
  const yTicks = 4;
  const n = labels.length;

  const xFor = (i) => padL + (n === 1 ? plotW / 2 : (plotW / (n - 1)) * i);
  const yFor = (v) => padT + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;

  const svg = svgEl("svg", { class: "chart-svg", viewBox: `0 0 ${W} ${H}`, role: "img" });

  for (let i = 0; i <= yTicks; i++) {
    const v = minVal + ((maxVal - minVal) / yTicks) * i;
    const y = yFor(v);
    svg.appendChild(svgEl("line", { class: "gridline", x1: padL, x2: W - padR, y1: y, y2: y }));
    const t = svgEl("text", { x: padL - 8, y: y + 4, "text-anchor": "end", "font-size": 10 });
    t.textContent = formatValue(v, format, decimals);
    svg.appendChild(t);
  }
  svg.appendChild(svgEl("line", { class: "axis-line", x1: padL, x2: W - padR, y1: padT + plotH, y2: padT + plotH }));

  labels.forEach((lab, i) => {
    const t = svgEl("text", { x: xFor(i), y: H - padB + 16, "text-anchor": "middle", "font-size": 10.5 });
    t.textContent = lab;
    svg.appendChild(t);
  });

  series.forEach((s) => {
    let d = "";
    s.values.forEach((v, i) => {
      if (v == null) return;
      d += `${d === "" ? "M" : "L"} ${xFor(i)} ${yFor(v)} `;
    });
    const pathAttrs = { d, fill: "none", stroke: s.color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" };
    if (s.dashed) pathAttrs["stroke-dasharray"] = "7 5";
    svg.appendChild(svgEl("path", pathAttrs));
    s.values.forEach((v, i) => {
      if (v == null) return;
      const cx = xFor(i), cy = yFor(v);
      svg.appendChild(svgEl("circle", { cx, cy, r: 4, fill: s.color, stroke: "var(--surface-1)", "stroke-width": 2 }));

      if (expanded) {
        const text = formatValue(v, format, decimals);
        const labelAbove = cy - padT > 16;
        const ly = labelAbove ? cy - 13 : cy + 17;
        const chipW = text.length * 6.2 + 10;
        svg.appendChild(svgEl("rect", { x: cx - chipW / 2, y: ly - 9, width: chipW, height: 15, rx: 7, ry: 7, fill: "#ffffff", "fill-opacity": 0.92 }));
        const lbl = svgEl("text", { x: cx, y: ly, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 10, "font-weight": 700, fill: "#0b0b0b" });
        lbl.textContent = text;
        svg.appendChild(lbl);
      }
    });
  });

  // crosshair
  const crosshair = svgEl("line", { class: "axis-line", x1: 0, x2: 0, y1: padT, y2: padT + plotH, stroke: "var(--baseline)", "stroke-dasharray": "3 3", opacity: 0 });
  svg.appendChild(crosshair);

  const wrap = el("div", { class: "chart-wrap" });
  const tooltip = makeTooltip(wrap);

  const hit = svgEl("rect", { x: padL, y: padT, width: plotW, height: plotH, fill: "transparent" });
  hit.addEventListener("pointermove", (e) => {
    const rectBounds = svg.getBoundingClientRect();
    const scale = W / rectBounds.width;
    const px = (e.clientX - rectBounds.left) * scale;
    let idx = Math.round((px - padL) / (n === 1 ? plotW : plotW / (n - 1)));
    idx = Math.max(0, Math.min(n - 1, idx));
    crosshair.setAttribute("x1", xFor(idx));
    crosshair.setAttribute("x2", xFor(idx));
    crosshair.setAttribute("opacity", 1);

    const wrapBounds = wrap.getBoundingClientRect();
    const box = el("div", {});
    box.appendChild(el("div", { style: "font-weight:600;margin-bottom:4px;" }, labels[idx]));
    series.forEach((s) => {
      if (s.values[idx] == null) return;
      box.appendChild(tooltipRow(s.name, formatFull(s.values[idx], format, decimals), s.color));
    });
    tooltip.show(e.clientX - wrapBounds.left, e.clientY - wrapBounds.top, box);
  });
  hit.addEventListener("pointerleave", () => { tooltip.hide(); crosshair.setAttribute("opacity", 0); });
  svg.appendChild(hit);

  wrap.appendChild(svg);

  if (series.length > 1) {
    const legend = el("div", { class: "legend" });
    series.forEach((s) => {
      const swatchClass = s.dashed ? "legend-swatch line dashed" : "legend-swatch line";
      const swatchStyle = s.dashed ? `--legend-dash-color:${s.color}` : `background:${s.color}`;
      legend.appendChild(el("span", { class: "legend-item" }, [
        el("span", { class: swatchClass, style: swatchStyle }),
        s.name,
      ]));
    });
    wrap.appendChild(legend);
  }

  return wrap;
}

/* -------------------------------------------------------------- table --*/

function createTable(columns, rows) {
  const table = el("table", { class: "kpi-table" });
  const thead = el("thead", {}, el("tr", {}, columns.map((c) => el("th", {}, c.label))));
  const tbody = el("tbody");
  rows.forEach((row) => {
    const tr = el("tr");
    columns.forEach((c) => {
      const raw = row[c.key];
      const content = c.render ? c.render(raw, row) : raw;
      const td = el("td", { class: c.numeric ? "num" : "" });

      if (c.history) {
        const valueRow = el("div", { class: "cell-value-row" });
        const valueSpan = el("span", {});
        if (content instanceof Node) valueSpan.appendChild(content);
        else valueSpan.textContent = content;
        const toggle = el("button", { class: "history-toggle", type: "button", "aria-label": "Show history" }, [
          el("span", { class: "chevron" }, "▾"),
        ]);
        valueRow.appendChild(valueSpan);
        valueRow.appendChild(toggle);
        td.appendChild(valueRow);

        const panel = el("div", { class: "history-panel" });
        if (row.history && row.history.length) {
          [...row.history].reverse().forEach((h) => {
            panel.appendChild(el("div", { class: "history-row" }, [
              el("span", { class: "period" }, h.label),
              el("span", { class: "val" }, c.render ? c.render(h.value, row) : h.value),
            ]));
          });
        } else {
          panel.appendChild(el("div", { class: "history-empty" }, "No history logged yet"));
        }
        toggle.addEventListener("click", () => {
          const open = panel.classList.toggle("open");
          toggle.classList.toggle("open", open);
        });
        td.appendChild(panel);
      } else if (content instanceof Node) {
        td.appendChild(content);
      } else {
        td.textContent = content;
      }

      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

/* ---------------------------------------------------------- goal meter -*/

function createGoalMeter(cfg, title, opts = {}) {
  // chartMax gives the tube some headroom above the goal (e.g. a clean $12M
  // ceiling on an $11.9M goal) — it only affects the tick scale and the fill
  // height. The displayed percentage is always % of the real annual goal.
  const chartMax = cfg.chartMax || cfg.annualGoal;
  const pct = Math.min(100, (cfg.ytdSales / cfg.annualGoal) * 100);
  const fillPct = Math.min(100, (cfg.ytdSales / chartMax) * 100);
  const stillNeeded = cfg.annualGoal - cfg.ytdSales;
  const weekDelta = cfg.lastWeekSales - cfg.weeklyTargetNeeded;
  const weekDeltaGood = weekDelta >= 0;

  const tickCount = 4;
  const ticks = [];
  for (let i = tickCount; i >= 0; i--) {
    ticks.push(el("div", {}, formatFull((chartMax / tickCount) * i, "currency")));
  }

  const tubeClass = opts.thermometer ? "meter-tube thermo-tube" : "meter-tube";

  const visual = el("div", { class: "meter-visual" }, [
    el("div", { class: "meter-ticks" }, ticks),
    el("div", { class: "meter-tube-wrap" }, [
      el("div", { class: tubeClass }, [
        el("div", { class: "meter-fill", style: `height:${fillPct}%` }),
      ]),
      opts.thermometer ? el("div", { class: "thermo-bulb" }) : null,
      el("div", { class: "meter-percent" }, `${pct.toFixed(1)}%`),
    ]),
  ]);

  const stats = el("div", { class: "meter-stats" }, [
    el("div", { class: "meter-stat-row" }, [
      el("div", { class: "k" }, "YTD Sales"),
      el("div", { class: "v" }, formatFull(cfg.ytdSales, "currency")),
    ]),
    el("div", { class: "meter-stat-row" }, [
      el("div", { class: "k" }, "Annual Goal"),
      el("div", { class: "v" }, formatFull(cfg.annualGoal, "currency")),
    ]),
    el("div", { class: "meter-stat-row" }, [
      el("div", { class: "k" }, "Still Needed"),
      el("div", { class: "v" }, formatFull(stillNeeded, "currency")),
    ]),
    el("div", { class: "meter-stat-row highlight-warn" }, [
      el("div", { class: "k" }, "Weekly Target Needed"),
      el("div", { class: "v" }, formatFull(cfg.weeklyTargetNeeded, "currency")),
      el("div", { class: "sub" }, `≈${cfg.weeksLeft} weeks left`),
    ]),
    el("div", { class: "meter-stat-row" }, [
      el("div", { class: "k" }, "Last Week's Sales"),
      el("div", { class: "v" }, formatFull(cfg.lastWeekSales, "currency")),
      el("div", { class: `sub delta ${weekDeltaGood ? "up" : "down"}` },
        `${weekDeltaGood ? "+" : "-"}${formatFull(Math.abs(weekDelta), "currency")} vs target`),
    ]),
  ]);

  const row = el("div", { class: "meter-row" }, [visual, stats]);
  const cardClass = `card meter-card${opts.hero ? " meter-hero" : ""}`;
  return el("div", { class: cardClass }, title ? [el("div", { class: "card-title meter-title" }, title), row] : [row]);
}

function createHeightComparison({ items, caption }) {
  const maxBarPx = 220;
  const tallestFt = Math.max(...items.map((it) => it.heightFt));

  const cols = items.map((it) => {
    const barPx = Math.max(18, Math.round((it.heightFt / tallestFt) * maxBarPx));
    const isBuilding = it.icon === "building";
    const barColor = it.color || "var(--text-muted)";

    const svg = svgEl("svg", { width: 56, height: maxBarPx + 4, viewBox: `0 0 56 ${maxBarPx + 4}`, style: "display:block;margin:0 auto;" });
    const barY = maxBarPx + 4 - barPx;

    if (isBuilding) {
      // simple stepped skyscraper silhouette, anchored to the baseline
      const w1 = 30, w2 = 20, w3 = 8;
      const stepH = barPx * 0.28;
      const x0 = 28 - w1 / 2, x1 = 28 - w2 / 2, x2 = 28 - w3 / 2;
      svg.appendChild(svgEl("rect", { x: x0, y: barY + stepH * 2, width: w1, height: barPx - stepH * 2, fill: barColor, rx: 1 }));
      svg.appendChild(svgEl("rect", { x: x1, y: barY + stepH, width: w2, height: stepH * 1.3, fill: barColor, rx: 1 }));
      svg.appendChild(svgEl("rect", { x: x2, y: barY, width: w3, height: stepH * 1.1, fill: barColor, rx: 1 }));
    } else {
      svg.appendChild(svgEl("rect", { x: 13, y: barY, width: 30, height: barPx, fill: barColor, rx: 5 }));
      const segments = Math.max(1, Math.round(barPx / 26));
      for (let s = 1; s < segments; s++) {
        svg.appendChild(svgEl("line", { x1: 13, x2: 43, y1: barY + (barPx / segments) * s, y2: barY + (barPx / segments) * s, stroke: "var(--surface-1)", "stroke-width": 2 }));
      }
    }

    return el("div", { class: "height-compare-col" }, [
      svg,
      el("div", { class: "height-compare-label" }, it.label),
      el("div", { class: "height-compare-value" }, it.height),
    ]);
  });

  return el("div", { class: "height-compare" }, [
    el("div", { class: "height-compare-row" }, cols),
    caption ? el("div", { class: "height-compare-caption" }, caption) : null,
  ]);
}

function createFunFactCard(cfg) {
  const text = typeof cfg === "string" ? cfg : cfg.text;
  const visual = typeof cfg === "object" && cfg.visual ? createHeightComparison(cfg.visual) : null;
  return el("div", { class: "card fun-fact-card" }, [
    el("div", { class: "fun-fact-label" }, "🎉 Fun Fact of the Week"),
    el("div", { class: "fun-fact-body" }, text),
    visual,
  ]);
}

/* ------------------------------------------------------ expand / modal */

let modalRefs = null;

function ensureModal() {
  if (modalRefs) return modalRefs;
  const title = el("div", { class: "modal-title" });
  const closeBtn = el("button", { class: "modal-close-btn", "aria-label": "Close" }, "×");
  const body = el("div", { class: "modal-body" });
  const panel = el("div", { class: "modal-panel" }, [
    el("div", { class: "modal-title-row" }, [title, closeBtn]),
    body,
  ]);
  const overlay = el("div", { class: "modal-overlay" }, [panel]);
  document.body.appendChild(overlay);

  const close = () => overlay.classList.remove("open");
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  modalRefs = { overlay, title, body };
  return modalRefs;
}

function openChartModal(titleText, buildFn) {
  const { overlay, title, body } = ensureModal();
  title.textContent = titleText;
  body.innerHTML = "";
  body.appendChild(buildFn());
  overlay.classList.add("open");
}

function createExpandButton(titleText, buildFn) {
  const btn = el("button", { class: "expand-btn", "aria-label": `Expand ${titleText}`, title: "Expand" }, [
    (() => {
      const svg = svgEl("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" });
      svg.appendChild(svgEl("polyline", { points: "9 3 3 3 3 9" }));
      svg.appendChild(svgEl("polyline", { points: "15 3 21 3 21 9" }));
      svg.appendChild(svgEl("polyline", { points: "9 21 3 21 3 15" }));
      svg.appendChild(svgEl("polyline", { points: "15 21 21 21 21 15" }));
      return svg;
    })(),
  ]);
  btn.addEventListener("click", () => openChartModal(titleText, buildFn));
  return btn;
}

// Wraps a chart in a card with a title + expand button. `smallNode` renders in
// the card; `expandFactory` (called fresh each click) renders the modal's
// bigger version — usually the same builder called with expanded:true.
function chartCard(titleText, smallNode, expandFactory, extraClass = "") {
  const titleRow = el("div", { class: "card-title-row" }, [
    el("div", { class: "card-title" }, titleText),
    expandFactory ? createExpandButton(titleText, expandFactory) : null,
  ]);
  return el("div", { class: `card ${extraClass}`.trim() }, [titleRow, smallNode]);
}
