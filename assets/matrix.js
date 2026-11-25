(function () {
  const NS = "http://www.w3.org/2000/svg";

  function el(name, attrs) {
    const node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function text(node, value, attrs) {
    const t = el("text", attrs || {});
    t.textContent = value;
    node.appendChild(t);
    return t;
  }

  const samples = [
    { name: "Community college instructor", need: 24, benefit: 12, support: 12, color: "#ff6b6b" },
    { name: "ML student with advisor/server", need: 9, benefit: 8, support: 4, color: "#7c5cff" },
    { name: "Nonprofit lead", need: 22, benefit: 13, support: 10, color: "#ffb020" },
    { name: "County analyst", need: 14, benefit: 12, support: 6, color: "#22d3ee" },
  ];

  const bandColors = {
    priority: "#ff6b6b",
    support: "#ffb020",
    signpost: "#2dd4bf",
    info: "#4f8cff",
  };

  function render(svg, data) {
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const W = 820;
    const H = 560;
    const m = { left: 74, right: 36, top: 54, bottom: 70 };
    const pw = W - m.left - m.right;
    const ph = H - m.top - m.bottom;
    const xMid = m.left + pw / 2;
    const yMid = m.top + ph / 2;

    const defs = el("defs");
    svg.appendChild(defs);

    const gradients = [
      ["gPriority", "#ff6b6b", "#7c5cff"],
      ["gStandard", "#7c5cff", "#4f8cff"],
      ["gSupport", "#ffb020", "#ff6b6b"],
      ["gSignpost", "#2dd4bf", "#22d3ee"],
    ];
    gradients.forEach(function (g) {
      const lg = el("linearGradient", { id: g[0], x1: "0", y1: "0", x2: "1", y2: "1" });
      lg.appendChild(el("stop", { offset: "0%", "stop-color": g[1], "stop-opacity": "0.22" }));
      lg.appendChild(el("stop", { offset: "100%", "stop-color": g[2], "stop-opacity": "0.08" }));
      defs.appendChild(lg);
    });

    const glow = el("filter", { id: "glow", x: "-60%", y: "-60%", width: "220%", height: "220%" });
    const blur = el("feGaussianBlur", { stdDeviation: "5", result: "b" });
    const merge = el("feMerge");
    merge.appendChild(el("feMergeNode", { in: "b" }));
    merge.appendChild(el("feMergeNode", { in: "SourceGraphic" }));
    glow.appendChild(blur);
    glow.appendChild(merge);
    defs.appendChild(glow);

    // Quadrant backgrounds
    svg.appendChild(el("rect", {
      x: m.left, y: m.top, width: pw / 2, height: ph / 2,
      fill: "url(#gStandard)", rx: 10,
    }));
    svg.appendChild(el("rect", {
      x: xMid, y: m.top, width: pw / 2, height: ph / 2,
      fill: "url(#gPriority)", rx: 10,
    }));
    svg.appendChild(el("rect", {
      x: m.left, y: yMid, width: pw / 2, height: ph / 2,
      fill: "url(#gSignpost)", rx: 10,
    }));
    svg.appendChild(el("rect", {
      x: xMid, y: yMid, width: pw / 2, height: ph / 2,
      fill: "url(#gSupport)", rx: 10,
    }));

    // Grid
    for (let i = 0; i <= 3; i += 1) {
      const x = m.left + (pw / 3) * i;
      svg.appendChild(el("line", {
        x1: x, y1: m.top, x2: x, y2: m.top + ph,
        stroke: "rgba(180,200,255,0.10)", "stroke-width": 1,
        "stroke-dasharray": i === 0 || i === 3 ? "0" : "3 7",
      }));
    }
    for (let i = 0; i <= 3; i += 1) {
      const y = m.top + (ph / 3) * i;
      svg.appendChild(el("line", {
        x1: m.left, y1: y, x2: m.left + pw, y2: y,
        stroke: "rgba(180,200,255,0.10)", "stroke-width": 1,
        "stroke-dasharray": i === 0 || i === 3 ? "0" : "3 7",
      }));
    }

    // Midlines
    svg.appendChild(el("line", {
      x1: xMid, y1: m.top, x2: xMid, y2: m.top + ph,
      stroke: "rgba(220,230,255,0.28)", "stroke-width": 1.2,
    }));
    svg.appendChild(el("line", {
      x1: m.left, y1: yMid, x2: m.left + pw, y2: yMid,
      stroke: "rgba(220,230,255,0.28)", "stroke-width": 1.2,
    }));

    // Axis labels
    text(svg, "PUBLIC BENEFIT", {
      x: 20, y: m.top + ph / 2, fill: "#9aa7c7", "font-size": "10",
      "letter-spacing": "1.8", transform: "rotate(-90 20 " + (m.top + ph / 2) + ")",
      "text-anchor": "middle",
    });
    text(svg, "NEED", {
      x: m.left + pw / 2, y: H - 18, fill: "#9aa7c7", "font-size": "10",
      "letter-spacing": "1.8", "text-anchor": "middle",
    });
    text(svg, "Low", { x: m.left, y: H - 44, fill: "#6f7da0", "font-size": "9", "text-anchor": "middle" });
    text(svg, "High", { x: m.left + pw, y: H - 44, fill: "#6f7da0", "font-size": "9", "text-anchor": "middle" });
    text(svg, "Low", { x: 42, y: m.top + ph, fill: "#6f7da0", "font-size": "9", "text-anchor": "middle" });
    text(svg, "High", { x: 42, y: m.top + 8, fill: "#6f7da0", "font-size": "9", "text-anchor": "middle" });

    // Quadrant labels
    const labels = [
      ["Standard / partner", m.left + 18, m.top + 26, "#b9c7ff"],
      ["Priority review", xMid + 18, m.top + 26, "#ffd6d6"],
      ["Not priority", m.left + 18, yMid + 28, "#c9f7ef"],
      ["Support + signpost", xMid + 18, yMid + 28, "#ffe7b8"],
    ];
    labels.forEach(function (l) {
      text(svg, l[0], {
        x: l[1], y: l[2], fill: l[3], "font-size": "11", "font-weight": 600,
        "letter-spacing": "0.2",
      });
    });

    function px(need) { return m.left + (Math.max(0, Math.min(30, need)) / 30) * pw; }
    function py(benefit) { return m.top + ph - (Math.max(0, Math.min(15, benefit)) / 15) * ph; }

    // Sample personas
    samples.forEach(function (s, i) {
      const cx = px(s.need);
      const cy = py(s.benefit);
      const r = 6 + s.support * 0.35;
      const g = el("g", { opacity: "0.9" });
      g.appendChild(el("circle", {
        cx: cx, cy: cy, r: r,
        fill: s.color, "fill-opacity": "0.10",
        stroke: s.color, "stroke-opacity": "0.55", "stroke-width": "1",
      }));
      g.appendChild(el("circle", {
        cx: cx, cy: cy, r: 3.2,
        fill: s.color, "fill-opacity": "0.9",
      }));
      let lx = cx + r + 8;
      let ly = cy + 3.5;
      let anchor = "start";
      if (s.name === "Nonprofit lead") {
        lx = cx - r - 8;
        ly = cy - 4;
        anchor = "end";
      } else if (s.name === "Community college instructor") {
        ly = cy + 13;
      }
      const t = text(g, s.name, {
        x: lx, y: ly,
        fill: "rgba(220,230,255,0.62)", "font-size": "8.5",
        "text-anchor": anchor,
      });
      const title = el("title");
      title.textContent = s.name + " · need " + s.need + "/30 · benefit " + s.benefit + "/15 · support " + s.support + "/15";
      g.appendChild(title);
      svg.appendChild(g);
    });

    // User dot
    if (data) {
      const cx = px(data.need);
      const cy = py(data.benefit);
      const color = bandColors[data.band] || "#7c5cff";
      const r = 8 + data.support * 0.55;

      const pulse = el("circle", {
        cx: cx, cy: cy, r: r,
        fill: color, "fill-opacity": "0.35",
        class: "pulse",
      });
      svg.appendChild(pulse);

      const halo = el("circle", {
        cx: cx, cy: cy, r: r + 7,
        fill: "none", stroke: color, "stroke-opacity": "0.45",
        "stroke-width": "1.2", "stroke-dasharray": "2 4",
      });
      svg.appendChild(halo);

      const dot = el("circle", {
        cx: cx, cy: cy, r: r,
        fill: color, "fill-opacity": "0.92",
        stroke: "#0b1020", "stroke-width": "2",
        filter: "url(#glow)",
      });
      const title = el("title");
      title.textContent = "You · need " + data.need + "/30 · benefit " + data.benefit + "/15 · support " + data.support + "/15";
      dot.appendChild(title);
      svg.appendChild(dot);

      const label = text(svg, "You", {
        x: cx, y: cy - r - 10,
        fill: "#ffffff", "font-size": "11", "font-weight": 700,
        "text-anchor": "middle",
      });
      label.setAttribute("paint-order", "stroke");
      label.setAttribute("stroke", "#0b1020");
      label.setAttribute("stroke-width", "4");
      label.setAttribute("stroke-linejoin", "round");
    }
  }

  window.renderAccessMatrix = render;
})();
