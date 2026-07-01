/* JectarOne Assessment Report Builder — client-side only. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = "jo_report_draft_v1";
  var IDX = { Low: 0, Medium: 1, High: 2 };
  var SEV_COLORS = {
    Critical: [239, 68, 68], High: [245, 158, 11], Medium: [234, 179, 8],
    Low: [34, 197, 94], Info: [56, 189, 248]
  };
  var SEV_ORDER = ["Critical", "High", "Medium", "Low", "Info"];

  var findingsEl = $("#findings");
  var tpl = $("#tpl-finding");

  // Preload brand images for the PDF (CSP: same-origin).
  var LOGO = { avatar: new Image(), mark: new Image() };
  LOGO.avatar.src = "../assets/logo-avatar-400.png";
  LOGO.mark.src = "../assets/logo-mark-512.png";
  function imgReady(im) { return im && im.complete && im.naturalWidth > 0; }

  /* ---------- Findings ---------- */
  function addFinding(data) {
    var node = tpl.content.firstElementChild.cloneNode(true);
    if (data) {
      $(".f-title", node).value = data.title || "";
      $(".f-sev", node).value = data.severity || "Medium";
      $(".f-like", node).value = data.likelihood || "Medium";
      $(".f-imp", node).value = data.impact || "Medium";
      $(".f-desc", node).value = data.description || "";
      $(".f-rec", node).value = data.recommendation || "";
    }
    $(".f-del", node).addEventListener("click", function () {
      node.remove(); refresh(); save();
    });
    findingsEl.appendChild(node);
    if (window.lucide) window.lucide.createIcons();
  }

  function readFindings() {
    return $$(".finding", findingsEl).map(function (n) {
      return {
        title: $(".f-title", n).value.trim(),
        severity: $(".f-sev", n).value,
        likelihood: $(".f-like", n).value,
        impact: $(".f-imp", n).value,
        description: $(".f-desc", n).value.trim(),
        recommendation: $(".f-rec", n).value.trim()
      };
    });
  }

  function readState() {
    return {
      client: $("#f-client").value.trim(),
      type: $("#f-type").value,
      date: $("#f-date").value.trim(),
      ref: $("#f-ref").value.trim(),
      assessor: $("#f-assessor").value.trim(),
      scope: $("#f-scope").value.trim(),
      summary: $("#f-summary").value.trim(),
      findings: readFindings()
    };
  }

  function writeState(s) {
    $("#f-client").value = s.client || "";
    $("#f-type").value = s.type || "Security Assessment";
    $("#f-date").value = s.date || "";
    $("#f-ref").value = s.ref || "";
    $("#f-assessor").value = s.assessor || "";
    $("#f-scope").value = s.scope || "";
    $("#f-summary").value = s.summary || "";
    findingsEl.innerHTML = "";
    (s.findings || []).forEach(addFinding);
    refresh();
  }

  /* ---------- Persistence ---------- */
  var saveT;
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(readState())); } catch (e) {}
    }, 300);
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { writeState(JSON.parse(raw)); return true; }
    } catch (e) {}
    return false;
  }

  /* ---------- Risk matrix zone ---------- */
  function zone(impact, like) {
    var i = IDX[impact], l = IDX[like];
    var table = [
      ["low", "low", "med"],   // impact Low
      ["low", "med", "high"],  // impact Medium
      ["med", "high", "crit"]  // impact High
    ];
    return table[i][l];
  }
  var ZONE_CLASS = { low: "z-low", med: "z-med", high: "z-high", crit: "z-crit" };

  /* ---------- Live preview ---------- */
  function refresh() {
    var f = readFindings();
    $("#find-count").textContent = f.length;
    $("#find-empty").style.display = f.length ? "none" : "";

    // matrix counts
    var counts = {};
    f.forEach(function (x) {
      var k = x.impact + "|" + x.likelihood;
      counts[k] = (counts[k] || 0) + 1;
    });

    var rmx = $("#rmx");
    rmx.innerHTML = "";
    var impacts = ["High", "Medium", "Low"]; // top to bottom
    var likes = ["Low", "Medium", "High"];   // left to right
    impacts.forEach(function (imp) {
      var ax = document.createElement("div");
      ax.className = "axis axis-y";
      ax.textContent = imp;
      rmx.appendChild(ax);
      likes.forEach(function (lk) {
        var c = document.createElement("div");
        var n = counts[imp + "|" + lk] || 0;
        c.className = "cell " + (n ? ZONE_CLASS[zone(imp, lk)] : "empty");
        c.textContent = n ? n : "";
        c.title = "Impact " + imp + " · Likelihood " + lk + " — " + n + " finding(s)";
        rmx.appendChild(c);
      });
    });
    // bottom axis row
    rmx.appendChild(el("div", "axis corner", ""));
    likes.forEach(function (lk) { rmx.appendChild(el("div", "axis", lk)); });

    // severity summary
    var sev = {}; SEV_ORDER.forEach(function (s) { sev[s] = 0; });
    f.forEach(function (x) { if (sev[x.severity] != null) sev[x.severity]++; });
    var max = Math.max(1, Math.max.apply(null, SEV_ORDER.map(function (s) { return sev[s]; })));
    var box = $("#sev-summary"); box.innerHTML = "";
    SEV_ORDER.forEach(function (s) {
      var row = document.createElement("div");
      row.className = "sev-row";
      row.innerHTML = '<span class="sev-dot sev-' + s + '"></span>' +
        '<span class="sev-bar"><span style="width:' + (sev[s] / max * 100) + '%;background:rgb(' + SEV_COLORS[s].join(",") + ')"></span></span>' +
        '<span>' + s + " · " + sev[s] + "</span>";
      box.appendChild(row);
    });
  }
  function el(tag, cls, txt) { var e = document.createElement(tag); e.className = cls; e.textContent = txt; return e; }

  /* ---------- Toast ---------- */
  function toast(msg) {
    var t = $(".toast") || (function () { var d = document.createElement("div"); d.className = "toast"; document.body.appendChild(d); return d; })();
    t.textContent = msg; t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 1900);
  }

  /* ---------- PDF ---------- */
  function drawShield(doc, cx, cy, s) {
    // simple shield badge: primary rounded-ish + white check
    doc.setFillColor(37, 99, 235);
    doc.triangle(cx - s * 0.5, cy - s * 0.55, cx + s * 0.5, cy - s * 0.55, cx, cy + s * 0.6, "F");
    doc.setFillColor(37, 99, 235);
    doc.rect(cx - s * 0.5, cy - s * 0.55, s, s * 0.5, "F");
    // check
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(s * 0.09);
    doc.setLineCap("round"); doc.setLineJoin("round");
    doc.line(cx - s * 0.22, cy - s * 0.02, cx - s * 0.05, cy + s * 0.15);
    doc.line(cx - s * 0.05, cy + s * 0.15, cx + s * 0.26, cy - s * 0.22);
  }

  function generatePDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) { toast("PDF library not loaded."); return; }
    var s = readState();
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: "pt", format: "a4" });
    var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    var M = 48;

    /* Cover */
    doc.setFillColor(8, 17, 31); doc.rect(0, 0, W, H, "F");
    doc.setDrawColor(56, 189, 248); doc.setLineWidth(2);
    doc.line(M, 120, M + 90, 120);
    if (imgReady(LOGO.avatar)) doc.addImage(LOGO.avatar, "PNG", W / 2 - 46, 200, 92, 92);
    else drawShield(doc, W / 2, 250, 90);
    doc.setTextColor(248, 250, 252);
    doc.setFont("helvetica", "bold"); doc.setFontSize(30);
    doc.text("JectarOne", W / 2, 360, { align: "center" });
    doc.setTextColor(56, 189, 248); doc.setFontSize(11);
    doc.text("C Y B E R S E C U R I T Y   C O N S U L T I N G", W / 2, 380, { align: "center" });

    // classification pill
    doc.setFillColor(37, 99, 235); doc.roundedRect(W / 2 - 52, 414, 104, 22, 11, 11, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.text("CONFIDENTIAL", W / 2, 429, { align: "center" });

    doc.setTextColor(248, 250, 252); doc.setFontSize(22);
    doc.text((s.type || "Security Assessment") + " Report", W / 2, 476, { align: "center" });
    doc.setTextColor && doc.setTextColor(148, 163, 184); doc.setFontSize(13); doc.setFont("helvetica", "normal");
    doc.text("Prepared for: " + (s.client || "—"), W / 2, 490, { align: "center" });

    var meta = [];
    if (s.ref) meta.push("Reference: " + s.ref);
    if (s.date) meta.push("Date: " + s.date);
    if (s.assessor) meta.push("Assessor: " + s.assessor);
    if (s.scope) meta.push("Scope: " + s.scope);
    doc.setFontSize(11); doc.setTextColor(148, 163, 184);
    doc.text(meta, W / 2, 530, { align: "center", lineHeightFactor: 1.6 });

    doc.setDrawColor(30, 41, 59); doc.line(M, H - 90, W - M, H - 90);
    doc.setTextColor(148, 163, 184); doc.setFontSize(10);
    doc.text("contact@jectar.one   |   +212 752-138075   |   jectar.one", W / 2, H - 66, { align: "center" });
    doc.setTextColor(120, 130, 150); doc.setFontSize(8.5);
    doc.text("CONFIDENTIAL — This report is intended solely for " + (s.client || "the client") + ".", W / 2, H - 48, { align: "center" });

    /* Content pages */
    var y = 0;
    function chrome() {
      doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.7);
      doc.line(M, 56, W - M, 56);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(15, 23, 42);
      doc.text("JectarOne", M, 48);
      doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139); doc.setFontSize(8);
      doc.text((s.type || "Report") + (s.ref ? " · " + s.ref : ""), W - M, 48, { align: "right" });
      doc.line(M, H - 44, W - M, H - 44);
      doc.setTextColor(100, 116, 139); doc.setFontSize(8);
      doc.text("contact@jectar.one · +212 752-138075 · CONFIDENTIAL", M, H - 30);
      doc.text("Page " + doc.internal.getNumberOfPages(), W - M, H - 30, { align: "right" });
    }
    function newContentPage() { doc.addPage(); chrome(); y = 84; }
    function need(h) { if (y + h > H - 60) newContentPage(); }
    function heading(t) { need(40); doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.setTextColor(37, 99, 235); doc.text(t, M, y); y += 20; }
    function para(t, size) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(size || 10.5); doc.setTextColor(30, 41, 59);
      var lines = doc.splitTextToSize(t, W - 2 * M);
      lines.forEach(function (ln) { need(16); doc.text(ln, M, y); y += 15; });
    }

    newContentPage();
    heading("Executive Summary");
    para(s.summary || "No executive summary provided.");
    y += 8;

    // Risk matrix (drawn)
    heading("Risk Matrix");
    var counts = {};
    s.findings.forEach(function (x) { var k = x.impact + "|" + x.likelihood; counts[k] = (counts[k] || 0) + 1; });
    var impacts = ["High", "Medium", "Low"], likes = ["Low", "Medium", "High"];
    var Z = { low: [34, 197, 94], med: [234, 179, 8], high: [245, 158, 11], crit: [239, 68, 68] };
    var cell = 74, gx = M + 60, gy = y + 6;
    need(cell * 3 + 40);
    gy = y + 6;
    doc.setFontSize(9);
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        var imp = impacts[r], lk = likes[c];
        var n = counts[imp + "|" + lk] || 0;
        var zc = zone(imp, lk); var col = n ? Z[zc] : [237, 240, 245];
        var x = gx + c * cell, yy = gy + r * cell;
        doc.setFillColor(col[0], col[1], col[2]);
        doc.roundedRect(x, yy, cell - 6, cell - 6, 5, 5, "F");
        if (n) {
          doc.setTextColor(zc === "crit" ? 255 : 4, zc === "crit" ? 255 : 18, zc === "crit" ? 255 : 31);
          doc.setFont("helvetica", "bold"); doc.setFontSize(16);
          doc.text(String(n), x + (cell - 6) / 2, yy + (cell - 6) / 2 + 5, { align: "center" });
        }
      }
      // y axis labels (impact)
      doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
      doc.text(impacts[r], gx - 8, gy + r * cell + (cell - 6) / 2, { align: "right" });
    }
    // x axis labels (likelihood)
    for (var c2 = 0; c2 < 3; c2++) {
      doc.text(likes[c2], gx + c2 * cell + (cell - 6) / 2, gy + 3 * cell + 4, { align: "center" });
    }
    doc.setTextColor(100, 116, 139); doc.setFontSize(8);
    doc.text("Impact  ↑   /   Likelihood  →", gx, gy + 3 * cell + 20);
    y = gy + 3 * cell + 36;

    // Findings summary table
    if (s.findings.length && doc.autoTable) {
      heading("Findings Overview");
      doc.autoTable({
        startY: y,
        margin: { left: M, right: M },
        head: [["#", "Finding", "Severity", "Likelihood", "Impact"]],
        body: s.findings.map(function (f, i) {
          return [i + 1, f.title || "(untitled)", f.severity, f.likelihood, f.impact];
        }),
        styles: { fontSize: 9, cellPadding: 5, textColor: [30, 41, 59] },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        columnStyles: { 0: { cellWidth: 24 }, 2: { cellWidth: 64 }, 3: { cellWidth: 70 }, 4: { cellWidth: 60 } },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 2) {
            var col = SEV_COLORS[data.cell.raw]; if (col) { data.cell.styles.textColor = col; data.cell.styles.fontStyle = "bold"; }
          }
        }
      });
      y = doc.lastAutoTable.finalY + 24;
    }

    // Detailed findings
    if (s.findings.length) {
      heading("Detailed Findings");
      s.findings.forEach(function (f, i) {
        need(70);
        doc.setFont("helvetica", "bold"); doc.setFontSize(11.5); doc.setTextColor(15, 23, 42);
        var title = (i + 1) + ". " + (f.title || "(untitled)");
        doc.splitTextToSize(title, W - 2 * M - 90).forEach(function (ln) { need(16); doc.text(ln, M, y); y += 15; });
        // severity chip
        var col = SEV_COLORS[f.severity] || [100, 116, 139];
        doc.setFillColor(col[0], col[1], col[2]);
        doc.roundedRect(W - M - 78, y - 27, 78, 16, 4, 4, "F");
        doc.setTextColor(f.severity === "Medium" ? 30 : 255, f.severity === "Medium" ? 30 : 255, f.severity === "Medium" ? 30 : 255);
        doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text(f.severity + "  " + f.likelihood + "/" + f.impact, W - M - 39, y - 16, { align: "center" });
        y += 2;
        if (f.description) { doc.setTextColor(71, 85, 105); doc.setFont("helvetica", "italic"); doc.setFontSize(9);
          doc.splitTextToSize("Finding: " + f.description, W - 2 * M).forEach(function (ln) { need(14); doc.text(ln, M, y); y += 13; }); }
        if (f.recommendation) { doc.setTextColor(30, 41, 59); doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
          doc.splitTextToSize("Recommendation: " + f.recommendation, W - 2 * M).forEach(function (ln) { need(14); doc.text(ln, M, y); y += 13; }); }
        y += 12;
      });
    }

    var fname = "JectarOne-Report-" + (s.ref || s.client || "draft").replace(/[^a-z0-9\-]+/gi, "-") + ".pdf";
    doc.save(fname);
    toast("PDF generated");
  }

  /* ---------- Save/Load JSON ---------- */
  function saveJSON() {
    var s = readState();
    var blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jo-report-" + (s.ref || s.client || "draft").replace(/[^a-z0-9\-]+/gi, "-") + ".json";
    a.click(); URL.revokeObjectURL(a.href);
    toast("Draft saved to file");
  }
  function loadJSON(file) {
    var fr = new FileReader();
    fr.onload = function () {
      try { writeState(JSON.parse(fr.result)); save(); toast("Draft loaded"); }
      catch (e) { toast("Invalid file"); }
    };
    fr.readAsText(file);
  }

  /* ---------- Wire up ---------- */
  $("#btn-add").addEventListener("click", function () { addFinding(); refresh(); save(); });
  $("#btn-pdf").addEventListener("click", generatePDF);
  $("#btn-pdf2").addEventListener("click", generatePDF);
  $("#btn-save").addEventListener("click", saveJSON);
  $("#btn-load").addEventListener("click", function () { $("#file-load").click(); });
  $("#file-load").addEventListener("change", function (e) { if (e.target.files[0]) loadJSON(e.target.files[0]); e.target.value = ""; });
  $("#btn-clear").addEventListener("click", function () {
    if (confirm("Clear all fields and findings?")) { localStorage.removeItem(KEY); writeState({}); toast("Cleared"); }
  });
  document.addEventListener("input", function (e) { if (e.target.closest("#main")) { refresh(); save(); } });

  // init
  if (!load()) {
    var d = new Date();
    $("#f-date").value = d.getDate() + " " + ["January","February","March","April","May","June","July","August","September","October","November","December"][d.getMonth()] + " " + d.getFullYear();
    addFinding(); refresh();
  }
})();
